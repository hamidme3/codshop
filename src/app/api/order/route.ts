import { NextResponse } from 'next/server';
import { createOrder, getOrderByNumber } from '@/lib/db-repository';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('id') || searchParams.get('orderNumber');
    if (!orderNumber) {
      return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
    }
    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    console.error('[CODShop] Order fetch error:', error);
    return NextResponse.json({ success: false, message: 'Error retrieving order' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const storeSlug = body.storeSlug || body.store || 'ottavio';

    const customerName = body.customerName || body.customer?.fullName || 'Client Anonyme';
    const phone = body.customerPhone || body.customer?.phone || body.phone || '';
    const city = body.customerCity || body.customer?.city || body.city || 'Casablanca';
    const address = body.customerAddress || body.customer?.address || body.address || 'Adresse standard';

    const items = Array.isArray(body.items) && body.items.length > 0
      ? body.items.map((it: { productId?: string; id?: string; title?: string; quantity?: number; price?: number; unitPrice?: number; variant?: string }, idx: number) => ({
          id: it.productId || it.id || String(idx + 1),
          title: it.title || body.product?.title || 'Produit',
          quantity: Number(it.quantity) || 1,
          price: Number(it.price) || Number(it.unitPrice) || 299,
          variant: it.variant || body.variant || 'Standard',
        }))
      : [
          {
            id: body.product?.id || '1',
            title: body.product?.title || 'Produit',
            quantity: Number(body.quantity) || 1,
            price: Number(body.unitPrice) || Number(body.total) || 299,
            variant: body.variant || 'Standard',
          },
        ];

    const shippingFee = Number(body.shippingFee ?? 20);
    const total = Number(body.total) || 299;
    const subtotal = Number(body.subtotal ?? (total - shippingFee));

    // Persist order in database
    const savedOrder = await createOrder({
      storeSlug,
      customerName,
      phone,
      city,
      address,
      items,
      subtotal,
      shippingFee,
      total,
      courier: 'ozon',
    });

    const orderId = savedOrder.orderNumber;

    console.log(`[CODShop Order Created] ID: ${orderId}`, {
      customer: customerName,
      phone,
      city,
      items,
      total,
    });

    // Attempt forward to COD Management backend if available
    try {
      const backendUrl = process.env.COD_API_URL || 'https://cod-api.vipone.site';
      await fetch(`${backendUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderId,
          customerName,
          phone,
          city,
          shippingAddress: address,
          totalPrice: total,
          currency: 'MAD',
          status: 'pending',
          source: 'codshop_storefront',
          items: items.map((i: { title: string; quantity: number; price: number }) => ({
            title: i.title,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });
    } catch (apiErr) {
      console.warn('[CODShop] Backend forward notice (continuing locally):', apiErr);
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Commande enregistrée avec succès',
    });
  } catch (error: unknown) {
    console.error('[CODShop] Order submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors du traitement de la commande' },
      { status: 500 }
    );
  }
}
