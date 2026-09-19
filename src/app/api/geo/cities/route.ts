import { NextResponse } from 'next/server';
import { City } from 'country-state-city';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const country = (searchParams.get('country') || '').trim().toUpperCase();
    const query = (searchParams.get('q') || '').trim().toLowerCase();
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10), 1), 200);

    if (!country || country.length !== 2) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing country code' },
        { status: 400 }
      );
    }

    const rawCities = City.getCitiesOfCountry(country) || [];

    let filtered = rawCities;
    if (query) {
      filtered = rawCities.filter((c) => c.name.toLowerCase().includes(query));
    }

    const result = filtered.slice(0, limit).map((c) => ({
      name: c.name,
      state: c.stateCode,
    }));

    return NextResponse.json(
      {
        success: true,
        country,
        total: filtered.length,
        cities: result,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('[API /api/geo/cities] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
