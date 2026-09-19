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
      source: combined.length > 0 ? 'database_tenant' : 'demo_fallback',
    });
  } catch (error: any) {
    console.error('[Operations Analytics API] Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
