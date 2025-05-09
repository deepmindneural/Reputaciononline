/**
 * Utilidad para cargar Mapbox GL de forma segura en Next.js 13.0.7
 * Esta implementaciu00f3n evita problemas de SSR con mapbox-gl
 */

// Definir una variable global para mantener la instancia de mapboxgl
let mapboxgl: any = null;
let mapboxCssLoaded = false;

// Funciu00f3n para cargar mapbox-gl dinu00e1micamente (solo en el cliente)
export function loadMapbox() {
  if (typeof window === 'undefined') {
    return null; // Retornamos null en el servidor
  }
  
  if (mapboxgl) {
    return mapboxgl; // Ya estu00e1 cargado, retornamos la instancia existente
  }
  
  try {
    // Intentar cargar mapbox-gl
    mapboxgl = require('mapbox-gl');
    
    // Cargar el CSS si au00fan no se ha cargado
    if (!mapboxCssLoaded) {
      // Agregar el CSS directamente al head del documento
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      document.head.appendChild(link);
      mapboxCssLoaded = true;
    }
    
    return mapboxgl;
  } catch (error) {
    console.error('Error al cargar mapbox-gl:', error);
    return null;
  }
}

// Funciu00f3n para inicializar el token de Mapbox
export function setMapboxToken(token: string) {
  const mapbox = loadMapbox();
  if (mapbox) {
    mapbox.accessToken = token;
    return true;
  }
  return false;
}

// Exportamos una funciu00f3n para obtener la instancia actual
export function getMapboxInstance() {
  return mapboxgl;
}

// Exportar un objeto vacu00edo por defecto para compatibilidad con SSR
export default {
  loadMapbox,
  setMapboxToken,
  getMapboxInstance
};
