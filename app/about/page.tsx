import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { MarketingFrame } from '@/components/marketing/MarketingFrame';
import { ABOUT_REASONS, ABOUT_VALUES } from '@/content/about';
import { pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import a from './about.module.css';

const DESCRIPTION =
  'About RunMyPG — PG management software for Indian paying guest and hostel owners. Occupancy, rent, tenants and deposits from web and Android.';

export const metadata = pageMetadata({
  title: 'About RunMyPG',
  description: DESCRIPTION,
  path: '/about',
});

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${SITE_NAME}`,
    url: `${SITE_URL}/about`,
    description: DESCRIPTION,
    mainEntity: { '@id': `${SITE_URL}/#organization` },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <MarketingFrame navScrolled>
        <div className={a.page}>
          <p className={a.crumb}>
            <Link href="/">Home</Link>
            {' / '}
            About
          </p>

          <header className={a.hero}>
            <p className={a.kicker}>Our story</p>
            <h1 className={a.title}>About RunMyPG</h1>
            <p className={a.lead}>
              RunMyPG is PG management software for owners across India. We exist so you can see every
              bed, every pending rent, and every deposit — from a laptop at the desk or a phone at the
              gate — without hotel software or a graveyard of spreadsheets.
            </p>
            <div className={a.ctas}>
              <Link href="/signup" className={a.primary}>
                Get started →
              </Link>
              <Link href="/contact" className={a.secondary}>
                Contact us
              </Link>
            </div>
          </header>

          <div className={a.band}>
            <div className={a.inner}>
              <p className={a.kicker}>Why we built it</p>
              <h2 className={a.bandTitle}>Built for Indian PG &amp; hostel operators</h2>
              <p>
                PG owners spend evenings reconciling WhatsApp, Excel and a caretaker’s memory. Empty
                beds hide. Rent “I’ll pay Monday” never becomes a list. Deposits turn into arguments at
                checkout.
              </p>
              <p>
                We started RunMyPG to replace that mess with one owner console: rooms and beds, tenants,
                monthly bills, security deposits. The Android app uses the same login so on-site checks
                match what you see at home. It is free while we are in beta.
              </p>
            </div>
          </div>

          <section className={a.section}>
            <p className={a.kicker}>Mission &amp; values</p>
            <h2 className={a.bandTitle}>What we stand for</h2>
            <div className={a.values}>
              {ABOUT_VALUES.map((item) => (
                <article key={item.title} className={a.card}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={a.section} style={{ paddingTop: 24 }}>
            <p className={a.kicker}>Why owners pick us</p>
            <h2 className={a.bandTitle}>Why RunMyPG</h2>
            <div className={a.why}>
              {ABOUT_REASONS.map((item) => (
                <div key={item.title} className={a.whyItem}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className={a.ctaBlock}>
            <h2>Start managing your PG from one desk.</h2>
            <p>Create a free account — no credit card. Web console and Android stay in sync.</p>
            <Link href="/signup">Create free account →</Link>
          </div>
        </div>
      </MarketingFrame>
    </>
  );
}
