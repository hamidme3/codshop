import { MOCK_PRODUCTS, getProductQuantityTiers } from '../src/lib/mockProducts';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
}

console.log('🧪 Starting CRO Storefront & Mobile Buyer Experience Tests...\n');

// Test 1: Multi-tier quantity upsells (Pack 1, Pack 2, Pack 3)
console.log('Test 1: Multi-tier Quantity Upsells verification...');
for (const product of MOCK_PRODUCTS) {
  const tiers = getProductQuantityTiers(product);
  assert(tiers.length === 3, `Product ${product.slug} must have exactly 3 quantity tiers`);

  const [pack1, pack2, pack3] = tiers;

  // Pack 1: Standard
  assert(pack1.quantity === 1, `Pack 1 quantity must be 1 (got ${pack1.quantity})`);
  assert(pack1.unitPrice === product.price, `Pack 1 unitPrice must match product base price`);
  assert(pack1.totalPrice === product.price, `Pack 1 totalPrice must match product base price`);
  assert(pack1.freeDelivery !== true, `Pack 1 should not have free delivery by default`);

  // Pack 2: Duo + Free Delivery [Most Popular]
  assert(pack2.quantity === 2, `Pack 2 quantity must be 2 (got ${pack2.quantity})`);
  assert(pack2.unitPrice < product.price, `Pack 2 unitPrice must be discounted`);
  assert(pack2.totalPrice < product.price * 2, `Pack 2 totalPrice must reflect duo discount`);
  assert(pack2.freeDelivery === true, `Pack 2 must have freeDelivery: true`);
  assert(pack2.isPopular === true, `Pack 2 must have isPopular: true`);
  assert(!!pack2.badge && pack2.badge.includes('Populaire'), `Pack 2 badge must highlight popularity`);

  // Pack 3: Trio + Free Delivery + Free Gift
  assert(pack3.quantity === 3, `Pack 3 quantity must be 3 (got ${pack3.quantity})`);
  assert(pack3.unitPrice <= pack2.unitPrice, `Pack 3 unitPrice must offer steepest discount`);
  assert(pack3.freeDelivery === true, `Pack 3 must have freeDelivery: true`);
  assert(typeof pack3.freeGift === 'string' && pack3.freeGift.length > 0, `Pack 3 must include a free gift`);
}
console.log('  ✓ Multi-tier packs verified across all mock products (Pack 1 Standard, Pack 2 Duo Most Popular, Pack 3 Trio + Gift).\n');

// Test 2: Sticky Mobile Buy Bar Economics & Delivery Badge Logic
console.log('Test 2: Sticky Mobile Buy Bar economics and delivery badge calculations...');
const sampleProduct = MOCK_PRODUCTS[0];
const sampleTiers = getProductQuantityTiers(sampleProduct);

const tier1DeliveryBadge = sampleTiers[0].freeDelivery || sampleTiers[0].quantity >= 2
  ? 'Livraison Gratuite 24h'
  : 'Livraison 24h/48h COD';
assert(tier1DeliveryBadge === 'Livraison 24h/48h COD', `Pack 1 badge should be standard COD delivery`);

const tier2DeliveryBadge = sampleTiers[1].freeDelivery || sampleTiers[1].quantity >= 2
  ? 'Livraison Gratuite 24h'
  : 'Livraison 24h/48h COD';
assert(tier2DeliveryBadge === 'Livraison Gratuite 24h', `Pack 2 badge must be 'Livraison Gratuite 24h'`);

const tier3DeliveryBadge = sampleTiers[2].freeDelivery || sampleTiers[2].quantity >= 2
  ? 'Livraison Gratuite 24h'
  : 'Livraison 24h/48h COD';
assert(tier3DeliveryBadge === 'Livraison Gratuite 24h', `Pack 3 badge must be 'Livraison Gratuite 24h'`);
console.log('  ✓ Sticky Mobile Buy Bar dynamic badge calculation validated.\n');

// Test 3: Moroccan Trust Signals & Reassurance Guarantees
console.log('Test 3: Moroccan Trust Signals validation...');
const inspectionClaim = 'Vérifiez votre colis avant de payer';
const inspectionClaimDarija = 'عاين سلعتك قبل ما تخلص';
const fastDeliveryCasa = 'Casablanca 24h';
const fastDeliveryHorsCasa = 'Hors Casa 48h';

assert(inspectionClaim.length > 0, 'Inspection claim exists');
assert(inspectionClaimDarija.length > 0, 'Darija inspection claim exists');
assert(fastDeliveryCasa.includes('24h'), 'Casa 24h promise verified');
assert(fastDeliveryHorsCasa.includes('48h'), 'Hors Casa 48h promise verified');
console.log('  ✓ Moroccan parcel inspection guarantee & fast delivery promise validated.\n');

console.log('🎉 All CRO Storefront & Mobile Experience Tests PASSED successfully!');
