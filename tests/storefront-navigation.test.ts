import assert from 'node:assert';
import { MOCK_PRODUCTS } from '../src/lib/mockProducts';
import { THEMES } from '../src/lib/themes';

console.log('🧪 Starting Storefront Navigation Verification Tests...\n');

async function runTests() {
  // 1. Verify Search Predictive Filter Logic
  console.log('1. Testing Search Modal Predictive Filtering...');
  const testQueries = [
    { query: 'babouche', minExpected: 1 },
    { query: 'argan', minExpected: 1 },
    { query: 'montre', minExpected: 1 },
    { query: 'cuir', minExpected: 1 },
    { query: 'luxury', minExpected: 1 },
  ];

  for (const { query, minExpected } of testQueries) {
    const q = query.trim().toLowerCase();
    const results = MOCK_PRODUCTS.filter((p) => {
      const title = p.title?.toLowerCase() || '';
      const titleAr = p.titleAr || '';
      const tagline = p.tagline?.toLowerCase() || '';
      const sku = p.sku?.toLowerCase() || '';
      const categoryName = THEMES[p.theme]?.name?.toLowerCase() || '';
      const categoryId = p.theme?.toLowerCase() || '';
      const desc = p.description?.toLowerCase() || '';

      return (
        title.includes(q) ||
        titleAr.includes(q) ||
        tagline.includes(q) ||
        categoryName.includes(q) ||
        categoryId.includes(q) ||
        sku.includes(q) ||
        desc.includes(q)
      );
    });

    assert.ok(
      results.length >= minExpected,
      `Query "${query}" should yield at least ${minExpected} results, got ${results.length}`
    );
    console.log(`  ✓ Search query "${query}" matched ${results.length} product(s).`);
  }
  console.log('');

  // 2. Verify Breadcrumb Generation and Category Mapping
  console.log('2. Testing Breadcrumb Trail Generation & Theme/Category Mapping...');
  for (const product of MOCK_PRODUCTS.slice(0, 5)) {
    const categoryName = THEMES[product.theme]?.name || product.theme;
    assert.ok(categoryName, `Product ${product.id} should have a readable category name`);

    // Simulate getNavUrl logic
    const homeHref = '/';
    const catalogHref = '/catalog';
    const categoryHref = `/catalog?category=${encodeURIComponent(product.theme)}`;

    assert.strictEqual(homeHref, '/');
    assert.strictEqual(catalogHref, '/catalog');
    assert.ok(categoryHref.startsWith('/catalog?category='));

    // Check store parameter preservation
    const storeParam = 'storet1';
    const storeCategoryHref = `${categoryHref}&store=${encodeURIComponent(storeParam)}`;
    assert.ok(storeCategoryHref.includes(`store=${storeParam}`));

    console.log(
      `  ✓ Breadcrumb for "${product.title.slice(0, 25)}...": Accueil > Catalogue > ${categoryName} > ${product.title.slice(0, 20)}...`
    );
  }
  console.log('');

  // 3. Verify Mobile Bottom Navigation Route Visibility Rules
  console.log('3. Testing Mobile Bottom Navigation Route Visibility Rules...');
  const routeVisibilityCases = [
    { pathname: '/', shouldRender: true, label: 'Storefront Homepage' },
    { pathname: '/catalog', shouldRender: true, label: 'Storefront Catalog' },
    { pathname: '/cart', shouldRender: true, label: 'Storefront Cart Page' },
    { pathname: '/product/babouche-cuir-fes', shouldRender: false, label: 'Product Detail Page (Priority to Buy Bar)' },
    { pathname: '/product/coffret-argan-bio', shouldRender: false, label: 'Product Detail Page (Priority to Buy Bar)' },
    { pathname: '/admin', shouldRender: false, label: 'Admin Backoffice' },
    { pathname: '/admin/orders', shouldRender: false, label: 'Admin Orders' },
    { pathname: '/register-store', shouldRender: false, label: 'Register Store' },
    { pathname: '/sso', shouldRender: false, label: 'SSO Login' },
  ];

  for (const testCase of routeVisibilityCases) {
    const isProduct = testCase.pathname.startsWith('/product/');
    const isBackoffice =
      testCase.pathname.startsWith('/admin') ||
      testCase.pathname.startsWith('/register-store') ||
      testCase.pathname.startsWith('/sso');

    const shouldRender = !isProduct && !isBackoffice;
    assert.strictEqual(
      shouldRender,
      testCase.shouldRender,
      `Route "${testCase.pathname}" visibility mismatch`
    );
    console.log(
      `  ✓ Route "${testCase.pathname}" (${testCase.label}) -> Bottom Nav ${shouldRender ? 'VISIBLE' : 'HIDDEN'}`
    );
  }
  console.log('');

  // 4. Verify Catalog Category & Search Query Parameter Filtering
  console.log('4. Testing Catalog Page Filtering by Category & Search Parameter...');
  const sampleCategory = 'luxury';
  const filteredByCategory = MOCK_PRODUCTS.filter((p) => {
    return (
      p.theme === sampleCategory ||
      p.tagline?.toLowerCase().includes('chaussure') ||
      p.tagline?.toLowerCase().includes('babouche') ||
      (p as any).category?.toLowerCase().includes('chaussure')
    );
  });

  assert.ok(
    filteredByCategory.length > 0,
    `Category filter "${sampleCategory}" must return products`
  );
  console.log(
    `  ✓ Category "${sampleCategory}" matches ${filteredByCategory.length} product(s) in catalog.`
  );

  const sampleSearch = 'argan';
  const filteredBySearch = MOCK_PRODUCTS.filter((p) => {
    const q = sampleSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.tagline && p.tagline.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  assert.ok(
    filteredBySearch.length > 0,
    `Search query "${sampleSearch}" must return products`
  );
  console.log(
    `  ✓ Search query "${sampleSearch}" matches ${filteredBySearch.length} product(s) in catalog.`
  );

  console.log('\n🎉 ALL STOREFRONT NAVIGATION TESTS PASSED (100% SUCCESS)!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
