'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#F7F5F1', color: '#16302B' }}>
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
          <div style={{ maxWidth: 420, textAlign: 'center' }}>
            <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>
              RunMyPG
            </p>
            <h1 style={{ fontSize: 28, margin: '8px 0 0' }}>Unexpected error</h1>
            <p style={{ marginTop: 12, lineHeight: 1.6, opacity: 0.85 }}>
              Please refresh the page or try again in a moment.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                marginTop: 24,
                padding: '12px 20px',
                borderRadius: 8,
                border: 'none',
                background: '#16302B',
                color: '#F7F5F1',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
