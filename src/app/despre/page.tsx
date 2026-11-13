import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from '@/lib/constants';
import { breadcrumbJsonLd, openGraphMeta, ORG_ID } from '@/lib/seo';

const ABOUT_TITLE = 'Despre noi';
const ABOUT_DESCRIPTION = `Ce este ${SITE_NAME}, cum alegem posturile de radio romanesti din director si cum ne poti contacta.`;
const ABOUT_URL = `${SITE_URL}/despre`;

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: ABOUT_URL },
  openGraph: openGraphMeta({
    title: `Despre ${SITE_NAME}`,
    description: ABOUT_DESCRIPTION,
    url: ABOUT_URL,
  }),
};

export default function AboutPage() {
  const breadcrumbs = [
    { name: 'Acasa', url: SITE_URL },
    { name: 'Despre', url: ABOUT_URL },
  ];

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `Despre ${SITE_NAME}`,
    url: ABOUT_URL,
    description: ABOUT_DESCRIPTION,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-foreground text-3xl font-bold sm:text-4xl">Despre {SITE_NAME}</h1>

        <div className="text-foreground/90 mt-8 space-y-4 leading-relaxed">
          <p>
            {SITE_NAME} este un director gratuit de radio online din Romania. Aduna intr-un singur
            loc peste 60 de posturi romanesti, de la radiourile nationale la cele locale, pe care le
            poti asculta live direct din browser, fara cont si fara aplicatie.
          </p>

          <h2 className="text-foreground pt-4 text-xl font-bold">Ce facem si ce nu facem</h2>
          <p>
            Nu detinem si nu operam niciun post de radio. Redam streamurile publice pe care fiecare
            post le pune la dispozitie, asa cum sunt transmise, si nu adaugam reclame proprii.
            Drepturile asupra continutului audio apartin posturilor de radio. Detalii in{' '}
            <Link href="/disclaimer" className="text-primary hover:underline">
              disclaimer
            </Link>
            .
          </p>

          <h2 className="text-foreground pt-4 text-xl font-bold">Cum alegem posturile</h2>
          <p>
            Pornim de la directoare publice de streamuri radio si de la site-urile oficiale ale
            posturilor. Pastram doar posturile romanesti cu stream functional si le grupam pe{' '}
            <Link href="/radio-genuri" className="text-primary hover:underline">
              genuri muzicale
            </Link>{' '}
            si pe{' '}
            <Link href="/radio-orase" className="text-primary hover:underline">
              orase
            </Link>
            . Ordinea din liste reflecta popularitatea posturilor.
          </p>

          <h2 className="text-foreground pt-4 text-xl font-bold">Ghiduri si articole</h2>
          <p>
            Pe{' '}
            <Link href="/blog" className="text-primary hover:underline">
              blog
            </Link>{' '}
            publicam ghiduri si topuri despre radioul romanesc, scrise de echipa {SITE_NAME}.
          </p>

          <h2 className="text-foreground pt-4 text-xl font-bold">Contact</h2>
          <p>
            Lipseste un post, nu merge un stream sau reprezinti un post de radio? Scrie-ne la{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
              {CONTACT_EMAIL}
            </a>{' '}
            sau vezi pagina de{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
