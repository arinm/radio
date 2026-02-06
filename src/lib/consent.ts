/**
 * Cookie consent utilities.
 * Implements GDPR-compliant consent management.
 *
 * Consent categories:
 * - necessary: Always active (session, consent cookie itself, player state)
 * - analytics: Google Analytics, Web Vitals reporting
 * - marketing: Ad-related cookies (none by default)
 *
 * Consent is stored in a first-party cookie and localStorage.
 * No analytics or marketing scripts load before explicit opt-in.
 */

import { CONSENT_VERSION, CONSENT_COOKIE_NAME, CONSENT_COOKIE_MAX_AGE } from './constants';
import type { ConsentState } from '@/types';

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: null,
  version: CONSENT_VERSION,
};

/**
 * Read consent state from cookie value (server-side).
 */
export function parseConsent(cookieValue: string | undefined): ConsentState {
  if (!cookieValue) return DEFAULT_CONSENT;

  try {
    const parsed = JSON.parse(cookieValue);
    if (parsed.version !== CONSENT_VERSION) {
      // Consent version mismatch — treat as no consent
      return DEFAULT_CONSENT;
    }
    return {
      necessary: true, // Always true
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      timestamp: parsed.timestamp || null,
      version: CONSENT_VERSION,
    };
  } catch {
    return DEFAULT_CONSENT;
  }
}

/**
 * Serialize consent state for cookie storage.
 */
export function serializeConsent(consent: ConsentState): string {
  return JSON.stringify({
    necessary: true,
    analytics: consent.analytics,
    marketing: consent.marketing,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  });
}

/**
 * Cookie options for the consent cookie.
 */
export const CONSENT_COOKIE_OPTIONS = {
  name: CONSENT_COOKIE_NAME,
  maxAge: CONSENT_COOKIE_MAX_AGE,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  httpOnly: false, // Must be readable by client JS
};
