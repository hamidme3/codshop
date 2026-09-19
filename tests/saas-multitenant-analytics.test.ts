import assert from 'node:assert';
import {
  getStorefrontAnalyticsFromDb,
  recordAnalyticsEvent,
  createStore,
  getOrders,
  createOrder,
} from '../src/lib/db-repository';

console.log('🧪 Starting SaaS Multi-Tenant Analytics Verification Tests...\n');

async function runTests() {
  const uniqueId = Date.now();
  const storeSlugA = `store-a-${uniqueId}`;
  const storeSlugB = `store-b-${uniqueId}`;

  console.log(`1. Creating two isolated SaaS stores: "${storeSlugA}" and "${storeSlugB}"...`);
  const storeA = await createStore({
    name: `Store A ${uniqueId}`,
    slug: storeSlugA,
    email: `contact@store-a-${uniqueId}.ma`,
    phone: '0612345678',
  });
  const storeB = await createStore({
    name: `Store B ${uniqueId}`,
    slug: storeSlugB,
    email: `contact@store-b-${uniqueId}.ma`,
    phone: '0687654321',
  });

  assert.ok(storeA && storeA.id, 'Store A must be created');
  assert.ok(storeB && storeB.id, 'Store B must be created');
  console.log(`  ✓ Store A created (ID: ${storeA.id})`);
  console.log(`  ✓ Store B created (ID: ${storeB.id})\n`);

  console.log('2. Verifying brand-new store analytics zero-state for Store A...');
  const initialAnalyticsA = await getStorefrontAnalyticsFromDb(storeSlugA);
  assert.ok(initialAnalyticsA, 'Analytics object must exist');
  assert.strictEqual(initialAnalyticsA.live.activeNow, 0, 'Initial live visitors must be 0');
  assert.strictEqual(initialAnalyticsA.live.inCheckout, 0, 'Initial live checkouts must be 0');
  assert.strictEqual(initialAnalyticsA.funnel.visitors, 0, 'Initial total visitors must be 0');
  assert.strictEqual(initialAnalyticsA.funnel.productViews, 0, 'Initial product views must be 0');
  assert.strictEqual(initialAnalyticsA.funnel.initiatedCheckout, 0, 'Initial initiates must be 0');
  assert.strictEqual(initialAnalyticsA.funnel.ordersCompleted, 0, 'Initial orders must be 0');
  assert.strictEqual(initialAnalyticsA.abandonment.totalAbandoned, 0, 'Initial abandons must be 0');
  assert.strictEqual(initialAnalyticsA.abandonment.recoverableLeads, 0, 'Initial leads must be 0');
  assert.strictEqual(initialAnalyticsA.searches.length, 0, 'Initial searches must be empty');
  console.log('  ✓ Initial Store A analytics strictly show 0 for all metrics (No mock data).\n');

  console.log('3. Recording analytics events strictly for Store A...');
  // 3 page views by 2 distinct visitors
  await recordAnalyticsEvent({ storeSlug: storeSlugA, eventName: '$pageview', properties: { path: `/${storeSlugA}` }, distinctId: 'visitor-1' });
  await recordAnalyticsEvent({ storeSlug: storeSlugA, eventName: '$pageview', properties: { path: `/${storeSlugA}` }, distinctId: 'visitor-2' });
  await recordAnalyticsEvent({ storeSlug: storeSlugA, eventName: 'product_viewed', properties: { productId: 'prod-1', title: 'Article Atlas' }, distinctId: 'visitor-1' });
  // 1 search
  await recordAnalyticsEvent({ storeSlug: storeSlugA, eventName: 'search_performed', properties: { query: 'caftan marocain', resultsCount: 3 }, distinctId: 'visitor-1' });
  // 1 checkout initiation and abandonment
  await recordAnalyticsEvent({ storeSlug: storeSlugA, eventName: 'initiated_checkout', properties: { step: 1, productId: 'prod-1' }, distinctId: 'visitor-2' });
  await recordAnalyticsEvent({ storeSlug: storeSlugA, eventName: 'cod_checkout_abandoned', properties: { step: 2, hasPhone: true, phone: '0612345678' }, distinctId: 'visitor-2' });
  // 1 direct order completed
  await recordAnalyticsEvent({ storeSlug: storeSlugA, eventName: 'order_completed', properties: { orderId: 'ord-test-1', total: 450, channel: 'web' }, distinctId: 'visitor-1' });

  console.log('  ✓ Events recorded for Store A.\n');

  console.log('4. Checking updated analytics for Store A...');
  const updatedAnalyticsA = await getStorefrontAnalyticsFromDb(storeSlugA);
  assert.ok(updatedAnalyticsA, 'Updated analytics must exist');
  assert.strictEqual(updatedAnalyticsA.funnel.visitors, 2, 'Store A should have 2 unique visitors');
  assert.strictEqual(updatedAnalyticsA.funnel.productViews, 1, 'Store A should have 1 product view');
  assert.strictEqual(updatedAnalyticsA.funnel.initiatedCheckout, 1, 'Store A should have 1 checkout initiate');
  assert.strictEqual(updatedAnalyticsA.funnel.ordersCompleted, 1, 'Store A should have 1 order');
  assert.strictEqual(updatedAnalyticsA.abandonment.totalAbandoned, 1, 'Store A should have 1 abandonment');
  assert.strictEqual(updatedAnalyticsA.abandonment.recoverableLeads, 1, 'Store A should have 1 recoverable lead');
  assert.strictEqual(updatedAnalyticsA.searches.length, 1, 'Store A should have 1 recorded search');
  assert.strictEqual(updatedAnalyticsA.searches[0].query, 'caftan marocain', 'Store A search query matches');
  assert.strictEqual(updatedAnalyticsA.channels.webOrders, 1, 'Store A web orders should be 1');
  console.log('  ✓ Store A analytics correctly reflected all recorded events.\n');

  console.log('5. Verifying Store B isolation (Cross-tenant leak prevention)...');
  const analyticsB = await getStorefrontAnalyticsFromDb(storeSlugB);
  assert.ok(analyticsB, 'Store B analytics must exist');
  assert.strictEqual(analyticsB.funnel.visitors, 0, 'Store B visitors must remain 0');
  assert.strictEqual(analyticsB.funnel.ordersCompleted, 0, 'Store B orders must remain 0');
  assert.strictEqual(analyticsB.searches.length, 0, 'Store B searches must remain 0');
  assert.strictEqual(analyticsB.abandonment.totalAbandoned, 0, 'Store B abandons must remain 0');
  console.log('  ✓ Store B metrics are completely isolated from Store A events.\n');

  console.log('🎉 ALL SAAS MULTI-TENANT ANALYTICS TESTS PASSED (100% SUCCESS RATE)!');
}

runTests().catch((err) => {
  console.error('❌ Multi-tenant analytics test failed:', err);
  process.exit(1);
});
