import assert from 'node:assert';
import {
  normalizeSkuToken,
  deriveBaseSkuPrefix,
  cartesianProduct,
  generateVariantMatrix,
  batchFillStock,
  computeTotalStock,
  setPrimaryImage,
  reorderImages,
  addProductImage,
  removeProductImage,
  MOROCCAN_PRODUCT_IMAGE_PRESETS,
  getCategories,
  addCategory,
  deleteCategory,
  reassignAndDeleteCategory,
  addProduct,
  getProducts,
  deleteProduct,
  PRODUCTS,
} from '../src/lib/backoffice';

console.log('🧪 Starting Variant Matrix, Category Reassignment & Multi-Image Architecture Tests...\n');

async function runArchitectureVerificationSuite() {
  const storeSlug = 'ottavio';

  // ──────────────────────────────────────────────────────────────────────────
  // 1. MULTI-ATTRIBUTE VARIANT MATRIX & CARTESIAN PRODUCT
  // ──────────────────────────────────────────────────────────────────────────
  console.log('1. Testing Multi-attribute Cartesian Product & Variant Matrix Generation...');

  const colors = ['Noir Ébène', 'Marron Vintage', 'Camel'];
  const sizes = ['40', '41', '42', '43'];

  const matrix = generateVariantMatrix(colors, sizes, {
    basePrefix: 'SAC-CUIR',
    productTitle: 'Sacoche Cuir Fès Véritable',
    defaultStock: 10,
    defaultPrice: 349,
  });

  // Verification 1: Matrix length must be exact Cartesian product (3 x 4 = 12)
  assert.strictEqual(matrix.length, 12, 'Matrix length must be 3 x 4 = 12');
  console.log(`  ✓ Computed Cartesian product: ${colors.length} colors x ${sizes.length} sizes = ${matrix.length} variants`);

  // Verification 2: Check SKU generation and normalization
  assert.strictEqual(matrix[0].sku, 'SAC-CUIR-NOIR-40');
  assert.strictEqual(matrix[0].color, 'Noir Ébène');
  assert.strictEqual(matrix[0].size, '40');
  assert.strictEqual(matrix[0].stock, 10);
  assert.strictEqual(matrix[0].price, 349);

  assert.strictEqual(matrix[4].sku, 'SAC-CUIR-MARRON-40');
  assert.strictEqual(matrix[4].color, 'Marron Vintage');
  assert.strictEqual(matrix[4].size, '40');

  assert.strictEqual(matrix[8].sku, 'SAC-CUIR-CAMEL-40');
  assert.strictEqual(matrix[8].color, 'Camel');
  assert.strictEqual(matrix[8].size, '40');

  console.log('  ✓ Clean standard SKUs generated: SAC-CUIR-NOIR-40, SAC-CUIR-MARRON-40, SAC-CUIR-CAMEL-40');

  // Verification 3: Standard single size list with ['Standard'] or ['Unique']
  const singleSizeMatrix = generateVariantMatrix(colors, ['Standard'], {
    basePrefix: 'SAC',
    defaultStock: 15,
  });
  assert.strictEqual(singleSizeMatrix.length, 3, 'Matrix must be 3 x 1 = 3 variants');
  assert.strictEqual(singleSizeMatrix[0].sku, 'SAC-NOIR-STD');
  assert.strictEqual(singleSizeMatrix[1].sku, 'SAC-MARRON-STD');
  assert.strictEqual(singleSizeMatrix[2].sku, 'SAC-CAMEL-STD');
  console.log('  ✓ Single size matrix correctly mapped tokens to STD: SAC-NOIR-STD, SAC-MARRON-STD, SAC-CAMEL-STD');

  // Verification 4: Title-derived prefix (e.g. "Robe Papillon Brodée" -> "ROBE-PAPI-BLEU-M")
  const dressMatrix = generateVariantMatrix(['Bleu Nuit'], ['M', 'L'], {
    productTitle: 'Robe Papillon Brodée Fès',
    defaultStock: 8,
  });
  assert.strictEqual(dressMatrix.length, 2);
  assert.ok(dressMatrix[0].sku?.startsWith('ROBE-PAPI-BLEU-NUIT-M') || dressMatrix[0].sku?.includes('BLEU-NUIT-M'));
  console.log(`  ✓ Title auto-derived SKU generated: ${dressMatrix[0].sku}`);

  // Verification 5: Batch Stock Fill Logic (1-click fill all variants with e.g. 25 units)
  console.log('2. Testing Batch Stock Fill Logic & Reactive Aggregation...');
  const batchFilledAll = batchFillStock(matrix, 25);
  for (const v of batchFilledAll) {
    assert.strictEqual(v.stock, 25, 'All variant stocks must be set to 25');
  }
  const totalStockAll = computeTotalStock(batchFilledAll);
  assert.strictEqual(totalStockAll, 12 * 25, 'Total stock must equal 12 * 25 = 300 units');
  console.log(`  ✓ 1-Click Batch Fill applied 25 units across all 12 variants. Total stock: ${totalStockAll} units.`);

  // Verification 6: Selective batch fill (e.g. fill only size '42' with 50 units)
  const selectiveBatch = batchFillStock(batchFilledAll, 50, { size: '42' });
  const size42Variants = selectiveBatch.filter((v) => v.size === '42');
  const otherVariants = selectiveBatch.filter((v) => v.size !== '42');
  assert.strictEqual(size42Variants.length, 3);
  for (const v of size42Variants) {
    assert.strictEqual(v.stock, 50);
  }
  for (const v of otherVariants) {
    assert.strictEqual(v.stock, 25);
  }
  const selectiveTotal = computeTotalStock(selectiveBatch);
  assert.strictEqual(selectiveTotal, 3 * 50 + 9 * 25, 'Total stock must equal 150 + 225 = 375');
  console.log(`  ✓ Selective Batch Fill correctly targeted only size '42'. Total stock: ${selectiveTotal} units.`);

  // Verification 7: Total Stock computation robustness against NaN, strings, negatives
  const dirtyVariants = [
    { size: '40', stock: 10 },
    { size: '41', stock: ('15' as any) },
    { size: '42', stock: (NaN as any) },
    { size: '43', stock: -5 },
    { size: '44', stock: (null as any) },
  ];
  assert.strictEqual(computeTotalStock(dirtyVariants), 25, 'computeTotalStock must sanitize NaN, strings, and negatives to 25');
  console.log('  ✓ computeTotalStock sanitized dirty/edge inputs correctly.');

  // ──────────────────────────────────────────────────────────────────────────
  // 2. CATEGORY REASSIGNMENT ON DELETION (reassignAndDeleteCategory)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n3. Testing Category Reassignment on Deletion (reassignAndDeleteCategory)...');

  // Setup test categories
  const sourceCategory = addCategory({
    name: 'Artisanat Cuir Test',
    slug: 'artisanat-cuir-test',
  });
  const targetCategory = addCategory({
    name: 'Maroquinerie & Cuir',
    slug: 'maroquinerie',
  });

  const categoriesBefore = getCategories(storeSlug);
  const targetBefore = categoriesBefore.find((c) => c.slug === targetCategory.slug);
  const targetInitialCount = targetBefore ? targetBefore.productCount : 0;

  // Add 3 active products to sourceCategory
  const p1 = addProduct({
    storeSlug,
    title: 'Pochette Cuir Test 1',
    sku: 'TEST-P1',
    category: sourceCategory.name,
    price: 190,
    costPrice: 60,
    stock: 20,
    images: ['https://example.com/p1.jpg'],
    variants: [{ size: 'Unique', stock: 20 }],
    status: 'active',
  });
  const p2 = addProduct({
    storeSlug,
    title: 'Ceinture Cuir Test 2',
    sku: 'TEST-P2',
    category: sourceCategory.name,
    price: 150,
    costPrice: 40,
    stock: 15,
    images: ['https://example.com/p2.jpg'],
    variants: [{ size: 'Unique', stock: 15 }],
    status: 'active',
  });
  const p3 = addProduct({
    storeSlug,
    title: 'Porte-Cartes Test 3',
    sku: 'TEST-P3',
    category: sourceCategory.name,
    price: 99,
    costPrice: 25,
    stock: 30,
    images: ['https://example.com/p3.jpg'],
    variants: [{ size: 'Unique', stock: 30 }],
    status: 'active',
  });

  // Verify source category has 3 active products
  const categoriesWithProducts = getCategories(storeSlug);
  const sourceWithProducts = categoriesWithProducts.find((c) => c.id === sourceCategory.id);
  assert.strictEqual(sourceWithProducts?.productCount, 3, 'Source category must have 3 products');

  // Safety check 1: Standard deleteCategory must block deletion with explanatory error
  const blockedDelete = deleteCategory(sourceCategory.id, storeSlug);
  assert.strictEqual(blockedDelete.success, false);
  assert.ok(
    blockedDelete.error?.includes('still assigned') ||
      blockedDelete.error?.includes('produit(s) y sont encore associés')
  );
  console.log(`  ✓ deleteCategory blocked orphan deletion: "${blockedDelete.error}"`);

  // Safety check 2: Target identical to source must fail
  const selfReassign = reassignAndDeleteCategory(sourceCategory.id, sourceCategory.id, storeSlug);
  assert.strictEqual(selfReassign.success, false);
  assert.ok(
    selfReassign.error?.includes('identical') || selfReassign.error?.includes('identique'),
    'Cannot reassign to same category'
  );
  console.log(`  ✓ Identical source and target reassignment safely blocked: "${selfReassign.error}"`);

  // Perform Safe Reallocation
  const reassignResult = reassignAndDeleteCategory(sourceCategory.id, targetCategory.id, storeSlug);
  assert.strictEqual(reassignResult.success, true, 'Reassignment must succeed');
  assert.strictEqual(reassignResult.reallocatedCount, 3, 'All 3 products must be reallocated');
  console.log(`  ✓ reassignAndDeleteCategory successfully transferred ${reassignResult.reallocatedCount} products.`);

  // Verify product category reassignment in PRODUCTS
  const p1Updated = getProducts(storeSlug).find((p) => p.id === p1.id);
  const p2Updated = getProducts(storeSlug).find((p) => p.id === p2.id);
  const p3Updated = getProducts(storeSlug).find((p) => p.id === p3.id);
  assert.strictEqual(p1Updated?.category, targetCategory.name);
  assert.strictEqual(p2Updated?.category, targetCategory.name);
  assert.strictEqual(p3Updated?.category, targetCategory.name);

  // Verify getCategories() dynamic counts
  const categoriesAfter = getCategories(storeSlug);
  const sourceAfter = categoriesAfter.find((c) => c.id === sourceCategory.id);
  const targetAfter = categoriesAfter.find((c) => c.slug === targetCategory.slug);

  assert.strictEqual(sourceAfter, undefined, 'Source category must be completely deleted');
  assert.strictEqual(
    targetAfter?.productCount,
    targetInitialCount + 3,
    `Target category count must increment by exactly 3 (from ${targetInitialCount} to ${targetInitialCount + 3})`
  );
  console.log(`  ✓ getCategories() accurately reflects target count (${targetAfter?.productCount}) with zero orphans.`);

  // Clean up created test products
  deleteProduct(p1.id);
  deleteProduct(p2.id);
  deleteProduct(p3.id);

  // ──────────────────────────────────────────────────────────────────────────
  // 3. MULTI-IMAGE MANAGEMENT & PRESETS
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n4. Testing Multi-Image Portfolio Management & Moroccan Presets...');

  const initialImages = [
    'https://example.com/img-front.jpg',
    'https://example.com/img-side.jpg',
    'https://example.com/img-detail.jpg',
    'https://example.com/img-model.jpg',
  ];

  // Set image at index 2 (img-detail) as Primary (must move to index 0)
  const afterPrimary = setPrimaryImage(initialImages, 2);
  assert.strictEqual(afterPrimary[0], 'https://example.com/img-detail.jpg', 'img-detail must become index 0 (primary)');
  assert.strictEqual(afterPrimary.length, 4, 'Length must be preserved');
  console.log('  ✓ setPrimaryImage successfully elevated index 2 to primary (index 0).');

  // Reorder images (move index 3 to index 1)
  const afterReorder = reorderImages(afterPrimary, 3, 1);
  assert.strictEqual(afterReorder[1], 'https://example.com/img-model.jpg', 'img-model must be placed at index 1');
  console.log('  ✓ reorderImages successfully repositioned image from index 3 to index 1.');

  // Add new image with deduplication guard
  const afterAdd = addProductImage(afterReorder, 'https://example.com/img-packaging.jpg');
  assert.strictEqual(afterAdd.length, 5);
  const afterDuplicateAdd = addProductImage(afterAdd, 'https://example.com/img-packaging.jpg');
  assert.strictEqual(afterDuplicateAdd.length, 5, 'Duplicate URL addition must be ignored');
  console.log('  ✓ addProductImage handled image addition and deduplication guard.');

  // Remove primary image: next image must become index 0
  const currentPrimary = afterAdd[0];
  const afterRemovePrimary = removeProductImage(afterAdd, 0);
  assert.strictEqual(afterRemovePrimary.length, 4);
  assert.notStrictEqual(afterRemovePrimary[0], currentPrimary, 'New primary must be index 1 from previous array');
  console.log('  ✓ removeProductImage removed primary image and gracefully promoted next image.');

  // Verify Moroccan Presets
  assert.ok(MOROCCAN_PRODUCT_IMAGE_PRESETS.length >= 4, 'Must have at least 4 Moroccan e-commerce presets');
  const leatherPreset = MOROCCAN_PRODUCT_IMAGE_PRESETS.find((p) => p.id === 'leather_craft');
  assert.ok(leatherPreset, 'Maroquinerie preset must exist');
  assert.ok(leatherPreset.images.length >= 3, 'Preset must contain at least 3 high-res images');
  console.log(`  ✓ Verified ${MOROCCAN_PRODUCT_IMAGE_PRESETS.length} curated Moroccan e-commerce presets.`);

  console.log('\n🎉 ALL VARIANT MATRIX, CATEGORY REASSIGNMENT & MULTI-IMAGE TESTS PASSED (0 ERRORS)\n');
}

runArchitectureVerificationSuite().catch((err) => {
  console.error('❌ Test suite error:', err);
  process.exit(1);
});
