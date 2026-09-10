import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { MarketingFrame } from '@/components/marketing/MarketingFrame';
import { getBlogPost, getBlogPosts } from '@/content/blog';
import { pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import b from '../blog.module.css';

type Params = { slug: string };

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        mainEntityOfPage: url,
        author: { '@type': 'Organization', name: SITE_NAME },
        publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <MarketingFrame navScrolled>
        <article className={b.page}>
          <div className={b.article}>
            <Link href="/blog" className={b.back}>
              ← All guides
            </Link>
            <p className={b.articleKicker}>
              {post.category} · {post.readMins} min read
            </p>
            <h1 className={b.articleTitle}>{post.title}</h1>
            <p className={b.articleLead}>{post.description}</p>
            <div className={b.prose}>
              {post.blocks.map((block, i) => {
                if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>;
                if (block.type === 'ul') {
                  return (
                    <ul key={i}>
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i}>{block.text}</p>;
              })}
            </div>
            <div className={b.cta}>
              <p>Run occupancy, rent and deposits from one dashboard — web console and Android app, free in beta.</p>
              <Link href="/signup">Create free account →</Link>
            </div>
          </div>
        </article>
      </MarketingFrame>
    </>
  );
}
