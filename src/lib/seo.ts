import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, GENRES } from './constants';
import type { Station, Genre, FAQItem } from '@/types';

/**
 * SEO utilities — generates metadata, JSON-LD structured data,
 * and Open Graph tags for all page types.
 */

// Title patterns
export function stationTitle(station: Station): string {
  return `${station.name} - Asculta Live Online | ${SITE_NAME}`;
}

export function genreTitle(genre: Genre): string {
  return `Radio ${genre.nameRo} Online - Posturi de Radio ${genre.nameRo} | ${SITE_NAME}`;
}

export function homeTitle(): string {
  return `${SITE_NAME} - Asculta Radio Live din Romania`;
}

export function browseTitle(): string {
  return `Toate Posturile de Radio Online din Romania | ${SITE_NAME}`;
}

// Description patterns
export function stationDescription(station: Station): string {
  const genres = station.genres.length > 0 ? ` - ${station.genres.join(', ')}` : '';
  const city = station.city ? ` din ${station.city}` : '';
  return `Asculta ${station.name}${city} live online, gratuit si fara reclame${genres}. Apasa play si bucura-te de muzica preferata, non-stop, 24/7.`.slice(
    0,
    160,
  );
}

export function genreDescription(genre: Genre): string {
  return `Asculta cele mai bune posturi de radio ${genre.nameRo.toLowerCase()} online din Romania. ${genre.description}`.slice(
    0,
    160,
  );
}

// Canonical URLs
export function stationCanonical(slug: string): string {
  return `${SITE_URL}/radio/${slug}-online`;
}

export function genreCanonical(slug: string): string {
  return `${SITE_URL}/radio-genuri/${slug}`;
}

// JSON-LD Structured Data

/**
 * RadioStation JSON-LD for a station page.
 * Uses schema.org/RadioStation with BroadcastService.
 */
export function stationJsonLd(station: Station) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RadioStation',
    name: station.name,
    url: stationCanonical(station.slug),
    description: station.description || `Asculta ${station.name} live online`,
    ...(station.logoUrl && {
      logo: station.logoUrl,
      image: station.logoUrl,
    }),
    ...(station.homepage && { sameAs: station.homepage }),
    ...(station.city && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: station.city,
        ...(station.region && { addressRegion: station.region }),
        addressCountry: 'RO',
      },
    }),
    ...(station.frequency && {
      broadcastFrequency: {
        '@type': 'BroadcastFrequencySpecification',
        broadcastFrequencyValue: station.frequency,
      },
    }),
    broadcaster: {
      '@type': 'Organization',
      name: station.name,
    },
    inLanguage: station.language === 'ro' ? 'ro-RO' : station.language,
  };
}

/**
 * WebSite JSON-LD for the home page.
 */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'ro-RO',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/cauta?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * BreadcrumbList JSON-LD.
 */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * ItemList JSON-LD for genre/browse pages with station listings.
 */
export function stationListJsonLd(stations: Station[], listName: string, listUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: listUrl,
    numberOfItems: stations.length,
    itemListElement: stations.slice(0, 20).map((station, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: stationCanonical(station.slug),
      name: station.name,
    })),
  };
}

/**
 * Generate OpenGraph metadata object for Next.js metadata API.
 */
export function openGraphMeta({
  title,
  description,
  url,
  image,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
}) {
  return {
    title,
    description,
    url,
    siteName: SITE_NAME,
    locale: 'ro_RO',
    type: 'website' as const,
    ...(image && { images: [{ url: image, width: 1200, height: 630, alt: title }] }),
  };
}

// FAQ JSON-LD and content generators

/**
 * FAQPage JSON-LD structured data.
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
export function faqJsonLd(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate FAQ content for the homepage.
 */
