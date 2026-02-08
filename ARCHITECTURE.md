# Radio Online Romania — Architecture & Deployment Guide

## Security Version Selection Rationale

**Next.js 15.5.10** (January 2026)

### What was checked:
- [Next.js CVE-2025-66478](https://nextjs.org/blog/CVE-2025-66478) — React2Shell RCE (CVSS 10.0)
- [CVE-2025-55184](https://nextjs.org/blog/security-update-2025-12-11) — DoS via infinite loop (CVSS 7.5)
- [CVE-2025-55183](https://nextjs.org/blog/security-update-2025-12-11) — Source code exposure (CVSS 5.3)
- [CVE-2025-67779](https://github.com/vercel/next.js/security/advisories/GHSA-5j59-xgg2-r9c4) — Incomplete DoS fix follow-up
- [CVE-2026-23864](https://www.akamai.com/blog/security-research/2026/jan/cve-2026-23864-react-nextjs-denial-of-service) — DoS via memory exhaustion (Jan 2026)
- GHSA-9g9p-9gw9-jx7f — Image Optimizer DoS (fixed in 15.5.10)

### Why this version is safe:
- 15.5.10 is the latest patched stable in the 15.5.x line
- All known CVEs as of January 27, 2026 are patched
- `npm audit` shows 0 vulnerabilities
- 15.x is a mature, battle-tested release line (Active LTS)

---

## A) Architecture & Route Map

### Routes Map

| Route | Type | Revalidation | Purpose |
|-------|------|-------------|---------|
| `/` | SSG | 300s | Home — hero, search, featured, genres |
| `/cauta-radio-romania` | Dynamic | 300s | All stations, paginated |
| `/radio-genuri` | SSG | 3600s | Genre listing |
| `/radio-genuri/[slug]` | SSG+ISR | 300s | Stations by genre, paginated |
| `/radio/[slug]` | SSG+ISR | 3600s | Station detail page |
| `/cauta` | Dynamic | — | Search results (noindex) |
| `/radio-favorite` | Static shell | — | Client-side favorites (noindex) |
| `/instaleaza` | Static | — | PWA install instructions |
| `/politica-confidentialitate` | Static | — | Privacy Policy |
| `/politica-cookies` | Static | — | Cookie Policy |
| `/termeni-conditii` | Static | — | Terms & Conditions |
| `/disclaimer` | Static | — | Disclaimer |
| `/api/search` | API | — | Search endpoint |
| `/api/stations` | API | — | Station listing/fetch |
| `/api/health` | API | — | Stream health check |
| `/sitemap.xml` | Generated | — | SEO sitemap |
| `/robots.txt` | Generated | — | SEO robots |

### Data Model (Prisma)

```
Station {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  streamUrl       String
  streamUrlBackup String?
  homepage        String?
  description     String?
  genres          String   // JSON array as string
  city            String?
  region          String?
  language        String   @default("ro")
  logoUrl         String?
  bitrate         Int?
  codec           String?
  frequency       String?
  isActive        Boolean  @default(true)
  isFeatured      Boolean  @default(false)
  listenScore     Int      @default(0)
  lastCheckedAt   DateTime?
  status          String   @default("unknown")
  socialLinks     String?  // JSON as string
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Caching Strategy

| Layer | What | TTL | Technology |
|-------|------|-----|-----------|
| Build-time | Station pages, genre pages | ISR revalidate | Next.js ISR |
| Server | Featured stations, genre counts, station data | 5-60 min | In-memory cache |
| API | Search results | 60s | Cache-Control headers |
| CDN | Static assets, images | 1 year | Immutable cache headers |
| Client | Favorites, recent, volume | Persistent | localStorage |

### Security Checklist

- [x] CSP headers with connect-src allowlist for stream domains
- [x] HSTS with max-age=63072000, includeSubDomains, preload
- [x] X-Content-Type-Options: nosniff
- [x] X-Frame-Options: DENY + frame-ancestors 'none' in CSP
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Permissions-Policy: deny camera, microphone, geolocation, payment, etc.
- [x] Rate limiting on all API routes (in-memory, upgradeable to Redis)
- [x] Input validation with Zod on all API endpoints
- [x] URL sanitization (protocol whitelist, no credentials)
- [x] SSRF protection (private IP blocking, timeout, redirect limits)
- [x] Bot protection (suspicious user-agent blocking)
- [x] No secrets in client code (env vars pattern)
- [x] Secure cookie attributes (SameSite, Secure, Path)
- [x] No dangerouslySetInnerHTML with user input
- [x] Output encoding via React's built-in JSX escaping
- [x] Dependency pinning + 0 vulnerabilities (npm audit)
- [x] poweredByHeader: false

### SEO Checklist

- [x] Unique title + meta description per page
- [x] Canonical URLs on every page
- [x] OpenGraph + Twitter Card meta tags
- [x] JSON-LD structured data (RadioStation, WebSite, BreadcrumbList, ItemList)
- [x] /sitemap.xml with all stations, genres, and static pages
- [x] /robots.txt with crawl rules
- [x] Internal linking: home → genres → stations → similar stations
- [x] Breadcrumb navigation with JSON-LD
- [x] Pagination with proper rel links
- [x] Search pages noindexed (duplicate content prevention)
- [x] ISR revalidation for fresh content
- [x] Server-side rendering for all SEO pages
- [x] Minimal JS payload (102kB shared, ~117kB per page)

---

## C) Deployment Guide

### Vercel (Recommended)

1. Push code to GitHub/GitLab
2. Connect repository in Vercel dashboard
3. Set environment variables:
   ```
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_SITE_URL=https://radiovibe.ro
   NEXT_PUBLIC_SITE_NAME=Radio Online Romania
   ```
4. Deploy — Vercel handles build, CDN, edge functions automatically
5. Configure custom domain with SSL

### Docker (Self-hosted)

```bash
# Build
docker build -t radio-online .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXT_PUBLIC_SITE_URL="https://radiovibe.ro" \
  radio-online
```

Put behind Nginx/Caddy reverse proxy with:
- SSL termination
- Gzip/Brotli compression
- CDN (Cloudflare) for static assets

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `file:./dev.db` | Database connection string |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://radiovibe.ro` | Public site URL |
| `NEXT_PUBLIC_SITE_NAME` | No | `Radio Online Romania` | Site name |
| `RATE_LIMIT_MAX_REQUESTS` | No | `60` | API rate limit per window |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | — | Google Analytics (after consent) |

### CDN Caching Notes

- Static assets (`/_next/static/`): immutable, 1 year cache
- Station logos: CDN with 24h TTL
- HTML pages: s-maxage via ISR, stale-while-revalidate
- API responses: Cache-Control headers set per endpoint

### Monitoring

- Web Vitals: use `useReportWebVitals` (behind analytics consent)
- Error tracking: Sentry (optional, configure as necessary-only processing)
- Server logs: structured JSON format via Next.js logging
- Health checks: `/api/health` endpoint for uptime monitoring

### Database Migration (SQLite → PostgreSQL)

1. Update `prisma/schema.prisma`: change provider to `"postgresql"`
2. Update `DATABASE_URL` in `.env`
3. Run `npx prisma migrate dev` to create migration
4. Run `npx prisma db seed` to populate
5. For production: `npx prisma migrate deploy`

---

## D) SEO Content Templates

### Title Patterns
- Home: `Radio Online Romania - Asculta Radio Live din Romania`
- Station: `{name} - Asculta Live Online | Radio Online Romania`
- Genre: `Radio {genre} Online - Posturi de Radio {genre} | Radio Online Romania`
- Browse: `Toate Posturile de Radio Online din Romania | Radio Online Romania`

### Description Patterns
- Station: `Asculta {name} din {city} live online - {genres}. Stream radio gratuit. {description}`
- Genre: `Asculta cele mai bune posturi de radio {genre} online din Romania. {description}`

### JSON-LD Examples

Station page:
```json
{
  "@context": "https://schema.org",
  "@type": "RadioStation",
  "name": "Kiss FM",
  "url": "https://radiovibe.ro/radio/kiss-fm-online",
  "description": "...",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bucuresti",
    "addressCountry": "RO"
  },
  "broadcastFrequency": {
    "@type": "BroadcastFrequencySpecification",
    "broadcastFrequencyValue": "96.1 FM"
  }
}
```

### Internal Link Rules
1. Home → top 12 stations + top 8 genres
2. Genre page → all stations in that genre
3. Station page → similar stations (by genre overlap)
4. Footer → all genre pages + legal pages
5. Breadcrumb: Home > Section > Page

---

## E) GDPR/Legal Summary

### Consent Categories
| Category | Default | What it controls |
|----------|---------|-----------------|
| Necessary | Always ON | Consent cookie, theme, player state |
| Analytics | OFF | Google Analytics (with IP anonymization) |
| Marketing | OFF | Not currently used; placeholder for future |

### User Rights (GDPR)
- Access, rectification, erasure, restriction, portability, objection
- Contact: privacy@radiovibe.ro
- Supervisory authority: ANSPDCP (www.dataprotection.ro)

### Data Minimization
- No tracking by default (consent required)
- IP anonymization when analytics enabled
- Favorites/recent stored locally (never on server)
- Server logs retained max 30 days
- Consent cookie: 1 year TTL

---

## F) Definition of Done Checklist

### Build & Deployment
- [x] `npm run build` succeeds with 0 errors
- [x] `npm audit` shows 0 vulnerabilities
- [x] All routes render correctly (55 pages generated)
- [x] TypeScript strict mode passes

### Performance Targets
- [ ] Lighthouse Performance ≥ 95 (mobile) — verify in production
- [ ] Lighthouse SEO = 100 — verify in production
- [ ] Lighthouse Best Practices = 100 — verify in production
- [ ] Lighthouse Accessibility ≥ 95 — verify in production
- [x] First Load JS < 120kB (shared) ✓ (102kB achieved)
- [x] Minimal client-side JS (server components by default)

### Security
- [x] CSP headers present and correct
- [x] HSTS header present
- [x] X-Frame-Options: DENY
- [x] Rate limiting on API routes
- [x] SSRF protection on health check
- [x] Input validation (Zod) on all API inputs
- [x] URL sanitization for all external URLs
- [x] No secrets in client bundle
- [x] Bot protection in middleware

### SEO
- [x] /sitemap.xml generates correctly
- [x] /robots.txt is present
- [x] JSON-LD on station and genre pages
- [x] Canonical URLs on all pages
- [x] OpenGraph meta on all pages

### GDPR
- [x] Cookie banner with granular consent
- [x] Privacy Policy page (Romanian)
- [x] Cookie Policy page (Romanian)
- [x] Terms & Conditions page (Romanian)
- [x] Disclaimer page (Romanian)
- [x] No analytics before consent
- [x] Data stored locally (localStorage) not on server
- [x] DSAR contact email placeholder

### Functional
- [x] Audio player plays/pauses/stops
- [x] Autoplay policy handling with user feedback
- [x] Stream error retry with exponential backoff
- [x] Backup stream URL fallback
- [x] Search with debounced suggestions
- [x] Favorites stored in localStorage
- [x] Recently played tracking
- [x] Dark mode toggle
- [x] Mobile responsive layout
- [x] 404 and error pages
