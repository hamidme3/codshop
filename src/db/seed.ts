import { getDb, schema } from './index';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  const db = getDb();
  if (!db) {
    console.log('[Seed] No DATABASE_URL configured. Skipping database seed.');
    return;
  }

  console.log('[Seed] Starting database seed...');

  // 1. Seed Store: Ottavio
  const existingStore = await db.query.stores.findFirst({
    where: eq(schema.stores.slug, 'ottavio'),
  });

  let storeId: string;

  if (!existingStore) {
    const trialDate = new Date();
    trialDate.setDate(trialDate.getDate() + 14);

    const [newStore] = await db.insert(schema.stores).values({
      slug: 'ottavio',
      name: 'Ottavio Cuir Artisanal Marocain',
      email: 'contact@ottavio.ma',
      phone: '+212661234567',
      subdomain: 'ottavio',
      currency: 'MAD',
      planTier: 'pro',
      trialEndsAt: trialDate,
    }).returning();

    storeId = newStore.id;
    console.log(`[Seed] Created store: ${newStore.name} (${newStore.slug})`);
  } else {
    storeId = existingStore.id;
    console.log(`[Seed] Store already exists: ${existingStore.name}`);
  }

  // 2. Seed Products
  const existingProducts = await db.query.products.findMany({
    where: eq(schema.products.storeId, storeId),
  });

  if (existingProducts.length === 0) {
    await db.insert(schema.products).values([
      {
        storeId,
        title: 'Sac à Main Cuir Véritable Fès - Finition Fait Main',
        sku: 'SKU-OTT-01',
        category: 'Maroquinerie & Sacs',
        price: 349,
        comparePrice: 499,
        costPrice: 110,
        stock: 24,
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'],
        variants: [{ size: 'Unique', stock: 24 }],
        status: 'active',
      },
      {
        storeId,
        title: 'Sacoche Bandoulière Homme Cuir Brun Rustique',
        sku: 'SKU-OTT-02',
        category: 'Maroquinerie & Sacs',
        price: 289,
        comparePrice: 399,
        costPrice: 95,
        stock: 18,
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'],
        variants: [{ size: 'Unique', stock: 18 }],
        status: 'active',
      },
      {
        storeId,
        title: 'Ceinture Cuir Pleine Fleur avec Boucle Laiton',
        sku: 'SKU-OTT-03',
        category: 'Accessoires',
        price: 149,
        comparePrice: 220,
        costPrice: 45,
        stock: 40,
        images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop'],
        variants: [{ size: '110cm', stock: 20 }, { size: '120cm', stock: 20 }],
        status: 'active',
      },
    ]);
    console.log('[Seed] Inserted 3 flagship Moroccan products.');
  }

  // 3. Seed Orders
  const existingOrders = await db.query.orders.findMany({
    where: eq(schema.orders.storeId, storeId),
  });

  if (existingOrders.length === 0) {
    await db.insert(schema.orders).values([
      {
        storeId,
        orderNumber: 'CMD-9482',
        customerName: 'Yassine El Amrani',
        phone: '0661234567',
        city: 'Casablanca',
        address: 'Boulevard d\'Anfa, Résidence Al Yassamine N°14',
        status: 'new',
        items: [{ id: '1', title: 'Sac à Main Cuir Véritable Fès', quantity: 1, price: 349 }],
        subtotal: 349,
        shippingFee: 20,
        total: 369,
        courier: 'ozon',
      },
      {
        storeId,
        orderNumber: 'CMD-9481',
        customerName: 'Kenza Benjelloun',
        phone: '0662987654',
        city: 'Rabat',
        address: 'Avenue Mohammed VI, Souissi',
        status: 'confirmed',
        items: [{ id: '2', title: 'Sacoche Bandoulière Homme Cuir Brun', quantity: 1, price: 289 }],
        subtotal: 289,
        shippingFee: 25,
        total: 314,
        courier: 'ozon',
        trackingNumber: 'OZON-MA-884102',
      },
      {
        storeId,
        orderNumber: 'CMD-9479',
        customerName: 'Mehdi Tazi',
        phone: '0663456789',
        city: 'Marrakech',
        address: 'Guéliz, Rue de la Liberté',
        status: 'delivered',
        items: [{ id: '1', title: 'Sac à Main Cuir Véritable Fès', quantity: 2, price: 600 }],
        subtotal: 600,
        shippingFee: 0,
        total: 600,
        courier: 'ozon',
        trackingNumber: 'OZON-MA-883901',
      },
    ]);
    console.log('[Seed] Inserted 3 initial COD orders.');
  }

  console.log('[Seed] Database seeding completed successfully.');
}

// Allow direct execution: npx tsx src/db/seed.ts
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}
