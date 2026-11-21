import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'PG Owner App India (Android) | Free APK Download',
  description:
    'Download the RunMyPG Android app for Indian PG and hostel owners. Track bed occupancy, tenant rent collections, and dues directly from your phone. 100% free beta.',
  path: '/download',
  keywords: [
    'pg owner app india',
    'pg owner app',
    'pg management app android',
    'paying guest owner app',
    'hostel owner app india',
    'pg rent collection app india',
    'pg occupancy tracking app',
  ],
});

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
