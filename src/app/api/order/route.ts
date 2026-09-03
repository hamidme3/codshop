import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = `CMD-${Math.floor(100000 + Math.random() * 900000)}`;

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
