/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignorar la verificación de la versión de Node.js
  experimental: {
    skipNodeCheck: true
  },
  // Otras configuraciones
  reactStrictMode: true,
  swcMinify: true
};

module.exports = nextConfig;
