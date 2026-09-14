import assert from 'node:assert';
import { getProductBySlug, getProductQuantityTiers } from '@/lib/mockProducts';
import { getProductBySlugOrSku } from '@/lib/db-repository';
import { GET as getStorefrontProducts } from '@/app/api/products/route';
import { GET as getAdminProducts } from '@/app/api/admin/products/route';

async function runTests() {
  console.log('--- TEST SUITE: Custom Merchant Product (SKU-5567) Storefront & Catalog Integration ---\n');

  // Test 1: getProductBySlug lookup
  console.log('1. Testing getProductBySlug for SKU-5567...');
  const prodBySku = getProductBySlug('SKU-5567');
  const prodBySlug = getProductBySlug('sku-5567');
  const prodByTitle = getProductBySlug('test-product');

  assert.ok(prodBySku, 'getProductBySlug("SKU-5567") must find the product');
  assert.ok(prodBySlug, 'getProductBySlug("sku-5567") must find the product');
  assert.ok(prodByTitle, 'getProductBySlug("test-product") must find the product');
  assert.strictEqual(prodBySku?.sku, 'SKU-5567', 'SKU must match SKU-5567');
  assert.strictEqual(prodBySku?.price, 299, 'Price must be 299 DH');
  console.log('  ✓ getProductBySlug resolves SKU-5567, sku-5567, and test-product seamlessly.\n');

  // Test 2: Quantity tiers & upsells for custom product
  console.log('2. Testing quantity tiers & COD upsells for SKU-5567...');
  const tiers = getProductQuantityTiers(prodBySku!);
  assert.ok(tiers.length >= 3, 'Must have at least 3 quantity packs');
  assert.strictEqual(tiers[0].quantity, 1, 'Pack 1 must be 1 unit');
  assert.strictEqual(tiers[1].quantity, 2, 'Pack 2 must be Pack Duo');
  assert.strictEqual(tiers[1].freeDelivery, true, 'Pack Duo must have free delivery');
  console.log('  ✓ Pack Duo and Pack Trio tiers are properly generated with free delivery.\n');

  // Test 3: getProductBySlugOrSku in db-repository
  console.log('3. Testing getProductBySlugOrSku in db-repository...');
  const dbProd = await getProductBySlugOrSku('SKU-5567');
  assert.ok(dbProd, 'getProductBySlugOrSku must return product for SKU-5567');
  assert.strictEqual(dbProd?.sku, 'SKU-5567');
  console.log('  ✓ db-repository successfully retrieves SKU-5567.\n');

  // Test 4: Public Storefront API /api/products?store=storet1
  console.log('4. Testing GET /api/products?store=storet1...');
  const storeReq = new Request('http://localhost:3000/api/products?store=storet1');
  const storeRes = await getStorefrontProducts(storeReq);
  assert.strictEqual(storeRes.status, 200, 'Storefront API must return HTTP 200');
  const storeData = await storeRes.json();
  assert.strictEqual(storeData.success, true, 'API response must be successful');
  assert.ok(Array.isArray(storeData.products), 'Must return an array of products');
  const foundInStore = storeData.products.find((p: any) => p.sku === 'SKU-5567' || p.slug === 'sku-5567');
  assert.ok(foundInStore, 'Store products must include Test product (SKU-5567)');
  assert.strictEqual(foundInStore.title, 'Test product');
  assert.strictEqual(foundInStore.price, 299);
  console.log('  ✓ GET /api/products?store=storet1 returns SKU-5567 in store catalog.\n');

  // Test 5: Public Storefront API /api/products?slug=sku-5567
  console.log('5. Testing GET /api/products?slug=sku-5567...');
  const singleReq = new Request('http://localhost:3000/api/products?slug=sku-5567');
  const singleRes = await getStorefrontProducts(singleReq);
  assert.strictEqual(singleRes.status, 200, 'Single product query must return HTTP 200');
  const singleData = await singleRes.json();
  assert.strictEqual(singleData.success, true);
  assert.strictEqual(singleData.product.sku, 'SKU-5567');
  console.log('  ✓ GET /api/products?slug=sku-5567 returns product detail payload.\n');

  // Test 6: Admin API /api/admin/products?store=storet1
  console.log('6. Testing GET /api/admin/products?store=storet1...');
  const adminReq = new Request('http://localhost:3000/api/admin/products?store=storet1');
  const adminRes = await getAdminProducts(adminReq);
  assert.strictEqual(adminRes.status, 200, 'Admin products API must return HTTP 200');
  const adminData = await adminRes.json();
  assert.strictEqual(adminData.success, true);
  const foundAdmin = adminData.products.find((p: any) => p.sku === 'SKU-5567');
  assert.ok(foundAdmin, 'Admin products must include SKU-5567');
  assert.strictEqual(foundAdmin.stock, 20);
  console.log('  ✓ GET /api/admin/products?store=storet1 reflects stock 20 for SKU-5567.\n');

  console.log('=== ALL 6 CUSTOM PRODUCT TESTS PASSED! ===');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
