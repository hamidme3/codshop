import assert from 'node:assert';
import { verifyAndRecalculateOrder } from '../src/lib/order-pricing';
import { updateOrderStatus, deleteOrder, ORDERS } from '../src/lib/mocks';
import { formatCountryPrice } from '../src/lib/geo';

console.log('🧪 Starting Knowledge Graph Cross-System Verification Tests...\n');

async function runTests() {
  // Test 1: Cart Drawer multi-unit checkout at standard price (2 x 349 DH = 698 DH)
  console.log('1. Testing Cart Drawer checkout with 2 units at standard catalog price...');
  const cartOrder = await verifyAndRecalculateOrder({
    storeSlug: 'ottavio',
    customer: { fullName: 'Sarah Tahiri', phone: '0661234567', city: 'Casablanca' },
    items: [
      {
        id: 'prod_1',
        title: 'Sac Cuir Artisanal Marrakech',
        quantity: 2,
        price: 349,
        subtotal: 698,
      },
    ],
    subtotal: 698,
    shippingFee: 0,
    total: 698,
  });

  assert.strictEqual(cartOrder.success, true, 'Cart order must succeed');
  assert.strictEqual(cartOrder.tamperingDetected, false, 'Standard catalog price must not be flagged as tampering');
  assert.strictEqual(cartOrder.subtotal, 698, 'Subtotal should be 698 DH');
  assert.strictEqual(cartOrder.shippingFee, 0, '2 units receives free shipping');
  assert.strictEqual(cartOrder.total, 698, 'Total should be 698 DH');
  console.log('  ✓ Cart Drawer multi-unit standard price accepted without tampering rejection.');

  // Test 2: Pack Duo checkout at tier discounted price (594 DH)
  console.log('2. Testing Pack Duo checkout at tier discounted price...');
  const duoOrder = await verifyAndRecalculateOrder({
    storeSlug: 'ottavio',
    customer: { fullName: 'Omar Fassi', phone: '0661234567', city: 'Casablanca' },
    product: { id: 'prod_1', title: 'Sac Cuir Artisanal Marrakech' },
    quantity: 2,
    subtotal: 594,
    shippingFee: 0,
    total: 594,
    freeDelivery: true,
  });

  assert.strictEqual(duoOrder.success, true);
  assert.strictEqual(duoOrder.tamperingDetected, false, 'Authentic Pack Duo tier price must not be flagged as tampering');
  assert.strictEqual(duoOrder.total, 594);
  console.log('  ✓ Pack Duo tier price accepted without tampering rejection.');

  // Test 3: Forged / Tampered Price (1 DH) is caught and flagged
  console.log('3. Testing Forged Price Tampering detection...');
  const fraudOrder = await verifyAndRecalculateOrder({
    storeSlug: 'ottavio',
    customer: { fullName: 'Bad Actor', phone: '0661234567', city: 'Casablanca' },
    items: [
      {
        id: 'prod_1',
        title: 'Sac Cuir Artisanal Marrakech',
        quantity: 2,
        price: 0.5,
        subtotal: 1,
      },
    ],
    subtotal: 1,
    shippingFee: 0,
    total: 1,
  });

  assert.strictEqual(fraudOrder.success, true);
  assert.strictEqual(fraudOrder.tamperingDetected, true, 'Forged 1 DH total must be flagged as tampering');
  assert.ok(fraudOrder.total > 1, 'Authentic total must be recalculated');
  console.log('  ✓ Forged price tampering accurately detected and overridden.');

  // Test 4: updateOrderStatus lookup by orderNumber (e.g. CMD-XXXX)
  console.log('4. Testing updateOrderStatus by orderNumber...');
  const targetOrder = ORDERS[0];
  assert.ok(targetOrder, 'Sample order must exist in mock ORDERS');
  const targetOrderNum = targetOrder.orderNumber;
  const initialStatus = targetOrder.status;

  const updateSuccess = updateOrderStatus(targetOrderNum, 'confirmed', 'TRK-TEST-99', 'ozon');
  assert.strictEqual(updateSuccess, true, 'updateOrderStatus by orderNumber must succeed');
  assert.strictEqual(targetOrder.status, 'confirmed', 'Order status must be updated to confirmed');
  assert.strictEqual(targetOrder.trackingNumber, 'TRK-TEST-99');
  console.log('  ✓ updateOrderStatus successfully resolved by orderNumber.');

  // Test 5: deleteOrder lookup by orderNumber
  console.log('5. Testing deleteOrder by orderNumber...');
  // Add a test order to ORDERS
  const testOrderNumber = `CMD-TEST-${Date.now()}`;
  ORDERS.push({
    id: `ord_test_${Date.now()}`,
    orderNumber: testOrderNumber,
    storeSlug: 'ottavio',
    customerName: 'Test Customer',
    customerPhone: '0600000000',
    customerCity: 'Casablanca',
    customerAddress: 'Test address',
    items: [{ id: 'prod_1', title: 'Test Item', quantity: 1, price: 100 }],
    subtotal: 100,
    shippingFee: 20,
    total: 120,
    status: 'new',
    createdAt: new Date().toISOString(),
  });

  const deleteSuccess = deleteOrder(testOrderNumber, 'ottavio');
  assert.strictEqual(deleteSuccess, true, 'deleteOrder by orderNumber must succeed');
  const stillExists = ORDERS.some((o) => o.orderNumber === testOrderNumber);
  assert.strictEqual(stillExists, false, 'Deleted order must no longer exist in memory');
  console.log('  ✓ deleteOrder successfully resolved and removed by orderNumber.');

  // Test 6: formatCountryPrice for Arabic and French
  console.log('6. Testing formatCountryPrice for multi-country currency symbols...');
  const priceSaFr = formatCountryPrice(150, 'SA', 'fr');
  assert.ok(priceSaFr.includes('SAR'), 'SA French should contain SAR');

  const priceSaAr = formatCountryPrice(150, 'SA', 'ar');
  assert.ok(priceSaAr.includes('ر.س'), 'SA Arabic should contain ر.س');

  const priceUaeAr = formatCountryPrice(200, 'AE', 'ar');
  assert.ok(priceUaeAr.includes('د.إ'), 'UAE Arabic should contain د.إ');

  const priceMaFr = formatCountryPrice(299, 'MA', 'fr');
  assert.ok(priceMaFr.includes('DH'), 'MA French should contain DH');
  console.log('  ✓ Multi-country price formatting verified across languages.');

  console.log('\n🎉 ALL KNOWLEDGE GRAPH CROSS-SYSTEM TESTS PASSED (100% SUCCESS RATE)!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
