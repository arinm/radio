import { StationGridSkeleton } from '@/components/Skeletons';

export default function BrowseLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="skeleton h-10 w-80 rounded" />
      <div className="skeleton mt-2 h-5 w-48 rounded" />
      <div className="mt-8">
        <StationGridSkeleton count={12} />
      </div>
    </div>
  );
}
