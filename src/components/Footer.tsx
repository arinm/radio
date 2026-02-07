import Link from 'next/link';
import { Radio } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Radio className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg text-foreground"><span className="font-bold">radio</span>vibe</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Asculta cele mai bune posturi de radio din Romania, live si gratuit. Muzica, stiri, sport si divertisment.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Descopera</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/cauta-radio-romania" className="text-sm text-muted-foreground hover:text-foreground">
                  Toate posturile
                </Link>
              </li>
              <li>
                <Link href="/radio-genuri" className="text-sm text-muted-foreground hover:text-foreground">
                  Genuri muzicale
                </Link>
              </li>
              <li>
                <Link href="/radio-favorite" className="text-sm text-muted-foreground hover:text-foreground">
                  Favorite
                </Link>
              </li>
              <li>
                <Link href="/instaleaza" className="text-sm text-muted-foreground hover:text-foreground">
                  Instaleaza aplicatia
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Genres */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Genuri populare</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/radio-genuri/pop" className="text-sm text-muted-foreground hover:text-foreground">
                  Pop
                </Link>
              </li>
              <li>
                <Link href="/radio-genuri/rock" className="text-sm text-muted-foreground hover:text-foreground">
                  Rock
                </Link>
              </li>
              <li>
                <Link href="/radio-genuri/manele" className="text-sm text-muted-foreground hover:text-foreground">
                  Manele
                </Link>
              </li>
              <li>
                <Link href="/radio-genuri/stiri" className="text-sm text-muted-foreground hover:text-foreground">
                  Stiri
                </Link>
              </li>
              <li>
                <Link href="/radio-genuri/dance" className="text-sm text-muted-foreground hover:text-foreground">
                  Dance
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/politica-confidentialitate" className="text-sm text-muted-foreground hover:text-foreground">
                  Politica de confidentialitate
                </Link>
              </li>
              <li>
                <Link href="/politica-cookies" className="text-sm text-muted-foreground hover:text-foreground">
                  Politica de cookie-uri
                </Link>
              </li>
              <li>
                <Link href="/termeni-conditii" className="text-sm text-muted-foreground hover:text-foreground">
                  Termeni si conditii
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-foreground">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {currentYear} {SITE_NAME}. Toate drepturile rezervate.
            Streamurile audio apartin posturilor de radio respective.
          </p>
        </div>
      </div>
    </footer>
  );
}
