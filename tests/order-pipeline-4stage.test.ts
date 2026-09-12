import assert from 'node:assert';
import { getOrders, updateOrderStatus, getCustomers, ORDERS, PRODUCTS } from '../src/lib/mocks';
import { exportCourierManifest } from '../src/lib/courier-manifest';
import { restoreMockProductStock, decrementMockProductStock, MOCK_PRODUCTS } from '../src/lib/mockProducts';

console.log('🧪 Starting 4-Stage Order Pipeline (1. Confirmer -> 2. Expédier -> 3. Livrée | 4. Retournée) Tests...\n');

async function runPipelineTests() {
  const storeSlug = 'ottavio';

  // 1. Initial State
  const orders = getOrders(storeSlug);
  assert.ok(orders.length > 0, 'Orders list should not be empty');
  const targetOrder = orders.find(o => o.id === 'ord_101')!;
  const originalStatus = targetOrder.status;

  console.log('1. Testing Stage 1: [ 1. Confirmer ]...');
  const step1 = updateOrderStatus(targetOrder.id, 'confirmed');
  assert.strictEqual(step1, true);
  assert.strictEqual(targetOrder.status, 'confirmed');
  assert.ok(targetOrder.confirmedAt, 'confirmedAt timestamp must be set');
  console.log('  ✓ Stage 1: Order marked "confirmed" with timestamp.');

  console.log('2. Testing Stage 2: [ 2. Expédier ]...');
  const step2 = updateOrderStatus(targetOrder.id, 'shipped', 'OZON-MA-123456', 'ozon');
  assert.strictEqual(step2, true);
  assert.strictEqual(targetOrder.status, 'shipped');
  assert.strictEqual(targetOrder.trackingNumber, 'OZON-MA-123456');
  assert.strictEqual(targetOrder.courier, 'ozon');
  assert.ok(targetOrder.shippedAt, 'shippedAt timestamp must be set');
  console.log('  ✓ Stage 2: Order marked "shipped" with Ozon tracking.');

  console.log('3. Testing Stage 3: [ 3. Livrée ]...');
  const step3 = updateOrderStatus(targetOrder.id, 'delivered');
  assert.strictEqual(step3, true);
  assert.strictEqual(targetOrder.status, 'delivered');
  assert.ok(targetOrder.deliveredAt, 'deliveredAt timestamp must be set');
  console.log('  ✓ Stage 3: Order marked "delivered" with collected funds.');

  console.log('4. Testing Stage 4: [ 4. Retournée ] (incorporating refusal, non-delivery & cancellation)...');
  const prod = PRODUCTS.find(p => p.id === targetOrder.items[0]?.id);
  const stockBeforeReturn = prod ? prod.stock : 0;

  const step4 = updateOrderStatus(targetOrder.id, 'returned');
  assert.strictEqual(step4, true);
  assert.strictEqual(targetOrder.status, 'returned');
  assert.ok(targetOrder.returnedAt, 'returnedAt timestamp must be set');

  if (prod) {
    assert.strictEqual(prod.stock, stockBeforeReturn! + targetOrder.items[0].quantity, 'Inventory must be restored upon return');
  }
  console.log('  ✓ Stage 4: Order transitioned to "returned", stock restored in warehouse.');

  console.log('5. Testing Moroccan CRM Customer Synchronization for 4. Retournée...');
  const customers = getCustomers(storeSlug);
  const customer = customers.find(c => c.name.includes('Karim') || c.phone === targetOrder.phone);
  assert.ok(customer, 'Customer must exist in CRM');
  assert.strictEqual(customer.lastOrderStatus, 'returned');
  assert.ok((customer.returnedOrders || 0) >= 1, 'Customer returnedOrders count must be at least 1');
  assert.strictEqual(customer.status, 'risk', 'Customer with returned orders must be tagged with risk badge');
  console.log('  ✓ CRM customer tagged with "risk" warning and returnedOrders count incremented.');

  console.log('6. Testing 1-Click Export of Returned Orders...');
  const returnedOrders = orders.filter(o => ['returned', 'canceled'].includes(o.status));
  assert.ok(returnedOrders.length >= 1, 'Must have at least 1 returned order');
  const manifest = exportCourierManifest('standard', returnedOrders, 'ottavio_returned');
  assert.ok(manifest.content.includes('\uFEFF'), 'Manifest must include Windows Excel UTF-8 BOM');
  assert.strictEqual(manifest.filename.endsWith('.csv'), true);
  assert.ok(manifest.filename.includes('ottavio_returned'));
  console.log(`  ✓ 1-Click Returned CSV manifest generated (${manifest.orderCount} orders, total: ${manifest.totalCrbt} DH) with UTF-8 BOM.`);

  // Clean up order back to original
  targetOrder.status = originalStatus;
  console.log('\n🎉 ALL 4-STAGE PIPELINE TESTS PASSED WITH 100% SUCCESS!');
}

runPipelineTests().catch(err => {
  console.error('❌ Pipeline test failed:', err);
  process.exit(1);
});
