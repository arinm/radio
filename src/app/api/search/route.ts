import { NextResponse, type NextRequest } from 'next/server';
import { searchStations } from '@/lib/stations';
import { searchQuerySchema } from '@/lib/validation';
import { CACHE_TTL } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const url = request.nextUrl;

  // Parse and validate query params with Zod
  const rawParams = {
    q: url.searchParams.get('q') || '',
    page: url.searchParams.get('page') || '1',
    pageSize: url.searchParams.get('pageSize') || '24',
  };

  const parsed = searchQuerySchema.safeParse(rawParams);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Parametri de cautare invalizi', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { q, page, pageSize } = parsed.data;

  try {
    const result = await searchStations(q, page, pageSize);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL.SEARCH}, stale-while-revalidate=${CACHE_TTL.SEARCH * 2}`,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Eroare la cautare' },
      { status: 500 },
    );
  }
}
