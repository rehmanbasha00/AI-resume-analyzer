/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Stops webpack from trying to read pdf.js's worker file as normal
    // JavaScript. We load that worker from a CDN link instead, so this
    // file just needs to be copied, not parsed or minified.
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?mjs$/,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;