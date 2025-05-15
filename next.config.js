/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true, // Habilita el directorio app (necesario para Next.js 13.0.7)
  },
  images: {
    domains: ['randomuser.me', 'images.unsplash.com'],
    unoptimized: true
  },
  // Utilizamos el sistema completo de rutas App Router sin exportPathMap
  trailingSlash: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Configuración adicional para optimizar la carga inicial
  poweredByHeader: false, // Elimina el header X-Powered-By para mayor seguridad
  // Optimización del rendimiento
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  }
}

module.exports = nextConfig
