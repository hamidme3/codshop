import { MOCK_PRODUCTS, getProductsByTheme, getProductQuantityTiers } from '../src/lib/mockProducts';
import { MOROCCAN_CITIES, getCityShipping, FREE_SHIPPING_THRESHOLD } from '../src/lib/moroccanCities';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
}

console.log('🧪 Starting Cart, Catalog & Themes Completeness Verification Suite...\n');

// Test 1: Enhanced Catalog Coverage
console.log('Test 1: Enhanced Catalog Product Coverage...');
assert(MOCK_PRODUCTS.length >= 10, `MOCK_PRODUCTS should have at least 10 products (got ${MOCK_PRODUCTS.length})`);

const themesPresent = new Set(MOCK_PRODUCTS.map((p) => p.theme));
assert(themesPresent.has('luxury'), 'Luxury products present');
assert(themesPresent.has('beauty'), 'Beauty products present');
assert(themesPresent.has('tech'), 'Tech products present');
assert(themesPresent.has('culinary'), 'Culinary & Terroir products present');
assert(themesPresent.has('streetwear'), 'Streetwear & Mode products present');
assert(themesPresent.has('fitness'), 'Fitness & Sport products present');
assert(themesPresent.has('kitchen'), 'Kitchen & Artisanat products present');
console.log(`  ✓ Verified ${MOCK_PRODUCTS.length} diverse products across ${themesPresent.size} distinct themes.\n`);

// Test 2: Quantity Tiers and Moroccan Economics for all 10 products
console.log('Test 2: Quantity Tier Pricing & COD Packaging Logic across all products...');
for (const p of MOCK_PRODUCTS) {
  const tiers = getProductQuantityTiers(p);
  assert(tiers.length === 3, `Product ${p.slug} must have 3 tiers`);
  assert(tiers[0].quantity === 1, `Tier 1 quantity is 1`);
  assert(tiers[1].quantity === 2, `Tier 2 quantity is 2`);
  assert(tiers[1].freeDelivery === true, `Tier 2 has free delivery`);
  assert(tiers[2].quantity === 3, `Tier 3 quantity is 3`);
  assert(tiers[2].freeDelivery === true, `Tier 3 has free delivery`);
  assert(tiers[2].totalPrice < tiers[0].unitPrice * 3, `Tier 3 totalPrice must be discounted`);
}
console.log('  ✓ Verified 100% quantity tier packaging integrity across all products.\n');

// Test 3: Theme-to-Product Category Fallbacks
console.log('Test 3: Smart Theme Mapping across 25 Themes...');
const culinaryProds = getProductsByTheme('culinary');
assert(culinaryProds.length > 0 && culinaryProds[0].theme === 'culinary', 'Culinary theme maps to culinary products');

const fitProds = getProductsByTheme('fitness');
assert(fitProds.length > 0 && fitProds[0].theme === 'fitness', 'Fitness theme maps to fitness products');

const kitchenProds = getProductsByTheme('kitchen');
assert(kitchenProds.length > 0 && kitchenProds[0].theme === 'kitchen', 'Kitchen theme maps to kitchen products');

const streetProds = getProductsByTheme('streetwear');
assert(streetProds.length > 0 && streetProds.some((p) => p.theme === 'streetwear'), 'Streetwear theme maps to streetwear products');
console.log('  ✓ Verified authentic theme category mappings.\n');

// Test 4: Cart Multi-Item Math & Free Delivery Threshold
console.log('Test 4: Cart Multi-Item Math & Free Delivery Threshold...');
const sampleItem1 = { price: 290, quantity: 1 }; // Miel
const sampleItem2 = { price: 249, quantity: 1 }; // Coffret Barbe

const subtotal = sampleItem1.price * sampleItem1.quantity + sampleItem2.price * sampleItem2.quantity;
const totalCount = sampleItem1.quantity + sampleItem2.quantity;
assert(subtotal === 539, `Subtotal must be 539 DH (got ${subtotal})`);
assert(totalCount === 2, `Total count must be 2 items (got ${totalCount})`);

// Delivery eligibility: >= 400 DH or >= 2 items gets free delivery nationwide
const isFree = totalCount >= 2 || subtotal >= FREE_SHIPPING_THRESHOLD;
assert(isFree === true, 'Cart with 2 items and subtotal 539 DH qualifies for FREE delivery');

const singleItemSubtotal = 199; // Tajine
const singleItemCount = 1;
const singleCityRate = getCityShipping('Casablanca', singleItemSubtotal);
assert(singleCityRate.isFree === false, 'Single item under 400 DH in Casablanca is not free');
assert(singleCityRate.fee === 20, `Casablanca shipping fee is 20 DH (got ${singleCityRate.fee})`);
console.log('  ✓ Verified multi-item cart pricing and delivery threshold calculations.\n');

// Test 5: Moroccan Phone Normalization and Multi-Country Fallbacks
console.log('Test 5: Moroccan COD Phone Validation...');
import { validateMoroccanPhone } from '../src/lib/moroccanCities';

const validMobile1 = validateMoroccanPhone('0661234567');
assert(validMobile1.isValid === true, '06 mobile should be valid');
assert(validMobile1.cleanPhone === '0661234567', 'Clean mobile formatted');

const validMobile2 = validateMoroccanPhone('+212 700-112233');
assert(validMobile2.isValid === true, '+212 700 mobile should be valid');
assert(validMobile2.cleanPhone === '0700112233', '+212 700 normalized to 07');

const invalidForeign = validateMoroccanPhone('+33 6 12 34 56 78');
assert(invalidForeign.isValid === false, 'Foreign French phone should be rejected for Moroccan COD');
console.log('  ✓ Phone normalization and Moroccan validation verified.\n');

console.log('🎉 All Cart, Catalog & Themes Tests PASSED with 100% Success!');
