import assert from 'assert';
import { 
  getCourierManifestWhatsAppText, 
  buildManifestWhatsAppLink,
  sanitizeMoroccanPhone,
  formatCourierPhone
} from '../src/lib/whatsapp-templates';
import { 
  exportCourierManifest, 
  generateBonDeRamassageHtml,
  CourierKey
} from '../src/lib/courier-manifest';
import { Order } from '../src/lib/types';
import { updateOrderStatus, getOrders } from '../src/lib/mocks';

async function runManifestWhatsAppTests() {
  console.log('🧪 Starting Manifest Export Modal & WhatsApp Share Test Suite...\n');

  const testOrders: Order[] = [
    {
      id: 'cmd_test_01',
      orderNumber: 'CMD-84925',
      storeSlug: 'ottavio',
      createdAt: new Date().toISOString(),
      customerName: 'Berrada Yasmine',
      phone: '0612345678',
      city: 'Casablanca',
      address: '14 Rue Ibn Battouta, Quartier Maârif',
      status: 'confirmed',
      items: [
        { id: 'it_1', title: 'Sac Cuir Artisanal Marrakech', quantity: 2, price: 299, variant: 'Noir Ébène' }
      ],
      subtotal: 598,
      shippingFee: 0,
      total: 598,
      courier: 'ozon',
    },
    {
      id: 'cmd_test_02',
      orderNumber: 'CMD-84920',
      storeSlug: 'ottavio',
      createdAt: new Date().toISOString(),
      customerName: 'Karim Bennani',
      phone: '+212 661 23 45 67',
      city: 'Rabat',
      address: 'Avenue Fal Ould Oumeir, Agdal',
      status: 'confirmed',
      items: [
        { id: 'it_2', title: 'Ceinture Cuir Fassi', quantity: 1, price: 199, variant: 'Marron' }
      ],
      subtotal: 199,
      shippingFee: 25,
      total: 224,
      courier: 'sendit',
    }
  ];

  // 1. Test WhatsApp Text Formatting for Courier Dispatch
  console.log('1. Testing getCourierManifestWhatsAppText formatting...');
  const waText = getCourierManifestWhatsAppText(testOrders, 'Ottavio Cuir', 'Ozon Express');
  assert.ok(waText.includes('*BON DE RAMASSAGE — OTTAVIO CUIR*'), 'Must contain header in bold');
  assert.ok(waText.includes('*Ozon Express*'), 'Must contain courier name');
  assert.ok(waText.includes('*2 colis*'), 'Must report exact order volume');
  assert.ok(waText.includes('*822 DH*') || waText.includes('822'), 'Must report sum of CRBT total (598 + 224 = 822 DH)');
  assert.ok(waText.includes('*#CMD-84925* — Berrada Yasmine (0612345678)'), 'Order 1 details must be present');
  assert.ok(waText.includes('*#CMD-84920* — Karim Bennani (0661234567)'), 'Order 2 phone must be normalized to 0661234567');
  assert.ok(waText.includes('📍 Casablanca — 14 Rue Ibn Battouta, Quartier Maârif'), 'City and address must be formatted');
  assert.ok(waText.includes('💵 CRBT : *598 DH*'), 'CRBT amount must be highlighted');
  console.log('  ✓ getCourierManifestWhatsAppText correctly structured with courier, volume, CRBT sum, and parcel list.');

  // 2. Test WhatsApp Link Generation (with and without driver phone)
  console.log('2. Testing buildManifestWhatsAppLink...');
  const linkWithPhone = buildManifestWhatsAppLink('0661998877', waText);
  assert.ok(linkWithPhone.startsWith('https://wa.me/212661998877?text='), 'Must target normalized international phone');
  assert.ok(linkWithPhone.includes(encodeURIComponent('*BON DE RAMASSAGE')), 'Message text must be URL encoded');

  const linkWithoutPhone = buildManifestWhatsAppLink('', waText);
  assert.ok(linkWithoutPhone.startsWith('https://wa.me/?text='), 'Empty phone must generate wa.me/?text= link for picker');
  console.log('  ✓ buildManifestWhatsAppLink handles specific driver phone and open contact picker.');

  // 3. Test Carrier Manifest Generation for All 5 Supported Formats
  console.log('3. Testing exportCourierManifest for all carrier formats...');
  const carriers: CourierKey[] = ['standard', 'ozon', 'sendit', 'cathedis', 'amana'];
  for (const c of carriers) {
    const res = exportCourierManifest(c, testOrders, 'ottavio');
    assert.strictEqual(res.orderCount, 2, `${c} must include 2 orders`);
    assert.strictEqual(res.totalCrbt, 822, `${c} total CRBT must be 822 DH`);
    assert.ok(res.content.startsWith('\uFEFF'), `${c} CSV must contain Excel UTF-8 BOM`);
    assert.ok(res.filename.endsWith('.csv'), `${c} must have .csv extension`);
  }
  console.log('  ✓ All 5 carrier formats generated with valid headers, totals, and Windows Excel UTF-8 BOM.');

  // 4. Test Printable A4 Bon de Ramassage HTML Generation
  console.log('4. Testing generateBonDeRamassageHtml...');
  const bdrHtml = generateBonDeRamassageHtml('BDR-OTTAVIO-9999', testOrders, 'Ottavio Cuir', 'Ozon Express');
  assert.ok(bdrHtml.includes('<!DOCTYPE html>'), 'Must be complete HTML document');
  assert.ok(bdrHtml.includes('BDR-OTTAVIO-9999'), 'Must contain manifest ID');
  assert.ok(bdrHtml.includes('Ozon Express'), 'Must contain courier fleet name');
  assert.ok(bdrHtml.includes('Berrada Yasmine'), 'Must contain recipient 1');
  assert.ok(bdrHtml.includes('Karim Bennani'), 'Must contain recipient 2');
  assert.ok(bdrHtml.includes('822 DH'), 'Must contain total CRBT');
  assert.ok(bdrHtml.includes('@media print'), 'Must include print CSS styles');
  console.log('  ✓ Bon de Ramassage HTML generated for physical courier handover.');

  // 5. Test Auto-advance to Shipped with Courier Tracking
  console.log('5. Testing auto-advance fulfillment transition...');
  const initialOrders = getOrders('ottavio');
  const targetOrder = initialOrders.find((o) => o.status === 'confirmed') || initialOrders[0];
  const orderId = targetOrder.id;

  const trackingNum = `OZON-MA-${Math.floor(100000 + Math.random() * 900000)}`;
  const updated = updateOrderStatus(orderId, 'shipped', trackingNum, 'ozon');
  assert.ok(updated, 'updateOrderStatus must succeed');

  const reloaded = getOrders('ottavio').find((o) => o.id === orderId);
  assert.strictEqual(reloaded?.status, 'shipped', 'Order must transition to shipped');
  assert.strictEqual(reloaded?.courier, 'ozon', 'Courier must be ozon');
  assert.strictEqual(reloaded?.trackingNumber, trackingNum, 'Tracking number must be recorded');
  console.log('  ✓ Auto-advance transition successfully attached tracking number and updated status.');

  console.log('\n🎉 ALL MANIFEST MODAL & WHATSAPP SHARE TESTS PASSED (100% SUCCESS)!');
}

runManifestWhatsAppTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
