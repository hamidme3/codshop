import { NextResponse } from 'next/server';
import { COUNTRY_CALLING_CODES } from '@/lib/moroccan-geo';

export async function GET() {
  try {
    return NextResponse.json({
      data: COUNTRY_CALLING_CODES,
      default: '+212',
    });
  } catch (error: any) {
    console.error('[Config Country Codes API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch country codes' }, { status: 500 });
  }
}
