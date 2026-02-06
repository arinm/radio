import type { Metadata } from 'next';
import { SearchBar } from '@/components/SearchBar';
import { StationGrid } from '@/components/StationGrid';
import { Pagination } from '@/components/Pagination';
import { searchStations } from '@/lib/stations';
import { sanitizeSearchQuery } from '@/lib/validation';
import { SITE_URL, DEFAULT_PAGE_SIZE } from '@/lib/constants';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q ? sanitizeSearchQuery(q) : '';

  return {
    title: query ? `Rezultate pentru "${query}"` : 'Cauta posturi de radio',
    description: query
      ? `Rezultatele cautarii pentru "${query}" - posturi de radio online din Romania.`
      : 'Cauta posturi de radio online din Romania dupa nume, gen muzical sau oras.',
    robots: { index: false, follow: true }, // Don't index search results
    alternates: { canonical: `${SITE_URL}/cauta` },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page: pageStr } = await searchParams;
  const query = q ? sanitizeSearchQuery(q) : '';
  const page = Math.max(1, parseInt(pageStr || '1', 10) || 1);

  const result = query
    ? await searchStations(query, page, DEFAULT_PAGE_SIZE)
    : { stations: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE };

  const totalPages = Math.ceil(result.total / DEFAULT_PAGE_SIZE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Cauta posturi de radio</h1>

      <div className="mt-6 max-w-xl">
        <SearchBar size="large" autoFocus />
      </div>

      {query && (
        <div className="mt-8">
          <p className="mb-4 text-sm text-muted-foreground">
            {result.total} rezultate pentru <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
          </p>
          <StationGrid
            stations={result.stations}
            emptyMessage={`Nu au fost gasite posturi de radio pentru "${query}".`}
          />

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/cauta"
                searchParams={{ q: query }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
