import { getDb, schema } from '@/db';
import { eq, desc, asc, and, ne } from 'drizzle-orm';
import type { Order, Product, Customer, CourierName } from './types';
import {
  ORDERS,
  PRODUCTS,
  getOrders as getMockOrders,
  getProducts as getMockProducts,
  getCustomers as getMockCustomers,
  updateCustomerNotes as updateMockCustomerNotes,
  syncCustomersFromOrders,
  addProduct as addMockProduct,
  updateProduct as updateMockProduct,
  deleteProduct as deleteMockProduct,
  updateOrderStatus as updateMockOrderStatus,
  checkInventory,
  decrementInventory,
} from './mocks';
import { MOCK_PRODUCTS, checkMockProductStock, decrementMockProductStock } from './mockProducts';
import { 
  getStoreBySlug as getMockStoreBySlug, 
  updateStoreSections as updateMockStoreSections, 
  SectionInstance 
} from './stores';
import { getThemeById } from './themes';
import { sanitizeText } from './sanitizer';

// ── Store Repository ──────────────────────────────────────────
export async function getStoreBySlug(slug: string) {
  if (!slug || typeof slug !== 'string') return null;
  const cleanSlug = slug.toLowerCase().trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) return null;

  const db = getDb();
  if (db) {
    try {
      const store = await db.query.stores.findFirst({
        where: eq(schema.stores.slug, cleanSlug),
      });
      if (store) return store;
    } catch (err) {
      console.warn('[DbRepo] Failed to fetch store from DB, checking mock catalog:', err);
    }
  }

  // Check mock store catalog
  const mockStore = getMockStoreBySlug(cleanSlug);
  if (mockStore) {
    if (mockStore.status === 'suspended') {
      return null;
    }
    return {
      id: mockStore.id,
      slug: mockStore.slug,
      name: mockStore.name,
      currency: 'MAD',
      country: 'MA',
      planTier: mockStore.plan,
      status: mockStore.status,
      isWaybillEnabled: false,
    };
  }

  return null;
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

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<Product | null> {
  const db = getDb();
  if (!db) {
    return updateMockProduct(productId, updates);
  }

  try {
    let targetRowId: string | null = null;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
    if (isUuid) {
      targetRowId = productId;
    } else {
      const cleanTarget = productId.toLowerCase().trim();
      const cleanSkuPart = cleanTarget.replace(/^prod_/, '');
      const all = await db.query.products.findMany({ limit: 500 });
      const matched = all.find((p) => {
        const pSku = p.sku.toLowerCase();
        const pId = p.id.toLowerCase();
        const titleSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return (
          pId === cleanTarget ||
          pSku === cleanTarget ||
          pSku === cleanSkuPart ||
          cleanTarget.includes(pSku) ||
          titleSlug === cleanTarget ||
          titleSlug === cleanSkuPart
        );
      });
      if (matched) {
        targetRowId = matched.id;
      }
    }

    if (targetRowId) {
      const updateData: any = { updatedAt: new Date() };
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.price !== undefined) updateData.price = Number(updates.price);
      if (updates.comparePrice !== undefined) updateData.comparePrice = Number(updates.comparePrice);
      if (updates.costPrice !== undefined) updateData.costPrice = Number(updates.costPrice);
      if (updates.stock !== undefined) updateData.stock = Number(updates.stock);
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.images !== undefined) updateData.images = updates.images;
      if (updates.variants !== undefined) updateData.variants = updates.variants;

      const [updated] = await db
        .update(schema.products)
        .set(updateData)
        .where(eq(schema.products.id, targetRowId))
        .returning();

      if (updated) {
        updateMockProduct(productId, updates);
        return {
          id: updated.id,
          storeSlug: updates.storeSlug || '',
          title: updated.title,
          sku: updated.sku,
          category: updated.category,
          price: updated.price,
          comparePrice: updated.comparePrice || undefined,
          costPrice: updated.costPrice,
          stock: updated.stock,
          images: updated.images,
          variants: updated.variants,
          status: updated.status as 'active' | 'draft',
        };
      }
    }
    return updateMockProduct(productId, updates);
  } catch (err) {
    console.warn('[DbRepo] Error updating product in DB:', err);
    return updateMockProduct(productId, updates);
  }
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const db = getDb();
  deleteMockProduct(productId);
  if (!db) return true;

  try {
    let targetRowId: string | null = null;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
    if (isUuid) {
      targetRowId = productId;
    } else {
      const cleanTarget = productId.toLowerCase().trim();
      const cleanSkuPart = cleanTarget.replace(/^prod_/, '');
      const all = await db.query.products.findMany({ limit: 500 });
      const matched = all.find((p) => {
        const pSku = p.sku.toLowerCase();
        const pId = p.id.toLowerCase();
        const titleSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return (
          pId === cleanTarget ||
          pSku === cleanTarget ||
          pSku === cleanSkuPart ||
          cleanTarget.includes(pSku) ||
          titleSlug === cleanTarget ||
          titleSlug === cleanSkuPart
        );
      });
      if (matched) {
        targetRowId = matched.id;
      }
    }

    if (targetRowId) {
      await db.delete(schema.products).where(eq(schema.products.id, targetRowId));
    }
    return true;
  } catch (err) {
    console.warn('[DbRepo] Error deleting product from DB:', err);
    return true;
  }
}

