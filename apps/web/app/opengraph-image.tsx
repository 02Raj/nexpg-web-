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
              background: '#16302B',
              border: '1px solid rgba(247, 245, 241, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="56" height="56" viewBox="0 0 32 32">
              <rect x="7.2" y="5" width="17.6" height="2.2" rx="0.4" fill="#F7F5F1" />
              <rect x="8" y="6.4" width="16" height="20.2" rx="1.1" fill="#F7F5F1" />
              <rect x="10.2" y="8.6" width="4" height="3.1" rx="0.35" fill="#16302B" />
              <rect x="17.8" y="8.6" width="4" height="3.1" rx="0.35" fill="#16302B" />
              <rect x="10.2" y="13.4" width="4" height="3.1" rx="0.35" fill="#16302B" />
              <rect x="17.8" y="13.4" width="4" height="3.1" rx="0.35" fill="#16302B" />
              <rect x="13.6" y="21.2" width="4.8" height="5.4" rx="0.45" fill="#C97A2B" />
            </svg>
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
            PG management software for Indian PG and hostel owners. Occupancy, tenants, rent and deposits — web console and Android app.
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
