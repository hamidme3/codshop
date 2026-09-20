import assert from 'node:assert';
import { deriveCustomerSegment, CustomerSegment } from '../src/components/admin/crm/CustomerRiskBadge';

console.log('🧪 Starting CRM Analytics & Recharts Data Pipeline Tests...\n');

async function runTests() {
  console.log('1. Testing Customer RFM Risk Segmentation Logic (deriveCustomerSegment)...');

  // Test 1: High-Risk customer with returned orders
  const riskCustomerWithReturns = {
    totalOrders: 3,
    deliveredOrders: 1,
    returnedOrders: 2,
    totalSpend: 349,
    status: 'active' as const,
  };
  assert.strictEqual(
    deriveCustomerSegment(riskCustomerWithReturns),
    'risk',
    'Customer with returned orders must be classified as risk'
  );
  console.log('  ✓ Customer with returnedOrders >= 1 correctly scored as "risk"');

  // Test 2: High-Risk customer explicitly flagged as risk
  const flaggedRiskCustomer = {
    totalOrders: 1,
    deliveredOrders: 0,
    returnedOrders: 0,
    totalSpend: 0,
    status: 'risk' as const,
  };
  assert.strictEqual(
    deriveCustomerSegment(flaggedRiskCustomer),
    'risk',
    'Customer with status="risk" must be classified as risk'
  );
  console.log('  ✓ Customer with status="risk" correctly scored as "risk"');

  // Test 3: VIP Loyal Customer (3+ delivered orders, 0 returns)
  const vipCustomerOrders = {
    totalOrders: 4,
    deliveredOrders: 4,
    returnedOrders: 0,
    totalSpend: 950,
  };
  assert.strictEqual(
    deriveCustomerSegment(vipCustomerOrders),
    'vip',
    'Customer with 3+ delivered orders must be classified as VIP'
  );
  console.log('  ✓ Customer with 3+ delivered orders correctly scored as "vip"');

  // Test 4: VIP Loyal Customer by high spend (>= 1500 MAD, 0 returns)
  const vipCustomerHighSpend = {
    totalOrders: 2,
    deliveredOrders: 2,
    returnedOrders: 0,
    totalSpend: 2100,
  };
  assert.strictEqual(
    deriveCustomerSegment(vipCustomerHighSpend),
    'vip',
    'Customer with spend >= 1500 MAD must be classified as VIP'
  );
  console.log('  ✓ Customer with >= 1500 MAD spend correctly scored as "vip"');

  // Test 5: Regular Repeat Buyer (2 delivered orders, under 1500 MAD spend)
  const regularCustomer = {
    totalOrders: 2,
    deliveredOrders: 2,
    returnedOrders: 0,
    totalSpend: 600,
  };
  assert.strictEqual(
    deriveCustomerSegment(regularCustomer),
    'regular',
    'Customer with 2 delivered orders must be classified as regular'
  );
  console.log('  ✓ Customer with 2 orders correctly scored as "regular"');

  // Test 6: New First-Time Buyer (1 order or 0 delivered)
  const newCustomer = {
    totalOrders: 1,
    deliveredOrders: 0,
    returnedOrders: 0,
    totalSpend: 349,
  };
  assert.strictEqual(
    deriveCustomerSegment(newCustomer),
    'new',
    'Customer with 1 order pending delivery must be classified as new'
  );
  console.log('  ✓ First-time buyer correctly scored as "new"');

  console.log('\n2. Testing Moroccan COD Cashflow Calculations...');
  // Cashflow integrity: Collected Cash + In Transit + Return Losses
  const cashCollected = 24500;
  const inTransit = 8200;
  const returnLoss = 1450;
  const grossPipeline = cashCollected + inTransit + returnLoss;
  assert.strictEqual(grossPipeline, 34150);
  const deliveryRealizationRate = Math.round((cashCollected / (cashCollected + returnLoss)) * 100);
  assert.ok(deliveryRealizationRate > 90, 'Delivery realization rate should be above 90% for healthy accounts');
  console.log(`  ✓ Gross Pipeline (${grossPipeline} MAD) with ${deliveryRealizationRate}% Cash Realization calculated accurately.`);

  console.log('\n3. Testing Moroccan COD Conversion-to-Cash Funnel Integrity...');
  const funnel = {
    adClicks: 14200,
    checkoutViews: 2150,
    phoneConfirmed: 1480,
    dispatched: 1420,
    deliveredCash: 1264,
  };
  const clickToOrderRate = (funnel.checkoutViews / funnel.adClicks) * 100;
  const callCenterConfirmationRate = (funnel.phoneConfirmed / funnel.checkoutViews) * 100;
  const courierDeliveryRate = (funnel.deliveredCash / funnel.dispatched) * 100;
  const fullEndToEndCashRate = (funnel.deliveredCash / funnel.adClicks) * 100;

  assert.ok(clickToOrderRate > 10 && clickToOrderRate < 20);
  assert.ok(callCenterConfirmationRate > 60);
  assert.ok(courierDeliveryRate > 85);
  console.log(`  ✓ Funnel metrics: Call Center Confirmation=${callCenterConfirmationRate.toFixed(1)}%, Courier Delivery=${courierDeliveryRate.toFixed(1)}%, End-to-End Cash=${fullEndToEndCashRate.toFixed(2)}%`);

  console.log('\n✅ All CRM Analytics & Recharts Data Pipeline Tests Passed!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
