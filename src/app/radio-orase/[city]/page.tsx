import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { StationGrid } from '@/components/StationGrid';
import { FAQSection } from '@/components/FAQSection';
import { CITIES, getCityBySlug } from '@/lib/cities';
import { getAllActiveStations } from '@/lib/stations';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { breadcrumbJsonLd, faqJsonLd, stationListJsonLd } from '@/lib/seo';
import type { FAQItem } from '@/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) return {};

  return {
    title: `Radio Online din ${city.nameRo} - Posturi Radio Live ${city.nameRo} | ${SITE_NAME}`,
    description: city.description,
    alternates: { canonical: `${SITE_URL}/radio-orase/${city.slug}` },
    openGraph: {
      type: 'website',
      locale: 'ro_RO',
      url: `${SITE_URL}/radio-orase/${city.slug}`,
      siteName: SITE_NAME,
      title: `Radio Online din ${city.nameRo}`,
      description: city.description,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `Radio Online din ${city.nameRo}`,
        },
      ],
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const allStations = await getAllActiveStations();

  const localStations = allStations.filter(
    (s) => s.city && city.dbMatchers.some((m) => s.city?.toLowerCase() === m.toLowerCase()),
  );
  const nationalStations = allStations.filter(
    (s) => !localStations.some((l) => l.slug === s.slug),
  );

  const pageUrl = `${SITE_URL}/radio-orase/${city.slug}`;
  const breadcrumbs = [
    { name: 'Acasa', url: SITE_URL },
    { name: 'Radio pe orase', url: `${SITE_URL}/radio-orase` },
    { name: `Radio ${city.nameRo}`, url: pageUrl },
  ];

  const faqs: FAQItem[] = [
    {
      question: `Ce posturi de radio pot asculta din ${city.nameRo}?`,
      answer:
        localStations.length > 0
          ? `Din ${city.nameRo} poti asculta ${localStations.length} posturi locale (${localStations
              .slice(0, 5)
              .map((s) => s.name)
              .join(', ')}) plus toate retelele nationale — Kiss FM, Europa FM, Pro FM, Radio ZU, Magic FM si altele, toate live si gratuit online.`
          : `Din ${city.nameRo} poti asculta online toate posturile nationale de radio romanesti — Kiss FM, Europa FM, Pro FM, Radio ZU, Magic FM, Digi FM, Rock FM si multe altele. Streamul online nu are restrictii geografice.`,
    },
    {
      question: `Pot asculta radio din ${city.nameRo} gratuit?`,
      answer: `Da, toate posturile de radio de pe platforma noastra sunt gratuite si nu necesita cont sau abonament. Apasa play pe orice post pentru a incepe streamul live imediat.`,
    },
    {
      question: `Cum ascult radio din ${city.nameRo} pe telefon?`,
      answer: `Deschide platforma in browserul telefonului (Chrome, Safari, Firefox) si apasa play pe postul preferat. Poti instala si aplicatia PWA pentru acces rapid din ecranul principal, fara App Store.`,
    },
    {
      question: `Streamurile functioneaza in masina sau la drum?`,
      answer: `Da, poti asculta radioul din ${city.nameRo} oriunde ai conexiune la internet — in masina (prin Android Auto sau CarPlay), in tren, la munte sau in calatorie. Streamurile sunt disponibile 24/7 fara intreruperi.`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            stationListJsonLd(
              [...localStations, ...nationalStations].slice(0, 20),
              `Posturi radio ${city.nameRo}`,
              pageUrl,
            ),
          ),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">Acasa</Link>
          <span className="mx-2">/</span>
          <Link href="/radio-orase" className="hover:text-foreground">Radio pe orase</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Radio {city.nameRo}</span>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Radio Online din {city.nameRo}
            </h1>
            <p className="text-sm text-muted-foreground">{city.region} • {city.population.toLocaleString('ro-RO')} locuitori</p>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{city.description}</p>

        {localStations.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              Posturi de radio locale din {city.nameRo}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {localStations.length} {localStations.length === 1 ? 'post local' : 'posturi locale'} care emit din {city.nameRo}.
            </p>
            <div className="mt-6">
              <StationGrid stations={localStations} />
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            {localStations.length > 0
              ? `Alte posturi nationale disponibile in ${city.nameRo}`
              : `Toate posturile nationale disponibile in ${city.nameRo}`}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Peste {nationalStations.length} posturi de radio nationale care se pot asculta online din {city.nameRo}.
          </p>
          <div className="mt-6">
            <StationGrid stations={nationalStations} />
          </div>
        </section>

        <section className="mt-12 max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-lg font-bold text-foreground">Despre radioul din {city.nameRo}</h2>
          <p>{city.localContext}</p>
          <p>
            Toate posturile listate pe aceasta pagina pot fi ascultate live online, gratuit si
            fara cont. Streamul audio este transmis direct de catre fiecare post, asa cum este
            difuzat pe FM. Poti folosi playerul nostru pe calculator, telefon sau tableta, iar
            posturile favorite pot fi salvate pentru acces rapid.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqs} title={`Intrebari frecvente despre radioul din ${city.nameRo}`} />
        </section>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 text-lg font-bold text-foreground">Alte orase din Romania</h2>
          <div className="flex flex-wrap gap-2">
            {CITIES.filter((c) => c.slug !== city.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/radio-orase/${c.slug}`}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/5"
              >
                Radio {c.nameRo}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
