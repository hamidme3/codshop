/**
 * Server-Side Order Pricing & Integrity Engine for Moroccan COD
 * Prevents client-side price tampering (subtotal, total, shippingFee)
 * by fetching genuine catalog prices and recomputing exact tier pricing server-side.
 */

import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { MOCK_PRODUCTS, QuantityTier, getProductQuantityTiers } from './mockProducts';
import { convertDbProductToStorefrontProduct } from './db-repository';
import { PRODUCTS } from './mocks';
import { getStoreBySlug as getMockStoreBySlug } from './stores';
import { MOROCCAN_CITIES, getCityShipping, FREE_SHIPPING_THRESHOLD } from './moroccanCities';
import { getCountryCityShipping } from './geo';
import { sanitizeText } from './sanitizer';

export interface CatalogProductResolution {
  id: string;
  title: string;
  price: number;
  quantityTiers?: QuantityTier[];
}

/**
 * Resolves a product from Postgres DB or Mock Product Catalogs.
 */
export async function resolveCatalogProduct(
  identifier: { id?: string; productId?: string; slug?: string; title?: string; sku?: string },
  storeSlug: string
): Promise<CatalogProductResolution | null> {
  const targetId = (identifier.productId || identifier.id || '').trim().toLowerCase();
  const targetSlug = (identifier.slug || '').trim().toLowerCase();
  const targetTitle = (identifier.title || '').trim().toLowerCase();
  const targetSku = (identifier.sku || '').trim().toLowerCase();

  // 1. Try Payload CMS first (single source of truth for products)
  try {
    const { resolvePayloadCatalogProduct } = await import('./payload-products');
    const payloadProd = await resolvePayloadCatalogProduct(identifier, storeSlug);
    if (payloadProd) {
      let tiers = payloadProd.quantityTiers;
      if (!tiers || tiers.length === 0) {
        const mockMatch = MOCK_PRODUCTS.find(
          (p) =>
            p.id === payloadProd.id ||
            p.sku.toLowerCase() === (identifier.sku || '').toLowerCase() ||
            p.slug.toLowerCase() === targetSlug
        );
        tiers = mockMatch?.quantityTiers;
      }
      return {
        id: payloadProd.id,
        title: payloadProd.title,
        price: payloadProd.price,
        quantityTiers: tiers,
      };
    }
  } catch (err) {
    console.warn('[Pricing Engine] Payload catalog resolution unavailable, fallback:', err);
  }

  // 2. Try Postgres DB if connected
  const db = getDb();
  if (db) {
    try {
      const storeRow = await db.query.stores.findFirst({
        where: eq(schema.stores.slug, storeSlug),
      });
      if (storeRow) {
        const dbProducts = await db.query.products.findMany({
          where: eq(schema.products.storeId, storeRow.id),
        });
        const matched = dbProducts.find((p) => {
          const pId = p.id.toLowerCase();
          const pSku = p.sku.toLowerCase();
          const pTitle = p.title.toLowerCase();
          const titleSlug = pTitle.replace(/[^a-z0-9]+/g, '-');
          if (targetId && (pId === targetId || pSku === targetId)) return true;
          if (targetSku && (pSku === targetSku || targetSku.startsWith(pSku) || pSku.startsWith(targetSku))) return true;
          if (targetSlug && (pSku === targetSlug || titleSlug === targetSlug)) return true;
          if (targetTitle && (pTitle === targetTitle || pTitle.includes(targetTitle) || targetTitle.includes(pTitle))) return true;
          return false;
        });
        if (matched) {
          const mockMatch = MOCK_PRODUCTS.find((p) => p.id === matched.id || p.sku.toLowerCase() === matched.sku.toLowerCase() || p.slug.toLowerCase() === matched.sku.toLowerCase());
          let tiers = mockMatch?.quantityTiers;
          if (!tiers || tiers.length === 0) {
            const sfProd = convertDbProductToStorefrontProduct(matched);
            tiers = sfProd.quantityTiers;
          }
          return {
            id: matched.id,
            title: matched.title,
            price: Number(matched.price),
            quantityTiers: tiers,
          };
        }
      }
    } catch (err) {
      console.warn('[Pricing Engine] DB lookup fallback to catalog:', err);
    }
  }

  // 2. Try MOCK_PRODUCTS (Theme-specific catalog with explicit quantityTiers)
  const mockProduct = MOCK_PRODUCTS.find((p) => {
    const pId = p.id.toLowerCase();
    const pSlug = p.slug.toLowerCase();
    const pSku = p.sku.toLowerCase();
    const pTitle = p.title.toLowerCase();
    const titleSlug = pTitle.replace(/[^a-z0-9]+/g, '-');
    if (targetId && (pId === targetId || pSlug === targetId || pSku === targetId)) return true;
    if (targetSku && (pSku === targetSku || targetSku.startsWith(pSku) || pSku.startsWith(targetSku))) return true;
    if (targetSlug && (pSlug === targetSlug || titleSlug === targetSlug || pSku === targetSlug)) return true;
    if (targetTitle && (pTitle === targetTitle || (p.titleAr && p.titleAr === identifier.title))) return true;
    return false;
  });
  if (mockProduct) {
    return {
      id: mockProduct.id,
      title: mockProduct.title,
      price: mockProduct.price,
      quantityTiers: mockProduct.quantityTiers,
    };
  }

  // 3. Try PRODUCTS (Store-specific inventory)
  const idAliases: Record<string, string> = {
    'it_1': 'prod_1',
    'it_2': 'prod_2',
    'it_3': 'prod_3',
    'it_4': 'prod_4',
  };
  const resolvedId = idAliases[targetId] || targetId;

  const repoProduct = PRODUCTS.find((p) => {
    const pId = p.id.toLowerCase();
    const pSku = p.sku.toLowerCase();
    const pTitle = p.title.toLowerCase();
    if (resolvedId && (pId === resolvedId || pSku === resolvedId)) return true;
    if (targetTitle && (pTitle === targetTitle || pTitle.includes(targetTitle) || targetTitle.includes(pTitle))) return true;
    return false;
  });
  if (repoProduct) {
    const mockMatch = MOCK_PRODUCTS.find((p) => p.id === repoProduct.id || p.sku === repoProduct.sku || p.slug === repoProduct.sku);
    const tiers = mockMatch?.quantityTiers;
    return {
      id: repoProduct.id,
      title: repoProduct.title,
      price: repoProduct.price,
      quantityTiers: tiers,
    };
  }

  // 4. Try Store Builder cod_checkout section
  const mockStore = getMockStoreBySlug(storeSlug);
  const codSection = mockStore?.pages?.[0]?.sections?.find((s) => s.type === 'cod_checkout');
  if (codSection?.settings) {
    const secTitle = (codSection.settings.productTitle || '').toLowerCase();
    const secPrice = Number(codSection.settings.price) || 349;
    if (
      (targetTitle && (targetTitle.includes('boutique') || targetTitle.includes('produit') || secTitle.includes(targetTitle) || targetTitle.includes(secTitle))) ||
      targetId === 'sec_cod_prod' ||
      targetId === '1'
    ) {
      return {
        id: 'sec_cod_prod',
        title: codSection.settings.productTitle || 'Article Premium',
        price: secPrice,
      };
    }
  }

  // 5. Default store product fallback if target is empty, '1', or generic 'Produit'
  if ((!targetId || targetId === '1') && (!targetTitle || targetTitle === 'produit')) {
    const storeProducts = PRODUCTS.filter((p) => p.storeSlug === storeSlug);
    if (storeProducts.length > 0) {
      return {
        id: storeProducts[0].id,
        title: storeProducts[0].title,
        price: storeProducts[0].price,
      };
    }
  }

  return null;
}

