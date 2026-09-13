import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCountryConfig,
  formatCountryPrice,
  validateCountryPhone,
  getCountryCityShipping,
  getCountryDeliveryEstimate,
  normalizePhoneForWhatsApp,
  SUPPORTED_COUNTRIES,
  DEFAULT_COUNTRY_HUBS,
} from '../src/lib/geo';
import { calculateVerifiedShippingFee, verifyAndRecalculateOrder } from '../src/lib/order-pricing';
import { buildWhatsAppLink } from '../src/lib/whatsapp-templates';

test('1. Multi-Country Registry & Config Completeness', () => {
  assert.ok(SUPPORTED_COUNTRIES.length >= 8, 'Expected at least 8 supported countries');

  const expectedCodes = ['MA', 'SA', 'AE', 'EG', 'DZ', 'SN', 'CI', 'FR'];
  for (const code of expectedCodes) {
    const cfg = getCountryConfig(code);
    assert.equal(cfg.code, code);
    assert.ok(cfg.name, `Missing name for ${code}`);
    assert.ok(cfg.currency.code, `Missing currency code for ${code}`);
    assert.ok(cfg.currency.symbol, `Missing currency symbol for ${code}`);
    assert.ok(cfg.popularCities.length > 0, `Missing popular cities for ${code}`);
    assert.ok(cfg.hubSla.hubName, `Missing hubName for ${code}`);
    assert.ok(cfg.hubSla.hubSla, `Missing hubSla for ${code}`);
    assert.ok(cfg.hubSla.nationalName, `Missing nationalName for ${code}`);
    assert.ok(cfg.hubSla.nationalSla, `Missing nationalSla for ${code}`);
    assert.ok(cfg.inspectionBadge.fr, `Missing French inspection badge for ${code}`);
    assert.ok(cfg.inspectionBadge.ar, `Missing Arabic inspection badge for ${code}`);
    assert.ok(cfg.inCountryName, `Missing inCountryName for ${code}`);
    assert.ok(cfg.addressPlaceholder, `Missing addressPlaceholder for ${code}`);
    assert.ok(cfg.agencyPlaceholder, `Missing agencyPlaceholder for ${code}`);
    assert.ok(cfg.pickupPartnerText, `Missing pickupPartnerText for ${code}`);
    assert.ok(DEFAULT_COUNTRY_HUBS[code], `Missing DEFAULT_COUNTRY_HUBS for ${code}`);
  }

  // Fallback for unknown country defaults gracefully to MA
  const unknownCfg = getCountryConfig('XX');
  assert.equal(unknownCfg.code, 'MA');
});

test('2. Multi-Country Currency Formatting (French & Arabic)', () => {
  // Morocco
  assert.equal(formatCountryPrice(299, 'MA', 'fr'), '299 DH');
  assert.ok(formatCountryPrice(299, 'MA', 'ar').includes('299') && formatCountryPrice(299, 'MA', 'ar').includes('د.م.'));

  // Saudi Arabia
  assert.equal(formatCountryPrice(150, 'SA', 'fr'), '150 SAR');
  assert.ok(formatCountryPrice(150, 'SA', 'ar').includes('150') && formatCountryPrice(150, 'SA', 'ar').includes('ر.س'));

  // UAE
  assert.equal(formatCountryPrice(120, 'AE', 'fr'), '120 AED');
  assert.ok(formatCountryPrice(120, 'AE', 'ar').includes('120') && formatCountryPrice(120, 'AE', 'ar').includes('د.إ'));

  // Egypt
  assert.equal(formatCountryPrice(450, 'EG', 'fr'), '450 EGP');
  assert.ok(formatCountryPrice(450, 'EG', 'ar').includes('450') && formatCountryPrice(450, 'EG', 'ar').includes('ج.م'));

  // France (Euro before symbol or after)
  assert.equal(formatCountryPrice(49, 'FR', 'fr'), '49 €');
});

