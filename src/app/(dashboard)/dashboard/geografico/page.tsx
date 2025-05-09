"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaChartLine,
  FaMapMarkerAlt,
  FaUsers,
  FaComments,
  FaSearch,
  FaFilter,
  FaSortAmountDown
} from 'react-icons/fa';
import ColombiaMap from '@/components/maps/ColombiaMap';
import MapboxGlobalMap from '@/components/maps/MapboxGlobalMap';
import MapboxMap from '@/components/maps/MapboxMap';
import SocialMediaMapbox from '@/components/maps/SocialMediaMapbox';
import MapWrapper from '@/components/maps/MapWrapper';

// API key de Mapbox - Debe usarse con 'use client' en la parte superior del archivo
// y asegurarse de que el nombre de la variable comience con NEXT_PUBLIC_
const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || 'pk.eyJ1Ijoia2lldjk5IiwiYSI6ImNqNmJrYTZ3bzFnYTYzM3JwcG1mdXlvbTEifQ.p2qnpIhHV-mjXv9bLYT-Cw';

// Verificar la API key para debugging
console.log('Mapbox API Key in geografico:', MAPBOX_API_KEY ? `${MAPBOX_API_KEY.substring(0, 10)}...` : 'No API key found');
// Si la API key está vacía, mostraremos un mensaje de error

// Tipo para los datos regionales
interface RegionData {
  id: string;
  name: string;
  coordinates: [number, number];
  value: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  percentage: number;
  mentions?: number;
  reach?: number;
}

