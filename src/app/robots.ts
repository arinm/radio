import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

// AI assistant / answer-engine crawlers. We explicitly welcome them so the
// directory can be cited in AI answers ("where can I listen to Radio X online?").
// This makes the policy stated in /llms.txt explicit and machine-checkable.
// (Edge/CDN rules still govern actual access — robots.txt is advisory.)
const AI_CRAWLERS = [
  'GPTBot', // OpenAI training
  'OAI-SearchBot', // ChatGPT search citations
  'ChatGPT-User', // ChatGPT user-initiated fetches
  'ClaudeBot', // Anthropic training
  'Claude-SearchBot', // Claude search citations
  'Claude-User', // Claude user-initiated fetches
  'PerplexityBot', // Perplexity index
  'Perplexity-User', // Perplexity user-initiated fetches
  'Google-Extended', // Gemini / Vertex grounding
  'Applebot-Extended', // Apple Intelligence
  'CCBot', // Common Crawl
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/offline'],
      },
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
        disallow: ['/api/', '/offline'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
