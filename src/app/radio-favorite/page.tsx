import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import { FavoritesContent } from './FavoritesContent';

export const metadata: Metadata = {
  title: 'Posturile Mele Favorite de Radio',
  description: 'Lista personala de posturi de radio favorite. Salveaza si acceseaza rapid posturile preferate. Datele sunt stocate local in browser, 100% privat.',
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/radio-favorite` },
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Posturile Mele Favorite de Radio</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Posturile de radio salvate in favorite. Datele sunt stocate local in browserul tau.
      </p>
      <div className="mt-8">
        <FavoritesContent />
      </div>
    </div>
  );
}
