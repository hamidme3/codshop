import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Valid Moroccan cities for geo whitelisting (covers >70% e-commerce volume)
const VALID_MOROCCAN_CITIES = new Set([
  'Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir',
  'Meknes', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'El Jadida',
  'Béni Mellal', 'Nador', 'Settat', 'Larache', 'Khouribga', 'Guelmim'
]);

function normalizeCity(city: string | null): string | null {
  if (!city) return null;
  const trimmed = city.trim();
  if (VALID_MOROCCAN_CITIES.has(trimmed)) return trimmed;
  return null;
}

function getCityFromHeaders(request: NextRequest): string | null {
  // Priority: Cloudflare > Vercel > standard proxy headers
  const cfCity = request.headers.get('cf-ipcity');
  const vercelCity = request.headers.get('x-vercel-ip-city');
  const standardCity = request.headers.get('x-forwarded-city');
  const country = request.headers.get('cf-ipcountry') || request.headers.get('x-vercel-ip-country');
  
  // Only accept city if country is MA (Morocco) or unknown (local dev)
  if (country && country !== 'MA' && country !== 'unknown') {
    return null; // Foreign IP — don't trust city
  }
  
  const rawCity = cfCity || vercelCity || standardCity;
  return normalizeCity(rawCity);
}

function getCountryFromHeaders(request: NextRequest): string {
  // 1. Explicit query parameter override (?country=SA)
  const queryCountry = request.nextUrl.searchParams.get('country') || request.nextUrl.searchParams.get('geo_country');
  if (queryCountry && queryCountry.length === 2) return queryCountry.trim().toUpperCase();

  // 2. Explicit visitor cookie (saved when user chooses a country in the checkout modal)
  const cookieCountry = request.cookies.get('cod_visitor_country')?.value;
  if (cookieCountry && cookieCountry.length === 2) {
    return cookieCountry.trim().toUpperCase();
  }

  // 3. Edge headers (Cloudflare, Vercel, Custom CDN)
  const cfCountry = request.headers.get('cf-ipcountry');
  const vercelCountry = request.headers.get('x-vercel-ip-country');
  const customCountry = request.headers.get('x-country-code') || request.headers.get('x-geo-country');

  if (cfCountry && cfCountry !== 'XX' && cfCountry !== 'T1' && cfCountry.length === 2) {
    return cfCountry.trim().toUpperCase();
  }
  if (vercelCountry && vercelCountry.length === 2) {
    return vercelCountry.trim().toUpperCase();
  }
  if (customCountry && customCountry.length === 2) {
    return customCountry.trim().toUpperCase();
  }

  return 'MA';
}

function getAbVariantCookie(request: NextRequest): { variant: 'control' | 'waybill'; anonId?: string } {
  const existing = request.cookies.get('cod_ab_variant')?.value;
  if (existing === 'control' || existing === 'waybill') return { variant: existing };
  
  // Deterministic 50/50 bucket: use session or persistent client anon ID (avoids CGNAT IP collision)
  const sessionVal = request.cookies.get('codshop_session')?.value;
  let anonId = request.cookies.get('cod_anon_id')?.value;
  let isNewAnon = false;

  if (!sessionVal && !anonId) {
    anonId = 'anon_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    isNewAnon = true;
  }

  const seed = sessionVal || anonId || 'seed';
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variant = hash % 2 === 0 ? 'control' : 'waybill';
  return { variant, anonId: isNewAnon ? anonId : undefined };
}

