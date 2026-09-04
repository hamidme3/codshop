import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/db-repository';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const storeSlug = body.storeSlug || body.store || 'ottavio';

    // Persist order in database
    const savedOrder = await createOrder({
      storeSlug,
      customerName: body.customer?.fullName || 'Client Anonyme',
      phone: body.customer?.phone || '',
      city: body.customer?.city || 'Casablanca',
      address: body.customer?.address || 'Adresse standard',
      items: [
        {
          id: '1',
          title: body.product?.title || 'Produit',
          quantity: Number(body.quantity) || 1,
          price: Number(body.unitPrice) || Number(body.total) || 299,
          variant: body.variant || 'Standard',
        },
      ],
      subtotal: Number(body.total) - 20,
      shippingFee: 20,
      total: Number(body.total) || 299,
      courier: 'ozon',
    });

    const orderId = savedOrder.orderNumber;

    console.log(`[CODShop Order Created] ID: ${orderId}`, {
      customer: body.customer?.fullName,
      phone: body.customer?.phone,
      city: body.customer?.city,
      product: body.product?.title,
      total: body.total,
    });

    // Attempt forward to COD Management backend if available
    try {
      const backendUrl = process.env.COD_API_URL || 'https://cod-api.vipone.site';
      await fetch(`${backendUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderId,
          customerName: body.customer?.fullName,
          phone: body.customer?.phone,
          city: body.customer?.city,
          shippingAddress: body.customer?.address,
          totalPrice: body.total,
          currency: 'MAD',
          status: 'pending',
          source: 'codshop_storefront',
          items: [
            {
              title: body.product?.title,
              quantity: body.quantity,
              price: body.unitPrice,
            },
          ],
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
