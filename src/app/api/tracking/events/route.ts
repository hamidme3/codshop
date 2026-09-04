import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventName, eventId, value, currency, orderId, items } = body;

    // Log Server-Side Conversion Event
    console.log(`[CAPI Conversion Event] ${eventName} | Value: ${value} ${currency || 'MAD'} | Order: ${orderId || 'N/A'}`);

    // In production, dispatches via Meta Graph API / TikTok Events API / Google Measurement Protocol
    return NextResponse.json({
      success: true,
      eventName,
      eventId: eventId || `evt_${Date.now()}`,
      status: 'dispatched',
    });
  } catch (err: any) {
    console.error('[Tracking Events API] Error:', err);
    return NextResponse.json({ error: 'Erreur lors de l enregistrement de l événement' }, { status: 500 });
  }
}
