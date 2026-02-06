'use client';

import Image from 'next/image';
import { usePlayerContext } from './PlayerContext';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  RotateCcw,
  Radio,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function MiniPlayer() {
  const { station, isPlaying, isLoading, isBuffering, error, volume, isMuted, togglePlay, stop, setVolume, toggleMute, retry } =
    usePlayerContext();

  if (!station) return null;

  return (
    <div className="mini-player fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-3 px-4">
        {/* Station info */}
        <Link
          href={`/radio/${station.slug}-online`}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
            {station.logoUrl ? (
              <Image
                src={station.logoUrl}
                alt={station.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <Radio className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-card-foreground">{station.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {isLoading
                ? 'Se incarca...'
                : isBuffering
                  ? 'Se incarca buffer...'
                  : error
                    ? error
                    : isPlaying
                      ? 'Redare live'
                      : 'Oprit'}
            </p>
          </div>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Retry button on error */}
          {error && !isLoading && (
            <button
              onClick={retry}
              className="flex h-9 w-9 items-center justify-center rounded-full text-destructive transition-colors hover:bg-destructive/10"
              aria-label="Reincearca"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90',
              isLoading && 'opacity-75',
            )}
            aria-label={isPlaying ? 'Pauza' : 'Reda'}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : error ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 translate-x-[1px]" />
            )}
          </button>

          {/* Stop */}
          <button
            onClick={stop}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Opreste"
          >
            <Square className="h-4 w-4" />
          </button>

          {/* Volume (hidden on mobile) */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={toggleMute}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={isMuted ? 'Activeaza sunetul' : 'Dezactiveaza sunetul'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20"
              aria-label="Volum"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
