"use client";

import React, { useRef, useEffect, useState } from 'react';

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

interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  color?: string;
  size?: number;
}

interface MapboxMapProps {
  apiKey: string;
  markers?: MarkerData[];
  center?: [number, number]; // [longitud, latitud]
  zoom?: number;
  style?: string;
  height?: string | number;
  width?: string | number;
  interactive?: boolean;
  onMarkerClick?: (marker: MarkerData) => void;
}

const defaultCenter: [number, number] = [-74.08175, 4.60971]; // Bogotá, Colombia

const MapboxMap: React.FC<MapboxMapProps> = ({
  apiKey,
  markers = [],
  center = defaultCenter,
  zoom = 5,
  style = 'mapbox://styles/mapbox/streets-v12',
  height = 400,
  width = '100%',
  interactive = true,
  onMarkerClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRefs = useRef<{ [id: string]: mapboxgl.Marker }>({});
  const [mapReady, setMapReady] = useState(false);

  // Inicializar el mapa cuando el componente se monta
  useEffect(() => {
    // Verificar que estamos en el navegador y que el contenedor existe
    if (typeof window === 'undefined' || !mapContainer.current) return;
    
    // Validar que la API key esté presente
    if (!apiKey || apiKey.trim() === '') {
      console.error('Mapbox API key is missing or empty');
      return;
    }
    
    try {
      // Establecer la API key de Mapbox
      mapboxgl.accessToken = apiKey;
      
      // Verificar si ya hay un mapa inicializado
      if (map.current) return;
      
      console.log('Initializing Mapbox with API key:', apiKey.substring(0, 5) + '...');
      
      // Crear la instancia del mapa
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: style,
        center: center,
        zoom: zoom,
        interactive: interactive,
      });
      
      // Agregar controles de navegación si el mapa es interactivo
      if (interactive) {
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      }
      
      // Marcar cuando el mapa esté listo
      map.current.on('load', () => {
        console.log('Mapbox map loaded successfully');
        setMapReady(true);
      });
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
    }
    
    // Limpieza al desmontar
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [apiKey, center, zoom, style, interactive]);
  
  // Agregar/actualizar marcadores cuando cambian
  useEffect(() => {
    if (!map.current || !mapReady) return;
    
    // Limpiar marcadores anteriores
    Object.values(markerRefs.current).forEach(marker => marker.remove());
    markerRefs.current = {};
    
    // Agregar nuevos marcadores
    markers.forEach(marker => {
      // Crear elemento para el marcador
      const el = document.createElement('div');
      el.className = 'mapbox-custom-marker';
      el.style.width = `${marker.size || 30}px`;
      el.style.height = `${marker.size || 30}px`;
      el.style.borderRadius = '50%';
      el.style.backgroundColor = marker.color || '#3B82F6';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      // Crear popup si hay descripción
      let popup;
      if (marker.description) {
        popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <h3 style="margin: 0 0 5px; font-weight: bold;">${marker.title}</h3>
            <p style="margin: 0;">${marker.description}</p>
          `);
      }
      
      // Crear y agregar el marcador al mapa
      // Verificar que el mapa existe antes de agregar el marcador
      if (!map.current) return;

      const mapMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .setPopup(popup)
        .addTo(map.current);
      
      // Guardar referencia
      markerRefs.current[marker.id] = mapMarker;
      
      // Agregar evento de clic
      if (onMarkerClick) {
        el.addEventListener('click', () => {
          onMarkerClick(marker);
        });
      }
    });
    
  }, [markers, mapReady, onMarkerClick]);
  
  return (
    <div 
      ref={mapContainer} 
      className="rounded-lg overflow-hidden shadow-md" 
      style={{ 
        height: typeof height === 'number' ? `${height}px` : height, 
        width: typeof width === 'number' ? `${width}px` : width 
      }}
    />
  );
};

export default MapboxMap;
