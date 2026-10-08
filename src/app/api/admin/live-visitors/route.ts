import { NextResponse } from 'next/server';
import { getLiveVisitorsFromDb } from '@/lib/db-repository';
import { isValidStoreSlug } from '@/lib/sanitizer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeSlug = req.headers.get('x-user-store-slug');

    if (!storeSlug) {
      return NextResponse.json({ success: false, message: 'Store slug is required' }, { status: 400 });
    }

    if (!isValidStoreSlug(storeSlug)) {
      return NextResponse.json({ success: false, message: 'Invalid store identifier' }, { status: 400 });
    }

    const { liveVisitors, inCheckout } = await getLiveVisitorsFromDb(storeSlug);

    return NextResponse.json(
      {
        success: true,
        store: storeSlug,
        liveVisitors,
        inCheckout,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (err: any) {
    console.error('[Live Visitors API] Error:', err);
    return NextResponse.json({ success: false, liveVisitors: 0, inCheckout: 0 }, { status: 500 });
  }
}
