'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CONSENT_COOKIE_NAME } from '@/lib/constants';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check consent on mount and when cookie changes
    const checkConsent = () => {
      const cookies = document.cookie.split(';');
      const consentCookie = cookies.find((c) => c.trim().startsWith(`${CONSENT_COOKIE_NAME}=`));

      if (consentCookie) {
        try {
          const value = decodeURIComponent(consentCookie.split('=')[1]);
          const consent = JSON.parse(value);
          setHasConsent(consent.analytics === true);
        } catch {
          setHasConsent(false);
        }
      }
    };

    checkConsent();

    // Listen for consent changes (custom event from useConsent hook)
    const handleConsentChange = () => checkConsent();
    window.addEventListener('consent-updated', handleConsentChange);

    return () => {
      window.removeEventListener('consent-updated', handleConsentChange);
    };
  }, []);

  // Don't render anything if no GA ID or no consent
  if (!GA_MEASUREMENT_ID || !hasConsent) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
