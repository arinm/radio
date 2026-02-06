import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Smartphone,
  Monitor,
  Share,
  MoreVertical,
  PlusSquare,
  Download,
  Zap,
  WifiOff,
  Radio,
} from 'lucide-react';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Instaleaza Aplicatia | ${SITE_NAME}`,
  description:
    'Instaleaza Radio Online Romania pe telefon sau calculator. Acces rapid la toate posturile de radio, fara App Store, direct din browser.',
  alternates: { canonical: `${SITE_URL}/instaleaza` },
};

function StepCard({
  step,
  icon: Icon,
  title,
  description,
}: {
  step: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {step}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function InstaleazaPage() {
  const breadcrumbs = [
    { name: 'Acasa', url: SITE_URL },
    { name: 'Instaleaza aplicatia', url: `${SITE_URL}/instaleaza` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)),
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Acasa
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-foreground">Instaleaza aplicatia</li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Download className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            Instaleaza <span className="font-extrabold">radio</span><span className="font-normal">vibe</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
            Adauga aplicatia pe ecranul principal al telefonului sau
            calculatorului. Fara App Store, fara descarcare — direct din browser.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 text-center">
            <Zap className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 font-semibold text-foreground">Acces rapid</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Deschide aplicatia cu un singur tap, direct de pe ecranul
              principal.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 text-center">
            <WifiOff className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 font-semibold text-foreground">
              Functioneaza offline
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Pagina principala se incarca chiar si fara internet. Streamul
              radio necesita conexiune.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 text-center">
            <Radio className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 font-semibold text-foreground">
              Experienta nativa
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Aplicatia se deschide pe tot ecranul, fara bara de adresa a
              browserului.
            </p>
          </div>
        </div>

        {/* Install Instructions */}
        <div className="mt-16 space-y-12">
          {/* iOS */}
          <section>
            <div className="flex items-center gap-3">
              <Smartphone className="h-6 w-6 text-foreground" />
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                iPhone / iPad (Safari)
              </h2>
            </div>
            <div className="mt-6 space-y-6 rounded-xl border border-border bg-card p-6">
              <StepCard
                step={1}
                icon={Share}
                title="Apasa butonul Share"
                description="Deschide acest site in Safari, apoi apasa iconita de partajare (patrat cu sageata in sus) din bara de jos."
              />
              <StepCard
                step={2}
                icon={PlusSquare}
                title='Selecteaza "Adauga pe ecranul principal"'
                description='Deruleaza in jos in meniul care apare si apasa pe "Adauga pe ecranul principal" (Add to Home Screen).'
              />
              <StepCard
                step={3}
                icon={Download}
                title='Confirma cu "Adauga"'
                description='Apasa "Adauga" in coltul din dreapta sus. Aplicatia va aparea pe ecranul principal, ca orice alta aplicatie.'
              />
            </div>
          </section>

          {/* Android */}
          <section>
            <div className="flex items-center gap-3">
              <Smartphone className="h-6 w-6 text-foreground" />
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Android (Chrome)
              </h2>
            </div>
            <div className="mt-6 space-y-6 rounded-xl border border-border bg-card p-6">
              <StepCard
                step={1}
                icon={MoreVertical}
                title="Apasa meniul cu 3 puncte"
                description="Deschide acest site in Chrome, apoi apasa pe cele 3 puncte verticale din coltul din dreapta sus."
              />
              <StepCard
                step={2}
                icon={Download}
                title='Selecteaza "Instaleaza aplicatia"'
                description='Apasa pe "Instaleaza aplicatia" sau "Adauga pe ecranul principal" din meniul care apare.'
              />
              <StepCard
                step={3}
                icon={PlusSquare}
                title='Confirma cu "Instaleaza"'
                description='Apasa "Instaleaza" in dialogul de confirmare. Aplicatia va aparea pe ecranul principal si in lista de aplicatii.'
              />
            </div>
          </section>

          {/* Desktop */}
          <section>
            <div className="flex items-center gap-3">
              <Monitor className="h-6 w-6 text-foreground" />
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Desktop (Chrome / Edge)
              </h2>
            </div>
            <div className="mt-6 space-y-6 rounded-xl border border-border bg-card p-6">
              <StepCard
                step={1}
                icon={Download}
                title="Cauta iconita de instalare"
                description="Deschide acest site in Chrome sau Edge. In bara de adresa (dreapta) va aparea o iconita de instalare."
              />
              <StepCard
                step={2}
                icon={PlusSquare}
                title='Apasa "Instaleaza"'
                description='Apasa pe iconita si apoi pe "Instaleaza" in dialogul care apare. Aplicatia se va deschide intr-o fereastra separata.'
              />
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="text-xl font-bold text-foreground">Gata de ascultat?</h2>
          <p className="mt-2 text-muted-foreground">
            Dupa instalare, deschide aplicatia si incepe sa asculti postul tau
            preferat.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Radio className="h-4 w-4" />
            Asculta radio acum
          </Link>
        </div>
      </div>
    </>
  );
}