/**
 * Recomputes the exact tier price for an item based on catalog configuration.
 */
export function calculateItemTierPricing(
  product: CatalogProductResolution,
  quantity: number,
  storeDiscounts?: { packDuoDiscount?: number; packTrioDiscount?: number }
): { unitPrice: number; itemSubtotal: number } {
  const qty = Math.max(1, Math.floor(quantity));

  // Priority 1: Product has explicit quantityTiers (e.g. mockProducts.ts)
  if (product.quantityTiers && product.quantityTiers.length > 0) {
    const exactTier = product.quantityTiers.find((t) => t.quantity === qty);
    if (exactTier) {
      return {
        unitPrice: exactTier.unitPrice,
        itemSubtotal: exactTier.totalPrice,
      };
    }

    const sorted = [...product.quantityTiers].sort((a, b) => a.quantity - b.quantity);
    const highest = sorted[sorted.length - 1];
    if (qty > highest.quantity) {
      return {
        unitPrice: highest.unitPrice,
        itemSubtotal: highest.unitPrice * qty,
      };
    }

    const lower = sorted.filter((t) => t.quantity <= qty).pop() || sorted[0];
    return {
      unitPrice: lower.unitPrice,
      itemSubtotal: lower.unitPrice * qty,
    };
  }

  // Priority 2: Explicit storeDiscounts passed (e.g. from store settings or test overrides)
  if (storeDiscounts?.packDuoDiscount !== undefined || storeDiscounts?.packTrioDiscount !== undefined) {
    if (qty === 1) {
      return { unitPrice: product.price, itemSubtotal: product.price };
    } else if (qty === 2) {
      const discount = storeDiscounts.packDuoDiscount ?? 0;
      const subtotal = Math.max(product.price, product.price * 2 - discount);
      return { unitPrice: Math.round(subtotal / 2), itemSubtotal: subtotal };
    } else {
      const discount = storeDiscounts.packTrioDiscount ?? 0;
      const subtotal = Math.max(product.price, product.price * qty - discount);
      return { unitPrice: Math.round(subtotal / qty), itemSubtotal: subtotal };
    }
  }

  // Priority 3: Moroccan Standard Pack Tier Rules (Pack Duo -15%, Pack Trio -25%)
  if (qty === 1) {
    return {
      unitPrice: product.price,
      itemSubtotal: product.price,
    };
  } else if (qty === 2) {
    const duoUnit = Math.round(product.price * 0.85);
    const subtotal = duoUnit * 2;
    return {
      unitPrice: duoUnit,
      itemSubtotal: subtotal,
    };
  } else {
    const trioUnit = Math.round(product.price * 0.75);
    const subtotal = trioUnit * qty;
    return {
      unitPrice: trioUnit,
      itemSubtotal: subtotal,
    };
  }
}

