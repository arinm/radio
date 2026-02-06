import type { Metadata } from 'next';
import Link from 'next/link';
import { WifiOff, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Esti offline',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <WifiOff className="h-10 w-10 text-muted-foreground" />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-foreground">Esti offline</h1>

      <p className="mt-3 text-muted-foreground">
        Nu exista conexiune la internet. Verifica conexiunea si incearca din
        nou.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <RefreshCw className="h-4 w-4" />
        Reincearca
      </Link>
    </div>
  );
}
