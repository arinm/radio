'use client';

import { useState } from 'react';
import { useConsent } from '@/hooks/useConsent';
import { Shield, Settings, X } from 'lucide-react';
import Link from 'next/link';

export function ConsentBanner() {
  const { showBanner, acceptAll, acceptNecessaryOnly, updateConsent } = useConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (!showBanner) return null;

  const handleSavePreferences = () => {
    updateConsent({ analytics, marketing });
  };

  // Kept compact on mobile: the banner paints after hydration, so if its text
  // block is larger than the page's H1/intro it becomes the LCP element.
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-2 sm:p-4" role="dialog" aria-label="Consimtamant cookie-uri">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Main banner */}
        {!showSettings ? (
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 hidden h-5 w-5 shrink-0 text-primary sm:block" />
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-card-foreground sm:text-base">
                  Respectam confidentialitatea dumneavoastra
                </h2>
                <p className="mt-1 text-xs text-muted-foreground sm:mt-1.5 sm:text-sm">
                  Cookie-urile de analiza si marketing se activeaza doar cu acordul
                  dumneavoastra.{' '}
                  <Link href="/politica-cookies" className="text-primary underline">
                    Politica de cookie-uri
                  </Link>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
                  <button
                    onClick={acceptAll}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-5 sm:py-2.5"
                  >
                    Accepta toate
                  </button>
                  <button
                    onClick={acceptNecessaryOnly}
                    className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:px-5 sm:py-2.5"
                  >
                    Doar esentiale
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Personalizeaza
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Granular settings */
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-card-foreground">Preferinte cookie-uri</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                aria-label="Inchide"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Necessary — always on */}
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Esentiale</p>
                  <p className="text-xs text-muted-foreground">
                    Necesare pentru functionarea site-ului. Nu pot fi dezactivate.
                  </p>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Mereu active
                </div>
              </div>

              {/* Analytics */}
              <label className="flex cursor-pointer items-center justify-between rounded-lg p-3 hover:bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Analitice</p>
                  <p className="text-xs text-muted-foreground">
                    Ne ajuta sa intelegem cum este utilizat site-ul (Google Analytics).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="h-5 w-5 rounded accent-primary"
                />
              </label>

              {/* Marketing */}
              <label className="flex cursor-pointer items-center justify-between rounded-lg p-3 hover:bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Marketing</p>
                  <p className="text-xs text-muted-foreground">
                    Permit afisarea de reclame personalizate (nu sunt utilizate momentan).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="h-5 w-5 rounded accent-primary"
                />
              </label>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleSavePreferences}
                className="flex-1 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Salveaza preferintele
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Anuleaza
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
