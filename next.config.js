/** @type {import('next').NextConfig} */

const cacheConfig = require("./cacheConfig");

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "torqbit-dev.b-cdn.net",
      "lh3.googleusercontent.com",
      "iframe.mediadelivery.net",
      "torqbit.b-cdn.net",
      "cdn.torqbit.com",
    ],
  },

  productionBrowserSourceMaps: false,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: "memory",
      });
      config.cache.maxMemoryGenerations = 0;
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

  runtimeCaching: cacheConfig,
});

module.exports = withPWA(nextConfig);
