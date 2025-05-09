"use client";

import React, { useRef, useEffect, useState } from 'react';
import Script from 'next/script';

interface Location {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitud, latitud]
  value: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface DirectMapboxProps {
  apiKey: string;
  locations: Location[];
  height?: number;
  title?: string;
  onLocationClick?: (location: Location) => void;
}

// Definición de mapboxgl para TypeScript (no se importa directamente)
declare global {
  interface Window {
    mapboxgl: any;
  }
}

const DirectMapbox: React.FC<DirectMapboxProps> = ({
  apiKey,
  locations = [],
  height = 400,
  title,
  onLocationClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const markers = useRef<any[]>([]);

  // Inicializar mapa cuando los scripts están cargados
  useEffect(() => {
    if (!scriptLoaded || !mapContainer.current || map.current) return;
    
    console.log('Inicializando mapa con DirectMapbox...');
    
    try {
      // Configurar el token
      window.mapboxgl.accessToken = apiKey;
      
      // Crear mapa
      map.current = new window.mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-74.297333, 4.570868], // Centro en Colombia
        zoom: 5,
        attributionControl: true
      });
      
      // Agregar controles de navegación
      map.current.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
      
      // Marcar cuando el mapa esté listo
      map.current.on('load', () => {
        console.log('Mapa cargado exitosamente');
        setMapLoaded(true);
        
        // Forzar redimensionamiento
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
          }
        }, 100);
      });
      
      // Manejar errores
      map.current.on('error', (e: any) => {
        console.error('Error en el mapa:', e);
      });
    } catch (error) {
      console.error('Error al inicializar mapa:', error);
    }
    
    // Limpieza al desmontar
    return () => {
      if (map.current) {
        markers.current.forEach(marker => marker.remove());
        map.current.remove();
      }
    };
  }, [apiKey, scriptLoaded]);
  
  // Añadir marcadores cuando el mapa esté cargado
  useEffect(() => {
    if (!mapLoaded || !map.current || locations.length === 0) return;
    
    // Limpiar marcadores anteriores
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Crear límites para ajustar la vista
    const bounds = new window.mapboxgl.LngLatBounds();
    
    // Añadir nuevos marcadores
    locations.forEach(location => {
      // Determinar color basado en sentimiento
      let color = '#3B82F6'; // azul por defecto
      if (location.sentiment === 'positive') color = '#10B981'; // verde
      else if (location.sentiment === 'negative') color = '#EF4444'; // rojo
      else if (location.sentiment === 'neutral') color = '#9CA3AF'; // gris
      
      // Calcular tamaño basado en valor
      const size = Math.max(20, Math.min(40, 20 + (location.value / 100)));
      
      // Crear elemento para el marcador
      const el = document.createElement('div');
      el.className = 'mapbox-marker';
      el.style.backgroundColor = color;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      
      // Añadir número para marcadores grandes
      if (location.value > 100) {
        const text = document.createElement('span');
        text.style.color = 'white';
        text.style.fontWeight = 'bold';
        text.style.fontSize = `${size/3}px`;
        text.textContent = `${location.value}`;
        el.appendChild(text);
      }
      
      // Crear popup con información
      const popup = new window.mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 8px; font-weight: bold; font-size: 16px;">${location.name}</h3>
            <p style="margin: 0; color: #4B5563;">
              <strong style="color: #1D4ED8;">${location.value}</strong> menciones
            </p>
          </div>
        `);
      
      // Crear y añadir el marcador
      const marker = new window.mapboxgl.Marker(el)
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map.current);
      
      // Añadir manejador de eventos
      if (onLocationClick) {
        el.addEventListener('click', () => {
          onLocationClick(location);
        });
      }
      
      // Guardar referencia y extender límites
      markers.current.push(marker);
      bounds.extend(location.coordinates);
    });
    
    // Ajustar la vista para mostrar todos los marcadores
    if (locations.length > 1) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 7
      });
    }
  }, [locations, mapLoaded, onLocationClick]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      {title && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      
      <div style={{ position: 'relative', height: `${height}px` }}>
        {/* Scripts de Mapbox */}
        <Script
          src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
          strategy="afterInteractive"
          onLoad={() => {
            console.log('Script de Mapbox cargado');
            setScriptLoaded(true);
          }}
        />
        
        {/* Estilos de Mapbox */}
        <style jsx global>{`
          .mapboxgl-map {
            font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
          }
        `}</style>
        
        {/* Contenedor del mapa */}
        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        
        {/* Indicador de carga */}
        {!mapLoaded && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)'
          }}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMapbox;
