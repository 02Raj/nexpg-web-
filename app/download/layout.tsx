import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Android App for PG Owners',
  description:
    'Download the RunMyPG Android app for PG owners. Same login as the web console — beds, rent, tenants and bills stay in sync on site.',
  path: '/download',
});

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
