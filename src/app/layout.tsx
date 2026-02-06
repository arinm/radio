import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { PlayerProvider } from '@/components/PlayerContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MiniPlayer } from '@/components/MiniPlayer';
import { ConsentBanner } from '@/components/ConsentBanner';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { AnalyticsWrapper } from '@/components/AnalyticsWrapper';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, DEFAULT_LANGUAGE } from '@/lib/constants';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Asculta Radio Live din Romania`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'radio online',
    'radio romania',
    'radio live',
    'asculta radio',
    'posturi radio romania',
    'radio online romania',
    'muzica online',
    'radio streaming',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Asculta Radio Live din Romania`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Asculta Radio Live din Romania`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  appleWebApp: {
    capable: true,
    title: 'Radio Online Romania',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={DEFAULT_LANGUAGE.split('-')[0]} className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <PlayerProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <MiniPlayer />
            </div>
            <ConsentBanner />
            <ServiceWorkerRegister />
            <AnalyticsWrapper />
          </PlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
