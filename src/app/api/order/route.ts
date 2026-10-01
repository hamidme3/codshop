import { NextResponse } from 'next/server';
import { createOrder, getOrderByNumber, getStoreBySlug, recordAnalyticsEvent } from '@/lib/db-repository';
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

    const isAbandoned = body.status === 'abandoned';
    let phone = phoneResult.isValid ? phoneResult.cleanPhone : rawPhone.replace(/\D/g, '');
    if (!phoneResult.isValid) {
      if (isAbandoned && rawPhone.replace(/\D/g, '').length >= 8) {
        phone = rawPhone.replace(/\D/g, '');
      } else {
        return NextResponse.json(
          { success: false, message: (phoneResult as any).error || `Invalid phone number (${orderCountryCode})` },
          { status: 400 }
        );
      }
    }

    // 4. CGNAT-Safe Composite Rate Limiting (Skip for abandoned background captures)
    if (!isAbandoned) {
      const forwarded = req.headers.get('x-forwarded-for') || '';
      const clientIp = forwarded.split(',')[0].trim() || '127.0.0.1';
      const rateCheck = checkOrderRateLimit(clientIp, phone);
      if (!rateCheck.allowed) {
        return NextResponse.json(
          { success: false, message: rateCheck.reason || 'Too many requests, please slow down.' },
          { status: 429 }
        );
      }
    }

    // 5. Server-Side Price Verification, Exact Tier Pricing Recalculation & Input Sanitization
    const pricingResult = await verifyAndRecalculateOrder(body, storeSlug, orderCountryCode);
    if (!pricingResult.success && !isAbandoned) {
      return NextResponse.json(
        { success: false, message: pricingResult.error || 'Error calculating order price' },
        { status: 400 }
      );
    }

    // 5b. Reject explicit price tampering (e.g. submitting 1 DH for 699 DH items)
    if (!isAbandoned && pricingResult.tamperingDetected && body.total !== undefined && Math.abs(Number(body.total) - pricingResult.total) > 2) {
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
    const customerEmail = body.customer?.email || body.email || undefined;
    let savedOrder;
    const resolvedItems = (pricingResult.items && pricingResult.items.length > 0)
      ? pricingResult.items
      : (Array.isArray(body.items) && body.items.length > 0 ? body.items : (body.product ? [body.product] : []));

    const finalItems = resolvedItems.map((it: any) => ({
      id: it.id || it.productId || 'item_default',
      title: it.title || body.productTitle || 'Produit',
      quantity: Number(it.quantity) || 1,
      price: Number(it.price) || Number(body.total) || 0,
      variant: it.variant,
      sku: it.sku,
      color: it.color,
      size: it.size,
    }));

    try {
      savedOrder = await createOrder({
        storeSlug,
        customerName: pricingResult.customerName || body.customerName || 'Prospect Anonyme',
        email: customerEmail,
        phone,
        city: pricingResult.city || body.city || 'Casablanca',
        address: pricingResult.address || body.address || 'Coordonnées incomplètes',
        items: finalItems,
        subtotal: pricingResult.subtotal || body.subtotal || 0,
        shippingFee: pricingResult.shippingFee || body.shippingFee || 0,
        total: pricingResult.total || body.total || 0,
        courier: 'manual',
        abVariant,
        deliveryType: pricingResult.deliveryType || 'home',
        agencyName: pricingResult.agencyName || undefined,
        source,
        countryCode: orderCountryCode,
        currency: countryConfig.currency.code,
        status: isAbandoned ? 'abandoned' : 'new',
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

    // Server-Side Conversion Logging (Guarantees 100% analytics parity even if mobile user closes tab before client beacon)
    if (!isAbandoned) {
      try {
        const cookieAnonId = req.headers.get('cookie')?.match(/(?:^|;\s*)cod_anon_id=([^;]+)/)?.[1];
        const resolvedDistinctId = body.distinctId || (cookieAnonId ? decodeURIComponent(cookieAnonId) : null) || phone || 'anonymous';
        await recordAnalyticsEvent({
          storeSlug,
          eventName: 'order_completed',
          distinctId: resolvedDistinctId,
          properties: {
            orderId,
            orderNumber: orderId,
            value: pricingResult.total || body.total || 0,
            currency: countryConfig.currency.code,
            items: finalItems.map((i: any) => ({
              id: i.id,
              productId: i.id,
              title: i.title,
              sku: i.sku,
              quantity: i.quantity,
              price: i.price,
            })),
            source,
            countryCode: orderCountryCode,
          },
        });
      } catch (evtErr) {
        console.warn('[CODShop Order] Server-side order_completed event record warning:', evtErr);
      }
    }

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
          storeSlug,
          store: storeSlug,
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
