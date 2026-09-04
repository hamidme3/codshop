import { getDb, schema } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { 
  getOrders as getMockOrders, 
  getProducts as getMockProducts, 
  getCustomers as getMockCustomers,
  addProduct as addMockProduct,
  updateOrderStatus as updateMockOrderStatus,
  Order, Product, Customer 
} from './backoffice';
import { 
  getStoreBySlug as getMockStoreBySlug, 
  updateStoreSections as updateMockStoreSections, 
  SectionInstance 
} from './stores';

// ── Store Repository ──────────────────────────────────────────
export async function getStoreBySlug(slug: string) {
  const db = getDb();
  if (!db) {
    return { slug, name: slug.toUpperCase(), currency: 'MAD', planTier: 'pro' };
  }

  try {
    const store = await db.query.stores.findFirst({
      where: eq(schema.stores.slug, slug),
    });
    return store;
  } catch (err) {
    console.warn('[DbRepo] Failed to fetch store from DB, returning fallback:', err);
    return { slug, name: slug.toUpperCase(), currency: 'MAD', planTier: 'pro' };
  }
}

export async function createStore(data: {
  name: string;
  slug: string;
  email: string;
  phone: string;
  planTier?: string;
}) {
  const db = getDb();
  const trialDate = new Date();
  trialDate.setDate(trialDate.getDate() + 14);

  if (!db) {
    return {
      id: `store_${Date.now()}`,
      slug: data.slug,
      name: data.name,
      email: data.email,
      phone: data.phone,
      subdomain: data.slug,
      currency: 'MAD',
      planTier: data.planTier || 'starter',
      trialEndsAt: trialDate,
    };
  }

  try {
    const [newStore] = await db.insert(schema.stores).values({
      slug: data.slug,
      name: data.name,
      email: data.email,
      phone: data.phone,
      subdomain: data.slug,
      currency: 'MAD',
      planTier: data.planTier || 'starter',
      trialEndsAt: trialDate,
    }).returning();
    return newStore;
  } catch (err) {
    console.error('[DbRepo] Error creating store in DB:', err);
    throw err;
  }
}

// ── Products Repository ────────────────────────────────────────
export async function getProducts(storeSlug: string): Promise<Product[]> {
  const db = getDb();
  if (!db) {
    return getMockProducts(storeSlug);
  }

  try {
    const store = await getStoreBySlug(storeSlug);
    if (!store || !('id' in store)) {
      return getMockProducts(storeSlug);
    }

    const rows = await db.query.products.findMany({
      where: eq(schema.products.storeId, store.id),
      orderBy: [desc(schema.products.createdAt)],
    });

    if (rows.length === 0) {
      return getMockProducts(storeSlug);
    }

    return rows.map((r) => ({
      id: r.id,
      storeSlug,
      title: r.title,
      sku: r.sku,
      category: r.category,
      price: r.price,
      comparePrice: r.comparePrice || undefined,
      costPrice: r.costPrice,
      stock: r.stock,
      images: r.images,
      variants: r.variants,
      status: r.status as 'active' | 'draft',
    }));
  } catch (err) {
    console.warn('[DbRepo] Error querying products from DB, fallback to mock:', err);
    return getMockProducts(storeSlug);
  }
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  const db = getDb();
  if (!db) {
    return addMockProduct(data);
  }

  try {
    const store = await getStoreBySlug(data.storeSlug);
    if (!store || !('id' in store)) {
      return addMockProduct(data);
    }

    const [newProd] = await db.insert(schema.products).values({
      storeId: store.id,
      title: data.title,
      sku: data.sku,
      category: data.category,
      price: data.price,
      comparePrice: data.comparePrice,
      costPrice: data.costPrice,
      stock: data.stock,
      images: data.images,
      variants: data.variants,
      status: data.status,
    }).returning();

    return {
      id: newProd.id,
      storeSlug: data.storeSlug,
      title: newProd.title,
      sku: newProd.sku,
      category: newProd.category,
      price: newProd.price,
      comparePrice: newProd.comparePrice || undefined,
      costPrice: newProd.costPrice,
      stock: newProd.stock,
      images: newProd.images,
      variants: newProd.variants,
      status: newProd.status as 'active' | 'draft',
    };
  } catch (err) {
    console.warn('[DbRepo] Error creating product in DB, fallback to mock:', err);
    return addMockProduct(data);
  }
}

