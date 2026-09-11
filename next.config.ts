import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const noIndexHeaders = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/(.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2))',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      ...[
        '/dashboard',
        '/dashboard/:path*',
        '/beds',
        '/beds/:path*',
        '/bills',
        '/bills/:path*',
        '/tenant',
        '/tenant/:path*',
        '/setup',
        '/setup/:path*',
        '/more',
        '/more/:path*',
        '/platform',
        '/platform/:path*',
        '/auth',
        '/auth/:path*',
        '/login',
        '/forgot-password',
      ].map((source) => ({ source, headers: noIndexHeaders })),
    ];
  },
};

export default nextConfig;
