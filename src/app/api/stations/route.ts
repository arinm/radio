import { NextResponse, type NextRequest } from 'next/server';
import { getStations, getStationBySlug } from '@/lib/stations';
import { paginationSchema } from '@/lib/validation';
import { CACHE_TTL } from '@/lib/constants';
import type { Station } from '@/types';

export async function GET(request: NextRequest) {
  const url = request.nextUrl;

  // Support fetching multiple stations by slugs (for favorites)
  const slugsParam = url.searchParams.get('slugs');
  if (slugsParam) {
    const slugs = slugsParam
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 50); // Cap at 50 for safety

    try {
      const stationPromises = slugs.map((slug) => getStationBySlug(slug));
      const results = await Promise.all(stationPromises);
      const stations: Station[] = results.filter((s): s is Station => s !== null);

      return NextResponse.json(
        { stations, total: stations.length },
        {
          headers: {
            'Cache-Control': `public, s-maxage=${CACHE_TTL.STATION_LIST}, stale-while-revalidate=${CACHE_TTL.STATION_LIST * 2}`,
          },
        },
      );
    } catch (error) {
      console.error('Stations fetch error:', error);
      return NextResponse.json({ error: 'Eroare la incarcarea posturilor' }, { status: 500 });
    }
  }

  // Standard paginated listing
  const rawParams = {
    page: url.searchParams.get('page') || '1',
    pageSize: url.searchParams.get('pageSize') || '24',
  };

  const parsed = paginationSchema.safeParse(rawParams);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Parametri invalizi', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { page, pageSize } = parsed.data;

  const genre = url.searchParams.get('genre') || undefined;
  const city = url.searchParams.get('city') || undefined;

  try {
    const result = await getStations({ genre, city }, page, pageSize);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL.STATION_LIST}, stale-while-revalidate=${CACHE_TTL.STATION_LIST * 2}`,
      },
    });
  } catch (error) {
    console.error('Stations fetch error:', error);
    return NextResponse.json({ error: 'Eroare la incarcarea posturilor' }, { status: 500 });
  }
}
