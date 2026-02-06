/**
 * URL Sanitizer — validates and sanitizes URLs for safe rendering and linking.
 * Prevents XSS via javascript: URLs, data: URLs, and other injection vectors.
 */

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

const SOCIAL_DOMAINS: Record<string, string[]> = {
  facebook: ['facebook.com', 'www.facebook.com', 'fb.com', 'www.fb.com'],
  instagram: ['instagram.com', 'www.instagram.com'],
  twitter: ['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'],
  youtube: ['youtube.com', 'www.youtube.com', 'youtu.be'],
  tiktok: ['tiktok.com', 'www.tiktok.com'],
};

/**
 * Validates a URL is safe for rendering in the browser.
 * Returns null if the URL is invalid or potentially dangerous.
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
      return null;
    }

    // Block embedded credentials
    if (parsed.username || parsed.password) {
      return null;
    }

    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Validates a social media URL belongs to the expected platform.
 */
export function sanitizeSocialUrl(
  url: string | null | undefined,
  platform: keyof typeof SOCIAL_DOMAINS,
): string | null {
  const sanitized = sanitizeUrl(url);
  if (!sanitized) return null;

  try {
    const parsed = new URL(sanitized);
    const allowedDomains = SOCIAL_DOMAINS[platform];

    if (!allowedDomains?.includes(parsed.hostname)) {
      return null;
    }

    return sanitized;
  } catch {
    return null;
  }
}

/**
 * Validates a stream URL for use with HTML5 Audio.
 * More permissive on hostname, but strict on protocol.
 */
export function sanitizeStreamUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
      return null;
    }

    if (parsed.username || parsed.password) {
      return null;
    }

    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Validates a logo/image URL.
 */
export function sanitizeImageUrl(url: string | null | undefined): string | null {
  return sanitizeUrl(url);
}
