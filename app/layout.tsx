import './globals.css';
import { fontClassNames } from './fonts';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastViewport } from '@/components/ToastViewport';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'RunMyPG — PG Management Made Simple',
  description:
    'Manage beds, tenants, rent, bills, deposits and daily PG operations from one place with RunMyPG.',
  manifest: '/manifest.json',
  metadataBase: new URL('https://www.runmypg.in'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-icon', type: 'image/png', sizes: '180x180' }],
    shortcut: '/favicon.svg',
  },
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
    <html lang="en" className={fontClassNames}>
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
            <ToastViewport />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
