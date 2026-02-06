'use client';

import { useEffect, useRef } from 'react';
import { CONSENT_COOKIE_NAME } from '@/lib/constants';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function AnalyticsWrapper() {
  const loaded = useRef(false);

  useEffect(() => {
    if (!GA_ID || loaded.current) return;

    const checkConsent = (): boolean => {
      try {
        const cookies = document.cookie.split(';');
        const consentCookie = cookies.find((c) => c.trim().startsWith(`${CONSENT_COOKIE_NAME}=`));
        if (consentCookie) {
          const value = JSON.parse(decodeURIComponent(consentCookie.split('=')[1]));
          return value.analytics === true;
        }
      } catch {
        // Invalid cookie
      }
      return false;
    };

    const loadGA = () => {
      if (loaded.current || !checkConsent()) return;
      loaded.current = true;

      // Create and inject gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);

      // Initialize gtag
      const w = window as typeof window & { dataLayer: unknown[] };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push(['js', new Date()]);
      w.dataLayer.push(['config', GA_ID, { anonymize_ip: true }]);
    };

    // Check consent now
    loadGA();

    // Listen for consent changes
    const handler = () => loadGA();
    window.addEventListener('consent-updated', handler);
    return () => window.removeEventListener('consent-updated', handler);
  }, []);

  return null;
}
