import { getProducts, createProduct, updateProduct, deleteProduct, getStoreBySlug } from './src/lib/db-repository';

async function run() {
  const prods = await getProducts('storet1');
  console.log('Products:', prods.map(p => ({ id: p.id, sku: p.sku, title: p.title })));
  
  const created = await createProduct({
    storeSlug: 'storet1',
    title: 'Test Sync Product',
    sku: 'SKU-SYNC-123',
    category: 'Test',
    price: 199,
    costPrice: 99,
    stock: 10,
    images: [],
    variants: [],
    status: 'active'
  });
  console.log('Created:', created.id, created.sku);
  
  const updated = await updateProduct(created.id, { title: 'Updated Title' });
  console.log('Updated:', updated?.title);
  
  const deleted = await deleteProduct(created.id);
  console.log('Deleted:', deleted);
}
run().catch(console.error);
