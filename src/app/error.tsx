'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
      <h1 className="text-4xl font-bold text-foreground">Eroare</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        A aparut o eroare neasteptata. Va rugam incercati din nou.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Incearca din nou
      </button>
    </div>
  );
}
