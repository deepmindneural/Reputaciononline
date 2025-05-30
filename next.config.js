/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuraciones principales
  reactStrictMode: true,
  swcMinify: false, // Desactivar swcMinify para evitar problemas de compilación
  
  // Configuración para entornos de producción
  productionBrowserSourceMaps: false,
  
  // Optimizaciones
  optimizeFonts: true,
  compress: true,
  
  // Configuración de webpack para resolver problemas de SWC
  webpack: (config, { isServer }) => {
    // Prevenir el uso de SWC para React Refresh
    if (!isServer) {
      config.resolve.alias['next/dist/compiled/react-refresh/runtime'] = 
        require.resolve('react-refresh/runtime');
    }
    return config;
  }
};

module.exports = nextConfig;
