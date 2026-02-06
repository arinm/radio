'use client';

import Image from 'next/image';
import { Play, Pause, Loader2, Radio, Heart } from 'lucide-react';
import { usePlayerContext } from '@/components/PlayerContext';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';
import type { Station } from '@/types';

interface StationPlayButtonProps {
  station: Station;
}

export function StationPlayButton({ station }: StationPlayButtonProps) {
  const { station: currentStation, isPlaying, isLoading, play, togglePlay } = usePlayerContext();
  const { isFavorite, toggleFavorite, mounted } = useFavorites();

  const isCurrentStation = currentStation?.slug === station.slug;
  const isThisPlaying = isCurrentStation && isPlaying;
  const isThisLoading = isCurrentStation && isLoading;

  const handlePlay = () => {
    if (isCurrentStation) {
      togglePlay();
    } else {
      play(station);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center sm:min-w-[240px]">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 overflow-hidden">
        {station.logoUrl ? (
          <Image
            src={station.logoUrl}
            alt={`${station.name} logo`}
            width={80}
            height={80}
            className="h-16 w-16 object-contain"
            unoptimized
          />
        ) : (
          <Radio className="h-10 w-10 text-primary" />
        )}
      </div>

      <button
        onClick={handlePlay}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold transition-all',
          isThisPlaying
            ? 'bg-primary/10 text-primary hover:bg-primary/20'
            : 'bg-primary text-primary-foreground hover:bg-primary/90',
        )}
      >
        {isThisLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Se incarca...
          </>
        ) : isThisPlaying ? (
          <>
            <Pause className="h-5 w-5" />
            Pauza
          </>
        ) : (
          <>
            <Play className="h-5 w-5" />
            Asculta live
          </>
        )}
      </button>

      {mounted && (
        <button
          onClick={() => toggleFavorite(station.slug)}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            isFavorite(station.slug)
              ? 'text-red-500'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Heart className={cn('h-4 w-4', isFavorite(station.slug) && 'fill-current')} />
          {isFavorite(station.slug) ? 'In favorite' : 'Adauga la favorite'}
        </button>
      )}
    </div>
  );
}
