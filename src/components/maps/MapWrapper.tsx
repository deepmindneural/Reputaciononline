"use client";

import React, { useEffect, useState } from 'react';

// Importación dinámica para evitar problemas de SSR con Next.js 13.0.7
let mapboxgl: any = null;

// Un guard para evitar problemas con mapbox-gl durante SSR
if (typeof window !== 'undefined') {
  try {
    mapboxgl = require('mapbox-gl');
    require('mapbox-gl/dist/mapbox-gl.css');
  } catch (e) {
    console.error('Error cargando mapbox-gl:', e);
  }
}

// Constante global para la API key de Mapbox - Hardcodeada como fallback
const FALLBACK_MAPBOX_API_KEY = 'pk.eyJ1Ijoia2lldjk5IiwiYSI6ImNqNmJrYTZ3bzFnYTYzM3JwcG1mdXlvbTEifQ.p2qnpIhHV-mjXv9bLYT-Cw'; // API key confirmada

interface MapWrapperProps {
  children: React.ReactNode;
  apiKey?: string;
}

/**
 * Componente para inicializar Mapbox de manera segura en aplicaciones Next.js
 * Se asegura de que la API key esté configurada correctamente antes de renderizar los componentes hijos
 */
const MapWrapper: React.FC<MapWrapperProps> = ({ children, apiKey }) => {
  const [isMapReady, setIsMapReady] = useState(false);
  
  useEffect(() => {
    // Verificar que estamos en el navegador
    if (typeof window === 'undefined') return;
    
    // Obtener la API key de las props o del entorno
    const mapboxApiKey = apiKey || 
                         process.env.NEXT_PUBLIC_MAPBOX_API_KEY || 
                         FALLBACK_MAPBOX_API_KEY;
    
    try {
      // Verificar si ya se ha configurado Mapbox
      if (!mapboxgl.accessToken) {
        console.log('Initializing Mapbox with API key from MapWrapper:', 
                    mapboxApiKey ? `${mapboxApiKey.substring(0, 10)}...` : 'None provided');
        
        // Configurar la API key de Mapbox
        mapboxgl.accessToken = mapboxApiKey;
      }
      
      // Marcar que el mapa está listo
      setIsMapReady(true);
    } catch (error) {
      console.error('Error initializing Mapbox in MapWrapper:', error);
    }
  }, [apiKey]);
  
  // Solo renderizar los componentes hijos cuando Mapbox esté inicializado
  return isMapReady ? (
    <>{children}</>
  ) : (
    <div className="flex justify-center items-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <p className="text-gray-500 dark:text-gray-400">Cargando mapa...</p>
    </div>
  );
};

export default MapWrapper;
