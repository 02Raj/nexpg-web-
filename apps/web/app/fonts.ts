import { Fraunces, IBM_Plex_Mono, Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-run-body',
});

export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  weight: ['600'],
  variable: '--font-run-display',
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600'],
  variable: '--font-run-mono',
});

export const fontClassNames = `${inter.variable} ${fraunces.variable} ${ibmPlexMono.variable}`;
