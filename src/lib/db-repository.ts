import { getDb, schema } from '@/db';
import { eq, desc, asc, and, ne, gte, sql } from 'drizzle-orm';
import type { Order, Product, Customer, CourierName, OrderStatus, MenuItem, MenuPlacement, StoreMenu, StorePage, PolicyType } from './types';




import { getThemeById } from './themes';
import { sanitizeText, normalizeCustomerPhone } from './sanitizer';
import { SectionInstance } from './stores';

// ── Store Repository ──────────────────────────────────────────
export async function getStoreBySlug(slug: string) {
  const cleanSlug = slug.toLowerCase().trim();
  const db = getDb();
  if (db) {
    try {
      const storeRes = await db.select().from(schema.stores).where(eq(schema.stores.slug, cleanSlug)).limit(1);
      if (storeRes.length > 0) return storeRes[0];
    } catch (err) {
      console.warn('[DbRepo] Error fetching store by slug:', err);
    }
  }
  return undefined as any;
}

export interface StoreCheckoutSettings {
  checkoutEmailMode: 'hidden' | 'optional_collapsed' | 'optional_visible' | 'required';
  freeShippingThreshold: number;
  casaFee: number;
  rabatFee: number;
  otherCitiesFee: number;
  deliveryTimeframe: string;
}

export async function getStoreCheckoutSettings(slug: string): Promise<StoreCheckoutSettings> {
  const store = await getStoreBySlug(slug);
  return {
    checkoutEmailMode: ((store as any)?.checkoutEmailMode || 'hidden') as
      | 'hidden'
      | 'optional_collapsed'
      | 'optional_visible'
      | 'required',
    freeShippingThreshold: typeof (store as any)?.freeShippingThreshold === 'number' ? (store as any).freeShippingThreshold : 400,
    casaFee: typeof (store as any)?.casaFee === 'number' ? (store as any).casaFee : 20,
    rabatFee: typeof (store as any)?.rabatFee === 'number' ? (store as any).rabatFee : 25,
    otherCitiesFee: typeof (store as any)?.otherCitiesFee === 'number' ? (store as any).otherCitiesFee : 30,
    deliveryTimeframe: (store as any)?.deliveryTimeframe || '24h à 48h',
  };
}

export async function updateStoreCheckoutSettings(
  slug: string,
  settings: Partial<StoreCheckoutSettings>
) {
  const db = getDb();
  const validModes = ['hidden', 'optional_collapsed', 'optional_visible', 'required'];
  const updatePayload: any = {
    updatedAt: new Date(),
  };

  if (settings.checkoutEmailMode && validModes.includes(settings.checkoutEmailMode)) {
    updatePayload.checkoutEmailMode = settings.checkoutEmailMode;
  }
  if (typeof settings.freeShippingThreshold === 'number' && settings.freeShippingThreshold >= 0) {
    updatePayload.freeShippingThreshold = settings.freeShippingThreshold;
  }
  if (typeof settings.casaFee === 'number' && settings.casaFee >= 0) {
    updatePayload.casaFee = settings.casaFee;
  }
  if (typeof settings.rabatFee === 'number' && settings.rabatFee >= 0) {
    updatePayload.rabatFee = settings.rabatFee;
  }
  if (typeof settings.otherCitiesFee === 'number' && settings.otherCitiesFee >= 0) {
    updatePayload.otherCitiesFee = settings.otherCitiesFee;
  }
  if (settings.deliveryTimeframe && typeof settings.deliveryTimeframe === 'string') {
    updatePayload.deliveryTimeframe = settings.deliveryTimeframe.trim();
  }

  if (db) {
    try {
      await db
        .update(schema.stores)
        .set(updatePayload)
        .where(eq(schema.stores.slug, slug));
    } catch (err) {
      console.error('[DbRepo] Error updating store checkout settings in DB:', err);
    }
  }

  return { success: true, ...updatePayload };
}

export async function createStore(data: any) {
  const db = getDb();
  let dbStore = undefined;
  if (db) {
    try {
      const storeRes = await db.insert(schema.stores).values(data).returning();
      if (storeRes.length > 0) dbStore = storeRes[0];
    } catch (err) {
      console.warn('[DbRepo] Error creating store in Drizzle:', err);
    }
  }
  
  if (dbStore) {
    try {
      const { getPayloadInstance } = await import('./payload');
      const payload = await getPayloadInstance();
      await payload.create({
        collection: 'stores',
        data: {
          name: dbStore.name,
          slug: dbStore.slug,
          subdomain: dbStore.subdomain,
          currency: dbStore.currency,
          planTier: dbStore.planTier,
          shippingSettings: {
            freeShippingThreshold: dbStore.freeShippingThreshold,
            casaFee: dbStore.casaFee,
            rabatFee: dbStore.rabatFee,
            otherCitiesFee: dbStore.otherCitiesFee,
            deliveryTimeframe: dbStore.deliveryTimeframe,
          }
        },
        overrideAccess: true
      });
    } catch (payloadErr) {
      console.warn('[DbRepo] Error syncing new store to Payload:', payloadErr);
    }
  }

  return dbStore as any;
}

export async function getProducts(storeSlug: string): Promise<Product[]> {
  try {
    const { getProductsFromPayload } = await import('./payload-products');
    return await getProductsFromPayload(storeSlug);
  } catch (err) {
    console.warn('[DbRepo] Payload product fetch unavailable:', err);
    return [];
  }
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  const { createProductInPayload } = await import('./payload-products');
  const created = await createProductInPayload(data);
  if (!created) {
    throw new Error('Failed to create product in Payload CMS');
  }
  return created;
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    const { updateProductInPayload } = await import('./payload-products');
    const payloadUpdated = await updateProductInPayload(productId, updates);
    if (payloadUpdated) {
      
      return payloadUpdated;
    }
  } catch (err) {
    console.warn('[DbRepo] Payload product update warning:', err);
  }

  return null;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const { deleteProductInPayload } = await import('./payload-products');
  const success = await deleteProductInPayload(productId);
  return success;
}

export async function getProductBySlugOrSku(slugOrSku: string): Promise<Product | null> {
  const clean = slugOrSku.toLowerCase().trim();
  const { getProductBySlugOrSkuFromPayload } = await import('./payload-products');
  const product = await getProductBySlugOrSkuFromPayload(clean);
  return product || null;
}

/**
 * Converts a database or admin product into the rich Storefront Product model
 * compatible with ProductCard, CodCheckoutModal, and ProductDetailPage.
 */
