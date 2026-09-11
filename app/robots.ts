import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/** Owner console + admin — keep out of search and AI training where possible. */
const DISALLOW = [
  '/dashboard',
  '/beds',
  '/bills',
  '/tenant',
  '/setup',
  '/more',
  '/feedback',
  '/platform',
  '/auth',
  '/login',
  '/forgot-password',
];

/** Allow marketing pages for generative / AI crawlers (same rules as default). */
const AI_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'PerplexityBot',
  'ClaudeBot',
  'Google-Extended',
  'anthropic-ai',
];

export default function robots(): MetadataRoute.Robots {
  const publicRule = { allow: '/' as const, disallow: DISALLOW };

  return {
    rules: [
      { userAgent: '*', ...publicRule },
      ...AI_USER_AGENTS.map((userAgent) => ({ userAgent, ...publicRule })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