// ── Orders Repository ──────────────────────────────────────────
export async function getOrders(storeSlug: string): Promise<Order[]> {
  const db = getDb();
  if (!db) {
    return getMockOrders(storeSlug);
  }

  try {
    const store = await getStoreBySlug(storeSlug);
    if (!store || !('id' in store)) {
      return getMockOrders(storeSlug);
    }

    const rows = await db.query.orders.findMany({
      where: eq(schema.orders.storeId, store.id),
      orderBy: [desc(schema.orders.createdAt)],
    });

    if (rows.length === 0) {
      return getMockOrders(storeSlug);
    }

    return rows.map((r) => ({
      id: r.id,
      orderNumber: r.orderNumber,
      storeSlug,
      createdAt: r.createdAt.toISOString(),
      customerName: r.customerName,
      phone: r.phone,
      city: r.city,
      address: r.address,
      status: r.status as Order['status'],
      items: r.items,
      subtotal: r.subtotal,
      shippingFee: r.shippingFee,
      total: r.total,
      courier: r.courier as Order['courier'],
      trackingNumber: r.trackingNumber || undefined,
      agentNotes: r.agentNotes || undefined,
    }));
  } catch (err) {
    console.warn('[DbRepo] Error querying orders from DB, fallback to mock:', err);
    return getMockOrders(storeSlug);
  }
}

export async function createOrder(data: {
  storeSlug: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  items: { id: string; title: string; quantity: number; price: number; variant?: string }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  courier?: 'ozon' | 'sendit' | 'manual';
}) {
  const db = getDb();
  const orderNumber = `CMD-${Math.floor(1000 + Math.random() * 9000)}`;

  if (!db) {
    return {
      id: `ord_${Date.now()}`,
      orderNumber,
      ...data,
      status: 'new' as const,
      createdAt: new Date().toISOString(),
    };
  }

  try {
    const store = await getStoreBySlug(data.storeSlug);
    if (!store || !('id' in store)) {
      throw new Error(`Store not found: ${data.storeSlug}`);
    }

    const [newOrder] = await db.insert(schema.orders).values({
      storeId: store.id,
      orderNumber,
      customerName: data.customerName,
      phone: data.phone,
      city: data.city,
      address: data.address,
      status: 'new',
      items: data.items,
      subtotal: data.subtotal,
      shippingFee: data.shippingFee,
      total: data.total,
      courier: data.courier || 'ozon',
    }).returning();

    // Auto-update or create Customer in CRM
    await syncCustomerFromOrder(store.id, data.customerName, data.phone, data.city, data.total);

    return newOrder;
  } catch (err) {
    console.error('[DbRepo] Error creating order in DB:', err);
    throw err;
  }
}

async function syncCustomerFromOrder(
  storeId: string,
  name: string,
  phone: string,
  city: string,
  orderTotal: number
) {
  const db = getDb();
  if (!db) return;

  try {
    const existing = await db.query.customers.findFirst({
      where: eq(schema.customers.phone, phone),
    });

    if (existing) {
      const updatedTotalOrders = existing.totalOrders + 1;
      const updatedTotalSpend = existing.totalSpend + orderTotal;
      await db.update(schema.customers)
        .set({
          totalOrders: updatedTotalOrders,
          totalSpend: updatedTotalSpend,
          averageBasket: Math.round(updatedTotalSpend / updatedTotalOrders),
          status: 'returning',
          lastOrderAt: new Date(),
        })
        .where(eq(schema.customers.id, existing.id));
    } else {
      await db.insert(schema.customers).values({
        storeId,
        name,
        phone,
        city,
        totalOrders: 1,
        totalSpend: orderTotal,
        averageBasket: orderTotal,
        status: 'new',
      });
    }
  } catch (err) {
    console.warn('[DbRepo] Error syncing customer:', err);
  }
}

// ── User Authentication Repository ────────────────────────────
export async function findUserByEmail(email: string) {
  const db = getDb();
  const normalizedEmail = email.toLowerCase().trim();

  if (!db) {
    // Fallback for when DB connection isn't configured
    return null;
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, normalizedEmail),
      with: {
        store: true,
      },
    });
    return user || null;
  } catch (err) {
    console.error('[DbRepo] Error fetching user by email:', err);
    return null;
  }
}

