import { createProduct } from './src/lib/db-repository';

async function main() {
  try {
    const res = await createProduct({
      storeSlug: 'storet1',
      title: 'Test Create Drizzle',
      sku: 'SKU-9999',
      category: 'Test',
      price: 100,
      costPrice: 50,
      stock: 10,
      images: [],
      variants: [],
      status: 'active'
    });
    console.log("Create result:", res);
  } catch (err) {
    console.error("Caught error:", err);
  }
}
main();
