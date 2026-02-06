import { NextResponse, type NextRequest } from 'next/server';
import { checkRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limiter';
import { RATE_LIMIT } from '@/lib/constants';

/**
 * Security middleware — applies to all routes.
 *
 * Responsibilities:
 * 1. Security headers (CSP, HSTS, X-Frame-Options, etc.)
 * 2. Rate limiting for API routes
 * 3. Basic bot protection
 */

// CSP directives tuned for Next.js + audio streaming
function buildCsp(): string {
  const directives = [
    // Default: only self
    "default-src 'self'",
    // Scripts: self + Next.js inline scripts (unsafe-inline needed for Next.js hydration)
    // In production, use nonces instead of unsafe-inline
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
    // Styles: self + inline styles (Tailwind generates inline styles)
    "style-src 'self' 'unsafe-inline'",
    // Images: self + data URIs (for base64 logos) + any https source (station logos)
    "img-src 'self' data: https:",
    // Fonts: self + data URIs
    "font-src 'self' data:",
    // Connect: self + known streaming domains + analytics (if consented)
    "connect-src 'self' https://*.srr.ro https://*.kissfm.ro https://*.radiozu.ro https://*.europafm.ro https://*.magicfm.ro https://*.rockfm.ro https://*.profm.ro https://*.goldfm.ro https://*.dancefm.ro https://*.guerrillaradio.ro https://*.itsybitsy.ro https://*.nationalfm.ro https://*.virginradio.ro https://*.digifm.ro https://*.radiotrinitas.ro https://*.rcs-rds.ro https://*.sporttotal.ro https://*.hiphopfm.ro https://*.relaxare.ro https://www.google-analytics.com",
    // Media: self + streaming domains (same as connect-src for audio)
    "media-src 'self' https: http:",
    // Frame: none (we don't embed iframes)
    "frame-src 'none'",
    // Object: none
    "object-src 'none'",
    // Base URI: self
    "base-uri 'self'",
    // Form action: self
    "form-action 'self'",
    // Frame ancestors: none (clickjacking protection)
    "frame-ancestors 'none'",
    // Upgrade insecure requests in production
    ...(process.env.NODE_ENV === 'production' ? ['upgrade-insecure-requests'] : []),
  ];

  return directives.join('; ');
}

// Security headers applied to all responses
const securityHeaders: Record<string, string> = {
  'Content-Security-Policy': buildCsp(),
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
  'X-XSS-Protection': '1; mode=block',
};

// Rate limit configurations per API path
const API_RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/search': RATE_LIMIT.SEARCH,
  '/api/stations': RATE_LIMIT.API,
  '/api/health': RATE_LIMIT.HEALTH,
};

// Suspicious bot patterns (block scanners, not legitimate crawlers)
const BLOCKED_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /nessus/i,
  /masscan/i,
  /ZmEu/i,
  /python-requests\/[0-2]\./i,
  /Go-http-client/i,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Bot protection ---
  const ua = request.headers.get('user-agent') || '';
  if (BLOCKED_USER_AGENTS.some((pattern) => pattern.test(ua))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // --- Rate limiting for API routes ---
  if (pathname.startsWith('/api/')) {
    const clientIp = getClientIp(request);
    const limitConfig = API_RATE_LIMITS[pathname] || RATE_LIMIT.API;
    const rateLimitKey = `${clientIp}:${pathname}`;
    const result = checkRateLimit(rateLimitKey, limitConfig);

    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests', retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000) }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
            ...rateLimitHeaders(result),
            ...securityHeaders,
          },
        },
      );
    }

    // Add rate limit headers to API responses
    const response = NextResponse.next();
    for (const [key, value] of Object.entries(rateLimitHeaders(result))) {
      response.headers.set(key, value);
    }
    for (const [key, value] of Object.entries(securityHeaders)) {
      response.headers.set(key, value);
    }
    return response;
  }

  // --- Security headers for all other routes ---
  const response = NextResponse.next();
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|icons/).*)',
  ],
};
