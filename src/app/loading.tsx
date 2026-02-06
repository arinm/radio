import { StationGridSkeleton, GenreStoriesSkeleton } from '@/components/Skeletons';

export default function HomeLoading() {
  return (
    <>
      {/* Title skeleton */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:pt-10">
        <div className="skeleton h-8 w-64 rounded sm:h-10 sm:w-80" />
      </section>

      {/* Genre stories skeleton */}
      <section className="mx-auto max-w-7xl py-6">
        <GenreStoriesSkeleton />
      </section>

      {/* Station grid skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="skeleton mb-4 h-7 w-40 rounded" />
        <StationGridSkeleton count={12} />
      </section>
    </>
  );
}
