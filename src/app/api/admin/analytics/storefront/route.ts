import { NextResponse } from 'next/server';
import { getStoreBySlug } from '@/lib/db-repository';
import { getProducts } from '@/lib/backoffice';
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
    const storeSlug = searchParams.get('store') || 'ottavio';

    if (!isValidStoreSlug(storeSlug)) {
      return NextResponse.json({ success: false, message: 'Invalid store identifier' }, { status: 400 });
    }

    // 1. Fetch store products to align metrics
    const storeProducts = getProducts(storeSlug);

    // 2. Query Real Multi-Tenant Analytics from Database
    const { getStorefrontAnalyticsFromDb } = await import('@/lib/db-repository');
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

    // 3. Fallback only for demo store (ottavio) if no DB events recorded yet
    if (storeSlug === 'ottavio') {
      const defaultProductStats: ProductStats[] = storeProducts.map((p, idx) => {
        const baseVisitors = Math.max(12, Math.floor(450 / (idx + 1) + (p.price % 37) * 4));
        const totalViews = Math.floor(baseVisitors * 1.38);
        const ordersCount = Math.max(1, Math.floor(baseVisitors * 0.052));
        const conversionRate = Number(((ordersCount / baseVisitors) * 100).toFixed(1));

        return {
          id: p.id,
          title: p.title,
          slug: (p as any).slug || p.id,
          uniqueVisitors: baseVisitors,
          totalViews,
          ordersCount,
          conversionRate,
        };
      });

      const totalVisitors = defaultProductStats.reduce((sum, p) => sum + p.uniqueVisitors, 0);
      const totalProductViews = defaultProductStats.reduce((sum, p) => sum + p.totalViews, 0);
      const totalCatalogViews = Math.floor(totalVisitors * 0.45);
      const totalInitiated = Math.floor(totalProductViews * 0.42);
      const totalStep2 = Math.floor(totalInitiated * 0.78);
      const totalOrders = defaultProductStats.reduce((sum, p) => sum + p.ordersCount, 0);
      const totalWhatsApp = Math.floor(totalInitiated * 0.14);

      const totalAbandoned = Math.max(12, Math.floor(totalInitiated - totalOrders));
      const step1Abandoned = Math.floor(totalAbandoned * 0.58);
      const step2Abandoned = totalAbandoned - step1Abandoned;
      const recoverableLeads = Math.max(4, Math.floor(step2Abandoned * 0.65));

      const searchTerms: SearchTermStats[] = [
        { query: 'sac cuir véritable', count: 142, resultsCount: 2, isZeroResult: false },
        { query: 'babouche artisanale', count: 89, resultsCount: 1, isZeroResult: false },
        { query: 'ceinture cuir fès', count: 64, resultsCount: 0, isZeroResult: true },
        { query: 'mocassin daim 42', count: 38, resultsCount: 1, isZeroResult: false },
        { query: 'portefeuille homme', count: 29, resultsCount: 1, isZeroResult: false },
        { query: 'coffret cadeau artisanal', count: 17, resultsCount: 0, isZeroResult: true },
      ];

      const liveVisitors = Math.max(3, Math.floor((totalVisitors % 19) + 4));
      const inCheckoutNow = Math.max(1, Math.floor(liveVisitors * 0.25));

      return NextResponse.json({
        success: true,
        store: storeSlug,
        timestamp: new Date().toISOString(),
        live: {
          activeNow: liveVisitors,
          inCheckout: inCheckoutNow,
          activeProducts: defaultProductStats.slice(0, 3).map((p) => ({
            title: p.title,
            activeViewers: Math.max(1, Math.floor(liveVisitors / 2)),
          })),
        },
        funnel: {
          visitors: totalVisitors,
          catalogViews: totalCatalogViews,
          productViews: totalProductViews,
          initiatedCheckout: totalInitiated,
          checkoutStep2: totalStep2,
          ordersCompleted: totalOrders,
          overallConversionRate: Number(((totalOrders / Math.max(1, totalVisitors)) * 100).toFixed(1)),
        },
        abandonment: {
          totalAbandoned,
          step1Abandoned,
          step2Abandoned,
          recoverableLeads,
          recoveryRate: Number(((recoverableLeads / totalAbandoned) * 100).toFixed(1)),
        },
        searches: searchTerms,
        products: defaultProductStats,
        channels: {
          webOrders: totalOrders,
          webPercentage: Math.round((totalOrders / (totalOrders + totalWhatsApp)) * 100),
          whatsappRescues: totalWhatsApp,
          whatsappPercentage: Math.round((totalWhatsApp / (totalOrders + totalWhatsApp)) * 100),
        },
        source: 'demo_fallback',
      }, {
        headers: {
          'Cache-Control': 'public, max-age=10, stale-while-revalidate=30',
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
