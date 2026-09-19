/**
 * Migration Script: Drizzle Products -> Payload CMS
 *
 * Copies products from Drizzle's public.products into Payload's products collection,
 * ensuring seamless transition to Payload as the single source of truth for products.
 */

import { getDb, schema } from '../src/db';
import { eq } from 'drizzle-orm';

async function migrateProducts() {
  console.log('[Migration] Starting product migration to Payload CMS...');

  const db = getDb();
  if (!db) {
    console.log('[Migration] No active Postgres database connection. Skipping migration.');
    return;
  }

  // Lazy load Payload to avoid compilation-phase side effects
  const { getPayload } = await import('payload');
  const configPromise = (await import('../src/payload.config')).default;
  const payload = await getPayload({ config: configPromise });

  // 1. Fetch all Drizzle products
  const drizzleProducts = await db.select().from(schema.products);
  console.log(`[Migration] Found ${drizzleProducts.length} products in public.products`);

  if (drizzleProducts.length === 0) {
    console.log('[Migration] No products found in public.products to migrate.');
    return;
  }

  // 2. Fetch all stores for slug lookup
  const allStores = await db.select().from(schema.stores);
  const storeMap = new Map<string, string>(); // storeId -> storeSlug
  for (const s of allStores) {
    storeMap.set(s.id, s.slug);
  }

  let migratedCount = 0;
  let skippedCount = 0;

  for (const prod of drizzleProducts) {
    const storeSlug = storeMap.get(prod.storeId) || 'ottavio';

    // Find store in Payload
    let payloadStoreId: string | number | undefined;
    try {
      const storeResult = await payload.find({
        collection: 'stores',
        where: { slug: { equals: storeSlug } },
        depth: 0,
        overrideAccess: true,
        limit: 1,
      });

      if (storeResult.docs.length > 0) {
        payloadStoreId = storeResult.docs[0].id;
      } else {
        // Create store in Payload if it doesn't exist
        const createdStore = await payload.create({
          collection: 'stores',
          data: {
            name: storeSlug,
            slug: storeSlug,
            subdomain: storeSlug,
            currency: 'MAD',
            planTier: 'starter',
          } as any,
          overrideAccess: true,
        });
        payloadStoreId = createdStore.id;
      }
    } catch (storeErr) {
      console.warn(`[Migration] Could not resolve store for slug "${storeSlug}":`, storeErr);
    }

    // Check if product already exists in Payload by SKU
    try {
      const existing = await payload.find({
        collection: 'products',
        where: { sku: { equals: prod.sku } },
        depth: 0,
        overrideAccess: true,
        limit: 1,
      });

      if (existing.docs.length > 0) {
        console.log(`  [Skip] Product with SKU "${prod.sku}" already exists in Payload (id: ${existing.docs[0].id})`);
        skippedCount++;
        continue;
      }

      // Create product in Payload
      const newDoc = await payload.create({
        collection: 'products',
        data: {
          title: prod.title,
          sku: prod.sku,
          store: payloadStoreId,
          category: prod.category || 'General',
          price: Number(prod.price),
          comparePrice: prod.comparePrice ? Number(prod.comparePrice) : undefined,
          costPrice: Number(prod.costPrice) || 0,
          stock: Number(prod.stock) || 0,
          variants: (prod.variants as any) || [],
          status: (prod.status as 'active' | 'draft') || 'active',
        } as any,
        overrideAccess: true,
      });

      console.log(`  [✓] Migrated "${prod.title}" (${prod.sku}) -> Payload id: ${newDoc.id}`);
      migratedCount++;
    } catch (prodErr) {
      console.error(`  [✗] Failed to migrate product "${prod.title}" (${prod.sku}):`, prodErr);
    }
  }

  console.log(`[Migration] Complete! Migrated: ${migratedCount}, Skipped: ${skippedCount}, Total: ${drizzleProducts.length}`);
}

migrateProducts().catch((err) => {
  console.error('[Migration] Fatal error during migration:', err);
  process.exit(1);
});
