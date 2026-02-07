'use client';

import Link from 'next/link';
import { Radio } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Radio Online Romania - Acasa">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Radio className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="hidden text-lg text-foreground sm:inline">
            <span className="font-bold">radio</span>vibe
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigare principala">
          <Link
            href="/cauta-radio-romania"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Toate posturile
          </Link>
          <Link
            href="/radio-genuri"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Genuri
          </Link>
          <Link
            href="/radio-favorite"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Favorite
          </Link>
        </nav>

        {/* Search */}
        <div className="mx-auto max-w-md flex-1">
          <SearchBar />
        </div>

        {/* Theme toggle - hidden on mobile */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        {/* Mobile menu - shown on mobile */}
        <MobileMenu />
      </div>
    </header>
  );
}
