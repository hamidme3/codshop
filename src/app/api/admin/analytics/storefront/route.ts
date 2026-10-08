import { NextResponse } from 'next/server';
import { getStoreBySlug, getProducts, getStorefrontAnalyticsFromDb, getLiveVisitors } from '@/lib/db-repository';
import { isValidStoreSlug } from '@/lib/sanitizer';

interface ProductStats {
  id: string;
  title: string;
  slug?: string;
  uniqueVisitors: number;
  totalViews: number;
  ordersCount: number;
  conversionRate: number;
}

interface SearchTermStats {
  query: string;
  count: number;
  resultsCount: number;
  isZeroResult: boolean;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeSlug = req.headers.get('x-user-store-slug');

    if (!storeSlug) {
      return NextResponse.json({ success: false, message: 'Store slug is required' }, { status: 400 });
    }

    if (!isValidStoreSlug(storeSlug)) {
      return NextResponse.json({ success: false, message: 'Invalid store identifier' }, { status: 400 });
    }

    // 1. Fetch store products to align metrics
    const storeProducts = await getProducts(storeSlug);

    // 2. Query Real Multi-Tenant Analytics from Database
    const dbAnalytics = await getStorefrontAnalyticsFromDb(storeSlug);

    if (dbAnalytics) {
      return NextResponse.json({
        success: true,
        store: storeSlug,
        timestamp: new Date().toISOString(),
        live: dbAnalytics.live,
        funnel: dbAnalytics.funnel,
        abandonment: dbAnalytics.abandonment,
        searches: dbAnalytics.searches,
        products: dbAnalytics.products || [],
        channels: dbAnalytics.channels,
        source: dbAnalytics.source,
      }, {
        headers: {
          'Cache-Control': 'public, max-age=5, stale-while-revalidate=15',
        },
      });
    }


    // 4. Default empty real state for any new store
    return NextResponse.json({
      success: true,
      store: storeSlug,
      timestamp: new Date().toISOString(),
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
      source: 'fresh_tenant',
    }, {
      headers: {
        'Cache-Control': 'public, max-age=5, stale-while-revalidate=15',
      },
    });
  } catch (error) {
    console.error('[Storefront Analytics API] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
