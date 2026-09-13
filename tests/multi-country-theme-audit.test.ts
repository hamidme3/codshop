import test from 'node:test';
import assert from 'node:assert/strict';
import { getProductQuantityTiers } from '../src/lib/mockProducts';
import { getCountryWhatsAppMessage, buildWhatsAppLink, getCourierManifestWhatsAppText } from '../src/lib/whatsapp-templates';
import { getCountryConfig } from '../src/lib/geo';
import { Order } from '../src/lib/types';

test('Multi-Country Theme Audit & Localization Tests', async (t) => {
  await t.test('1. getProductQuantityTiers dynamic currency per country', () => {
    const mockProduct = {
      id: 'prod_test',
      title: 'Test Product',
      price: 100,
      originalPrice: 150,
      stockLeft: 10,
    } as any;

    // Saudi Arabia: should format in SAR / ر.س
    const tiersSA = getProductQuantityTiers(mockProduct, 'SA');
    assert.strictEqual(tiersSA.length, 3);
    assert.ok(tiersSA[1].savingsBadge?.includes('SAR') || tiersSA[1].savingsBadge?.includes('ر.س'), 'Should format Duo savings in SAR');
    assert.ok(tiersSA[2].savingsBadge?.includes('SAR') || tiersSA[2].savingsBadge?.includes('ر.س'), 'Should format Trio savings in SAR');

    // Egypt: should format in EGP / ج.م
    const tiersEG = getProductQuantityTiers(mockProduct, 'EG');
    assert.ok(tiersEG[1].savingsBadge?.includes('EGP') || tiersEG[1].savingsBadge?.includes('ج.م'), 'Should format Duo savings in EGP');

    // Morocco: should format in DH / د.م.
    const tiersMA = getProductQuantityTiers(mockProduct, 'MA');
    assert.ok(tiersMA[1].savingsBadge?.includes('DH') || tiersMA[1].savingsBadge?.includes('د.م.'), 'Should format Duo savings in DH');
  });

  await t.test('2. Country-Aware WhatsApp Message Generation', () => {
    const mockOrderSA: Order = {
      id: 'ord_sa_1',
      orderNumber: 'CMD-9901',
      storeSlug: 'luxury_store',
      createdAt: new Date().toISOString(),
      customerName: 'فهد العتيبي',
      phone: '0512345678',
      city: 'الرياض',
      address: 'حي العليا, شارع الملك فهد',
      status: 'new',
      items: [{ id: '1', title: 'عطر العود الملكي', quantity: 1, price: 350 }],
      subtotal: 350,
      shippingFee: 0,
      total: 350,
      countryCode: 'SA',
      currency: 'SAR',
    };

    // Saudi Arabia confirmation message: Must use Gulf/Standard Arabic and SAR
    const msgSA = getCountryWhatsAppMessage(mockOrderSA, 'confirmation', 'Royal Oud', 'SA');
    assert.ok(msgSA.includes('السلام عليكم ورحمة الله وبركاته'), 'Must contain Gulf greeting');
    assert.ok(msgSA.includes('SAR') || msgSA.includes('ر.س'), 'Must contain SAR currency');
    assert.ok(!msgSA.includes('3afak') && !msgSA.includes('M3ak'), 'Must not contain Moroccan Darija tokens');

    // Egypt confirmation message: Must use Egyptian Arabic and EGP
    const mockOrderEG: Order = {
      ...mockOrderSA,
      orderNumber: 'CMD-9902',
      customerName: 'محمود فهمي',
      phone: '01012345678',
      city: 'القاهرة',
      countryCode: 'EG',
      currency: 'EGP',
    };
    const msgEG = getCountryWhatsAppMessage(mockOrderEG, 'confirmation', 'Cairo Trends', 'EG');
    assert.ok(msgEG.includes('أهلاً بحضرتك'), 'Must contain Egyptian greeting');
    assert.ok(msgEG.includes('أوردرك'), 'Must use Egyptian order word');
    assert.ok(msgEG.includes('EGP') || msgEG.includes('ج.م'), 'Must contain EGP currency');

    // France / Senegal: Must use professional French
    const mockOrderFR: Order = {
      ...mockOrderSA,
      orderNumber: 'CMD-9903',
      customerName: 'Claire Dupont',
      phone: '0612345678',
      city: 'Paris',
      countryCode: 'FR',
      currency: 'EUR',
    };
    const msgFR = getCountryWhatsAppMessage(mockOrderFR, 'confirmation', 'Paris Mode', 'FR');
    assert.ok(msgFR.includes('Bonjour Claire Dupont'), 'Must use French greeting');
    assert.ok(msgFR.includes('Paiement à la livraison'), 'Must use French COD term');

    // Morocco: Must use authentic Moroccan Darija
    const mockOrderMA: Order = {
      ...mockOrderSA,
      orderNumber: 'CMD-9904',
      customerName: 'Amine Benali',
      phone: '0661234567',
      city: 'Casablanca',
      countryCode: 'MA',
      currency: 'MAD',
    };
    const msgMA = getCountryWhatsAppMessage(mockOrderMA, 'confirmation', 'Artisanal Cuir', 'MA');
    assert.ok(msgMA.includes('Salam Amine Benali'), 'Must use Darija greeting');
    assert.ok(msgMA.includes('3la 9bel la commande dialk'), 'Must use Darija phrase');
  });

  await t.test('3. buildWhatsAppLink international dial prefix formatting', () => {
    const orderSA: Order = {
      id: 'ord_sa_wa',
      orderNumber: 'CMD-9905',
      storeSlug: 'store_sa',
      createdAt: new Date().toISOString(),
      customerName: 'سلطان',
      phone: '0551234567',
      city: 'جدة',
      address: 'حي الروضة',
      status: 'new',
      items: [{ id: '1', title: 'منتج تجربة', quantity: 1, price: 200 }],
      subtotal: 200,
      shippingFee: 0,
      total: 200,
      countryCode: 'SA',
      currency: 'SAR',
    };

    const linkSA = buildWhatsAppLink(orderSA, 'confirmation', 'Store SA', 'SA');
    assert.ok(linkSA.startsWith('https://wa.me/966551234567?text='), 'Must format Saudi phone with 966 country code');

    const orderEG: Order = {
      ...orderSA,
      phone: '01123456789',
      countryCode: 'EG',
    };
    const linkEG = buildWhatsAppLink(orderEG, 'confirmation', 'Store EG', 'EG');
    assert.ok(linkEG.startsWith('https://wa.me/201123456789?text='), 'Must format Egyptian phone with 20 country code');

    const orderMA: Order = {
      ...orderSA,
      phone: '0661234567',
      countryCode: 'MA',
    };
    const linkMA = buildWhatsAppLink(orderMA, 'confirmation', 'Store MA', 'MA');
    assert.ok(linkMA.startsWith('https://wa.me/212661234567?text='), 'Must format Moroccan phone with 212 country code');
  });

  await t.test('4. Courier Manifest WhatsApp Text supports multi-country currency and phones', () => {
    const orders: Order[] = [
      {
        id: 'ord_sa_mnf',
        orderNumber: 'CMD-SA-1',
        storeSlug: 'store_sa',
        createdAt: new Date().toISOString(),
        customerName: 'تركي',
        phone: '0501234567',
        city: 'الرياض',
        address: 'شارع الملك فهد',
        status: 'confirmed',
        items: [{ id: '1', title: 'ساعة رجالية', quantity: 1, price: 400 }],
        subtotal: 400,
        shippingFee: 0,
        total: 400,
        countryCode: 'SA',
        currency: 'SAR',
      },
    ];

    const manifestText = getCourierManifestWhatsAppText(orders, 'Saudi Luxury', 'SMSA Express');
    assert.ok(manifestText.includes('SAR'), 'Manifest must use order currency SAR');
    assert.ok(manifestText.includes('966501234567'), 'Manifest must format Saudi phone internationally');
  });

  await t.test('5. Navbar Announcement Dynamic Localization Logic', () => {
    const themeAnnouncement = '🇲🇦 N°1 du Cash on Delivery au Maroc • Livraison Gratuite dès 350 DH • Paiement après inspection';
    const cfgSA = getCountryConfig('SA');
    
    let localized = themeAnnouncement
      .replace(/🇲🇦/g, cfgSA.phone.flag)
      .replace(/au Maroc/gi, cfgSA.inCountryName || 'au Maroc')
      .replace(/(?:dès\s+)?(?:350|400)\s*DH/gi, `dès ${cfgSA.freeShippingThreshold} ${cfgSA.currency.symbol}`);

    assert.ok(localized.includes('🇸🇦'), 'Must replace Moroccan flag with Saudi flag');
    assert.ok(localized.includes('en Arabie Saoudite'), 'Must replace au Maroc with en Arabie Saoudite');
    assert.ok(localized.includes('dès 200 SAR'), 'Must replace 350 DH with 200 SAR');
  });
});
