"use client";

import React from 'react';
import StaticMap from '@/components/maps/StaticMap';
import { Platform } from '@/types/social';

interface MapSectionProps {
  connectedPlatforms: Record<string, boolean>;
  getPlatformColor: (platform: Platform) => string;
}

const MapSection: React.FC<MapSectionProps> = ({ connectedPlatforms, getPlatformColor }) => {
  // No mostrar mapa si no hay plataformas conectadas
  if (Object.keys(connectedPlatforms).length === 0) {
    return null;
  }
  
  // Obtenemos la API key de Mapbox de las variables de entorno o usamos el fallback
  const mapboxApiKey = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || 'pk.eyJ1Ijoia2lldjk5IiwiYSI6ImNqNmJrYTZ3bzFnYTYzM3JwcG1mdXlvbTEifQ.p2qnpIhHV-mjXv9bLYT-Cw';

  return (
    <div className="mb-8">
      <StaticMap
        title="Mapa de Menciones por Región"
        locations={[
          {
            id: 'bog',
            name: 'Bogotá D.C.',
            coordinates: [-74.1, 4.65],
            value: 847,
            sentiment: 'positive'
          },
          {
            id: 'med',
            name: 'Medellín',
            coordinates: [-75.5, 6.25],
            value: 623,
            sentiment: 'positive'
          },
          {
            id: 'cal',
            name: 'Cali',
            coordinates: [-76.5, 3.45],
            value: 512,
            sentiment: 'positive'
          },
          {
            id: 'bar',
            name: 'Barranquilla',
            coordinates: [-74.8, 10.96],
            value: 378,
            sentiment: 'neutral'
          },
          {
            id: 'buc',
            name: 'Bucaramanga',
            coordinates: [-73.1, 7.12],
            value: 295,
            sentiment: 'positive'
          },
          {
            id: 'per',
            name: 'Pereira',
            coordinates: [-75.7, 4.81],
            value: 187,
            sentiment: 'neutral'
          }
        ]}
        height={450}
        onLocationClick={(location) => {
          console.log('Ubicación seleccionada:', location);
        }}
      />
    </div>
  );
};

export default MapSection;