export async function getProductBySlugOrSku(slugOrSku: string): Promise<Product | null> {
  const db = getDb();
  const clean = slugOrSku.toLowerCase().trim();
  if (!db) {
    const memMatch = PRODUCTS.find(
      (p: any) =>
        p.sku?.toLowerCase() === clean ||
        p.id?.toLowerCase() === clean ||
        p.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === clean
    );
    return memMatch || null;
  }

  try {
    const all = await db.query.products.findMany({
      limit: 200,
    });
    const found = all.find(
      (r: any) =>
        r.sku?.toLowerCase() === clean ||
        r.id?.toLowerCase() === clean ||
        r.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === clean
    );
    if (found) {
      return {
        id: found.id,
        storeSlug: 'storet1',
        title: found.title,
        sku: found.sku,
        category: found.category,
        price: found.price,
        comparePrice: found.comparePrice || undefined,
        costPrice: found.costPrice,
        stock: found.stock,
        images: found.images,
        variants: found.variants,
        status: found.status as 'active' | 'draft',
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Converts a database or admin product into the rich Storefront Product model
 * compatible with ProductCard, CodCheckoutModal, and ProductDetailPage.
 */
export function convertDbProductToStorefrontProduct(p: any): any {
  const baseSlug = (p.sku || p.id || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const price = Number(p.price) || 299;
  const originalPrice = p.comparePrice ? Number(p.comparePrice) : Math.round(price * 1.5);
  const duoPrice = p.packDuoPrice ? Number(p.packDuoPrice) : Math.max(price, Math.round(price * 2 - 100));
  const trioPrice = p.packTrioPrice ? Number(p.packTrioPrice) : Math.max(price, Math.round(price * 3 - 200));

  return {
    id: p.id,
    slug: p.slug || baseSlug,
    sku: p.sku || `SKU-${p.id?.slice?.(0, 4) || '0000'}`,
    theme: p.theme || 'luxury',
    title: p.title,
    tagline: p.category || 'Collection Exclusive',
    price: price,
    originalPrice: originalPrice,
    rating: 4.9,
    reviewCount: 38,
    stockLeft: p.stock ?? 20,
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'],
    description: p.description || `${p.title}. Qualité supérieure confectionnée avec soin. Paiement à la livraison après vérification du colis partout au Maroc.`,
    features: [
      'Authenticité et confection premium garantie',
      'Paiement à la livraison (COD) après inspection du colis',
      'Livraison express 24h à 48h partout au Royaume',
      'Échange sous 7 jours sans frais',
    ],
    variants: p.variants && p.variants.length > 0 ? {
      type: 'size',
      label: 'Options / Pointures',
      options: p.variants.map((v: any) => ({
        id: v.sku || v.size || v.color || 'opt',
        name: [v.color, v.size].filter(Boolean).join(' - ') || v.name || 'Standard',
        inStock: (v.stock ?? 1) > 0,
        sku: v.sku || p.sku,
        stock: v.stock ?? p.stock,
      })),
    } : undefined,
    quantityTiers: [
      {
        quantity: 1,
        label: '1 Pièce (Standard)',
        unitPrice: price,
        totalPrice: price,
      },
      {
        quantity: 2,
        label: 'Pack Duo (Économie + Livraison Gratuite)',
        unitPrice: Math.round(duoPrice / 2),
        totalPrice: duoPrice,
        savingsBadge: `-100 DH`,
        isPopular: true,
        freeDelivery: true,
      },
      {
        quantity: 3,
        label: 'Pack Trio (Maxi Économie + Cadeau Offert)',
        unitPrice: Math.round(trioPrice / 3),
        totalPrice: trioPrice,
        savingsBadge: `-200 DH`,
        freeDelivery: true,
        freeGift: 'Cadeau surprise offert',
      },
    ],
    whatsAppDirectNumber: '212600000000',
  };
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
      countryCode: (r as any).countryCode || 'MA',
      currency: (r as any).currency || 'MAD',
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
  items: { id: string; title: string; quantity: number; price: number; variant?: string; sku?: string; color?: string; size?: string }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  courier?: CourierName;
  abVariant?: string;
  deliveryType?: 'home' | 'stopdesk';
  agencyName?: string;
  source?: 'web' | 'whatsapp';
  countryCode?: string;
  currency?: string;
}) {
  const db = getDb();
  const orderNumber = `CMD-${Math.floor(1000 + Math.random() * 9000)}`;

  // 1. Store verification & scoping
  const store = await getStoreBySlug(data.storeSlug);
  if (!store || !('id' in store)) {
    throw new Error(`Store not found or inactive: ${data.storeSlug}`);
  }
  if ('status' in store && (store.status as string) === 'suspended') {
    throw new Error(`Store is suspended: ${data.storeSlug}`);
  }

  // 2. Input Sanitization (anti-XSS) & Variant Preservation
  const cleanCustomerName = sanitizeText(data.customerName, 100) || 'Client Anonyme';
  const cleanAddress = sanitizeText(data.address, 300) || 'Adresse standard';
  const cleanCity = sanitizeText(data.city, 100) || 'Casablanca';
  const cleanAgencyName = data.agencyName ? sanitizeText(data.agencyName, 150) : null;
  const cleanItems = (data.items || []).map((it) => ({
    id: String(it.id),
    title: sanitizeText(it.title, 150) || 'Produit',
    quantity: Math.max(1, Math.floor(Number(it.quantity) || 1)),
    price: Math.max(0, Math.floor(Number(it.price) || 0)),
    variant: it.variant ? sanitizeText(it.variant, 100) : 'Standard',
    sku: it.sku ? sanitizeText(it.sku, 50) : undefined,
    color: it.color ? sanitizeText(it.color, 50) : undefined,
    size: it.size ? sanitizeText(it.size, 50) : undefined,
  }));

  // 3. Stock Status Check & Inventory Reservation
  const invCheck = checkInventory(data.storeSlug, cleanItems);
  if (!invCheck.available) {
    throw new Error(invCheck.error || 'Stock insuffisant pour satisfaire cette commande.');
  }

  for (const it of cleanItems) {
    const isMock = MOCK_PRODUCTS.some((p) => p.id === it.id || p.slug === it.id || p.sku === it.id);
    if (isMock) {
      const mockCheck = checkMockProductStock(it.id, it.quantity, {
        color: it.color,
        size: it.size,
        variant: it.variant,
        sku: it.sku,
      });
      if (!mockCheck.available) {
        throw new Error(mockCheck.error || `Stock insuffisant pour ${it.title} (${it.sku || it.variant})`);
      }
    }
  }

  // 4. Inventory Decrement Execution (Reservation)
  decrementInventory(data.storeSlug, cleanItems);
  for (const it of cleanItems) {
    const isMock = MOCK_PRODUCTS.some((p) => p.id === it.id || p.slug === it.id || p.sku === it.id);
    if (isMock) {
      decrementMockProductStock(it.id, it.quantity, {
        color: it.color,
        size: it.size,
        variant: it.variant,
        sku: it.sku,
      });
    }
  }

  // 5. Price Integrity check
  const cleanSubtotal = Math.max(0, Math.floor(Number(data.subtotal) || 0));
  const cleanShippingFee = Math.max(0, Math.floor(Number(data.shippingFee) || 0));
  const cleanTotal = cleanSubtotal + cleanShippingFee;
  const cleanCountryCode = (data.countryCode || 'MA').toUpperCase();
  const cleanCurrency = (data.currency || 'MAD').toUpperCase();

  if (!db) {
    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      storeSlug: data.storeSlug,
      customerName: cleanCustomerName,
      phone: data.phone,
      city: cleanCity,
      address: cleanAddress,
      items: cleanItems,
      subtotal: cleanSubtotal,
      shippingFee: cleanShippingFee,
      total: cleanTotal,
      courier: data.courier || 'manual',
      abVariant: data.abVariant || 'control',
      deliveryType: data.deliveryType || 'home',
      agencyName: cleanAgencyName || undefined,
      source: data.source || 'web',
      countryCode: cleanCountryCode,
      currency: cleanCurrency,
      status: 'new' as const,
      createdAt: new Date().toISOString(),
    };
    ORDERS.unshift(newOrder);
    syncCustomersFromOrders(data.storeSlug);
    return newOrder;
  }

  try {
    // Also decrement in Postgres if database is active
    try {
      const allStoreProds = await db.query.products.findMany({
        where: eq(schema.products.storeId, store.id),
      });
      for (const it of cleanItems) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(it.id);
        const targetSku = (it.sku || it.id || '').trim().toLowerCase();
        const targetSkuClean = targetSku.replace(/^prod_/, '');
        const prod = allStoreProds.find(
          (p) =>
            (isUuid && p.id === it.id) ||
            p.sku.toLowerCase() === targetSku ||
            p.sku.toLowerCase() === targetSkuClean ||
            targetSku.startsWith(p.sku.toLowerCase()) ||
            p.sku.toLowerCase().startsWith(targetSku) ||
            p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === targetSku ||
            p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === targetSkuClean
        );
        if (prod) {
          let updatedVariants = prod.variants;
          if (Array.isArray(updatedVariants)) {
            updatedVariants = updatedVariants.map((v) => {
              const matchColor = it.color ? v.color?.toLowerCase() === it.color.toLowerCase() : true;
              const matchSize = it.size ? v.size?.toLowerCase() === it.size.toLowerCase() : true;
              if (matchColor && matchSize) {
                return { ...v, stock: Math.max(0, (v.stock || 0) - it.quantity) };
              }
              return v;
            });
          }
          await db
            .update(schema.products)
            .set({
              stock: Math.max(0, prod.stock - it.quantity),
              variants: updatedVariants,
              updatedAt: new Date(),
            })
            .where(eq(schema.products.id, prod.id));
        }
      }
    } catch (invDbErr) {
      console.warn('[DbRepo] Non-fatal DB stock decrement warning:', invDbErr);
    }

    const [newOrder] = await db.insert(schema.orders).values({
      storeId: store.id,
      orderNumber,
      customerName: cleanCustomerName,
      phone: data.phone,
      city: cleanCity,
      address: cleanAddress,
      status: 'new',
      items: cleanItems,
      subtotal: cleanSubtotal,
      shippingFee: cleanShippingFee,
      total: cleanTotal,
      courier: data.courier || 'manual',
      abVariant: data.abVariant || 'control',
      deliveryType: data.deliveryType || 'home',
      agencyName: cleanAgencyName,
      source: data.source || 'web',
      countryCode: cleanCountryCode,
      currency: cleanCurrency,
    }).returning();

    // Auto-update or create Customer in CRM
    await syncCustomerFromOrder(store.id, cleanCustomerName, data.phone, cleanCity, cleanTotal);

    // Sync to in-memory ORDERS cache for real-time backoffice parity
    try {
      const memoryOrder = {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        storeSlug: data.storeSlug,
        customerName: newOrder.customerName,
        phone: newOrder.phone,
        city: newOrder.city,
        address: newOrder.address,
        items: newOrder.items as any,
        subtotal: Number(newOrder.subtotal),
        shippingFee: Number(newOrder.shippingFee),
        total: Number(newOrder.total),
        courier: newOrder.courier as any,
        abVariant: newOrder.abVariant as any,
        deliveryType: newOrder.deliveryType as any,
        agencyName: newOrder.agencyName || undefined,
        source: newOrder.source as any,
        countryCode: newOrder.countryCode || cleanCountryCode,
        currency: newOrder.currency || cleanCurrency,
        status: 'new' as const,
        createdAt: new Date().toISOString(),
      };
      ORDERS.unshift(memoryOrder);
      syncCustomersFromOrders(data.storeSlug);
    } catch (cacheErr) {
      console.warn('[DbRepo] Non-fatal in-memory cache sync warning:', cacheErr);
    }

    return newOrder;
  } catch (err) {
    console.error('[DbRepo] Error creating order in DB:', err);
    throw err;
  }
}

export async function restoreDbProductStock(
  storeId: string,
  items: Array<{ id: string; sku?: string; quantity: number; size?: string; color?: string }>
) {
  const db = getDb();
  if (!db || !items || items.length === 0) return;

  try {
    const storeProducts = await db.query.products.findMany({
      where: eq(schema.products.storeId, storeId),
    });

    for (const it of items) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(it.id);
      const targetSku = (it.sku || it.id || '').trim().toLowerCase();
      const targetSkuClean = targetSku.replace(/^prod_/, '');
      const prod = storeProducts.find(
        (p) =>
          (isUuid && p.id === it.id) ||
          p.sku.toLowerCase() === targetSku ||
          p.sku.toLowerCase() === targetSkuClean ||
          targetSku.startsWith(p.sku.toLowerCase()) ||
          p.sku.toLowerCase().startsWith(targetSku) ||
          p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === targetSku ||
          p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === targetSkuClean
      );

      if (prod) {
        let updatedVariants = prod.variants;
        if (Array.isArray(updatedVariants)) {
          updatedVariants = updatedVariants.map((v) => {
            const matchColor = it.color ? v.color?.toLowerCase() === it.color.toLowerCase() : true;
            const matchSize = it.size ? v.size?.toLowerCase() === it.size.toLowerCase() : true;
            if (matchColor && matchSize) {
              return { ...v, stock: (v.stock || 0) + it.quantity };
            }
            return v;
          });
        }
        await db
          .update(schema.products)
          .set({
            stock: prod.stock + it.quantity,
            variants: updatedVariants,
            updatedAt: new Date(),
          })
          .where(eq(schema.products.id, prod.id));
      }
    }
  } catch (err) {
    console.warn('[DbRepo] Non-fatal DB stock restore warning:', err);
  }
}

export async function getOrderByNumber(orderNumberOrId: string) {
  const db = getDb();
  if (!db) {
    const mock = ORDERS.find((o) => o.orderNumber === orderNumberOrId || o.id === orderNumberOrId);
    return mock || null;
  }
  try {
    let order = await db.query.orders.findFirst({
      where: eq(schema.orders.orderNumber, orderNumberOrId),
    });
    if (!order && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderNumberOrId)) {
      order = await db.query.orders.findFirst({
        where: eq(schema.orders.id, orderNumberOrId),
      });
    }
    if (!order) {
      const mock = ORDERS.find((o) => o.orderNumber === orderNumberOrId || o.id === orderNumberOrId);
      return mock || null;
    }
    return order;
  } catch (err) {
    console.error('[DbRepo] Error fetching order by number or ID:', err);
    const mock = ORDERS.find((o) => o.orderNumber === orderNumberOrId || o.id === orderNumberOrId);
    return mock || null;
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
      where: and(
        eq(schema.customers.storeId, storeId),
        eq(schema.customers.phone, phone)
      ),
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

// ── Customers Repository ───────────────────────────────────────
export async function getCustomers(storeSlug: string): Promise<Customer[]> {
  const db = getDb();
  if (!db) {
    return getMockCustomers(storeSlug);
  }

  try {
    const store = await getStoreBySlug(storeSlug);
    if (!store || !('id' in store)) {
      return getMockCustomers(storeSlug);
    }

    const dbCusts = await db.query.customers.findMany({
      where: eq(schema.customers.storeId, store.id),
      orderBy: [desc(schema.customers.createdAt)],
    });

    if (dbCusts.length === 0) {
      return getMockCustomers(storeSlug);
    }

    // Also fetch store orders to populate recentOrders and delivery stats
    const storeOrders = await db.query.orders.findMany({
      where: eq(schema.orders.storeId, store.id),
      orderBy: [desc(schema.orders.createdAt)],
    });

    return dbCusts.map((c) => {
      const custOrders = storeOrders.filter((o) => o.phone === c.phone);
      const lastOrd = custOrders[0];
      const delivered = custOrders.filter((o) => o.status === 'delivered').length;
      const returned = custOrders.filter((o) => o.status === 'returned').length;
      const totalResolved = delivered + returned;
      const deliverySuccessRate = totalResolved > 0 ? Math.round((delivered / totalResolved) * 100) : 100;

      return {
        id: c.id,
        storeSlug,
        name: c.name,
        phone: c.phone,
        email: c.email || '',
        city: c.city,
        totalOrders: Math.max(c.totalOrders, custOrders.length),
        totalSpend: Math.max(c.totalSpend, custOrders.reduce((sum, o) => sum + Number(o.total), 0)),
        averageBasket: c.averageBasket || Math.round(c.totalSpend / Math.max(1, c.totalOrders)),
        status: (c.status as any) || (custOrders.length > 1 ? 'returning' : 'new'),
        riskScore: 'low' as const,
        lastOrderDate: (c.lastOrderAt || lastOrd?.createdAt || c.createdAt)?.toISOString() || new Date().toISOString(),
        lastOrderNumber: lastOrd?.orderNumber,
        lastOrderStatus: (lastOrd?.status as any) || 'new',
        lastTrackingNumber: lastOrd?.trackingNumber || undefined,
        deliverySuccessRate,
        confirmedOrders: custOrders.filter((o) => o.status === 'confirmed').length,
        shippedOrders: custOrders.filter((o) => ['shipped', 'shipping'].includes(o.status)).length,
        deliveredOrders: delivered,
        returnedOrders: returned,
        canceledOrders: custOrders.filter((o) => o.status === 'canceled').length,
        recentOrders: custOrders.slice(0, 5).map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          createdAt: o.createdAt?.toISOString() || new Date().toISOString(),
          status: o.status as any,
          total: Number(o.total),
          itemsSummary: Array.isArray(o.items) && o.items.length > 0 ? o.items.map((it: any) => `${it.quantity}x ${it.title}`).join(', ') : 'Articles',
          courier: o.courier || undefined,
          trackingNumber: o.trackingNumber || undefined,
          countryCode: o.countryCode || 'MA',
          currency: o.currency || 'MAD',
        })),
      };
    });
  } catch (err) {
    console.warn('[DbRepo] Error querying customers from DB, fallback to mock:', err);
    return getMockCustomers(storeSlug);
  }
}

