/**
 * Payload Products Adapter
 *
 * Wraps Payload CMS Local API with the same function signatures
 * used by db-repository.ts, making Payload the single source of
 * truth for Products while keeping external APIs unchanged.
 */

import type { Product } from './types';

// Lazy-load Payload to avoid circular import issues at module evaluation time
async function getPayloadInstance() {
  const { getPayload } = await import('payload');
  const configPromise = (await import('@payload-config')).default;
  return getPayload({ config: configPromise });
}

/**
 * Extract image URLs from Payload media relationship field.
 */
function extractImageUrls(images: any): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map((img: any) => {
      if (typeof img === 'string') return img;
      if (typeof img === 'object' && img !== null) {
        return img.url || img.sizes?.mobile?.url || img.filename || null;
      }
      return null;
    })
    .filter(Boolean) as string[];
}

/**
 * Maps a Payload product document to the app's Product interface.
 */
function mapPayloadDocToProduct(doc: any): Product {
  const storeSlug =
    typeof doc.store === 'object' && doc.store !== null
      ? doc.store.slug || ''
      : typeof doc.store === 'string'
        ? doc.store
        : '';

  return {
    id: doc.id,
    storeSlug,
    title: doc.title || '',
    sku: doc.sku || '',
    category: doc.category || 'General',
    price: Number(doc.price) || 0,
    comparePrice: doc.comparePrice ? Number(doc.comparePrice) : undefined,
    costPrice: Number(doc.costPrice) || 0,
    stock: Number(doc.stock) || 0,
    images: extractImageUrls(doc.images),
    variants: Array.isArray(doc.variants)
      ? doc.variants.map((v: any) => ({
          size: v.size || undefined,
          color: v.color || undefined,
          stock: Number(v.stock) || 0,
        }))
      : [],
    status: (doc.status as 'active' | 'draft') || 'active',
    badge: doc.badge || undefined,
    packDuoPrice: doc.packDuoPrice ? Number(doc.packDuoPrice) : undefined,
    packDuoFreeShipping: Boolean(doc.packDuoFreeShipping),
    packTrioPrice: doc.packTrioPrice ? Number(doc.packTrioPrice) : undefined,
    packTrioGift: doc.packTrioGift || undefined,
    description: doc.description || undefined,
  };
}

// ── READ ────────────────────────────────────────────────────────

export async function getProductsFromPayload(storeSlug: string): Promise<Product[]> {
  try {
    const payload = await getPayloadInstance();

    // First find the store by slug to get its Payload ID
    const storeResult = await payload.find({
      collection: 'stores',
      where: { slug: { equals: storeSlug } },
      depth: 0,
      overrideAccess: true,
      limit: 1,
    });

    if (storeResult.docs.length === 0) return [];

    const storeId = storeResult.docs[0].id;

    const result = await payload.find({
      collection: 'products',
      where: { store: { equals: storeId } },
      depth: 1, // resolve media URLs
      overrideAccess: true,
      limit: 500,
      sort: '-createdAt',
    });

    return result.docs.map(mapPayloadDocToProduct);
  } catch (err) {
    console.warn('[PayloadProducts] getProducts error, returning empty:', err);
    return [];
  }
}

export async function getProductByIdFromPayload(productId: string): Promise<Product | null> {
  try {
    const payload = await getPayloadInstance();
    const doc = await payload.findByID({
      collection: 'products',
      id: productId,
      depth: 1,
      overrideAccess: true,
    });
    return doc ? mapPayloadDocToProduct(doc) : null;
  } catch {
    return null;
  }
}

// ── CREATE ──────────────────────────────────────────────────────

export async function createProductInPayload(data: Omit<Product, 'id'>): Promise<Product> {
  const payload = await getPayloadInstance();

  // Resolve store relationship
  const storeResult = await payload.find({
    collection: 'stores',
    where: { slug: { equals: data.storeSlug } },
    depth: 0,
    overrideAccess: true,
    limit: 1,
  });

  const storeId = storeResult.docs.length > 0 ? storeResult.docs[0].id : undefined;

  const doc = await payload.create({
    collection: 'products',
    data: {
      title: data.title,
      sku: data.sku,
      store: storeId,
      category: data.category || 'General',
      price: Number(data.price),
      comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
      costPrice: Number(data.costPrice) || 0,
      stock: Number(data.stock) || 0,
      variants: data.variants || [],
      status: data.status || 'active',
      badge: data.badge,
      packDuoPrice: data.packDuoPrice ? Number(data.packDuoPrice) : undefined,
      packDuoFreeShipping: data.packDuoFreeShipping || false,
      packTrioPrice: data.packTrioPrice ? Number(data.packTrioPrice) : undefined,
      packTrioGift: data.packTrioGift,
      description: data.description,
    } as any,
    overrideAccess: true,
  });

  return mapPayloadDocToProduct(doc);
}

