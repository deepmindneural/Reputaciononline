/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuraciones estándar
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'graph.facebook.com', 'pbs.twimg.com', 'media.licdn.com', 'yt3.ggpht.com'],
  }
};

module.exports = nextConfig;
