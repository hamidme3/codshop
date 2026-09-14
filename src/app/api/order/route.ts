import { NextResponse } from 'next/server';
import { createOrder, getOrderByNumber, getStoreBySlug } from '@/lib/db-repository';
import { validateAndNormalizeMoroccanPhone } from '@/lib/moroccan-phone';
import { validateCountryPhone, getCountryConfig } from '@/lib/geo';
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
      return NextResponse.json({ success: true, orderId: `CMD-${Math.floor(1000 + Math.random() * 9000)}`, message: 'Order received' });
    }

    // 2. Store Slug Scoping: detect store slug from body, x-store-slug header, Host subdomain, or Referer
    let detectedStoreSlug = body.storeSlug || body.store;

    if (!detectedStoreSlug) {
      const headerSlug = req.headers.get('x-store-slug');
      if (headerSlug && headerSlug !== 'codshop' && isValidStoreSlug(headerSlug)) {
        detectedStoreSlug = headerSlug;
      }
    }

    if (!detectedStoreSlug) {
      const host = req.headers.get('host') || '';
      const cleanHost = host.split(':')[0].toLowerCase();
      const rootDomain = process.env.NEXT_PUBLIC_WILDCARD_DOMAIN || 'codshop.vipone.site';
      if (cleanHost.endsWith(rootDomain) && cleanHost !== rootDomain && cleanHost !== `www.${rootDomain}`) {
        const sub = cleanHost.replace(`.${rootDomain}`, '');
        if (isValidStoreSlug(sub)) {
          detectedStoreSlug = sub;
        }
      } else if (cleanHost.endsWith('.localhost')) {
        const sub = cleanHost.replace('.localhost', '');
        if (isValidStoreSlug(sub)) {
          detectedStoreSlug = sub;
        }
      }
    }

    if (!detectedStoreSlug) {
      const referer = req.headers.get('referer');
      if (referer) {
        try {
          const refUrl = new URL(referer);
          const refStore = refUrl.searchParams.get('store');
          if (refStore && isValidStoreSlug(refStore)) {
            detectedStoreSlug = refStore;
          } else {
            const refHost = refUrl.hostname.toLowerCase();
            const rootDomain = process.env.NEXT_PUBLIC_WILDCARD_DOMAIN || 'codshop.vipone.site';
            if (refHost.endsWith(rootDomain) && refHost !== rootDomain && refHost !== `www.${rootDomain}`) {
              const sub = refHost.replace(`.${rootDomain}`, '');
              if (isValidStoreSlug(sub)) {
                detectedStoreSlug = sub;
              }
            }
          }
        } catch {
          // ignore malformed referer
        }
      }
    }

    const rawStoreSlug = detectedStoreSlug || 'ottavio';
    if (!isValidStoreSlug(rawStoreSlug)) {
      return NextResponse.json(
        { success: false, message: 'Invalid store identifier' },
        { status: 400 }
      );
    }

    const store = await getStoreBySlug(rawStoreSlug);
    if (!store) {
      return NextResponse.json(
        { success: false, message: `Store "${rawStoreSlug}" not found or inactive` },
        { status: 400 }
      );
    }
    const storeSlug = store.slug;

    // 3. Multi-Country Phone Validation & Normalization
    const rawPhone = body.customerPhone || body.customer?.phone || body.phone || '';
    const source = (body.source === 'whatsapp' ? 'whatsapp' : 'web') as 'web' | 'whatsapp';
    const isPendingWhatsAppLead = source === 'whatsapp' && (!rawPhone || rawPhone.toLowerCase().includes('whatsapp'));

    const orderCountryCode = (
      body.countryCode ||
      body.country ||
      body.customer?.country ||
      req.headers.get('x-geo-country') ||
      (store as any)?.country ||
      'MA'
    ).toUpperCase();

    const countryConfig = getCountryConfig(orderCountryCode);

    const phoneResult = isPendingWhatsAppLead
      ? { isValid: true, cleanPhone: orderCountryCode === 'MA' ? '0600000000' : '0500000000', type: 'mobile' as const }
      : (orderCountryCode === 'MA' ? validateAndNormalizeMoroccanPhone(rawPhone) : validateCountryPhone(rawPhone, orderCountryCode));

    if (!phoneResult.isValid) {
      return NextResponse.json(
        { success: false, message: (phoneResult as any).error || `Invalid phone number (${orderCountryCode})` },
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
        { success: false, message: rateCheck.reason || 'Too many requests, please slow down.' },
        { status: 429 }
      );
    }

    // 5. Server-Side Price Verification, Exact Tier Pricing Recalculation & Input Sanitization
    const pricingResult = await verifyAndRecalculateOrder(body, storeSlug, orderCountryCode);
    if (!pricingResult.success) {
      return NextResponse.json(
        { success: false, message: pricingResult.error || 'Error calculating order price' },
        { status: 400 }
      );
    }

    // 5b. Reject explicit price tampering (e.g. submitting 1 DH for 699 DH items)
    if (pricingResult.tamperingDetected && body.total !== undefined && Math.abs(Number(body.total) - pricingResult.total) > 2) {
      return NextResponse.json(
        {
          success: false,
          code: 'PRICE_TAMPERING_REJECTED',
          message: 'Submitted amount does not match catalog pricing.',
          catalogTotal: pricingResult.total,
          submittedTotal: Number(body.total),
        },
        { status: 400 }
      );
    }

    // Moroccan COD Conversion & Delivery Tracking fields
    const abVariant = body.abVariant || req.headers.get('x-ab-variant') || 'control';

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
        courier: 'manual',
        abVariant,
        deliveryType: pricingResult.deliveryType,
        agencyName: pricingResult.agencyName || undefined,
        source,
        countryCode: orderCountryCode,
        currency: countryConfig.currency.code,
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
          currency: countryConfig.currency.code,
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
      message: 'Order placed successfully',
    });
  } catch (error: unknown) {
    console.error('[CODShop] Order submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing order' },
      { status: 500 }
    );
  }
}
