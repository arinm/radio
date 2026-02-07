'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Heart, Music, Download, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from 'next-themes';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const closeMenu = () => setIsOpen(false);

  if (!mounted) {
    return (
      <div className="md:hidden">
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Deschide meniul"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Full screen menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-background"
          style={{ height: '100dvh' }}
        >
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <span className="text-lg text-foreground">
              <span className="font-bold">radio</span>vibe
            </span>
            <button
              onClick={closeMenu}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Inchide meniul"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col px-4 py-6">
            {/* Navigation links */}
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/cauta-radio-romania"
                    onClick={closeMenu}
                    className="flex items-center gap-4 rounded-xl px-4 py-4 text-lg text-foreground transition-colors hover:bg-muted active:bg-muted"
                  >
                    <Search className="h-6 w-6 text-muted-foreground" />
                    Toate posturile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/radio-genuri"
                    onClick={closeMenu}
                    className="flex items-center gap-4 rounded-xl px-4 py-4 text-lg text-foreground transition-colors hover:bg-muted active:bg-muted"
                  >
                    <Music className="h-6 w-6 text-muted-foreground" />
                    Genuri
                  </Link>
                </li>
                <li>
                  <Link
                    href="/radio-favorite"
                    onClick={closeMenu}
                    className="flex items-center gap-4 rounded-xl px-4 py-4 text-lg text-foreground transition-colors hover:bg-muted active:bg-muted"
                  >
                    <Heart className="h-6 w-6 text-muted-foreground" />
                    Favorite
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Divider */}
            <div className="my-6 border-t border-border" />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-4 rounded-xl px-4 py-4 text-lg text-foreground transition-colors hover:bg-muted active:bg-muted"
            >
              {theme === 'dark' ? (
                <Sun className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Moon className="h-6 w-6 text-muted-foreground" />
              )}
              {theme === 'dark' ? 'Tema deschisa' : 'Tema inchisa'}
            </button>

            {/* Divider */}
            <div className="my-6 border-t border-border" />

            {/* Install CTA */}
            <Link
              href="/instaleaza"
              onClick={closeMenu}
              className="flex items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
            >
              <Download className="h-5 w-5" />
              Instaleaza aplicatia
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
