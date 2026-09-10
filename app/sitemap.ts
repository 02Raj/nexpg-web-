import { SITE_URL } from '@/lib/seo';
import { getBlogPosts } from '@/content/blog';
import { getCityGuides } from '@/content/cities';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const posts = getBlogPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  const cities = getCityGuides().map((city) => ({
    url: `${SITE_URL}/cities/${city.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/download`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/signup`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/cities`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/help`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/refund`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.35,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.35,
    },
    {
      url: `${SITE_URL}/cookies/preferences`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...cities,
    ...posts,
  ];
}
