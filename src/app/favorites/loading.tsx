import { StationGridSkeleton } from '@/components/Skeletons';

export default function FavoritesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="skeleton h-10 w-48 rounded" />
      <div className="skeleton mt-2 h-5 w-64 rounded" />
      <div className="mt-8">
        <StationGridSkeleton count={8} />
      </div>
    </div>
  );
}
