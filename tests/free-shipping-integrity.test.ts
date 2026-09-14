import assert from 'node:assert';
import {
  getCityShipping,
  getDeliveryDateEstimate,
  getDeliveryDateRange,
  FREE_SHIPPING_THRESHOLD,
} from '../src/lib/moroccanCities';
import {
  calculateVerifiedShippingFee,
  verifyAndRecalculateOrder,
} from '../src/lib/order-pricing';
import { getCountryCityShipping } from '../src/lib/geo';

console.log('🧪 Starting Free Shipping & Delivery Rates Engine Tests...\n');

async function runFreeShippingTests() {
  // 1. Moroccan City Shipping (getCityShipping)
  console.log('1. Testing Moroccan City Shipping Rates under 400 MAD threshold...');
  const casa = getCityShipping('Casablanca', 250);
  assert.strictEqual(casa.fee, 20, 'Casablanca shipping fee should be 20 MAD under 400 MAD');
  assert.strictEqual(casa.isFree, false, 'Casablanca should not be free under 400 MAD');

  const rabat = getCityShipping('Rabat', 300);
  assert.strictEqual(rabat.fee, 25, 'Rabat shipping fee should be 25 MAD under 400 MAD');
  assert.strictEqual(rabat.isFree, false, 'Rabat should not be free under 400 MAD');

  const agadir = getCityShipping('Agadir', 150);
  assert.strictEqual(agadir.fee, 35, 'Agadir shipping fee should be 35 MAD under 400 MAD');
  assert.strictEqual(agadir.isFree, false, 'Agadir should not be free under 400 MAD');

  const ouarzazate = getCityShipping('Ouarzazate', 200);
  assert.strictEqual(ouarzazate.fee, 45, 'Ouarzazate shipping fee should be 45 MAD');

  console.log('  ✓ Standard city rates verified.');

  // 2. Free Shipping Threshold (>= 400 MAD)
  console.log('2. Testing Free Shipping Threshold (>= 400 MAD)...');
  const casaFree = getCityShipping('Casablanca', 400);
  assert.strictEqual(casaFree.fee, 0, 'Subtotal 400 MAD should have 0 MAD shipping');
  assert.strictEqual(casaFree.isFree, true, 'Subtotal 400 MAD isFree should be true');

  const dakhlaFree = getCityShipping('Dakhla', 450);
  assert.strictEqual(dakhlaFree.fee, 0, 'Subtotal 450 MAD in Dakhla should have 0 MAD shipping');
  assert.strictEqual(dakhlaFree.isFree, true);

  console.log('  ✓ Free shipping threshold verified across major & remote cities.');

  // 3. Arabic City Matching
  console.log('3. Testing Arabic City Name Matching...');
  const casaAr = getCityShipping('الدار البيضاء', 200);
  assert.strictEqual(casaAr.fee, 20, 'Arabic Casablanca "الدار البيضاء" should resolve to 20 MAD');
  assert.strictEqual(casaAr.isFree, false);

  const rabatAr = getCityShipping('الرباط', 200);
  assert.strictEqual(rabatAr.fee, 25, 'Arabic Rabat "الرباط" should resolve to 25 MAD');

  const marrakechArFree = getCityShipping('مراكش', 450);
  assert.strictEqual(marrakechArFree.fee, 0, 'Arabic Marrakech with subtotal 450 MAD should be free');
  assert.strictEqual(marrakechArFree.isFree, true);

  console.log('  ✓ Arabic city normalization and matching verified.');

  // 4. City Slug & ID Matching
  console.log('4. Testing City Slug/ID Matching...');
  const casaId = getCityShipping('casablanca', 200);
  assert.strictEqual(casaId.fee, 20);

  const tangerId = getCityShipping('tanger', 200);
  assert.strictEqual(tangerId.fee, 30);

  console.log('  ✓ City ID matching verified.');

  // 5. Safe handling of undefined/empty input
  console.log('5. Testing Undefined and Empty String Safety...');
  const emptyCity = getCityShipping('', 200);
  assert.strictEqual(emptyCity.fee, 35);
  assert.strictEqual(emptyCity.isFree, false);

  const emptyFree = getCityShipping('', 500);
  assert.strictEqual(emptyFree.fee, 0);
  assert.strictEqual(emptyFree.isFree, true);

  const undefinedCity = getCityShipping(undefined as any, 200);
  assert.strictEqual(undefinedCity.fee, 35);
  assert.strictEqual(undefinedCity.isFree, false);

  console.log('  ✓ Undefined/empty city handling verified.');

  // 6. Delivery Date Estimate & Range with Arabic names
  console.log('6. Testing Delivery Date Estimates & Range...');
  const estimate = getDeliveryDateEstimate('الدار البيضاء', 499);
  assert.strictEqual(estimate.isFree, true);
  assert.strictEqual(estimate.shippingFee, 0);
  assert.strictEqual(estimate.cityName, 'Casablanca');

  const rangeCasa = getDeliveryDateRange('الدار البيضاء');
  assert.ok(rangeCasa, 'Range for Arabic Casablanca should be generated');

  const rangeDakhla = getDeliveryDateRange('dakhla');
  assert.ok(rangeDakhla, 'Range for slug dakhla should be generated');

  console.log('  ✓ Delivery date estimates verified.');

  // 7. Server-Side Verified Shipping Engine (calculateVerifiedShippingFee)
  console.log('7. Testing Server-Side calculateVerifiedShippingFee...');
  const stopdesk = calculateVerifiedShippingFee('Casablanca', 99, 1, 'stopdesk');
  assert.strictEqual(stopdesk.shippingFee, 0, 'Stopdesk must always be 0 MAD');
  assert.strictEqual(stopdesk.isFreeShipping, true);

  const duo = calculateVerifiedShippingFee('Casablanca', 198, 2, 'home');
  assert.strictEqual(duo.shippingFee, 0, 'Pack Duo (quantity 2) must receive free shipping');
  assert.strictEqual(duo.isFreeShipping, true);

  const trio = calculateVerifiedShippingFee('Agadir', 297, 3, 'home');
  assert.strictEqual(trio.shippingFee, 0, 'Pack Trio (quantity 3) must receive free shipping');
  assert.strictEqual(trio.isFreeShipping, true);

  const promoTier = calculateVerifiedShippingFee('Casablanca', 150, 1, 'home', true);
  assert.strictEqual(promoTier.shippingFee, 0, 'tierFreeDelivery must grant free shipping');
  assert.strictEqual(promoTier.isFreeShipping, true);

  const aboveThresh = calculateVerifiedShippingFee('Casablanca', 400, 1, 'home', false);
  assert.strictEqual(aboveThresh.shippingFee, 0, 'Subtotal 400 MAD must grant free shipping');
  assert.strictEqual(aboveThresh.isFreeShipping, true);

  const singleCasa = calculateVerifiedShippingFee('Casablanca', 350, 1, 'home', false);
  assert.strictEqual(singleCasa.shippingFee, 20, 'Single item under 400 MAD in Casa charges 20 MAD');
  assert.strictEqual(singleCasa.isFreeShipping, false);

  console.log('  ✓ Server-side shipping rules verified.');

  // 8. International Multi-Country Shipping
  console.log('8. Testing International Multi-Country Shipping Rules...');
  // Saudi Arabia (Threshold 200 SAR, Riyadh hub fee 20 SAR, default fee 25 SAR)
  const saFree = calculateVerifiedShippingFee('Riyadh', 250, 1, 'home', false, 'SA');
  assert.strictEqual(saFree.shippingFee, 0, 'Saudi Arabia subtotal 250 SAR must be free');
  assert.strictEqual(saFree.isFreeShipping, true);

  const saRiyadh = calculateVerifiedShippingFee('Riyadh', 100, 1, 'home', false, 'SA');
  assert.strictEqual(saRiyadh.shippingFee, 20, 'Saudi Arabia Riyadh subtotal 100 SAR charges 20 SAR hub fee');
  assert.strictEqual(saRiyadh.isFreeShipping, false);

  const saNationwide = calculateVerifiedShippingFee('Autre ville', 100, 1, 'home', false, 'SA');
  assert.strictEqual(saNationwide.shippingFee, 25, 'Saudi Arabia default nationwide subtotal 100 SAR charges 25 SAR');
  assert.strictEqual(saNationwide.isFreeShipping, false);

  // UAE (Threshold 150 AED, Dubai hub fee 15 AED, default fee 20 AED)
  const uaeFree = calculateVerifiedShippingFee('Dubai', 180, 1, 'home', false, 'AE');
  assert.strictEqual(uaeFree.shippingFee, 0, 'UAE subtotal 180 AED must be free');
  assert.strictEqual(uaeFree.isFreeShipping, true);

  const uaeDubai = calculateVerifiedShippingFee('Dubai', 100, 1, 'home', false, 'AE');
  assert.strictEqual(uaeDubai.shippingFee, 15, 'UAE Dubai subtotal 100 AED charges 15 AED hub fee');
  assert.strictEqual(uaeDubai.isFreeShipping, false);

  const uaeNationwide = calculateVerifiedShippingFee('Autre Emirat', 100, 1, 'home', false, 'AE');
  assert.strictEqual(uaeNationwide.shippingFee, 20, 'UAE default nationwide subtotal 100 AED charges 20 AED');
  assert.strictEqual(uaeNationwide.isFreeShipping, false);

  console.log('  ✓ International multi-country shipping verified.');

  // 9. Order Pricing Integrity & Tampering Engine (verifyAndRecalculateOrder)
  console.log('9. Testing verifyAndRecalculateOrder Tampering & Free Shipping...');
  // prod_1 price = 349 DH. Pack Duo = 297 * 2 = 594 DH. Free shipping for 2 units.
  const duoOrder = await verifyAndRecalculateOrder({
    storeSlug: 'ottavio',
    customer: { fullName: 'Hamid Benani', phone: '0661234567', city: 'Casablanca' },
    product: { id: 'prod_1', title: 'Sac Cuir Artisanal Marrakech' },
    quantity: 2,
    subtotal: 594,
    shippingFee: 0,
    total: 594,
    freeDelivery: true,
  });

  assert.strictEqual(duoOrder.success, true);
  assert.strictEqual(duoOrder.shippingFee, 0, 'Pack Duo shipping fee must be 0');
  assert.strictEqual(duoOrder.tamperingDetected, false, 'Authentic Pack Duo should not be flagged as tampering');
  assert.strictEqual(duoOrder.total, 594);

  // prod_1 price = 349 DH. Stopdesk pickup gets free shipping (0 MAD).
  const stopdeskOrder = await verifyAndRecalculateOrder({
    storeSlug: 'ottavio',
    customer: { fullName: 'Yassine Alami', phone: '0661234567', city: 'Casablanca' },
    product: { id: 'prod_1', title: 'Sac Cuir Artisanal Marrakech' },
    quantity: 1,
    deliveryType: 'stopdesk',
    subtotal: 349,
    shippingFee: 0,
    total: 349,
  });

  assert.strictEqual(stopdeskOrder.success, true);
  assert.strictEqual(stopdeskOrder.shippingFee, 0);
  assert.strictEqual(stopdeskOrder.tamperingDetected, false);
  assert.strictEqual(stopdeskOrder.total, 349);

  // Fraudulent tampering test: 1 DH total for 349 DH product + 20 DH shipping
  const fraudOrder = await verifyAndRecalculateOrder({
    storeSlug: 'ottavio',
    customer: { fullName: 'Fraudster', phone: '0661234567', city: 'Casablanca' },
    product: { id: 'prod_1', title: 'Sac Cuir Artisanal Marrakech' },
    quantity: 1,
    subtotal: 1,
    shippingFee: 0,
    total: 1,
  });

  assert.strictEqual(fraudOrder.success, true);
  assert.strictEqual(fraudOrder.tamperingDetected, true, '1 DH submission must trigger tamperingDetected');
  assert.strictEqual(fraudOrder.subtotal, 349, 'Authentic subtotal must be recomputed to 349');
  assert.strictEqual(fraudOrder.shippingFee, 20, 'Authentic shipping must be recomputed to 20');
  assert.strictEqual(fraudOrder.total, 369, 'Authentic total must be recomputed to 369');

  console.log('  ✓ Order verification and tampering prevention verified.\n');
  console.log('🎉 ALL FREE SHIPPING & DELIVERY INTEGRITY TESTS PASSED SUCCESSFULLY!');
}

runFreeShippingTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
