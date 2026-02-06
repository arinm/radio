/**
 * Station data access layer.
 * Abstracts database queries with caching for performance.
 */

import { Prisma } from '@prisma/client';
import { prisma } from './db';
import { cached } from './cache';
import { CACHE_TTL, DEFAULT_PAGE_SIZE, GENRES } from './constants';
import { parseGenres, parseSocialLinks } from './utils';
import type { Station, Genre, StationFilters, SearchResult } from '@/types';

/**
 * Transform a Prisma station record into our Station type.
 */
function transformStation(record: {
  id: string;
  name: string;
  slug: string;
  streamUrl: string;
  streamUrlBackup: string | null;
  homepage: string | null;
  description: string | null;
  genres: string;
  city: string | null;
  region: string | null;
  language: string;
  logoUrl: string | null;
  brandColor: string | null;
  bitrate: number | null;
  codec: string | null;
  frequency: string | null;
  isActive: boolean;
  isFeatured: boolean;
  listenScore: number;
  lastCheckedAt: Date | null;
  status: string;
  socialLinks: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Station {
  return {
    ...record,
    genres: parseGenres(record.genres),
    socialLinks: parseSocialLinks(record.socialLinks),
    status: record.status as Station['status'],
  };
}

/**
 * Get all active stations, cached.
 */
export async function getStations(
  filters?: StationFilters,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<SearchResult> {
  const where: Prisma.StationWhereInput = { isActive: true };

  if (filters?.genre) {
    where.genres = { contains: `"${filters.genre}"` };
  }
  if (filters?.city) {
    where.city = filters.city;
  }
  if (filters?.region) {
    where.region = filters.region;
  }
  if (filters?.isFeatured !== undefined) {
    where.isFeatured = filters.isFeatured;
  }

  const [stations, total] = await Promise.all([
    prisma.station.findMany({
      where,
      orderBy: { listenScore: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.station.count({ where }),
  ]);

  return {
    stations: stations.map(transformStation),
    total,
    page,
    pageSize,
  };
}

/**
 * Get featured/top stations, cached aggressively.
 */
export async function getFeaturedStations(): Promise<Station[]> {
  return cached('featured-stations', CACHE_TTL.STATION_LIST, async () => {
    const records = await prisma.station.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { listenScore: 'desc' },
      take: 12,
    });
    return records.map(transformStation);
  });
}

/**
 * Get a single station by slug.
 */
export async function getStationBySlug(slug: string): Promise<Station | null> {
  return cached(`station:${slug}`, CACHE_TTL.STATION_PAGE, async () => {
    const record = await prisma.station.findUnique({
      where: { slug },
    });
    if (!record) return null;
    return transformStation(record);
  });
}

/**
 * Search stations by name, genre, or city.
 * Uses raw SQL with PostgreSQL ILIKE for case-insensitive search.
 */
export async function searchStations(
  query: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<SearchResult> {
  const searchTerm = `%${query}%`;
  const offset = (page - 1) * pageSize;

  // Use raw query for PostgreSQL case-insensitive search with ILIKE
  const stations = await prisma.$queryRaw<Array<{
    id: string;
    name: string;
    slug: string;
    streamUrl: string;
    streamUrlBackup: string | null;
    homepage: string | null;
    description: string | null;
    genres: string;
    city: string | null;
    region: string | null;
    language: string;
    logoUrl: string | null;
    brandColor: string | null;
    bitrate: number | null;
    codec: string | null;
    frequency: string | null;
    isActive: boolean;
    isFeatured: boolean;
    listenScore: number;
    lastCheckedAt: Date | null;
    status: string;
    socialLinks: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>>`
    SELECT * FROM "Station"
    WHERE "isActive" = true
    AND (
      name ILIKE ${searchTerm}
      OR description ILIKE ${searchTerm}
      OR city ILIKE ${searchTerm}
      OR genres ILIKE ${searchTerm}
    )
    ORDER BY "listenScore" DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  const countResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count FROM "Station"
    WHERE "isActive" = true
    AND (
      name ILIKE ${searchTerm}
      OR description ILIKE ${searchTerm}
      OR city ILIKE ${searchTerm}
      OR genres ILIKE ${searchTerm}
    )
  `;

  const total = Number(countResult[0]?.count || 0);

  return {
    stations: stations.map(transformStation),
    total,
    page,
    pageSize,
  };
}

/**
 * Get stations similar to a given station (by genre overlap).
 */
export async function getSimilarStations(
  station: Station,
  limit = 6,
): Promise<Station[]> {
  if (station.genres.length === 0) {
    // Fallback: return popular stations
    const records = await prisma.station.findMany({
      where: { isActive: true, slug: { not: station.slug } },
      orderBy: { listenScore: 'desc' },
      take: limit,
    });
    return records.map(transformStation);
  }

  // Find stations sharing at least one genre
  const genreConditions = station.genres.map((genre) => ({
    genres: { contains: `"${genre}"` },
  }));

  const records = await prisma.station.findMany({
    where: {
      isActive: true,
      slug: { not: station.slug },
      OR: genreConditions,
    },
    orderBy: { listenScore: 'desc' },
    take: limit,
  });

  return records.map(transformStation);
}

/**
 * Get all genres with station counts.
 */
export async function getGenresWithCounts(): Promise<Genre[]> {
  return cached('genres-with-counts', CACHE_TTL.GENRE_LIST, async () => {
    const allStations = await prisma.station.findMany({
      where: { isActive: true },
      select: { genres: true },
    });

    const genreCounts = new Map<string, number>();
    for (const station of allStations) {
      const genres = parseGenres(station.genres);
      for (const genre of genres) {
        genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
      }
    }

    return Object.entries(GENRES)
      .map(([slug, info]) => ({
        slug,
        name: info.name,
        nameRo: info.nameRo,
        description: info.description,
        stationCount: genreCounts.get(slug) || 0,
      }))
      .filter((g) => g.stationCount > 0)
      .sort((a, b) => b.stationCount - a.stationCount);
  });
}

/**
 * Get all station slugs (for sitemap generation).
 */
export async function getAllStationSlugs(): Promise<string[]> {
  return cached('all-station-slugs', CACHE_TTL.SITEMAP, async () => {
    const records = await prisma.station.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return records.map((r) => r.slug);
  });
}

/**
 * Get all active stations ordered by popularity.
 */
export async function getAllActiveStations(): Promise<Station[]> {
  return cached('all-active-stations', CACHE_TTL.STATION_LIST, async () => {
    const records = await prisma.station.findMany({
      where: { isActive: true },
      orderBy: { listenScore: 'desc' },
    });
    return records.map(transformStation);
  });
}

/**
 * Get total count of active stations.
 */
export async function getStationCount(): Promise<number> {
  return cached('station-count', CACHE_TTL.STATION_LIST, async () => {
    return prisma.station.count({ where: { isActive: true } });
  });
}
