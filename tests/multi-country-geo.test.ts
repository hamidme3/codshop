import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getCountryConfig,
  getCountryCityShipping,
  validateCountryPhone,
  getCountryDeliveryEstimate,
  formatCountryPrice,
  detectClientVisitorCountry,
  SUPPORTED_COUNTRY_MAP,
} from '../src/lib/geo';

describe('Multi-Country Geo Engine & Smart City Selector', () => {
  it('Country Configs: returns Morocco config for "MA" and as default fallback for unknown code', () => {
    const maConfig = getCountryConfig('MA');
    assert.strictEqual(maConfig.code, 'MA');
    assert.strictEqual(maConfig.currency.symbol, 'DH');
    assert.strictEqual(maConfig.phone.dialCode, '+212');
    assert.ok(maConfig.popularCities.includes('Casablanca'));
    assert.ok(maConfig.popularCities.includes('Rabat'));

    // Fallback for null or undefined
    const fallbackConfig = getCountryConfig(undefined);
    assert.strictEqual(fallbackConfig.code, 'MA');

    // Fallback for nonexistent country
    const unknownConfig = getCountryConfig('ZZ');
    assert.strictEqual(unknownConfig.code, 'MA');
  });

  it('Country Configs: returns Saudi Arabia config for "SA"', () => {
    const saConfig = getCountryConfig('SA');
    assert.strictEqual(saConfig.code, 'SA');
    assert.strictEqual(saConfig.currency.symbol, 'SAR');
    assert.strictEqual(saConfig.currency.symbolAr, 'ر.س');
    assert.strictEqual(saConfig.phone.dialCode, '+966');
    assert.ok(saConfig.popularCities.includes('Riyadh'));
    assert.ok(saConfig.popularCities.includes('Jeddah'));
    assert.strictEqual(saConfig.defaultShippingFee, 25);
  });

  it('Country Configs: returns UAE config for "AE"', () => {
    const aeConfig = getCountryConfig('AE');
    assert.strictEqual(aeConfig.code, 'AE');
    assert.strictEqual(aeConfig.currency.symbol, 'AED');
    assert.strictEqual(aeConfig.phone.dialCode, '+971');
    assert.ok(aeConfig.popularCities.includes('Dubai'));
    assert.ok(aeConfig.popularCities.includes('Abu Dhabi'));
  });

  it('Country Configs: returns Egypt config for "EG"', () => {
    const egConfig = getCountryConfig('EG');
    assert.strictEqual(egConfig.code, 'EG');
    assert.strictEqual(egConfig.currency.symbol, 'EGP');
    assert.strictEqual(egConfig.phone.dialCode, '+20');
    assert.ok(egConfig.popularCities.includes('Cairo'));
    assert.ok(egConfig.popularCities.includes('Alexandria'));
  });

  it('Country Configs: returns Senegal (SN) and Côte d\'Ivoire (CI)', () => {
    const snConfig = getCountryConfig('SN');
    assert.strictEqual(snConfig.code, 'SN');
    assert.strictEqual(snConfig.currency.symbol, 'FCFA');
    assert.ok(snConfig.popularCities.includes('Dakar'));

    const ciConfig = getCountryConfig('CI');
    assert.strictEqual(ciConfig.code, 'CI');
    assert.strictEqual(ciConfig.currency.symbol, 'FCFA');
    assert.ok(ciConfig.popularCities.includes('Abidjan'));
  });

  it('City Shipping: accurately resolves known major hubs in Morocco', () => {
    const casa = getCountryCityShipping('MA', 'Casablanca', 100);
    assert.strictEqual(casa.isKnown, true);
    assert.strictEqual(casa.fee, 20);
    assert.ok(casa.sla.includes('24h'));

    const agadir = getCountryCityShipping('MA', 'Agadir', 100);
    assert.strictEqual(agadir.isKnown, true);
    assert.strictEqual(agadir.fee, 35);
  });

  it('City Shipping: safely handles custom or unlisted towns without crashing or returning NaN', () => {
    // User typed custom town "Séfrou" or small village "Douar Oulad Ali"
    const customTown = getCountryCityShipping('MA', 'Séfrou', 100);
    assert.strictEqual(customTown.isKnown, false);
    assert.strictEqual(customTown.fee, 35); // Country default rate
    assert.ok(Number.isFinite(customTown.fee));
    assert.strictEqual(customTown.sla, '24h à 48h partout au Maroc');

    // Blank or empty city input
    const emptyCity = getCountryCityShipping('MA', '', 100);
    assert.ok(Number.isFinite(emptyCity.fee));
    assert.strictEqual(emptyCity.fee, 35);
  });

  it('City Shipping: resolves Saudi Arabia cities and custom towns', () => {
    // Known hub
    const riyadh = getCountryCityShipping('SA', 'Riyadh', 100);
    assert.strictEqual(riyadh.isKnown, true);
    assert.strictEqual(riyadh.fee, 20);

    // Custom town (e.g. Al Ghat)
    const customKsa = getCountryCityShipping('SA', 'Al Ghat', 100);
    assert.strictEqual(customKsa.isKnown, false);
    assert.strictEqual(customKsa.fee, 25); // SA default rate
    assert.strictEqual(customKsa.sla, '2 à 3 jours ouvrables');
  });

  it('City Shipping: triggers free delivery threshold per country', () => {
    // Morocco free shipping threshold is 400 MAD
    const maFree = getCountryCityShipping('MA', 'Oujda', 450);
    assert.strictEqual(maFree.isFree, true);
    assert.strictEqual(maFree.fee, 0);

    // Saudi Arabia free shipping threshold is 200 SAR
    const saFree = getCountryCityShipping('SA', 'Taif', 250);
    assert.strictEqual(saFree.isFree, true);
    assert.strictEqual(saFree.fee, 0);
  });

  it('Phone Validation: validates Moroccan mobile and fixed numbers (06/07/05 or +212)', () => {
    const validMobile = validateCountryPhone('06 61 23 45 67', 'MA');
    assert.strictEqual(validMobile.isValid, true);
    assert.strictEqual(validMobile.cleanPhone, '0661234567');

    const validIntl = validateCountryPhone('+212 700 123456', 'MA');
    assert.strictEqual(validIntl.isValid, true);
    assert.strictEqual(validIntl.cleanPhone, '0700123456');

    const invalid = validateCountryPhone('01 23 45 67 89', 'MA');
    assert.strictEqual(invalid.isValid, false);
  });

  it('Phone Validation: validates Saudi mobile numbers (05X XXX XXXX or +966 5...)', () => {
    const saLocal = validateCountryPhone('050 123 4567', 'SA');
    assert.strictEqual(saLocal.isValid, true);
    assert.strictEqual(saLocal.cleanPhone, '0501234567');

    const saIntl = validateCountryPhone('+966 54 987 6543', 'SA');
    assert.strictEqual(saIntl.isValid, true);
    assert.strictEqual(saIntl.cleanPhone, '0549876543');

    const saInvalid = validateCountryPhone('02 123 4567', 'SA');
    assert.strictEqual(saInvalid.isValid, false);
  });

  it('Phone Validation: validates Egyptian mobile numbers (010/011/012/015 or +20)', () => {
    const egLocal = validateCountryPhone('010 1234 5678', 'EG');
    assert.strictEqual(egLocal.isValid, true);
    assert.strictEqual(egLocal.cleanPhone, '01012345678');

    const egIntl = validateCountryPhone('+20 11 9876 5432', 'EG');
    assert.strictEqual(egIntl.isValid, true);
    assert.strictEqual(egIntl.cleanPhone, '01198765432');
  });

  it('Phone Validation: validates UAE mobile numbers (05X XXX XXXX or +971 5...)', () => {
    const aeMobile = validateCountryPhone('050 123 4567', 'AE');
    assert.strictEqual(aeMobile.isValid, true);
    assert.strictEqual(aeMobile.cleanPhone, '0501234567');
  });

  it('Price Formatting & Delivery Estimates', () => {
    assert.strictEqual(formatCountryPrice(299, 'MA'), '299 DH');
    assert.strictEqual(formatCountryPrice(199, 'SA'), '199 SAR');
    assert.strictEqual(formatCountryPrice(149, 'AE'), '149 AED');
    assert.strictEqual(formatCountryPrice(499, 'EG'), '499 EGP');

    const saEstimate = getCountryDeliveryEstimate('SA', 'Jeddah', 150);
    assert.strictEqual(saEstimate.shippingFee, 20);
    assert.ok(saEstimate.sla.includes('24h'));

    const egEstimate = getCountryDeliveryEstimate('EG', 'Aswan', 100);
    assert.strictEqual(egEstimate.shippingFee, 50);
    assert.strictEqual(egEstimate.sla, '2 à 3 jours ouvrables');
  });

  it('Visitor Country Detection: graceful fallback to default country in SSR or unknown environments', () => {
    assert.strictEqual(detectClientVisitorCountry('MA'), 'MA');
    assert.strictEqual(detectClientVisitorCountry('SA'), 'SA');
  });
});