async function findPayloadProductDoc(payload: any, identifier: string): Promise<any | null> {
  if (!identifier) return null;
  const cleanId = String(identifier).trim();
  const isPayloadId =
    /^[0-9a-f]{24}$/.test(cleanId) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId) ||
    /^\d+$/.test(cleanId);

  if (isPayloadId) {
    try {
      const doc = await payload.findByID({
        collection: 'products',
        id: cleanId,
        depth: 0,
        overrideAccess: true,
      });
      if (doc) return doc;
    } catch {
      // Not found by ID, continue to search
    }
  }

  // Search by SKU or title
  try {
    const cleanSku = cleanId.replace(/^prod_/, '');
    const search = await payload.find({
      collection: 'products',
      where: {
        or: [
          { sku: { equals: cleanId } },
          { sku: { equals: cleanSku } },
          { title: { equals: cleanId } },
        ],
      },
      depth: 0,
      overrideAccess: true,
      limit: 1,
    });
    if (search.docs.length > 0) {
      return search.docs[0];
    }
  } catch {
    // Ignore error
  }

  return null;
}

// ── UPDATE ──────────────────────────────────────────────────────

export async function updateProductInPayload(
  productId: string,
  updates: Partial<Product>
): Promise<Product | null> {
  try {
    const payload = await getPayloadInstance();
    const doc = await findPayloadProductDoc(payload, productId);
    if (!doc) return null;

    const resolvedId = String(doc.id);

    const updateData: Record<string, any> = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.price !== undefined) updateData.price = Number(updates.price);
    if (updates.comparePrice !== undefined) updateData.comparePrice = Number(updates.comparePrice);
    if (updates.costPrice !== undefined) updateData.costPrice = Number(updates.costPrice);
    if (updates.stock !== undefined) updateData.stock = Number(updates.stock);
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.variants !== undefined) updateData.variants = updates.variants;
    if (updates.badge !== undefined) updateData.badge = updates.badge;
    if (updates.packDuoPrice !== undefined) updateData.packDuoPrice = Number(updates.packDuoPrice);
    if (updates.packDuoFreeShipping !== undefined) updateData.packDuoFreeShipping = updates.packDuoFreeShipping;
    if (updates.packTrioPrice !== undefined) updateData.packTrioPrice = Number(updates.packTrioPrice);
    if (updates.packTrioGift !== undefined) updateData.packTrioGift = updates.packTrioGift;
    if (updates.description !== undefined) updateData.description = updates.description;

    const updated = await payload.update({
      collection: 'products',
      id: resolvedId,
      data: updateData,
      overrideAccess: true,
    });

    return mapPayloadDocToProduct(updated);
  } catch (err) {
    console.warn('[PayloadProducts] updateProduct error:', err);
    return null;
  }
}

// ── DELETE ──────────────────────────────────────────────────────

export async function deleteProductInPayload(productId: string): Promise<boolean> {
  try {
    const payload = await getPayloadInstance();
    const doc = await findPayloadProductDoc(payload, productId);
    if (!doc) return true; // Already gone

    await payload.delete({
      collection: 'products',
      id: String(doc.id),
      overrideAccess: true,
    });

    return true;
  } catch (err) {
    console.warn('[PayloadProducts] deleteProduct error:', err);
    return false;
  }
}

// ── STOCK MANAGEMENT ────────────────────────────────────────────