/**
 * Recomputes shipping fee under Moroccan COD rules.
 */
export function calculateVerifiedShippingFee(
  cityName: string,
  subtotal: number,
  totalQuantity: number,
  deliveryType: 'home' | 'stopdesk' = 'home',
  tierFreeDelivery: boolean = false,
  countryCode: string = 'MA'
): { shippingFee: number; isFreeShipping: boolean } {
  // 1. Pack Duo (2+ units) or tier free delivery
  if (totalQuantity >= 2 || tierFreeDelivery || deliveryType === 'stopdesk') {
    return { shippingFee: 0, isFreeShipping: true };
  }

  const code = (countryCode || 'MA').toUpperCase();
  if (code !== 'MA') {
    const countryShip = getCountryCityShipping(code, cityName, subtotal);
    return {
      shippingFee: countryShip.fee,
      isFreeShipping: countryShip.isFree,
    };
  }

  // 2. Free shipping threshold (400 MAD) nationwide in Morocco
  if (subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0) {
    return { shippingFee: 0, isFreeShipping: true };
  }

  // 3. City-specific shipping rate
  const cityInfo = getCityShipping(cityName, subtotal);
  return {
    shippingFee: cityInfo.fee,
    isFreeShipping: cityInfo.isFree,
  };
}

export interface VerifiedPricingResult {
  success: boolean;
  error?: string;
  countryCode: string;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    price: number;
    variant: string;
    sku?: string;
    color?: string;
    size?: string;
    subtotal: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  city: string;
  address: string;
  customerName: string;
  deliveryType: 'home' | 'stopdesk';
  agencyName?: string | null;
  tamperingDetected: boolean;
}

