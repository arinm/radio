import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { breadcrumbJsonLd, openGraphMeta } from '@/lib/seo';

export const revalidate = 86400;

const BLOG_TITLE = `Blog Radio - Ghiduri, Topuri si Analize | ${SITE_NAME}`;
const BLOG_DESCRIPTION =
  'Blog despre radioul romanesc: topuri cu cele mai bune posturi, ghiduri pentru ascultatori, analize si istoria radioului in Romania. Continut actualizat 2026.';

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: openGraphMeta({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    url: `${SITE_URL}/blog`,
  }),
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  const breadcrumbs = [
    { name: 'Acasa', url: SITE_URL },
    { name: 'Blog', url: `${SITE_URL}/blog` },
  ];

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `Blog ${SITE_NAME}`,
    url: `${SITE_URL}/blog`,
    description: 'Articole despre radioul romanesc, ghiduri si analize.',
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      dateModified: p.updatedAt,
      author: { '@type': 'Organization', name: p.author },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <nav className="text-muted-foreground mb-6 text-sm" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">
            Acasa
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Blog</span>
        </nav>

        <h1 className="text-foreground text-3xl font-bold sm:text-4xl">
          Blog Radio — Ghiduri, Topuri si Analize
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Articole despre radioul romanesc: cele mai bune posturi, ghiduri pentru ascultatori,
          istoria radioului si analize de gen.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border-border bg-card hover:border-primary rounded-xl border p-6 transition-colors"
            >
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-foreground mt-3 text-xl font-bold">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                  {post.title}
                </Link>
              </h2>
              <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">{post.description}</p>

              <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString('ro-RO', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingMinutes} min citire
                </span>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              >
                Citeste articolul
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