export async function decrementPayloadStock(
  productId: string,
  quantity: number,
  variantMatch?: { size?: string; color?: string }
): Promise<void> {
  try {
    const payload = await getPayloadInstance();
    const product = await findPayloadProductDoc(payload, productId);
    if (!product) return;

    const updateData: Record<string, any> = {
      stock: Math.max(0, (Number(product.stock) || 0) - quantity),
    };

    // Also decrement matching variant stock
    if (Array.isArray(product.variants) && variantMatch) {
      updateData.variants = product.variants.map((v: any) => {
        const matchColor = variantMatch.color
          ? v.color?.toLowerCase() === variantMatch.color.toLowerCase()
          : true;
        const matchSize = variantMatch.size
          ? v.size?.toLowerCase() === variantMatch.size.toLowerCase()
          : true;
        if (matchColor && matchSize) {
          return { ...v, stock: Math.max(0, (v.stock || 0) - quantity) };
        }
        return v;
      });
    }

    await payload.update({
      collection: 'products',
      id: String(product.id),
      data: updateData,
      overrideAccess: true,
    });
  } catch (err) {
    console.warn('[PayloadProducts] decrementStock error:', err);
  }
}

export async function restorePayloadStock(
  items: Array<{ id: string; quantity: number; size?: string; color?: string }>
): Promise<void> {
  try {
    const payload = await getPayloadInstance();

    for (const it of items) {
      try {
        const product = await findPayloadProductDoc(payload, it.id);
        if (!product) continue;

        const updateData: Record<string, any> = {
          stock: (Number(product.stock) || 0) + it.quantity,
        };

        if (Array.isArray(product.variants)) {
          updateData.variants = product.variants.map((v: any) => {
            const matchColor = it.color
              ? v.color?.toLowerCase() === it.color.toLowerCase()
              : true;
            const matchSize = it.size
              ? v.size?.toLowerCase() === it.size.toLowerCase()
              : true;
            if (matchColor && matchSize) {
              return { ...v, stock: (v.stock || 0) + it.quantity };
            }
            return v;
          });
        }

        await payload.update({
          collection: 'products',
          id: String(product.id),
          data: updateData,
          overrideAccess: true,
        });
      } catch (innerErr) {
        console.warn(`[PayloadProducts] restoreStock error for item ${it.id}:`, innerErr);
      }
    }
  } catch (err) {
    console.warn('[PayloadProducts] restoreStock outer error:', err);
  }
}

// ── CATALOG RESOLUTION (for order pricing engine) ───────────────

export async function resolvePayloadCatalogProduct(
  identifier: { id?: string; productId?: string; slug?: string; title?: string; sku?: string },
  storeSlug: string
): Promise<{ id: string; title: string; price: number; quantityTiers?: any[] } | null> {
  try {
    const payload = await getPayloadInstance();

    // Find the store
    const storeResult = await payload.find({
      collection: 'stores',
      where: { slug: { equals: storeSlug } },
      depth: 0,
      overrideAccess: true,
      limit: 1,
    });
    if (storeResult.docs.length === 0) return null;
    const storeId = storeResult.docs[0].id;

    // Fetch all products for this store
    const productsResult = await payload.find({
      collection: 'products',
      where: { store: { equals: storeId } },
      depth: 0,
      overrideAccess: true,
      limit: 500,
    });

    const targetId = (identifier.productId || identifier.id || '').trim().toLowerCase();
    const targetSku = (identifier.sku || '').trim().toLowerCase();
    const targetTitle = (identifier.title || '').trim().toLowerCase();
    const targetSlug = (identifier.slug || '').trim().toLowerCase();

    const matched = productsResult.docs.find((p: any) => {
      const pId = String(p.id).toLowerCase();
      const pSku = (p.sku || '').toLowerCase();
      const pTitle = (p.title || '').toLowerCase();
      const titleSlug = pTitle.replace(/[^a-z0-9]+/g, '-');

      if (targetId && (pId === targetId || pSku === targetId)) return true;
      if (targetSku && (pSku === targetSku || targetSku.startsWith(pSku) || pSku.startsWith(targetSku))) return true;
      if (targetSlug && (pSku === targetSlug || titleSlug === targetSlug)) return true;
      if (targetTitle && (pTitle === targetTitle || pTitle.includes(targetTitle) || targetTitle.includes(pTitle))) return true;
      return false;
    });

    if (!matched) return null;

    return {
      id: String(matched.id),
      title: (matched as any).title,
      price: Number((matched as any).price),
      quantityTiers: (matched as any).quantityTiers || undefined,
    };
  } catch (err) {
    console.warn('[PayloadProducts] resolveCatalogProduct error:', err);
    return null;
  }
}
