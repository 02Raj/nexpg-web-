import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { MarketingFrame } from '@/components/marketing/MarketingFrame';
import { getBlogPost } from '@/content/blog';
import { getCityGuide } from '@/content/cities';
import type { SolutionPage } from '@/content/solutions';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import c from '../../../app/cities/cities.module.css';

export function SolutionLanding({ page }: { page: SolutionPage }) {
  const url = `${SITE_URL}${page.path}`;
  const relatedPosts = page.relatedBlog
    .map((slug) => getBlogPost(slug))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
  const relatedCities = page.relatedCities
    .map((slug) => getCityGuide(slug))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: page.h1, item: url },
        ],
      },
      {
        '@type': 'WebPage',
        name: page.title,
        description: page.description,
        url,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#app` },
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <MarketingFrame navScrolled>
        <div className={c.page}>
          <p className={c.crumb}>
            <Link href="/">Home</Link>
            {' / '}
            {page.kicker}
          </p>
          <article className={c.body}>
            <p className={c.kicker}>{page.kicker}</p>
            <h1 className={c.title}>{page.h1}</h1>
            <p className={c.lead}>{page.lead}</p>
            <div className={c.ctas}>
              <Link href="/signup" className={c.primary}>
                Create free account
              </Link>
              <Link href="/contact" className={c.secondary}>
                Talk to us
              </Link>
            </div>

            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
                {section.bullets ? (
                  <ul style={{ margin: '0 0 28px', paddingLeft: 18, color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <p>
              {SITE_NAME} is free while in beta. Same product in every city: occupancy, tenants, rent, deposits — web
              plus Android.
            </p>

            <div className={c.faqs}>
              {page.faqs.map((faq) => (
                <div key={faq.q} className={c.faq}>
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>

            {relatedPosts.length > 0 ? (
              <>
                <p className={c.kicker}>Owner guides</p>
                <div className={c.related}>
                  {relatedPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  ))}
                </div>
              </>
            ) : null}

            {relatedCities.length > 0 ? (
              <>
                <p className={c.kicker}>City guides</p>
                <div className={c.related}>
                  {relatedCities.map((city) => (
                    <Link key={city.slug} href={`/cities/${city.slug}`}>
                      {city.name}
                    </Link>
                  ))}
                  <Link href="/cities">All cities</Link>
                </div>
              </>
            ) : null}
          </article>
        </div>
      </MarketingFrame>
    </>
  );
}
