import assert from 'node:assert';
import {
  createStore,
  createOrder,
  getCustomers,
  getStorefrontAnalyticsFromDb,
  recordAnalyticsEvent,
} from '../src/lib/db-repository';
import { normalizeCustomerPhone } from '../src/lib/mocks';

console.log('🧪 Starting Reverse-Engineered Telemetry & Identity Bugs Test Suite...\n');

async function runTests() {
  const uniqueId = Date.now();
  const testStoreSlug = `telemetry-sim-${uniqueId}`;

  console.log(`1. Setting up test store: "${testStoreSlug}"...`);
  const store = await createStore({
    name: `Telemetry Sim Store ${uniqueId}`,
    slug: testStoreSlug,
    email: `test@${testStoreSlug}.ma`,
    phone: '0661234567',
  });
  assert.ok(store, 'Store should be created');
  console.log('  ✓ Test store created.\n');

  // =========================================================================
  // Test 1: Phone Normalizer Identity Parity (Bug C)
  // =========================================================================
  console.log('2. Testing CRM Phone Normalization Across Varied Input Formats (Bug C)...');
  assert.strictEqual(normalizeCustomerPhone('+212612345678'), '0612345678');
  assert.strictEqual(normalizeCustomerPhone('00212612345678'), '0612345678');
  assert.strictEqual(normalizeCustomerPhone('212612345678'), '0612345678');
  assert.strictEqual(normalizeCustomerPhone('06 12 34 56 78'), '0612345678');
  assert.strictEqual(normalizeCustomerPhone('+212 6 12-34-56-78'), '0612345678');
  assert.strictEqual(normalizeCustomerPhone('0712345678'), '0712345678');
  assert.strictEqual(normalizeCustomerPhone('+212712345678'), '0712345678');
  console.log('  ✓ normalizeCustomerPhone handles all Moroccan international/national formats.\n');

  // =========================================================================
  // Test 2: CRM Customer Order Aggregation Matching (Bug C)
  // =========================================================================
  console.log('3. Testing CRM Customer Aggregation with Format-Shifted Orders (Bug C)...');
  const karimPhone = `06${Math.floor(10000000 + Math.random() * 90000000)}`;
  const karimIntlPhone = `+212${karimPhone.slice(1)}`;
  // Order 1 with national format
  await createOrder({
    storeSlug: testStoreSlug,
    customerName: 'Karim Bennani',
    phone: karimPhone,
    city: 'Casablanca',
    address: 'Maarif Rue 14',
    items: [{ id: 'p1', title: 'Sac Cuir', price: 400, quantity: 1 }],
    subtotal: 400,
    shippingFee: 0,
    total: 400,
    status: 'delivered',
  });

  // Order 2 with international prefix format
  await createOrder({
    storeSlug: testStoreSlug,
    customerName: 'Karim Bennani',
    phone: karimIntlPhone,
    city: 'Casablanca',
    address: 'Maarif Rue 14',
    items: [{ id: 'p1', title: 'Sac Cuir', price: 300, quantity: 1 }],
    subtotal: 300,
    shippingFee: 0,
    total: 300,
    status: 'delivered',
  });

  const customers = await getCustomers(testStoreSlug);
  const karim = customers.find((c) => normalizeCustomerPhone(c.phone) === karimPhone);
  assert.ok(karim, 'Customer Karim Bennani must be present');
  assert.strictEqual(karim.totalOrders, 2, 'Both format-shifted orders must be aggregated');
  assert.strictEqual(karim.totalSpend, 700, 'Delivered total spend must aggregate accurately to 700 MAD');
  assert.strictEqual(karim.status, 'returning', 'Customer with 2 delivered orders must have returning/VIP status');
  console.log('  ✓ CRM customer orders aggregated flawlessly across format variations.\n');

  // =========================================================================
  // Test 3: Zombie Recoverable Leads Resolution (Bug B)
  // =========================================================================
  console.log('4. Testing Zombie Recoverable Leads Elimination (Bug B)...');
  const prospectPhone = '0699887766';
  const prospectDistinctId = `prospect-${uniqueId}`;

  // Step A: Shopper abandons checkout with phone entered
  await recordAnalyticsEvent({
    storeSlug: testStoreSlug,
    eventName: 'cod_checkout_abandoned',
    distinctId: prospectDistinctId,
    properties: {
      has_phone: true,
      phone: prospectPhone,
      step: 2,
    },
  });

  let analytics = await getStorefrontAnalyticsFromDb(testStoreSlug);
  assert.ok(analytics, 'Analytics must exist');
  assert.strictEqual(
    analytics.abandonment.recoverableLeads,
    1,
    'Unconverted abandonment with phone must count as 1 recoverable lead'
  );

  // Step B: Shopper completes order (or order is confirmed)
  await recordAnalyticsEvent({
    storeSlug: testStoreSlug,
    eventName: 'order_completed',
    distinctId: prospectDistinctId,
    properties: {
      orderId: `CMD-REC-${uniqueId}`,
      total: 350,
      phone: prospectPhone,
    },
  });

  await createOrder({
    storeSlug: testStoreSlug,
    customerName: 'Prospect Converted',
    phone: prospectPhone,
    city: 'Rabat',
    address: 'Agdal',
    items: [{ id: 'p2', title: 'Montre', price: 350, quantity: 1 }],
    subtotal: 350,
    shippingFee: 0,
    total: 350,
    status: 'confirmed',
  });

  analytics = await getStorefrontAnalyticsFromDb(testStoreSlug);
  assert.strictEqual(
    analytics?.abandonment.recoverableLeads,
    0,
    'Converted/completed lead must NOT remain as a zombie recoverable lead'
  );
  console.log('  ✓ Zombie recoverable leads cleanly eliminated once purchase is completed.\n');

  // =========================================================================
  // Test 4: Funnel Visitor Normalization & 100% Conversion Cap (Bug D)
  // =========================================================================
  console.log('5. Testing Funnel Visitor Normalization & Conversion Rate Cap (Bug D)...');
  assert.ok(analytics?.funnel, 'Funnel must exist in analytics');
  assert.ok(
    analytics.funnel.overallConversionRate <= 100,
    `Overall conversion rate must never exceed 100%, got ${analytics.funnel.overallConversionRate}%`
  );
  assert.ok(
    analytics.funnel.visitors >= analytics.funnel.ordersCompleted,
    'Funnel base visitors must be at least equal to completed orders'
  );
  console.log(`  ✓ Funnel conversion rate accurately capped (visitors: ${analytics.funnel.visitors}, orders: ${analytics.funnel.ordersCompleted}, rate: ${analytics.funnel.overallConversionRate}%).\n`);

  console.log('🎉 ALL REVERSE-ENGINEERED TELEMETRY & IDENTITY TESTS PASSED (100% SUITE PASS)!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
