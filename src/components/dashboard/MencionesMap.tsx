"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Facebook, Instagram, Globe } from 'lucide-react';
import XLogo from '@/components/icons/XLogo';
import { motion } from 'framer-motion';

// Necesitamos arreglar el problema de los iconos en Leaflet con Next.js
import L from 'leaflet';

// Definir iconos para diferentes plataformas
const xIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #000000; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"></path><path d="M6 6L18 18"></path></svg>
         </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const facebookIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #1877F2; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
         </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const instagramIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #E4405F; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
         </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const defaultIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #6B7280; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
         </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Función para obtener el icono según la plataforma
const getIconByPlatform = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'x':
      return xIcon;
    case 'facebook':
      return facebookIcon;
    case 'instagram':
      return instagramIcon;
    default:
      return defaultIcon;
  }
};

// Función para obtener el componente de icono según la plataforma
const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case 'x':
      return <XLogo className="h-4 w-4" />;
    case 'facebook':
      return <Facebook className="h-4 w-4 text-[#1877F2]" />;
    case 'instagram':
      return <Instagram className="h-4 w-4 text-[#E4405F]" />;
    default:
      return <Globe className="h-4 w-4 text-[#6B7280]" />;
  }
};

// Tipo para las menciones
interface Mencion {
  id: string;
  author: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  platform: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
}

// Datos de ejemplo
const menciones: Mencion[] = [
  {
    id: '1',
    author: '@usuario123',
    content: '¡Excelente servicio! Muy recomendado 👍',
    sentiment: 'positive',
    platform: 'x',
    location: {
      lat: 4.6097,
      lng: -74.0817,
      name: 'Bogotá, Colombia'
    }
  },
  {
    id: '2',
    author: 'María García',
    content: 'Pésima atención al cliente, llevo días esperando respuesta.',
    sentiment: 'negative',
    platform: 'facebook',
    location: {
      lat: 3.4516,
      lng: -76.5320,
      name: 'Cali, Colombia'
    }
  },
  {
    id: '3',
    author: '@influencer_oficial',
    content: 'Probando el nuevo producto, tiene cosas buenas y malas.',
    sentiment: 'neutral',
    platform: 'instagram',
    location: {
      lat: 6.2476,
      lng: -75.5658,
      name: 'Medellín, Colombia'
    }
  },
  {
    id: '4',
    author: '@tech_reviewer',
    content: 'La nueva actualización resolvió todos los problemas anteriores.',
    sentiment: 'positive',
    platform: 'x',
    location: {
      lat: 10.9639,
      lng: -74.7964,
      name: 'Barranquilla, Colombia'
    }
  },
  {
    id: '5',
    author: 'Carlos Pérez',
    content: 'Interesante propuesta, estaré atento a los próximos lanzamientos.',
    sentiment: 'neutral',
    platform: 'facebook',
    location: {
      lat: 7.8890,
      lng: -72.4966,
      name: 'Cúcuta, Colombia'
    }
  }
];

const MencionesMap = () => {
  // Posición central del mapa (Colombia)
  const center = [4.5709, -74.2973];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Menciones</CardTitle>
          <CardDescription>Distribución geográfica de menciones recientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full rounded-md overflow-hidden">
            <MapContainer 
              center={[center[0], center[1]]} 
              zoom={5} 
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {menciones.map((mencion) => (
                <Marker 
                  key={mencion.id}
                  position={[mencion.location.lat, mencion.location.lng]}
                  icon={getIconByPlatform(mencion.platform)}
                >
                  <Popup>
                    <div className="p-1">
                      <div className="flex items-center mb-2">
                        <PlatformIcon platform={mencion.platform} />
                        <span className="ml-2 font-medium">{mencion.author}</span>
                      </div>
                      <p className="text-sm">{mencion.content}</p>
                      <div className="mt-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          mencion.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          mencion.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {mencion.sentiment === 'positive' ? 'Positivo' :
                           mencion.sentiment === 'negative' ? 'Negativo' :
                           'Neutral'}
                        </span>
                        <span className="ml-2 text-gray-500">{mencion.location.name}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#1DA1F2] mr-1"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">X</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#1877F2] mr-1"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Facebook</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#E4405F] mr-1"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Instagram</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#6B7280] mr-1"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Otros</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MencionesMap;
