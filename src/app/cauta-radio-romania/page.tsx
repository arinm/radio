import type { Metadata } from 'next';
import { StationGrid } from '@/components/StationGrid';
import { Pagination } from '@/components/Pagination';
import { getStations } from '@/lib/stations';
import { browseTitle, breadcrumbJsonLd, openGraphMeta, paginatedCanonical } from '@/lib/seo';
import { SITE_URL, DEFAULT_PAGE_SIZE } from '@/lib/constants';

export const revalidate = 300;

const BROWSE_DESCRIPTION =
  'Lista completa cu 60+ posturi de radio online din Romania. Cauta si asculta live muzica pop, rock, manele, dance, stiri si sport — gratuit, pe orice dispozitiv.';

interface BrowsePageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ searchParams }: BrowsePageProps): Promise<Metadata> {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || '1', 10) || 1);
  const baseTitle = browseTitle();
  const title = page > 1 ? `${baseTitle} - Pagina ${page}` : baseTitle;
  const canonical = paginatedCanonical(`${SITE_URL}/cauta-radio-romania`, page);

  return {
    title,
    description: BROWSE_DESCRIPTION,
    alternates: { canonical },
    openGraph: openGraphMeta({ title, description: BROWSE_DESCRIPTION, url: canonical }),
  };
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
        <h1 className="text-foreground text-3xl font-bold sm:text-4xl">
          Posturile de Radio Online din Romania
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {result.total} posturi de radio online din Romania.
        </p>

        <div className="mt-8">
          <StationGrid stations={result.stations} />
        </div>

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/cauta-radio-romania"
            />
          </div>
        )}
      </div>
    </>
  );
}
