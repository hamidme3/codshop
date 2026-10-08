import { NextResponse } from 'next/server';
import { getProducts, getProductBySlugOrSku, convertDbProductToStorefrontProduct } from '@/lib/db-repository';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const headerStore = req.headers.get('x-store-slug');
    let storeSlug = searchParams.get('store') || headerStore;
    if (!storeSlug) {
      const host = req.headers.get('host') || '';
      const cleanHost = host.split(':')[0].toLowerCase();
      const rootDomain = process.env.NEXT_PUBLIC_WILDCARD_DOMAIN || 'codshop.vipone.site';
      if (cleanHost.endsWith(rootDomain) && cleanHost !== rootDomain && cleanHost !== `www.${rootDomain}`) {
        storeSlug = cleanHost.replace(`.${rootDomain}`, '');
      } else if (cleanHost.endsWith('.localhost')) {
        storeSlug = cleanHost.replace('.localhost', '');
      }
    }
    
    // Final fallback
    storeSlug = storeSlug || 'ottavio';
    const slugQuery = searchParams.get('slug')?.toLowerCase().trim();

    // 1. Fetch products from DB
    let dbProducts: any[] = [];
    try {
      dbProducts = await getProducts(storeSlug);
    } catch (err) {
      console.error('[API Storefront Products] DB error:', err);
    }

    // Convert to storefront format
    const storefrontProducts = dbProducts
      .filter((p) => p.status !== 'draft')
      .map((p) => convertDbProductToStorefrontProduct(p));

    const isPreview = searchParams.get('preview') === 'true';

    // If querying a single product by slug or sku
    if (slugQuery) {
      // Check if product exists in this store in draft mode
      const draftMatch = dbProducts.find(
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
      let match = (isPreview ? dbProducts.map((p) => convertDbProductToStorefrontProduct(p)) : storefrontProducts).find(
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
