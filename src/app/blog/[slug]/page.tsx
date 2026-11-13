import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { BLOG_POSTS, getPostBySlug } from '@/lib/blog';
import { SITE_URL, SITE_NAME, GENRES } from '@/lib/constants';
import { breadcrumbJsonLd, DEFAULT_OG_IMAGE, ORG_ID } from '@/lib/seo';

export const revalidate = 86400;

// Only slugs from generateStaticParams exist; anything else is a real 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      locale: 'ro_RO',
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: SITE_NAME,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: [{ ...DEFAULT_OG_IMAGE, alt: post.title }],
    },
  };
}

function renderParagraph(text: string, key: number) {
  // Support simple **bold** markdown + line breaks
  const lines = text.split('\n');
  return (
    <p key={key} className="text-foreground/90 leading-relaxed">
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line
            .split(/(\*\*[^*]+\*\*)/)
            .map((chunk, j) =>
              chunk.startsWith('**') && chunk.endsWith('**') ? (
                <strong key={j}>{chunk.slice(2, -2)}</strong>
              ) : (
                <span key={j}>{chunk}</span>
              ),
            )}
        </span>
      ))}
    </p>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const breadcrumbs = [
    { name: 'Acasa', url: SITE_URL },
    { name: 'Blog', url: `${SITE_URL}/blog` },
    { name: post.title, url },
  ];

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: post.author, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512x512.png` },
    },
    image: DEFAULT_OG_IMAGE.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.tags.join(', '),
    inLanguage: 'ro-RO',
  };

  const related = (post.relatedSlugs || [])
    .map((s) => BLOG_POSTS.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="text-muted-foreground mb-6 text-sm" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">
            Acasa
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-foreground">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground line-clamp-1">{post.title}</span>
        </nav>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.publishedAt).toLocaleDateString('ro-RO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readingMinutes} min citire
          </span>
        </div>

        <div className="mt-8 space-y-6 text-base">
          <p className="text-foreground text-lg leading-relaxed">{post.intro}</p>

          {post.sections.map((section, si) => (
            <section key={si} className="mt-8">
              <h2 className="text-foreground mb-4 text-2xl font-bold">{section.heading}</h2>
              <div className="space-y-4">
                {section.paragraphs.map((p, i) => renderParagraph(p, i))}
              </div>
            </section>
          ))}

          <section className="border-primary/20 bg-primary/5 mt-8 rounded-xl border p-6">
            <h2 className="text-foreground mb-3 text-xl font-bold">Concluzie</h2>
            <p className="text-foreground/90 leading-relaxed">{post.conclusion}</p>
          </section>
        </div>

        {post.genreSlugs && post.genreSlugs.length > 0 && (
          <section className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-sm">Asculta acum:</span>
            {post.genreSlugs.map((g) => (
              <Link
                key={g}
                href={`/radio-genuri/${g}`}
                className="bg-primary/10 text-primary hover:bg-primary/20 rounded-md px-3 py-1 text-sm font-medium"
              >
                Radio {GENRES[g]?.nameRo ?? g} online
              </Link>
            ))}
          </section>
        )}

        {related.length > 0 && (
          <section className="border-border mt-12 border-t pt-8">
            <h2 className="text-foreground mb-4 text-xl font-bold">Articole similare</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="border-border bg-card hover:border-primary hover:bg-primary/5 rounded-lg border p-4 transition-colors"
                >
                  <h3 className="text-foreground font-semibold">{r.title}</h3>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{r.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 flex justify-between">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Toate articolele
          </Link>
          <Link href="/" className="text-primary text-sm font-medium hover:underline">
            Asculta radio acum
          </Link>
        </div>
      </article>
    </>
  );
}
