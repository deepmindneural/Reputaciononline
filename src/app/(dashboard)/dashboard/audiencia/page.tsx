"use client";

import React, { useState } from 'react';
import { 
  FaUsers, 
  FaChartLine, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaMale,
  FaFemale,
  // FaTwitter removido
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok
} from 'react-icons/fa';

// Definición de interfaces para mejorar el tipado
interface BarItem {
  label: string;
  value: number;
}

// Componente para gráfico de barras simple
const BarChart = ({ data, maxValue, color = 'bg-primary-500' }: { data: BarItem[], maxValue: number, color?: string }) => (
  <div className="space-y-2">
    {data.map((item, index) => (
      <div key={index} className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${color}`}
            style={{ width: `${(item.value / maxValue) * 100}%` }}
          ></div>
        </div>
      </div>
    ))}
  </div>
);

// Corrigiendo error ortográfico y mejorando el tipado
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: string | number;
  isPositive?: boolean;
}

// Componente para mostrar estadísticas en tarjetas
const StatCard = ({ title, value, icon, change, isPositive = true }: StatCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${isPositive ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'}`}>
        {icon}
      </div>
    </div>
    {change && (
      <div className="mt-2 flex items-center">
        <span className={`text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs. mes anterior</span>
      </div>
    )}
  </div>
);

// Datos simulados para el perfil demogru00e1fico
const edadData = [
  { label: '18-24', value: 32 },
  { label: '25-34', value: 38 },
  { label: '35-44', value: 18 },
  { label: '45-54', value: 8 },
  { label: '55+', value: 4 },
];

const generoData = [
  { label: 'Masculino', value: 58 },
  { label: 'Femenino', value: 42 },
];

const ubicacionData = [
  { label: 'Antioquia', value: 32 },
  { label: 'Bogotu00e1 D.C.', value: 28 },
  { label: 'Valle del Cauca', value: 15 },
  { label: 'Atlu00e1ntico', value: 12 },
  { label: 'Otros', value: 13 },
];

// Datos simulados para los influencers
const influencersData = [
  {
    id: '1',
    name: 'Luis Ramirez',
    handle: '@luisramirez',
    followers: 125800,
    engagement: 4.8,
    network: 'x',
    avatar: '/images/profiles/influencer1.jpg'
  },
  {
    id: '2',
    name: 'Maru00eda Garcu00eda',
    handle: '@mariagarcia',
    followers: 98500,
    engagement: 5.2,
    network: 'instagram',
    avatar: '/images/profiles/influencer2.jpg'
  },
  {
    id: '3',
    name: 'Carlos Lu00f3pez',
    handle: '@carloslopez',
    followers: 78300,
    engagement: 3.9,
    network: 'x',
    avatar: '/images/profiles/influencer3.jpg'
  },
  {
    id: '4',
    name: 'Ana Martu00ednez',
    handle: '@anamartinez',
    followers: 156200,
    engagement: 6.1,
    network: 'tiktok',
    avatar: '/images/profiles/influencer4.jpg'
  },
  {
    id: '5',
    name: 'Santiago Torres',
    handle: '@santiagotorres',
    followers: 67400,
    engagement: 4.3,
    network: 'facebook',
    avatar: '/images/profiles/influencer5.jpg'
  },
];

// Datos de crecimiento por plataforma
const plataformasData = [
  { platform: 'x', name: 'X', followers: 48520, growth: 5.8, color: 'text-gray-900 dark:text-white', icon: <img src="/images/social/x-logo.png" alt="X" className="w-4 h-4" /> },
  { platform: 'facebook', name: 'Facebook', followers: 36420, growth: 2.3, color: 'text-[#1877F2]', icon: <FaFacebook /> },
  { platform: 'instagram', name: 'Instagram', followers: 52180, growth: 8.2, color: 'text-[#E4405F]', icon: <FaInstagram /> },
  { platform: 'linkedin', name: 'LinkedIn', followers: 21350, growth: 4.7, color: 'text-[#0A66C2]', icon: <FaLinkedin /> },
  { platform: 'tiktok', name: 'TikTok', followers: 18760, growth: 12.5, color: 'text-black dark:text-white', icon: <FaTiktok /> },
];

const AudienciaPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('demografico');

  return (
    <div className="py-6 px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audiencia</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            <strong>Reputación Online</strong> - Análisis demográfico y geográfico de tus seguidores
          </p>
        </div>
      </div>

      {/* Filtros y controles */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm py-1 px-3 flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <select 
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-gray-700 dark:text-gray-300 font-medium focus:outline-none py-1"
            >
              <option value="7d">u00daltimos 7 du00edas</option>
              <option value="30d">u00daltimos 30 du00edas</option>
              <option value="90d">u00daltimos 90 du00edas</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'demografico' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
            onClick={() => setActiveTab('demografico')}
          >
            Demografu00eda
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'influencers' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
            onClick={() => setActiveTab('influencers')}
          >
            Influencers
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'crecimiento' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
            onClick={() => setActiveTab('crecimiento')}
          >
            Crecimiento
          </button>
        </div>
      </div>

      {/* Estadu00edsticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Seguidores totales"
          value="177,230"
          icon={<FaUsers className="text-xl" />}
          change="6.3"
          isPositive={true}
        />
        <StatCard 
          title="Nuevos seguidores"
          value="8,452"
          icon={<FaUsers className="text-xl" />}
          change="15.2"
          isPositive={true}
        />
        <StatCard 
          title="Tasa de engagement"
          value="4.2%"
          icon={<FaChartLine className="text-xl" />}
          change="0.8"
          isPositive={true}
        />
        <StatCard 
          title="Tasa de abandono"
          value="1.8%"
          icon={<FaChartLine className="text-xl" />}
          change="0.3"
          isPositive={false}
        />
      </div>

      {/* Contenido de la pestau00f1a Demografu00eda */}
      {activeTab === 'demografico' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <FaMale className="text-primary-500 text-xl mr-2" />
              <FaFemale className="text-pink-500 text-xl mr-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Gu00e9nero</h3>
            </div>
            <BarChart data={generoData} maxValue={100} />
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                La mayoru00eda de los seguidores son hombres, con un 58% del total. Este es un 2.3% mu00e1s que el mes anterior.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <FaCalendarAlt className="text-primary-500 text-xl mr-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edad</h3>
            </div>
            <BarChart data={edadData} maxValue={40} color="bg-green-500" />
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                La mayor concentraciu00f3n de seguidores estu00e1 en el rango de 25-34 au00f1os, seguido por el grupo de 18-24 au00f1os, lo que indica una audiencia predominantemente joven.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <FaMapMarkerAlt className="text-primary-500 text-xl mr-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ubicaciu00f3n</h3>
            </div>
            <BarChart data={ubicacionData} maxValue={35} color="bg-blue-500" />
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                La mayor concentraciu00f3n de seguidores se encuentra en Antioquia, seguido por Bogotu00e1 D.C. y el Valle del Cauca, reflejando una fuerte presencia en las regiones mu00e1s pobladas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de la pestau00f1a Influencers */}
      {activeTab === 'influencers' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Influencers y Amplificadores Clave</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Personas influyentes que han compartido contenido sobre Juan Pu00e9rez en el u00faltimo mes.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Influencer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Red
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Seguidores
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciu00f3n
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {influencersData.map((influencer) => {
                  // Iconos por red social
                  const getNetworkIcon = () => {
                    switch(influencer.network) {
                      case 'x': return <img src="/images/social/x-logo.png" alt="X" className="w-4 h-4" />;
                      case 'facebook': return <FaFacebook className="text-[#1877F2]" />;
                      case 'instagram': return <FaInstagram className="text-[#E4405F]" />;
                      case 'linkedin': return <FaLinkedin className="text-[#0A66C2]" />;
                      case 'tiktok': return <FaTiktok className="text-black dark:text-white" />;
                      default: return null;
                    }
                  };

                  return (
                    <tr key={influencer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600">
                            {/* Placeholder para avatar, podru00eda ser una imagen real */}
                            <div className="h-10 w-10 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 uppercase font-medium">
                              {influencer.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {influencer.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {influencer.handle}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white flex items-center">
                          <span className="mr-2">{getNetworkIcon()}</span>
                          <span className="capitalize">{influencer.network}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                        {influencer.followers.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                        {influencer.engagement}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                          Contactar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-right">
            <button className="text-sm text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
              Ver todos los influencers u2192
            </button>
          </div>
        </div>
      )}

      {/* Contenido de la pestau00f1a Crecimiento */}
      {activeTab === 'crecimiento' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Crecimiento por plataforma</h3>
            
            <div className="space-y-6">
              {plataformasData.map((platform) => (
                <div key={platform.platform} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className={`text-xl mr-3 ${platform.color}`}>{platform.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{platform.name}</span>
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                      +{platform.growth}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Seguidores actuales</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{platform.followers.toLocaleString()}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-primary-500" 
                      style={{ width: `${Math.min(100, (platform.followers / 60000) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Las redes con mayor crecimiento son TikTok (+12,5%) e Instagram (+8,2%), indicando que las estrategias visuales están teniendo mayor impacto.
                </p>
                <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm">
                  Ver reporte completo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudienciaPage;
