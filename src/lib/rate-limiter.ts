/**
 * In-memory rate limiter for API routes.
 * For production at scale, replace with Redis-backed rate limiting.
 *
 * Uses a sliding window counter approach per IP.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup to prevent memory leaks
const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }

  // Hard cap on store size to prevent memory exhaustion
  if (store.size > 10_000) {
    store.clear();
  }
}

export interface RateLimitConfig {
  max: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

/**
 * Check rate limit for a given identifier (typically IP address).
 */
export function checkRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  cleanup();

  const now = Date.now();
  const key = identifier;
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    // New window
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: config.max - 1,
      resetAt,
      limit: config.max,
    };
  }

  // Existing window
  entry.count++;

  if (entry.count > config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      limit: config.max,
    };
  }

  return {
    allowed: true,
    remaining: config.max - entry.count,
    resetAt: entry.resetAt,
    limit: config.max,
  };
}

/**
 * Get the client IP from Next.js request headers.
 * Handles common proxy headers safely.
 */
export function getClientIp(request: Request): string {
  // x-forwarded-for can be spoofed, but it's standard behind reverse proxies
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // Take the first IP (client IP before proxies)
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  return '127.0.0.1';
}

/**
 * Apply rate limit headers to a Response.
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(Math.max(0, result.remaining)),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  };
}
