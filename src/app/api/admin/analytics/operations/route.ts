import { NextResponse } from 'next/server';
import { getOrders, getProducts } from '@/lib/db-repository';
import { getOrders as getMockOrders, ORDERS } from '@/lib/mocks';
import { isValidStoreSlug } from '@/lib/sanitizer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeSlug = searchParams.get('store') || 'ottavio';

    if (!isValidStoreSlug(storeSlug)) {
      return NextResponse.json({ success: false, message: 'Invalid store slug' }, { status: 400 });
    }

    // 1. Fetch real DB orders
    let dbOrders: any[] = [];
    try {
      dbOrders = await getOrders(storeSlug);
    } catch {
      dbOrders = [];
    }

    // 2. Fetch in-memory orders
    const memOrders = ORDERS.filter((o) => o.storeSlug === storeSlug);
    const existingNumbers = new Set(dbOrders.map((o) => o.orderNumber));
    const combined = [...dbOrders];
    for (const mo of memOrders) {
      if (!existingNumbers.has(mo.orderNumber)) {
        combined.push(mo);
        existingNumbers.add(mo.orderNumber);
      }
    }

    // Rolling 14-day date generator helper
    const now = new Date();
    const dayFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
    const emptyDailyCashflow = Array.from({ length: 14 }).map((_, idx) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (13 - idx));
      return {
        date: dayFormatter.format(d).replace('.', ''),
        deliveredCash: 0,
        inTransitCash: 0,
        returnedLoss: 0,
      };
    });

    // 3. If no orders and not ottavio, return authentic zero state
    if (combined.length === 0 && storeSlug !== 'ottavio') {
      return NextResponse.json({
        success: true,
        store: storeSlug,
        totalOrders: 0,
        totalRevenueDelivered: 0,
        totalRevenuePotential: 0,
        confirmationRate: 0,
        deliveryRate: 0,
        returnRate: 0,
        totalCostOfGoods: 0,
        totalShippingPaid: 0,
        netProfit: 0,
        cityDistribution: [],
        dailyCashflow: emptyDailyCashflow,
        pipelineStages: [
          { key: 'to_confirm', name: '1. À Confirmer', count: 0, value: 0, color: '#94a3b8' },
          { key: 'confirmed', name: '2. Confirmées', count: 0, value: 0, color: '#06b6d4' },
          { key: 'shipped', name: '3. En Transit', count: 0, value: 0, color: '#38bdf8' },
          { key: 'delivered', name: '4. Livrées & Encaissées', count: 0, value: 0, color: '#10b981' },
          { key: 'returned', name: '5. Retours / Refus', count: 0, value: 0, color: '#f43f5e' },
        ],
        topProducts: [],
        source: 'database_tenant_empty',
      });
    }

    // 4. Calculate real operational metrics
    const storeOrders = combined.length > 0 ? combined : (storeSlug === 'ottavio' ? getMockOrders('ottavio') : []);
    const totalOrders = storeOrders.length;
    const deliveredOrders = storeOrders.filter((o) => o.status === 'delivered');
    const returnedOrders = storeOrders.filter((o) => o.status === 'returned');
    const confirmedOrders = storeOrders.filter((o) =>
      ['confirmed', 'shipped', 'shipping', 'delivered'].includes(o.status)
    );
    const shippingOrders = storeOrders.filter((o) =>
      ['shipped', 'shipping', 'delivered', 'returned'].includes(o.status)
    );

    const totalRevenueDelivered = deliveredOrders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const totalRevenuePotential = storeOrders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

    const confirmationRate = totalOrders > 0 ? (confirmedOrders.length / totalOrders) * 100 : 0;
    const deliveryRate = shippingOrders.length > 0 ? (deliveredOrders.length / shippingOrders.length) * 100 : 0;
    const returnRate = shippingOrders.length > 0 ? (returnedOrders.length / shippingOrders.length) * 100 : 0;

    // Fetch real product costs from catalog to avoid arbitrary COGS multiplier
    let storeProducts: any[] = [];
    try {
      storeProducts = await getProducts(storeSlug);
    } catch {
      storeProducts = [];
    }
    const productCostMap = new Map<string, number>();
    for (const p of storeProducts) {
      if (p.costPrice !== undefined && p.costPrice !== null) {
        if (p.title) productCostMap.set(p.title.toLowerCase().trim(), Number(p.costPrice));
        if (p.sku) productCostMap.set(p.sku.toLowerCase().trim(), Number(p.costPrice));
      }
    }

    let totalCostOfGoods = 0;
    for (const order of deliveredOrders) {
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          const itemKey = (item.sku || item.title || '').toLowerCase().trim();
          const unitCost = productCostMap.get(itemKey) ?? ((Number(item.price) || 0) * 0.35);
          totalCostOfGoods += unitCost * (Number(item.quantity) || 1);
        }
      } else {
        totalCostOfGoods += (Number(order.subtotal) || 0) * 0.35;
      }
    }

    const totalShippingPaid = deliveredOrders.length * 25 + returnedOrders.length * 15;
    const netProfit = Math.max(0, totalRevenueDelivered - totalCostOfGoods - totalShippingPaid);

    // City distribution with authentic city-level delivery rates
    const cityMap = new Map<string, { orders: number; revenue: number; delivered: number; returned: number }>();
    storeOrders.forEach((o) => {
      const c = o.city ?? 'Autre';
      const existing = cityMap.get(c) ?? { orders: 0, revenue: 0, delivered: 0, returned: 0 };
      const isDelivered = o.status === 'delivered';
      const isReturned = ['returned', 'canceled'].includes(o.status);
      cityMap.set(c, {
        orders: existing.orders + 1,
        revenue: existing.revenue + (Number(o.total) || 0),
        delivered: existing.delivered + (isDelivered ? 1 : 0),
        returned: existing.returned + (isReturned ? 1 : 0),
      });
    });
    const total = storeOrders.length || 1;
    const cityDistribution = Array.from(cityMap.entries())
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 6)
      .map(([city, data]) => {
        const dispatched = data.delivered + data.returned;
        const cityDeliveryRate = dispatched > 0
          ? Math.round((data.delivered / dispatched) * 100)
          : (data.orders > 0 ? Math.round((data.delivered / data.orders) * 100) : 0);
        return {
          city,
          orders: data.orders,
          rate: Number(((data.orders / total) * 100).toFixed(1)),
          revenue: Math.round(data.revenue),
          deliveryRate: cityDeliveryRate,
        };
      });

    // Compute Daily Cashflow (Rolling 14 Days)
    const dailyCashflow = Array.from({ length: 14 }).map((_, idx) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (13 - idx));
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
      const dateLabel = dayFormatter.format(d).replace('.', '');

      const dayOrders = storeOrders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= dayStart && orderDate <= dayEnd;
      });

      const deliveredCash = dayOrders
        .filter((o) => o.status === 'delivered')
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

      const inTransitCash = dayOrders
        .filter((o) => ['shipped', 'shipping'].includes(o.status))
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

      const returnedLoss = dayOrders
        .filter((o) => ['returned', 'canceled'].includes(o.status))
        .reduce((sum, o) => sum + 15, 0);

      return {
        date: dateLabel,
        deliveredCash: Math.round(deliveredCash),
        inTransitCash: Math.round(inTransitCash),
        returnedLoss: Math.round(returnedLoss),
      };
    });

    // 5. Order Pipeline Velocity (Stage Breakdown)
    const pendingOrders = storeOrders.filter((o) => ['new', 'to_confirm'].includes(o.status));
    const confirmedOnlyOrders = storeOrders.filter((o) => o.status === 'confirmed');
    const inTransitOrders = storeOrders.filter((o) => ['shipped', 'shipping'].includes(o.status));
    const deliveredOnlyOrders = storeOrders.filter((o) => o.status === 'delivered');
    const returnedOnlyOrders = storeOrders.filter((o) => ['returned', 'canceled'].includes(o.status));

    const pipelineStages = [
      {
        key: 'to_confirm',
        name: '1. À Confirmer',
        count: pendingOrders.length,
        value: Math.round(pendingOrders.reduce((s, o) => s + (Number(o.total) || 0), 0)),
        color: '#94a3b8',
      },
      {
        key: 'confirmed',
        name: '2. Confirmées',
        count: confirmedOnlyOrders.length,
        value: Math.round(confirmedOnlyOrders.reduce((s, o) => s + (Number(o.total) || 0), 0)),
        color: '#06b6d4',
      },
      {
        key: 'shipped',
        name: '3. En Transit',
        count: inTransitOrders.length,
        value: Math.round(inTransitOrders.reduce((s, o) => s + (Number(o.total) || 0), 0)),
        color: '#38bdf8',
      },
      {
        key: 'delivered',
        name: '4. Livrées & Encaissées',
        count: deliveredOnlyOrders.length,
        value: Math.round(deliveredOnlyOrders.reduce((s, o) => s + (Number(o.total) || 0), 0)),
        color: '#10b981',
      },
      {
        key: 'returned',
        name: '5. Retours / Refus',
        count: returnedOnlyOrders.length,
        value: Math.round(returnedOnlyOrders.reduce((s, o) => s + (Number(o.total) || 0), 0)),
        color: '#f43f5e',
      },
    ];

    // 6. Top Products & SKU Realized Cashflow
    const productStatsMap = new Map<string, {
      title: string;
      totalOrders: number;
      totalQuantity: number;
      grossRevenue: number;
      deliveredRevenue: number;
      deliveredCount: number;
      returnedCount: number;
    }>();

    for (const order of storeOrders) {
      const items = order.items || [];
      const isDelivered = order.status === 'delivered';
      const isReturned = ['returned', 'canceled'].includes(order.status);

      for (const item of items) {
        const title = item.title || 'Produit sans titre';
        const key = title;
        const existing = productStatsMap.get(key) || {
          title,
          totalOrders: 0,
          totalQuantity: 0,
          grossRevenue: 0,
          deliveredRevenue: 0,
          deliveredCount: 0,
          returnedCount: 0,
        };

        const qty = Number(item.quantity) || 1;
        const itemTotal = (Number(item.price) || 0) * qty;

        existing.totalOrders += 1;
        existing.totalQuantity += qty;
        existing.grossRevenue += itemTotal;
        if (isDelivered) {
          existing.deliveredRevenue += itemTotal;
          existing.deliveredCount += 1;
        }
        if (isReturned) {
          existing.returnedCount += 1;
        }

        productStatsMap.set(key, existing);
      }
    }

    const topProducts = Array.from(productStatsMap.values())
      .map((p) => {
        const dispatched = p.deliveredCount + p.returnedCount;
        const deliveryRate = dispatched > 0
          ? (p.deliveredCount / dispatched) * 100
          : (p.totalOrders > 0 ? (p.deliveredCount / p.totalOrders) * 100 : 0);
        const returnRate = dispatched > 0 ? (p.returnedCount / dispatched) * 100 : 0;
        return {
          title: p.title,
          totalOrders: p.totalOrders,
          totalQuantity: p.totalQuantity,
          grossRevenue: Math.round(p.grossRevenue),
          deliveredRevenue: Math.round(p.deliveredRevenue),
          deliveryRate: Number(deliveryRate.toFixed(1)),
          returnRate: Number(returnRate.toFixed(1)),
        };
      })
      .sort((a, b) => b.deliveredRevenue - a.deliveredRevenue)
      .slice(0, 6);

    return NextResponse.json({
      success: true,
      store: storeSlug,
      totalOrders,
      totalRevenueDelivered,
      totalRevenuePotential,
      confirmationRate: Number(confirmationRate.toFixed(1)),
      deliveryRate: Number(deliveryRate.toFixed(1)),
      returnRate: Number(returnRate.toFixed(1)),
      totalCostOfGoods: Math.round(totalCostOfGoods),
      totalShippingPaid: Math.round(totalShippingPaid),
      netProfit: Math.round(netProfit),
      cityDistribution,
      dailyCashflow,
      pipelineStages,
      topProducts,
      source: combined.length > 0 ? 'database_tenant' : 'demo_fallback',
    });
  } catch (error: any) {
    console.error('[Operations Analytics API] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
