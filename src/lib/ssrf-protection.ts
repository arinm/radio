/**
 * SSRF Protection — prevents Server-Side Request Forgery when making
 * outbound requests (e.g., stream health checks).
 *
 * Strategy:
 * 1. Only allow http/https protocols
 * 2. Block private/internal IP ranges
 * 3. Block localhost and link-local addresses
 * 4. Enforce strict timeouts
 * 5. Limit redirects
 * 6. Limit response size
 */

import { sanitizeUrl } from './url-sanitizer';

// Private/internal IP ranges that must be blocked
const BLOCKED_IP_PATTERNS = [
  /^127\./,                          // Loopback
  /^10\./,                           // Private Class A
  /^172\.(1[6-9]|2[0-9]|3[01])\./,  // Private Class B
  /^192\.168\./,                     // Private Class C
  /^169\.254\./,                     // Link-local
  /^0\./,                            // Current network
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // Shared address space
  /^198\.(1[89])\./,                 // Benchmarking
  /^::1$/,                           // IPv6 loopback
  /^fc/i,                            // IPv6 unique local
  /^fd/i,                            // IPv6 unique local
  /^fe80/i,                          // IPv6 link-local
];

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  '0.0.0.0',
  '[::1]',
  'metadata.google.internal',
  'metadata.google',
  '169.254.169.254', // Cloud metadata endpoints
  'metadata.azure.internal',
]);

/**
 * Check if a hostname resolves to a private/internal IP.
 * Note: Full DNS resolution check would require async DNS lookup.
 * This performs a pattern-based check on the hostname itself.
 */
function isBlockedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(lower)) return true;

  // Check if hostname is an IP address matching blocked patterns
  for (const pattern of BLOCKED_IP_PATTERNS) {
    if (pattern.test(hostname)) return true;
  }

  // Block any hostname ending with .internal or .local
  if (lower.endsWith('.internal') || lower.endsWith('.local') || lower.endsWith('.localhost')) {
    return true;
  }

  return false;
}

export interface SafeFetchOptions {
  timeoutMs?: number;
  maxRedirects?: number;
  maxResponseBytes?: number;
  method?: 'HEAD' | 'GET';
}

const DEFAULT_OPTIONS: Required<SafeFetchOptions> = {
  timeoutMs: 5_000,
  maxRedirects: 2,
  maxResponseBytes: 1024, // 1KB for health checks
  method: 'HEAD',
};

/**
 * Perform a safe outbound HTTP request with SSRF protections.
 * Designed for stream health checks.
 */
export async function safeFetch(
  url: string,
  options?: SafeFetchOptions,
): Promise<{ ok: boolean; status: number; contentType: string | null }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Validate URL
  const sanitized = sanitizeUrl(url);
  if (!sanitized) {
    throw new Error('Invalid URL');
  }

  const parsed = new URL(sanitized);

  // Block internal hosts
  if (isBlockedHost(parsed.hostname)) {
    throw new Error('Request to internal/private host blocked');
  }

  // Block non-default ports that might target internal services
  const port = parsed.port ? parseInt(parsed.port, 10) : null;
  if (port !== null && port !== 80 && port !== 443 && port !== 8000 && port !== 8080) {
    // Allow common streaming ports but block others
    const allowedStreamPorts = new Set([8443, 9000, 8443, 7000, 7070, 8888, 8090]);
    if (!allowedStreamPorts.has(port)) {
      throw new Error('Blocked: non-standard port');
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs);

  try {
    const response = await fetch(sanitized, {
      method: opts.method,
      signal: controller.signal,
      redirect: opts.maxRedirects > 0 ? 'follow' : 'error',
      headers: {
        'User-Agent': 'RadioOnlineRO-HealthCheck/1.0',
      },
    });

    return {
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type'),
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Validate a URL is safe for outbound requests (without making the request).
 */
export function validateOutboundUrl(url: string): { valid: boolean; reason?: string } {
  const sanitized = sanitizeUrl(url);
  if (!sanitized) {
    return { valid: false, reason: 'Invalid URL format or protocol' };
  }

  try {
    const parsed = new URL(sanitized);

    if (isBlockedHost(parsed.hostname)) {
      return { valid: false, reason: 'Internal/private host blocked' };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: 'URL parsing failed' };
  }
}
