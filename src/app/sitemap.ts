import type { MetadataRoute } from 'next';
import { getStationSitemapEntries, getGenresWithCounts } from '@/lib/stations';
import { CITIES } from '@/lib/cities';
import { BLOG_POSTS } from '@/lib/blog';
import { SITE_URL, CONTENT_LAST_UPDATED } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stations, genres] = await Promise.all([getStationSitemapEntries(), getGenresWithCounts()]);

  // Stable content date for config-driven pages (genres/cities/static), so we
  // never stamp the crawl date on every URL — Google discounts `lastmod` that
  // always equals "now". Stations use their real per-record `updatedAt`.
  const contentDate = new Date(CONTENT_LAST_UPDATED);
  // Newest station change = a meaningful lastmod for the listing/home pages.
  const newestStationUpdate = stations.reduce<Date>(
    (latest, s) => (s.updatedAt > latest ? s.updatedAt : latest),
    contentDate,
  );

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: newestStationUpdate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/cauta-radio-romania`,
      lastModified: newestStationUpdate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/radio-genuri`,
      lastModified: contentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/radio-orase`,
      lastModified: contentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: contentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/instaleaza`,
      lastModified: contentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const stationPages: MetadataRoute.Sitemap = stations.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/radio/${slug}-online`,
    lastModified: updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const genrePages: MetadataRoute.Sitemap = genres.map((genre) => ({
    url: `${SITE_URL}/radio-genuri/${genre.slug}`,
    lastModified: contentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const cityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${SITE_URL}/radio-orase/${city.slug}`,
    lastModified: contentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...stationPages, ...genrePages, ...cityPages, ...blogPages];
}
