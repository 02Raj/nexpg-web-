'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ maxWidth: 420, textAlign: 'center' }}>
        <p className="kicker">Something went wrong</p>
        <h1 className="display" style={{ marginTop: 8 }}>
          We couldn&apos;t load this page
        </h1>
        <p className="bodyMuted" style={{ marginTop: 12, lineHeight: 1.6 }}>
          Try again. If the problem continues, sign out and sign back in, or contact support.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '12px 20px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--ink, #16302B)',
              color: 'var(--paper, #F7F5F1)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              padding: '12px 20px',
              borderRadius: 8,
              border: '1px solid var(--ink, #16302B)',
              color: 'var(--ink, #16302B)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
