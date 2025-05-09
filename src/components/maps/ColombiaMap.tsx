"use client";

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';

// Mapa de Colombia
const COLOMBIA_GEO_URL = '/geo/colombia.json';

interface RegionData {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitud, latitud]
  value: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  percentage: number;
  color?: string;
  mentions?: number;
  reach?: number;
}

interface ColombiaMapProps {
  title?: string;
  regions: RegionData[];
  height?: number;
  defaultColor?: string;
  highlightColor?: string;
  showStats?: boolean;
  onRegionClick?: (region: RegionData) => void;
}

const ColombiaMap: React.FC<ColombiaMapProps> = ({
  title = 'Mapa de menciones por región',
  regions = [],
  height = 500,
  defaultColor = '#D1D5DB',
  highlightColor = '#0EA5E9',
  showStats = true,
  onRegionClick
}) => {
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [position, setPosition] = useState<{ coordinates: [number, number], zoom: number }>({ 
    coordinates: [-74, 4.5], 
    zoom: 4 
  });

  // Determinar el color basado en el sentimiento
  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return '#10B981';
      case 'negative': return '#EF4444';
      case 'neutral': return '#9CA3AF';
      default: return '#0EA5E9';
    }
  };

  // Determinar el tamaño de los marcadores basado en sus valores
  const maxValue = Math.max(...regions.map(reg => reg.value), 1);
  const getMarkerSize = (value: number) => {
    return Math.max(8, Math.min(24, (value / maxValue) * 24));
  };

  const handleRegionEnter = (region: RegionData) => {
    setActiveRegion(region.id);
    setTooltipContent(`
      <div>
        <h3 class="font-bold text-lg">${region.name}</h3>
        <div class="mt-1">
          <div class="flex justify-between items-center text-sm mb-1">
            <span>Menciones:</span>
            <span class="font-medium">${region.value.toLocaleString()}</span>
          </div>
          <div class="flex justify-between items-center text-sm mb-1">
            <span>Sentimiento positivo:</span>
            <span class="font-medium">${region.percentage}%</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span>Alcance:</span>
            <span class="font-medium">${region.reach?.toLocaleString() || 'N/A'}</span>
          </div>
        </div>
      </div>
    `);
  };

  const handleRegionLeave = () => {
    setActiveRegion(null);
    setTooltipContent('');
  };

  const handleRegionClick = (region: RegionData) => {
    if (onRegionClick) {
      onRegionClick(region);
    }
    
    // Zoom a la región
    setPosition({
      coordinates: region.coordinates,
      zoom: 6
    });
  };

  const handleReset = () => {
    setPosition({ coordinates: [-74, 4.5], zoom: 4 });
  };

  return (
    <div className="flex flex-col h-full w-full">
      {title && (
        <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      )}
      
      <div className="relative" style={{ height: `${height}px` }}>
        <button 
          onClick={handleReset}
          className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </button>
        
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 2300,
          }}
          style={{ width: '100%', height: '100%' }}
          data-tooltip-id="region-tooltip"
        >
          <ZoomableGroup 
            zoom={position.zoom} 
            center={position.coordinates}
            minZoom={1}
            maxZoom={12}
          >
            <Geographies geography={COLOMBIA_GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // Buscar si hay datos para esta región
                  const regionMatch = regions.find(
                    reg => reg.name.toLowerCase() === geo.properties.name?.toLowerCase()
                  );
                  
                  const isActive = regionMatch && activeRegion === regionMatch.id;
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={regionMatch ? (isActive ? highlightColor : getSentimentColor(regionMatch.sentiment)) : defaultColor}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: regionMatch ? highlightColor : '#A1A1AA', cursor: 'pointer' },
                        pressed: { outline: 'none' }
                      }}
                      onMouseEnter={() => regionMatch && handleRegionEnter(regionMatch)}
                      onMouseLeave={handleRegionLeave}
                      onClick={() => regionMatch && handleRegionClick(regionMatch)}
                    />
                  );
                })
              }
            </Geographies>
            
            {regions.map((region) => (
              <Marker key={region.id} coordinates={region.coordinates}>
                <circle 
                  r={getMarkerSize(region.value)}
                  fill={getSentimentColor(region.sentiment)}
                  stroke="#FFF"
                  strokeWidth={2}
                  opacity={0.8}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => handleRegionEnter(region)}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionClick(region)}
                />
                <text
                  textAnchor="middle"
                  y={getMarkerSize(region.value) + 10}
                  style={{
                    fontFamily: 'system-ui',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    fill: '#333',
                    pointerEvents: 'none',
                    textShadow: '0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff'
                  }}
                >
                  {region.name}
                </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
        
        <Tooltip id="region-tooltip" html={tooltipContent} className="z-50" />
      </div>
      
      {showStats && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total menciones</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {regions.reduce((sum, region) => sum + region.value, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Región principal</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {regions.length > 0 ? regions.sort((a, b) => b.value - a.value)[0].name : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Sentimiento promedio</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {regions.length > 0 ? Math.round(regions.reduce((sum, region) => sum + region.percentage, 0) / regions.length) : 0}% positivo
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColombiaMap;
