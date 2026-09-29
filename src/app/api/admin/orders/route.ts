import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/db-repository';
import { 
  getOrders as getMockOrders, 
  updateOrderStatus as updateMockOrderStatus, 
  updateOrderNotes as updateMockOrderNotes,
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
      abandoned: combined.filter((o) => o.status === 'abandoned').length,
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
    const { storeSlug = 'ottavio', orderId, status, trackingNumber, courier, agentNotes, notes } = body;
    const finalNotes = agentNotes !== undefined ? agentNotes : notes;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'orderId is required' }, 
        { status: 400 }
      );
    }

    if (!status && finalNotes === undefined && courier === undefined && trackingNumber === undefined) {
      return NextResponse.json(
        { success: false, message: 'At least one field (status, agentNotes, courier, trackingNumber) is required' }, 
        { status: 400 }
      );
    }

    // 1. Update in-memory / mock state
    if (status) {
      updateMockOrderStatus(orderId, status, trackingNumber, courier);
    }
    if (finalNotes !== undefined) {
      updateMockOrderNotes(orderId, finalNotes);
    }

    // 2. Update PostgreSQL database if available
    try {
      const { getDb, schema } = await import('@/db');
      const db = getDb();
      if (db) {
        const { eq } = await import('drizzle-orm');
        const now = new Date();

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
        const whereClause = isUuid ? eq(schema.orders.id, orderId) : eq(schema.orders.orderNumber, orderId);

        const existingOrder = await db.query.orders.findFirst({
          where: whereClause,
        });

        const updatePayload: any = {
          updatedAt: now,
        };
        if (status) {
          updatePayload.status = status;
          if (status === 'confirmed') updatePayload.confirmedAt = now;
          if (status === 'shipped') updatePayload.shippedAt = now;
          if (status === 'delivered') updatePayload.deliveredAt = now;
          if (status === 'canceled') updatePayload.canceledAt = now;
          if (status === 'returned') updatePayload.returnedAt = now;
        }
        if (finalNotes !== undefined) {
          updatePayload.agentNotes = finalNotes;
        }
        if (courier !== undefined) {
          updatePayload.courier = courier;
        }
        if (trackingNumber !== undefined) {
          updatePayload.trackingNumber = trackingNumber;
        }

        // Accurate Inventory & CRM State Transitions:
        const prevStatus = existingOrder?.status;
        const isPrevActive = prevStatus && prevStatus !== 'canceled' && prevStatus !== 'returned' && prevStatus !== 'abandoned';
        const isNextActive = status && status !== 'canceled' && status !== 'returned' && status !== 'abandoned';

        // 1. Restore DB stock if transitioning to canceled or returned from an active state
        if (existingOrder && (status === 'canceled' || status === 'returned') && isPrevActive) {
          const { restoreDbProductStock } = await import('@/lib/db-repository');
          await restoreDbProductStock(existingOrder.storeId, existingOrder.items as any);
        } else if (existingOrder && !isPrevActive && isNextActive) {
          // 2. Decrement DB stock when transitioning back to active (e.g. converting an abandoned lead or re-opening)
          const { decrementDbProductStock } = await import('@/lib/db-repository');
          await decrementDbProductStock(existingOrder.storeId, existingOrder.items as any);

          // If converting an abandoned lead, sync customer CRM spend and track order_completed conversion event
          if (prevStatus === 'abandoned') {
            try {
              const { syncCustomerFromOrder, recordAnalyticsEvent } = await import('@/lib/db-repository');
              await syncCustomerFromOrder(
                existingOrder.storeId,
                existingOrder.customerName,
                existingOrder.phone,
                existingOrder.city,
                Number(existingOrder.total),
                existingOrder.email || undefined
              );
              await recordAnalyticsEvent({
                storeSlug,
                eventName: 'order_completed',
                distinctId: existingOrder.phone || 'anonymous',
                properties: {
                  orderId: existingOrder.orderNumber,
                  orderNumber: existingOrder.orderNumber,
                  value: Number(existingOrder.total),
                  source: 'lead_recovery',
                },
              });
            } catch (crmErr) {
              console.warn('[API Admin Orders] Warning syncing CRM on lead conversion:', crmErr);
            }
          }
        }

        await db
          .update(schema.orders)
          .set(updatePayload)
          .where(whereClause);
      }
    } catch (dbErr) {
      console.warn('[API Admin Orders] Warning updating order in DB:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Order updated successfully' });
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

        // Restore DB stock ONLY if deleting a previously active order (never for abandoned, canceled, or returned orders)
        if (existingOrder && existingOrder.status !== 'canceled' && existingOrder.status !== 'returned' && existingOrder.status !== 'abandoned') {
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
