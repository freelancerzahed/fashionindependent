/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features
  experimental: {
    // Add any experimental features here
  },

  // Image optimization configuration
  images: {
    unoptimized: true,
  },

  // Headers configuration
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // Development logging configuration
  logging: {
    level: process.env.NODE_ENV === 'development' ? 'error' : 'warn',
  },

  poweredByHeader: false,
}

export default nextConfig
