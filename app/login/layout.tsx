import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Log in',
  description: 'Log in to your RunMyPG owner console to manage beds, rent, tenants and bills.',
  path: '/login',
  index: false,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
