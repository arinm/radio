import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StationGrid } from '@/components/StationGrid';
import { Pagination } from '@/components/Pagination';
import { FAQSection } from '@/components/FAQSection';
import { getStations, getGenresWithCounts } from '@/lib/stations';
import {
  genreTitle,
  genreDescription,
  genreCanonical,
  breadcrumbJsonLd,
  stationListJsonLd,
  openGraphMeta,
  faqJsonLd,
  generateGenreFAQs,
} from '@/lib/seo';
import { GENRES, SITE_URL, DEFAULT_PAGE_SIZE } from '@/lib/constants';

export const revalidate = 300;

interface GenrePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const genres = await getGenresWithCounts();
  return genres.map((genre) => ({ slug: genre.slug }));
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const { slug } = await params;
  const genreInfo = GENRES[slug];
  if (!genreInfo) return { title: 'Gen negasit' };

  const genre = {
    slug,
    name: genreInfo.name,
    nameRo: genreInfo.nameRo,
    description: genreInfo.description,
    stationCount: 0,
  };

  const title = genreTitle(genre);
  const description = genreDescription(genre);
  const canonical = genreCanonical(slug);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: openGraphMeta({ title, description, url: canonical }),
  };
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const genreInfo = GENRES[slug];
  if (!genreInfo) notFound();

  const page = Math.max(1, parseInt(pageStr || '1', 10) || 1);
  const result = await getStations({ genre: slug }, page, DEFAULT_PAGE_SIZE);
  const totalPages = Math.ceil(result.total / DEFAULT_PAGE_SIZE);

  const genre = {
    slug,
    name: genreInfo.name,
    nameRo: genreInfo.nameRo,
    description: genreInfo.description,
    stationCount: result.total,
  };

  const breadcrumbs = [
    { name: 'Acasa', url: SITE_URL },
    { name: 'Genuri muzicale', url: `${SITE_URL}/genre` },
    { name: genre.nameRo, url: genreCanonical(slug) },
  ];

  const genreFaqs = generateGenreFAQs(genre);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            stationListJsonLd(result.stations, `Radio ${genre.nameRo}`, genreCanonical(slug)),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(genreFaqs)) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Acasa</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/genre" className="hover:text-foreground">Genuri</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-foreground">{genre.nameRo}</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Radio {genre.nameRo} Online
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {genre.description} ({genre.stationCount} posturi)
        </p>

        <div className="mt-8">
          <StationGrid
            stations={result.stations}
            emptyMessage={`Nu au fost gasite posturi de radio cu genul ${genre.nameRo}.`}
          />
        </div>

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/genre/${slug}`}
            />
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-12 border-t border-border pt-12">
          <FAQSection
            faqs={genreFaqs}
            title={`Intrebari frecvente despre radio ${genre.nameRo.toLowerCase()}`}
          />
        </div>
      </div>
    </>
  );
}
