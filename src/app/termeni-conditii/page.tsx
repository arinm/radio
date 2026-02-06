import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Termeni si Conditii',
  description: `Termenii si conditiile de utilizare a ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/termeni-conditii` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">Termeni si Conditii</h1>
      <p className="mt-2 text-sm text-muted-foreground">Ultima actualizare: Februarie 2026</p>

      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <h2>1. Acceptarea Termenilor</h2>
        <p>
          Prin accesarea si utilizarea site-ului {SITE_NAME} ({SITE_URL}), denumit in continuare
          &ldquo;Site-ul&rdquo; sau &ldquo;Platforma&rdquo;, acceptati sa fiti obligat de acesti
          Termeni si Conditii. Daca nu sunteti de acord cu acesti termeni, va rugam sa nu
          utilizati Site-ul.
        </p>

        <h2>2. Descrierea Serviciului</h2>
        <p>
          {SITE_NAME} este o platforma de directorizare si redare a posturilor de radio online
          din Romania. Oferim:
        </p>
        <ul>
          <li>Acces la streamuri audio ale posturilor de radio din Romania</li>
          <li>Informatii despre posturi de radio (nume, gen, frecventa, oras)</li>
          <li>Functionalitati de cautare, favorite si redare audio</li>
        </ul>
        <p>
          <strong>Important:</strong> Nu detinem, nu operam si nu controlam streamurile audio
          ale posturilor de radio. Acestea sunt furnizate de posturile de radio respective si
          suntem doar un agregator/director.
        </p>

        <h2>3. Utilizarea Serviciului</h2>
        <h3>3.1 Utilizare permisa</h3>
        <p>Puteti utiliza Site-ul pentru:</p>
        <ul>
          <li>Ascultarea streamurilor de radio disponibile</li>
          <li>Navigarea si cautarea posturilor de radio</li>
          <li>Salvarea preferintelor (favorite) in browserul dumneavoastra</li>
        </ul>

        <h3>3.2 Utilizare interzisa</h3>
        <p>Este interzisa:</p>
        <ul>
          <li>Inregistrarea sau redistribuirea streamurilor audio fara autorizare</li>
          <li>Utilizarea de instrumente automate (boti, scrapere) pentru extragerea masiva de date</li>
          <li>Incercarea de a compromite securitatea sau disponibilitatea Site-ului</li>
          <li>Utilizarea Site-ului in scopuri ilegale</li>
          <li>Supraincarcarea intentionata a serverelor (DoS/DDoS)</li>
        </ul>

        <h2>4. Proprietatea Intelectuala</h2>
        <p>
          Designul, codul sursa, textele si structura Site-ului sunt proprietatea noastra sau
          sunt utilizate cu licenta. Logo-urile si denumirile posturilor de radio apartin
          detinatorilor lor respectivi.
        </p>
        <p>
          Continutul audio difuzat de posturile de radio este proprietatea respectivelor posturi
          de radio si a detinatorilor de drepturi de autor ai muzicii difuzate.
        </p>

        <h2>5. Disponibilitatea Serviciului</h2>
        <p>
          Ne straduim sa mentin Site-ul disponibil 24/7, dar nu garantam disponibilitatea
          neintrerupta. Streamurile audio pot fi indisponibile din motive care nu tin de noi,
          inclusiv:
        </p>
        <ul>
          <li>Probleme tehnice ale posturilor de radio</li>
          <li>Intreruperi ale furnizorilor de internet</li>
          <li>Mentenanta planificata sau de urgenta</li>
          <li>Restrictii de geo-blocare impuse de posturile de radio</li>
        </ul>

        <h2>6. Limitarea Raspunderii</h2>
        <p>
          Site-ul este furnizat &ldquo;asa cum este&rdquo; (as is) si &ldquo;dupa disponibilitate&rdquo;
          (as available). Nu oferim garantii explicite sau implicite privind:
        </p>
        <ul>
          <li>Disponibilitatea continua a streamurilor audio</li>
          <li>Calitatea sau acuratetea informatiilor despre posturi</li>
          <li>Compatibilitatea cu toate dispozitivele sau browserele</li>
        </ul>
        <p>
          In masura maxima permisa de legislatia romaneasca, nu suntem raspunzatori pentru
          daune directe, indirecte, accidentale sau consecvente rezultate din utilizarea
          sau imposibilitatea utilizarii Site-ului.
        </p>

        <h2>7. Link-uri Externe</h2>
        <p>
          Site-ul poate contine link-uri catre site-urile oficiale ale posturilor de radio
          sau alte resurse externe. Nu suntem responsabili pentru continutul, politicile de
          confidentialitate sau practicile acestor site-uri.
        </p>

        <h2>8. Modificarea Termenilor</h2>
        <p>
          Ne rezervam dreptul de a modifica acesti termeni in orice moment. Modificarile vor
          fi publicate pe aceasta pagina cu data actualizarii. Continuarea utilizarii Site-ului
          dupa publicarea modificarilor constituie acceptarea noilor termeni.
        </p>

        <h2>9. Legislatia Aplicabila</h2>
        <p>
          Acesti termeni sunt guvernati de legislatia din Romania. Orice litigiu va fi solutionat
          de instantele competente din Romania.
        </p>

        <h2>10. Contact</h2>
        <p>
          Pentru intrebari legate de acesti termeni, contactati-ne la:{' '}
          <a href="mailto:contact@radiovibe.ro">contact@radiovibe.ro</a>
        </p>
      </div>
    </div>
  );
}
