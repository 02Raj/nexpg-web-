import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { MarketingFrame } from '@/components/marketing/MarketingFrame';
import { CONTACT, MAILTO, WHATSAPP_URL } from '@/content/contact';
import { pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import blog from '../blog/blog.module.css';
import c from './contact.module.css';

export const metadata = pageMetadata({
  title: 'Contact RunMyPG',
  description:
    'Talk to RunMyPG — WhatsApp, sales, support and general contact for PG owners in India.',
  path: '/contact',
});

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${SITE_NAME}`,
    url: `${SITE_URL}/contact`,
    mainEntity: { '@id': `${SITE_URL}/#organization` },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <MarketingFrame navScrolled>
        <div className={blog.page}>
          <header className={blog.hero}>
            <p className={blog.kicker}>Contact</p>
            <h1 className={blog.title}>We’re here.</h1>
            <p className={blog.lead}>
              WhatsApp for a quick reply. Email sales, support or the general inbox — all official{' '}
              {SITE_NAME} addresses.
            </p>
          </header>

          <div className={c.wrap}>
            <div className={c.grid}>
              <a className={`${c.card} ${c.wa}`} href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <p className={c.label}>WhatsApp</p>
                <p className={c.value}>{CONTACT.phoneDisplay}</p>
                <p className={c.hint}>Chat with us on WhatsApp — usually the fastest.</p>
              </a>
              <a className={c.card} href={MAILTO.contact}>
                <p className={c.label}>General</p>
                <p className={c.value}>{CONTACT.emails.contact}</p>
                <p className={c.hint}>Anything that isn’t clearly sales or a product issue.</p>
              </a>
              <a className={c.card} href={MAILTO.sales}>
                <p className={c.label}>Sales</p>
                <p className={c.value}>{CONTACT.emails.sales}</p>
                <p className={c.hint}>Onboarding, demos, and questions before you sign up.</p>
              </a>
              <a className={c.card} href={MAILTO.support}>
                <p className={c.label}>Support</p>
                <p className={c.value}>{CONTACT.emails.support}</p>
                <p className={c.hint}>Account, billing date, Android app, or a bug in the console.</p>
              </a>
            </div>
            <p className={blog.lead} style={{ marginTop: 28, textAlign: 'center' }}>
              Prefer the product first?{' '}
              <Link href="/signup" style={{ fontWeight: 600, color: 'var(--ink)' }}>
                Create a free account
              </Link>
              .
            </p>
          </div>
        </div>
      </MarketingFrame>
    </>
  );
}
