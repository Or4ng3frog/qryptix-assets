const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    // wagmi's connectors barrel references optional connectors we don't use
    // (porto, tempo/accounts, metaMask SDK). Stub them so the build succeeds.
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(porto(\/internal)?|accounts|@metamask\/connect-evm)$/,
      })
    );
    return config;
  },
};

module.exports = nextConfig;
