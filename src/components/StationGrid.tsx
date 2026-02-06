import type { Station } from '@/types';
import { StationCard } from './StationCard';

interface StationGridProps {
  stations: Station[];
  emptyMessage?: string;
}

export function StationGrid({ stations, emptyMessage = 'Nu au fost gasite posturi de radio.' }: StationGridProps) {
  if (stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {stations.map((station) => (
        <StationCard key={station.slug} station={station} />
      ))}
    </div>
  );
}
