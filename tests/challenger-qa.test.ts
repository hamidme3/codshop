import assert from 'node:assert';
import { MOCK_PRODUCTS, decrementMockProductStock, restoreMockProductStock } from '../src/lib/mockProducts';
import { ORDERS, PRODUCTS, updateOrderStatus } from '../src/lib/mocks';
import { verifyAndRecalculateOrder } from '../src/lib/order-pricing';

console.log('🧪 Starting Challenger QA Regression Tests...');

// ── Test 1: Price Tampering Detection & Server Recalculation ───
async function testPriceTampering() {
  const tamperedPayload = {
    storeSlug: 'ottavio',
    customerName: 'Hacker Tamperer',
    customerPhone: '0661998877',
    city: 'Casablanca',
    items: [
      {
        id: 'lux-1',
        title: 'Souliers Richelieu Cuir Italien',
        quantity: 1,
        price: 1, // Tampered to 1 DH (Catalog is 699 DH)
      },
    ],
    total: 1, // Tampered total
    shippingFee: 0,
  };

  const pricing = await verifyAndRecalculateOrder(tamperedPayload, 'ottavio');
  assert.strictEqual(pricing.success, true, 'Pricing engine should calculate authentic catalog price');
  assert.strictEqual(pricing.tamperingDetected, true, 'Price tampering MUST be detected');
  assert.strictEqual(pricing.total, 699, `Total must be authentic 699 DH, got ${pricing.total}`);
  assert.strictEqual(pricing.items[0].price, 699, 'Item price must be reset to catalog price');
  console.log('  ✓ Price tampering attempt successfully detected and catalog price recalculated (1 DH -> 699 DH).');
}

// ── Test 2: Inventory Decrement & Restoration on Cancellation ───
function testInventoryLifecycle() {
  const prod = MOCK_PRODUCTS.find((p) => p.id === 'lux-1')!;
  const initialStock = prod.stockLeft;

  // 1. Decrement stock for 2 items
  const decResult = decrementMockProductStock('lux-1', 2, { size: '42' });
  assert.strictEqual(decResult.success, true);
  assert.strictEqual(prod.stockLeft, initialStock - 2, 'Stock must decrease by 2 on order');

  // 2. Restore stock upon cancellation
  const restResult = restoreMockProductStock('lux-1', 2, { size: '42' });
  assert.strictEqual(restResult.success, true);
  assert.strictEqual(prod.stockLeft, initialStock, 'Stock must be restored to initial level upon cancellation');

  // 3. Test through updateOrderStatus in mocks.ts
  const mockOrder = ORDERS[0];
  const orderInitialStatus = mockOrder.status;
  
  // Transition order to canceled
  const updated = updateOrderStatus(mockOrder.id, 'canceled');
  assert.strictEqual(updated, true);
  assert.strictEqual(mockOrder.status, 'canceled');
  
  // Reset mock order status back for other tests
  mockOrder.status = orderInitialStatus;
  console.log('  ✓ Inventory decrement on order and full restoration on cancellation/return verified.');
}

// ── Test 3: Pack Duo & Stopdesk Auto-Free Shipping ───
async function testPricingBusinessRules() {
  // Pack Duo of 699 DH shoe = 1198 DH with free delivery
  const duoPayload = {
    storeSlug: 'ottavio',
    customerName: 'Amina Alami',
    customerPhone: '0661123456',
    city: 'Rabat',
    deliveryType: 'home',
    items: [
      {
        id: 'lux-1',
        title: 'Souliers Richelieu Cuir Italien',
        quantity: 2,
      },
    ],
  };

  const duoPricing = await verifyAndRecalculateOrder(duoPayload, 'ottavio');
  assert.strictEqual(duoPricing.success, true);
  assert.strictEqual(duoPricing.shippingFee, 0, 'Pack Duo MUST have 0 DH shipping fee');
  assert.strictEqual(duoPricing.total, 1198, 'Pack Duo 2x599 = 1198 DH');

  // Single unit with Stopdesk = free delivery
  const stopdeskPayload = {
    storeSlug: 'ottavio',
    customerName: 'Yassine',
    customerPhone: '0661001122',
    city: 'Fès',
    deliveryType: 'stopdesk',
    items: [{ id: 'lux-1', quantity: 1 }],
  };

  const stopdeskPricing = await verifyAndRecalculateOrder(stopdeskPayload, 'ottavio');
  assert.strictEqual(stopdeskPricing.shippingFee, 0, 'Stopdesk delivery MUST be 0 DH');
  console.log('  ✓ Pack Duo auto-free delivery and Stopdesk 0 DH pickup verified.');
}

async function run() {
  await testPriceTampering();
  testInventoryLifecycle();
  await testPricingBusinessRules();
  console.log('🎉 All Challenger QA Regression Tests passed successfully!\n');
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
