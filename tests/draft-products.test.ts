import assert from 'assert';
import { getProducts, addProduct, updateProduct, deleteProduct, getCategories, PRODUCTS } from '../src/lib/mocks';
import { verifyAndRecalculateOrder } from '../src/lib/order-pricing';

async function runDraftProductsTests() {
  console.log('🧪 Starting Draft Products Feature Verification Suite...\n');

  const testStoreSlug = `draft-store-${Date.now()}`;

  // 1. Create one active product and one draft product
  console.log('1. Creating active and draft test products in store:', testStoreSlug);
  const activeProduct = addProduct({
    storeSlug: testStoreSlug,
    title: 'Sac Artisanal Actif',
    sku: `SKU-ACT-${Date.now()}`,
    category: 'Maroquinerie & Cuir',
    price: 350,
    costPrice: 150,
    stock: 50,
    images: [],
    variants: [],
    status: 'active',
  });

  const draftProduct = addProduct({
    storeSlug: testStoreSlug,
    title: 'Ceinture Cuir Brouillon',
    sku: `SKU-DFT-${Date.now()}`,
    category: 'Maroquinerie & Cuir',
    price: 180,
    costPrice: 70,
    stock: 20,
    images: [],
    variants: [],
    status: 'draft',
  });

  assert.strictEqual(activeProduct.status, 'active');
  assert.strictEqual(draftProduct.status, 'draft');
  console.log('  ✓ Created active product:', activeProduct.sku, 'and draft product:', draftProduct.sku);

  // 2. Test Category product count excludes draft products
  console.log('\n2. Testing Category productCount excludes draft products...');
  const cats = getCategories(testStoreSlug);
  const leatherCat = cats.find((c) => c.name.toLowerCase().includes('maroquinerie'));
  assert(leatherCat, 'Leather category should exist');
  // There is 1 active and 1 draft in this store, so category count must strictly equal 1!
  assert.strictEqual(
    leatherCat.productCount,
    1,
    `Expected category count to be 1 (only active product counted), but got ${leatherCat.productCount}`
  );
  console.log('  ✓ Category productCount strictly counts active products: 1 active, 0 draft counted.');

  // 3. Test Order Pricing Engine (COD Checkout Security Guard)
  console.log('\n3. Testing COD Checkout rejection for draft product...');
  const draftOrderResult = await verifyAndRecalculateOrder(
    {
      storeSlug: testStoreSlug,
      customerName: 'Amina Mansouri',
      customerCity: 'Casablanca',
      customerAddress: 'Boulevard d Anfa',
      items: [
        {
          sku: draftProduct.sku,
          title: draftProduct.title,
          quantity: 1,
          price: 180,
        },
      ],
    },
    testStoreSlug
  );

  assert.strictEqual(draftOrderResult.success, false, 'Order containing draft product must be rejected!');
  assert(
    draftOrderResult.error?.includes('en cours de préparation'),
    `Expected draft error message, got: ${draftOrderResult.error}`
  );
  console.log('  ✓ COD Checkout correctly rejected draft product order:', draftOrderResult.error);

  // 4. Test COD Checkout succeeds for active product
  console.log('\n4. Testing COD Checkout acceptance for active product...');
  const activeOrderResult = await verifyAndRecalculateOrder(
    {
      storeSlug: testStoreSlug,
      customerName: 'Karim Alaoui',
      customerCity: 'Casablanca',
      customerAddress: 'Maarif Rue 14',
      items: [
        {
          sku: activeProduct.sku,
          title: activeProduct.title,
          quantity: 1,
          price: 350,
        },
      ],
    },
    testStoreSlug
  );

  assert.strictEqual(activeOrderResult.success, true, 'Order containing active product must succeed!');
  assert.strictEqual(activeOrderResult.subtotal, 350);
  console.log('  ✓ COD Checkout verified active product order successfully: total', activeOrderResult.total, 'DH');

  // 5. Test Status Toggling (1-Click Publish / Unpublish)
  console.log('\n5. Testing 1-Click status toggle from draft to active...');
  const publishedDraft = updateProduct(draftProduct.id, { status: 'active' });
  assert.strictEqual(publishedDraft?.status, 'active', 'Draft product must now be active');

  const updatedCats = getCategories(testStoreSlug);
  const updatedLeatherCat = updatedCats.find((c) => c.name.toLowerCase().includes('maroquinerie'));
  assert.strictEqual(
    updatedLeatherCat?.productCount,
    2,
    `Expected category count to now be 2 after publishing, got ${updatedLeatherCat?.productCount}`
  );
  console.log('  ✓ Product successfully published. Category count incremented from 1 to 2.');

  // Toggle active product to draft
  console.log('\n6. Testing toggle active product to draft...');
  const unpublishedActive = updateProduct(activeProduct.id, { status: 'draft' });
  assert.strictEqual(unpublishedActive?.status, 'draft', 'Active product must now be draft');

  const retestDraftOrder = await verifyAndRecalculateOrder(
    {
      storeSlug: testStoreSlug,
      customerName: 'Karim Alaoui',
      customerCity: 'Casablanca',
      items: [{ sku: activeProduct.sku, title: activeProduct.title, quantity: 1, price: 350 }],
    },
    testStoreSlug
  );
  assert.strictEqual(retestDraftOrder.success, false, 'Unpublished product must now be rejected at checkout!');
  console.log('  ✓ Unpublished product is immediately blocked from COD checkout.');

  // Clean up test products
  deleteProduct(activeProduct.id);
  deleteProduct(draftProduct.id);

  console.log('\n🎉 ALL DRAFT PRODUCTS FEATURE TESTS PASSED (100% SUCCESS RATE)!');
}

runDraftProductsTests().catch((err) => {
  console.error('❌ Draft products test failed:', err);
  process.exit(1);
});
