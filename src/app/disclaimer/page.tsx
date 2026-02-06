import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: `Disclaimer - declinarea responsabilitatii pentru ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/disclaimer` },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">Disclaimer</h1>
      <p className="mt-2 text-sm text-muted-foreground">Ultima actualizare: Februarie 2026</p>

      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <h2>1. Informatii Generale</h2>
        <p>
          Informatiile prezentate pe {SITE_NAME} ({SITE_URL}) au caracter informativ si sunt
          furnizate &ldquo;asa cum sunt&rdquo;, fara niciun fel de garantie, explicita sau implicita.
        </p>

        <h2>2. Continutul Audio</h2>
        <p>
          <strong>{SITE_NAME} nu detine, nu opereaza si nu controleaza niciun post de radio
          sau stream audio.</strong> Suntem un serviciu de directorizare care faciliteaza accesul
          la streamuri publice ale posturilor de radio din Romania.
        </p>
        <p>Prin urmare:</p>
        <ul>
          <li>Nu suntem responsabili pentru continutul difuzat de posturile de radio</li>
          <li>Nu suntem responsabili pentru disponibilitatea sau calitatea streamurilor</li>
          <li>Nu suntem responsabili pentru drepturile de autor ale muzicii difuzate</li>
          <li>Drepturile asupra continutului audio apartin in exclusivitate posturilor de radio si detinatorilor de drepturi de autor</li>
        </ul>

        <h2>3. Acuratetea Informatiilor</h2>
        <p>
          Depunem eforturi rezonabile pentru a mentine informatiile despre posturi de radio
          (frecventa, gen, oras etc.) corecte si actualizate, dar nu garantam acuratetea
          completa a acestora. Informatiile pot deveni depassite sau pot contine erori.
        </p>

        <h2>4. Disponibilitatea Serviciului</h2>
        <p>
          Nu garantam ca Site-ul va fi disponibil in permanenta sau ca va functiona fara
          intreruperi sau erori. Ne rezervam dreptul de a modifica, suspenda sau intrerupe
          serviciul in orice moment, fara notificare prealabila.
        </p>

        <h2>5. Link-uri catre Terte Parti</h2>
        <p>
          Site-ul poate contine link-uri catre site-urile oficiale ale posturilor de radio
          sau alte resurse externe. Nu avem control asupra acestor site-uri si nu ne asumam
          responsabilitatea pentru continutul lor, politicile de confidentialitate sau
          practicile lor.
        </p>

        <h2>6. Utilizarea pe Propria Raspundere</h2>
        <p>
          Utilizarea Site-ului se face pe propria raspundere. In masura maxima permisa de
          legislatia aplicabila, declinam orice raspundere pentru:
        </p>
        <ul>
          <li>Pierderi sau daune rezultate din utilizarea sau imposibilitatea utilizarii Site-ului</li>
          <li>Continut ofensator sau inadecvat difuzat de posturile de radio</li>
          <li>Probleme tehnice cauzate de furnizarii de streaming</li>
          <li>Incompatibilitati cu anumite dispozitive sau browsere</li>
        </ul>

        <h2>7. Drepturi de Autor si Proprietate Intelectuala</h2>
        <p>
          Daca sunteti detinator de drepturi de proprietate intelectuala si considerati ca
          materialele prezentate pe Site-ul nostru va incalca drepturile, va rugam sa ne
          contactati la <a href="mailto:contact@radiovibe.ro">contact@radiovibe.ro</a> pentru
          a solutiona situatia.
        </p>

        <h2>8. Modificari</h2>
        <p>
          Ne rezervam dreptul de a modifica acest disclaimer in orice moment. Modificarile
          intra in vigoare la momentul publicarii pe aceasta pagina.
        </p>

        <h2>9. Contact</h2>
        <p>
          Pentru orice intrebari sau preocupari, contactati-ne la:{' '}
          <a href="mailto:contact@radiovibe.ro">contact@radiovibe.ro</a>
        </p>
      </div>
    </div>
  );
}
