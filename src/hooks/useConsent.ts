'use client';

import { useCallback, useEffect, useState } from 'react';
import { CONSENT_COOKIE_NAME, CONSENT_VERSION, CONSENT_COOKIE_MAX_AGE } from '@/lib/constants';
import type { ConsentState } from '@/types';

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: null,
  version: CONSENT_VERSION,
};

export function useConsent() {
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Read consent from cookie
    const cookies = document.cookie.split(';');
    const consentCookie = cookies.find((c) => c.trim().startsWith(`${CONSENT_COOKIE_NAME}=`));

    if (consentCookie) {
      try {
        const value = decodeURIComponent(consentCookie.split('=')[1]);
        const parsed = JSON.parse(value);
        if (parsed.version === CONSENT_VERSION) {
          setConsent({
            necessary: true,
            analytics: Boolean(parsed.analytics),
            marketing: Boolean(parsed.marketing),
            timestamp: parsed.timestamp || null,
            version: CONSENT_VERSION,
          });
          setShowBanner(false);
          return;
        }
      } catch {
        // Invalid cookie, show banner
      }
    }

    // No valid consent found, show banner
    setShowBanner(true);
  }, []);

  const updateConsent = useCallback((newConsent: Partial<ConsentState>) => {
    const updated: ConsentState = {
      necessary: true,
      analytics: Boolean(newConsent.analytics),
      marketing: Boolean(newConsent.marketing),
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };

    setConsent(updated);
    setShowBanner(false);

    // Save to cookie
    const value = encodeURIComponent(JSON.stringify(updated));
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${CONSENT_COOKIE_NAME}=${value}; Path=/; Max-Age=${CONSENT_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;

    // Dispatch event for other components (e.g., GoogleAnalytics)
    window.dispatchEvent(new CustomEvent('consent-updated', { detail: updated }));
  }, []);

  const acceptAll = useCallback(() => {
    updateConsent({ analytics: true, marketing: true });
  }, [updateConsent]);

  const acceptNecessaryOnly = useCallback(() => {
    updateConsent({ analytics: false, marketing: false });
  }, [updateConsent]);

  const revokeConsent = useCallback(() => {
    updateConsent({ analytics: false, marketing: false });
    setShowBanner(true);
  }, [updateConsent]);

  return {
    consent,
    showBanner: mounted && showBanner,
    acceptAll,
    acceptNecessaryOnly,
    updateConsent,
    revokeConsent,
    mounted,
  };
}