test('3. Localized Hub & National SLAs & Inspection Badges', () => {
  // Saudi Arabia
  const sa = getCountryConfig('SA');
  assert.equal(sa.hubSla.hubName, 'Riyad & Djeddah');
  assert.equal(sa.inspectionBadge.ar, 'افحص شحنتك قبل الدفع');

  // Egypt
  const eg = getCountryConfig('EG');
  assert.equal(eg.hubSla.hubName, 'Le Caire & Alexandrie');
  assert.equal(eg.inspectionBadge.ar, 'عاين أوردرك قبل الاستلام');

  // Morocco
  const ma = getCountryConfig('MA');
  assert.equal(ma.hubSla.hubName, 'Casablanca');
  assert.equal(ma.inspectionBadge.ar, 'عاين سلعتك قبل ما تخلص');
});

test('4. Country-Aware Shipping Calculation & Free Shipping Thresholds', () => {
  // Saudi Arabia: Riyadh is major hub (20 SAR), threshold is 200 SAR
  const saRiyadh = getCountryCityShipping('SA', 'Riyadh', 100);
  assert.equal(saRiyadh.fee, 20);
  assert.equal(saRiyadh.isFree, false);

  const saRiyadhFree = getCountryCityShipping('SA', 'Riyadh', 250);
  assert.equal(saRiyadhFree.fee, 0);
  assert.equal(saRiyadhFree.isFree, true);

  // Saudi Arabia: Remote town fallback to default shipping fee (25 SAR)
  const saRemote = getCountryCityShipping('SA', 'Al Ula', 100);
  assert.equal(saRemote.fee, 25);

  // Egypt: Cairo is 40 EGP, threshold is 500 EGP
  const egCairo = getCountryCityShipping('EG', 'Cairo', 300);
  assert.equal(egCairo.fee, 40);

  const egCairoFree = getCountryCityShipping('EG', 'Cairo', 600);
  assert.equal(egCairoFree.fee, 0);
  assert.equal(egCairoFree.isFree, true);

  // Morocco: Casablanca is 20 DH, threshold is 400 DH
  const maCasa = getCountryCityShipping('MA', 'Casablanca', 200);
  assert.equal(maCasa.fee, 20);

  const maCasaFree = getCountryCityShipping('MA', 'Casablanca', 500);
  assert.equal(maCasaFree.fee, 0);
  assert.equal(maCasaFree.isFree, true);
});

test('5. Multi-Country Phone Validation & Formatting', () => {
  // Saudi Arabia: valid mobile 0501234567, +966501234567
  const saVal1 = validateCountryPhone('0501234567', 'SA');
  assert.equal(saVal1.isValid, true);
  assert.equal(saVal1.cleanPhone, '0501234567');

  const saVal2 = validateCountryPhone('+966 50 123 4567', 'SA');
  assert.equal(saVal2.isValid, true);
  assert.equal(saVal2.cleanPhone, '0501234567');

  const saInvalid = validateCountryPhone('0123456789', 'SA');
  assert.equal(saInvalid.isValid, false);

  // UAE: valid mobile 0501234567
  const aeVal = validateCountryPhone('0501234567', 'AE');
  assert.equal(aeVal.isValid, true);

  // Egypt: valid mobile 01012345678, +201012345678
  const egVal = validateCountryPhone('01012345678', 'EG');
  assert.equal(egVal.isValid, true);
  assert.equal(egVal.cleanPhone, '01012345678');

  // Algeria: valid mobile 0661234567
  const dzVal = validateCountryPhone('0661234567', 'DZ');
  assert.equal(dzVal.isValid, true);

  // Morocco: valid mobile 0661234567, fixed line 0522123456
  const maVal1 = validateCountryPhone('0661234567', 'MA');
  assert.equal(maVal1.isValid, true);

  const maVal2 = validateCountryPhone('0522123456', 'MA');
  assert.equal(maVal2.isValid, true);

  // Morocco rejects foreign numbers when country is MA
  const maForeign = validateCountryPhone('01012345678', 'MA');
  assert.equal(maForeign.isValid, false);
});