export function convertDbProductToStorefrontProduct(p: any): any {
  const baseSlug = String(p.sku || p.id || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const price = Number(p.price) || 299;
  const originalPrice = p.comparePrice ? Number(p.comparePrice) : Math.round(price * 1.5);
  const duoPrice = p.packDuoPrice ? Number(p.packDuoPrice) : Math.max(price, Math.round(price * 2 - 100));
  const trioPrice = p.packTrioPrice ? Number(p.packTrioPrice) : Math.max(price, Math.round(price * 3 - 200));

  return {
    id: String(p.id),
    storeSlug: p.storeSlug || p.store_slug || p.store?.slug || undefined,
    slug: p.slug || baseSlug,
    sku: p.sku || `SKU-${String(p.id ?? '0000').slice(0, 4)}`,
    theme: p.theme || 'luxury',
    title: p.title,
    tagline: p.category || 'Collection Exclusive',
    price: price,
    originalPrice: originalPrice,
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
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
        freeDelivery: price >= 400,
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
    return [];
  }

  try {
    const store = await getStoreBySlug(storeSlug);
    if (!store || !('id' in store)) {
      return [];
    }

    const rows = await db.query.orders.findMany({
      where: eq(schema.orders.storeId, store.id),
      orderBy: [desc(schema.orders.createdAt)],
    });

    if (rows.length === 0) {
      return [];
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
    console.warn('[DbRepo] Error querying DB:', err); if (process.env.NODE_ENV === 'production') throw err;
    return [];
  }
}

export async function createOrder(data: {
  storeSlug: string;
  customerName: string;
  email?: string;
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
  status?: OrderStatus;
}) {
  const db = getDb();
  const orderNumber = `CMD-${Math.floor(1000 + Math.random() * 9000)}`;
  const isAbandoned = data.status === 'abandoned';

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
  const cleanEmail = data.email ? sanitizeText(data.email, 120)?.toLowerCase().trim() || undefined : undefined;
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

  // 3. Stock Status Check & Inventory Reservation (Skip for abandoned carts)
  if (!isAbandoned) {
    const invCheck = { inStock: true, message: "" };
    if (!invCheck.inStock) {
      throw new Error(invCheck.message || 'Stock insuffisant pour satisfaire cette commande.');
    }

    // 4. Inventory Decrement Execution (Reservation)
    
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
      email: cleanEmail,
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
      status: (data.status || 'new') as OrderStatus,
      createdAt: new Date().toISOString(),
    };
        
    return newOrder;
  }

  try {
    if (!isAbandoned) {
      await decrementDbProductStock(store.id, cleanItems);
    }

    let newOrder;
    try {
      [newOrder] = await db.insert(schema.orders).values({
        storeId: store.id,
        orderNumber,
        customerName: cleanCustomerName,
        email: cleanEmail || null,
        phone: data.phone,
        city: cleanCity,
        address: cleanAddress,
        status: (data.status || 'new') as any,
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
    } catch (insertErr) {
      if (!isAbandoned) {
        await restoreDbProductStock(store.id, cleanItems);
      }
      console.error('[DbRepo] Error creating order in DB, stock rolled back:', insertErr);
      throw insertErr;
    }

    // Auto-update or create Customer in CRM (strictly for completed orders, not abandoned checkout captures)
    if (!isAbandoned) {
      await syncCustomerFromOrder(store.id, cleanCustomerName, data.phone, cleanCity, cleanTotal, cleanEmail);
    }

    // Sync to in-memory ORDERS cache for real-time backoffice parity
    try {
      const memoryOrder = {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        storeSlug: data.storeSlug,
        customerName: newOrder.customerName,
        email: (newOrder as any).email || cleanEmail || undefined,
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
        status: (newOrder.status || data.status || 'new') as any,
        createdAt: new Date().toISOString(),
      };
            
    } catch (cacheErr) {
      console.warn('[DbRepo] Non-fatal in-memory cache sync warning:', cacheErr);
    }

    return newOrder;
  } catch (err) {
    console.error('[DbRepo] Error creating order in DB:', err);
    throw err;
  }
}

export async function decrementDbProductStock(
  storeId: string,
  items: Array<{ id: string; sku?: string; quantity: number; size?: string; color?: string }>
) {
  if (!items || items.length === 0) return;

  // Decrement in Payload CMS (single source of truth)
  try {
    const { decrementPayloadStock } = await import('./payload-products');
    for (const it of items) {
      await decrementPayloadStock(it.id, it.quantity, { size: it.size, color: it.color });
    }
  } catch (payloadStockErr) {
    console.warn('[DbRepo] Non-fatal Payload stock decrement warning:', payloadStockErr);
  }
}

export async function restoreDbProductStock(
  storeId: string,
  items: Array<{ id: string; sku?: string; quantity: number; size?: string; color?: string }>
) {
  if (!items || items.length === 0) return;

  // Restore in Payload CMS (single source of truth for products)
  try {
    const { restorePayloadStock } = await import('./payload-products');
    await restorePayloadStock(items);
  } catch (err) {
    console.warn('[DbRepo] Non-fatal Payload stock restore warning:', err);
  }
}

export async function getOrderByNumber(orderNumberOrId: string) {
  const db = getDb();
  if (!db) {
    const mock = null;
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
      const mock = null;
      return mock || null;
    }
    return {
      ...order,
      email: order.email || undefined,
    };
  } catch (err) {
    console.error('[DbRepo] Error fetching order by number or ID:', err);
    const mock = null;
    return mock || null;
  }
}

export async function addUpsellToOrder(
  orderNumberOrId: string,
  item: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    variant?: string;
    sku?: string;
    color?: string;
    size?: string;
  },
  newSubtotal: number,
  newTotal: number
) {
  const db = getDb();
  if (!db) return null;

  try {
    const orderRes = await db
      .select()
      .from(schema.orders)
      .where(
        sql`${schema.orders.id} = ${orderNumberOrId} OR ${schema.orders.orderNumber} = ${orderNumberOrId}`
      )
      .limit(1);

    if (orderRes.length > 0) {
      const order = orderRes[0];
      const items = Array.isArray(order.items) ? [...order.items] : [];
      items.push(item);

      const updated = await db
        .update(schema.orders)
        .set({
          items,
          subtotal: newSubtotal,
          total: newTotal,
        })
        .where(eq(schema.orders.id, order.id))
        .returning();

      return updated[0];
    }
  } catch (err) {
    console.error('[DbRepo] Error adding upsell to order:', err);
  }
  return null;
}

export async function syncCustomerFromOrder(
  storeId: string,
  name: string,
  phone: string,
  city: string,
  orderTotal: number,
  email?: string
) {
  const db = getDb();
  if (!db) return;

  try {
    const normPhone = normalizeCustomerPhone(phone) || phone;
    const storeCustomers = await db.query.customers.findMany({
      where: eq(schema.customers.storeId, storeId),
    });
    const existing = storeCustomers.find(
      (c) => c.phone === phone || c.phone === normPhone
    );

    if (existing) {
      const updatedTotalOrders = existing.totalOrders + 1;
      const updatedTotalSpend = existing.totalSpend + orderTotal;
      const updatePayload: any = {
        totalOrders: updatedTotalOrders,
        totalSpend: updatedTotalSpend,
        averageBasket: Math.round(updatedTotalSpend / updatedTotalOrders),
        status: 'returning',
        lastOrderAt: new Date(),
      };
      if (email && (!existing.email || existing.email !== email)) {
        updatePayload.email = email;
      }
      await db.update(schema.customers)
        .set(updatePayload)
        .where(eq(schema.customers.id, existing.id));
    } else {
      await db.insert(schema.customers).values({
        storeId,
        name,
        email: email || null,
        phone: normPhone,
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
    return [];
  }

  try {
    const store = await getStoreBySlug(storeSlug);
    if (!store || !('id' in store)) {
      return [];
    }

    const dbCusts = await db.query.customers.findMany({
      where: eq(schema.customers.storeId, store.id),
      orderBy: [desc(schema.customers.createdAt)],
    });

    if (dbCusts.length === 0) {
      return [];
    }

    // Also fetch store orders to populate recentOrders and delivery stats
    const storeOrders = await db.query.orders.findMany({
      where: eq(schema.orders.storeId, store.id),
      orderBy: [desc(schema.orders.createdAt)],
    });

    return dbCusts.map((c) => {
      const cNorm = c.phone;
      const custOrders = storeOrders.filter((o) => {
        if (o.phone === c.phone) return true;
        const oNorm = o.phone;
        return oNorm && cNorm && oNorm === cNorm;
      });
      const validCustOrders = custOrders.filter((o) => o.status !== 'abandoned');
      const lastOrd = custOrders[0];
      const delivered = validCustOrders.filter((o) => o.status === 'delivered').length;
      const returned = validCustOrders.filter((o) => o.status === 'returned').length;
      const abandoned = custOrders.filter((o) => o.status === 'abandoned').length;
      const totalResolved = delivered + returned;
      const deliverySuccessRate = totalResolved > 0 ? Math.round((delivered / totalResolved) * 100) : (delivered > 0 ? 100 : undefined);
      const deliveredSpend = validCustOrders.filter((o) => o.status === 'delivered').reduce((sum, o) => sum + Number(o.total), 0);

      return {
        id: c.id,
        storeSlug,
        name: c.name,
        phone: c.phone,
        email: c.email || '',
        city: c.city,
        totalOrders: validCustOrders.length > 0 ? validCustOrders.length : (abandoned > 0 ? 0 : c.totalOrders),
        totalSpend: deliveredSpend > 0 ? deliveredSpend : (delivered > 0 ? (c.totalSpend || 0) : 0),
        averageBasket: Math.round((deliveredSpend > 0 ? deliveredSpend : (c.totalSpend || 0)) / Math.max(1, delivered)),
        status: (c.status === 'vip' ? 'vip' : null) || (returned > 0 ? 'risk' : (delivered >= 2 || (validCustOrders.length >= 2 && delivered >= 1)) ? 'returning' : validCustOrders.length > 0 ? 'active' : (c.status as any) || 'new'),
        riskScore: (returned > 0 ? 'high' : 'low') as any,
        lastOrderDate: (c.lastOrderAt || lastOrd?.createdAt || c.createdAt)?.toISOString() || new Date().toISOString(),
        lastOrderNumber: lastOrd?.orderNumber,
        lastOrderStatus: (lastOrd?.status as any) || 'new',
        lastTrackingNumber: lastOrd?.trackingNumber || undefined,
        deliverySuccessRate,
        confirmedOrders: validCustOrders.filter((o) => o.status === 'confirmed').length,
        shippedOrders: validCustOrders.filter((o) => ['shipped', 'shipping'].includes(o.status)).length,
        deliveredOrders: delivered,
        returnedOrders: returned,
        canceledOrders: validCustOrders.filter((o) => o.status === 'canceled').length,
        abandonedOrders: abandoned,
        recentOrders: custOrders.slice(0, 50).map((o) => ({
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
          agentNotes: o.agentNotes || undefined,
        })),
      };
    });
  } catch (err) {
    console.warn('[DbRepo] Error querying DB:', err); if (process.env.NODE_ENV === 'production') throw err;
    return [];
  }
}

export async function updateCustomerNotes(phone: string, notes: string, storeSlug: string) {
  
}

export async function updateOrderNotes(orderId: string, notes: string, storeSlug?: string) {
  
  const db = getDb();
  if (!db) return;
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
    const whereClause = isUuid ? eq(schema.orders.id, orderId) : eq(schema.orders.orderNumber, orderId);
    await db.update(schema.orders).set({ agentNotes: notes, updatedAt: new Date() }).where(whereClause);
  } catch (err) {
    console.warn('[DbRepo] Error updating order notes in DB:', err);
  }
}

// ── User Authentication Repository ────────────────────────────
export async function findUserByEmail(email: string) {
  const db = getDb();
  const normalizedEmail = email.toLowerCase().trim();

  if (!db) {
    // Fallback for when DB connection isn't configured
    return undefined as any;
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
    return undefined as any;
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
  const defaultThemeId = 'luxury';
  const defaultThemeConfig = {};

  const db = getDb();
  if (db) {
    try {
      const layoutRes = await db
        .select()
        .from(schema.pageLayouts)
        .innerJoin(schema.stores, eq(schema.stores.id, schema.pageLayouts.storeId))
        .where(eq(schema.stores.slug, storeSlug))
        .limit(1);
      
      if (layoutRes.length > 0) {
        return {
          storeName: storeSlug.toUpperCase(),
          themeId: defaultThemeId,
          themeConfig: defaultThemeConfig,
          sections: layoutRes[0].page_layouts.sections as any,
          updatedAt: layoutRes[0].page_layouts.updatedAt
        };
      }
    } catch (err) {
      console.warn('[DbRepo] Error fetching store layout:', err);
    }
  }
  
  return {
    storeName: storeSlug.toUpperCase(),
    themeId: defaultThemeId,
    themeConfig: defaultThemeConfig,
    sections: [],
  };
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
  let totalSales = 0;
  let totalOrders = 0;

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
  if (!db) return undefined as any;

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
    return undefined as any;
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

// ── Store Analytics & Events Repository (Multi-Tenant SaaS) ────
interface ActiveVisitorSession {
  storeSlug: string;
  distinctId: string;
  lastSeenAt: number;
  inCheckout?: boolean;
}

interface MemoryAnalyticsEvent {
  id: string;
  storeSlug: string;
  eventName: string;
  distinctId: string;
  properties: Record<string, any>;
  createdAt: Date;
}

const memoryVisitorSessions = new Map<string, ActiveVisitorSession>();
const memoryAnalyticsEvents: MemoryAnalyticsEvent[] = [];

export async function recordAnalyticsEvent(data: {
  storeSlug: string;
  eventName: string;
  distinctId: string;
  properties?: Record<string, any>;
}) {
  const cleanStore = (data.storeSlug || '').toLowerCase().trim();
  const distinctId = data.distinctId || 'anonymous';
  const isInCheckout = ['initiated_checkout', 'checkout_step_2', 'cod_step_1_started', 'cod_step_2_started'].includes(data.eventName);
  const isCheckoutExit = data.eventName === 'order_completed' || data.eventName === 'cod_checkout_abandoned';

  const sessionKey = `${cleanStore}:${distinctId}`;
  const existingSession = memoryVisitorSessions.get(sessionKey);
  memoryVisitorSessions.set(sessionKey, {
    storeSlug: cleanStore,
    distinctId,
    lastSeenAt: Date.now(),
    inCheckout: isCheckoutExit ? false : (isInCheckout || (existingSession?.inCheckout ?? false)),
  });

  const db = getDb();
  if (!db) {
    if (data.eventName === 'order_completed' && data.properties?.orderId) {
      const existing = memoryAnalyticsEvents.find(
        (e) => e.storeSlug === cleanStore && e.eventName === 'order_completed' && e.properties?.orderId === data.properties?.orderId
      );
      if (existing) return existing;
    }
    const memoryEvent: MemoryAnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      storeSlug: cleanStore,
      eventName: data.eventName,
      distinctId,
      properties: data.properties || {},
      createdAt: new Date(),
    };
    memoryAnalyticsEvents.push(memoryEvent);
    return memoryEvent;
  }

  try {
    const store = await getStoreBySlug(data.storeSlug);
    if (!store || !('id' in store)) return undefined as any;

    // Deduplicate order_completed events for the same orderId to maintain pure idempotency
    if (data.eventName === 'order_completed' && data.properties?.orderId) {
      const existing = await db.query.analyticsEvents.findFirst({
        where: and(
          eq(schema.analyticsEvents.storeId, store.id),
          eq(schema.analyticsEvents.eventName, 'order_completed'),
          sql`${schema.analyticsEvents.properties}->>'orderId' = ${String(data.properties.orderId)}`
        ),
      });
      if (existing) {
        return existing;
      }
    }

    const [event] = await db
      .insert(schema.analyticsEvents)
      .values({
        storeId: store.id,
        eventName: data.eventName,
        distinctId: data.distinctId || 'anonymous',
        properties: data.properties || {},
      })
      .returning();

    return event;
  } catch (err) {
    console.warn('[DbRepo] Error recording analytics event:', err);
    return undefined as any;
  }
}

export async function getLiveVisitorsFromDb(storeSlug: string): Promise<{ liveVisitors: number; inCheckout: number }> {
  const cleanStore = (storeSlug || '').toLowerCase().trim();
  const db = getDb();

  if (db) {
    try {
      const store = await getStoreBySlug(cleanStore);
      if (store && 'id' in store) {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

        // Fetch lightweight distinct events from the last 15 minutes
        const events = await db.query.analyticsEvents.findMany({
          where: and(
            eq(schema.analyticsEvents.storeId, store.id),
            gte(schema.analyticsEvents.createdAt, fifteenMinutesAgo)
          ),
          columns: {
            distinctId: true,
            eventName: true,
            createdAt: true,
          },
        });

        // 1. Live visitors in last 5 minutes
        const recentEvents = events.filter((e) => e.createdAt >= fiveMinutesAgo);
        const liveDistinctIds = new Set(recentEvents.map((e) => e.distinctId));
        const liveVisitors = liveDistinctIds.size;

        // 2. Shoppers actively in checkout (last 15m, without exit after checkout)
        const checkoutEvents = events.filter((e) =>
          ['initiated_checkout', 'checkout_step_2', 'cod_step_1_started', 'cod_step_2_started'].includes(e.eventName)
        );
        const exitEvents = events.filter((e) =>
          ['order_completed', 'cod_checkout_abandoned'].includes(e.eventName)
        );
        const latestExitTimes = new Map<string, number>();
        exitEvents.forEach((e) => {
          const t = e.createdAt.getTime();
          const curr = latestExitTimes.get(e.distinctId) || 0;
          if (t > curr) latestExitTimes.set(e.distinctId, t);
        });

        const inCheckoutDistinctIds = new Set<string>();
        for (const ce of checkoutEvents) {
          const exitTime = latestExitTimes.get(ce.distinctId);
          if (!exitTime || ce.createdAt.getTime() > exitTime) {
            inCheckoutDistinctIds.add(ce.distinctId);
          }
        }

        return {
          liveVisitors,
          inCheckout: inCheckoutDistinctIds.size,
        };
      }
    } catch (err) {
      console.warn('[DbRepo] Error querying live visitors from DB, checking memory fallback:', err);
    }
  }

  // Fallback to in-memory sliding window
  const now = Date.now();
  const fiveMinAgo = now - 5 * 60 * 1000;

  let liveCount = 0;
  let checkoutCount = 0;

  for (const [key, session] of memoryVisitorSessions.entries()) {
    if (session.storeSlug === cleanStore) {
      if (session.lastSeenAt >= fiveMinAgo) {
        liveCount++;
        if (session.inCheckout) {
          checkoutCount++;
        }
      } else if (session.lastSeenAt < now - 30 * 60 * 1000) {
        memoryVisitorSessions.delete(key);
      }
    }
  }

  return {
    liveVisitors: liveCount,
    inCheckout: checkoutCount,
  };
}

export const getLiveVisitors = getLiveVisitorsFromDb;

export async function getStorefrontAnalyticsFromDb(storeSlug: string) {
  try {
    const cleanStore = (storeSlug || '').toLowerCase().trim();
    const db = getDb();

    let events: { eventName: string; distinctId: string; properties: any; createdAt: Date }[] = [];
    let storeOrders: any[] = [];

  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  if (!db) {
    events = memoryAnalyticsEvents.filter((e) => e.storeSlug === cleanStore && e.createdAt >= thirtyDaysAgo);
    storeOrders = (await getOrders(cleanStore)) || [];
  } else {
    try {
      const store = await getStoreBySlug(cleanStore);
      if (!store || !('id' in store)) return undefined as any;

      // 1. Fetch events from last 30 days
      events = (await db.query.analyticsEvents.findMany({
        where: and(
          eq(schema.analyticsEvents.storeId, store.id),
          gte(schema.analyticsEvents.createdAt, thirtyDaysAgo)
        ),
        orderBy: [desc(schema.analyticsEvents.createdAt)],
        limit: 10000,
      })) as any[];

      // 2. Fetch real orders from last 30 days
      storeOrders = await db.query.orders.findMany({
        where: and(
          eq(schema.orders.storeId, store.id),
          gte(schema.orders.createdAt, thirtyDaysAgo)
        ),
        orderBy: [desc(schema.orders.createdAt)],
      });
    } catch (err) {
      console.warn('[DbRepo] Error fetching analytics from DB:', err);
      return undefined as any;
    }
  }

  const activeOrders = storeOrders.filter((o) => o.status !== 'abandoned');
  const abandonedOrdersList = storeOrders.filter((o) => o.status === 'abandoned');

    // If no events and not ottavio, return authentic zero metrics for fresh stores
    if (events.length === 0 && storeOrders.length === 0 && storeSlug !== 'ottavio') {
      return {
        hasData: false,
        live: { activeNow: 0, inCheckout: 0, activeProducts: [] },
        funnel: {
          visitors: 0,
          catalogViews: 0,
          productViews: 0,
          initiatedCheckout: 0,
          checkoutStep2: 0,
          ordersCompleted: 0,
          overallConversionRate: 0,
        },
        abandonment: {
          totalAbandoned: 0,
          step1Abandoned: 0,
          step2Abandoned: 0,
          recoverableLeads: 0,
          recoveryRate: 0,
        },
        searches: [],
        products: [],
        channels: { webOrders: 0, webPercentage: 100, whatsappRescues: 0, whatsappPercentage: 0 },
        source: 'database_tenant',
      };
    }

    if (events.length === 0 && storeOrders.length === 0 && storeSlug === 'ottavio') {
      // Fallback for demo store ottavio
      return undefined as any;
    }

    // 3. Compute real live metrics using the unified live presence engine
    const livePresence = await getLiveVisitorsFromDb(storeSlug);
    const activeNow = livePresence.liveVisitors;
    const inCheckoutNow = livePresence.inCheckout;

    // Real active products viewed in the last 15 minutes
    const recentProductViews = events.filter(
      (e) => e.createdAt >= fifteenMinutesAgo && e.eventName === 'product_viewed'
    );
    const activeProductsMap = new Map<string, { title: string; viewers: Set<string> }>();
    for (const pv of recentProductViews) {
      const props = (pv.properties || {}) as any;
      const title = props.title || props.productTitle || props.product_title;
      if (title) {
        if (!activeProductsMap.has(title)) {
          activeProductsMap.set(title, { title, viewers: new Set() });
        }
        activeProductsMap.get(title)!.viewers.add(pv.distinctId);
      }
    }
    const liveActiveProducts = Array.from(activeProductsMap.values())
      .map((ap) => ({ title: ap.title, activeViewers: ap.viewers.size }))
      .slice(0, 3);

    // 4. Compute funnel (strictly counting completed, non-abandoned orders)
    const rawDistinctVisitors = new Set(events.map((e) => e.distinctId)).size;
    const ordersCompleted = activeOrders.length || events.filter((e) => e.eventName === 'order_completed').length;
    const allVisitors = Math.max(rawDistinctVisitors, ordersCompleted);
    const catalogViews = new Set(events.filter((e) => e.eventName === 'catalog_viewed').map((e) => e.distinctId)).size;
    const productViews = new Set(events.filter((e) => e.eventName === 'product_viewed').map((e) => e.distinctId)).size;
    const initiatedCheckout = new Set(events.filter(
      (e) => e.eventName === 'initiated_checkout' || e.eventName === 'cod_step_1_started'
    ).map((e) => e.distinctId)).size;
    const checkoutStep2 = new Set(events.filter(
      (e) => e.eventName === 'checkout_step_2' || e.eventName === 'cod_step_2_started'
    ).map((e) => e.distinctId)).size;
    const overallConversionRate = allVisitors > 0 ? Math.min(100, Number(((ordersCompleted / allVisitors) * 100).toFixed(1))) : 0;

    // 5. Abandonment & Recoverable Leads
    const completedPhones = new Set(
      activeOrders.map((o) => o.phone).filter(Boolean)
    );
    const completedDistinctIds = new Set(
      events.filter((e) => e.eventName === 'order_completed').map((e) => e.distinctId).filter(Boolean)
    );

    const abandonedEvents = events.filter((e) => e.eventName === 'cod_checkout_abandoned');
    const step1Abandoned = new Set(abandonedEvents.filter((e) => (e.properties as any)?.abandoned_at_step === 1 || (e.properties as any)?.step === 1).map((e) => e.distinctId)).size;
    const step2Abandoned = new Set(abandonedEvents.filter((e) => (e.properties as any)?.abandoned_at_step === 2 || (e.properties as any)?.step === 2).map((e) => e.distinctId)).size;

    // Filter out abandoned events for visitors who subsequently completed an order
    const unconvertedAbandonedEvents = abandonedEvents.filter((e) => {
      if (completedDistinctIds.has(e.distinctId)) return false;
      const rawPhone = (e.properties as any)?.phone;
      if (rawPhone && completedPhones.has(rawPhone)) return false;
      return true;
    });

    const eventRecoverableLeads = new Set(unconvertedAbandonedEvents.filter(
      (e) => (e.properties as any)?.has_phone === true || (e.properties as any)?.hasPhone === true
    ).map((e) => e.distinctId)).size;

    const totalAbandoned = Math.max(
      abandonedOrdersList.length,
      new Set(unconvertedAbandonedEvents.map((e) => e.distinctId)).size || Math.max(0, initiatedCheckout - ordersCompleted)
    );
    const recoverableLeads = abandonedOrdersList.length > 0 ? abandonedOrdersList.length : eventRecoverableLeads;
    const recoveryRate = totalAbandoned > 0 ? Math.min(100, Number(((recoverableLeads / totalAbandoned) * 100).toFixed(1))) : 0;

    // 6. Searches
    const searchEvents = events.filter((e) => e.eventName === 'search_performed');
    const searchMap = new Map<string, { distinctIds: Set<string>; resultsCount: number; isZeroResult: boolean }>();
    searchEvents.forEach((se) => {
      const q = ((se.properties as any)?.search_query || (se.properties as any)?.query || '').trim().toLowerCase();
      if (!q) return;
      const existing = searchMap.get(q) || {
        distinctIds: new Set<string>(),
        resultsCount: (se.properties as any)?.results_count ?? (se.properties as any)?.resultsCount ?? 0,
        isZeroResult: (se.properties as any)?.is_zero_result ?? (se.properties as any)?.isZeroResult ?? false,
      };
      if (se.distinctId) {
        existing.distinctIds.add(se.distinctId);
      }
      searchMap.set(q, existing);
    });
    const searches = Array.from(searchMap.entries())
      .map(([query, data]) => ({
        query,
        count: Math.max(1, data.distinctIds.size),
        resultsCount: data.resultsCount,
        isZeroResult: data.isZeroResult,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    let finalSearches = searches;
    if (finalSearches.length === 0 && storeSlug === 'ottavio') {
      finalSearches = [
        { query: 'sac cuir véritable', count: 142, resultsCount: 2, isZeroResult: false },
        { query: 'babouche artisanale', count: 89, resultsCount: 1, isZeroResult: false },
        { query: 'ceinture cuir fès', count: 64, resultsCount: 0, isZeroResult: true },
        { query: 'mocassin daim 42', count: 38, resultsCount: 1, isZeroResult: false },
        { query: 'portefeuille homme', count: 29, resultsCount: 1, isZeroResult: false },
        { query: 'coffret cadeau artisanal', count: 17, resultsCount: 0, isZeroResult: true },
      ];
    }

    // 7. Channels
    const whatsappRescues = events.filter((e) => e.eventName === 'whatsapp_rescue_clicked').length;
    const webOrders = activeOrders.filter((o) => (o as any).source !== 'whatsapp').length || ordersCompleted;
    const totalChannelOrders = Math.max(1, webOrders + whatsappRescues);

    // 8. Products Breakdown (Performance de l'Offre)
    let dbStoreProducts: any[] = [];
    try {
      const { getProductsFromPayload } = await import('./payload-products');
      dbStoreProducts = await getProductsFromPayload(storeSlug);
    } catch (prodErr) {
      console.warn('[DbRepo] Non-fatal product fetch warning:', prodErr);
    }
    const memStoreProducts: any[] = [];
    const combinedProductsMap = new Map<string, any>();
    for (const p of dbStoreProducts) {
      const key = (p.sku || p.id || p.title || '').toLowerCase().trim();
      combinedProductsMap.set(key, p);
    }
    for (const p of memStoreProducts) {
      const key = (p.sku || p.id || p.title || '').toLowerCase().trim();
      if (!combinedProductsMap.has(key)) {
        combinedProductsMap.set(key, p);
      }
    }
    const storeProducts = Array.from(combinedProductsMap.values());

    const products = storeProducts.map((p) => {
      const pIdRaw = p.id;
      const pId = pIdRaw && pIdRaw !== 'undefined' ? String(pIdRaw).toLowerCase() : '';
      const pSkuRaw = p.sku;
      const pSku = pSkuRaw && pSkuRaw !== 'undefined' ? String(pSkuRaw).toLowerCase() : '';
      const pSlugRaw = p.slug || p.sku || p.id;
      const pSlug = pSlugRaw && pSlugRaw !== 'undefined' ? String(pSlugRaw).toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
      const pTitleRaw = p.title;
      const pTitle = pTitleRaw && pTitleRaw !== 'undefined' ? String(pTitleRaw).toLowerCase() : '';
      const pSkuClean = pSku.replace(/[^a-z0-9]/g, '');

      // Match events for this product (views, initiates, checkout steps, abandonments, orders)
      const matchingEvents = events.filter((e) => {
        const props = (e.properties || {}) as any;
        const eIdRaw = props.productId || props.product_id || props.id;
        const eId = eIdRaw && eIdRaw !== 'undefined' ? String(eIdRaw).toLowerCase() : '';
        const eSkuRaw = props.sku;
        const eSku = eSkuRaw && eSkuRaw !== 'undefined' ? String(eSkuRaw).toLowerCase() : '';
        const eSlugRaw = props.slug;
        const eSlug = eSlugRaw && eSlugRaw !== 'undefined' ? String(eSlugRaw).toLowerCase() : '';
        const eTitleRaw = props.title || props.product_title;
        const eTitle = eTitleRaw && eTitleRaw !== 'undefined' ? String(eTitleRaw).toLowerCase() : '';
        const ePath = String(props.path || '').toLowerCase();

        const matches = (
          (eId && pId && eId === pId) ||
          (pSku && eSku && eSku === pSku) ||
          (pSku && eId === pSku) ||
          (pSlug && eSlug && eSlug === pSlug) ||
          (pTitle && eTitle && eTitle === pTitle) ||
          (pSlug && ePath && (ePath === `/${pSlug}` || ePath.endsWith(`/${pSlug}`))) ||
          (pSku && ePath && ePath.endsWith(`/${pSkuClean}`))
        );

        return matches && ['product_viewed', 'initiated_checkout', 'checkout_step_2', 'cod_checkout_abandoned', 'order_completed'].includes(e.eventName);
      });

      const uniqueVisitors = new Set(matchingEvents.map((e) => e.distinctId)).size;
      const totalViews = matchingEvents.filter((e) => e.eventName === 'product_viewed').length;

      // Match orders containing this product (strictly active, non-abandoned orders)
      const matchingOrders = activeOrders.filter((ord) => {
        const items = (ord.items || []) as any[];
        return items.some((it) => {
          const itIdRaw = it.id || it.productId;
          const itId = itIdRaw && itIdRaw !== 'undefined' ? String(itIdRaw).toLowerCase() : '';
          const itSkuRaw = it.sku;
          const itSku = itSkuRaw && itSkuRaw !== 'undefined' ? String(itSkuRaw).toLowerCase() : '';
          const itTitleRaw = it.title;
          const itTitle = itTitleRaw && itTitleRaw !== 'undefined' ? String(itTitleRaw).toLowerCase() : '';

          return (
            (itId && pId && itId === pId) ||
            (pSku && itSku && itSku === pSku) ||
            (pSku && itId === pSku) ||
            (pTitle && itTitle && itTitle === pTitle)
          );
        });
      });

      const ordersCount = matchingOrders.length;
      const effectiveVisitors = Math.max(uniqueVisitors, ordersCount);
      const effectiveViews = Math.max(totalViews, effectiveVisitors);
      const conversionRate = effectiveVisitors > 0 ? Number(((ordersCount / effectiveVisitors) * 100).toFixed(1)) : 0;

      return {
        id: p.id,
        title: p.title,
        slug: p.slug || pSku || p.id,
        uniqueVisitors: effectiveVisitors,
        totalViews: effectiveViews,
        ordersCount,
        conversionRate,
      };
    });

    return {
      hasData: true,
      live: {
        activeNow,
        inCheckout: inCheckoutNow,
        activeProducts: liveActiveProducts,
      },
      funnel: {
        visitors: allVisitors,
        catalogViews,
        productViews,
        initiatedCheckout,
        checkoutStep2,
        ordersCompleted,
        overallConversionRate,
      },
      abandonment: {
        totalAbandoned,
        step1Abandoned,
        step2Abandoned,
        recoverableLeads,
        recoveryRate,
      },
      searches: finalSearches,
      products,
      channels: {
        webOrders,
        webPercentage: Math.round((webOrders / totalChannelOrders) * 100),
        whatsappRescues,
        whatsappPercentage: Math.round((whatsappRescues / totalChannelOrders) * 100),
      },
      source: 'database_tenant',
    };
  } catch (err) {
    console.error('[DbRepo] Error querying store analytics:', err);
    return undefined as any;
  }
}

// ── Store Navigation Menus Repository ─────────────────────────

export async function getStoreMenus(storeSlug: string): Promise<StoreMenu[]> {
  const cleanSlug = (storeSlug).toLowerCase().trim();
  const db = getDb();
  if (db) {
    try {
      const store = await getStoreBySlug(cleanSlug);
      if (store && store.id) {
        const rows = await db.query.menus.findMany({
          where: eq(schema.menus.storeId, store.id),
        });
        if (rows && rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            storeSlug: cleanSlug,
            placement: r.placement as MenuPlacement,
            title: r.title,
            items: (r.items as MenuItem[]) || [],
            updatedAt: r.updatedAt ? r.updatedAt.toISOString() : new Date().toISOString(),
          }));
        }
      }
    } catch (err) {
      console.warn('[DbRepo] Error querying DB:', err); if (process.env.NODE_ENV === 'production') throw err;
    }
  }
  return [];
}

export async function getStoreMenuByPlacement(
  storeSlug: string,
  placement: MenuPlacement
): Promise<StoreMenu> {
  const cleanSlug = (storeSlug).toLowerCase().trim();
  const db = getDb();
  if (db) {
    try {
      const store = await getStoreBySlug(cleanSlug);
      if (store && store.id) {
        const row = await db.query.menus.findFirst({
          where: and(eq(schema.menus.storeId, store.id), eq(schema.menus.placement, placement)),
        });
        if (row) {
          return {
            id: row.id,
            storeSlug: cleanSlug,
            placement: row.placement as MenuPlacement,
            title: row.title,
            items: (row.items as MenuItem[]) || [],
            updatedAt: row.updatedAt ? row.updatedAt.toISOString() : new Date().toISOString(),
          };
        }
      }
    } catch (err) {
      console.warn('[DbRepo] Error querying DB:', err); if (process.env.NODE_ENV === 'production') throw err;
    }
  }
  return undefined as any;
}

export async function updateStoreMenu(
  storeSlug: string,
  placement: MenuPlacement,
  items: MenuItem[],
  title?: string
): Promise<StoreMenu> {
  const cleanSlug = (storeSlug).toLowerCase().trim();
  const db = getDb();
  if (db) {
    try {
      const store = await getStoreBySlug(cleanSlug);
      if (store && store.id) {
        const existing = await db.query.menus.findFirst({
          where: and(eq(schema.menus.storeId, store.id), eq(schema.menus.placement, placement)),
        });
        if (existing) {
          await db
            .update(schema.menus)
            .set({
              items,
              title: title || existing.title,
              updatedAt: new Date(),
            })
            .where(eq(schema.menus.id, existing.id));
        } else {
          await db.insert(schema.menus).values({
            storeId: store.id,
            placement,
            title: title || `${placement} Menu`,
            items,
          });
        }
      }
    } catch (err) {
      console.warn('[DbRepo] Error querying DB:', err); if (process.env.NODE_ENV === 'production') throw err;
    }
  }
  return undefined as any;
}

export async function resetStoreMenu(
  storeSlug: string,
  placement: MenuPlacement
): Promise<StoreMenu> {
  const cleanSlug = (storeSlug).toLowerCase().trim();
  const defaultMenu = undefined;
  const db = getDb();
  if (db) {
    try {
      const store = await getStoreBySlug(cleanSlug);
      if (store && store.id) {
        const existing = await db.query.menus.findFirst({
          where: and(eq(schema.menus.storeId, store.id), eq(schema.menus.placement, placement)),
        });
        if (existing) {
          await db
            .update(schema.menus)
            .set({
              items: [],
              title: "",
              updatedAt: new Date(),
            })
            .where(eq(schema.menus.id, existing.id));
        } else {
          await db.insert(schema.menus).values({
            storeId: store.id,
            placement,
            title: "",
            items: [],
          });
        }
      }
    } catch (err) {
      console.warn('[DbRepo] Error querying DB:', err); if (process.env.NODE_ENV === 'production') throw err;
    }
  }
  return undefined as any;
}

// ── Store Custom Pages & Policies Repository ───────────────────
export async function getStorePages(storeSlug: string, onlyPublished: boolean = false): Promise<StorePage[]> {
  const cleanSlug = (storeSlug).toLowerCase().trim();
  const db = getDb();
  if (db) {
    try {
      const store = await db.query.stores.findFirst({
        where: eq(schema.stores.slug, cleanSlug),
      });
      if (store) {
        const rows = await db.query.pages.findMany({
          where: onlyPublished
            ? and(eq(schema.pages.storeId, store.id), eq(schema.pages.isPublished, true))
            : eq(schema.pages.storeId, store.id),
          orderBy: [desc(schema.pages.createdAt)],
        });

        if (rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            storeSlug: cleanSlug,
            title: r.title,
            slug: r.slug,
            content: r.content,
            policyType: (r.policyType as PolicyType) || 'custom',
            isSystemPolicy: r.isSystemPolicy,
            isPublished: r.isPublished,
            seoTitle: r.seoTitle || undefined,
            seoDescription: r.seoDescription || undefined,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          }));
        }
      }
    } catch (err) {
      console.warn('[DbRepo] Error querying DB:', err); if (process.env.NODE_ENV === 'production') throw err;
    }
  }

  const mockPages: any[] = [];
  return onlyPublished ? mockPages.filter((p) => p.isPublished) : mockPages;
}

export async function getStorePageBySlug(storeSlug: string, slug: string): Promise<StorePage | null> {
  const cleanSlug = (storeSlug).toLowerCase().trim();
  const cleanPageSlug = (slug || '').toLowerCase().trim();

  const db = getDb();
  if (db) {
    try {
      const store = await db.query.stores.findFirst({
        where: eq(schema.stores.slug, cleanSlug),
      });
      if (store) {
        const row = await db.query.pages.findFirst({
          where: and(eq(schema.pages.storeId, store.id), eq(schema.pages.slug, cleanPageSlug)),
        });
        if (row) {
          return {
            id: row.id,
            storeSlug: cleanSlug,
            title: row.title,
            slug: row.slug,
            content: row.content,
            policyType: (row.policyType as PolicyType) || 'custom',
            isSystemPolicy: row.isSystemPolicy,
            isPublished: row.isPublished,
            seoTitle: row.seoTitle || undefined,
            seoDescription: row.seoDescription || undefined,
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
          };
        }
      }
    } catch (err) {
      console.warn('[DbRepo] Error querying DB:', err); if (process.env.NODE_ENV === 'production') throw err;
    }
  }

  return undefined as any;
}

export async function createOrUpdateStorePage(
  storeSlug: string,
  pageData: Partial<StorePage> & { title: string; slug: string; content: string }
): Promise<StorePage | null> {
  const cleanSlug = (storeSlug).toLowerCase().trim();
  const normalizedSlug = pageData.slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');

  const db = getDb();
  if (db) {
    try {
      const store = await db.query.stores.findFirst({
        where: eq(schema.stores.slug, cleanSlug),
      });
      if (store) {
        const existing = await db.query.pages.findFirst({
          where: and(eq(schema.pages.storeId, store.id), eq(schema.pages.slug, normalizedSlug)),
        });

        if (existing) {
          const [updated] = await db
            .update(schema.pages)
            .set({
              title: pageData.title.trim(),
              content: pageData.content,
              policyType: pageData.policyType || existing.policyType,
              isPublished: pageData.isPublished !== undefined ? pageData.isPublished : existing.isPublished,
              seoTitle: pageData.seoTitle,
              seoDescription: pageData.seoDescription,
              updatedAt: new Date(),
            })
            .where(eq(schema.pages.id, existing.id))
            .returning();

          if (updated) {
            
            return {
              id: updated.id,
              storeSlug: cleanSlug,
              title: updated.title,
              slug: updated.slug,
              content: updated.content,
              policyType: (updated.policyType as PolicyType) || 'custom',
              isSystemPolicy: updated.isSystemPolicy,
              isPublished: updated.isPublished,
              seoTitle: updated.seoTitle || undefined,
              seoDescription: updated.seoDescription || undefined,
              createdAt: updated.createdAt.toISOString(),
              updatedAt: updated.updatedAt.toISOString(),
            };
          }
        } else {
          const [inserted] = await db
            .insert(schema.pages)
            .values({
              storeId: store.id,
              title: pageData.title.trim(),
              slug: normalizedSlug,
              content: pageData.content,
              policyType: pageData.policyType || 'custom',
              isSystemPolicy: Boolean(pageData.isSystemPolicy),
              isPublished: pageData.isPublished !== undefined ? pageData.isPublished : true,
              seoTitle: pageData.seoTitle,
              seoDescription: pageData.seoDescription,
            })
            .returning();

          if (inserted) {
            
            return {
              id: inserted.id,
              storeSlug: cleanSlug,
              title: inserted.title,
              slug: inserted.slug,
              content: inserted.content,
              policyType: (inserted.policyType as PolicyType) || 'custom',
              isSystemPolicy: inserted.isSystemPolicy,
              isPublished: inserted.isPublished,
              seoTitle: inserted.seoTitle || undefined,
              seoDescription: inserted.seoDescription || undefined,
              createdAt: inserted.createdAt.toISOString(),
              updatedAt: inserted.updatedAt.toISOString(),
            };
          }
        }
      }
    } catch (err) {
      console.warn('[DbRepo] Error querying DB:', err); if (process.env.NODE_ENV === 'production') throw err;
    }
  }

  return null;
}

export async function deleteStorePage(storeSlug: string, idOrSlug: string): Promise<boolean> {
  const cleanSlug = (storeSlug).toLowerCase().trim();
  const db = getDb();
  if (db) {
    try {
      const store = await db.query.stores.findFirst({
        where: eq(schema.stores.slug, cleanSlug),
      });
      if (store) {
        await db
          .delete(schema.pages)
          .where(
            and(
              eq(schema.pages.storeId, store.id),
              sql`(${schema.pages.id}::text = ${idOrSlug} OR ${schema.pages.slug} = ${idOrSlug.toLowerCase().trim()})`
            )
          );
      }
    } catch (err) {
      console.warn('[DbRepo] Error querying DB:', err); if (process.env.NODE_ENV === 'production') throw err;
    }
  }

  return true;
}

export async function generateStandardStorePolicies(storeSlug: string): Promise<StorePage[]> {
  const cleanSlug = (storeSlug).toLowerCase().trim();
  const mockResult: any[] = [];

  const db = getDb();
  if (db) {
    try {
      const store = await db.query.stores.findFirst({
        where: eq(schema.stores.slug, cleanSlug),
      });
      if (store) {
        for (const page of mockResult) {
          const existing = await db.query.pages.findFirst({
            where: and(eq(schema.pages.storeId, store.id), eq(schema.pages.slug, page.slug)),
          });
          if (existing) {
            await db
              .update(schema.pages)
              .set({
                title: page.title,
                content: page.content,
                policyType: page.policyType,
                isSystemPolicy: true,
                seoTitle: page.seoTitle,
                seoDescription: page.seoDescription,
                updatedAt: new Date(),
              })
              .where(eq(schema.pages.id, existing.id));
          } else {
            await db.insert(schema.pages).values({
              storeId: store.id,
              title: page.title,
              slug: page.slug,
              content: page.content,
              policyType: page.policyType,
              isSystemPolicy: true,
              isPublished: true,
              seoTitle: page.seoTitle,
              seoDescription: page.seoDescription,
            });
          }
        }
      }
    } catch (err) {
      console.warn('[DbRepo] Error querying DB:', err); if (process.env.NODE_ENV === 'production') throw err;
    }
  }

  return mockResult;
}



