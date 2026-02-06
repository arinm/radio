import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Politica de Cookie-uri',
  description: `Politica de cookie-uri a ${SITE_NAME}. Informatii despre tipurile de cookie-uri utilizate si cum le puteti gestiona.`,
  alternates: { canonical: `${SITE_URL}/politica-cookies` },
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">Politica de Cookie-uri</h1>
      <p className="mt-2 text-sm text-muted-foreground">Ultima actualizare: Februarie 2026</p>

      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <h2>1. Ce sunt Cookie-urile?</h2>
        <p>
          Cookie-urile sunt fisiere text de mici dimensiuni care sunt stocate pe dispozitivul
          dumneavoastra (calculator, telefon, tableta) atunci cand vizitati un site web.
          Acestea permit site-ului sa va recunoasca si sa retina informatii despre vizita dumneavoastra.
        </p>

        <h2>2. Ce Cookie-uri Folosim</h2>

        <h3>2.1 Cookie-uri Strict Necesare (Esentiale)</h3>
        <p>
          Aceste cookie-uri sunt indispensabile pentru functionarea Site-ului si nu pot fi
          dezactivate. Ele nu stocheaza informatii personale identificabile.
        </p>
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Scop</th>
              <th>Durata</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>radio_consent</code></td>
              <td>Stocheaza preferintele dumneavoastra de consimtamant pentru cookie-uri</td>
              <td>1 an</td>
            </tr>
            <tr>
              <td><code>theme</code></td>
              <td>Stocheaza preferinta de tema (luminoasa/intunecata)</td>
              <td>1 an</td>
            </tr>
          </tbody>
        </table>

        <h3>2.2 Cookie-uri Analitice (Optionale)</h3>
        <p>
          Aceste cookie-uri ne ajuta sa intelegem cum interactioneaza vizitatorii cu Site-ul,
          furnizand informatii despre paginile vizitate, sursa de trafic si alte statistici.
          <strong> Aceste cookie-uri se activeaza DOAR dupa ce ati acordat consimtamantul explicit.</strong>
        </p>
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Furnizor</th>
              <th>Scop</th>
              <th>Durata</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>_ga</code></td>
              <td>Google Analytics</td>
              <td>Distingerea utilizatorilor unici</td>
              <td>2 ani</td>
            </tr>
            <tr>
              <td><code>_ga_*</code></td>
              <td>Google Analytics</td>
              <td>Pastrarea starii sesiunii</td>
              <td>2 ani</td>
            </tr>
          </tbody>
        </table>

        <h3>2.3 Cookie-uri de Marketing (Optionale)</h3>
        <p>
          In prezent, <strong>nu folosim cookie-uri de marketing</strong>. Daca situatia se
          schimba in viitor, aceasta sectiune va fi actualizata si vi se va solicita
          consimtamantul explicit.
        </p>

        <h3>2.4 Stocare Locala (localStorage)</h3>
        <p>
          Folosim localStorage (care nu este un cookie) pentru a stoca preferinte locale ale
          playerului. Aceste date nu sunt transmise catre serverele noastre:
        </p>
        <table>
          <thead>
            <tr>
              <th>Cheie</th>
              <th>Scop</th>
              <th>Durata</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>radio_favorites</code></td>
              <td>Lista posturilor de radio favorite</td>
              <td>Pana la stergere manuala</td>
            </tr>
            <tr>
              <td><code>radio_recently_played</code></td>
              <td>Istoricul posturilor ascultate recent</td>
              <td>Pana la stergere manuala</td>
            </tr>
            <tr>
              <td><code>radio_player_state</code></td>
              <td>Preferinta de volum</td>
              <td>Pana la stergere manuala</td>
            </tr>
          </tbody>
        </table>

        <h2>3. Cum Va Puteti Gestiona Preferintele</h2>
        <h3>3.1 Prin bannerul nostru de cookie-uri</h3>
        <p>
          La prima vizita, veti vedea un banner de cookie-uri care va permite sa:
        </p>
        <ul>
          <li>Acceptati toate cookie-urile</li>
          <li>Acceptati doar cookie-urile esentiale</li>
          <li>Personalizati preferintele (alegeti individual fiecare categorie)</li>
        </ul>
        <p>
          Puteti modifica oricand preferintele din sectiunea de setari a bannerului de cookie-uri.
        </p>

        <h3>3.2 Prin setarile browserului</h3>
        <p>
          Puteti configura browserul sa blocheze sau sa stearga cookie-urile. Consultati
          documentatia browserului dumneavoastra:
        </p>
        <ul>
          <li>Chrome: Setari &gt; Confidentialitate si securitate &gt; Cookie-uri</li>
          <li>Firefox: Setari &gt; Confidentialitate si securitate</li>
          <li>Safari: Preferinte &gt; Confidentialitate</li>
          <li>Edge: Setari &gt; Cookie-uri si permisiuni site</li>
        </ul>

        <h3>3.3 Stergerea datelor din localStorage</h3>
        <p>
          Pentru a sterge datele stocate local (favorite, recent ascultat):
        </p>
        <ul>
          <li>Chrome: DevTools (F12) &gt; Application &gt; Local Storage &gt; Stergeti cheile relevante</li>
          <li>Sau stergeti toate datele site-ului din setarile browserului</li>
        </ul>

        <h2>4. Impactul Dezactivarii Cookie-urilor</h2>
        <p>
          Dezactivarea cookie-urilor esentiale poate afecta functionarea corecta a Site-ului,
          inclusiv preferintele de tema si starea consimtamantului. Cookie-urile analitice si
          de marketing sunt complet optionale si dezactivarea lor nu afecteaza experienta de utilizare.
        </p>

        <h2>5. Actualizari</h2>
        <p>
          Aceasta politica poate fi actualizata periodic. Verificati aceasta pagina pentru
          cele mai recente informatii.
        </p>

        <h2>6. Contact</h2>
        <p>
          Pentru intrebari despre cookie-uri, contactati-ne la:{' '}
          <a href="mailto:contact@radiovibe.ro">contact@radiovibe.ro</a>
        </p>
      </div>
    </div>
  );
}
