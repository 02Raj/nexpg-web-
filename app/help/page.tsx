import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { MarketingFrame } from '@/components/marketing/MarketingFrame';
import { CONTACT, MAILTO } from '@/content/contact';
import { HELP_CATEGORIES, HELP_FAQS } from '@/content/help';
import { pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import h from './help.module.css';

const DESCRIPTION =
  'RunMyPG help for PG owners: sign-up and email confirm, property and beds, occupancy, tenants, deposits, monthly bills, and the Android app.';

export const metadata = pageMetadata({
  title: 'Help Center',
  description: DESCRIPTION,
  path: '/help',
});

export default function HelpPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: `${SITE_NAME} Help Center`,
    url: `${SITE_URL}/help`,
    description: DESCRIPTION,
    mainEntity: HELP_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <MarketingFrame navScrolled>
        <div className={h.page}>
          <p className={h.crumb}>
            <Link href="/">Home</Link>
            {' / '}
            Help Center
          </p>
          <header className={h.hero}>
            <p className={h.kicker}>Support</p>
            <h1 className={h.title}>How can we help?</h1>
            <p className={h.lead}>
              Short guides for the owner console as it exists today — not a copy of another product’s docs. Start with
              the account, then the building, then beds and bills.
            </p>
          </header>

          <h2 className={h.sectionTitle}>By category</h2>
          <div className={h.grid}>
            {HELP_CATEGORIES.map((cat) => (
              <article key={cat.id} className={h.card} id={cat.id}>
                <h3 className={h.cardTitle}>{cat.title}</h3>
                <p className={h.cardBlurb}>{cat.blurb}</p>
                {cat.topics.map((topic) => (
                  <div key={topic.id} className={h.topic}>
                    <p className={h.topicTitle}>{topic.title}</p>
                    <ul>
                      {topic.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </article>
            ))}
          </div>

          <h2 className={h.sectionTitle}>Common questions</h2>
          <div className={h.faqs}>
            {HELP_FAQS.map((item) => (
              <details key={item.q} className={h.faq}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>

          <div className={h.cta}>
            <p className={h.ctaKicker}>Still stuck?</p>
            <h2 className={h.ctaTitle}>Write to support</h2>
            <p className={h.ctaLead}>
              Include the email you sign in with, the property name, and what you expected to see. We reply from{' '}
              {CONTACT.emails.support}.
            </p>
            <div className={h.ctaRow}>
              <a href={MAILTO.support} className={h.primary}>
                Email support
              </a>
              <Link href="/contact" className={h.secondary}>
                All contact options
              </Link>
            </div>
          </div>
        </div>
      </MarketingFrame>
    </>
  );
}
