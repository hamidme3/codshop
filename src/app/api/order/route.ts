import { NextResponse } from 'next/server';
import { createOrder, getOrderByNumber, getStoreBySlug } from '@/lib/db-repository';
import { validateAndNormalizeMoroccanPhone } from '@/lib/moroccan-phone';
import { checkOrderRateLimit } from '@/lib/rate-limiter';
import { verifyAndRecalculateOrder } from '@/lib/order-pricing';
import { isValidStoreSlug } from '@/lib/sanitizer';

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

    // 1. Anti-Bot Honeypot: silently accept and discard if hidden honeypot fields are filled
    if (body._hp || body.website || body.fax) {
      return NextResponse.json({ success: true, orderId: `CMD-${Math.floor(1000 + Math.random() * 9000)}`, message: 'Commande reçue' });
    }

    // 2. Store Slug Scoping: strictly validate store slug and ensure store is active
    const rawStoreSlug = body.storeSlug || body.store || 'ottavio';
    if (!isValidStoreSlug(rawStoreSlug)) {
      return NextResponse.json(
        { success: false, message: 'Identifiant de boutique invalide' },
        { status: 400 }
      );
    }

    const store = await getStoreBySlug(rawStoreSlug);
    if (!store) {
      return NextResponse.json(
        { success: false, message: `Boutique "${rawStoreSlug}" introuvable ou inactive` },
        { status: 400 }
      );
    }
    const storeSlug = store.slug;

    // 3. Moroccan Phone Validation & Normalization (Mobile 06/07, Fixed line 05, +212)
    const rawPhone = body.customerPhone || body.customer?.phone || body.phone || '';
    const phoneResult = validateAndNormalizeMoroccanPhone(rawPhone);
    if (!phoneResult.isValid) {
      return NextResponse.json(
        { success: false, message: phoneResult.error || 'Numéro de téléphone marocain invalide (06, 07 ou 05 requis)' },
        { status: 400 }
      );
    }
    const phone = phoneResult.cleanPhone;

    // 4. CGNAT-Safe Composite Rate Limiting
    const forwarded = req.headers.get('x-forwarded-for') || '';
    const clientIp = forwarded.split(',')[0].trim() || '127.0.0.1';
    const rateCheck = checkOrderRateLimit(clientIp, phone);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: rateCheck.reason || 'Trop de requêtes, veuillez patienter.' },
        { status: 429 }
      );
    }

    // 5. Server-Side Price Verification, Exact Tier Pricing Recalculation & Input Sanitization
    const pricingResult = await verifyAndRecalculateOrder(body, storeSlug);
    if (!pricingResult.success) {
      return NextResponse.json(
        { success: false, message: pricingResult.error || 'Erreur de calcul du prix de la commande' },
        { status: 400 }
      );
    }

    // 5b. Reject explicit price tampering (e.g. submitting 1 DH for 699 DH items)
    if (pricingResult.tamperingDetected && body.total !== undefined && Math.abs(Number(body.total) - pricingResult.total) > 2) {
      return NextResponse.json(
        {
          success: false,
          code: 'PRICE_TAMPERING_REJECTED',
          message: 'Le montant soumis ne correspond pas au prix officiel du catalogue.',
          catalogTotal: pricingResult.total,
          submittedTotal: Number(body.total),
        },
        { status: 400 }
      );
    }

    // Moroccan COD Conversion & Delivery Tracking fields
    const abVariant = body.abVariant || req.headers.get('x-ab-variant') || 'control';
    const source = (body.source === 'whatsapp' ? 'whatsapp' : 'web') as 'web' | 'whatsapp';

    // 6. Persist order with authentic server-recalculated pricing, variant SKUs, and inventory reservation
    let savedOrder;
    try {
      savedOrder = await createOrder({
        storeSlug,
        customerName: pricingResult.customerName,
        phone,
        city: pricingResult.city,
        address: pricingResult.address,
        items: pricingResult.items.map((it) => ({
          id: it.id,
          title: it.title,
          quantity: it.quantity,
          price: it.price,
          variant: it.variant,
          sku: it.sku,
          color: it.color,
          size: it.size,
        })),
        subtotal: pricingResult.subtotal,
        shippingFee: pricingResult.shippingFee,
        total: pricingResult.total,
        courier: 'ozon',
        abVariant,
        deliveryType: pricingResult.deliveryType,
        agencyName: pricingResult.agencyName || undefined,
        source,
      });
    } catch (orderErr: any) {
      const errMsg = orderErr?.message || '';
      if (errMsg.toLowerCase().includes('stock') || errMsg.toLowerCase().includes('rupture') || errMsg.toLowerCase().includes('épuis')) {
        return NextResponse.json(
          { success: false, code: 'OUT_OF_STOCK', message: errMsg },
          { status: 409 }
        );
      }
      throw orderErr;
    }

    const orderId = savedOrder.orderNumber;

    console.log(`[CODShop Order Created] ID: ${orderId}`, {
      storeSlug,
      customer: pricingResult.customerName,
      phone,
      city: pricingResult.city,
      items: pricingResult.items,
      subtotal: pricingResult.subtotal,
      shippingFee: pricingResult.shippingFee,
      total: pricingResult.total,
      abVariant,
      deliveryType: pricingResult.deliveryType,
      source,
      tamperingOverridden: pricingResult.tamperingDetected,
    });

    // Attempt forward to COD Management backend if available
    try {
      const backendUrl = process.env.COD_API_URL || 'https://cod-api.vipone.site';
      await fetch(`${backendUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderId,
          customerName: pricingResult.customerName,
          phone,
          city: pricingResult.city,
          shippingAddress: pricingResult.address,
          totalPrice: pricingResult.total,
          currency: 'MAD',
          status: 'pending',
          source: 'codshop_storefront',
          items: pricingResult.items.map((i) => ({
            title: i.title,
            quantity: i.quantity,
            price: i.price,
            variant: i.variant,
            sku: i.sku,
          })),
        }),
      });
    } catch (apiErr) {
      console.warn('[CODShop] Backend forward notice (continuing locally):', apiErr);
    }

    return NextResponse.json({
      success: true,
      orderId,
      order: savedOrder,
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
