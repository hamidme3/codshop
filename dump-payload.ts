import { getPayload } from 'payload';
import config from './src/payload.config';

async function run() {
  const payload = await getPayload({ config });
  const stores = await payload.find({ collection: 'stores' });
  console.log("Stores:", stores.docs.map(s => s.slug));

  for (const store of stores.docs) {
    const products = await payload.find({
      collection: 'products',
      where: { store: { equals: store.id } }
    });
    console.log(`\nStore ${store.slug} has ${products.docs.length} products:`);
    products.docs.forEach(p => console.log(` - ${p.title}`));
  }
  process.exit(0);
}

run();
