import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Page not found',
  description: 'This page does not exist on RunMyPG.',
  path: '/',
  index: false,
});

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ maxWidth: 420, textAlign: 'center' }}>
        <p className="kicker">404</p>
        <h1 className="display" style={{ marginTop: 8 }}>
          Page not found
        </h1>
        <p className="bodyMuted" style={{ marginTop: 12, lineHeight: 1.6 }}>
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <p style={{ marginTop: 24 }}>
          <Link href="/" style={{ fontWeight: 600 }}>
            Back to RunMyPG
          </Link>
        </p>
      </div>
    </div>
  );
}
