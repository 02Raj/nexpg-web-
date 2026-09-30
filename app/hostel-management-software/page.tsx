import { SolutionLanding } from '@/components/marketing/SolutionLanding';
import { getSolution } from '@/content/solutions';
import { pageMetadata } from '@/lib/seo';

const PAGE = getSolution('hostel-management-software')!;

export const metadata = pageMetadata({
  title: PAGE.title,
  description: PAGE.description,
  path: PAGE.path,
  keywords: [
    'hostel management software',
    'hostel management software India',
    'hostel occupancy software',
    'sharing PG software',
  ],
});

export default function HostelManagementSoftwarePage() {
  return <SolutionLanding page={PAGE} />;
}
