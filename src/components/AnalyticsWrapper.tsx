'use client';

import { useEffect, useRef } from 'react';
import { CONSENT_COOKIE_NAME } from '@/lib/constants';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type ConsentSnapshot = { analytics: boolean; marketing: boolean };

function readConsent(): ConsentSnapshot {
  try {
    const cookies = document.cookie.split(';');
    const consentCookie = cookies.find((c) => c.trim().startsWith(`${CONSENT_COOKIE_NAME}=`));
    if (consentCookie) {
      const value = JSON.parse(decodeURIComponent(consentCookie.split('=')[1]));
      return {
        analytics: value.analytics === true,
        marketing: value.marketing === true,
      };
    }
  } catch {
    // ignore
  }
  return { analytics: false, marketing: false };
}

export function AnalyticsWrapper() {
  const loaded = useRef(false);

  useEffect(() => {
    if (!GA_ID || loaded.current) return;
    loaded.current = true;

    const w = window as typeof window & {
      dataLayer: IArguments[];
      gtag: (...args: unknown[]) => void;
    };

    // Initialize dataLayer + gtag function BEFORE the script loads.
    // This is the official GA4 pattern: gtag pushes `arguments` (pseudo-array)
    // into dataLayer. A plain array push does NOT trigger the commands.
    w.dataLayer = w.dataLayer || [];
    const gtag: (...args: unknown[]) => void = function () {
      // eslint-disable-next-line prefer-rest-params
      (w.dataLayer as unknown as IArguments[]).push(arguments as unknown as IArguments);
    };
    w.gtag = gtag;

    // Google Consent Mode v2 — default all denied so we can load gtag
    // immediately and still be GDPR-compliant. GA sends "cookieless pings"
    // that give us aggregate traffic data (page views, users) while denied.
    const current = readConsent();
    gtag('consent', 'default', {
      ad_storage: current.marketing ? 'granted' : 'denied',
      ad_user_data: current.marketing ? 'granted' : 'denied',
      ad_personalization: current.marketing ? 'granted' : 'denied',
      analytics_storage: current.analytics ? 'granted' : 'denied',
      wait_for_update: 500,
    });

    gtag('js', new Date());
    gtag('config', GA_ID, {
      anonymize_ip: true,
      send_page_view: true,
    });

    // Inject the gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    // Update consent when user changes preferences
    const handler = () => {
      const c = readConsent();
      gtag('consent', 'update', {
        ad_storage: c.marketing ? 'granted' : 'denied',
        ad_user_data: c.marketing ? 'granted' : 'denied',
        ad_personalization: c.marketing ? 'granted' : 'denied',
        analytics_storage: c.analytics ? 'granted' : 'denied',
      });
    };
    window.addEventListener('consent-updated', handler);
    return () => window.removeEventListener('consent-updated', handler);
  }, []);

  return null;
}
