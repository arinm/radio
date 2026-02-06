'use client';

import { useEffect, useState } from 'react';

const RECENTLY_PLAYED_KEY = 'radio_recently_played';

export function useRecentlyPlayed() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_PLAYED_KEY);
      if (stored) {
        setRecentSlugs(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  return recentSlugs;
}
