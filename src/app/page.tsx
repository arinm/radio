import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { StationGrid } from '@/components/StationGrid';
import { GenreStories } from '@/components/GenreStories';
import { FavoritesRow } from '@/components/FavoritesRow';
import { getAllActiveStations, getGenresWithCounts, getStationCount } from '@/lib/stations';
import { FAQSection } from '@/components/FAQSection';
import { websiteJsonLd, faqJsonLd, generateHomeFAQs } from '@/lib/seo';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants';

// Revalidate every 5 minutes (CACHE_TTL.STATION_LIST = 300)
export const revalidate = 300;

export const metadata: Metadata = {
  title: `${SITE_NAME} - Asculta Radio Live din Romania`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

export default async function HomePage() {
  const [allStations, genres, stationCount] = await Promise.all([
    getAllActiveStations(),
    getGenresWithCounts(),
    getStationCount(),
  ]);

  const homeFaqs = generateHomeFAQs(stationCount);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(homeFaqs)) }}
      />

      {/* Title */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:pt-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
          <span className="font-extrabold">radio</span><span className="font-normal">vibe</span>
        </h1>
      </section>

      {/* Genre Stories - Instagram-style horizontal scroll */}
      <section className="mx-auto max-w-7xl py-6">
        <GenreStories genres={genres} />
      </section>

      {/* Favorites Row - only shows if user has favorites */}
      <section className="py-4">
        <FavoritesRow allStations={allStations} />
      </section>

      {/* All Stations */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">Toate posturile</h2>
          <Link
            href="/browse"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Vezi toate
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <StationGrid stations={allStations} />
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <FAQSection faqs={homeFaqs} title="Intrebari frecvente despre Radio Online Romania" />
      </section>

      {/* SEO content block */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-xl font-bold text-foreground">
            Asculta radio online din Romania
          </h2>
          <div className="mt-4 max-w-3xl space-y-3 text-sm text-muted-foreground">
            <p>
              {SITE_NAME} este platforma ta de radio online unde poti asculta cele mai bune posturi
              de radio din Romania. Fie ca preferi muzica pop, rock, manele, muzica populara,
              dance, hip-hop sau stiri, gasesti toate posturile tale favorite intr-un singur loc.
            </p>
            <p>
              Toate streamurile sunt gratuite si disponibile 24/7. Asculta radio live de pe
              calculator, telefon sau tableta. Nu este necesara instalarea niciunei aplicatii —
              doar apasa butonul de play si bucura-te de muzica preferata.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
