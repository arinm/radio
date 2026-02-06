import type { Metadata } from 'next';
import { StationGrid } from '@/components/StationGrid';
import { Pagination } from '@/components/Pagination';
import { getStations } from '@/lib/stations';
import { browseTitle, breadcrumbJsonLd } from '@/lib/seo';
import { SITE_URL, DEFAULT_PAGE_SIZE } from '@/lib/constants';

export const revalidate = 300;

export const metadata: Metadata = {
  title: browseTitle(),
  description:
    'Lista completa cu toate posturile de radio online din Romania. Alege si asculta live postul preferat.',
  alternates: { canonical: `${SITE_URL}/cauta-radio-romania` },
};

interface BrowsePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || '1', 10) || 1);
  const result = await getStations({}, page, DEFAULT_PAGE_SIZE);
  const totalPages = Math.ceil(result.total / DEFAULT_PAGE_SIZE);

  const breadcrumbs = [
    { name: 'Acasa', url: SITE_URL },
    { name: 'Toate posturile', url: `${SITE_URL}/cauta-radio-romania` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Posturile de Radio Online din Romania</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {result.total} posturi de radio online din Romania.
        </p>

        <div className="mt-8">
          <StationGrid stations={result.stations} />
        </div>

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination currentPage={page} totalPages={totalPages} basePath="/cauta-radio-romania" />
          </div>
        )}
      </div>
    </>
  );
}
