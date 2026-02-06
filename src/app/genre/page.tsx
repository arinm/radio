import type { Metadata } from 'next';
import { GenreCard } from '@/components/GenreCard';
import { getGenresWithCounts } from '@/lib/stations';
import { SITE_URL } from '@/lib/constants';
import { breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Genuri Muzicale - Posturi Radio pe Categorii`,
  description:
    'Descopera posturi de radio online din Romania pe genuri muzicale: pop, rock, manele, muzica populara, dance, hip-hop, jazz, stiri si multe altele.',
  alternates: { canonical: `${SITE_URL}/genre` },
};

export default async function GenresPage() {
  const genres = await getGenresWithCounts();

  const breadcrumbs = [
    { name: 'Acasa', url: SITE_URL },
    { name: 'Genuri muzicale', url: `${SITE_URL}/genre` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Genuri muzicale</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Alege genul preferat si descopera posturi de radio online din Romania.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {genres.map((genre) => (
            <GenreCard key={genre.slug} genre={genre} />
          ))}
        </div>
      </div>
    </>
  );
}
