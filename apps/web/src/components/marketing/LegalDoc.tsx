import Link from 'next/link';
import { MarketingFrame } from '@/components/marketing/MarketingFrame';
import { LEGAL_UPDATED, type LegalSection } from '@/content/legal';
import l from './legal.module.css';

const LINKS = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/refund', label: 'Refunds' },
  { href: '/cookies', label: 'Cookies' },
  { href: '/cookies/preferences', label: 'Preferences' },
];

export function LegalDoc({
  title,
  kicker,
  sections,
}: {
  title: string;
  kicker: string;
  sections: LegalSection[];
}) {
  return (
    <MarketingFrame navScrolled>
      <div className={l.page}>
        <div className={l.wrap}>
          <p className={l.crumb}>
            <Link href="/">Home</Link>
            {' / '}
            {title}
          </p>
          <p className={l.kicker}>{kicker}</p>
          <h1 className={l.title}>{title}</h1>
          <p className={l.updated}>Last updated {LEGAL_UPDATED}. This is RunMyPG’s own document — not a clone of another product’s policy.</p>
          <ul className={l.nav}>
            {LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          {sections.map((section) => (
            <section key={section.heading} className={l.section}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </MarketingFrame>
  );
}
