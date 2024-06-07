/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    if (cfg.cache && !dev) {
      cfg.cache = Object.freeze({
        type: "memory",
      });
      cfg.cache.maxMemoryGenerations = 0;
    }
    // Important: return the modified config
    return config;
  },
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
