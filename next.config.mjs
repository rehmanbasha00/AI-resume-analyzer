/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    // Copy pdf.js's worker file as-is, don't try to parse it as JS.
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?mjs$/,
      type: "asset/resource",
    });

    // Also tell the production compressor to skip this file entirely.
    // Without this, it still tries to minify it by file extension
    // and fails, even though the rule above stops it being parsed.
    if (!dev && config.optimization && config.optimization.minimizer) {
      config.optimization.minimizer.forEach((plugin) => {
        if (plugin.constructor.name === "TerserPlugin") {
          const existing = plugin.options.exclude;
          plugin.options.exclude = existing
            ? [].concat(existing, /pdf\.worker/)
            : /pdf\.worker/;
        }
      });
    }

    return config;
  },
};

export default nextConfig;