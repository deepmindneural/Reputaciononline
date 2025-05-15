"use client";

import React, { useState } from 'react';
import { 
  FaHashtag, 
  FaChartLine, 
  FaCalendarAlt, 
  FaGlobe,
  FaSort,
  // FaTwitter removido
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaNewspaper,
  FaArrowUp,
  FaFilter
} from 'react-icons/fa';
import Link from 'next/link';

// Datos simulados para las tendencias
const hashtagsData = [
  {
    id: '1',
    text: '#EleccionesColombia2026',
    network: 'x',
    count: 15820,
    change: 34.5, // porcentaje de cambio
    sentiment: 'neutral',
  },
  {
    id: '2',
    text: '#DebatePresidencial',
    network: 'x',
    count: 12450,
    change: 56.2,
    sentiment: 'neutral',
  },
  {
    id: '3',
    text: '#ReformaEducativa',
    network: 'x',
    count: 8930,
    change: 12.8,
    sentiment: 'positive',
  },
  {
    id: '4',
    text: '#CrisisEconómica',
    network: 'facebook',
    count: 7650,
    change: -5.3,
    sentiment: 'negative',
  },
  {
    id: '5',
    text: '#DesarrolloSostenible',
    network: 'instagram',
    count: 6340,
    change: 28.9,
    sentiment: 'positive',
  },
  {
    id: '6',
    text: '#SeguridadCiudadana',
    network: 'x',
    count: 5980,
    change: 7.2,
    sentiment: 'negative',
  },
  {
    id: '7',
    text: '#InnovaciónTecnológica',
    network: 'linkedin',
    count: 4820,
    change: 41.7,
    sentiment: 'positive',
  },
  {
    id: '8',
    text: '#EmpleoJuvenil',
    network: 'tiktok',
    count: 4210,
    change: 62.4,
    sentiment: 'neutral',
  },
  {
    id: '9',
    text: '#CorrupciónPolítica',
    network: 'news',
    count: 3890,
    change: -2.1,
    sentiment: 'negative',
  },
  {
    id: '10',
    text: '#ReactivaciónEconómica',
    network: 'facebook',
    count: 3560,
    change: 15.3,
    sentiment: 'positive',
  },
];

// Datos simulados para temas/conceptos emergentes
const topicsData = [
  {
    id: '1',
    name: 'Economía verde',
    count: 24580,
    change: 42.8,
    sentiment: 'positive',
    relatedTerms: ['sostenibilidad', 'medio ambiente', 'energías renovables']
  },
  {
    id: '2',
    name: 'Reforma fiscal',
    count: 18760,
    change: -8.5,
    sentiment: 'negative',
    relatedTerms: ['impuestos', 'tributación', 'IVA']
  },
  {
    id: '3',
    name: 'Educación virtual',
    count: 15240,
    change: 22.7,
    sentiment: 'neutral',
    relatedTerms: ['clases online', 'digital', 'plataformas educativas']
  },
  {
    id: '4',
    name: 'Salud mental',
    count: 12850,
    change: 31.6,
    sentiment: 'positive',
    relatedTerms: ['bienestar', 'terapia', 'pandemia']
  },
  {
    id: '5',
    name: 'Seguridad fronteriza',
    count: 9680,
    change: 5.3,
    sentiment: 'negative',
    relatedTerms: ['migración', 'control', 'tráfico']
  },
];

const TendenciasPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [activeTab, setActiveTab] = useState('hashtags');
  const [filterNetwork, setFilterNetwork] = useState('all');

  // Función para obtener el icono de red social
  const getNetworkIcon = (network: string) => {
    switch(network) {
      case 'x':
        return <img src="/images/social/x-logo.png" alt="X" className="w-4 h-4" />;
      case 'facebook':
        return <FaFacebook className="text-[#1877F2]" />;
      case 'instagram':
        return <FaInstagram className="text-[#E4405F]" />;
      case 'linkedin':
        return <FaLinkedin className="text-[#0A66C2]" />;
      case 'tiktok':
        return <FaTiktok className="text-black dark:text-white" />;
      case 'news':
        return <FaNewspaper className="text-gray-700 dark:text-gray-300" />;
      default:
        return <FaGlobe className="text-gray-600" />;
    }
  };

  // Función para obtener la clase de color según el sentimiento
  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      case 'neutral':
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Filtrar datos según la red seleccionada
  const filteredHashtags = filterNetwork === 'all' 
    ? hashtagsData 
    : hashtagsData.filter(hashtag => hashtag.network === filterNetwork);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tendencias</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          <strong>Reputación Online</strong> - Descubre los temas más relevantes en redes sociales y medios digitales
        </p>
      </header>

      {/* Filtros y controles */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm py-1 px-2 flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <select 
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-gray-700 dark:text-gray-300 font-medium focus:outline-none"
            >
              <option value="24h">Últimas 24 horas</option>
              <option value="7d">Última semana</option>
              <option value="30d">Último mes</option>
            </select>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm py-1 px-2 flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <select 
              value={filterNetwork}
              onChange={e => setFilterNetwork(e.target.value)}
              className="bg-transparent text-gray-700 dark:text-gray-300 font-medium focus:outline-none"
            >
              <option value="all">Todas las redes</option>
              <option value="x">X</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
              <option value="news">Noticias</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className={`py-1 px-3 font-medium rounded-lg ${activeTab === 'hashtags' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('hashtags')}
          >
            <span className="flex items-center">
              <FaHashtag className="mr-1" />
              Hashtags
            </span>
          </button>
          <button 
            className={`py-1 px-3 font-medium rounded-lg ${activeTab === 'topics' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('topics')}
          >
            <span className="flex items-center">
              <FaChartLine className="mr-1" />
              Temas
            </span>
          </button>
        </div>
      </div>

      {/* Contenido de la pestaña Hashtags */}
      {activeTab === 'hashtags' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      Posición
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      Hashtag
                      <button className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <FaSort />
                      </button>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      Red social
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center justify-end">
                      Menciones
                      <button className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <FaSort />
                      </button>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center justify-end">
                      Cambio
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {filteredHashtags.map((hashtag, index) => (
                  <tr key={hashtag.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={`/dashboard/menciones?q=${encodeURIComponent(hashtag.text)}`} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                        {hashtag.text}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <span className="mr-2">{getNetworkIcon(hashtag.network)}</span>
                        <span className="capitalize">{hashtag.network === 'news' ? 'Noticias' : hashtag.network}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                      {hashtag.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className={`flex items-center justify-end ${hashtag.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {hashtag.change >= 0 ? (
                          <FaArrowUp className="mr-1" />
                        ) : (
                          <FaArrowUp className="mr-1 transform rotate-180" />
                        )}
                        {Math.abs(hashtag.change).toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contenido de la pestaña Temas */}
      {activeTab === 'topics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topicsData.map(topic => (
            <div key={topic.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{topic.name}</h3>
                <div className={`flex items-center ${topic.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {topic.change >= 0 ? (
                    <FaArrowUp className="mr-1" />
                  ) : (
                    <FaArrowUp className="mr-1 transform rotate-180" />
                  )}
                  {Math.abs(topic.change).toFixed(1)}%
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Menciones totales</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{topic.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${topic.sentiment === 'positive' ? 'bg-green-500' : topic.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'}`}
                    style={{ width: `${Math.min(100, (topic.count / 25000) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Términos relacionados</h4>
                <div className="flex flex-wrap gap-2">
                  {topic.relatedTerms.map((term, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
              
              <Link 
                href={`/dashboard/menciones?q=${encodeURIComponent(topic.name)}`}
                className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Ver todas las menciones →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TendenciasPage;
