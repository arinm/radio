export function StationCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="skeleton aspect-square" />
      <div className="p-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton mt-2 h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

export function StationGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <StationCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function GenreStoriesSkeleton() {
  return (
    <div className="flex gap-4 px-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex shrink-0 flex-col items-center gap-1.5">
          <div className="skeleton h-[69px] w-[69px] rounded-full" />
          <div className="skeleton h-3 w-12 rounded" />
        </div>
      ))}
    </div>
  );
}

export function StationDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="skeleton h-28 w-28 shrink-0 rounded-2xl sm:h-36 sm:w-36" />
          <div className="flex-1 text-center sm:text-left">
            <div className="skeleton mx-auto h-8 w-64 rounded sm:mx-0" />
            <div className="skeleton mx-auto mt-3 h-4 w-40 rounded sm:mx-0" />
            <div className="skeleton mx-auto mt-4 h-5 w-48 rounded sm:mx-0" />
            <div className="mt-6 flex justify-center gap-3 sm:justify-start">
              <div className="skeleton h-12 w-32 rounded-xl" />
              <div className="skeleton h-12 w-12 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
      {/* Similar stations skeleton */}
      <div className="mt-12">
        <div className="skeleton mb-6 h-7 w-48 rounded" />
        <StationGridSkeleton count={6} />
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="skeleton h-10 w-64 rounded" />
      <div className="skeleton mt-6 h-14 max-w-xl rounded-xl" />
      <div className="mt-8">
        <div className="skeleton mb-4 h-4 w-32 rounded" />
        <StationGridSkeleton count={6} />
      </div>
    </div>
  );
}
