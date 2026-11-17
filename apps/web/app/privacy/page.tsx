import { LegalDoc } from '@/components/marketing/LegalDoc';
import { PRIVACY_SECTIONS } from '@/content/legal';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How RunMyPG collects and uses owner and tenant data on the web console and Android app. Written for the product as it works today.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return <LegalDoc title="Privacy Policy" kicker="Legal" sections={PRIVACY_SECTIONS} />;
}
