import { SolutionLanding } from '@/components/marketing/SolutionLanding';
import { getSolution } from '@/content/solutions';
import { pageMetadata } from '@/lib/seo';

const PAGE = getSolution('tenant-management-software')!;

export const metadata = pageMetadata({
  title: PAGE.title,
  description: PAGE.description,
  path: PAGE.path,
  keywords: [
    'tenant management software for PG',
    'PG tenant management software India',
    'hostel resident management software',
    'PG tenant records app',
  ],
});

export default function TenantManagementSoftwarePage() {
  return <SolutionLanding page={PAGE} />;
}
