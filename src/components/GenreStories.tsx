import Link from 'next/link';
import type { Genre } from '@/types';

const genreEmoji: Record<string, string> = {
  pop: '🎵',
  rock: '🎸',
  manele: '🎤',
  'muzica-populara': '🎻',
  dance: '💃',
  'hip-hop': '🎧',
  jazz: '🎷',
  clasica: '🎼',
  stiri: '📰',
  sport: '⚽',
  religioas: '⛪',
  relaxare: '🧘',
  retro: '📻',
  'pentru-copii': '🧸',
};

const genreGradient: Record<string, string> = {
  pop: 'from-pink-500 to-purple-500',
  rock: 'from-red-500 to-orange-500',
  manele: 'from-yellow-500 to-red-500',
  'muzica-populara': 'from-green-500 to-emerald-600',
  dance: 'from-blue-500 to-cyan-400',
  'hip-hop': 'from-purple-600 to-indigo-500',
  jazz: 'from-amber-500 to-yellow-600',
  clasica: 'from-slate-400 to-slate-600',
  stiri: 'from-blue-600 to-blue-400',
  sport: 'from-green-500 to-lime-400',
  religioas: 'from-indigo-400 to-purple-400',
  relaxare: 'from-teal-400 to-cyan-300',
  retro: 'from-orange-500 to-pink-500',
  'pentru-copii': 'from-pink-400 to-yellow-400',
};

interface GenreStoriesProps {
  genres: Genre[];
}

export function GenreStories({ genres }: GenreStoriesProps) {
  return (
    <div className="scrollbar-hide overflow-x-auto">
      <div className="flex gap-4 px-4">
        {genres.map((genre) => (
          <Link
            key={genre.slug}
            href={`/radio-genuri/${genre.slug}`}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <div
              className={`rounded-full bg-gradient-to-br ${genreGradient[genre.slug] || 'from-primary to-primary/60'} p-[2.5px]`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-2xl transition-colors hover:bg-muted">
                {genreEmoji[genre.slug] || '🎵'}
              </div>
            </div>
            <span className="max-w-[72px] truncate text-center text-[11px] text-muted-foreground">
              {genre.nameRo}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