test('6. Server-Side Price Verification with Multi-Country Context', async () => {
  // Test Saudi order verification: catalog price 349 >= 200 SAR threshold -> free shipping
  const saOrderPayload = {
    storeSlug: 'ottavio',
    countryCode: 'SA',
    customerName: 'Abdullah Al-Saud',
    customerCity: 'Riyadh',
    customerAddress: 'Al Olaya, King Fahd Rd',
    deliveryType: 'home',
    items: [
      {
        id: 'prod_1',
        title: 'Sac Cuir Artisanal Marrakech',
        quantity: 1,
        price: 349,
      },
    ],
  };

  const saPricing = await verifyAndRecalculateOrder(saOrderPayload, 'ottavio', 'SA');
  assert.equal(saPricing.success, true);
  assert.equal(saPricing.countryCode, 'SA');
  assert.equal(saPricing.city, 'Riyadh');
  assert.equal(saPricing.shippingFee, 0); // Free delivery since 349 >= 200 SAR threshold!
  assert.equal(saPricing.total, 349);

  // Test Egyptian order verification: 349 < 500 EGP threshold -> 40 EGP shipping in Cairo
  const egOrderPayload = {
    storeSlug: 'ottavio',
    countryCode: 'EG',
    customerName: 'Ahmed Mahmoud',
    customerCity: 'Cairo',
    customerAddress: 'Nasr City, Abbas El Akkad',
    deliveryType: 'home',
    items: [
      {
        id: 'prod_1',
        title: 'Sac Cuir Artisanal Marrakech',
        quantity: 1,
        price: 349,
      },
    ],
  };

  const egPricing = await verifyAndRecalculateOrder(egOrderPayload, 'ottavio', 'EG');
  assert.equal(egPricing.success, true);
  assert.equal(egPricing.countryCode, 'EG');
  assert.equal(egPricing.city, 'Cairo');
  assert.equal(egPricing.shippingFee, 40); // 40 EGP in Cairo
  assert.equal(egPricing.total, 349 + 40);
});

test('7. Multi-Country WhatsApp Phone Normalization & Links', () => {
  // Saudi Arabia: 0501234567 -> 966501234567
  const saWa = normalizePhoneForWhatsApp('0501234567', 'SA');
  assert.equal(saWa, '966501234567');

  // Egypt: 01012345678 -> 201012345678
  const egWa = normalizePhoneForWhatsApp('01012345678', 'EG');
  assert.equal(egWa, '201012345678');

  // UAE: 0501234567 -> 971501234567
  const aeWa = normalizePhoneForWhatsApp('0501234567', 'AE');
  assert.equal(aeWa, '971501234567');

  // Morocco: 0661234567 -> 212661234567
  const maWa = normalizePhoneForWhatsApp('0661234567', 'MA');
  assert.equal(maWa, '212661234567');

  // Build WhatsApp Link with countryCode
  const testOrder = {
    id: 'ord_123',
    orderNumber: 'CMD-5544',
    customerName: 'Khalid',
    phone: '0501234567',
    city: 'Riyadh',
    address: 'Olaya St',
    items: [{ id: '1', title: 'Pack Cuir', quantity: 1, price: 250 }],
    subtotal: 250,
    shippingFee: 20,
    total: 270,
    status: 'new' as const,
    country: 'SA',
    createdAt: new Date().toISOString(),
  };

  const link = buildWhatsAppLink(testOrder as any, 'confirmation', 'Boutique Luxe', 'SA');
  assert.ok(link.includes('wa.me/966501234567'), `Expected wa.me/966501234567, got ${link}`);
  assert.ok(link.includes('CMD-5544'));
});
