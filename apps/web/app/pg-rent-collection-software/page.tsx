import { SolutionLanding } from '@/components/marketing/SolutionLanding';
import { getSolution } from '@/content/solutions';
import { pageMetadata } from '@/lib/seo';

const PAGE = getSolution('pg-rent-collection-software')!;

export const metadata = pageMetadata({
  title: PAGE.title,
  description: PAGE.description,
  path: PAGE.path,
  keywords: [
    'PG rent collection software',
    'PG billing software',
    'PG rent tracker',
    'paying guest rent software',
  ],
});

export default function PgRentCollectionSoftwarePage() {
  return <SolutionLanding page={PAGE} />;
}
