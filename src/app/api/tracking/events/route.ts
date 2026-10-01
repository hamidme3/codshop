import { NextResponse } from 'next/server';
import { recordAnalyticsEvent } from '@/lib/db-repository';
import { isValidStoreSlug } from '@/lib/sanitizer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventName, eventId, value, currency, orderId, items, storeSlug, store, distinctId, properties } = body;

    // 1. Resolve store slug
    let targetStoreSlug = storeSlug || store;
    if (!targetStoreSlug) {
      const headerSlug = request.headers.get('x-store-slug');
      if (headerSlug && isValidStoreSlug(headerSlug)) {
        targetStoreSlug = headerSlug;
      }
    }

    // 2. Persist event into PostgreSQL analytics_events if storeSlug and eventName provided
    if (targetStoreSlug && isValidStoreSlug(targetStoreSlug) && eventName) {
      let resolvedDistinctId = distinctId;
      if (!resolvedDistinctId || resolvedDistinctId === 'anonymous' || resolvedDistinctId === 'anon') {
        const cookieAnonId = request.headers.get('cookie')?.match(/(?:^|;\s*)cod_anon_id=([^;]+)/)?.[1];
        if (cookieAnonId) {
          resolvedDistinctId = decodeURIComponent(cookieAnonId);
        } else {
          const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                           request.headers.get('x-real-ip') || 
                           '';
          const userAgent = request.headers.get('user-agent') || '';
          if (clientIp || userAgent) {
            const hash = Buffer.from(`${clientIp}:${userAgent}`).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
            resolvedDistinctId = `ip_${hash}`;
          } else {
            resolvedDistinctId = `anon_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
          }
        }
      }

      await recordAnalyticsEvent({
        storeSlug: targetStoreSlug,
        eventName: String(eventName),
        distinctId: String(resolvedDistinctId),
        properties: properties || {
          value,
          currency,
          orderId,
          items,
        },
      });
    }

    // 3. Log Server-Side Conversion Event for Ad CAPI
    if (value !== undefined || orderId) {
      console.log(`[CAPI Conversion Event] ${eventName} | Store: ${targetStoreSlug || 'unknown'} | Value: ${value} ${currency || 'MAD'} | Order: ${orderId || 'N/A'}`);
    }

    return NextResponse.json({
      success: true,
      eventName,
      eventId: eventId || `evt_${Date.now()}`,
      status: 'recorded',
    });
  } catch (err: any) {
    console.error('[Tracking Events API] Error:', err);
    return NextResponse.json({ error: 'Error recording analytics event' }, { status: 500 });
  }
}
