/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['puppeteer'],
  },
  webpack: (config, { isServer }) => {
    // Puppeteer-related configs
    if (isServer) {
      config.externals.push('puppeteer');
    }
    return config;
  },
};

export default nextConfig; 
