/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Enable source maps in production to debug errors
  productionBrowserSourceMaps: true,
};

export default nextConfig;