export async function updateCustomerNotes(phone: string, notes: string, storeSlug: string) {
  updateMockCustomerNotes(phone, notes, storeSlug);
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

  const selectedTheme = getThemeById(defaultThemeId);
  const defaultResult: StoreLayoutData = {
    storeName: mockStore?.name || storeSlug.toUpperCase(),
    themeId: defaultThemeId,
    themeConfig: {
      primaryColor: selectedTheme.colors.primary,
      accentColor: selectedTheme.colors.accent,
      bgPage: selectedTheme.colors.bgPage,
      buttonRadius: (selectedTheme.styleTokens.buttonRadius === 'rounded-full' ? 'pill' : selectedTheme.styleTokens.buttonRadius === 'rounded-none' ? 'sharp' : 'rounded') as any,
      fontFamily: (selectedTheme.typography.fontFamily === 'serif' ? 'serif' : selectedTheme.typography.fontFamily === 'monospace' ? 'mono' : 'sans') as any,
      showAnnouncement: true,
      announcementText: selectedTheme.announcementText,
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

// ── Multi-Store & Tenancy Hub (YouCan Parity) ──────────────────
export interface StoreSummary {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  active: boolean;
  is_dev: boolean;
  logo?: string;
  url: string;
  role?: string;
  isOwner?: boolean;
}

export async function getAccountStores(accountId: string): Promise<{
  data: StoreSummary[];
  managedStores: StoreSummary[];
}> {
  const db = getDb();
  const fallbackStores = [
    {
      id: '78331488-f44c-4bca-8083-11d55950db18',
      name: 'Ottavio Cuir Artisanal Marocain',
      slug: 'ottavio',
      owner_id: accountId,
      active: true,
      is_dev: false,
      logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200&auto=format&fit=crop',
      url: '/admin/switch-store?store=78331488-f44c-4bca-8083-11d55950db18',
      role: 'owner',
      isOwner: true,
    },
    {
      id: 'c7cca853-52e2-44f2-ba2c-1f6a94e28d48',
      name: 'Storet1',
      slug: 'storet1',
      owner_id: accountId,
      active: true,
      is_dev: false,
      logo: 'https://cdn.youcan.shop/stores/c21f969b5f03d33d43e04f8f136e7682/others/iiZGeY9UQikr6rFoi0rE1nxzUlUDXU5BoyXRzYTU.png',
      url: '/admin/switch-store?store=c7cca853-52e2-44f2-ba2c-1f6a94e28d48',
      role: 'owner',
      isOwner: true,
    },
  ];

  if (!db) {
    return { data: fallbackStores, managedStores: [] };
  }

  try {
    const memberships = await db.query.storeMemberships.findMany({
      where: eq(schema.storeMemberships.accountId, accountId),
      with: {
        store: true,
      },
    });

    if (!memberships || memberships.length === 0) {
      return { data: fallbackStores, managedStores: [] };
    }

    const owned: StoreSummary[] = [];
    const managed: StoreSummary[] = [];

    for (const m of memberships) {
      if (!m.store) continue;
      const item: StoreSummary = {
        id: m.store.id,
        name: m.store.name,
        slug: m.store.slug,
        owner_id: m.accountId,
        active: true,
        is_dev: false,
        url: `/admin/switch-store?store=${m.store.id}`,
        role: m.role,
        isOwner: m.isOwner === 'true',
      };

      if (m.isOwner === 'true') {
        owned.push(item);
      } else {
        managed.push(item);
      }
    }

    return {
      data: owned.length > 0 ? owned : fallbackStores,
      managedStores: managed,
    };
  } catch (err) {
    console.error('[DbRepo] Error fetching account stores:', err);
    return { data: fallbackStores, managedStores: [] };
  }
}

// ── Consolidated Shop Stats (/shop/stats) ──────────────────────
export async function getConsolidatedShopStats(accountId: string): Promise<{
  total_sales: number;
  total_orders: number;
  average_order_value: number;
  currency: string;
  formatted_total_sales: string;
  formatted_aov: string;
}> {
  const db = getDb();
  let totalSales = 369; // default Ottavio delivered revenue
  let totalOrders = 3;

  if (db) {
    try {
      const memberships = await db.query.storeMemberships.findMany({
        where: eq(schema.storeMemberships.accountId, accountId),
      });
      const storeIds = memberships.map((m) => m.storeId);

      if (storeIds.length > 0) {
        // Compute total sales across orders for these stores
        const allOrders = await db.query.orders.findMany();
        const userOrders = allOrders.filter((o) => storeIds.includes(o.storeId));
        if (userOrders.length > 0) {
          totalOrders = userOrders.length;
          totalSales = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        }
      }
    } catch (err) {
      console.warn('[DbRepo] Failed to aggregate shop stats, using baseline:', err);
    }
  }

  const aov = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  return {
    total_sales: totalSales,
    total_orders: totalOrders,
    average_order_value: aov,
    currency: 'MAD',
    formatted_total_sales: `${totalSales.toLocaleString('fr-MA')} DH`,
    formatted_aov: `${aov.toLocaleString('fr-MA')} DH`,
  };
}

// ── 5-Tier Gamification Milestones ($1K to $10M) ───────────────
export interface MilestoneTier {
  key: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  label: string;
  thresholdMad: number;
  thresholdUsd: number;
  thresholdLabel: string;
  color: string;
  unlocked: boolean;
}

export function getMilestoneProgress(totalSalesMad: number) {
  const tiers: MilestoneTier[] = [
    {
      key: 'bronze',
      label: 'Bronze',
      thresholdMad: 10000, // ~ $1K USD
      thresholdUsd: 1000,
      thresholdLabel: '$1K (10 000 DH)',
      color: '#D57938',
      unlocked: totalSalesMad >= 10000,
    },
    {
      key: 'silver',
      label: 'Silver',
      thresholdMad: 100000, // ~ $10K USD
      thresholdUsd: 10000,
      thresholdLabel: '$10K (100 000 DH)',
      color: '#B0B0B0',
      unlocked: totalSalesMad >= 100000,
    },
    {
      key: 'gold',
      label: 'Gold',
      thresholdMad: 1000000, // ~ $100K USD
      thresholdUsd: 100000,
      thresholdLabel: '$100K (1M DH)',
      color: '#FFAB29',
      unlocked: totalSalesMad >= 1000000,
    },
    {
      key: 'platinum',
      label: 'Platinum',
      thresholdMad: 10000000, // ~ $1M USD
      thresholdUsd: 1000000,
      thresholdLabel: '$1M (10M DH)',
      color: '#45BEA9',
      unlocked: totalSalesMad >= 10000000,
    },
    {
      key: 'diamond',
      label: 'Diamond',
      thresholdMad: 100000000, // ~ $10M USD
      thresholdUsd: 10000000,
      thresholdLabel: '$10M (100M DH)',
      color: '#72AFD6',
      unlocked: totalSalesMad >= 100000000,
    },
  ];

  // Current tier is the highest unlocked
  let currentTier: MilestoneTier | null = null;
  let nextTier: MilestoneTier = tiers[0];

  for (let i = 0; i < tiers.length; i++) {
    if (tiers[i].unlocked) {
      currentTier = tiers[i];
      if (i + 1 < tiers.length) {
        nextTier = tiers[i + 1];
      } else {
        nextTier = tiers[tiers.length - 1];
      }
    } else if (!currentTier) {
      nextTier = tiers[i];
      break;
    }
  }

  const prevThreshold = currentTier ? currentTier.thresholdMad : 0;
  const progressSpan = nextTier.thresholdMad - prevThreshold;
  const currentProgress = Math.max(0, totalSalesMad - prevThreshold);
  const progressPercent = Math.min(100, Math.round((currentProgress / progressSpan) * 100));
  const remainingToNext = Math.max(0, nextTier.thresholdMad - totalSalesMad);

  return {
    totalSalesMad,
    currentTier,
    nextTier,
    progressPercent: isNaN(progressPercent) ? 0 : progressPercent,
    remainingToNext,
    tiers,
  };
}

// ── Session Auditor & Login Activity ───────────────────────────
export async function recordUserSession(data: {
  accountId: string;
  sessionToken: string;
  ipAddress: string;
  userAgent: string;
  browser?: string;
  os?: string;
  city?: string;
  country?: string;
  expiresInDays?: number;
}) {
  const db = getDb();
  if (!db) return;

  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (data.expiresInDays || 30));

    await db
      .insert(schema.userSessions)
      .values({
        accountId: data.accountId,
        sessionToken: data.sessionToken,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        browser: data.browser || 'Navigateur Web',
        os: data.os || 'Système d exploitation',
        city: data.city || 'Casablanca',
        country: data.country || 'Maroc',
        expiresAt,
        isRevoked: 'false',
      })
      .onConflictDoUpdate({
        target: schema.userSessions.sessionToken,
        set: {
          lastActiveAt: new Date(),
          ipAddress: data.ipAddress,
        },
      });
  } catch (err) {
    console.warn('[DbRepo] Failed to record session:', err);
  }
}

export async function getAccountSessions(accountId: string) {
  const db = getDb();
  if (!db) {
    return [
      {
        id: 'sess-current',
        ipAddress: '196.200.150.12',
        city: 'Casablanca',
        country: 'Maroc',
        browser: 'Chrome 128 / macOS',
        os: 'macOS Sonoma',
        lastActiveAt: new Date(),
        isCurrent: true,
      },
    ];
  }

  try {
    const sessions = await db.query.userSessions.findMany({
      where: eq(schema.userSessions.accountId, accountId),
      orderBy: desc(schema.userSessions.lastActiveAt),
    });

    return sessions.map((s) => ({
      id: s.id,
      ipAddress: s.ipAddress,
      city: s.city || 'Casablanca',
      country: s.country || 'Maroc',
      browser: s.browser || 'Chrome / Safari',
      os: s.os || 'PC / Mobile',
      lastActiveAt: s.lastActiveAt,
      isRevoked: s.isRevoked === 'true',
    }));
  } catch (err) {
    console.error('[DbRepo] Error fetching account sessions:', err);
    return [];
  }
}

export async function invalidateSession(sessionId: string, accountId: string) {
  const db = getDb();
  if (!db) return true;

  try {
    await db
      .update(schema.userSessions)
      .set({ isRevoked: 'true' })
      .where(
        and(
          eq(schema.userSessions.id, sessionId),
          eq(schema.userSessions.accountId, accountId)
        )
      );
    return true;
  } catch (err) {
    console.error('[DbRepo] Error invalidating session:', err);
    return false;
  }
}

export async function revokeOtherSessions(accountId: string, currentSessionId?: string) {
  const db = getDb();
  if (!db) return true;

  try {
    if (currentSessionId) {
      await db
        .update(schema.userSessions)
        .set({ isRevoked: 'true' })
        .where(
          and(
            eq(schema.userSessions.accountId, accountId),
            ne(schema.userSessions.id, currentSessionId)
          )
        );
    } else {
      await db
        .update(schema.userSessions)
        .set({ isRevoked: 'true' })
        .where(eq(schema.userSessions.accountId, accountId));
    }
    return true;
  } catch (err) {
    console.error('[DbRepo] Error revoking other sessions:', err);
    return false;
  }
}

// ── Support Tickets & Communication Desk ───────────────────────
export async function createSupportTicket(data: {
  accountId: string;
  storeId?: string;
  subject: string;
  department: string;
  priority?: string;
  message: string;
  attachments?: any[];
}) {
  const db = getDb();
  const ticketNumber = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;

  if (!db) {
    return {
      id: `ticket_${Date.now()}`,
      ticketNumber,
      accountId: data.accountId,
      storeId: data.storeId || null,
      subject: data.subject,
      department: data.department,
      priority: data.priority || 'normal',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderType: 'merchant',
          message: data.message,
          attachments: data.attachments || [],
          createdAt: new Date(),
        },
      ],
    };
  }

  try {
    const [newTicket] = await db
      .insert(schema.supportTickets)
      .values({
        accountId: data.accountId,
        storeId: data.storeId || null,
        ticketNumber,
        subject: data.subject,
        department: data.department,
        priority: data.priority || 'normal',
        status: 'open',
      })
      .returning();

    // Add initial merchant message
    const [initialMessage] = await db
      .insert(schema.ticketMessages)
      .values({
        ticketId: newTicket.id,
        senderType: 'merchant',
        senderId: data.accountId,
        message: data.message,
        attachments: data.attachments || [],
      })
      .returning();

    // Add automated welcome acknowledgement from Moroccan Support Concierge
    const [welcomeMessage] = await db
      .insert(schema.ticketMessages)
      .values({
        ticketId: newTicket.id,
        senderType: 'support_staff',
        message:
          'Bonjour ! Notre équipe de support CODShop Maroc a bien reçu votre demande. Un spécialiste de Casablanca prend en charge votre dossier. Vous recevrez une notification d’ici 15 minutes.',
        attachments: [],
      })
      .returning();

    return {
      ...newTicket,
      messages: [initialMessage, welcomeMessage],
    };
  } catch (err) {
    console.error('[DbRepo] Error creating support ticket:', err);
    throw err;
  }
}

