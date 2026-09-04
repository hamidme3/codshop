import { NextResponse } from 'next/server';
import { MOROCCAN_REGIONS } from '@/lib/moroccan-geo';

export async function GET() {
  try {
    return NextResponse.json({
      data: MOROCCAN_REGIONS,
      total: MOROCCAN_REGIONS.length,
      country: 'MA',
    });
  } catch (error: any) {
    console.error('[Config States API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch states' }, { status: 500 });
  }
}
