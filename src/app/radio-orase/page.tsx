import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { CITIES } from '@/lib/cities';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { breadcrumbJsonLd, openGraphMeta } from '@/lib/seo';

export const revalidate = 86400;

const CITIES_TITLE = `Radio Online pe Orase - Asculta Radio Live din Orasul Tau | ${SITE_NAME}`;
const CITIES_DESCRIPTION =
  'Asculta radio online pe orase din Romania: Bucuresti, Cluj-Napoca, Timisoara, Iasi, Constanta, Brasov si multe altele. Posturi locale si nationale live, gratuit.';

export const metadata: Metadata = {
  title: CITIES_TITLE,
  description: CITIES_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/radio-orase` },
  openGraph: openGraphMeta({
    title: CITIES_TITLE,
    description: CITIES_DESCRIPTION,
    url: `${SITE_URL}/radio-orase`,
  }),
};

export default function CitiesPage() {
  const breadcrumbs = [
    { name: 'Acasa', url: SITE_URL },
    { name: 'Radio pe orase', url: `${SITE_URL}/radio-orase` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <nav className="text-muted-foreground mb-6 text-sm" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">
            Acasa
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Radio pe orase</span>
        </nav>

        <h1 className="text-foreground text-3xl font-bold sm:text-4xl">
          Radio Online pe Orase din Romania
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Alege orasul si descopera posturile de radio disponibile — locale si nationale, toate live
          si gratuit.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/radio-orase/${city.slug}`}
              className="group border-border bg-card hover:border-primary hover:bg-primary/5 rounded-xl border p-5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-foreground group-hover:text-primary font-semibold">
                    Radio {city.nameRo}
                  </h2>
                  <p className="text-muted-foreground text-xs">{city.region}</p>
                </div>
              </div>
              <p className="text-muted-foreground mt-3 line-clamp-2 text-sm">{city.description}</p>
            </Link>
          ))}
        </div>

        <section className="text-muted-foreground mt-12 max-w-3xl space-y-3 text-sm leading-relaxed">
          <h2 className="text-foreground text-lg font-bold">
            Asculta radio live din orice oras al Romaniei
          </h2>
          <p>
            Platforma noastra iti ofera acces la posturile de radio din toate regiunile Romaniei.
            Fie ca locuiesti in Bucuresti, Cluj-Napoca, Timisoara, Iasi, Constanta sau in orice alt
            oras, poti asculta atat posturile locale cat si toate retelele nationale — pop, rock,
            manele, dance, muzica populara, stiri — toate live si gratuite.
          </p>
          <p>
            Streamurile online nu au restrictii geografice, asa ca poti asculta radioul preferat
            oriunde te-ai afla — acasa, la birou, in masina sau in calatorie. Alege orasul tau din
            lista si descopera posturile disponibile.
          </p>
        </section>
      </div>
    </>
  );
}
