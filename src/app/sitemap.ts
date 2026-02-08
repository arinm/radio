import type { MetadataRoute } from 'next';
import { getAllStationSlugs, getGenresWithCounts } from '@/lib/stations';
import { SITE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stationSlugs, genres] = await Promise.all([
    getAllStationSlugs(),
    getGenresWithCounts(),
  ]);

  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/cauta-radio-romania`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/radio-genuri`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/radio-favorite`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/instaleaza`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/politica-confidentialitate`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/politica-cookies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/termeni-conditii`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/disclaimer`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Station pages — high priority for SEO
  const stationPages: MetadataRoute.Sitemap = stationSlugs.map((slug) => ({
    url: `${SITE_URL}/radio/${slug}-online`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Genre pages
  const genrePages: MetadataRoute.Sitemap = genres.map((genre) => ({
    url: `${SITE_URL}/radio-genuri/${genre.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...stationPages, ...genrePages];
}
