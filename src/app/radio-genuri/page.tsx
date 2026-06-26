import type { Metadata } from 'next';
import { GenreCard } from '@/components/GenreCard';
import { getGenresWithCounts } from '@/lib/stations';
import { SITE_URL } from '@/lib/constants';
import { breadcrumbJsonLd, openGraphMeta } from '@/lib/seo';

export const revalidate = 3600;

const GENRES_TITLE = `Genuri de Radio Online - Descopera Posturi Preferate`;
const GENRES_DESCRIPTION =
  'Descopera posturi de radio online din Romania pe genuri muzicale: pop, rock, manele, muzica populara, dance, hip-hop, jazz, stiri si multe altele. Gratuit, 24/7.';

export const metadata: Metadata = {
  title: GENRES_TITLE,
  description: GENRES_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/radio-genuri` },
  openGraph: openGraphMeta({
    title: GENRES_TITLE,
    description: GENRES_DESCRIPTION,
    url: `${SITE_URL}/radio-genuri`,
  }),
};

export default async function GenresPage() {
  const genres = await getGenresWithCounts();

  const breadcrumbs = [
    { name: 'Acasa', url: SITE_URL },
    { name: 'Genuri muzicale', url: `${SITE_URL}/radio-genuri` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-foreground text-3xl font-bold sm:text-4xl">
          Genuri de Radio Online din Romania
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Alege genul preferat si descopera peste 60 de posturi de radio online din Romania — pop,
          rock, manele, dance, stiri si multe altele.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {genres.map((genre) => (
            <GenreCard key={genre.slug} genre={genre} />
          ))}
        </div>

        <div className="text-muted-foreground mt-12 max-w-3xl space-y-3 text-sm leading-relaxed">
          <h2 className="text-foreground text-lg font-bold">
            Descopera radio online pe genuri muzicale
          </h2>
          <p>
            Platforma noastra ofera o varietate de genuri muzicale pentru toate gusturile. De la
            radio pop cu cele mai noi hituri romanesti si internationale, la radio rock cu muzica
            clasica si alternativa, radio manele, muzica populara si folclor romanesc, dance si
            electronica, hip-hop si rap, jazz si blues, muzica clasica, si posturi de radio cu stiri
            si informatii din Romania.
          </p>
          <p>
            Fiecare categorie contine posturi de radio selectate care transmit non-stop, 24 de ore
            din 24, 7 zile din 7. Toate streamurile sunt gratuite si pot fi ascultate direct din
            browser, fara aplicatii sau inregistrare.
          </p>
        </div>
      </div>
    </>
  );
}
