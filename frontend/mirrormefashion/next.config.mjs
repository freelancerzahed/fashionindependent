/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/three/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    config.module.rules.push({
      test: /\.js$/,
      include: /three\/examples/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    // Resolve Three.js modules properly
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    // Ensure proper module resolution for Three.js examples
    config.resolve.alias = {
      ...config.resolve.alias,
      three: 'three',
    };

    return config;
  },
  transpilePackages: ['three'],

  // ✅ Updated experimental section
  experimental: {
    allowedDevOrigins: ['http://192.168.0.102:3000'], // Allow LAN dev origin
  },
};

export default nextConfig;
