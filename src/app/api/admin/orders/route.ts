import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/db-repository';
import { 
  getOrders as getMockOrders, 
  updateOrderStatus as updateMockOrderStatus, 
  deleteOrder as deleteMockOrder, 
  ORDERS 
} from '@/lib/mocks';
import { isValidStoreSlug } from '@/lib/sanitizer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeSlug = searchParams.get('store') || 'ottavio';

    if (!isValidStoreSlug(storeSlug)) {
      return NextResponse.json({ success: false, message: 'Invalid store slug' }, { status: 400 });
    }

    // 1. Query PostgreSQL database repository for real orders
    let dbOrders: any[] = [];
    try {
      dbOrders = await getOrders(storeSlug);
    } catch (dbErr) {
      console.warn('[API Admin Orders] Warning fetching DB orders:', dbErr);
      dbOrders = getMockOrders(storeSlug);
    }

    // 2. Query in-memory cache for any orders submitted in this process
    const memOrders = ORDERS.filter((o) => o.storeSlug === storeSlug);

    // 3. Merge without duplicate order numbers (DB takes priority)
    const existingNumbers = new Set(dbOrders.map((o) => o.orderNumber));
    const combined = [...dbOrders];
    for (const mo of memOrders) {
      if (!existingNumbers.has(mo.orderNumber)) {
        combined.push(mo);
        existingNumbers.add(mo.orderNumber);
      }
    }

    // Sort descending by created date
    combined.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    const counts = {
      all: combined.length,
      to_confirm: combined.filter((o) => ['new', 'to_confirm'].includes(o.status)).length,
      confirmed: combined.filter((o) => o.status === 'confirmed').length,
      shipped: combined.filter((o) => ['shipped', 'shipping'].includes(o.status)).length,
      delivered: combined.filter((o) => o.status === 'delivered').length,
      returned: combined.filter((o) => ['returned', 'canceled'].includes(o.status)).length,
    };

    if (searchParams.get('countsOnly') === 'true') {
      return NextResponse.json({
        success: true,
        counts,
        store: storeSlug,
      });
    }

    return NextResponse.json({ 
      success: true, 
      orders: combined, 
      count: combined.length,
      counts,
      store: storeSlug,
    });
  } catch (error: any) {
    console.error('[API Admin Orders] GET error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Error retrieving orders' }, 
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { storeSlug = 'ottavio', orderId, status, trackingNumber, courier } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: 'orderId and status are required' }, 
        { status: 400 }
      );
    }

    // 1. Update in-memory / mock state
    updateMockOrderStatus(orderId, status, trackingNumber, courier);

    // 2. Update PostgreSQL database if available
    try {
      const { getDb, schema } = await import('@/db');
      const db = getDb();
      if (db) {
        const { eq, or } = await import('drizzle-orm');
        const now = new Date();

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
        const whereClause = isUuid ? eq(schema.orders.id, orderId) : eq(schema.orders.orderNumber, orderId);

        const existingOrder = await db.query.orders.findFirst({
          where: whereClause,
        });

        const updatePayload: any = {
          status,
          updatedAt: now,
        };
        if (trackingNumber) {
          updatePayload.trackingNumber = trackingNumber;
        } else if ((status === 'shipped' || status === 'shipping') && !existingOrder?.trackingNumber) {
          updatePayload.trackingNumber = `EXP-MA-${Math.floor(100000 + Math.random() * 900000)}`;
        }
        if (courier) {
          updatePayload.courier = courier;
        } else if ((status === 'shipped' || status === 'shipping') && (!existingOrder?.courier || existingOrder.courier === 'manual')) {
          updatePayload.courier = 'standard';
        }
        if (status === 'confirmed') updatePayload.confirmedAt = now;
        if (status === 'shipped') updatePayload.shippedAt = now;
        if (status === 'delivered') updatePayload.deliveredAt = now;
        if (status === 'canceled') updatePayload.canceledAt = now;
        if (status === 'returned') updatePayload.returnedAt = now;

        // Restore DB stock if transitioning to canceled or returned from active state
        if (existingOrder && (status === 'canceled' || status === 'returned') && existingOrder.status !== 'canceled' && existingOrder.status !== 'returned') {
          const { restoreDbProductStock } = await import('@/lib/db-repository');
          await restoreDbProductStock(existingOrder.storeId, existingOrder.items as any);
        }

        await db
          .update(schema.orders)
          .set(updatePayload)
          .where(whereClause);
      }
    } catch (dbErr) {
      console.warn('[API Admin Orders] Warning updating order in DB:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Order status updated successfully' });
  } catch (error: any) {
    console.error('[API Admin Orders] PATCH error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Error updating order' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const storeSlug = searchParams.get('store') || 'ottavio';

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'orderId is required' }, 
        { status: 400 }
      );
    }

    // 1. Delete in-memory
    deleteMockOrder(orderId, storeSlug);

    // 2. Delete in PostgreSQL database
    try {
      const { getDb, schema } = await import('@/db');
      const db = getDb();
      if (db) {
        const { eq } = await import('drizzle-orm');
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
        const whereClause = isUuid ? eq(schema.orders.id, orderId) : eq(schema.orders.orderNumber, orderId);

        const existingOrder = await db.query.orders.findFirst({
          where: whereClause,
        });

        // Restore DB stock if deleting an active order
        if (existingOrder && existingOrder.status !== 'canceled' && existingOrder.status !== 'returned') {
          const { restoreDbProductStock } = await import('@/lib/db-repository');
          await restoreDbProductStock(existingOrder.storeId, existingOrder.items as any);
        }

        await db
          .delete(schema.orders)
          .where(whereClause);
      }
    } catch (dbErr) {
      console.warn('[API Admin Orders] Warning deleting order from DB:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('[API Admin Orders] DELETE error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Error deleting order' }, 
      { status: 500 }
    );
  }
}
