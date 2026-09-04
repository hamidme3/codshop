import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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

  // Detect Subdomain
  let subdomain: string | null = null;

  if (currentHost.endsWith(rootDomain) && currentHost !== rootDomain && currentHost !== `www.${rootDomain}`) {
    subdomain = currentHost.replace(`.${rootDomain}`, '');
  } else if (currentHost.endsWith('localhost') && currentHost !== 'localhost') {
    subdomain = currentHost.replace('.localhost', '');
  }

  // Clone headers to pass tenant information downstream
  const requestHeaders = new Headers(request.headers);

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
