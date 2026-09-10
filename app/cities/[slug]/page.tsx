import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { MarketingFrame } from '@/components/marketing/MarketingFrame';
import { getCityGuide, getCityGuides } from '@/content/cities';
import { pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import c from '../cities.module.css';

type Params = { slug: string };

export function generateStaticParams() {
  return getCityGuides().map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const city = getCityGuide(slug);
  if (!city) return {};
  return pageMetadata({
    title: city.title,
    description: city.description,
    path: `/cities/${city.slug}`,
  });
}

export default async function CityGuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const city = getCityGuide(slug);
  if (!city) notFound();

  const url = `${SITE_URL}/cities/${city.slug}`;
  const related = city.related
    .map((s) => getCityGuide(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Cities', item: `${SITE_URL}/cities` },
          { '@type': 'ListItem', position: 3, name: city.name, item: url },
        ],
      },
      {
        '@type': 'WebPage',
        name: city.title,
        description: city.description,
        url,
        about: { '@type': 'City', name: city.name },
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@type': 'FAQPage',
        mainEntity: city.faqs.map((faq) => ({
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
            <Link href="/cities">Cities</Link>
            {' / '}
            {city.name}
          </p>
          <article className={c.body}>
            <p className={c.kicker}>
              {city.state} · PG owners
            </p>
            <h1 className={c.title}>{city.title}</h1>
            <p className={c.lead}>{city.intro}</p>
            <div className={c.ctas}>
              <Link href="/signup" className={c.primary}>
                Get started free
              </Link>
              <Link href="/contact" className={c.secondary}>
                Talk to us
              </Link>
            </div>

            <p>{city.landscape}</p>

            <p className={c.kicker} style={{ marginTop: 28 }}>
              Local pockets
            </p>
            <div className={c.pockets}>
              {city.pockets.map((p) => (
                <span key={p.name} className={c.chip} title={p.note}>
                  {p.name}
                </span>
              ))}
            </div>
            <ul style={{ margin: '0 0 28px', paddingLeft: 18, color: 'var(--ink-muted)', lineHeight: 1.6 }}>
              {city.pockets.map((p) => (
                <li key={p.name}>
                  <strong style={{ color: 'var(--ink)' }}>{p.name}.</strong> {p.note}
                </li>
              ))}
            </ul>

            <div className={c.split}>
              <div className={c.pane}>
                <h2>At the gate</h2>
                <p>{city.onSite}</p>
              </div>
              <div className={c.pane}>
                <h2>At the desk</h2>
                <p>{city.atDesk}</p>
              </div>
            </div>

            <p>
              RunMyPG is the same product in every city: bed occupancy, tenants, monthly rent, deposits,
              web plus Android, free in beta. {city.name} is how owners here actually move — not a hotel
              checklist pasted onto a map.
            </p>

            <div className={c.faqs}>
              {city.faqs.map((faq) => (
                <div key={faq.q} className={c.faq}>
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>

            {related.length > 0 ? (
              <>
                <p className={c.kicker}>Nearby guides</p>
                <div className={c.related}>
                  {related.map((r) => (
                    <Link key={r.slug} href={`/cities/${r.slug}`}>
                      {r.name}
                    </Link>
                  ))}
                </div>
              </>
            ) : null}

            <p>
              Questions? {SITE_NAME} is on WhatsApp and{' '}
              <Link href="/contact">contact@runmypg.in</Link>.
            </p>
          </article>
        </div>
      </MarketingFrame>
    </>
  );
}
