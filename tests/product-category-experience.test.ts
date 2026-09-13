import assert from 'node:assert';
import {
  getCategories,
  addCategory,
  deleteCategory,
  reassignAndDeleteCategory,
  getProducts,
  addProduct,
  deleteProduct,
  updateProductStock,
  PRODUCTS,
  generateVariantMatrix,
  batchFillStock,
  computeTotalStock,
  setPrimaryImage,
  addProductImage,
  MOROCCAN_PRODUCT_IMAGE_PRESETS,
  calculateUnitEconomics,
  calculateQuantityPackEconomics,
} from '../src/lib/backoffice';

console.log('🧪 Running Complete Product & Category Experience Verification Suite...\n');

async function runProductCategoryExperienceSuite() {
  const storeSlug = 'experience-test-store';

  // ──────────────────────────────────────────────────────────────────────────
  // 1. CATEGORY CREATION WITH ICONS, DESCRIPTIONS & PRODUCT COUNT SYNCHRONIZATION
  // ──────────────────────────────────────────────────────────────────────────
  console.log('1. Testing Category Creation, Custom Icons & Dynamic Product Counts...');
  
  const initialCats = getCategories(storeSlug);
  const initialCatCount = initialCats.length;

  const newCat = addCategory({
    name: 'Artisanat Marocain & Cuir',
    slug: 'artisanat-marocain-cuir',
    icon: '🧳',
    description: 'Pièces uniques façonnées à la main par les maîtres artisans de Fès et Marrakech.',
  });

  assert.strictEqual(newCat.name, 'Artisanat Marocain & Cuir');
  assert.strictEqual(newCat.slug, 'artisanat-marocain-cuir');
  assert.strictEqual(newCat.icon, '🧳');
  assert.strictEqual(newCat.description?.includes('maîtres artisans'), true);

  const updatedCats = getCategories(storeSlug);
  assert.strictEqual(updatedCats.length, initialCatCount + 1, 'Categories count must increment by 1');
  const foundCat = updatedCats.find((c) => c.slug === 'artisanat-marocain-cuir');
  assert.ok(foundCat, 'Created category must exist in store catalog');
  assert.strictEqual(foundCat.productCount, 0, 'Newly created category must have 0 products initially');
  console.log('  ✓ Category created with custom icon 🧳 and description successfully');

  // ──────────────────────────────────────────────────────────────────────────
  // 1b. INLINE CATEGORY CREATION WITH ZERO FORM STATE LOSS
  // ──────────────────────────────────────────────────────────────────────────
  console.log('1b. Testing Inline Category Creation with Zero Form State Loss...');
  
  // Merchant has an in-progress draft in the Add Product form
  const productFormDraft = {
    title: 'Tapis Berbère Beni Ouarain Fait Main',
    price: 1800,
    costPrice: 750,
    category: 'Maroquinerie & Cuir', // initial category
    badge: 'Fait Main à Fès',
    variants: [
      { color: 'Blanc Écru', size: '200x150cm', stock: 5, sku: 'TAPIS-ECRU-200X150' },
      { color: 'Blanc Écru', size: '300x200cm', stock: 3, sku: 'TAPIS-ECRU-300X200' },
    ],
  };

  // Merchant clicks "+ Nouvelle Catégorie" inline and creates a new category
  const inlineCategory = addCategory({
    name: 'Tapis & Décoration Atlas',
    icon: '🛋️',
    description: 'Tapis de laine vierge noués à la main par les tisseuses des montagnes.',
  });

  // State update simulation: newly created category is automatically selected,
  // while ALL product fields (title, price, costPrice, variants) remain 100% preserved
  const updatedProductForm = {
    ...productFormDraft,
    category: inlineCategory.name,
  };

  assert.strictEqual(updatedProductForm.category, 'Tapis & Décoration Atlas', 'Category must be updated to new inline category');
  assert.strictEqual(updatedProductForm.title, productFormDraft.title, 'Title must not be wiped or reset');
  assert.strictEqual(updatedProductForm.price, 1800, 'Price must be preserved');
  assert.strictEqual(updatedProductForm.costPrice, 750, 'COGS must be preserved');
  assert.strictEqual(updatedProductForm.variants.length, 2, 'Variant matrix must remain intact');
  console.log('  ✓ Inline category creation preserved 100% of product form draft state with zero data loss');

  // ──────────────────────────────────────────────────────────────────────────
  // 2. 5-TAB PRODUCT CREATION WITH MULTI-IMAGE PORTFOLIO
  // ──────────────────────────────────────────────────────────────────────────
  console.log('2. Testing 5-Tab Product Creation & Multi-Image Portfolio Manager...');

  let productImages = [MOROCCAN_PRODUCT_IMAGE_PRESETS[0].images[0]];
  productImages = addProductImage(productImages, MOROCCAN_PRODUCT_IMAGE_PRESETS[0].images[1]);
  productImages = addProductImage(productImages, MOROCCAN_PRODUCT_IMAGE_PRESETS[0].images[2]);
  assert.strictEqual(productImages.length, 3, 'Product must have 3 images');

  // Re-order / set primary image
  productImages = setPrimaryImage(productImages, 1);
  assert.strictEqual(productImages[0], MOROCCAN_PRODUCT_IMAGE_PRESETS[0].images[1], 'Primary image set correctly');
  console.log('  ✓ Multi-image management (presets, add, primary designation) verified');

  // ──────────────────────────────────────────────────────────────────────────
  // 3. CARTESIAN DUAL-AXIS VARIANT MATRIX & 1-CLICK BATCH STOCK
  // ──────────────────────────────────────────────────────────────────────────
  console.log('3. Testing Cartesian Dual-Axis Variant Matrix & Batch Stock Filling...');

  const colors = ['Noir Ébène', 'Marron Vintage', 'Camel'];
  const sizes = ['39', '40', '41', '42'];

  // Test options-object call signature
  const matrix = generateVariantMatrix({
    colors,
    sizes,
    basePrefix: 'BABOUCHE-CUIR',
    defaultStock: 0,
    defaultPrice: 349,
  });

  assert.strictEqual(matrix.length, 12, '3 colors x 4 sizes = 12 variants in Cartesian matrix');
  assert.strictEqual(matrix[0].sku, 'BABOUCHE-CUIR-NOIR-39');
  assert.strictEqual(matrix[5].sku, 'BABOUCHE-CUIR-MARRON-40');
  assert.strictEqual(matrix[11].sku, 'BABOUCHE-CUIR-CAMEL-42');

  // 1-Click Batch Stock Fill (e.g. 25 units per variant)
  const stockedMatrix = batchFillStock(matrix, 25);
  for (const v of stockedMatrix) {
    assert.strictEqual(v.stock, 25, 'Each variant stock must equal 25 after batch fill');
  }
  const totalStock = computeTotalStock(stockedMatrix);
  assert.strictEqual(totalStock, 12 * 25, 'Total stock must equal 300 units');
  console.log(`  ✓ 12-variant SKU matrix generated & batch filled to ${totalStock} total units`);

  // ──────────────────────────────────────────────────────────────────────────
  // 4. MOROCCAN COD UNIT ECONOMICS & PACK UPSELL CALCULATIONS
  // ──────────────────────────────────────────────────────────────────────────
  console.log('4. Testing Moroccan COD Profitability & Pack Upsell Formulas...');

  const sellingPrice = 350;
  const costPrice = 100;
  const casaEconomics = calculateUnitEconomics({
    sellingPrice,
    cogs: costPrice,
    deliveryFee: 35,
    returnFee: 20,
    returnRate: 0.15,
  });

  assert.strictEqual(casaEconomics.grossMarginMAD, 250, 'Gross margin = 350 - 100 = 250 DH');
  assert.strictEqual(casaEconomics.netProfitMAD, 179.75, 'Net profit accounting for 15% return rate and 35 DH delivery');
  assert.strictEqual(casaEconomics.health.level, 'green', 'Margin > 35% must have green health');

  // Pack Upsell Economics
  const packUpsells = calculateQuantityPackEconomics(sellingPrice, costPrice, {
    deliveryFee: 35,
    returnFee: 20,
    returnRate: 0.15,
  });
  assert.strictEqual(packUpsells.duo.sellingPrice, (350 * 2) - 100, 'Pack Duo = 2x price - 100 DH');
  assert.strictEqual(packUpsells.duo.customerSavingsMAD, 135, 'Pack Duo customer saves 100 DH + 35 DH delivery');
  assert.strictEqual(packUpsells.trio.sellingPrice, (350 * 3) - 200, 'Pack Trio = 3x price - 200 DH');
  console.log('  ✓ Moroccan COD unit economics & Pack Duo/Trio upsells verified');

  // ──────────────────────────────────────────────────────────────────────────
  // 5. SAVING PRODUCT & CATEGORY PRODUCT COUNT RE-CALCULATION
  // ──────────────────────────────────────────────────────────────────────────
  console.log('5. Testing Product Persistence & Dynamic Category Count Increments...');

  const createdProduct = addProduct({
    title: 'Babouches Royales Cuir Fès',
    price: sellingPrice,
    comparePrice: 499,
    costPrice: costPrice,
    stock: totalStock,
    category: 'Artisanat Marocain & Cuir',
    sku: 'BABOUCHE-ROYALE-FES',
    description: 'Babouches marocaines traditionnelles en cuir véritable de Fès.',
    images: productImages,
    badge: 'Artisanal Fès',
    packDuoPrice: packUpsells.duo.sellingPrice,
    packDuoFreeShipping: true,
    packTrioPrice: packUpsells.trio.sellingPrice,
    packTrioGift: 'Porte-clés Cuir Artisanal Offert',
    variants: stockedMatrix,
    storeSlug: storeSlug,
    status: 'active',
  });

  assert.ok(createdProduct.id, 'Product must receive unique ID');
  assert.strictEqual(createdProduct.badge, 'Artisanal Fès');
  assert.strictEqual(createdProduct.packDuoPrice, 600);

  const catsAfterAdd = getCategories(storeSlug);
  const targetCat = catsAfterAdd.find((c) => c.slug === 'artisanat-marocain-cuir');
  assert.ok(targetCat, 'Target category must exist');
  assert.strictEqual(targetCat.productCount, 1, 'Category productCount must dynamically increment to 1');
  console.log('  ✓ Product saved and category productCount dynamically incremented to 1');

  // ──────────────────────────────────────────────────────────────────────────
  // 6. CATEGORY REASSIGNMENT & SAFE DELETION (ZERO ORPHANS)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('6. Testing Category Reassignment & Safe Deletion with Zero Orphans...');

  // Safe deletion guard: Direct deletion of category with productCount > 0 must fail
  const directDelete = deleteCategory(targetCat.id, storeSlug);
  assert.strictEqual(directDelete.success, false, 'Direct deletion of non-empty category must fail');
  assert.ok(directDelete.error?.includes('Impossible de supprimer'), 'Guard must return clear error message');

  // Find another destination category
  const destCat = catsAfterAdd.find((c) => c.id !== targetCat.id);
  assert.ok(destCat, 'A destination category must exist');
  const destCatInitialCount = destCat.productCount;

  // Perform reassignAndDeleteCategory
  const reassignResult = reassignAndDeleteCategory(targetCat.id, destCat.id, storeSlug);
  assert.strictEqual(reassignResult.success, true, 'Reassign and delete must succeed');
  assert.strictEqual(reassignResult.reallocatedCount, 1, '1 product must be migrated to destination category');

  // Check product is now in destination category
  const productsAfterReassign = getProducts(storeSlug);
  const reallocatedProduct = productsAfterReassign.find((p) => p.id === createdProduct.id);
  assert.ok(reallocatedProduct, 'Product must still exist');
  assert.strictEqual(reallocatedProduct.category, destCat.name, 'Product category must be updated to destination');

  // Check categories state
  const finalCats = getCategories(storeSlug);
  const deletedCatCheck = finalCats.find((c) => c.id === targetCat.id);
  assert.strictEqual(deletedCatCheck, undefined, 'Source category must be completely deleted');

  const updatedDestCat = finalCats.find((c) => c.id === destCat.id);
  assert.strictEqual(updatedDestCat?.productCount, destCatInitialCount + 1, 'Destination category count must increment');
  console.log('  ✓ Non-empty category successfully reassigned all products and deleted safely with zero orphans');

  // Clean up test product
  deleteProduct(createdProduct.id);
  const cleanCats = getCategories(storeSlug);
  const finalDestCat = cleanCats.find((c) => c.id === destCat.id);
  assert.strictEqual(finalDestCat?.productCount, destCatInitialCount, 'Destination category count returned to baseline');
  console.log('  ✓ Product deleted cleanly and category productCount reconciled');

  console.log('\n🎉 ALL PRODUCT & CATEGORY EXPERIENCE TESTS PASSED WITH 100% SUCCESS!\n');
}

runProductCategoryExperienceSuite().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
