'use client';

import { useFavorites } from '@/hooks/useFavorites';
import { StationCard } from './StationCard';
import { Heart } from 'lucide-react';
import type { Station } from '@/types';

interface FavoritesRowProps {
  allStations: Station[];
}

export function FavoritesRow({ allStations }: FavoritesRowProps) {
  const { favorites, mounted } = useFavorites();

  if (!mounted || favorites.length === 0) return null;

  const favoriteStations = favorites
    .map((slug) => allStations.find((s) => s.slug === slug))
    .filter((s): s is Station => s !== undefined);

  if (favoriteStations.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="mb-3 flex items-center gap-2">
        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
        <h2 className="text-lg font-bold text-foreground">Favoritele tale</h2>
      </div>
      <div className="scrollbar-hide -mx-4 overflow-x-auto px-4">
        <div className="flex gap-3">
          {favoriteStations.map((station) => (
            <div key={station.slug} className="w-[140px] shrink-0 sm:w-[160px]">
              <StationCard station={station} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
