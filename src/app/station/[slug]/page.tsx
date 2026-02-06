import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Globe,
  MapPin,
  Signal,
  Share2,
  ExternalLink,
  Radio,
} from 'lucide-react';
import { getStationBySlug, getSimilarStations, getAllStationSlugs } from '@/lib/stations';
import { StationGrid } from '@/components/StationGrid';
import { FAQSection } from '@/components/FAQSection';
import { StationPlayButton } from './StationPlayButton';
import {
  stationTitle,
  stationDescription,
  stationCanonical,
  stationJsonLd,
  breadcrumbJsonLd,
  openGraphMeta,
  faqJsonLd,
  generateStationFAQs,
} from '@/lib/seo';
import { SITE_URL, GENRES } from '@/lib/constants';
import { sanitizeUrl } from '@/lib/url-sanitizer';

export const revalidate = 3600;

interface StationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllStationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: StationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const station = await getStationBySlug(slug);
  if (!station) return { title: 'Post de radio negasit' };

  const title = stationTitle(station);
  const description = stationDescription(station);
  const canonical = stationCanonical(slug);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: openGraphMeta({ title, description, url: canonical, image: station.logoUrl || undefined }),
    twitter: { card: 'summary', title, description },
  };
}

export default async function StationPage({ params }: StationPageProps) {
  const { slug } = await params;
  const station = await getStationBySlug(slug);
  if (!station) notFound();

  const similarStations = await getSimilarStations(station);

  const breadcrumbs = [
    { name: 'Acasa', url: SITE_URL },
    { name: 'Posturi radio', url: `${SITE_URL}/browse` },
    { name: station.name, url: stationCanonical(station.slug) },
  ];

  const homepage = sanitizeUrl(station.homepage);

  // Brand color for dynamic theming (fallback to primary-like blue)
  const bc = station.brandColor || '#6366f1';

  const stationFaqs = generateStationFAQs(station);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stationJsonLd(station)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(stationFaqs)) }}
      />

      {/* Hero Section with Decorative Background */}
      <section className="relative overflow-hidden">
        {/* Gradient Background — uses station brand color */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${bc}22 0%, ${bc}0a 40%, transparent 70%)`,
          }}
        />

        {/* Decorative Blobs in station brand colors */}
        <div
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${bc}1a` }}
        />
        <div
          className="absolute -right-20 top-10 h-60 w-60 rounded-full blur-3xl"
          style={{ backgroundColor: `${bc}15` }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full blur-3xl"
          style={{ backgroundColor: `${bc}12` }}
        />

        {/* Dot Pattern — tinted with brand color */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${bc}40 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Large Faded Logo in Background */}
        {station.logoUrl && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.07] pointer-events-none select-none">
            <Image
              src={station.logoUrl}
              alt=""
              width={400}
              height={400}
              className="h-[400px] w-[400px] object-contain blur-sm"
              unoptimized
              aria-hidden="true"
            />
          </div>
        )}

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">Acasa</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/browse" className="hover:text-foreground transition-colors">Posturi radio</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="truncate font-medium text-foreground">{station.name}</li>
            </ol>
          </nav>

          {/* Station Header */}
          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Logo + Info */}
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start lg:flex-1">
              {/* Station Logo */}
              <div className="relative">
                <div
                  className="absolute -inset-2 rounded-2xl blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${bc}33, ${bc}1a)`,
                  }}
                />
                <div
                  className="relative flex h-32 w-32 items-center justify-center rounded-2xl border bg-card/80 shadow-2xl backdrop-blur-sm sm:h-40 sm:w-40"
                  style={{ borderColor: `${bc}30` }}
                >
                  {station.logoUrl ? (
                    <Image
                      src={station.logoUrl}
                      alt={`${station.name} logo`}
                      width={140}
                      height={140}
                      className="h-28 w-28 object-contain p-2 sm:h-36 sm:w-36"
                      unoptimized
                      priority
                    />
                  ) : (
                    <Radio className="h-16 w-16 sm:h-20 sm:w-20" style={{ color: bc }} />
                  )}
                </div>
              </div>

              {/* Station Info */}
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                  Asculta {station.name} <span className="text-primary">Live Online</span>
                </h1>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground sm:justify-start">
                  {station.city && (
                    <span className="flex items-center gap-1.5 rounded-full bg-card/50 px-3 py-1 backdrop-blur-sm">
                      <MapPin className="h-4 w-4" style={{ color: bc }} />
                      {station.city}{station.region ? `, ${station.region}` : ''}
                    </span>
                  )}
                  {station.frequency && (
                    <span className="flex items-center gap-1.5 rounded-full bg-card/50 px-3 py-1 backdrop-blur-sm">
                      <Signal className="h-4 w-4" style={{ color: bc }} />
                      {station.frequency}
                    </span>
                  )}
                  {station.codec && station.bitrate && (
                    <span className="rounded-full bg-card/50 px-3 py-1 backdrop-blur-sm">
                      {station.codec.toUpperCase()} {station.bitrate}kbps
                    </span>
                  )}
                </div>

                {/* Genres */}
                {station.genres.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {station.genres.map((genre) => {
                      const genreInfo = GENRES[genre];
                      return (
                        <Link
                          key={genre}
                          href={`/genre/${genre}`}
                          className="rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:scale-105"
                          style={{
                            backgroundColor: `${bc}18`,
                            color: bc,
                          }}
                        >
                          {genreInfo?.nameRo || genre}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Description */}
                {station.description && (
                  <p className="mt-4 max-w-2xl text-base text-muted-foreground">
                    {station.description}
                  </p>
                )}

                {/* Links */}
                <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                  {homepage && (
                    <a
                      href={homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-card/50 px-4 py-2.5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:bg-card hover:text-foreground hover:shadow-lg"
                    >
                      <Globe className="h-4 w-4" />
                      Website oficial
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <button
                    className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-card/50 px-4 py-2.5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:bg-card hover:text-foreground hover:shadow-lg"
                    aria-label="Distribuie"
                  >
                    <Share2 className="h-4 w-4" />
                    Distribuie
                  </button>
                </div>
              </div>
            </div>

            {/* Play Card with Glassmorphism */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div
                  className="absolute -inset-1 rounded-2xl blur-lg opacity-50"
                  style={{
                    background: `linear-gradient(135deg, ${bc}4d, ${bc}26)`,
                  }}
                />
                <div className="relative">
                  <StationPlayButton station={station} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <FAQSection
          faqs={stationFaqs}
          title={`Intrebari frecvente despre ${station.name}`}
        />
      </section>

      {/* Similar Stations */}
      {similarStations.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <h2 className="text-2xl font-bold text-foreground">Posturi similare</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          <StationGrid stations={similarStations} />
        </section>
      )}
    </>
  );
}
