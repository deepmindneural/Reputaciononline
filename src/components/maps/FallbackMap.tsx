"use client";

import React from 'react';

interface Location {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitud, latitud]
  value: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface FallbackMapProps {
  title?: string;
  locations: Location[];
  height?: number;
  onLocationClick?: (location: Location) => void;
}

/**
 * Componente de mapa de respaldo que no depende de mapbox-gl
 * Usa SVG para mostrar un mapa simplificado de Colombia con marcadores
 */
const FallbackMap: React.FC<FallbackMapProps> = ({ 
  title = 'Mapa de Menciones', 
  locations = [], 
  height = 400,
  onLocationClick
}) => {
  // Coordenadas simplificadas para SVG (ajustadas para Colombia)
  const mapWidth = 500;
  const mapHeight = 600;
  
  // Función para convertir coordenadas geográficas a coordenadas SVG
  const projectToSvg = (coords: [number, number]): [number, number] => {
    // Colombia está aproximadamente entre estas coordenadas
    const minLon = -79; // oeste
    const maxLon = -67; // este
    const minLat = -4;  // sur
    const maxLat = 13;  // norte
    
    // Invertir la latitud porque en SVG el origen está en la esquina superior izquierda
    const x = ((coords[0] - minLon) / (maxLon - minLon)) * mapWidth;
    const y = mapHeight - ((coords[1] - minLat) / (maxLat - minLat)) * mapHeight;
    
    return [x, y];
  };
  
  // Obtener color según sentimiento
  const getSentimentColor = (sentiment?: 'positive' | 'neutral' | 'negative') => {
    if (sentiment === 'positive') return '#10B981'; // verde
    if (sentiment === 'negative') return '#EF4444'; // rojo
    return '#9CA3AF'; // gris para neutral o indefinido
  };
  
  // Calcular tamaño basado en el valor (entre 6 y 16 px)
  const getMarkerSize = (value: number) => {
    const minSize = 6;
    const maxSize = 18;
    const normalizedSize = Math.max(minSize, Math.min(maxSize, minSize + Math.sqrt(value) / 2));
    return normalizedSize;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {title && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      
      <div style={{ height: `${height}px` }} className="relative p-4">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
          style={{ maxHeight: '100%' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Contorno simplificado de Colombia */}
          <path 
            d="M120,220 L180,120 L240,90 L350,170 L380,270 L350,420 L240,490 L150,440 L90,350 Z" 
            fill="#E5E7EB" 
            stroke="#9CA3AF"
            strokeWidth="2"
            className="dark:fill-gray-700 dark:stroke-gray-600"
          />
          
          {/* Principales ríos */}
          <path 
            d="M240,90 L280,430" 
            stroke="#93C5FD" 
            strokeWidth="2" 
            fill="none"
            className="dark:stroke-blue-700"
          />
          <path 
            d="M150,350 L320,320" 
            stroke="#93C5FD" 
            strokeWidth="2" 
            fill="none"
            className="dark:stroke-blue-700"
          />
          
          {/* Renderizar ubicaciones */}
          {locations.map(location => {
            const [x, y] = projectToSvg(location.coordinates);
            const color = getSentimentColor(location.sentiment);
            const size = getMarkerSize(location.value);
            
            return (
              <g 
                key={location.id} 
                transform={`translate(${x}, ${y})`}
                onClick={() => onLocationClick?.(location)}
                style={{ cursor: 'pointer' }}
              >
                <circle 
                  r={size} 
                  fill={color}
                  stroke="white" 
                  strokeWidth="2" 
                />
                {location.value > 200 && (
                  <text 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    fill="white" 
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {location.value}
                  </text>
                )}
                
                {/* Tooltip con nombre */}
                <title>{`${location.name}: ${location.value}`}</title>
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 text-xs text-center text-gray-500 dark:text-gray-400">
        Visualización simplificada de Colombia. Los puntos representan menciones por región.
      </div>
    </div>
  );
};

export default FallbackMap;
