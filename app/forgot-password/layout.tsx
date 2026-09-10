import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Reset password',
  description: 'Reset your RunMyPG account password.',
  path: '/forgot-password',
  index: false,
});

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
