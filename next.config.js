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
  trailingSlash: false,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Configuración adicional para optimizar la carga inicial
  poweredByHeader: false, // Elimina el header X-Powered-By para mayor seguridad
  // Optimización del rendimiento
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Configuración para compatibilidad con Node.js 18.16.0
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  // Mejora de rewrites para manejar múltiples patrones de URL
  async rewrites() {
    return [
      // API rewrites
      {
        source: '/api/search/',
        destination: '/api/search',
      },
      // Redirecciones para el dashboard
      {
        source: '/dashboard',
        destination: '/dashboard/menciones',
      },
      // Redirecciones para el admin
      {
        source: '/admin',
        destination: '/admin/creditos',
      },
    ];
  },
  // Redirecciones para rutas erróneas o antiguas
  async redirects() {
    return [
      {
        source: '/dashboard/redes',
        destination: '/dashboard/redes-sociales',
        permanent: true,
      },
      {
        source: '/dashboard/admin',
        destination: '/admin/creditos',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
