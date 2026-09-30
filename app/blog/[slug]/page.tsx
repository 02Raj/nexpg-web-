import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { MarketingFrame } from '@/components/marketing/MarketingFrame';
import { getBlogPost, getBlogPosts, getRelatedPosts } from '@/content/blog';
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
  const related = getRelatedPosts(post.slug, 3);
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
        inLanguage: 'en-IN',
        mainEntityOfPage: url,
        image: `${SITE_URL}/opengraph-image`,
        author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.svg` },
        },
      },
      ...(post.slug === 'track-pg-occupancy'
        ? [
            {
              '@type': 'HowTo',
              name: 'How to track PG occupancy without walking every floor',
              description: post.description,
              step: [
                {
                  '@type': 'HowToStep',
                  position: 1,
                  name: 'Keep one bed map',
                  text: 'List rooms, then beds. Mark each bed occupied or empty. Do not keep a separate WhatsApp occupancy chat as the source of truth.',
                },
                {
                  '@type': 'HowToStep',
                  position: 2,
                  name: 'Update the same day as move-in or checkout',
                  text: 'Update occupancy the day someone moves in or out so the map cannot drift from the building.',
                },
                {
                  '@type': 'HowToStep',
                  position: 3,
                  name: 'Use the same data on phone and laptop',
                  text: 'Check occupancy on site and plan filling vacancies at the desk on one system — web and Android with the same login.',
                },
              ],
            },
          ]
        : []),
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
            {related.length > 0 ? (
              <>
                <p className={b.relatedKicker}>Related guides</p>
                <div className={b.relatedList}>
                  {related.map((item) => (
                    <Link key={item.slug} href={`/blog/${item.slug}`}>
                      {item.title}
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </article>
      </MarketingFrame>
    </>
  );
}
