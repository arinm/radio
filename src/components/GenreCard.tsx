import Link from 'next/link';
import { Music, Headphones } from 'lucide-react';
import type { Genre } from '@/types';

interface GenreCardProps {
  genre: Genre;
}

const genreIcons: Record<string, typeof Music> = {
  pop: Music,
  rock: Headphones,
};

export function GenreCard({ genre }: GenreCardProps) {
  const Icon = genreIcons[genre.slug] || Music;

  return (
    <Link
      href={`/radio-genuri/${genre.slug}`}
      className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 transition-colors group-hover:bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-card-foreground">{genre.nameRo}</h3>
        <p className="text-xs text-muted-foreground">{genre.stationCount} posturi</p>
      </div>
    </Link>
  );
}
