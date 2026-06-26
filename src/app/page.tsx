import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { StationGrid } from '@/components/StationGrid';
import { GenreStories } from '@/components/GenreStories';
import { FavoritesRow } from '@/components/FavoritesRow';
import { getAllActiveStations, getGenresWithCounts, getStationCount } from '@/lib/stations';
import { FAQSection } from '@/components/FAQSection';
import { websiteJsonLd, organizationJsonLd, faqJsonLd, generateHomeFAQs } from '@/lib/seo';
import { SITE_NAME, BRAND_NAME, SITE_URL, SITE_DESCRIPTION, GENRES } from '@/lib/constants';

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
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
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
          Radio Online Romania - Asculta Posturi de Radio Live Gratuit
        </h1>
        <p className="text-muted-foreground mt-2 text-base sm:text-lg">
          Peste {stationCount} posturi de radio romanesti live. Muzica, stiri, sport si divertisment
          — 24/7, gratuit.
        </p>
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
          <h2 className="text-foreground text-xl font-bold sm:text-2xl">Toate posturile</h2>
          <Link
            href="/cauta-radio-romania"
            className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Vezi toate
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <StationGrid stations={allStations} />
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <FAQSection faqs={homeFaqs} title={`Intrebari frecvente despre ${BRAND_NAME}`} />
      </section>

      {/* Popular Genres - internal linking */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-foreground mb-4 text-xl font-bold sm:text-2xl">
          Genuri populare de radio
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Object.entries(GENRES).map(([slug, genre]) => (
            <Link
              key={slug}
              href={`/radio-genuri/${slug}`}
              className="border-border bg-card text-foreground hover:border-primary hover:bg-primary/5 rounded-lg border px-4 py-3 text-center text-sm font-medium transition-colors"
            >
              {genre.nameRo}
            </Link>
          ))}
        </div>
      </section>

      {/* SEO content block */}
      <section className="border-border bg-muted/30 border-t">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-foreground text-xl font-bold">Asculta radio online din Romania</h2>
          <div className="text-muted-foreground mt-4 max-w-3xl space-y-3 text-sm leading-relaxed">
            <p>
              {BRAND_NAME} este platforma ta de radio online unde poti asculta cele mai bune posturi
              de radio din Romania. Fie ca preferi muzica pop, rock, manele, muzica populara, dance,
              hip-hop sau stiri, gasesti toate posturile tale favorite intr-un singur loc. Avem
              peste {stationCount} posturi de radio romanesti disponibile pentru streaming live.
            </p>
            <p>
              Toate streamurile sunt gratuite si disponibile 24/7. Asculta radio live de pe
              calculator, telefon sau tableta. Nu este necesara instalarea niciunei aplicatii — doar
              apasa butonul de play si bucura-te de muzica preferata.
            </p>

            <h3 className="text-foreground pt-2 text-base font-semibold">
              Radio online pentru orice gust
            </h3>
            <p>
              Descopera posturi de radio din cele mai populare genuri muzicale din Romania: radio
              pop cu hiturile momentului, radio rock cu muzica clasica si alternativa, radio manele
              cu cele mai noi piese, radio muzica populara si folclor romanesc, radio dance si
              electronica, radio hip-hop si rap, radio jazz si blues, radio retro cu hituri din anii
              80 si 90, si posturi de stiri cu informatii in timp real.
            </p>

            <h3 className="text-foreground pt-2 text-base font-semibold">
              Radio live din cele mai mari orase
            </h3>
            <p>
              Asculta posturi de radio din Bucuresti, Cluj-Napoca, Timisoara, Iasi, Constanta,
              Brasov, Craiova, Galati, Sibiu si din toate regiunile Romaniei. Indiferent unde te
              afli, poti asculta radioul tau preferat online, gratuit si fara intreruperi.
            </p>

            <h3 className="text-foreground pt-2 text-base font-semibold">
              De ce sa alegi {BRAND_NAME}?
            </h3>
            <p>
              Platforma noastra ofera streaming radio de inalta calitate, fara reclame proprii si
              fara a fi nevoie de cont sau abonament. Interfata este simpla, rapida si optimizata
              pentru orice dispozitiv. Poti salva posturile favorite, naviga pe genuri muzicale si
              descoperi posturi noi recomandate. Folosim tehnologie moderna pentru a asigura o
              experienta de ascultare fluida si placuta.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
