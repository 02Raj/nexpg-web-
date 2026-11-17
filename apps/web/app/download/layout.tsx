import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Android App for PG Owners',
  description:
    'Download the RunMyPG Android app. Owner dashboard on the web; occupancy, tenants and rent on your phone.',
  path: '/download',
});

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