export default function GeograficoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState('30d');
  
  // Cargar datos simulados
  useEffect(() => {
    setIsLoading(true);
    
    // Simulamos carga de datos de regiones
    setTimeout(() => {
      const data: RegionData[] = [
        {
          id: 'bog',
          name: 'Bogotá D.C.',
          coordinates: [-74.1, 4.65],
          value: 847,
          sentiment: 'positive',
          percentage: 72,
          mentions: 847,
          reach: 1250000
        },
        {
          id: 'med',
          name: 'Antioquia',
          coordinates: [-75.5, 7.0],
          value: 623,
          sentiment: 'positive',
          percentage: 68,
          mentions: 623,
          reach: 980000
        },
        {
          id: 'cal',
          name: 'Valle del Cauca',
          coordinates: [-76.5, 3.5],
          value: 512,
          sentiment: 'positive',
          percentage: 63,
          mentions: 512,
          reach: 750000
        },
        {
          id: 'bar',
          name: 'Atlántico',
          coordinates: [-74.9, 10.7],
          value: 378,
          sentiment: 'neutral',
          percentage: 58,
          mentions: 378,
          reach: 540000
        },
        {
          id: 'buc',
          name: 'Santander',
          coordinates: [-73.5, 7.0],
          value: 295,
          sentiment: 'positive',
          percentage: 65,
          mentions: 295,
          reach: 420000
        },
        {
          id: 'cart',
          name: 'Bolívar',
          coordinates: [-74.6, 9.0],
          value: 248,
          sentiment: 'neutral',
          percentage: 52,
          mentions: 248,
          reach: 380000
        },
        {
          id: 'cun',
          name: 'Cundinamarca',
          coordinates: [-74.5, 5.2],
          value: 210,
          sentiment: 'positive',
          percentage: 66,
          mentions: 210,
          reach: 320000
        },
        {
          id: 'ama',
          name: 'Amazonas',
          coordinates: [-71.9, -4.2],
          value: 84,
          sentiment: 'negative',
          percentage: 42,
          mentions: 84,
          reach: 120000
        },
      ];
      
      setRegionData(data);
      setIsLoading(false);
    }, 1500);
  }, [period]);
  
  const handleRegionClick = (region: RegionData) => {
    setSelectedRegion(region);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de búsqueda real
    console.log('Buscando:', searchQuery);
  };
  
  return (
    <div className="py-6 px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Análisis Geográfico</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Visualiza la distribución de menciones por regiones de Colombia</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm flex p-1">
            <button 
              onClick={() => setPeriod('7d')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${period === '7d' ? 'bg-primary-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}
            >
              7 días
            </button>
            <button 
              onClick={() => setPeriod('30d')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${period === '30d' ? 'bg-primary-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}
            >
              30 días
            </button>
            <button 
              onClick={() => setPeriod('90d')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${period === '90d' ? 'bg-primary-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}
            >
              90 días
            </button>
          </div>
          
          <button className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-md shadow-sm flex items-center">
            <FaFilter className="mr-2" />
            Filtros
          </button>
        </div>
      </div>
      
      {/* Barra de búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <FaSearch />
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Buscar por región o departamento..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="ml-3 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
          >
            Buscar
          </button>
          <div className="ml-3 flex items-center text-gray-500 dark:text-gray-400">
            <FaSortAmountDown className="mr-1" />
            <span className="text-sm">Ordenar por:</span>
            <select className="ml-2 bg-transparent border-0 text-gray-700 dark:text-gray-300 focus:ring-0 text-sm">
              <option value="mentions">Menciones</option>
              <option value="sentiment">Sentimiento</option>
              <option value="reach">Alcance</option>
            </select>
          </div>
        </form>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mapa interactivo de Colombia con Mapbox */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 col-span-1 lg:col-span-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mapa de Menciones por Región</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-80">
              <p className="text-gray-600 dark:text-gray-400">Cargando datos del mapa...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Mapa de Colombia con react-simple-maps (backup) */}
              <div className="block lg:hidden">
                <ColombiaMap 
                  regions={regionData.map(region => ({
                    id: region.id,
                    name: region.name,
                    coordinates: region.coordinates,
                    value: region.value,
                    sentiment: region.sentiment,
                    percentage: region.percentage,
                    mentions: region.value, // Usado value en lugar de menciones
                    reach: region.reach
                  }))}
                  onRegionClick={handleRegionClick}
                />
              </div>
              
              {/* Mapa de Colombia con SocialMediaMapbox (visualización avanzada) */}
              <div className="hidden lg:block">
                <MapWrapper apiKey={MAPBOX_API_KEY}>
                  <SocialMediaMapbox
                    apiKey={MAPBOX_API_KEY}
                  title="Mapa de Menciones por Región"
                  mentions={regionData.map(region => ({
                    id: region.id,
                    region: region.name,
                    coordinates: [region.coordinates[0], region.coordinates[1]],
                    count: region.value,
                    sentiment: region.sentiment
                  }))}
                  height={450}
                  onRegionClick={(regionMention) => {
                    const region = regionData.find(r => r.id === regionMention.id);
                    if (region) handleRegionClick(region);
                  }}
                />
                </MapWrapper>
              </div>
              
              {/* Mapa mundial con Mapbox */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Menciones Globales</h3>
                <MapWrapper apiKey={MAPBOX_API_KEY || 'pk.eyJ1Ijoia2lldjk5IiwiYSI6ImNqNmJrYTZ3bzFnYTYzM3JwcG1mdXlvbTEifQ.p2qnpIhHV-mjXv9bLYT-Cw'}>
                  <MapboxGlobalMap
                    apiKey={MAPBOX_API_KEY || 'pk.eyJ1Ijoia2lldjk5IiwiYSI6ImNqNmJrYTZ3bzFnYTYzM3JwcG1mdXlvbTEifQ.p2qnpIhHV-mjXv9bLYT-Cw'}
                  locations={[
                    {
                      id: 'bogota',
                      city: 'Bogotá',
                      country: 'Colombia',
                      latitude: 4.60971,
                      longitude: -74.08175,
                      count: 1245,
                      sentiment: 'positive',
                      reach: 45000
                    },
                    {
                      id: 'medellin',
                      city: 'Medellín',
                      country: 'Colombia',
                      latitude: 6.25184,
                      longitude: -75.56359,
                      count: 890,
                      sentiment: 'neutral',
                      reach: 32000
                    },
                    {
                      id: 'cali',
                      city: 'Cali',
                      country: 'Colombia',
                      latitude: 3.45146,
                      longitude: -76.53222,
                      count: 732,
                      sentiment: 'positive',
                      reach: 28000
                    },
                    {
                      id: 'miami',
                      city: 'Miami',
                      country: 'Estados Unidos',
                      latitude: 25.76168,
                      longitude: -80.19179,
                      count: 324,
                      sentiment: 'neutral',
                      reach: 18000
                    },
                    {
                      id: 'madrid',
                      city: 'Madrid',
                      country: 'España',
                      latitude: 40.41669,
                      longitude: -3.70035,
                      count: 218,
                      sentiment: 'positive',
                      reach: 12000
                    }
                  ]}
                  height={400}
                />
                </MapWrapper>
              </div>
            </div>
          )}
        </div>
        
        {/* Panel lateral con detalles */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 col-span-1 lg:col-span-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center lg:text-left relative">
            {selectedRegion ? `Detalles de ${selectedRegion.name}` : 'Estadísticas nacionales'}
            {selectedRegion && (
              <button
                onClick={() => setSelectedRegion(null)}
                className="absolute right-0 top-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                aria-label="Cerrar detalles"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </h2>
          
          <div className="space-y-6">
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-xl transition-all duration-300 ease-in-out hover:shadow-md">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 mb-3">
                  <FaComments className="text-blue-600 dark:text-blue-300 text-xl" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Menciones</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedRegion ? selectedRegion.mentions?.toLocaleString() : regionData.reduce((sum, r) => sum + r.value, 0).toLocaleString()}
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/30 p-5 rounded-xl transition-all duration-300 ease-in-out hover:shadow-md">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-800 mb-3">
                  <FaChartLine className="text-green-600 dark:text-green-300 text-xl" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sentimiento</p>
                <div className="flex flex-wrap items-baseline">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedRegion ? `${selectedRegion.percentage}%` : 
                      `${Math.round(regionData.reduce((sum, r) => sum + r.percentage, 0) / regionData.length)}%`}
                  </p>
                  <span className="text-green-600 dark:text-green-400 ml-1 flex-shrink-0">positivo</span>
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/30 p-5 rounded-xl transition-all duration-300 ease-in-out hover:shadow-md">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-800 mb-3">
                  <FaUsers className="text-purple-600 dark:text-purple-300 text-xl" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Alcance</p>
                <div className="flex flex-wrap items-baseline">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedRegion ? `${(selectedRegion.reach! / 1000000).toFixed(1)}M` : 
                      `${(regionData.reduce((sum, r) => sum + (r.reach || 0), 0) / 1000000).toFixed(1)}M`}
                  </p>
                  <span className="text-xs ml-1 text-gray-500 flex-shrink-0">personas</span>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/30 p-5 rounded-xl transition-all duration-300 ease-in-out hover:shadow-md">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-800 mb-3">
                  <FaMapMarkerAlt className="text-amber-600 dark:text-amber-300 text-xl" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Regiones</p>
                <div className="flex flex-wrap items-baseline">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedRegion ? '1' : regionData.length}
                  </p>
                  <span className="text-xs ml-1 text-gray-500 flex-shrink-0">{selectedRegion ? 'seleccionada' : 'en total'}</span>
                </div>
              </div>
            </div>
            
            {/* Lista de principales menciones */}
            <div className="bg-white dark:bg-gray-850 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                  {selectedRegion ? (
                    <>
                      <FaMapMarkerAlt className="text-amber-600 dark:text-amber-300 mr-2" />
                      <span>{selectedRegion.name}</span>
                    </>
                  ) : (
                    <>
                      <FaChartLine className="text-cyan-600 dark:text-cyan-400 mr-2" />
                      <span>Principales regiones por menciones</span>
                    </>
                  )}
                </h3>
              </div>
              
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {(selectedRegion ? [selectedRegion] : regionData.slice(0, 5)).map((region, index) => (
                  <div 
                    key={index}
                    className={`flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer`}
                    onClick={() => handleRegionClick(region)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-sm font-medium text-cyan-800 dark:text-cyan-300">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center">
                          {region.name}
                          {selectedRegion && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300">
                              Seleccionada
                            </span>
                          )}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400 space-x-2">
                          <span className="flex items-center">
                            <FaComments className="mr-1 text-blue-500 dark:text-blue-400" />
                            {region.value.toLocaleString()}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <FaChartLine className="mr-1 text-green-500 dark:text-green-400" />
                            {region.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      region.sentiment === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      region.sentiment === 'negative' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {region.sentiment === 'positive' ? 'Positivo' :
                      region.sentiment === 'negative' ? 'Negativo' : 'Neutral'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Botón para exportar o ver más detalles */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                Exportar datos
              </button>
              
              <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors">
                Ver informe completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
