/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Security: Remove X-Powered-By header to prevent technology fingerprinting
  compress: true,

  // OWASP Enterprise Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), browsing-topics=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com",
              "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:",
              "img-src 'self' data: blob: https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org https://bhuvan.nrsc.gov.in",
              "connect-src 'self' https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org https://bhuvan.nrsc.gov.in"
            ].join('; ')
          }
        ]
      }
    ];
  }
};

export default nextConfig;
