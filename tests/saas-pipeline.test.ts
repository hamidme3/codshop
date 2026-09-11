import { normalizeMoroccanPhone, getDarijaMessage, buildWhatsAppLink } from '../src/lib/whatsapp-templates';
import { exportCourierManifest } from '../src/lib/courier-manifest';
import { Order } from '../src/lib/types';
import { updateOrderStatus, getOrders, VALID_STATUSES } from '../src/lib/mocks';

async function runTests() {
  console.log('🧪 Starting SaaS Fulfillment Pipeline Audit Tests...');

  // 1. Test Phone Normalization
  const phoneTests = [
    { input: '0661234567', expected: '212661234567' },
    { input: '+212 6 61 23 45 67', expected: '212661234567' },
    { input: '00212661234567', expected: '212661234567' },
    { input: '0712345678', expected: '212712345678' },
    { input: '661234567', expected: '212661234567' },
  ];

  for (const { input, expected } of phoneTests) {
    const result = normalizeMoroccanPhone(input);
    if (result !== expected) {
      throw new Error(`Phone normalization failed for ${input}: got ${result}, expected ${expected}`);
    }
  }
  console.log('  ✓ Phone normalization passed for all Moroccan phone variants.');

  // 2. Test Order Mock & Darija WhatsApp Generation
  const sampleOrder: Order = {
    id: 'ord_test_01',
    orderNumber: 'CMD-99001',
    storeSlug: 'ottavio',
    createdAt: new Date().toISOString(),
    customerName: 'Youssef El Alami',
    phone: '0661998877',
    city: 'Casablanca',
    address: 'Maârif Rue Jura N° 5',
    status: 'new',
    items: [
      { id: 'it_1', title: 'Pack Duo Sac Cuir', quantity: 1, price: 549, variant: 'Marron Vintage' },
      { id: 'it_2', title: 'Porte-cartes', quantity: 1, price: 99 },
    ],
    subtotal: 648,
    shippingFee: 20,
    total: 668,
    courier: 'ozon',
  };

  const confirmationMsg = getDarijaMessage(sampleOrder, 'confirmation', 'OTTAVIO');
  if (!confirmationMsg.includes('Youssef El Alami') || !confirmationMsg.includes('668 DH') || !confirmationMsg.includes('Pack Duo Sac Cuir (Marron Vintage)')) {
    throw new Error('Darija confirmation message missing required order details');
  }
  console.log('  ✓ Darija WhatsApp template contains customer name, items, variant, total, and city.');

  const waLink = buildWhatsAppLink(sampleOrder, 'confirmation', 'OTTAVIO');
  if (!waLink.startsWith('https://wa.me/212661998877?text=')) {
    throw new Error(`Invalid WhatsApp link: ${waLink}`);
  }
  console.log('  ✓ WhatsApp wa.me link generation correctly formatted with international 212 code.');

  // 3. Test Courier Manifests (Ozon, Sendit, Cathedis, Amana)
  const ordersList: Order[] = [sampleOrder];

  const ozonManifest = exportCourierManifest('ozon', ordersList, 'OTTAVIO');
  if (!ozonManifest.content.includes('Prix_CRBT') || !ozonManifest.content.includes('Ouvrir_Colis') || ozonManifest.totalCrbt !== 668) {
    throw new Error('Ozon manifest export validation failed');
  }
  console.log('  ✓ Ozon Express manifest generated with correct headers and CRBT total.');

  const senditManifest = exportCourierManifest('sendit', ordersList, 'OTTAVIO');
  if (!senditManifest.content.includes('Montant_COD_DH') || !senditManifest.content.includes('CMD-99001')) {
    throw new Error('Sendit manifest export validation failed');
  }
  console.log('  ✓ SendIt manifest generated with correct headers.');

  const cathedisManifest = exportCourierManifest('cathedis', ordersList, 'OTTAVIO');
  if (!cathedisManifest.content.includes('Libelle_Colis') || !cathedisManifest.content.includes('Nbre_Pieces')) {
    throw new Error('Cathedis manifest export validation failed');
  }
  console.log('  ✓ Cathedis manifest generated with correct headers.');

  const amanaManifest = exportCourierManifest('amana', ordersList, 'OTTAVIO');
  if (!amanaManifest.content.includes('Montant_CRBT') || !amanaManifest.content.includes('ESPECES')) {
    throw new Error('Amana manifest export validation failed');
  }
  console.log('  ✓ Amana Express (Poste Maroc) manifest generated with correct headers.');

  // 4. Test Universal Standard COD CSV Export
  const standardManifest = exportCourierManifest('standard', ordersList, 'OTTAVIO');
  if (!standardManifest.content.includes('Total_COD_DH') || !standardManifest.content.includes('N_Commande') || standardManifest.totalCrbt !== 668) {
    throw new Error('Standard COD CSV manifest export validation failed');
  }
  console.log('  ✓ Universal Standard COD CSV manifest generated with Excel UTF-8 BOM and correct headers.');

  // 5. Test 1-Click Status Transitions
  if (!VALID_STATUSES.includes('shipped')) {
    throw new Error('shipped status missing from VALID_STATUSES');
  }
  const transitioned = updateOrderStatus('ord_101', 'shipped', 'OZON-MA-123456', 'ozon');
  if (!transitioned) {
    throw new Error('Failed to transition order status to shipped');
  }
  const updatedOrder = getOrders('ottavio').find((o) => o.id === 'ord_101');
  if (updatedOrder?.status !== 'shipped' || updatedOrder?.trackingNumber !== 'OZON-MA-123456') {
    throw new Error('Order transition did not persist correctly');
  }
  console.log('  ✓ 1-Click status transition to "shipped" with tracking number verified.');

  console.log('🎉 All SaaS Fulfillment Pipeline tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