/**
 * Comprehensive Server-Side Price Verification and Sanitization.
 * Analyzes the request body, overrides any client-supplied totals/subtotals/shipping fees,
 * and guarantees database and dispatch pricing integrity.
 */
export async function verifyAndRecalculateOrder(
  body: any,
  storeSlug: string = 'default-store',
  overrideCountryCode?: string
): Promise<VerifiedPricingResult> {
  const safeStoreSlug = storeSlug || body?.storeSlug || 'default-store';
  const orderCountryCode = (overrideCountryCode || body?.countryCode || body?.country || 'MA').toUpperCase();
  // 1. Sanitize text fields
  const customerName = sanitizeText(body.customerName || body.customer?.fullName || 'Client Anonyme', 100) || 'Client Anonyme';
  const city = sanitizeText(body.customerCity || body.customer?.city || body.city || 'Casablanca', 100) || 'Casablanca';
  const address = sanitizeText(body.customerAddress || body.customer?.address || body.address || 'Adresse standard', 300) || 'Adresse standard';
  const deliveryType = (body.deliveryType === 'stopdesk' ? 'stopdesk' : 'home') as 'home' | 'stopdesk';
  const agencyName = body.agencyName ? sanitizeText(body.agencyName, 150) : null;

  // 2. Normalize input items
  const rawItems: any[] = Array.isArray(body.items) && body.items.length > 0
    ? body.items
    : [
        {
          id: body.product?.id,
          productId: body.product?.productId,
          slug: body.product?.slug,
          title: body.product?.title,
          quantity: body.quantity,
          variant: body.product?.variant || body.variant,
          sku: body.product?.sku || body.sku,
          color: body.product?.color || body.color,
          size: body.product?.size || body.size,
          freeDelivery: Boolean(body.freeDelivery || body.product?.freeDelivery),
        },
      ];

  // 3. Resolve products & recalculate prices
  const verifiedItems: Array<{
    id: string;
    title: string;
    quantity: number;
    price: number;
    variant: string;
    sku?: string;
    color?: string;
    size?: string;
    subtotal: number;
  }> = [];

  let computedSubtotal = 0;
  let totalQuantity = 0;
  let hasTierFreeDelivery = Boolean(body.freeDelivery || body.product?.freeDelivery);

  // Store discount settings
  const mockStore = getMockStoreBySlug(safeStoreSlug);
  const codSection = mockStore?.pages?.[0]?.sections?.find((s) => s.type === 'cod_checkout');
  const storeDiscounts = codSection?.settings?.packDuoDiscount !== undefined || codSection?.settings?.packTrioDiscount !== undefined
    ? {
        packDuoDiscount: codSection.settings.packDuoDiscount !== undefined ? Number(codSection.settings.packDuoDiscount) : undefined,
        packTrioDiscount: codSection.settings.packTrioDiscount !== undefined ? Number(codSection.settings.packTrioDiscount) : undefined,
      }
    : undefined;

  for (const rawIt of rawItems) {
    const qty = Math.max(1, Math.floor(Number(rawIt.quantity) || 1));
    const cleanVariant = sanitizeText(rawIt.variant || body.product?.variant || body.variant || 'Standard', 100) || 'Standard';
    const cleanSku = rawIt.sku || body.product?.sku || body.sku ? sanitizeText(rawIt.sku || body.product?.sku || body.sku, 50) : undefined;
    const cleanColor = rawIt.color || body.product?.color || body.color ? sanitizeText(rawIt.color || body.product?.color || body.color, 50) : undefined;
    const cleanSize = rawIt.size || body.product?.size || body.size ? sanitizeText(rawIt.size || body.product?.size || body.size, 50) : undefined;

    const catalogProd = await resolveCatalogProduct(rawIt, safeStoreSlug);
    if (!catalogProd) {
      return {
        success: false,
        countryCode: orderCountryCode,
        error: `Produit introuvable dans le catalogue: ${rawIt.title || rawIt.id || rawIt.slug || 'inconnu'}`,
        items: [],
        subtotal: 0,
        shippingFee: 0,
        total: 0,
        city,
        address,
        customerName,
        deliveryType,
        agencyName,
        tamperingDetected: false,
      };
    }

    const matchedTier = catalogProd.quantityTiers?.find((t) => t.quantity === qty);
    if (rawIt.freeDelivery || matchedTier?.freeDelivery) {
      hasTierFreeDelivery = true;
    }

    const tierPricing = calculateItemTierPricing(catalogProd, qty, storeDiscounts);
    const standardSubtotal = catalogProd.price * qty;

    const rawPrice = rawIt.price !== undefined ? Number(rawIt.price) : (body.unitPrice !== undefined ? Number(body.unitPrice) : undefined);
    const rawSubtotal = rawIt.subtotal !== undefined ? Number(rawIt.subtotal) : (body.subtotal !== undefined && rawItems.length === 1 ? Number(body.subtotal) : undefined);

    // A customer may check out with standard catalog unit price (e.g. from Cart Drawer)
    // or with discounted pack tier pricing (e.g. from Pack Duo/Trio modal).
    const isPayingStandardPrice = (
      (rawPrice !== undefined && Math.abs(rawPrice - catalogProd.price) <= 1) ||
      (rawSubtotal !== undefined && Math.abs(rawSubtotal - standardSubtotal) <= 2)
    );

    const pricing = isPayingStandardPrice
      ? { unitPrice: catalogProd.price, itemSubtotal: standardSubtotal }
      : tierPricing;

    computedSubtotal += pricing.itemSubtotal;
    totalQuantity += qty;

    verifiedItems.push({
      id: catalogProd.id,
      title: sanitizeText(catalogProd.title, 150),
      quantity: qty,
      price: pricing.unitPrice, // Authentic server-recalculated unit price!
      variant: cleanVariant,
      sku: cleanSku,
      color: cleanColor,
      size: cleanSize,
      subtotal: pricing.itemSubtotal,
    });
  }

  // 4. Recalculate shipping fee strictly server-side
  const shippingResult = calculateVerifiedShippingFee(
    city,
    computedSubtotal,
    totalQuantity,
    deliveryType,
    hasTierFreeDelivery,
    orderCountryCode
  );
  const computedShippingFee = shippingResult.shippingFee;
  const computedTotal = computedSubtotal + computedShippingFee;

  // 5. Detect client-side price tampering attempts
  let tamperingDetected = false;
  const clientTotal = body.total !== undefined ? Number(body.total) : undefined;
  const clientSubtotal = body.subtotal !== undefined ? Number(body.subtotal) : undefined;
  const clientShippingFee = body.shippingFee !== undefined ? Number(body.shippingFee) : undefined;

  if (clientTotal !== undefined && clientTotal !== computedTotal) {
    tamperingDetected = true;
    console.warn(`[Security Alert] Price tampering detected for store "${storeSlug}". Submitted total: ${clientTotal} DH, Recalculated total: ${computedTotal} DH.`);
  }
  if (clientSubtotal !== undefined && clientSubtotal !== computedSubtotal) {
    tamperingDetected = true;
  }
  if (clientShippingFee !== undefined && clientShippingFee !== computedShippingFee) {
    tamperingDetected = true;
  }

  return {
    success: true,
    countryCode: orderCountryCode,
    items: verifiedItems,
    subtotal: computedSubtotal,
    shippingFee: computedShippingFee,
    total: computedTotal,
    city,
    address,
    customerName,
    deliveryType,
    agencyName,
    tamperingDetected,
  };
}
