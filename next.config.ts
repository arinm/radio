import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Performance: Enable React strict mode for catching issues early
  reactStrictMode: true,

  // Performance: Optimize images with allowed external domains
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24h
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        // In production, restrict to known logo CDN domains:
        // hostname: 'cdn.radioonline.ro',
      },
    ],
  },

  // Performance: Enable compression
  compress: true,

  // Security: Strict powered-by header removal
  poweredByHeader: false,

  // SEO: Trailing slash consistency
  trailingSlash: false,

  // Performance: Output standalone for Docker deployments
  output: 'standalone',

  // Security: Strict Content Security Policy headers are set in middleware.ts
  // Additional headers for static assets
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for SEO consistency
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // Old routes to new SEO-friendly routes
      {
        source: '/browse',
        destination: '/cauta-radio-romania',
        permanent: true,
      },
      {
        source: '/station/:slug',
        destination: '/radio/:slug-online',
        permanent: true,
      },
      {
        source: '/genre',
        destination: '/radio-genuri',
        permanent: true,
      },
      {
        source: '/genre/:slug',
        destination: '/radio-genuri/:slug',
        permanent: true,
      },
      {
        source: '/gen',
        destination: '/radio-genuri',
        permanent: true,
      },
      {
        source: '/gen/:slug',
        destination: '/radio-genuri/:slug',
        permanent: true,
      },
      {
        source: '/favorites',
        destination: '/radio-favorite',
        permanent: true,
      },
      {
        source: '/favorite',
        destination: '/radio-favorite',
        permanent: true,
      },
      {
        source: '/search',
        destination: '/cauta',
        permanent: true,
      },
    ];
  },

  // Experimental features — only stable, security-reviewed ones
  experimental: {
    // Optimize server component payloads
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
