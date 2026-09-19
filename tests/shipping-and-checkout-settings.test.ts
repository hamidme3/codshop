import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getCityShipping, getDeliveryDateEstimate } from '../src/lib/moroccanCities';
import { getCountryDeliveryEstimate } from '../src/lib/geo/countries';

describe('Logistics & COD Checkout Settings Engine', () => {
  const customSettings = {
    freeShippingThreshold: 400,
    casaFee: 20,
    rabatFee: 25,
    otherCitiesFee: 30,
    deliveryTimeframe: '24h à 48h partout au Maroc',
    checkoutEmailMode: 'optional_collapsed' as const,
  };

  it('calculates zone-based shipping fees correctly for Morocco', () => {
    // 1. Casablanca should use casaFee (20 DH)
    const casaEstimate = getCityShipping('Casablanca', 150, customSettings);
    assert.strictEqual(casaEstimate.fee, 20, 'Casablanca fee should be 20 DH');
    assert.strictEqual(casaEstimate.isFree, false);

    // Also Arabic name for Casablanca
    const casaArEstimate = getCityShipping('الدار البيضاء', 150, customSettings);
    assert.strictEqual(casaArEstimate.fee, 20, 'Arabic Casablanca fee should be 20 DH');

    // 2. Rabat & Region should use rabatFee (25 DH)
    const rabatEstimate = getCityShipping('Rabat', 150, customSettings);
    assert.strictEqual(rabatEstimate.fee, 25, 'Rabat fee should be 25 DH');

    const saleEstimate = getCityShipping('Salé', 150, customSettings);
    assert.strictEqual(saleEstimate.fee, 25, 'Salé fee should be 25 DH');

    const kenitraEstimate = getCityShipping('Kénitra', 150, customSettings);
    assert.strictEqual(kenitraEstimate.fee, 25, 'Kénitra fee should be 25 DH');

    // 3. Other Cities should use otherCitiesFee (30 DH)
    const marrakechEstimate = getCityShipping('Marrakech', 150, customSettings);
    assert.strictEqual(marrakechEstimate.fee, 30, 'Marrakech fee should be 30 DH');

    const fesEstimate = getCityShipping('Fès', 150, customSettings);
    assert.strictEqual(fesEstimate.fee, 30, 'Fès fee should be 30 DH');

    const tangerEstimate = getCityShipping('Tanger', 150, customSettings);
    assert.strictEqual(tangerEstimate.fee, 30, 'Tanger fee should be 30 DH');
  });

  it('applies free shipping when order subtotal meets or exceeds threshold', () => {
    // Below threshold (399 DH) -> normal fee applies
    const belowThreshold = getCityShipping('Casablanca', 399, customSettings);
    assert.strictEqual(belowThreshold.fee, 20);
    assert.strictEqual(belowThreshold.isFree, false);

    // Exact threshold (400 DH) -> 0 DH (Free shipping)
    const exactThreshold = getCityShipping('Casablanca', 400, customSettings);
    assert.strictEqual(exactThreshold.fee, 0);
    assert.strictEqual(exactThreshold.isFree, true);

    // Above threshold (550 DH) in other city -> 0 DH (Free shipping)
    const aboveThreshold = getCityShipping('Marrakech', 550, customSettings);
    assert.strictEqual(aboveThreshold.fee, 0);
    assert.strictEqual(aboveThreshold.isFree, true);
  });

  it('reflects custom delivery timeframe in delivery estimate', () => {
    const estimate = getDeliveryDateEstimate('Casablanca', 200, new Date(), customSettings);
    assert.strictEqual(estimate.sla, customSettings.deliveryTimeframe);
    assert.strictEqual(estimate.shippingFee, 20);
    assert.ok(estimate.formattedEstimate.length > 0);
  });

  it('integrates seamlessly with getCountryDeliveryEstimate for Morocco', () => {
    const estimate = getCountryDeliveryEstimate('MA', 'Rabat', 200, new Date(), customSettings);
    assert.strictEqual(estimate.shippingFee, 25);
    assert.strictEqual(estimate.sla, customSettings.deliveryTimeframe);
    assert.strictEqual(estimate.isFree, false);
  });
});