export function generateHomeFAQs(stationCount: number): FAQItem[] {
  return [
    {
      question: 'Ce este Radio Online Romania?',
      answer: `Radio Online Romania este o platforma gratuita unde poti asculta ${stationCount} posturi de radio romanesti live, direct din browser. Oferim muzica, stiri, sport si divertisment non-stop.`,
    },
    {
      question: 'Este gratuit sa ascult radio online?',
      answer: 'Da, toate posturile de radio sunt 100% gratuite. Nu este necesara crearea unui cont sau instalarea unei aplicatii. Trebuie doar sa apesi butonul de play.',
    },
    {
      question: 'Pot asculta radio online pe telefon?',
      answer: 'Da, platforma noastra functioneaza pe orice dispozitiv cu browser web — telefon, tableta sau calculator. Nu ai nevoie de o aplicatie separata.',
    },
    {
      question: 'Ce genuri de radio sunt disponibile?',
      answer: 'Avem posturi de radio din toate genurile: pop, rock, manele, muzica populara, dance, hip-hop, jazz, muzica clasica, stiri, sport si multe altele.',
    },
    {
      question: 'Cum caut un post de radio anume?',
      answer: 'Foloseste bara de cautare din partea de sus a paginii. Poti cauta dupa numele postului, oras sau gen muzical.',
    },
    {
      question: 'Pot salva posturile de radio favorite?',
      answer: 'Da, apasa iconita de inima de pe orice post de radio pentru a-l adauga la favorite. Lista ta de favorite este salvata local in browser.',
    },
    {
      question: 'Platforma adauga reclame la streamurile radio?',
      answer: 'Nu, platforma noastra nu adauga reclame proprii. Streamurile audio sunt cele originale ale fiecarui post de radio, asa cum sunt transmise de catre acestea.',
    },
  ];
}

/**
 * Generate FAQ content for a station page, dynamically from station data.
 */
export function generateStationFAQs(station: Station): FAQItem[] {
  const faqs: FAQItem[] = [];

  faqs.push({
    question: `Cum pot asculta ${station.name} online?`,
    answer: `Poti asculta ${station.name} live online direct pe aceasta pagina. Apasa butonul de play si streamul va incepe imediat. Nu este necesara instalarea niciunei aplicatii.`,
  });

  if (station.frequency) {
    faqs.push({
      question: `Pe ce frecventa emite ${station.name}?`,
      answer: `${station.name} emite pe frecventa ${station.frequency}${station.city ? ` in zona ${station.city}` : ''}. Alternativ, poti asculta live online pe platforma noastra de oriunde ai conexiune la internet.`,
    });
  }

  if (station.genres.length > 0) {
    const genreNames = station.genres
      .map((g) => GENRES[g]?.nameRo || g)
      .join(', ');
    faqs.push({
      question: `Ce gen de muzica are ${station.name}?`,
      answer: `${station.name} transmite muzica din genurile: ${genreNames}. Poti descoperi si alte posturi similare in sectiunea de posturi similare de pe aceasta pagina.`,
    });
  }

  faqs.push({
    question: `Este gratuit sa ascult ${station.name}?`,
    answer: `Da, poti asculta ${station.name} complet gratuit pe platforma noastra. Nu este nevoie de cont sau abonament.`,
  });

  faqs.push({
    question: `Pot asculta ${station.name} pe telefon?`,
    answer: `Da, ${station.name} poate fi ascultat pe orice dispozitiv — telefon, tableta sau calculator. Deschide aceasta pagina in browserul tau si apasa play.`,
  });

  if (station.city) {
    faqs.push({
      question: `Din ce oras emite ${station.name}?`,
      answer: `${station.name} emite din ${station.city}${station.region && station.region !== station.city ? `, ${station.region}` : ''}, Romania. Poti asculta streamul live de oriunde ai conexiune la internet.`,
    });
  }

  return faqs;
}

/**
 * Generate FAQ content for a genre page.
 */
export function generateGenreFAQs(genre: Genre): FAQItem[] {
  const genreLower = genre.nameRo.toLowerCase();
  return [
    {
      question: `Ce posturi de radio ${genreLower} sunt disponibile?`,
      answer: `Avem ${genre.stationCount} posturi de radio ${genreLower} online. ${genre.description} Alege oricare din lista si incepe sa asculti gratuit.`,
    },
    {
      question: `Cum ascult radio ${genreLower} online?`,
      answer: `Alege un post de radio din lista de mai sus si apasa butonul de play. Streamul va incepe imediat, direct in browser, fara sa fie necesara instalarea unei aplicatii.`,
    },
    {
      question: `Este gratuit sa ascult radio ${genreLower}?`,
      answer: `Da, toate posturile de radio ${genreLower} sunt gratuite. Poti asculta non-stop, 24/7, fara cont sau abonament.`,
    },
    {
      question: `Pot asculta radio ${genreLower} pe telefon?`,
      answer: `Da, toate posturile functioneaza pe orice dispozitiv cu browser web — inclusiv telefon si tableta. Nu ai nevoie de aplicatie separata.`,
    },
    {
      question: `Care sunt cele mai populare posturi de radio ${genreLower}?`,
      answer: `Posturile sunt ordonate dupa popularitate. Cele din partea de sus a listei sunt cele mai ascultate posturi de radio ${genreLower} din Romania.`,
    },
  ];
}
