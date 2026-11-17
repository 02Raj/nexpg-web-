import { LegalDoc } from '@/components/marketing/LegalDoc';
import { REFUND_SECTIONS } from '@/content/legal';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Refund Policy',
  description:
    'RunMyPG is free in beta, so there is nothing to refund today. This page says what we will do if paid plans start later.',
  path: '/refund',
});

export default function RefundPage() {
  return <LegalDoc title="Refund Policy" kicker="Legal" sections={REFUND_SECTIONS} />;
}
