import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'radiovibe',
    short_name: 'radiovibe',
    description:
      'Asculta radio online din Romania. Peste 60 de posturi de radio romanesti live, muzica, stiri, sport si divertisment — gratuit si fara reclame.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0ea5e9',
    orientation: 'portrait',
    categories: ['music', 'entertainment'],
    lang: 'ro',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