export async function getSupportTickets(accountId: string) {
  const db = getDb();
  if (!db) return [];

  try {
    const tickets = await db.query.supportTickets.findMany({
      where: eq(schema.supportTickets.accountId, accountId),
      orderBy: [desc(schema.supportTickets.updatedAt)],
      with: {
        messages: {
          orderBy: [desc(schema.ticketMessages.createdAt)],
          limit: 1,
        },
      },
    });

    return tickets.map((t) => ({
      id: t.id,
      ticketNumber: t.ticketNumber,
      subject: t.subject,
      department: t.department,
      priority: t.priority,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      latestMessage: t.messages?.[0]?.message || '',
      messageCount: t.messages?.length || 0,
    }));
  } catch (err) {
    console.error('[DbRepo] Error fetching support tickets:', err);
    return [];
  }
}

export async function getSupportTicketById(ticketId: string, accountId: string) {
  const db = getDb();
  if (!db) return null;

  try {
    const ticket = await db.query.supportTickets.findFirst({
      where: and(
        eq(schema.supportTickets.id, ticketId),
        eq(schema.supportTickets.accountId, accountId)
      ),
      with: {
        messages: {
          orderBy: [asc(schema.ticketMessages.createdAt)],
        },
      },
    });

    return ticket || null;
  } catch (err) {
    console.error('[DbRepo] Error fetching support ticket details:', err);
    return null;
  }
}