function setAbVariantCookie(response: NextResponse, variant: 'control' | 'waybill', anonId?: string) {
  response.cookies.set({
    name: 'cod_ab_variant',
    value: variant,
    httpOnly: false, // Accessible to client-side JS for A/B variant tracking & analytics
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  if (anonId) {
    response.cookies.set({
      name: 'cod_anon_id',
      value: anonId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1 year persistent anon client seed
    });
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || 'codshop.vipone.site';
  
  // --- Testing overrides (dev/staging only) ---
  const overrideCity = url.searchParams.get('geo_city') || request.headers.get('x-override-city');
  const overrideVariant = url.searchParams.get('ab_variant');
  if (overrideCity) url.searchParams.set('geo_city', overrideCity); // persist for client
  if (overrideVariant) url.searchParams.set('ab_variant', overrideVariant);
  
  // Extract clean domain (strip port if present)
  const currentHost = hostname.split(':')[0].toLowerCase();
  const rootDomain = process.env.NEXT_PUBLIC_WILDCARD_DOMAIN || 'codshop.vipone.site';

  // Paths that should bypass subdomain rewriting
  const isApi = url.pathname.startsWith('/api');
  const isStatic = url.pathname.startsWith('/_next') || 
                   url.pathname.includes('.') || 
                   url.pathname.startsWith('/favicon');

  if (isStatic) {
    return NextResponse.next();
  }

  // --- Geo + A/B Detection (before subdomain logic) ---
  const detectedCountry = getCountryFromHeaders(request);
  const detectedCity = overrideCity || getCityFromHeaders(request);
  const abInfo = getAbVariantCookie(request);
  const abVariant = (overrideVariant as 'control' | 'waybill') || abInfo.variant;
  const anonId = abInfo.anonId;
  const finalCity = detectedCity || 'Casablanca'; // default hub
  
  // Clone headers to pass tenant, geo, and A/B information downstream
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-geo-country', detectedCountry);
  if (detectedCity) requestHeaders.set('x-geo-city', detectedCity);
  requestHeaders.set('x-geo-city-final', finalCity);
  requestHeaders.set('x-ab-variant', abVariant);

  // Admin Route Protection
  if (url.pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('codshop_session')?.value;
    let isValidSession = false;
    let sessionUser: any = null;

    if (sessionCookie) {
      try {
        const { jwtVerify } = await import('jose');
        const secret = new TextEncoder().encode(
          process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET not configured'); })()
        );
        const { payload } = await jwtVerify(sessionCookie, secret);
        isValidSession = true;
        sessionUser = payload;
      } catch {
        isValidSession = false;
      }
    }

    if (url.pathname === '/admin/login') {
      // If already logged in, redirect directly to admin overview
      if (isValidSession) {
        const targetStore = sessionUser?.storeSlug || 'ottavio';
        const redirectRes = NextResponse.redirect(new URL(`/admin?store=${targetStore}`, request.url));
        redirectRes.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
        return redirectRes;
      }
    } else {
      // Protected admin routes: redirect unauthenticated users to login
      if (!isValidSession) {
        const returnUrl = encodeURIComponent(url.pathname + url.search);
        const loginUrl = new URL(`/admin/login?returnUrl=${returnUrl}`, request.url);
        const redirectRes = NextResponse.redirect(loginUrl);
        redirectRes.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
        return redirectRes;
      }

      // Valid session: attach authenticated user context to headers
      if (sessionUser) {
        requestHeaders.set('x-user-id', String(sessionUser.userId || ''));
        requestHeaders.set('x-user-email', String(sessionUser.email || ''));
        requestHeaders.set('x-user-store-slug', String(sessionUser.storeSlug || ''));
      }
    }
  }

  // Detect Subdomain
  let subdomain: string | null = null;

  if (currentHost.endsWith(rootDomain) && currentHost !== rootDomain && currentHost !== `www.${rootDomain}`) {
    subdomain = currentHost.replace(`.${rootDomain}`, '');
  } else if (currentHost.endsWith('localhost') && currentHost !== 'localhost') {
    subdomain = currentHost.replace('.localhost', '');
  }

  // Enrich headers if subdomain present

  if (subdomain) {
    requestHeaders.set('x-store-slug', subdomain);
    requestHeaders.set('x-tenant-type', 'subdomain');

    // If accessing root "/" under a merchant subdomain (e.g. boutique.codshop.vipone.site),
    // inject the store parameter so the storefront renders their products and 1-step COD form
    if (url.pathname === '/') {
      url.searchParams.set('store', subdomain);
      const response = NextResponse.rewrite(url, {
        request: { headers: requestHeaders },
      });
      response.headers.set('x-store-slug', subdomain);
      response.headers.set('x-geo-city-final', finalCity);
      response.headers.set('x-geo-country', detectedCountry);
      response.headers.set('x-ab-variant', abVariant);
      response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
      setAbVariantCookie(response, abVariant, anonId);
      response.cookies.set({
        name: 'cod_visitor_country',
        value: detectedCountry,
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
      });
      return response;
    }
  }

  // Return standard response with enriched headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
  response.headers.set('x-geo-city-final', finalCity);
  response.headers.set('x-geo-country', detectedCountry);
  response.headers.set('x-ab-variant', abVariant);
  setAbVariantCookie(response, abVariant, anonId);
  response.cookies.set({
    name: 'cod_visitor_country',
    value: detectedCountry,
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
