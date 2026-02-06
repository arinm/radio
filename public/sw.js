/// <reference lib="webworker" />

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

const PRECACHE_URLS = ['/offline'];

// Install: pre-cache offline page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) =>
              key !== STATIC_CACHE &&
              key !== DYNAMIC_CACHE &&
              key !== IMAGE_CACHE
          )
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: route requests to appropriate caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s)
  if (!url.protocol.startsWith('http')) return;

  // Skip audio streams (don't cache live radio)
  if (
    request.headers.get('accept')?.includes('audio') ||
    url.pathname.includes('/stream')
  ) {
    return;
  }

  // Static assets: cache-first
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(js|css|woff2?|ttf)$/)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Images (logos): cache-first
  if (
    url.pathname.startsWith('/logos/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|avif|ico)$/)
  ) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // API routes: network-first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Pages (HTML): network-first, offline fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithOffline(request));
    return;
  }

  // Everything else: network-first
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

// Network-first strategy
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('', { status: 408, statusText: 'Offline' });
  }
}

// Network-first with offline page fallback for HTML
async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback to offline page
    const offlinePage = await caches.match('/offline');
    return offlinePage || new Response('Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}
