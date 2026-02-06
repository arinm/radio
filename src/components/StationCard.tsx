'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play, Pause, Heart, Radio, Loader2 } from 'lucide-react';
import { usePlayerContext } from './PlayerContext';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';
import type { Station } from '@/types';

interface StationCardProps {
  station: Station;
}

export function StationCard({ station }: StationCardProps) {
  const { station: currentStation, isPlaying, isLoading, play, togglePlay } = usePlayerContext();
  const { isFavorite, toggleFavorite, mounted } = useFavorites();

  const isCurrentStation = currentStation?.slug === station.slug;
  const isThisPlaying = isCurrentStation && isPlaying;
  const isThisLoading = isCurrentStation && isLoading;

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrentStation) {
      togglePlay();
    } else {
      play(station);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(station.slug);
  };

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg">
      <Link href={`/station/${station.slug}`} className="block">
        {/* Logo area - square */}
        <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-5">
          {station.logoUrl ? (
            <Image
              src={station.logoUrl}
              alt={`${station.name} logo`}
              width={120}
              height={120}
              className="h-3/4 w-3/4 object-contain drop-shadow-md"
              unoptimized
            />
          ) : (
            <Radio className="h-12 w-12 text-primary/40" />
          )}

          {/* Favorite button - always visible on mobile */}
          {mounted && (
            <button
              onClick={handleFavorite}
              className={cn(
                'absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full transition-all',
                isFavorite(station.slug)
                  ? 'bg-red-50 text-red-500 dark:bg-red-950'
                  : 'bg-black/20 text-white sm:opacity-0 sm:group-hover:opacity-100',
              )}
              aria-label={isFavorite(station.slug) ? 'Sterge din favorite' : 'Adauga la favorite'}
            >
              <Heart
                className={cn('h-3.5 w-3.5', isFavorite(station.slug) && 'fill-current')}
              />
            </button>
          )}

          {/* Play button - always visible on mobile */}
          <button
            onClick={handlePlay}
            className={cn(
              'absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all',
              isThisPlaying
                ? 'bg-primary text-primary-foreground'
                : 'bg-primary text-primary-foreground sm:scale-90 sm:opacity-0 sm:group-hover:scale-100 sm:group-hover:opacity-100',
              isThisLoading && 'sm:scale-100 sm:opacity-100',
            )}
            aria-label={isThisPlaying ? `Opreste ${station.name}` : `Asculta ${station.name}`}
          >
            {isThisLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isThisPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 translate-x-[1px]" />
            )}
          </button>
        </div>

        {/* Station info */}
        <div className="p-3">
          <h3 className="truncate text-sm font-semibold text-card-foreground">{station.name}</h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {station.city || station.genres[0] || 'Radio'}
          </p>
        </div>
      </Link>
    </article>
  );
}
