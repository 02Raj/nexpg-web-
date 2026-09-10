export const dynamic = 'force-dynamic';

import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'RunMyPG — PG Management Made Simple',
  description:
    'Manage beds, tenants, rent, bills, deposits and daily PG operations from one place with RunMyPG.',
  manifest: '/manifest.json',
  metadataBase: new URL('https://www.runmypg.in'),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RunMyPG',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#16302B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
