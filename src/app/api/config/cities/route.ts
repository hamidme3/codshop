import { NextResponse } from 'next/server';
import { MOROCCAN_CITIES, getCitiesByRegion } from '@/lib/moroccan-geo';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get('region');

    const cities = region ? getCitiesByRegion(region) : MOROCCAN_CITIES;

    return NextResponse.json({
      data: cities,
      total: cities.length,
      country: 'MA',
    });
  } catch (error: any) {
    console.error('[Config Cities API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}
