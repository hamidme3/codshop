import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || 'codshop.vipone.site';

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

  // Clone headers to pass tenant and auth information downstream
  const requestHeaders = new Headers(request.headers);

  // Admin Route Protection
  if (url.pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('codshop_session')?.value;
    let isValidSession = false;
    let sessionUser: any = null;

    if (sessionCookie) {
      try {
        const { jwtVerify } = await import('jose');
        const secret = new TextEncoder().encode(
          process.env.JWT_SECRET || 'codshop_super_secret_jwt_key_2026_morocco_saas_platform_key'
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
      response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
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
