export const SITE_NAME = 'Radio Online Romania';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://radiovibe.ro';
export const SITE_DESCRIPTION =
  'Asculta radio online din Romania. Peste 100 de posturi de radio romanesti live, muzica, stiri, sport si divertisment.';

export const DEFAULT_LOCALE = 'ro';
export const DEFAULT_LANGUAGE = 'ro-RO';

// Pagination
export const DEFAULT_PAGE_SIZE = 24;
export const MAX_PAGE_SIZE = 100;

// Player
export const DEFAULT_VOLUME = 0.8;
export const VOLUME_STEP = 0.1;

// Search
export const SEARCH_DEBOUNCE_MS = 300;
export const SEARCH_MIN_CHARS = 2;
export const SEARCH_MAX_RESULTS = 10;

// Cache TTLs (seconds)
export const CACHE_TTL = {
  STATION_LIST: 300, // 5 minutes
  STATION_PAGE: 3600, // 1 hour
  GENRE_LIST: 3600, // 1 hour
  SEARCH: 60, // 1 minute
  SITEMAP: 86400, // 24 hours
  HEALTH_CHECK: 300, // 5 minutes
} as const;

// Rate limiting
export const RATE_LIMIT = {
  SEARCH: { max: 30, windowMs: 60_000 },
  API: { max: 60, windowMs: 60_000 },
  HEALTH: { max: 10, windowMs: 60_000 },
} as const;

// Genres with Romanian translations
export const GENRES: Record<string, { name: string; nameRo: string; description: string }> = {
  pop: {
    name: 'Pop',
    nameRo: 'Pop',
    description: 'Posturi de radio cu muzica pop romaneasca si internationala',
  },
  rock: {
    name: 'Rock',
    nameRo: 'Rock',
    description: 'Radio rock - rock clasic, alternativ, indie si metal',
  },
  manele: {
    name: 'Manele',
    nameRo: 'Manele',
    description: 'Cele mai bune posturi de radio cu manele',
  },
  'muzica-populara': {
    name: 'Folk',
    nameRo: 'Muzica Populara',
    description: 'Radio cu muzica populara romaneasca si folclor',
  },
  dance: {
    name: 'Dance',
    nameRo: 'Dance / Electronica',
    description: 'Muzica dance, house, techno si electronica',
  },
  'hip-hop': {
    name: 'Hip Hop',
    nameRo: 'Hip Hop / Rap',
    description: 'Radio hip hop si rap romanesc si international',
  },
  jazz: {
    name: 'Jazz',
    nameRo: 'Jazz & Blues',
    description: 'Muzica jazz, blues si soul',
  },
  clasica: {
    name: 'Classical',
    nameRo: 'Muzica Clasica',
    description: 'Muzica clasica si opera',
  },
  stiri: {
    name: 'News',
    nameRo: 'Stiri',
    description: 'Posturi de radio cu stiri si informatii',
  },
  sport: {
    name: 'Sports',
    nameRo: 'Sport',
    description: 'Radio sport - comentarii live si dezbateri sportive',
  },
  religioas: {
    name: 'Religious',
    nameRo: 'Religios',
    description: 'Posturi de radio cu muzica si emisiuni religioase',
  },
  relaxare: {
    name: 'Chill',
    nameRo: 'Relaxare',
    description: 'Muzica de relaxare, ambient si lounge',
  },
  retro: {
    name: 'Retro',
    nameRo: 'Retro / Oldies',
    description: 'Muzica retro, oldies si hituri din anii 70, 80, 90',
  },
  'pentru-copii': {
    name: 'Kids',
    nameRo: 'Pentru Copii',
    description: 'Radio pentru copii - muzica si povesti',
  },
};

// Romanian regions
export const REGIONS = [
  'Bucuresti',
  'Transilvania',
  'Moldova',
  'Muntenia',
  'Oltenia',
  'Banat',
  'Crisana',
  'Maramures',
  'Dobrogea',
] as const;

// Consent
export const CONSENT_VERSION = '1.0';
export const CONSENT_COOKIE_NAME = 'radio_consent';
export const CONSENT_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds
