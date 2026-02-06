'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PlayerState, Station } from '@/types';
import { DEFAULT_VOLUME } from '@/lib/constants';
import { sanitizeStreamUrl } from '@/lib/url-sanitizer';

const PLAYER_STORAGE_KEY = 'radio_player_state';
const RECENTLY_PLAYED_KEY = 'radio_recently_played';
const MAX_RECENTLY_PLAYED = 20;

interface UsePlayerReturn extends PlayerState {
  play: (station: Station) => void;
  stop: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  retry: () => void;
}

export function usePlayer(): UsePlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const [state, setState] = useState<PlayerState>({
    station: null,
    isPlaying: false,
    isLoading: false,
    isBuffering: false,
    volume: DEFAULT_VOLUME,
    isMuted: false,
    error: null,
  });

  // Update Media Session metadata for lock screen / background controls
  const updateMediaSession = useCallback((station: Station | null, playing: boolean) => {
    if (!('mediaSession' in navigator) || !station) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: station.name,
      artist: 'Radio Live',
      album: station.city || 'Romania',
      artwork: station.logoUrl
        ? [
            { src: station.logoUrl, sizes: '512x512', type: 'image/png' },
          ]
        : [
            { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
    });

    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }, []);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    // Restore volume from storage
    try {
      const saved = localStorage.getItem(PLAYER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.volume === 'number') {
          audio.volume = parsed.volume;
          setState((s) => ({ ...s, volume: parsed.volume }));
        }
      }
    } catch {
      // Ignore storage errors
    }

    // Media Session action handlers (lock screen, headphone buttons)
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        audio.play().catch(() => {});
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audio.pause();
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        audio.pause();
        audio.src = '';
        setState((s) => ({
          ...s,
          isPlaying: false,
          isLoading: false,
          isBuffering: false,
          error: null,
        }));
        navigator.mediaSession.playbackState = 'none';
      });
    }

    // Event listeners
    const onPlaying = () => {
      retryCountRef.current = 0;
      setState((s) => {
        updateMediaSession(s.station, true);
        return { ...s, isPlaying: true, isLoading: false, isBuffering: false, error: null };
      });
    };

    const onWaiting = () => {
      setState((s) => ({ ...s, isBuffering: true }));
    };

    const onPause = () => {
      setState((s) => {
        updateMediaSession(s.station, false);
        return { ...s, isPlaying: false, isBuffering: false };
      });
    };

    const onError = () => {
      const errorCode = audio.error?.code;
      let errorMsg = 'Eroare la redarea streamului';

      switch (errorCode) {
        case MediaError.MEDIA_ERR_NETWORK:
          errorMsg = 'Eroare de retea. Verificati conexiunea la internet.';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMsg = 'Format audio nesuportat.';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMsg = 'Streamul nu este disponibil sau formatul nu este suportat.';
          break;
      }

      // Auto-retry with backoff
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const delay = retryCountRef.current * 2000;
        setTimeout(() => {
          if (audioRef.current && state.station) {
            // Try backup URL if available on second retry
            if (retryCountRef.current === 2 && state.station.streamUrlBackup) {
              const backupUrl = sanitizeStreamUrl(state.station.streamUrlBackup);
              if (backupUrl) {
                audioRef.current.src = backupUrl;
              }
            }
            audioRef.current.load();
            audioRef.current.play().catch(() => {});
          }
        }, delay);
        setState((s) => ({
          ...s,
          isLoading: true,
          error: `Se reincearca... (${retryCountRef.current}/${maxRetries})`,
        }));
      } else {
        setState((s) => ({ ...s, isPlaying: false, isLoading: false, isBuffering: false, error: errorMsg }));
      }
    };

    const onLoadStart = () => {
      setState((s) => ({ ...s, isLoading: true }));
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    audio.addEventListener('loadstart', onLoadStart);

    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('loadstart', onLoadStart);
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save recently played
  const addToRecentlyPlayed = useCallback((station: Station) => {
    try {
      const stored = localStorage.getItem(RECENTLY_PLAYED_KEY);
      const list: string[] = stored ? JSON.parse(stored) : [];
      const filtered = list.filter((slug) => slug !== station.slug);
      filtered.unshift(station.slug);
      localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(filtered.slice(0, MAX_RECENTLY_PLAYED)));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const play = useCallback(
    (station: Station) => {
      const audio = audioRef.current;
      if (!audio) return;

      const streamUrl = sanitizeStreamUrl(station.streamUrl);
      if (!streamUrl) {
        setState((s) => ({ ...s, error: 'URL-ul streamului este invalid.' }));
        return;
      }

      retryCountRef.current = 0;
      audio.src = streamUrl;
      audio.load();

      setState((s) => ({
        ...s,
        station,
        isLoading: true,
        isPlaying: false,
        error: null,
      }));

      updateMediaSession(station, false);

      audio.play().catch((err) => {
        // Handle autoplay policy
        if (err.name === 'NotAllowedError') {
          setState((s) => ({
            ...s,
            isLoading: false,
            error: 'Apasati din nou pentru a porni radioul (politica de autoplay a browserului).',
          }));
        }
      });

      addToRecentlyPlayed(station);
    },
    [addToRecentlyPlayed, updateMediaSession],
  );

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = '';
    setState((s) => ({
      ...s,
      isPlaying: false,
      isLoading: false,
      isBuffering: false,
      error: null,
    }));
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'none';
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !state.station) return;

    if (state.isPlaying) {
      audio.pause();
    } else {
      if (!audio.src && state.station) {
        const streamUrl = sanitizeStreamUrl(state.station.streamUrl);
        if (streamUrl) {
          audio.src = streamUrl;
          audio.load();
        }
      }
      audio.play().catch(() => {});
    }
  }, [state.isPlaying, state.station]);

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(1, volume));
    audio.volume = clamped;
    audio.muted = false;
    setState((s) => ({ ...s, volume: clamped, isMuted: false }));

    try {
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify({ volume: clamped }));
    } catch {
      // Ignore
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setState((s) => ({ ...s, isMuted: !s.isMuted }));
  }, []);

  const retry = useCallback(() => {
    if (state.station) {
      retryCountRef.current = 0;
      play(state.station);
    }
  }, [state.station, play]);

  return {
    ...state,
    play,
    stop,
    togglePlay,
    setVolume,
    toggleMute,
    retry,
  };
}
