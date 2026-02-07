'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, X } from 'lucide-react';
import { CONSENT_COOKIE_NAME } from '@/lib/constants';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'radiovibe_install_dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

function hasConsentCookie(): boolean {
  try {
    const cookies = document.cookie.split(';');
    return cookies.some((c) => c.trim().startsWith(`${CONSENT_COOKIE_NAME}=`));
  } catch {
    return false;
  }
}

export function InstallBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  // Check for consent cookie and listen for consent changes
  useEffect(() => {
    setHasConsent(hasConsentCookie());

    const handleConsentUpdate = () => {
      setHasConsent(true);
    };

    window.addEventListener('consent-updated', handleConsentUpdate);
    return () => window.removeEventListener('consent-updated', handleConsentUpdate);
  }, []);

  // Only proceed with install banner logic after consent is given
  useEffect(() => {
    if (!hasConsent) return;

    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < DISMISS_DURATION) {
        return;
      }
    }

    // Listen for the beforeinstallprompt event (Chrome/Edge/etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS/Safari - show banner after delay on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    let mobileTimeout: NodeJS.Timeout | null = null;
    if (isMobile) {
      mobileTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (mobileTimeout) clearTimeout(mobileTimeout);
    };
  }, [hasConsent]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsVisible(false);
        }
      } catch {
        // User cancelled or error
      }
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
  };

  // Don't show if no consent yet or not visible
  if (!hasConsent || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="relative rounded-xl border border-border bg-card p-4 shadow-lg">
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Inchide"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Download className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 pr-6">
            <p className="text-sm font-medium text-foreground">
              Instaleaza radiovibe
            </p>
            <p className="text-xs text-muted-foreground">
              Acces rapid de pe ecranul principal
            </p>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          {deferredPrompt ? (
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isInstalling ? 'Se instaleaza...' : 'Instaleaza'}
            </button>
          ) : (
            <Link
              href="/instaleaza"
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Vezi cum
            </Link>
          )}
          <button
            onClick={handleDismiss}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Nu acum
          </button>
        </div>
      </div>
    </div>
  );
}
