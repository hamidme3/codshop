import assert from 'node:assert';
import { NextRequest } from 'next/server';
import { middleware } from '../src/middleware';
import { getStorefrontUrl } from '../src/lib/store-urls';

async function runTests() {
  console.log('=== Running Clean Subdomain & Storefront Routing Tests ===\n');

  // Test 1: Verify getStorefrontUrl returns clean canonical subdomain
  console.log('1. Testing getStorefrontUrl URL generation...');
  const storet1Url = getStorefrontUrl('storet1');
  assert.strictEqual(
    storet1Url,
    'https://storet1.codshop.vipone.site',
    'storet1 URL must be clean subdomain https://storet1.codshop.vipone.site'
  );

  const ottavioCatalogUrl = getStorefrontUrl('ottavio', '/catalog');
  assert.strictEqual(
    ottavioCatalogUrl,
    'https://ottavio.codshop.vipone.site/catalog',
    'ottavio catalog URL must be clean subdomain https://ottavio.codshop.vipone.site/catalog'
  );
  console.log('  ✓ getStorefrontUrl generates clean subdomains without ?store= query parameters.\n');

  // Test 2: Middleware 308 permanent redirect for public legacy ?store= on root domain
  console.log('2. Testing middleware 308 redirect for public root domain with ?store=storet1...');
  const reqLegacy = new NextRequest('https://codshop.vipone.site/?store=storet1', {
    headers: { host: 'codshop.vipone.site' },
  });
  const resLegacy = await middleware(reqLegacy);
  assert.strictEqual(resLegacy.status, 308, 'Should return 308 Permanent Redirect for legacy query parameter');
  assert.strictEqual(
    resLegacy.headers.get('location'),
    'https://storet1.codshop.vipone.site/',
    'Should redirect to clean merchant subdomain https://storet1.codshop.vipone.site/'
  );
  console.log('  ✓ Legacy https://codshop.vipone.site/?store=storet1 redirects to https://storet1.codshop.vipone.site/\n');

  // Test 3: Middleware preserves paths (e.g. /catalog?store=storet1 -> https://storet1.codshop.vipone.site/catalog)
  console.log('3. Testing middleware redirect preserves route path...');
  const reqCatalog = new NextRequest('https://codshop.vipone.site/catalog?store=storet1', {
    headers: { host: 'codshop.vipone.site' },
  });
  const resCatalog = await middleware(reqCatalog);
  assert.strictEqual(resCatalog.status, 308, 'Should return 308 for /catalog?store=storet1');
  assert.strictEqual(
    resCatalog.headers.get('location'),
    'https://storet1.codshop.vipone.site/catalog',
    'Should redirect to https://storet1.codshop.vipone.site/catalog'
  );
  console.log('  ✓ Legacy https://codshop.vipone.site/catalog?store=storet1 redirects to https://storet1.codshop.vipone.site/catalog\n');

  // Test 4: Middleware MUST NOT redirect admin routes (?store= inside /admin is internal session state)
  console.log('4. Testing admin routes with ?store= are NOT redirected...');
  const reqAdmin = new NextRequest('https://codshop.vipone.site/admin/orders?store=storet1', {
    headers: { host: 'codshop.vipone.site' },
  });
  const resAdmin = await middleware(reqAdmin);
  // It redirects unauthenticated users to /admin/login, not to storet1.codshop.vipone.site
  const adminLocation = resAdmin.headers.get('location');
  if (adminLocation) {
    assert.ok(
      adminLocation.includes('/admin/login'),
      'Admin redirection should be login guard, not subdomain redirection'
    );
  } else {
    assert.notStrictEqual(resAdmin.status, 308, 'Admin routes should never 308 redirect to subdomain');
  }
  console.log('  ✓ Admin routes (/admin/orders?store=storet1) preserve internal query scoping.\n');

  // Test 5: Subdomain routing sets x-store-slug header and internal rewrite
  console.log('5. Testing subdomain routing on https://storet1.codshop.vipone.site/...');
  const reqSubdomain = new NextRequest('https://storet1.codshop.vipone.site/', {
    headers: { host: 'storet1.codshop.vipone.site' },
  });
  const resSubdomain = await middleware(reqSubdomain);
  assert.strictEqual(resSubdomain.status, 200, 'Subdomain request should return 200 rewrite');
  assert.strictEqual(
    resSubdomain.headers.get('x-store-slug'),
    'storet1',
    'Subdomain should inject x-store-slug: storet1'
  );
  console.log('  ✓ Subdomain correctly routes tenant context to storet1.\n');

  console.log('🎉 ALL CLEAN SUBDOMAIN & STOREFRONT ROUTING TESTS PASSED (100% SUCCESS)!\n');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
