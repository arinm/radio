'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { usePlayer } from '@/hooks/usePlayer';
import type { PlayerState, Station } from '@/types';

interface PlayerContextValue extends PlayerState {
  play: (station: Station) => void;
  stop: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  retry: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const player = usePlayer();
  return <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>;
}

export function usePlayerContext(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return ctx;
}
