import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Account',
  description: 'RunMyPG account authentication.',
  path: '/auth',
  index: false,
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
