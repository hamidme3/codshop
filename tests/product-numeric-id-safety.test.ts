import { convertDbProductToStorefrontProduct } from '../src/lib/db-repository';

async function runTest() {
  console.log('🧪 Testing numeric product ID safety and string coercion...');

  // Test 1: PostgreSQL product with integer ID
  const numericDbProduct = {
    id: 6,
    title: 'Numeric Product Title',
    slug: 'numeric-prod',
    sku: null,
    price: 180,
    storeSlug: 'storet1',
  };

  const converted = convertDbProductToStorefrontProduct(numericDbProduct);

  console.log('1. Converted product ID:', converted.id, typeof converted.id);
  if (typeof converted.id !== 'string') {
    throw new Error(`Expected converted.id to be string, got ${typeof converted.id}`);
  }
  if (converted.id !== '6') {
    throw new Error(`Expected converted.id to be "6", got "${converted.id}"`);
  }
  if (typeof converted.sku !== 'string') {
    throw new Error(`Expected converted.sku to be string, got ${typeof converted.sku}`);
  }

  // Test 2: Slicing on converted.id
  const prefix = converted.id.slice(0, 4);
  console.log('2. Sliced prefix:', prefix);
  if (prefix !== '6') {
    throw new Error(`Expected prefix to be "6", got "${prefix}"`);
  }

  // Test 3: Product with undefined / null sku fallback
  const productNoSku = {
    id: 1042,
    title: 'Atlas Honey',
    slug: 'atlas-honey',
    price: 250,
  };
  const convertedNoSku = convertDbProductToStorefrontProduct(productNoSku);
  console.log('3. Fallback SKU generation:', convertedNoSku.sku);
  if (convertedNoSku.sku !== 'SKU-1042') {
    throw new Error(`Expected fallback SKU "SKU-1042", got "${convertedNoSku.sku}"`);
  }

  // Test 4: Simulating catalog & search SKU / Slug lowercase matching with numeric IDs
  const mockProducts = [converted, convertedNoSku];
  const existingSkus = new Set(mockProducts.map((p) => String(p.sku || p.id).toLowerCase()));
  const existingSlugs = new Set(mockProducts.map((p) => String(p.slug || '').toLowerCase()));

  if (!existingSkus.has('sku-6') && !existingSkus.has('6')) {
    // sku is SKU-6
    if (!existingSkus.has('sku-6')) {
      throw new Error('existingSkus should contain "sku-6"');
    }
  }
  if (!existingSlugs.has('numeric-prod')) {
    throw new Error('existingSlugs should contain "numeric-prod"');
  }

  console.log('✅ ALL PRODUCT NUMERIC ID SAFETY TESTS PASSED (100%)');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
