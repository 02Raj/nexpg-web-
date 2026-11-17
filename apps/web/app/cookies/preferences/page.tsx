import Link from 'next/link';
import { CookiePreferences } from '@/components/marketing/CookiePreferences';
import { MarketingFrame } from '@/components/marketing/MarketingFrame';
import { LEGAL_UPDATED } from '@/content/legal';
import { pageMetadata } from '@/lib/seo';
import l from '@/components/marketing/legal.module.css';

export const metadata = pageMetadata({
  title: 'Cookie Preferences',
  description: 'Choose necessary-only or optional analytics cookies for RunMyPG on this browser.',
  path: '/cookies/preferences',
});

export default function CookiePreferencesPage() {
  return (
    <MarketingFrame navScrolled>
      <div className={l.page}>
        <div className={l.wrap}>
          <p className={l.crumb}>
            <Link href="/">Home</Link>
            {' / '}
            <Link href="/cookies">Cookies</Link>
            {' / '}
            Preferences
          </p>
          <p className={l.kicker}>Legal</p>
          <h1 className={l.title}>Cookie Preferences</h1>
          <p className={l.updated}>Last updated {LEGAL_UPDATED}. Choices are stored on this device only.</p>
          <CookiePreferences />
        </div>
      </div>
    </MarketingFrame>
  );
}
