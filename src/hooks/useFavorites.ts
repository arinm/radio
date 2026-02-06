'use client';

import { useEffect } from 'react';
import { create } from 'zustand';

const FAVORITES_KEY = 'radio_favorites';

interface FavoritesState {
  favorites: string[];
  mounted: boolean;
  hydrate: () => void;
  setFavorites: (favorites: string[]) => void;
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  mounted: false,

  hydrate: () => {
    if (get().mounted) return;
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        set({ favorites: JSON.parse(stored), mounted: true });
      } else {
        set({ mounted: true });
      }
    } catch {
      set({ mounted: true });
    }
  },

  setFavorites: (favorites: string[]) => {
    set({ favorites });
  },

  toggleFavorite: (slug: string) => {
    const { favorites } = get();
    const newFavorites = favorites.includes(slug)
      ? favorites.filter((f) => f !== slug)
      : [...favorites, slug];
    set({ favorites: newFavorites });
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch {
      // Ignore storage errors
    }
  },

  isFavorite: (slug: string) => {
    return get().favorites.includes(slug);
  },
}));

export function useFavorites() {
  const store = useFavoritesStore();
  const { hydrate, setFavorites } = store;

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) {
        try {
          const newFavorites = e.newValue ? JSON.parse(e.newValue) : [];
          setFavorites(newFavorites);
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setFavorites]);

  return store;
}
