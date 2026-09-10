import { ImageResponse } from 'next/og';

export const alt = 'RunMyPG — PG management software for owners in India';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#16302B',
          color: '#F7F5F1',
          padding: '64px 72px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: '#F7F5F1',
              color: '#16302B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            R
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>RunMyPG</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              maxWidth: 920,
            }}
          >
            PG management software for owners in India.
          </div>
          <div style={{ fontSize: 28, color: 'rgba(247, 245, 241, 0.72)', maxWidth: 820 }}>
            Beds, rent, tenants and deposits — web console + Android, always in sync.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 22,
            color: '#C97A2B',
            letterSpacing: '0.04em',
          }}
        >
          <span>www.runmypg.in</span>
          <span>Free while in beta</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
