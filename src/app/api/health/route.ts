import { NextResponse, type NextRequest } from 'next/server';
import { healthCheckUrlSchema } from '@/lib/validation';
import { safeFetch, validateOutboundUrl } from '@/lib/ssrf-protection';
import { cached } from '@/lib/cache';
import { CACHE_TTL } from '@/lib/constants';

/**
 * Health check endpoint for stream URLs.
 * Protected with SSRF mitigations.
 *
 * GET /api/health?url=https://stream.example.com/radio.mp3
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  // Validate input
  const parsed = healthCheckUrlSchema.safeParse({ url });
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'URL invalid', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const targetUrl = parsed.data.url;

  // SSRF check — validate URL before making request
  const validation = validateOutboundUrl(targetUrl);
  if (!validation.valid) {
    return NextResponse.json(
      { error: 'URL blocat', reason: validation.reason },
      { status: 403 },
    );
  }

  // Check cached result first
  const cacheKey = `health:${targetUrl}`;

  try {
    const result = await cached(cacheKey, CACHE_TTL.HEALTH_CHECK, async () => {
      const response = await safeFetch(targetUrl, {
        timeoutMs: 5_000,
        method: 'HEAD',
      });

      return {
        url: targetUrl,
        status: response.status,
        ok: response.ok,
        contentType: response.contentType,
        checkedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL.HEALTH_CHECK}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Eroare necunoscuta';
    return NextResponse.json(
      {
        url: targetUrl,
        ok: false,
        error: message,
        checkedAt: new Date().toISOString(),
      },
      { status: 502 },
    );
  }
}
