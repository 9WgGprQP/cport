/** @type {import('next').NextConfig} */
const nextConfig = {
  // (*opzionale*) altri settings...
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
module.exports = nextConfig;
