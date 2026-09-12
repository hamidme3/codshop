import assert from 'node:assert';
import { 
  getCategories, addCategory, deleteCategory, 
  getProducts, addProduct, updateProduct, deleteProduct, updateProductStock,
  getOrders, deleteOrder, getCustomers, PRODUCTS, ORDERS
} from '../src/lib/backoffice';

console.log('🧪 Starting Category & Product Mutation & Completeness Tests...\n');

async function runCategoryCrudTests() {
  const storeSlug = 'ottavio';

  // 1. Dynamic Category Count Verification
  console.log('1. Testing Dynamic Category Count Synchronization...');
  const initialCategories = getCategories(storeSlug);
  const leatherCategory = initialCategories.find(c => c.slug === 'maroquinerie');
  assert.ok(leatherCategory, 'Maroquinerie category must exist');
  
  const initialCount = leatherCategory.productCount;
  console.log(`  Initial product count for "${leatherCategory.name}": ${initialCount}`);

  // Add a new product under Maroquinerie & Cuir
  const testProduct = addProduct({
    storeSlug,
    title: 'Sac Bandoulière Cuir Fès Édition Limitée',
    sku: 'TEST-BAG-99',
    category: 'Maroquinerie & Cuir',
    price: 380,
    comparePrice: 550,
    costPrice: 120,
    stock: 15,
    images: ['https://example.com/bag.jpg'],
    variants: [{ size: 'Unique', stock: 15 }],
    status: 'active',
  });

  const updatedCategoriesAfterAdd = getCategories(storeSlug);
  const updatedLeather = updatedCategoriesAfterAdd.find(c => c.slug === 'maroquinerie');
  assert.strictEqual(
    updatedLeather?.productCount, 
    initialCount + 1, 
    'Category productCount must dynamically increment after adding a product'
  );
  console.log(`  ✓ Product added. Category productCount dynamically incremented to ${updatedLeather?.productCount}.`);

  // 2. Add New Category
  console.log('2. Testing Category Creation (addCategory)...');
  const newCat = addCategory({
    name: 'Bijouterie & Orfèvrerie',
  });
  assert.ok(newCat.id, 'New category must receive an ID');
  assert.strictEqual(newCat.name, 'Bijouterie & Orfèvrerie');
  assert.strictEqual(newCat.slug, 'bijouterie-orfevrerie');
  assert.strictEqual(newCat.productCount, 0, 'New category must have 0 products initially');

  const categoriesWithNew = getCategories(storeSlug);
  const foundNewCat = categoriesWithNew.find(c => c.id === newCat.id);
  assert.ok(foundNewCat, 'Newly created category must appear in getCategories() list');
  console.log('  ✓ Category successfully created with auto-slug and dynamic 0 count.');

  // 3. Safety Guard: Deleting a category with active products must be safely prevented
  console.log('3. Testing Category Deletion Safety Guard (prevent orphan products)...');
  const deleteActiveAttempt = deleteCategory(leatherCategory.id, storeSlug);
  assert.strictEqual(deleteActiveAttempt.success, false, 'Deletion of active category must fail');
  assert.ok(
    deleteActiveAttempt.error?.includes('produit(s) y sont encore associés'), 
    'Error message must clearly inform the merchant about attached products'
  );
  console.log(`  ✓ Safety guard prevented deletion: "${deleteActiveAttempt.error}"`);

  // 4. Deleting an Empty Category
  console.log('4. Testing Deletion of Empty Category...');
  const deleteEmptyAttempt = deleteCategory(newCat.id, storeSlug);
  assert.strictEqual(deleteEmptyAttempt.success, true, 'Deletion of empty category must succeed');
  
  const categoriesAfterDelete = getCategories(storeSlug);
  const deletedCatCheck = categoriesAfterDelete.find(c => c.id === newCat.id);
  assert.strictEqual(deletedCatCheck, undefined, 'Deleted category must no longer exist in getCategories()');
  console.log('  ✓ Empty category successfully deleted.');

  // 5. Product Stock Adjustments (updateProductStock)
  console.log('5. Testing Quick Stock Adjustment (updateProductStock)...');
  const stockUpdateResult = updateProductStock(testProduct.id, 25);
  assert.strictEqual(stockUpdateResult, true);
  const prodAfterStock = getProducts(storeSlug).find(p => p.id === testProduct.id);
  assert.strictEqual(prodAfterStock?.stock, 25, 'Stock must be updated to 25');
  console.log('  ✓ Stock successfully updated to 25 units.');

  // 5b. Full Product & Variant Update (updateProduct)
  console.log('5b. Testing Full Product Update with Variants (updateProduct)...');
  const updateResult = updateProduct(testProduct.id, {
    title: 'Sac Bandoulière Cuir Fès Édition Prestige VIP',
    price: 399,
    comparePrice: 650,
    costPrice: 130,
    stock: 30,
    variants: [
      { color: 'Marron Vintage', size: 'M', stock: 15, sku: 'TEST-BAG-M' },
      { color: 'Noir Carbone', size: 'L', stock: 15, sku: 'TEST-BAG-L' },
    ],
  });
  assert.ok(updateResult, 'updateProduct must return updated product');
  assert.strictEqual(updateResult.title, 'Sac Bandoulière Cuir Fès Édition Prestige VIP');
  assert.strictEqual(updateResult.price, 399);
  assert.strictEqual(updateResult.comparePrice, 650);
  assert.strictEqual(updateResult.costPrice, 130);
  assert.strictEqual(updateResult.stock, 30);
  assert.strictEqual(updateResult.variants?.length, 2);
  assert.strictEqual(updateResult.variants[0].color, 'Marron Vintage');
  assert.strictEqual(updateResult.variants[1].size, 'L');
  console.log('  ✓ Product title, pricing, margin, and variant matrix updated successfully.');

  // 6. Product Deletion (deleteProduct)
  console.log('6. Testing Product Deletion (deleteProduct)...');
  const deleteProdResult = deleteProduct(testProduct.id);
  assert.strictEqual(deleteProdResult, true);
  const prodCheck = getProducts(storeSlug).find(p => p.id === testProduct.id);
  assert.strictEqual(prodCheck, undefined, 'Deleted product must not appear in product catalog');

  const finalCategories = getCategories(storeSlug);
  const finalLeather = finalCategories.find(c => c.slug === 'maroquinerie');
  assert.strictEqual(
    finalLeather?.productCount, 
    initialCount, 
    'Category productCount must dynamically decrement after deleting the product'
  );
  console.log('  ✓ Product deleted. Category count dynamically returned to initial baseline.');

  // 7. Order Deletion & Stock Restoration
  console.log('7. Testing Order Deletion & Stock Restoration (deleteOrder)...');
  const orders = getOrders(storeSlug);
  const targetOrder = orders[0];
  const orderId = targetOrder.id;
  const targetItem = targetOrder.items[0];
  const prodForOrder = PRODUCTS.find(p => p.id === targetItem?.id);
  const stockBeforeOrderDelete = prodForOrder ? prodForOrder.stock : 0;

  const deleteOrderResult = deleteOrder(orderId, storeSlug);
  assert.strictEqual(deleteOrderResult, true, 'Order deletion must return true');
  
  const ordersAfterDelete = getOrders(storeSlug);
  const deletedOrderCheck = ordersAfterDelete.find(o => o.id === orderId);
  assert.strictEqual(deletedOrderCheck, undefined, 'Deleted order must not appear in order list');

  if (prodForOrder && ['new', 'confirmed', 'shipped'].includes(targetOrder.status)) {
    assert.strictEqual(
      prodForOrder.stock, 
      stockBeforeOrderDelete + targetItem.quantity, 
      'Stock must be restored when active order is deleted'
    );
  }
  console.log('  ✓ Order successfully purged and reserved stock restored to inventory.');

  console.log('\n✅ ALL CATEGORY & PRODUCT MUTATION TESTS PASSED (0 ERRORS)\n');
}

runCategoryCrudTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
