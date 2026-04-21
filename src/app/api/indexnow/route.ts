import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { submitToIndexNow } from '@/lib/indexnow';
import { SITE_URL } from '@/lib/constants';
import { getAllStationSlugs, getGenresWithCounts } from '@/lib/stations';
import { CITIES } from '@/lib/cities';
import { BLOG_POSTS } from '@/lib/blog';

export const dynamic = 'force-dynamic';

function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

/**
 * POST /api/indexnow
 * Submits all canonical URLs to IndexNow.
 * Protect with a token: /api/indexnow?token=SECRET
 * Set INDEXNOW_TOKEN env var.
 */
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get('token');
  const expected = process.env.INDEXNOW_TOKEN;
  if (!expected || !token || !safeCompare(token, expected)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const [stationSlugs, genres] = await Promise.all([
    getAllStationSlugs(),
    getGenresWithCounts(),
  ]);

  const urls: string[] = [
    SITE_URL,
    `${SITE_URL}/cauta-radio-romania`,
    `${SITE_URL}/radio-genuri`,
    `${SITE_URL}/radio-orase`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/instaleaza`,
    ...stationSlugs.map((slug) => `${SITE_URL}/radio/${slug}-online`),
    ...genres.map((g) => `${SITE_URL}/radio-genuri/${g.slug}`),
    ...CITIES.map((c) => `${SITE_URL}/radio-orase/${c.slug}`),
    ...BLOG_POSTS.map((p) => `${SITE_URL}/blog/${p.slug}`),
  ];

  // IndexNow recommends max 10000 URLs per request
  const chunks: string[][] = [];
  for (let i = 0; i < urls.length; i += 10000) {
    chunks.push(urls.slice(i, i + 10000));
  }

  const results = await Promise.all(chunks.map((c) => submitToIndexNow(c)));
  const allOk = results.every((r) => r.ok);

  return NextResponse.json(
    {
      submitted: urls.length,
      chunks: results,
      ok: allOk,
    },
    { status: allOk ? 200 : 502 },
  );
}

/**
 * GET /api/indexnow — status/info endpoint.
 */
export async function GET() {
  return NextResponse.json({
    message: 'IndexNow submission endpoint. Use POST with ?token= to submit all URLs.',
    keyFile: `${SITE_URL}/556f0aae895c4ef6dc690ea45dbeb208.txt`,
  });
}
