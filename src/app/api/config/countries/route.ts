import { NextResponse } from 'next/server';
import { SUPPORTED_COUNTRIES } from '@/lib/moroccan-geo';

export async function GET() {
  try {
    return NextResponse.json({
      data: SUPPORTED_COUNTRIES,
      default: 'MA',
    });
  } catch (error: any) {
    console.error('[Config Countries API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
  }
}
