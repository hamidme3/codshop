import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/db-repository';
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
        netProfit: 0,
        cityDistribution: [],
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

    const totalCostOfGoods = deliveredOrders.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0) * 0.32, 0);
    const totalShippingPaid = deliveredOrders.length * 25 + returnedOrders.length * 15;
    const netProfit = Math.max(0, totalRevenueDelivered - totalCostOfGoods - totalShippingPaid);

    // City distribution
    const cityMap = new Map<string, { orders: number; revenue: number }>();
    storeOrders.forEach((o) => {
      const c = o.city ?? 'Autre';
      const existing = cityMap.get(c) ?? { orders: 0, revenue: 0 };
      cityMap.set(c, {
        orders: existing.orders + 1,
        revenue: existing.revenue + (Number(o.total) || 0),
      });
    });
    const total = storeOrders.length || 1;
    const cityDistribution = Array.from(cityMap.entries())
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 6)
      .map(([city, data]) => ({
        city,
        orders: data.orders,
        rate: Number(((data.orders / total) * 100).toFixed(1)),
        revenue: Math.round(data.revenue),
      }));

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
      netProfit: Math.round(netProfit),
      cityDistribution,
      pipelineStages,
      topProducts,
      source: combined.length > 0 ? 'database_tenant' : 'demo_fallback',
    });
  } catch (error: any) {
    console.error('[Operations Analytics API] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
