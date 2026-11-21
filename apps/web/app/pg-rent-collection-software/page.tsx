import { SolutionLanding } from '@/components/marketing/SolutionLanding';
import { getSolution } from '@/content/solutions';
import { pageMetadata } from '@/lib/seo';

const PAGE = getSolution('pg-rent-collection-software')!;

export const metadata = pageMetadata({
  title: 'PG Rent Collection Software & App India — Free Beta | RunMyPG',
  description:
    'Free PG rent collection software and app for Indian owners. Track paid vs pending rent, record UPI or cash, and manage billing without WhatsApp chaos.',
  path: PAGE.path,
  keywords: [
    'pg rent collection app india',
    'pg rent collection software',
    'pg rent collection software free india',
    'automated rent collection pg india',
    'pg billing software',
    'pg rent tracker',
    'paying guest rent software',
  ],
});

export default function PgRentCollectionSoftwarePage() {
  return <SolutionLanding page={PAGE} />;
}
