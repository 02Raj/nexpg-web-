import { JsonLd } from '@/components/JsonLd';
import { pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import { getBlogPosts } from '@/content/blog';
import { BlogIndex } from './BlogIndex';

const BLOG_DESCRIPTION =
  'Practical guides on PG occupancy, rent collection, security deposits and PG management software in India. Written for owners, not hotel chains.';

export const metadata = pageMetadata({
  title: 'Blog — PG management guides for Indian owners',
  description: BLOG_DESCRIPTION,
  path: '/blog',
});

export default function BlogPage() {
  const posts = getBlogPosts();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} Blog`,
    url: `${SITE_URL}/blog`,
    description: BLOG_DESCRIPTION,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogIndex />
    </>
  );
}