export async function addTicketMessage(data: {
  ticketId: string;
  senderType: 'merchant' | 'support_staff';
  senderId?: string;
  message: string;
  attachments?: any[];
}) {
  const db = getDb();
  if (!db) {
    return {
      id: `msg_${Date.now()}`,
      ticketId: data.ticketId,
      senderType: data.senderType,
      message: data.message,
      attachments: data.attachments || [],
      createdAt: new Date(),
    };
  }

  try {
    const [msg] = await db
      .insert(schema.ticketMessages)
      .values({
        ticketId: data.ticketId,
        senderType: data.senderType,
        senderId: data.senderId || null,
        message: data.message,
        attachments: data.attachments || [],
      })
      .returning();

    // Update ticket timestamp and reopen if closed
    await db
      .update(schema.supportTickets)
      .set({
        status: data.senderType === 'merchant' ? 'open' : 'waiting_merchant',
        updatedAt: new Date(),
      })
      .where(eq(schema.supportTickets.id, data.ticketId));

    return msg;
  } catch (err) {
    console.error('[DbRepo] Error adding ticket message:', err);
    throw err;
  }
}

export async function closeSupportTicket(ticketId: string, accountId: string) {
  const db = getDb();
  if (!db) return true;

  try {
    await db
      .update(schema.supportTickets)
      .set({
        status: 'closed',
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.supportTickets.id, ticketId),
          eq(schema.supportTickets.accountId, accountId)
        )
      );

    return true;
  } catch (err) {
    console.error('[DbRepo] Error closing support ticket:', err);
    return false;
  }
}


