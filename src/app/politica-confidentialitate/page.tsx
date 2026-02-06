import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Politica de Confidentialitate',
  description: `Politica de confidentialitate a ${SITE_NAME}. Informatii despre prelucrarea datelor personale conform GDPR.`,
  alternates: { canonical: `${SITE_URL}/politica-confidentialitate` },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">Politica de Confidentialitate</h1>
      <p className="mt-2 text-sm text-muted-foreground">Ultima actualizare: Februarie 2026</p>

      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <h2>1. Introducere</h2>
        <p>
          Bine ati venit pe {SITE_NAME} (denumit in continuare &ldquo;Site-ul&rdquo;, &ldquo;noi&rdquo; sau &ldquo;Platforma&rdquo;).
          Respectam confidentialitatea dumneavoastra si ne angajam sa protejam datele personale conform
          Regulamentului General privind Protectia Datelor (GDPR) — Regulamentul (UE) 2016/679,
          Legii nr. 190/2018 si altor reglementari aplicabile in Romania.
        </p>
        <p>
          Aceasta politica descrie ce date colectam, de ce le colectam, cum le utilizam si
          drepturile dumneavoastra in calitate de persoana vizata.
        </p>

        <h2>2. Operatorul de Date</h2>
        <p>
          Pentru orice intrebari legate de protectia datelor personale, ne puteti contacta la:{' '}
          <a href="mailto:contact@radiovibe.ro">contact@radiovibe.ro</a>
        </p>

        <h2>3. Ce Date Colectam</h2>
        <h3>3.1 Date colectate automat (fara consimtamant — baza legala: interes legitim)</h3>
        <ul>
          <li><strong>Date tehnice minime:</strong> adresa IP (trunchiat/anonimizat in masura posibilului), tipul browserului, sistemul de operare — necesare pentru functionarea tehnica a Site-ului.</li>
          <li><strong>Cookie-uri esentiale:</strong> Cookie-ul de consimtamant, preferinte de tema (dark/light mode), starea playerului — strict necesare pentru functionarea Site-ului.</li>
        </ul>

        <h3>3.2 Date colectate cu consimtamant explicit</h3>
        <ul>
          <li><strong>Cookie-uri analitice:</strong> Google Analytics (cu anonimizare IP activata) — doar dupa ce ati acordat consimtamantul prin bannerul de cookie-uri.</li>
          <li><strong>Cookie-uri de marketing:</strong> In prezent nu utilizam cookie-uri de marketing. Daca situatia se schimba, veti fi notificat si vi se va solicita consimtamantul.</li>
        </ul>

        <h3>3.3 Date stocate local (in browser)</h3>
        <ul>
          <li><strong>Favorite:</strong> Lista posturilor de radio favorite — stocata in localStorage, nu pe serverele noastre.</li>
          <li><strong>Recent ascultat:</strong> Istoricul posturilor ascultate recent — stocat in localStorage.</li>
          <li><strong>Volum:</strong> Preferinta de volum — stocata in localStorage.</li>
        </ul>
        <p>Aceste date nu parasesc browserul dumneavoastra si nu sunt transmise catre serverele noastre.</p>

        <h2>4. Scopul Prelucrarii</h2>
        <table>
          <thead>
            <tr>
              <th>Scop</th>
              <th>Baza legala</th>
              <th>Date implicate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Functionarea tehnica a Site-ului</td>
              <td>Interes legitim (Art. 6(1)(f))</td>
              <td>Date tehnice minime</td>
            </tr>
            <tr>
              <td>Analiza traficului si imbunatatirea serviciului</td>
              <td>Consimtamant (Art. 6(1)(a))</td>
              <td>Cookie-uri analitice</td>
            </tr>
            <tr>
              <td>Conformitate legala</td>
              <td>Obligatie legala (Art. 6(1)(c))</td>
              <td>Loguri de securitate</td>
            </tr>
          </tbody>
        </table>

        <h2>5. Durata Pastrarii Datelor</h2>
        <ul>
          <li><strong>Loguri server:</strong> Maxim 30 de zile, apoi sterse automat.</li>
          <li><strong>Cookie-uri analitice:</strong> Conform politicii Google Analytics (maxim 14 luni cu setarile recomandate).</li>
          <li><strong>Cookie-ul de consimtamant:</strong> 1 an de la acordarea/actualizarea consimtamantului.</li>
          <li><strong>Date din localStorage:</strong> Raman pana cand le stergeti manual din browser.</li>
        </ul>

        <h2>6. Partajarea Datelor</h2>
        <p>Nu vindem si nu inchiriem datele dumneavoastra personale catre terte parti. Putem partaja date cu:</p>
        <ul>
          <li><strong>Google Analytics</strong> (Google LLC) — doar daca ati acordat consimtamantul pentru cookie-uri analitice. Google actioneaza ca imputernicit al datelor.</li>
          <li><strong>Furnizorul de hosting</strong> (Vercel Inc.) — pentru furnizarea serviciului tehnic.</li>
        </ul>
        <p>
          <strong>Transferuri internationale:</strong> Google si furnizorul de hosting pot procesa date in afara UE/SEE.
          Aceste transferuri sunt acoperite de Clauze Contractuale Standard (SCC) sau alte mecanisme legale conforme cu GDPR.
        </p>

        <h2>7. Drepturile Dumneavoastra</h2>
        <p>Conform GDPR, aveti urmatoarele drepturi:</p>
        <ul>
          <li><strong>Dreptul de acces</strong> — puteti solicita o copie a datelor personale pe care le detinem.</li>
          <li><strong>Dreptul la rectificare</strong> — puteti cere corectarea datelor inexacte.</li>
          <li><strong>Dreptul la stergere (&ldquo;dreptul de a fi uitat&rdquo;)</strong> — puteti solicita stergerea datelor.</li>
          <li><strong>Dreptul la restrictionarea prelucrarii</strong> — puteti cere limitarea prelucrarii datelor.</li>
          <li><strong>Dreptul la portabilitatea datelor</strong> — puteti primi datele intr-un format structurat.</li>
          <li><strong>Dreptul de opozitie</strong> — va puteti opune prelucrarii bazate pe interes legitim.</li>
          <li><strong>Dreptul de a retrage consimtamantul</strong> — puteti modifica oricand preferintele de cookie-uri prin bannerul de cookie-uri sau din setarile browserului.</li>
        </ul>
        <p>
          Pentru exercitarea drepturilor, contactati-ne la:{' '}
          <a href="mailto:contact@radiovibe.ro">contact@radiovibe.ro</a>
        </p>
        <p>
          De asemenea, aveti dreptul de a depune o plangere la Autoritatea Nationala de Supraveghere
          a Prelucrarii Datelor cu Caracter Personal (ANSPDCP) —{' '}
          <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">
            www.dataprotection.ro
          </a>
        </p>

        <h2>8. Securitatea Datelor</h2>
        <p>
          Implementam masuri tehnice si organizatorice adecvate pentru protectia datelor, inclusiv:
          HTTPS, anteturi de securitate (CSP, HSTS), protectie impotriva SSRF si XSS,
          limitarea accesului la date, si revizuirea periodica a masurilor de securitate.
        </p>

        <h2>9. Modificari ale Politicii</h2>
        <p>
          Aceasta politica poate fi actualizata periodic. Vom afisa data ultimei actualizari
          in partea de sus a acestei pagini. Modificarile semnificative vor fi anuntate prin
          intermediul Site-ului.
        </p>

        <h2>10. Contact</h2>
        <p>
          Pentru orice intrebari legate de confidentialitate sau pentru exercitarea drepturilor
          dumneavoastra, ne puteti contacta la:
        </p>
        <p>
          Email: <a href="mailto:contact@radiovibe.ro">contact@radiovibe.ro</a>
        </p>
      </div>
    </div>
  );
}
