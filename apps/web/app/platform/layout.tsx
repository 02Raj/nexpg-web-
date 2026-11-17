import { PlatformLayoutClient } from './PlatformLayoutClient';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Platform admin',
  description: 'RunMyPG platform administration.',
  path: '/platform',
  index: false,
});

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <PlatformLayoutClient>{children}</PlatformLayoutClient>;
}
