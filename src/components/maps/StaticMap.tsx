"use client";

import React from 'react';

interface Location {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitud, latitud]
  value: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface StaticMapProps {
  locations: Location[];
  height?: number;
  title?: string;
  onLocationClick?: (location: Location) => void;
}

// Dimensiones del mapa de Colombia
const MAP_WIDTH = 300;
const MAP_HEIGHT = 400;

// Límites aproximados de Colombia en coordenadas geográficas
const COLOMBIA_BOUNDS = {
  minLng: -79.0, // Oeste
  maxLng: -66.0, // Este
  minLat: -4.2,  // Sur
  maxLat: 13.0   // Norte
};

// Función para convertir coordenadas geográficas a coordenadas del mapa
const geoToPixel = (lng: number, lat: number): [number, number] => {
  const lngRange = COLOMBIA_BOUNDS.maxLng - COLOMBIA_BOUNDS.minLng;
  const latRange = COLOMBIA_BOUNDS.maxLat - COLOMBIA_BOUNDS.minLat;
  
  const x = ((lng - COLOMBIA_BOUNDS.minLng) / lngRange) * MAP_WIDTH;
  // Invertir Y porque las coordenadas del mapa tienen el origen en la esquina superior izquierda
  const y = MAP_HEIGHT - ((lat - COLOMBIA_BOUNDS.minLat) / latRange) * MAP_HEIGHT;
  
  return [x, y];
};

const StaticMap: React.FC<StaticMapProps> = ({
  locations = [],
  height = 400,
  title,
  onLocationClick
}) => {
  // Calcular el factor de escala para ajustar el mapa al contenedor
  const scale = height / MAP_HEIGHT;
  const width = MAP_WIDTH * scale;
  
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      <div 
        style={{ height: `${height}px` }} 
        className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-800 relative"
      >
        {/* Mapa simplificado de Colombia */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            width={width} 
            height={height} 
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="text-gray-300 dark:text-gray-700"
          >
            {/* Forma simplificada de Colombia */}
            <path 
              d="M100,50 L150,40 L200,60 L220,150 L200,250 L150,300 L120,350 L80,300 L60,200 L80,100 Z" 
              fill="currentColor" 
              stroke="#9CA3AF" 
              strokeWidth="1"
            />
            
            {/* Marcadores de ubicación */}
            {locations.map(location => {
              const [x, y] = geoToPixel(location.coordinates[0], location.coordinates[1]);
              
              // Determinar color según sentimiento
              let color = '#3B82F6'; // azul por defecto
              if (location.sentiment === 'positive') color = '#10B981'; // verde
              else if (location.sentiment === 'negative') color = '#EF4444'; // rojo
              else if (location.sentiment === 'neutral') color = '#9CA3AF'; // gris
              
              return (
                <g key={location.id} transform={`translate(${x}, ${y})`}>
                  {/* Círculo del marcador */}
                  <circle 
                    r="8" 
                    fill={color} 
                    stroke="white" 
                    strokeWidth="2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onLocationClick && onLocationClick(location)}
                  />
                  
                  {/* Tooltip con el nombre de la ubicación */}
                  <title>{location.name} - {location.value}</title>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Leyenda */}
        <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-900 p-2 rounded-md shadow-sm text-xs">
          <div className="flex items-center mb-1">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            <span>Positivo</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="w-3 h-3 bg-gray-400 rounded-full mr-1"></span>
            <span>Neutral</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
            <span>Negativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticMap;
