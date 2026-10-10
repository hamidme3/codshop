import { Metadata } from 'next';
import { getProducts, convertDbProductToStorefrontProduct } from '@/lib/db-repository';
import HomeClient from './HomeClient';
import { headers } from 'next/headers';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'CODShop - Accueil',
  description: 'Votre boutique Cash on Delivery.',
};

export default async function HomePage() {
  const headersList = await headers();
  const storeSlug = headersList.get('x-store-slug') || headersList.get('x-user-store-slug') || '';
  
  let storefrontProducts: any[] = [];
  let puckData = null;

  if (storeSlug) {
    const dbProducts = await getProducts(storeSlug);
    storefrontProducts = dbProducts
      .filter((p: any) => p.status !== 'draft')
      .map((p: any) => convertDbProductToStorefrontProduct(p));
      

    try {
      const db = getDb();
      if (db) {
        const store = await db.query.stores.findFirst({
          where: eq(schema.stores.slug, storeSlug),
          with: { layout: true }
        });
        if (store) {
          const rawSections = store.layout?.sections;
          if (rawSections && !Array.isArray(rawSections) && 'content' in (rawSections as any)) {
            puckData = rawSections;
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch Puck data:', err);
    }

  }
  
  const serializedProducts = JSON.parse(JSON.stringify(storefrontProducts));
  const serializedPuckData = puckData ? JSON.parse(JSON.stringify(puckData)) : null;

  return (
    <HomeClient 
      initialProducts={serializedProducts} 
      initialPuckData={serializedPuckData} 
      storeSlug={storeSlug} 
    />
  );
}
