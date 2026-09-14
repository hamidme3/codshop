/**
 * Storefront URL Generator
 * Enforces Permanent Rule 2: Clean Multi-Tenant Subdomain Architecture.
 * Public merchant stores live on clean subdomains: https://[store].codshop.vipone.site/
 * Never exposes ?store=slug on public buyer URLs in production.
 */

export function getStorefrontUrl(storeSlug: string, path: string = ''): string {
  if (!storeSlug) return '/';
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';

  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    const rootDomain = (process.env.NEXT_PUBLIC_WILDCARD_DOMAIN || 'codshop.vipone.site').toLowerCase();

    // In local development (localhost) without wildcard DNS support, fallback to query parameter
    if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) {
      return `${cleanPath || '/'}?store=${encodeURIComponent(storeSlug)}`;
    }

    // In production or staging environments with wildcard DNS
    return `https://${storeSlug}.${rootDomain}${cleanPath}`;
  }

  const rootDomain = process.env.NEXT_PUBLIC_WILDCARD_DOMAIN || 'codshop.vipone.site';
  return `https://${storeSlug}.${rootDomain}${cleanPath}`;
}
