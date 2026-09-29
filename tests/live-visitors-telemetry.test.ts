import assert from 'node:assert';
import {
  getLiveVisitorsFromDb,
  recordAnalyticsEvent,
  createStore,
} from '../src/lib/db-repository';

console.log('🧪 Starting Live Visitors Telemetry & Isolation Tests...\n');

async function runTests() {
  const uniqueId = Date.now();
  const storeSlugA = `livetest-a-${uniqueId}`;
  const storeSlugB = `livetest-b-${uniqueId}`;

  console.log(`1. Setting up 2 test stores: "${storeSlugA}" and "${storeSlugB}"...`);
  const storeA = await createStore({
    name: `Live Store A ${uniqueId}`,
    slug: storeSlugA,
    email: `contact@${storeSlugA}.ma`,
    phone: '0612345678',
  });
  const storeB = await createStore({
    name: `Live Store B ${uniqueId}`,
    slug: storeSlugB,
    email: `contact@${storeSlugB}.ma`,
    phone: '0687654321',
  });

  assert.ok(storeA, 'Store A should be created');
  assert.ok(storeB, 'Store B should be created');
  console.log('  ✓ Test stores created successfully.\n');

  console.log('2. Verifying initial zero state for Store A...');
  const initialA = await getLiveVisitorsFromDb(storeSlugA);
  assert.strictEqual(initialA.liveVisitors, 0, 'Initial live visitors for fresh store must be 0');
  assert.strictEqual(initialA.inCheckout, 0, 'Initial inCheckout must be 0');
  console.log('  ✓ Initial live visitors is 0 (no hardcoded fake count).\n');

  console.log('3. Recording pageviews for 3 distinct visitors on Store A...');
  await recordAnalyticsEvent({
    storeSlug: storeSlugA,
    eventName: 'pageview',
    distinctId: `vis-1-${uniqueId}`,
    properties: { path: '/' },
  });
  await recordAnalyticsEvent({
    storeSlug: storeSlugA,
    eventName: 'pageview',
    distinctId: `vis-2-${uniqueId}`,
    properties: { path: '/product/babouche' },
  });
  await recordAnalyticsEvent({
    storeSlug: storeSlugA,
    eventName: 'pageview',
    distinctId: `vis-3-${uniqueId}`,
    properties: { path: '/catalog' },
  });

  const updatedA = await getLiveVisitorsFromDb(storeSlugA);
  assert.strictEqual(updatedA.liveVisitors, 3, 'Store A should now have exactly 3 live visitors');
  assert.strictEqual(updatedA.inCheckout, 0, 'None are in checkout yet');
  console.log(`  ✓ Store A live visitors accurately reflects 3 distinct active visitors.\n`);

  console.log('4. Verifying multi-tenant tenant isolation for Store B...');
  const storeBMetrics = await getLiveVisitorsFromDb(storeSlugB);
  assert.strictEqual(storeBMetrics.liveVisitors, 0, 'Store B must have 0 live visitors (no cross-store leaks)');
  console.log('  ✓ Store B remains strictly isolated with 0 visitors.\n');

  console.log('5. Simulating visitor entering checkout flow...');
  await recordAnalyticsEvent({
    storeSlug: storeSlugA,
    eventName: 'initiated_checkout',
    distinctId: `vis-2-${uniqueId}`,
    properties: { step: 1, productId: 'prod-1' },
  });

  const checkoutState = await getLiveVisitorsFromDb(storeSlugA);
  assert.strictEqual(checkoutState.liveVisitors, 3, 'Total active visitors should remain 3');
  assert.strictEqual(checkoutState.inCheckout, 1, 'In-checkout count should now be 1');
  console.log('  ✓ In-checkout count accurately tracks active checkout sessions.\n');

  console.log('6. Simulating order completion for checkout visitor...');
  await recordAnalyticsEvent({
    storeSlug: storeSlugA,
    eventName: 'order_completed',
    distinctId: `vis-2-${uniqueId}`,
    properties: { orderId: `ord-${uniqueId}`, total: 350 },
  });

  const completedState = await getLiveVisitorsFromDb(storeSlugA);
  assert.strictEqual(completedState.inCheckout, 0, 'In-checkout count resets to 0 once order completes');
  console.log('  ✓ In-checkout count cleanly resets upon order submission.\n');

  console.log('🎉 ALL LIVE VISITORS TELEMETRY TESTS PASSED (100% SUCCESS RATE)!');
}

runTests().catch((err) => {
  console.error('❌ Live visitors telemetry test failed:', err);
  process.exit(1);
});
