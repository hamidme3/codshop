import { NextResponse } from 'next/server';
import { getProducts, getProductBySlugOrSku, convertDbProductToStorefrontProduct } from '@/lib/db-repository';
import { getProducts as getMockProducts, PRODUCTS } from '@/lib/mocks';
import { MOCK_PRODUCTS, getProductBySlug as getMockProductBySlug } from '@/lib/mockProducts';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const headerStore = req.headers.get('x-store-slug');
    const storeSlug = searchParams.get('store') || headerStore || 'storet1';
    const slugQuery = searchParams.get('slug')?.toLowerCase().trim();

    // 1. Fetch products from DB
    let dbProducts: any[] = [];
    try {
      dbProducts = await getProducts(storeSlug);
    } catch {
      dbProducts = getMockProducts(storeSlug);
    }

    // 2. Fetch in-memory products
    const memProducts = PRODUCTS.filter((p) => p.storeSlug === storeSlug);
    const existingIds = new Set(dbProducts.map((p) => p.id));
    const existingSkus = new Set(dbProducts.map((p) => String(p.sku || '').toLowerCase()).filter(Boolean));
    const combined = [...dbProducts];
    for (const mp of memProducts) {
      const skuLower = String(mp.sku || '').toLowerCase();
      if (!existingIds.has(mp.id) && (!skuLower || !existingSkus.has(skuLower))) {
        combined.push(mp);
        existingIds.add(mp.id);
        if (skuLower) existingSkus.add(skuLower);
      }
    }

    // Convert to storefront format
    const storefrontProducts = combined
      .filter((p) => p.status !== 'draft')
      .map((p) => convertDbProductToStorefrontProduct(p));

    const isPreview = searchParams.get('preview') === 'true';

    // If querying a single product by slug or sku
    if (slugQuery) {
      // Check if product exists in this store in draft mode
      const draftMatch = combined.find(
        (p) =>
          String(p.sku || '').toLowerCase() === slugQuery ||
          String(p.id || '').toLowerCase() === slugQuery ||
          String(p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === slugQuery
      );

      if (draftMatch && draftMatch.status === 'draft' && !isPreview) {
        return NextResponse.json(
          { success: false, message: 'Ce produit est actuellement en cours de préparation', isDraft: true },
          { status: 404 }
        );
      }

      // 1. Check current store published products (or draft if preview)
      let match = (isPreview ? combined.map((p) => convertDbProductToStorefrontProduct(p)) : storefrontProducts).find(
        (p) =>
          String(p.slug || '').toLowerCase() === slugQuery ||
          String(p.sku || '').toLowerCase() === slugQuery ||
          String(p.id || '').toLowerCase() === slugQuery ||
          String(p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === slugQuery
      );

      // 2. If not found in current store, check DB directly by slug/sku across all stores
      if (!match) {
        try {
          const dbProd = await getProductBySlugOrSku(slugQuery);
          if (dbProd) {
            if (dbProd.status === 'draft' && !isPreview) {
              return NextResponse.json(
                { success: false, message: 'Ce produit est actuellement en cours de préparation', isDraft: true },
                { status: 404 }
              );
            }
            match = convertDbProductToStorefrontProduct(dbProd);
          }
        } catch {}
      }

      // 3. Fallback to mockProducts
      if (!match) {
        match = getMockProductBySlug(slugQuery);
      }

      if (match) {
        return NextResponse.json({ success: true, product: match, isPreview: isPreview && draftMatch?.status === 'draft' });
      }

      return NextResponse.json({ success: false, message: 'Produit introuvable' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      products: storefrontProducts,
      count: storefrontProducts.length,
      store: storeSlug,
    });
  } catch (error: any) {
    console.error('[API Storefront Products] GET error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Error retrieving products' },
      { status: 500 }
    );
  }
}