export async function createStoreUser(data: {
  storeId: string;
  email: string;
  name: string;
  passwordHash: string;
  role?: string;
}) {
  const db = getDb();
  if (!db) {
    return {
      id: `user_${Date.now()}`,
      storeId: data.storeId,
      email: data.email.toLowerCase().trim(),
      name: data.name,
      passwordHash: data.passwordHash,
      role: data.role || 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  try {
    const [newUser] = await db.insert(schema.users).values({
      storeId: data.storeId,
      email: data.email.toLowerCase().trim(),
      name: data.name,
      passwordHash: data.passwordHash,
      role: data.role || 'owner',
    }).returning();
    return newUser;
  } catch (err) {
    console.error('[DbRepo] Error creating store user:', err);
    throw err;
  }
}

// ── Page Layout & Theme Customization Repository ──────────────
export interface ThemeTokens {
  primaryColor?: string;
  accentColor?: string;
  bgPage?: string;
  cardBg?: string;
  border?: string;
  textPrimary?: string;
  textSecondary?: string;
  fontFamily?: 'serif' | 'sans' | 'mono';
  buttonRadius?: 'sharp' | 'subtle' | 'rounded' | 'pill';
  announcementText?: string;
  showAnnouncement?: boolean;
  announcementBg?: string;
}

export interface StoreLayoutData {
  storeName?: string;
  themeId: string;
  themeConfig: ThemeTokens;
  sections: SectionInstance[];
  updatedAt?: Date;
}

export async function getStoreLayoutBySlug(storeSlug: string): Promise<StoreLayoutData> {
  const db = getDb();
  const mockStore = getMockStoreBySlug(storeSlug);
  const defaultSections: SectionInstance[] = mockStore?.pages?.[0]?.sections || [];
  const defaultThemeId: string = mockStore?.themeId || 'luxury';

  const defaultResult: StoreLayoutData = {
    storeName: mockStore?.name || storeSlug.toUpperCase(),
    themeId: defaultThemeId,
    themeConfig: {
      primaryColor: defaultThemeId === 'beauty' ? '#881337' : defaultThemeId === 'tech' ? '#18181b' : '#090d16',
      accentColor: defaultThemeId === 'beauty' ? '#f43f5e' : defaultThemeId === 'tech' ? '#2563eb' : '#c59b27',
      bgPage: defaultThemeId === 'beauty' ? '#fff5f7' : defaultThemeId === 'tech' ? '#f4f4f5' : '#faf9f6',
      buttonRadius: defaultThemeId === 'beauty' ? 'pill' : defaultThemeId === 'tech' ? 'rounded' : 'sharp',
      fontFamily: defaultThemeId === 'luxury' ? 'serif' : 'sans',
      showAnnouncement: true,
      announcementText: 'Livraison Rapide Gratuite dès 400 DH • Paiement Cash à la Livraison après vérification du colis',
    },
    sections: defaultSections,
  };

  if (!db) {
    return defaultResult;
  }

  try {
    const store = await db.query.stores.findFirst({
      where: eq(schema.stores.slug, storeSlug),
    });

    if (!store) {
      return defaultResult;
    }

    const layout = await db.query.pageLayouts.findFirst({
      where: eq(schema.pageLayouts.storeId, store.id),
    });

    if (!layout) {
      // Seed initial layout into Postgres
      try {
        await db.insert(schema.pageLayouts).values({
          storeId: store.id,
          sections: {
            themeId: defaultResult.themeId,
            themeConfig: defaultResult.themeConfig,
            sections: defaultResult.sections,
          },
        });
      } catch (seedErr) {
        console.warn('[DbRepo] Failed to seed layout:', seedErr);
      }
      return defaultResult;
    }

    const raw = layout.sections as any;
    if (Array.isArray(raw)) {
      return {
        storeName: store.name,
        themeId: defaultResult.themeId,
        themeConfig: defaultResult.themeConfig,
        sections: raw,
        updatedAt: layout.updatedAt,
      };
    }

    return {
      storeName: store.name,
      themeId: raw?.themeId || defaultResult.themeId,
      themeConfig: {
        ...defaultResult.themeConfig,
        ...(raw?.themeConfig || {}),
      },
      sections: Array.isArray(raw?.sections) ? raw.sections : defaultResult.sections,
      updatedAt: layout.updatedAt,
    };
  } catch (err) {
    console.error('[DbRepo] Error fetching store layout:', err);
    return defaultResult;
  }
}

export async function saveStoreLayout(
  storeSlug: string,
  data: {
    sections?: SectionInstance[];
    themeId?: string;
    themeConfig?: ThemeTokens;
  }
): Promise<{ success: boolean; updatedAt: Date }> {
  const db = getDb();

  // If sections are provided, sync with in-memory store for instant cache
  if (data.sections) {
    updateMockStoreSections(storeSlug, data.sections);
  }

  if (!db) {
    return { success: true, updatedAt: new Date() };
  }

  try {
    const store = await db.query.stores.findFirst({
      where: eq(schema.stores.slug, storeSlug),
    });

    if (!store) {
      return { success: true, updatedAt: new Date() };
    }

    const existingLayout = await db.query.pageLayouts.findFirst({
      where: eq(schema.pageLayouts.storeId, store.id),
    });

    const now = new Date();
    const existingRaw = (existingLayout?.sections as any) || {};

    const payloadToSave = {
      themeId: data.themeId !== undefined ? data.themeId : (existingRaw.themeId || 'luxury'),
      themeConfig: {
        ...(existingRaw.themeConfig || {}),
        ...(data.themeConfig || {}),
      },
      sections: data.sections !== undefined ? data.sections : (existingRaw.sections || []),
    };

    if (existingLayout) {
      await db
        .update(schema.pageLayouts)
        .set({
          sections: payloadToSave,
          updatedAt: now,
        })
        .where(eq(schema.pageLayouts.id, existingLayout.id));
    } else {
      await db.insert(schema.pageLayouts).values({
        storeId: store.id,
        sections: payloadToSave,
        updatedAt: now,
      });
    }

    return { success: true, updatedAt: now };
  } catch (err) {
    console.error('[DbRepo] Error saving store layout:', err);
    throw err;
  }
}

