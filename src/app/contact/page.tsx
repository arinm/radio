import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from '@/lib/constants';
import { breadcrumbJsonLd, openGraphMeta, ORG_ID } from '@/lib/seo';

const CONTACT_TITLE = 'Contact';
const CONTACT_DESCRIPTION = `Contacteaza echipa ${SITE_NAME}: propune un post de radio, semnaleaza un stream care nu functioneaza sau trimite o cerere din partea unui post.`;
const CONTACT_URL = `${SITE_URL}/contact`;

export const metadata: Metadata = {
  title: CONTACT_TITLE,
  description: CONTACT_DESCRIPTION,
  alternates: { canonical: CONTACT_URL },
  openGraph: openGraphMeta({
    title: `Contact ${SITE_NAME}`,
    description: CONTACT_DESCRIPTION,
    url: CONTACT_URL,
  }),
};

const TOPICS = [
  {
    title: 'Propune un post de radio',
    text: 'Trimite numele postului, orasul si linkul catre site-ul oficial sau stream.',
  },
  {
    title: 'Stream care nu functioneaza',
    text: 'Spune-ne ce post nu porneste si de pe ce dispozitiv si browser asculti.',
  },
  {
    title: 'Esti reprezentantul unui post',
    text: 'Pentru actualizarea datelor, a logo-ului sau pentru eliminarea postului din director.',
  },
];

export default function ContactPage() {
  const breadcrumbs = [
    { name: 'Acasa', url: SITE_URL },
    { name: 'Contact', url: CONTACT_URL },
  ];

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${SITE_NAME}`,
    url: CONTACT_URL,
    description: CONTACT_DESCRIPTION,
    inLanguage: 'ro-RO',
    about: { '@id': ORG_ID },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-foreground text-3xl font-bold sm:text-4xl">Contact</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Ne poti scrie oricand pe email. Raspundem de obicei in cateva zile lucratoare.
        </p>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="border-border bg-card hover:border-primary mt-8 inline-flex items-center gap-3 rounded-xl border px-5 py-4 transition-colors"
        >
          <Mail className="text-primary h-5 w-5" />
          <span className="text-foreground font-medium">{CONTACT_EMAIL}</span>
        </a>

        <h2 className="text-foreground mt-10 text-xl font-bold">Despre ce ne poti scrie</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TOPICS.map((topic) => (
            <div key={topic.title} className="border-border bg-card rounded-lg border p-4">
              <h3 className="text-foreground font-semibold">{topic.title}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{topic.text}</p>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mt-10 text-sm">
          Vrei sa afli mai multe despre proiect? Citeste pagina{' '}
          <Link href="/despre" className="text-primary hover:underline">
            Despre {SITE_NAME}
          </Link>
          .
        </p>
      </div>
    </>
  );
}
