export const dynamic = 'force-dynamic';

import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NexPG — PG Management Made Simple',
  description:
    'Manage beds, tenants, rent, bills, deposits and daily PG operations from one place with NexPG.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
