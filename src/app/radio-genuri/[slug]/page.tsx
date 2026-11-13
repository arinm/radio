import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StationGrid } from '@/components/StationGrid';
import { Pagination } from '@/components/Pagination';
import { FAQSection } from '@/components/FAQSection';
import { getStations, getGenresWithCounts } from '@/lib/stations';
import { getPostsByGenre } from '@/lib/blog';
import {
  genreTitle,
  genreDescription,
  genreCanonical,
  paginatedCanonical,
  breadcrumbJsonLd,
  stationListJsonLd,
  openGraphMeta,
  faqJsonLd,
  generateGenreFAQs,
} from '@/lib/seo';
import { GENRES, SITE_URL, DEFAULT_PAGE_SIZE } from '@/lib/constants';

export const revalidate = 300;

// Only slugs from generateStaticParams exist; anything else is a real 404.
export const dynamicParams = false;

interface GenrePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const genres = await getGenresWithCounts();
  return genres.map((genre) => ({ slug: genre.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: GenrePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || '1', 10) || 1);
  const genreInfo = GENRES[slug];
  if (!genreInfo) return { title: 'Gen negasit' };

  const genre = {
    slug,
    name: genreInfo.name,
    nameRo: genreInfo.nameRo,
    description: genreInfo.description,
    stationCount: 0,
  };

  const baseTitle = genreTitle(genre);
  const title = page > 1 ? `${baseTitle} - Pagina ${page}` : baseTitle;
  const description = genreDescription(genre);
  // Self-referencing canonical that includes ?page=N for N>1, so deep pages
  // aren't canonicalised back to page 1 (which would hide their stations).
  const canonical = paginatedCanonical(genreCanonical(slug), page);

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
  // The route renders dynamically (searchParams), so dynamicParams alone doesn't
  // reject unknown params: a genre without stations is out of the sitemap and 404s.
  if (totalPages === 0 || page > totalPages) notFound();

  const genre = {
    slug,
    name: genreInfo.name,
    nameRo: genreInfo.nameRo,
    description: genreInfo.description,
    stationCount: result.total,
  };

  const breadcrumbs = [
    { name: 'Acasa', url: SITE_URL },
    { name: 'Genuri muzicale', url: `${SITE_URL}/radio-genuri` },
    { name: genre.nameRo, url: genreCanonical(slug) },
  ];

  const genreFaqs = generateGenreFAQs(genre);
  const guides = getPostsByGenre(slug);

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
          <ol className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <li>
              <Link href="/" className="hover:text-foreground">
                Acasa
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/radio-genuri" className="hover:text-foreground">
                Genuri
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium">{genre.nameRo}</li>
          </ol>
        </nav>

        <h1 className="text-foreground text-3xl font-bold sm:text-4xl">
          Radio {genre.nameRo} Online
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {genre.description} ({genre.stationCount} posturi)
        </p>
        <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-relaxed">
          Asculta cele mai bune posturi de radio {genre.nameRo.toLowerCase()} din Romania, live si
          gratuit. Alege din {genre.stationCount} posturi disponibile si apasa play pentru a incepe
          sa asculti direct din browser, fara aplicatii sau inregistrare.
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
              basePath={`/radio-genuri/${slug}`}
            />
          </div>
        )}

        {guides.length > 0 && (
          <section className="border-border mt-12 border-t pt-12">
            <h2 className="text-foreground mb-4 text-xl font-bold">
              Ghiduri despre radio {genre.nameRo.toLowerCase()}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {guides.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="border-border bg-card hover:border-primary hover:bg-primary/5 rounded-lg border p-4 transition-colors"
                >
                  <h3 className="text-foreground font-semibold">{post.title}</h3>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <div className="border-border mt-12 border-t pt-12">
          <FAQSection
            faqs={genreFaqs}
            title={`Intrebari frecvente despre radio ${genre.nameRo.toLowerCase()}`}
          />
        </div>
      </div>
    </>
  );
}
