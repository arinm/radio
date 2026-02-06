'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Radio, Loader2 } from 'lucide-react';
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_CHARS } from '@/lib/constants';
import { sanitizeSearchQuery } from '@/lib/validation';
import type { Station } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface SearchBarProps {
  size?: 'default' | 'large';
  autoFocus?: boolean;
}

export function SearchBar({ size = 'default', autoFocus = false }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Station[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    const sanitized = sanitizeSearchQuery(searchQuery);
    if (sanitized.length < SEARCH_MIN_CHARS) {
      setResults([]);
      setIsOpen(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({ q: sanitized, pageSize: '6' });
      const res = await fetch(`/api/search?${params}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.stations || []);
        setHasSearched(true);
        setIsOpen(true);
      }
    } catch {
      // Silently fail — search is non-critical
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(value), SEARCH_DEBOUNCE_MS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = sanitizeSearchQuery(query);
    if (sanitized.length >= SEARCH_MIN_CHARS) {
      setIsOpen(false);
      router.push(`/cauta?q=${encodeURIComponent(sanitized)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${
              size === 'large' ? 'h-5 w-5' : 'h-4 w-4'
            }`}
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Cauta posturi de radio..."
            autoFocus={autoFocus}
            className={`w-full rounded-xl border border-border bg-background pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              size === 'large' ? 'h-14 text-lg' : 'h-10 text-sm'
            }`}
            aria-label="Cauta posturi de radio"
            autoComplete="off"
          />
          {(query || isLoading) && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Sterge cautarea"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            </button>
          )}
        </div>
      </form>

      {/* Dropdown results */}
      {isOpen && hasSearched && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          {results.length > 0 ? (
            <>
              <ul role="listbox">
                {results.map((station) => (
                  <li key={station.slug}>
                    <Link
                      href={`/radio/${station.slug}-online`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 overflow-hidden">
                        {station.logoUrl ? (
                          <Image
                            src={station.logoUrl}
                            alt={station.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-contain p-1"
                            unoptimized
                          />
                        ) : (
                          <Radio className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-card-foreground">
                          {station.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {[station.city, station.genres[0]].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/cauta?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="block border-t border-border px-4 py-2.5 text-center text-sm font-medium text-primary hover:bg-muted"
              >
                Vezi toate rezultatele
              </Link>
            </>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Niciun rezultat gasit pentru &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
