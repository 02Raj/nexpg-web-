import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#16302B',
          borderRadius: 36,
        }}
      >
        <svg width="180" height="180" viewBox="0 0 32 32">
          <rect x="7.2" y="5" width="17.6" height="2.2" rx="0.4" fill="#F7F5F1" />
          <rect x="8" y="6.4" width="16" height="20.2" rx="1.1" fill="#F7F5F1" />
          <rect x="10.2" y="8.6" width="4" height="3.1" rx="0.35" fill="#16302B" />
          <rect x="17.8" y="8.6" width="4" height="3.1" rx="0.35" fill="#16302B" />
          <rect x="10.2" y="13.4" width="4" height="3.1" rx="0.35" fill="#16302B" />
          <rect x="17.8" y="13.4" width="4" height="3.1" rx="0.35" fill="#16302B" />
          <rect x="13.6" y="21.2" width="4.8" height="5.4" rx="0.45" fill="#C97A2B" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
