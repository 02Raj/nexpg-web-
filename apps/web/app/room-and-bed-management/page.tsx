import { SolutionLanding } from '@/components/marketing/SolutionLanding';
import { getSolution } from '@/content/solutions';
import { pageMetadata } from '@/lib/seo';

const PAGE = getSolution('room-and-bed-management')!;

export const metadata = pageMetadata({
  title: PAGE.title,
  description: PAGE.description,
  path: PAGE.path,
  keywords: [
    'room and bed management software',
    'PG occupancy management software',
    'hostel bed management software India',
    'PG room occupancy app',
  ],
});

export default function RoomAndBedManagementPage() {
  return <SolutionLanding page={PAGE} />;
}
