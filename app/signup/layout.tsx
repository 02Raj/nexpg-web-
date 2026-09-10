import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Create a free PG owner account',
  description:
    'Sign up for RunMyPG — free PG management software for owners in India. Track beds, rent, tenants and security deposits from web and Android.',
  path: '/signup',
});

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
