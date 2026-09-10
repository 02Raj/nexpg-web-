import { LegalDoc } from '@/components/marketing/LegalDoc';
import { TERMS_SECTIONS } from '@/content/legal';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Terms of Service',
  description:
    'Terms for using RunMyPG’s owner console and Android app. Free in beta. Not a payment gateway or tenant portal.',
  path: '/terms',
});

export default function TermsPage() {
  return <LegalDoc title="Terms of Service" kicker="Legal" sections={TERMS_SECTIONS} />;
}
