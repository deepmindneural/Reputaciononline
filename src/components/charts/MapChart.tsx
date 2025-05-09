"use client";

import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

// Mapa de Colombia por defecto
const COLOMBIA_GEO_URL = '/geo/colombia.json';

interface MapLocation {
  name: string;
  coordinates: [number, number]; // [longitud, latitud]
  value: number;
  color?: string;
}

interface MapChartProps {
  title?: string;
  geoUrl?: string;
  locations: MapLocation[];
  height?: number;
  defaultColor?: string;
  highlightColor?: string;
  markerColor?: string;
  markerSizeMultiplier?: number;
}

const MapChart: React.FC<MapChartProps> = ({
  title,
  geoUrl = COLOMBIA_GEO_URL,
  locations = [],
  height = 400,
  defaultColor = '#D1D5DB',
  highlightColor = '#10B981',
  markerColor = '#3B82F6',
  markerSizeMultiplier = 1
}) => {
  // Asegurarnos de que locations siempre sea un array
  const safeLocations = locations || [];
  // Crear directorios necesarios para el archivo GeoJSON
  React.useEffect(() => {
    const createGeoFolder = async () => {
      try {
        // Este código solo se ejecuta en el cliente
        if (typeof window !== 'undefined' && !window.localStorage.getItem('mapGeoDirCreated')) {
          // En producción, este código no haría nada
          // En desarrollo, asumimos que los archivos GeoJSON ya están en la carpeta public/geo
          window.localStorage.setItem('mapGeoDirCreated', 'true');
        }
      } catch (error) {
        console.error('Error al verificar carpeta de mapas:', error);
      }
    };
    
    createGeoFolder();
  }, []);

  // Determinar el tamaño de los marcadores basado en sus valores
  const maxValue = Math.max(...locations.map(loc => loc.value), 1);
  const getMarkerSize = (value: number) => {
    return Math.max(5, Math.min(20, (value / maxValue) * 20 * markerSizeMultiplier));
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      {title && (
        <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      )}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 2300,
          center: [-74, 4.5] // Coordenadas aproximadas del centro de Colombia
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              // Buscar si hay datos para esta región
              const locationMatch = locations.find(
                loc => loc.name.toLowerCase() === geo.properties.name?.toLowerCase()
              );
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={locationMatch ? highlightColor : defaultColor}
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: locationMatch ? highlightColor : '#A1A1AA' },
                    pressed: { outline: 'none' }
                  }}
                />
              );
            })
          }
        </Geographies>
        
        {safeLocations.map((location) => (
          <Marker
            key={`marker-${location.name}`}
            coordinates={location.coordinates}
          >
            <circle
              r={Math.sqrt(location.value) * 0.05 * markerSizeMultiplier}
              fill={location.color || markerColor}
              stroke="#fff"
              strokeWidth={1}
              style={{
                cursor: 'pointer',
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
              }}
            />
            <title>{location.name}: {location.value.toLocaleString()}</title>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

export default MapChart;
