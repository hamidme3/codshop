import assert from 'node:assert';
import { 
  getStoreCheckoutSettings, 
  updateStoreCheckoutSettings, 
  createOrder, 
  getOrderByNumber 
} from '../src/lib/db-repository';

console.log('🧪 Starting Checkout Email Field Admin Control Verification Tests...\n');

async function runTests() {
  const storeSlug = 'ottavio';

  // 1. Verify default email mode
  console.log('1. Checking default checkout email settings...');
  const initialSettings = await getStoreCheckoutSettings(storeSlug);
  assert.ok(
    ['hidden', 'optional_collapsed', 'optional_visible', 'required'].includes(initialSettings.checkoutEmailMode),
    'checkoutEmailMode must be a valid mode'
  );
  console.log(`  ✓ Current checkout email mode: "${initialSettings.checkoutEmailMode}"\n`);

  // 2. Admin updates mode to "optional_collapsed"
  console.log('2. Testing admin update to "optional_collapsed"...');
  const updateRes1 = await updateStoreCheckoutSettings(storeSlug, { checkoutEmailMode: 'optional_collapsed' });
  assert.strictEqual(updateRes1.checkoutEmailMode, 'optional_collapsed');
  const check1 = await getStoreCheckoutSettings(storeSlug);
  assert.strictEqual(check1.checkoutEmailMode, 'optional_collapsed');
  console.log('  ✓ Mode successfully updated to "optional_collapsed".\n');

  // 3. Admin updates mode to "optional_visible"
  console.log('3. Testing admin update to "optional_visible"...');
  const updateRes2 = await updateStoreCheckoutSettings(storeSlug, { checkoutEmailMode: 'optional_visible' });
  assert.strictEqual(updateRes2.checkoutEmailMode, 'optional_visible');
  const check2 = await getStoreCheckoutSettings(storeSlug);
  assert.strictEqual(check2.checkoutEmailMode, 'optional_visible');
  console.log('  ✓ Mode successfully updated to "optional_visible".\n');

  // 4. Create an order with customer email provided
  console.log('4. Testing order creation with optional email...');
  const testEmail = 'youssef.alamrani@example.com';
  const orderWithEmail = await createOrder({
    storeSlug,
    customerName: 'Youssef El Amrani',
    email: testEmail,
    phone: '0661223344',
    city: 'Rabat',
    address: 'Avenue Hassan II, Agdal',
    items: [
      {
        id: 'prod_test_email',
        title: 'Maroquinerie Portefeuille Cuir',
        price: 290,
        quantity: 1,
      },
    ],
    subtotal: 290,
    shippingFee: 25,
    total: 315,
  });

  assert.ok(orderWithEmail.orderNumber, 'Order must have an order number');
  const fetched = await getOrderByNumber(orderWithEmail.orderNumber);
  assert.ok(fetched, 'Order must be retrievable');
  assert.strictEqual((fetched as any).email, testEmail, 'Persisted email must match submitted email');
  console.log(`  ✓ Order ${orderWithEmail.orderNumber} successfully persisted with email "${(fetched as any).email}".\n`);

  // 5. Create an order without customer email (pure COD mode)
  console.log('5. Testing order creation without email (0% friction mode)...');
  const orderWithoutEmail = await createOrder({
    storeSlug,
    customerName: 'Hamza Benjelloun',
    phone: '0661998877',
    city: 'Casablanca',
    address: 'Maarif Extension',
    items: [
      {
        id: 'prod_test_no_email',
        title: 'Ceinture Artisanale Cuir',
        price: 190,
        quantity: 1,
      },
    ],
    subtotal: 190,
    shippingFee: 20,
    total: 210,
  });

  const fetchedNoEmail = await getOrderByNumber(orderWithoutEmail.orderNumber);
  assert.ok(fetchedNoEmail, 'Order without email must be retrievable');
  assert.strictEqual((fetchedNoEmail as any).email, undefined, 'Email should be undefined when omitted');
  console.log(`  ✓ Order ${orderWithoutEmail.orderNumber} cleanly persisted without email.\n`);

  console.log('🎉 ALL CHECKOUT EMAIL ADMIN CONTROL TESTS PASSED (100% SUCCESS RATE)!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
