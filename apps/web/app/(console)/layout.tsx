import { ConsoleLayoutClient } from './ConsoleLayoutClient';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Owner console',
  description: 'RunMyPG owner console.',
  path: '/dashboard',
  index: false,
});

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return <ConsoleLayoutClient>{children}</ConsoleLayoutClient>;
}
