/**
 * Romanian cities with metadata for SEO hub pages.
 * Each city has a unique SEO-oriented description and local context.
 */

export interface CityInfo {
  slug: string;
  name: string;
  nameRo: string;
  region: string;
  population: number;
  description: string;
  localContext: string;
  dbMatchers: string[];
}

export const CITIES: CityInfo[] = [
  {
    slug: 'bucuresti',
    name: 'Bucuresti',
    nameRo: 'Bucuresti',
    region: 'Muntenia',
    population: 1_883_000,
    description:
      'Asculta posturi de radio online din Bucuresti — capitala Romaniei concentreaza majoritatea posturilor nationale: Kiss FM, Europa FM, Pro FM, Radio ZU, Magic FM, Digi FM, Rock FM si multe altele.',
    localContext:
      'Bucurestiul este centrul media al Romaniei, cu peste 40 de posturi de radio care emit din capitala, de la marile retele comerciale (Kiss FM, Europa FM, Pro FM) la posturile publice (Radio Romania Actualitati, Radio Romania Cultural) si cele de nisa (Radio Guerrilla, Chill FM, Dance FM). Frecventele FM din Bucuresti acopera intreg spectrul muzical si de stiri, cu emisii de calitate profesionala.',
    dbMatchers: ['Bucuresti', 'București'],
  },
  {
    slug: 'cluj-napoca',
    name: 'Cluj-Napoca',
    nameRo: 'Cluj-Napoca',
    region: 'Transilvania',
    population: 323_000,
    description:
      'Asculta posturi de radio online din Cluj-Napoca — centrul media al Transilvaniei cu posturi locale (Radio Cluj, Napoca FM, EBS Radio) si acces la toate retelele nationale.',
    localContext:
      'Cluj-Napoca este al doilea cel mai important centru media din Romania, cu posturi regionale puternice care transmit stiri locale, muzica populara transilvaneana si programe culturale specifice Ardealului. Pe langa posturile locale, toate retelele nationale sunt disponibile online pentru ascultatorii din Cluj.',
    dbMatchers: ['Cluj-Napoca', 'Cluj'],
  },
  {
    slug: 'timisoara',
    name: 'Timisoara',
    nameRo: 'Timisoara',
    region: 'Banat',
    population: 250_000,
    description:
      'Asculta posturi de radio online din Timisoara — capitala Banatului are Radio Timisoara (postul public regional) si acces la toate retelele nationale.',
    localContext:
      'Timisoara este un important hub media al vestului Romaniei, cu Radio Timisoara care transmite stiri locale, muzica populara banateana si emisiuni culturale specifice zonei. Toate posturile nationale comerciale sunt disponibile online pentru ascultatorii timisoreni.',
    dbMatchers: ['Timisoara', 'Timișoara'],
  },
  {
    slug: 'iasi',
    name: 'Iasi',
    nameRo: 'Iasi',
    region: 'Moldova',
    population: 271_000,
    description:
      'Asculta posturi de radio online din Iasi — capitala Moldovei ofera acces la toate posturile nationale de radio din Romania prin streaming live online.',
    localContext:
      'Iasi, cel mai mare oras din Moldova, are o traditie culturala puternica si o comunitate activa de ascultatori radio. Toate marile retele nationale (Kiss FM, Europa FM, Pro FM, Radio ZU, Magic FM) sunt disponibile online pentru iesenii care vor sa asculte radioul preferat.',
    dbMatchers: ['Iasi', 'Iași'],
  },
  {
    slug: 'constanta',
    name: 'Constanta',
    nameRo: 'Constanta',
    region: 'Dobrogea',
    population: 263_000,
    description:
      'Asculta posturi de radio online din Constanta — portul Romaniei la Marea Neagra ofera acces la toate posturile nationale de radio prin streaming online.',
    localContext:
      'Constanta, principalul oras al Dobrogei si port la Marea Neagra, beneficiaza de toate retelele nationale de radio disponibile online. Ascultatorii constanteni pot urmari Kiss FM, Europa FM, Pro FM, Radio ZU si celelalte posturi romanesti direct din browser, fara intreruperi.',
    dbMatchers: ['Constanta', 'Constanța'],
  },
  {
    slug: 'brasov',
    name: 'Brasov',
    nameRo: 'Brasov',
    region: 'Transilvania',
    population: 237_000,
    description:
      'Asculta posturi de radio online din Brasov — orasul transilvanean ofera acces la toate posturile nationale de radio prin streaming live online.',
    localContext:
      'Brasov, unul dintre cele mai importante orase turistice si industriale ale Romaniei, are acces la toate posturile nationale de radio prin streaming online. Fie ca esti in centrul istoric, pe Tampa sau in statiunile din jur, poti asculta radioul preferat direct din browser.',
    dbMatchers: ['Brasov', 'Brașov'],
  },
  {
    slug: 'craiova',
    name: 'Craiova',
    nameRo: 'Craiova',
    region: 'Oltenia',
    population: 234_000,
    description:
      'Asculta posturi de radio online din Craiova — capitala Olteniei ofera acces la toate posturile nationale de radio din Romania prin streaming online.',
    localContext:
      'Craiova, cel mai mare oras din Oltenia, beneficiaza de acces complet la retelele nationale de radio. Posturile de manele, muzica populara olteneasca si cele pop comerciale sunt disponibile non-stop pentru craiovenii care asculta online.',
    dbMatchers: ['Craiova'],
  },
  {
    slug: 'galati',
    name: 'Galati',
    nameRo: 'Galati',
    region: 'Moldova',
    population: 217_000,
    description:
      'Asculta posturi de radio online din Galati — port la Dunare si important centru industrial, cu acces la toate posturile nationale de radio.',
    localContext:
      'Galati, port la Dunare si important oras industrial din Moldova, are acces la toate retelele nationale prin streaming online. Ascultatorii galateni pot urmari posturile de radio preferate direct din browser, pe calculator sau telefon.',
    dbMatchers: ['Galati', 'Galați'],
  },
  {
    slug: 'ploiesti',
    name: 'Ploiesti',
    nameRo: 'Ploiesti',
    region: 'Muntenia',
    population: 210_000,
    description:
      'Asculta posturi de radio online din Ploiesti — capitala Prahovei ofera acces la toate posturile nationale de radio prin streaming online.',
    localContext:
      'Ploiesti, centrul industrial al Prahovei, este aproape de Bucuresti si beneficiaza de toate posturile nationale de radio. Kiss FM, Europa FM, Pro FM, Radio ZU si celelalte retele sunt disponibile online pentru ploiesteni.',
    dbMatchers: ['Ploiesti', 'Ploiești'],
  },
  {
    slug: 'oradea',
    name: 'Oradea',
    nameRo: 'Oradea',
    region: 'Crisana',
    population: 196_000,
    description:
      'Asculta posturi de radio online din Oradea — centrul Crisanei ofera acces la toate posturile nationale de radio prin streaming live.',
    localContext:
      'Oradea, aproape de granita cu Ungaria, este un oras cu traditie culturala bogata. Toate retelele nationale de radio sunt disponibile online pentru oradeni, indiferent de gen — pop, rock, manele, dance sau stiri.',
    dbMatchers: ['Oradea'],
  },
  {
    slug: 'sibiu',
    name: 'Sibiu',
    nameRo: 'Sibiu',
    region: 'Transilvania',
    population: 147_000,
    description:
      'Asculta posturi de radio online din Sibiu — orasul transilvanean cu acces la toate posturile nationale de radio prin streaming live online.',
    localContext:
      'Sibiu, oras turistic si cultural important din Transilvania, are acces complet la retelele nationale de radio. Fie ca esti in centrul istoric sau la munte, poti asculta radioul preferat online, gratuit.',
    dbMatchers: ['Sibiu'],
  },
];

export function getCityBySlug(slug: string): CityInfo | undefined {
  return CITIES.find((c) => c.slug === slug);
}
