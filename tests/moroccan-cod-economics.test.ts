import assert from 'node:assert';
import {
  calculateUnitEconomics,
  calculateQuantityPackEconomics,
  calculateDailyProfit,
  getMarginHealth,
  MOROCCAN_COD_DEFAULTS,
} from '../src/lib/moroccan-cod-economics';

console.log('🧪 Starting Moroccan COD Economics & Profitability Engine Tests...');

// ── Test 1: Basic Formula Verification (Selling Price = 350 DH, COGS = 100 DH) ──
function testBasicFormulas() {
  console.log('\n--- Test 1: Basic Formulas Verification ---');
  // Inputs:
  // Selling Price = 350 DH
  // COGS = 100 DH
  // Delivery Fee = 35 DH (Casablanca)
  // Return Rate = 15% (0.15)
  // Return Fee = 20 DH
  const result = calculateUnitEconomics({
    sellingPrice: 350,
    cogs: 100,
    deliveryFee: 35,
    returnFee: 20,
    returnRate: 0.15,
  });

  // 1. Gross Margin = 350 - 100 = 250 DH
  assert.strictEqual(result.grossMarginMAD, 250, 'Gross Margin must be 250 DH');
  // Gross Margin % = (250 / 350) * 100 = 71.4%
  assert.strictEqual(result.grossMarginPercent, 71.4, 'Gross Margin % must be 71.4%');

  // 2. Delivered profit = 350 - 100 - 35 = 215 DH
  assert.strictEqual(result.deliveredProfitMAD, 215, 'Delivered profit must be 215 DH');

  // 3. Expected Net Profit:
  // (350 - 100 - 35) * (1 - 0.15) - (20 * 0.15) = 215 * 0.85 - 3 = 182.75 - 3 = 179.75 DH
  assert.strictEqual(result.netProfitMAD, 179.75, 'Net Profit must be exactly 179.75 DH');

  // Net Margin % = (179.75 / 350) * 100 = 51.357% => 51.4%
  assert.strictEqual(result.netMarginPercent, 51.4, 'Net Margin % must be 51.4%');

  // Health: 51.4% > 35% => Green
  assert.strictEqual(result.health.level, 'green', 'Health level must be green');

  // Break-even return rate:
  // R = 215 / (215 + 20) = 215 / 235 = 0.91489 => 91.5%
  assert.strictEqual(result.breakEvenReturnRatePercent, 91.5, 'Break-even return rate must be 91.5%');

  console.log('  ✓ Basic Moroccan COD formulas verified (Gross: 250 DH / 71.4%, Net: 179.75 DH / 51.4%).');
}

// ── Test 2: Hors-Casablanca / National Delivery Rate (45 DH) & 20% Return Rate ──
function testNationalDeliveryAndHighReturn() {
  console.log('\n--- Test 2: National Delivery (45 DH) & 20% Return Rate ---');
  const result = calculateUnitEconomics({
    sellingPrice: 249,
    cogs: 95,
    deliveryFee: MOROCCAN_COD_DEFAULTS.DELIVERY_FEE_NATIONAL, // 45 DH
    returnFee: 20,
    returnRate: 0.20, // 20% return rate
  });

  // Delivered profit = 249 - 95 - 45 = 109 DH
  // Net profit = 109 * 0.80 - 20 * 0.20 = 87.2 - 4 = 83.2 DH
  assert.strictEqual(result.deliveredProfitMAD, 109, 'Delivered profit must be 109 DH');
  assert.strictEqual(result.netProfitMAD, 83.2, 'Net profit must be 83.2 DH');

  // Net margin = (83.2 / 249) * 100 = 33.41% => 33.4% (Amber, between 15% and 35%)
  assert.strictEqual(result.netMarginPercent, 33.4, 'Net margin % must be 33.4%');
  assert.strictEqual(result.health.level, 'amber', 'Health level must be amber for 33.4%');
  console.log('  ✓ National 45 DH delivery & 20% return correctly evaluated as Amber (33.4%).');
}

// ── Test 3: Health Thresholds (Green > 35%, Amber 15-35%, Red < 15%) ──
function testHealthThresholds() {
  console.log('\n--- Test 3: Health Thresholds ---');
  const green = getMarginHealth(36);
  assert.strictEqual(green.level, 'green', '36% must be green');

  const amberEdge = getMarginHealth(35);
  assert.strictEqual(amberEdge.level, 'green', '35% must be green');

  const amber = getMarginHealth(25);
  assert.strictEqual(amber.level, 'amber', '25% must be amber');

  const redEdge = getMarginHealth(14.9);
  assert.strictEqual(redEdge.level, 'red', '14.9% must be red');

  const negative = getMarginHealth(-5);
  assert.strictEqual(negative.level, 'red', 'Negative margin must be red');

  console.log('  ✓ Health thresholds verified (Green >= 35%, Amber 15-35%, Red < 15%).');
}

