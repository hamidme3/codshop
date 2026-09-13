import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GET as getAdminOrders, PATCH as patchAdminOrders } from '../src/app/api/admin/orders/route';
import { POST as postOrder } from '../src/app/api/order/route';

console.log('🧪 Starting Live Orders & Subdomain Multi-Tenant Sync Test Suite...\n');

async function runTests() {
  // Test 1: Verify storet1 orders returned by GET /api/admin/orders
  console.log('1. Testing GET /api/admin/orders for storet1...');
  const req1 = new Request('http://localhost:3000/api/admin/orders?store=storet1');
  const res1 = await getAdminOrders(req1);
  const data1 = await res1.json();
  assert.strictEqual(data1.success, true, 'GET /api/admin/orders should succeed');
  assert.ok(data1.count >= 2, 'storet1 should have at least 2 orders');
  const numbers = data1.orders.map((o: any) => o.orderNumber);
  assert.ok(numbers.includes('CMD-6966'), 'CMD-6966 must be included in storet1 orders');
  assert.ok(numbers.includes('CMD-5848'), 'CMD-5848 must be included in storet1 orders');
  console.log('  ✓ GET /api/admin/orders successfully retrieved CMD-6966 and CMD-5848 for storet1.\n');

  // Test 2: Subdomain header extraction (x-store-slug) in POST /api/order
  console.log('2. Testing POST /api/order automatic store detection via x-store-slug header...');
  const subOrderReq = new Request('http://localhost:3000/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-store-slug': 'storet1',
    },
    body: JSON.stringify({
      customerName: 'Amina Mansouri',
      customerPhone: '0661223344',
      city: 'Casablanca',
      address: 'Boulevard d Anfa',
      items: [
        {
          id: 'lux-1',
          title: 'Souliers Richelieu Cousu Goodyear',
          quantity: 1,
          price: 699,
        }
      ],
      subtotal: 699,
      shippingFee: 0,
      total: 699,
    }),
  });
  const subRes = await postOrder(subOrderReq);
  const subData = await subRes.json();
  assert.strictEqual(subData.success, true, 'POST /api/order should succeed via header detection');
  assert.ok(subData.orderId, 'Order ID should be generated');
  
  // Verify it was assigned to storet1
  const checkReq = new Request('http://localhost:3000/api/admin/orders?store=storet1');
  const checkRes = await getAdminOrders(checkReq);
  const checkData = await checkRes.json();
  const createdOrder = checkData.orders.find((o: any) => o.orderNumber === subData.orderId);
  assert.ok(createdOrder, 'Created order must appear under storet1');
  assert.strictEqual(createdOrder.storeSlug, 'storet1', 'Order storeSlug must match storet1');
  console.log(`  ✓ Order ${subData.orderId} was correctly scoped to "storet1" via subdomain header.\n`);

  // Test 3: Status transition persistence via PATCH /api/admin/orders
  console.log('3. Testing PATCH /api/admin/orders status update...');
  const patchReq = new Request('http://localhost:3000/api/admin/orders', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      storeSlug: 'storet1',
      orderId: 'CMD-6966',
      status: 'confirmed',
    }),
  });
  const patchRes = await patchAdminOrders(patchReq);
  const patchData = await patchRes.json();
  assert.strictEqual(patchData.success, true, 'PATCH /api/admin/orders should succeed');

  const verifyReq = new Request('http://localhost:3000/api/admin/orders?store=storet1');
  const verifyRes = await getAdminOrders(verifyReq);
  const verifyData = await verifyRes.json();
  const updated = verifyData.orders.find((o: any) => o.orderNumber === 'CMD-6966');
  assert.strictEqual(updated?.status, 'confirmed', 'CMD-6966 status must be updated to confirmed');
  console.log('  ✓ Order CMD-6966 status updated to confirmed in database.\n');

  console.log('🎉 ALL LIVE ORDERS & SUBDOMAIN SYNC TESTS PASSED (100% SUCCESS)!\n');
}

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
