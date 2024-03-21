/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    //for production
    ignoreBuildErrors: true,
  },
  eslint: {
    //for production
    ignoreDuringBuilds: true,
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,

  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA(nextConfig);
