"use client";

import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
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

// Si estamos en el cliente y no existe window.mapboxgl
if (typeof window !== 'undefined' && !window.mapboxgl) {
  // @ts-ignore - Para evitar errores de SSR
  window.mapboxgl = mapboxgl;
}
import { BadgePesos } from '../ui/badge-pesos';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Location {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  reach?: number;
  interactions?: number;
}

interface MapboxGlobalMapProps {
  locations: Location[];
  apiKey: string;
  title?: string;
  height?: number;
  onLocationClick?: (location: Location) => void;
}

const getSentimentColor = (sentiment: string) => {
  switch(sentiment) {
    case 'positive': return '#10B981'; // verde
    case 'negative': return '#EF4444'; // rojo
    case 'neutral': return '#9CA3AF'; // gris
    default: return '#3B82F6'; // azul por defecto
  }
};

const MapboxGlobalMap: React.FC<MapboxGlobalMapProps> = ({
  locations = [],
  apiKey,
  title = 'Mapa global de menciones',
  height = 500,
  onLocationClick
}) => {
  const [popupInfo, setPopupInfo] = useState<Location | null>(null);
  
  // Convertir a estado reactivo los ajustes del mapa
  const [viewState, setViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 1
  });

  useEffect(() => {
    // Verificar que estamos en el navegador
    if (typeof window === 'undefined') return;
    
    // Usar directamente la API key hardcodeada proporcionada por el cliente
    const mapboxApiKey = 'pk.eyJ1Ijoia2lldjk5IiwiYSI6ImNqNmJrYTZ3bzFnYTYzM3JwcG1mdXlvbTEifQ.p2qnpIhHV-mjXv9bLYT-Cw';
    
    // Solo inicializar cuando hay ubicaciones
    if (locations.length === 0) return;
    
    try {
      // Establecer la API key de Mapbox explícitamente para garantizar que funcione
      console.log('Configurando Mapbox con API key hardcodeada');
      mapboxgl.accessToken = mapboxApiKey;
      
      console.log('Initializing MapboxGlobalMap with API key:', mapboxApiKey.substring(0, 5) + '...');
      
      // Calcular el centro óptimo basado en las ubicaciones proporcionadas
      if (locations.length === 1) {
        // Si solo hay una ubicación, centrar en ella con mayor zoom
        setViewState({
          latitude: locations[0].latitude,
          longitude: locations[0].longitude,
          zoom: 4
        });
      } else if (locations.length > 1) {
        // Si hay múltiples ubicaciones, calcular el centro promedio
        const lats = locations.map(loc => loc.latitude);
        const lngs = locations.map(loc => loc.longitude);
        const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        
        // Determinar el mejor nivel de zoom basado en la distancia entre ubicaciones
        const maxLat = Math.max(...lats);
        const minLat = Math.min(...lats);
        const maxLng = Math.max(...lngs);
        const minLng = Math.min(...lngs);
        
        // Calcular un nivel de zoom aproximado basado en la extensión
        // Valores más pequeños para latSpan y lngSpan darán zoom más alto
        const latSpan = maxLat - minLat;
        const lngSpan = maxLng - minLng;
        const zoom = Math.min(
          Math.max(1, 6 - Math.log(Math.max(latSpan, lngSpan) + 1) / Math.log(2)),
          6 // Zoom máximo para una vista global
        );
        
        setViewState({
          latitude: avgLat,
          longitude: avgLng,
          zoom
        });
      }
    } catch (error) {
      console.error('Error initializing MapboxGlobalMap:', error);
    }
  }, [apiKey, locations]);

  
  // Determinar el tamaño de los marcadores basado en el número de menciones
  const maxMentions = Math.max(...locations.map(loc => loc.count), 1);
  const getMarkerSize = (count: number) => {
    return Math.max(20, Math.min(50, (count / maxMentions) * 50));
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
      )}
      
      <div 
        className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
        style={{ height: `${height}px` }}
      >
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={apiKey}
          style={{ width: '100%', height: '100%' }}
        >
          {locations.map(location => (
            <Marker
              key={location.id}
              longitude={location.longitude}
              latitude={location.latitude}
              anchor="center"
              onClick={e => {
                // Prevenir propagación del evento para evitar que el mapa también reciba el clic
                e.originalEvent.stopPropagation();
                setPopupInfo(location);
                if (onLocationClick) onLocationClick(location);
              }}
            >
              <div 
                className="flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                style={{ 
                  width: `${getMarkerSize(location.count)}px`,
                  height: `${getMarkerSize(location.count)}px`,
                  borderRadius: '50%', 
                  backgroundColor: getSentimentColor(location.sentiment),
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              />
            </Marker>
          ))}
          
          {popupInfo && (
            <Popup
              anchor="top"
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              onClose={() => setPopupInfo(null)}
              className="z-10"
              maxWidth="300px"
            >
              <div className="p-2">
                <h3 className="text-sm font-bold">{popupInfo.city}, {popupInfo.country}</h3>
                
                <div className="mt-2 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Menciones:</span>
                    <span className="font-medium">{popupInfo.count.toLocaleString()}</span>
                  </div>
                  
                  {popupInfo.reach && (
                    <div className="flex justify-between">
                      <span>Alcance:</span>
                      <span className="font-medium">{popupInfo.reach.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {popupInfo.interactions && (
                    <div className="flex justify-between">
                      <span>Interacciones:</span>
                      <span className="font-medium">{popupInfo.interactions.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
};

export default MapboxGlobalMap;
