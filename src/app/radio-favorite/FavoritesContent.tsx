'use client';

import { useEffect, useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { StationGrid } from '@/components/StationGrid';
import { StationGridSkeleton } from '@/components/Skeletons';
import type { Station } from '@/types';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export function FavoritesContent() {
  const { favorites, mounted } = useFavorites();
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;

    if (favorites.length === 0) {
      setStations([]);
      setIsLoading(false);
      return;
    }

    const fetchStations = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stations?slugs=${favorites.join(',')}`);
        if (res.ok) {
          const data = await res.json();
          setStations(data.stations || []);
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, [favorites, mounted]);

  if (!mounted || isLoading) {
    return <StationGridSkeleton count={4} />;
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Heart className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-lg text-muted-foreground">Nu ai posturi favorite inca.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Apasa pe iconita de inima de pe orice post de radio pentru a-l adauga la favorite.
        </p>
        <Link
          href="/cauta-radio-romania"
          className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Descopera posturi de radio
        </Link>
      </div>
    );
  }

  return <StationGrid stations={stations} />;
}
