import { LegalDoc } from '@/components/marketing/LegalDoc';
import { COOKIE_SECTIONS } from '@/content/legal';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Cookie Policy',
  description:
    'Cookies and local storage on RunMyPG: necessary session for login, optional analytics off unless you allow them.',
  path: '/cookies',
});

export default function CookiesPage() {
  return <LegalDoc title="Cookie Policy" kicker="Legal" sections={COOKIE_SECTIONS} />;
}
