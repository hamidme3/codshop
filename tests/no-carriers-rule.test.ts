import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { updateOrderStatus, ORDERS } from '../src/lib/mocks';

console.log('🧪 Starting Permanent "NO CARRIERS IN CODSHOP" Enforcement Tests...\n');

// 1. Verify AGENTS.md contains the permanent rule
console.log('1. Verifying permanent rule in AGENTS.md...');
const agentsMdPath = path.join(process.cwd(), 'AGENTS.md');
const agentsMd = fs.readFileSync(agentsMdPath, 'utf-8');
assert.ok(agentsMd.includes('RULE: NO CARRIERS IN CODSHOP (PERMANENT RULE)'), 'AGENTS.md must define RULE: NO CARRIERS IN CODSHOP');
assert.ok(agentsMd.includes('CODShop does NOT support 3rd-party shipping carriers'), 'Rule must specify no 3rd-party carriers');
console.log('  ✓ AGENTS.md verified: Permanent rule strictly documented.\n');

// 2. Verify carrier-tracking.ts does NOT exist
console.log('2. Verifying carrier-tracking module is removed...');
const carrierTrackingPath = path.join(process.cwd(), 'src/lib/carrier-tracking.ts');
assert.strictEqual(fs.existsSync(carrierTrackingPath), false, 'src/lib/carrier-tracking.ts must not exist');
console.log('  ✓ No carrier-tracking file exists.\n');

// 3. Verify Admin Customers Page has no carrier dropdowns or tracking links
console.log('3. Verifying admin customers page has no carrier UI...');
const customersPagePath = path.join(process.cwd(), 'src/app/(app)/admin/customers/page.tsx');
const customersPage = fs.readFileSync(customersPagePath, 'utf-8');
assert.ok(!customersPage.includes('carrier-tracking'), 'Customers page must not import carrier-tracking');
assert.ok(!customersPage.includes('Transporteur Partenaire'), 'Customers page must not contain a carrier selection dropdown');
assert.ok(!customersPage.includes('ozonexpress.ma'), 'Customers page must not link to external carrier tracking portals');
assert.ok(!customersPage.includes('sendit.ma'), 'Customers page must not link to SendIt portal');
assert.ok(!customersPage.includes('cathedis.net'), 'Customers page must not link to Cathedis portal');
assert.ok(!customersPage.includes('amana-colis.ma'), 'Customers page must not link to Amana portal');
console.log('  ✓ Admin Customers page verified: Free of carrier dropdowns, badges, and external tracking portals.\n');

// 4. Verify Admin Orders Page does not import carrier-tracking or fabricate tracking
console.log('4. Verifying admin orders page does not fabricate carrier tracking...');
const ordersPagePath = path.join(process.cwd(), 'src/app/(app)/admin/orders/page.tsx');
const ordersPage = fs.readFileSync(ordersPagePath, 'utf-8');
assert.ok(!ordersPage.includes('carrier-tracking'), 'Orders page must not import carrier-tracking');
assert.ok(!ordersPage.includes('generateCourierTrackingNumber'), 'Orders page must not call generateCourierTrackingNumber');
console.log('  ✓ Admin Orders page verified: Pure merchant fulfillment transitions.\n');

// 5. Verify Orders API Route does not auto-populate carrier or tracking
console.log('5. Verifying admin orders API route...');
const ordersRoutePath = path.join(process.cwd(), 'src/app/api/admin/orders/route.ts');
const ordersRoute = fs.readFileSync(ordersRoutePath, 'utf-8');
assert.ok(!ordersRoute.includes('carrier-tracking'), 'Orders route must not import carrier-tracking');
assert.ok(!ordersRoute.includes('generateCourierTrackingNumber'), 'Orders route must not call generateCourierTrackingNumber');
console.log('  ✓ Orders API Route verified: Clean status transitions.\n');

// 6. Verify updateOrderStatus transitions without fabricating courier or tracking
console.log('6. Verifying status transitions without carrier fabrication...');
const testOrder = ORDERS.find((o) => o.status === 'confirmed');
if (testOrder) {
  const prevTracking = testOrder.trackingNumber;
  const prevCourier = testOrder.courier;
  updateOrderStatus(testOrder.id, 'shipped');
  assert.strictEqual(testOrder.status, 'shipped', 'Order status must transition to shipped');
  // Neither courier nor trackingNumber should be auto-fabricated if they were not passed
  if (!prevTracking) {
    assert.strictEqual(testOrder.trackingNumber, undefined, 'Must not fabricate trackingNumber');
  }
  if (!prevCourier) {
    assert.strictEqual(testOrder.courier, undefined, 'Must not fabricate courier');
  }
}
console.log('  ✓ updateOrderStatus verified: No carrier or tracking fabrication.\n');

console.log('🎉 ALL "NO CARRIERS IN CODSHOP" PERMANENT RULE TESTS PASSED (100% SUCCESS)!\n');