// ── Test 4: Moroccan Quantity Pack Upsell Economics (Pack Duo & Trio) ──
function testQuantityPacks() {
  console.log('\n--- Test 4: Quantity Pack Upsells (Duo & Trio) ---');
  const basePrice = 300;
  const baseCogs = 80;
  const deliveryFee = 35;
  const returnRate = 0.15;
  const returnFee = 20;

  const packs = calculateQuantityPackEconomics(basePrice, baseCogs, {
    deliveryFee,
    returnFee,
    returnRate,
  });

  // Solo:
  // Price = 300 DH, COGS = 80 DH
  // Delivered profit = 300 - 80 - 35 = 185 DH
  // Net profit = 185 * 0.85 - 20 * 0.15 = 157.25 - 3 = 154.25 DH
  assert.strictEqual(packs.solo.sellingPrice, 300);
  assert.strictEqual(packs.solo.netProfitMAD, 154.25);

  // Duo:
  // Price = (300 * 2) - 100 = 500 DH
  // COGS = 80 * 2 = 160 DH
  // Customer Savings = 100 DH + 35 DH delivery = 135 DH
  // Delivered profit = 500 - 160 - 35 = 305 DH
  // Net profit = 305 * 0.85 - 20 * 0.15 = 259.25 - 3 = 256.25 DH
  assert.strictEqual(packs.duo.sellingPrice, 500, 'Pack Duo selling price must be 500 DH');
  assert.strictEqual(packs.duo.customerSavingsMAD, 135, 'Customer savings must be 135 DH (100 DH + 35 DH delivery)');
  assert.strictEqual(packs.duo.netProfitMAD, 256.25, 'Pack Duo Net Profit must be 256.25 DH');
  assert.ok(packs.duo.netProfitMAD > packs.solo.netProfitMAD, 'Pack Duo net profit must be significantly higher than Solo');
  assert.strictEqual(packs.duo.profitMultiplierVsSolo, 1.7, 'Profit multiplier vs solo must be ~1.7x');

  // Trio:
  // Price = (300 * 3) - 200 = 700 DH
  // COGS = 80 * 3 + 12 (gift) = 252 DH
  // Delivered profit = 700 - 252 - 35 = 413 DH
  // Net profit = 413 * 0.85 - 20 * 0.15 = 351.05 - 3 = 348.05 DH
  assert.strictEqual(packs.trio.sellingPrice, 700, 'Pack Trio selling price must be 700 DH');
  assert.strictEqual(packs.trio.netProfitMAD, 348.05, 'Pack Trio Net Profit must be 348.05 DH');
  assert.ok(packs.trio.perks.some((p) => p.includes('Porte-clés Cuir Artisanal Offert')), 'Perk must include Artisanal Leather Keychain');

  console.log('  ✓ Quantity Pack Upsell calculations verified (Solo: 154.25 DH, Duo: 256.25 DH, Trio: 348.05 DH).');
}

// ── Test 5: Daily Break-even Volume & Profit Thresholds ──
function testDailyVolumeBreakEven() {
  console.log('\n--- Test 5: Daily Break-Even & Profit Thresholds ---');
  // Net profit per order = 100 DH, daily fixed costs = 300 DH
  const daily = calculateDailyProfit(100, 10, 300, 250);

  // Break-even orders = ceil(300 / 100) = 3 orders
  assert.strictEqual(daily.breakEvenOrdersPerDay, 3, 'Break even volume must be 3 orders');
  // Gross revenue at 10 orders = 10 * 250 = 2500 DH
  assert.strictEqual(daily.grossRevenueMAD, 2500);
  // Total net profit = 10 * 100 = 1000 DH
  assert.strictEqual(daily.totalNetProfitMAD, 1000);
  // Net daily profit = 1000 - 300 = 700 DH
  assert.strictEqual(daily.netDailyProfitMAD, 700);

  console.log('  ✓ Daily volume break-even verified (3 orders to break even, +700 DH profit at 10 orders/day).');
}

// ── Test 6: Zero & Edge Cases ──
function testEdgeCases() {
  console.log('\n--- Test 6: Edge Cases & Zero Protection ---');
  const zeroResult = calculateUnitEconomics({
    sellingPrice: 0,
    cogs: 0,
  });
  assert.strictEqual(zeroResult.grossMarginMAD, 0);
  assert.strictEqual(zeroResult.grossMarginPercent, 0);
  assert.strictEqual(zeroResult.netMarginPercent, 0);
  assert.strictEqual(zeroResult.health.level, 'red');

  const zeroDaily = calculateDailyProfit(0, 0, 150);
  assert.strictEqual(zeroDaily.breakEvenOrdersPerDay, 0);

  console.log('  ✓ Zero protection and non-crash verified.');
}

async function runAll() {
  testBasicFormulas();
  testNationalDeliveryAndHighReturn();
  testHealthThresholds();
  testQuantityPacks();
  testDailyVolumeBreakEven();
  testEdgeCases();
  console.log('\n🎉 ALL MOROCCAN COD ECONOMICS TESTS PASSED (100% SUCCESS RATE)!');
}

runAll();
