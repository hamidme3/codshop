import assert from 'node:assert';
import {
  getLiveVisitorsFromDb,
  getStorefrontAnalyticsFromDb,
  recordAnalyticsEvent,
  createStore,
} from '../src/lib/db-repository';

console.log('🧪 Starting "En cours de checkout - Clients à l\'Étape 2" Telemetry Verification...\n');

async function runTests() {
  const uniqueId = Date.now();
  const testStoreSlug = `step2-test-${uniqueId}`;

  console.log(`1. Setting up test store: "${testStoreSlug}"...`);
  const store = await createStore({
    name: `Step 2 Test Store ${uniqueId}`,
    slug: testStoreSlug,
    email: `contact@${testStoreSlug}.ma`,
    phone: '0612345678',
  });
  assert.ok(store, 'Store should be created');
  console.log('  ✓ Test store created.\n');

  // Test 1: Zero State
  console.log('2. Verifying initial zero state (0 clients à l\'Étape 2)...');
  const initialPresence = await getLiveVisitorsFromDb(testStoreSlug);
  assert.strictEqual(initialPresence.inCheckout, 0, 'Initial inCheckout must be 0');
  const initialAnalytics = await getStorefrontAnalyticsFromDb(testStoreSlug);
  assert.strictEqual(initialAnalytics?.live?.inCheckout, 0, 'Initial analytics live.inCheckout must be 0');
  console.log('  ✓ 0 clients à l\'Étape 2 verified on empty/idle store.\n');

  // Test 2: Visitor views product and enters Step 2
  console.log('3. Simulating visitor entering Checkout Step 2...');
  const visitorId = `visitor-step2-${uniqueId}`;
  await recordAnalyticsEvent({
    storeSlug: testStoreSlug,
    eventName: 'pageview',
    distinctId: visitorId,
    properties: { path: '/product/sac-cuir' },
  });
  await recordAnalyticsEvent({
    storeSlug: testStoreSlug,
    eventName: 'product_viewed',
    distinctId: visitorId,
    properties: { productId: 'p-1', title: 'Sac Cuir Artisanal', price: 450 },
  });
  await recordAnalyticsEvent({
    storeSlug: testStoreSlug,
    eventName: 'checkout_step_2',
    distinctId: visitorId,
    properties: { productId: 'p-1', city: 'Casablanca' },
  });

  const step2Presence = await getLiveVisitorsFromDb(testStoreSlug);
  assert.strictEqual(step2Presence.inCheckout, 1, 'inCheckout must be 1 when visitor enters Step 2');
  const step2Analytics = await getStorefrontAnalyticsFromDb(testStoreSlug);
  assert.strictEqual(step2Analytics?.live?.inCheckout, 1, 'Storefront analytics live.inCheckout must match 1');
  if (step2Analytics?.live?.activeProducts && step2Analytics.live.activeProducts.length > 0) {
    assert.strictEqual(step2Analytics.live.activeProducts[0]?.title, 'Sac Cuir Artisanal');
  }
  console.log('  ✓ Real-time parity verified: 1 client à l\'Étape 2 tracked!\n');

  // Test 3: Visitor completes order -> inCheckout drops back to 0
  console.log('4. Simulating order completion -> verifying inCheckout drops to 0...');
  await recordAnalyticsEvent({
    storeSlug: testStoreSlug,
    eventName: 'order_completed',
    distinctId: visitorId,
    properties: { orderId: `CMD-${uniqueId}`, total: 450 },
  });

  const postOrderPresence = await getLiveVisitorsFromDb(testStoreSlug);
  assert.strictEqual(postOrderPresence.inCheckout, 0, 'inCheckout must reset to 0 upon order completion');
  const postOrderAnalytics = await getStorefrontAnalyticsFromDb(testStoreSlug);
  assert.strictEqual(postOrderAnalytics?.live?.inCheckout, 0, 'Storefront analytics live.inCheckout must reset to 0');
  console.log('  ✓ inCheckout cleanly resets to 0 upon order completed.\n');

  // Test 4: Returning visitor (with past completed order) starts a new checkout session
  console.log('5. Testing returning buyer: starts NEW checkout -> must NOT be blocked by past order...');
  // Sleep 10ms to ensure strictly later timestamp
  await new Promise((r) => setTimeout(r, 20));
  await recordAnalyticsEvent({
    storeSlug: testStoreSlug,
    eventName: 'checkout_step_2',
    distinctId: visitorId,
    properties: { productId: 'p-2', city: 'Rabat' },
  });

  const returningPresence = await getLiveVisitorsFromDb(testStoreSlug);
  assert.strictEqual(returningPresence.inCheckout, 1, 'Returning customer should be counted in checkout for new order');
  const returningAnalytics = await getStorefrontAnalyticsFromDb(testStoreSlug);
  assert.strictEqual(returningAnalytics?.live?.inCheckout, 1, 'Storefront analytics must show 1 for returning customer');
  console.log('  ✓ Returning buyer correctly shows 1 client à l\'Étape 2 for their new session.\n');

  // Test 5: Visitor closes/abandons checkout -> inCheckout drops to 0
  console.log('6. Simulating checkout abandonment/exit...');
  await new Promise((r) => setTimeout(r, 20));
  await recordAnalyticsEvent({
    storeSlug: testStoreSlug,
    eventName: 'cod_checkout_abandoned',
    distinctId: visitorId,
    properties: { step: 2, productId: 'p-2' },
  });

  const abandonedPresence = await getLiveVisitorsFromDb(testStoreSlug);
  assert.strictEqual(abandonedPresence.inCheckout, 0, 'inCheckout must reset to 0 when checkout is abandoned');
  const abandonedAnalytics = await getStorefrontAnalyticsFromDb(testStoreSlug);
  assert.strictEqual(abandonedAnalytics?.live?.inCheckout, 0, 'Storefront analytics must reset to 0 on abandonment');
  console.log('  ✓ Abandonment cleanly clears active checkout session.\n');

  console.log('🎉 ALL "EN COURS DE CHECKOUT" TELEMETRY TESTS PASSED (100% ACCURACY)!');
}

runTests().catch((err) => {
  console.error('❌ Step 2 verification test failed:', err);
  process.exit(1);
});
