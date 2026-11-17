import { SolutionLanding } from '@/components/marketing/SolutionLanding';
import { getSolution } from '@/content/solutions';
import { pageMetadata } from '@/lib/seo';

const PAGE = getSolution('pg-management-software')!;

export const metadata = pageMetadata({
  title: PAGE.title,
  description: PAGE.description,
  path: PAGE.path,
  keywords: [
    'PG management software',
    'PG management software India',
    'paying guest management software',
    'PG owner software',
  ],
});

export default function PgManagementSoftwarePage() {
  return <SolutionLanding page={PAGE} />;
}
