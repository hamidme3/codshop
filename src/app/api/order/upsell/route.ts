import { NextResponse } from 'next/server';
import { getOrderByNumber, addUpsellToOrder } from '@/lib/db-repository';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, item, upsellType = 'bogo' } = body;

    if (!orderId || !item || !item.title || item.price === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing orderId or item details' },
        { status: 400 }
      );
    }

    // 1. Retrieve the existing order by ID or orderNumber
    const order = await getOrderByNumber(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // 2. Guard: do not allow mutations on dispatched, delivered, or canceled orders
    const status = String(order.status || '').toLowerCase();
    if (['shipped', 'delivered', 'canceled', 'returned'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Order is already dispatched or finalized' },
        { status: 400 }
      );
    }

    // 3. Clean and sanitize the upsell item payload
    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const price = Math.max(0, Math.round(Number(item.price) || 0));
    const title = String(item.title).trim();
    const cleanItem = {
      id: item.id || `upsell_${Date.now()}`,
      title,
      price,
      quantity,
      variant: item.variant ? String(item.variant).trim() : undefined,
      sku: item.sku ? String(item.sku).trim() : undefined,
    };

    const currentSubtotal = Number(order.subtotal) || 0;
    const shippingFee = Number(order.shippingFee) || 0;
    const addedAmount = price * quantity;
    const newSubtotal = currentSubtotal + addedAmount;
    const newTotal = newSubtotal + shippingFee;

    // 4. Mutate order in PostgreSQL database and in-memory cache
    const updatedOrder = await addUpsellToOrder(
      order.orderNumber || order.id,
      cleanItem,
      newSubtotal,
      newTotal
    );

    console.log(`[1-Click Upsell Accepted] Order: ${order.orderNumber || order.id}`, {
      upsellType,
      item: cleanItem,
      previousTotal: order.total,
      newTotal,
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber || order.id,
      addedItem: cleanItem,
      newSubtotal,
      newTotal,
      items: updatedOrder?.items || [...(Array.isArray(order.items) ? order.items : []), cleanItem],
      message: '1-Click Upsell added to order successfully',
    });
  } catch (error: any) {
    console.error('[API Upsell] Error adding upsell:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Error processing upsell' },
      { status: 500 }
    );
  }
}
