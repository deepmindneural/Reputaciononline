"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  FaFacebook, 
  FaTwitter,
  FaInstagram, 
  FaLinkedin, 
  FaTiktok, 
  FaNewspaper, 
  FaChartLine,
  FaInfoCircle,
  FaFilter,
  FaArrowUp,
  FaArrowDown,
  FaRobot,
  FaUserFriends,
  FaHeart,
  FaComments,
  FaShareAlt,
  FaSearch,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHashtag,
  FaUsers,
  FaBullhorn,
  FaExclamationTriangle,
  FaThumbsUp,
  FaThumbsDown,
  FaChartBar,
  FaChartPie,
  FaChartArea
} from 'react-icons/fa';
import Link from 'next/link';

// Importamos los componentes de gráficas de forma dinámica para que no se carguen en el servidor
const LineChart = dynamic(() => import('@/components/charts/LineChart'), { ssr: false });
const BarChart = dynamic(() => import('@/components/charts/BarChart'), { ssr: false });
const PieChart = dynamic(() => import('@/components/charts/PieChart'), { ssr: false });
const MapChart = dynamic(() => import('@/components/charts/MapChart'), { ssr: false });
// Importación de FallbackMap que no depende de WebGL
const FallbackMap = dynamic(() => import('@/components/maps/FallbackMap'), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-[380px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Cargando mapa de Colombia...</p>
    </div>
  )
});

// Mantenemos la importación alternativa para pruebas
const DirectMapbox = dynamic(() => import('@/components/maps/DirectMapbox'), { ssr: false });

// Componente para las tarjetas de resumen
const StatCard = ({ icon, title, value, change, changeType, info }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 relative overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div className="absolute top-0 right-0 mt-4 mr-4 text-primary-500 cursor-pointer has-tooltip">
      <FaInfoCircle />
      <span className="tooltip bg-black text-white text-sm p-2 rounded absolute -mt-12 -ml-32 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
        {info}
      </span>
    </div>
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-500 mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{value}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      </div>
    </div>
    <div className="flex items-center">
      <span className={`flex items-center ${changeType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {changeType === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
        {change}
      </span>
      <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">vs. semana anterior</span>
    </div>
  </div>
);

// Dashboard principal
export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  // Cargar datos del dashboard
  useEffect(() => {
    // Simular carga de datos desde API
    setLoading(true);
    setTimeout(() => {
      // Datos que simulan venir de una API real
      setDashboardData({
        stats: {
          menciones: 847,
          mencionesChange: 12.4,
          alcance: '1.2M',
          alcanceChange: 18.7,
          sentimientoPositivo: 65.3,
          sentimientoPositivoChange: 3.2,
          engagement: '35.8K',
          engagementChange: 8.9,
          interacciones: '42.5K',
          interaccionesChange: 15.2,
          seguidores: '28.7K',
          seguidoresChange: 5.6,
          crecimiento: '3.2K',
          crecimientoChange: 9.8,
          impresiones: '2.5M',
          impresionesChange: 22.3,
        },
        menciones: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [
            {
              label: 'Menciones',
              data: [38, 52, 67, 89, 97, 86, 63],
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
            },
            {
              label: 'Alcance',
              data: [28000, 42000, 53000, 74000, 82000, 79000, 58000],
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            }
          ]
        },
        sentimiento: {
          labels: ['Positivo', 'Neutral', 'Negativo'],
          data: [65, 27, 8],
          backgroundColor: ['#10B981', '#9CA3AF', '#EF4444'],
        },
        sentimientoTendencia: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [
            {
              label: 'Positivo',
              data: [58, 61, 65, 68, 72, 70, 65],
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
            },
            {
              label: 'Neutral',
              data: [32, 29, 27, 25, 22, 23, 27],
              borderColor: '#9CA3AF',
              backgroundColor: 'rgba(156, 163, 175, 0.1)',
            },
            {
              label: 'Negativo',
              data: [10, 10, 8, 7, 6, 7, 8],
              borderColor: '#EF4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
            }
          ]
        },
        redes: {
          labels: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'],
          datasets: [
            {
              label: 'Menciones por red',
              data: [320, 245, 178, 104],
              backgroundColor: ['#1877F2', '#1DA1F2', '#E1306C', '#0077B5'],
            }
          ]
        },
        redesTendencia: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [
            {
              label: 'Facebook',
              data: [42, 45, 48, 53, 58, 62, 60],
              borderColor: '#1877F2',
              backgroundColor: 'rgba(24, 119, 242, 0.1)',
            },
            {
              label: 'Twitter',
              data: [35, 32, 38, 40, 42, 38, 35],
              borderColor: '#1DA1F2',
              backgroundColor: 'rgba(29, 161, 242, 0.1)',
            },
            {
              label: 'Instagram',
              data: [28, 25, 30, 32, 35, 30, 28],
              borderColor: '#E1306C',
              backgroundColor: 'rgba(225, 48, 108, 0.1)',
            },
            {
              label: 'LinkedIn',
              data: [15, 14, 16, 18, 20, 18, 15],
              borderColor: '#0077B5',
              backgroundColor: 'rgba(0, 119, 181, 0.1)',
            }
          ]
        },
        dispositivos: {
          labels: ['Móvil', 'Escritorio', 'Tablet', 'Otros'],
          data: [68, 25, 5, 2],
          backgroundColor: ['#3B82F6', '#10B981', '#F97316', '#9CA3AF'],
        },
        horarios: {
          labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
          datasets: [
            {
              label: 'Actividad por hora',
              data: [15, 8, 12, 45, 68, 72, 85, 62],
              borderColor: '#8B5CF6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              fill: true,
            }
          ]
        },
        geografia: {
          locations: [
            { name: 'Bogotá D.C.', coordinates: [-74.1, 4.65], value: 320, color: '#3B82F6' },
            { name: 'Antioquia', coordinates: [-75.5, 7.0], value: 210, color: '#10B981' },
            { name: 'Valle del Cauca', coordinates: [-76.5, 3.5], value: 180, color: '#F97316' },
            { name: 'Atlántico', coordinates: [-74.9, 10.7], value: 125, color: '#EC4899' },
            { name: 'Santander', coordinates: [-73.5, 7.0], value: 95, color: '#8B5CF6' },
            { name: 'Bolívar', coordinates: [-74.6, 9.0], value: 78, color: '#EAB308' },
            { name: 'Cundinamarca', coordinates: [-74.3, 5.0], value: 65, color: '#06B6D4' },
            { name: 'Risaralda', coordinates: [-75.7, 4.8], value: 52, color: '#D946EF' },
            { name: 'Norte de Santander', coordinates: [-72.9, 8.0], value: 45, color: '#F43F5E' },
            { name: 'Tolima', coordinates: [-75.2, 4.0], value: 38, color: '#84CC16' },
          ]
        },
        temas: {
          labels: ['Propuestas', 'Economía', 'Seguridad', 'Educación', 'Salud', 'Medio Ambiente', 'Infraestructura', 'Corrupción', 'Empleo', 'Vivienda'],
          datasets: [
            {
              label: 'Menciones por tema',
              data: [187, 142, 127, 98, 75, 62, 53, 48, 42, 38],
            }
          ]
        },
        demograficos: {
          genero: {
            labels: ['Hombres', 'Mujeres', 'No especificado'],
            data: [45, 52, 3],
            backgroundColor: ['#3B82F6', '#EC4899', '#9CA3AF'],
          },
          edad: {
            labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
            datasets: [
              {
                label: 'Distribución por edad',
                data: [15, 32, 28, 18, 5, 2],
                backgroundColor: ['#10B981', '#3B82F6', '#F97316', '#8B5CF6', '#EC4899', '#9CA3AF'],
              }
            ]
          }
        }
      });
      setLoading(false);
    }, 1200); // Simulamos un delay realista de carga
  }, [selectedPeriod]);

  const [selectedTab, setSelectedTab] = useState('resumen');

  return (
    <div className="py-6 px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gestión integral de la presencia digital</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm flex p-1">
            <button 
              onClick={() => setSelectedPeriod('7d')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${selectedPeriod === '7d' ? 'bg-primary-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}
            >
              7 días
            </button>
            <button 
              onClick={() => setSelectedPeriod('30d')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${selectedPeriod === '30d' ? 'bg-primary-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}
            >
              30 días
            </button>
            <button 
              onClick={() => setSelectedPeriod('90d')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${selectedPeriod === '90d' ? 'bg-primary-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}
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

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FaComments className="text-xl" />}
          title="Menciones"
          value={loading ? '...' : dashboardData?.stats.menciones.toLocaleString()}
          change={loading ? '...' : `${dashboardData?.stats.mencionesChange}%`}
          changeType="up"
          info="Total de menciones en redes sociales y medios digitales."
        />
        <StatCard 
          icon={<FaGlobe className="text-xl" />}
          title="Alcance"
          value={loading ? '...' : dashboardData?.stats.alcance}
          change={loading ? '...' : `${dashboardData?.stats.alcanceChange}%`}
          changeType="up"
          info="Número estimado de personas que han visto las menciones."
        />
        <StatCard 
          icon={<FaHeart className="text-xl" />}
          title="Sentimiento Positivo"
          value={loading ? '...' : `${dashboardData?.stats.sentimientoPositivo}%`}
          change={loading ? '...' : `${dashboardData?.stats.sentimientoPositivoChange}%`}
          changeType="up"
          info="Porcentaje de menciones con sentimiento positivo."
        />
        <StatCard 
          icon={<FaShareAlt className="text-xl" />}
          title="Engagement"
          value={loading ? '...' : dashboardData?.stats.engagement}
          change={loading ? '...' : `${dashboardData?.stats.engagementChange}%`}
          changeType="up"
          info="Interacciones totales (likes, comentarios, compartidos)."
        />
      </div>

      {/* Segunda fila de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FaUserFriends className="text-xl" />}
          title="Seguidores"
          value={loading ? '...' : dashboardData?.stats.seguidores}
          change={loading ? '...' : `${dashboardData?.stats.seguidoresChange}%`}
          changeType="up"
          info="Total de seguidores en todas las redes sociales."
        />
        <StatCard 
          icon={<FaChartLine className="text-xl" />}
          title="Crecimiento"
          value={loading ? '...' : dashboardData?.stats.crecimiento}
          change={loading ? '...' : `${dashboardData?.stats.crecimientoChange}%`}
          changeType="up"
          info="Nuevos seguidores en el período seleccionado."
        />
        <StatCard 
          icon={<FaBullhorn className="text-xl" />}
          title="Impresiones"
          value={loading ? '...' : dashboardData?.stats.impresiones}
          change={loading ? '...' : `${dashboardData?.stats.impresionesChange}%`}
          changeType="up"
          info="Número total de veces que se ha mostrado el contenido."
        />
        <StatCard 
          icon={<FaThumbsUp className="text-xl" />}
          title="Interacciones"
          value={loading ? '...' : dashboardData?.stats.interacciones}
          change={loading ? '...' : `${dashboardData?.stats.interaccionesChange}%`}
          changeType="up"
          info="Total de likes, comentarios y compartidos."
        />
      </div>

      {/* Mapa interactivo temporalmente reemplazado por un mensaje */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mapa de Menciones por Región</h2>
          <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-center p-6">
              <FaMapMarkerAlt className="text-5xl text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Mapa temporalmente no disponible</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Estamos trabajando en una actualización para mejorar la visualización geográfica de menciones.
                Los datos están disponibles en la sección Geográfico del menú lateral.
              </p>
              <div className="mt-6">
                <Link href="/dashboard/geografico" className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
                  Ver análisis geográfico detallado
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setSelectedTab('resumen')}
              className={`inline-block py-4 px-4 text-sm font-medium border-b-2 ${selectedTab === 'resumen' ? 'text-primary-600 border-primary-600 dark:text-primary-500 dark:border-primary-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
              Resumen
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setSelectedTab('menciones')}
              className={`inline-block py-4 px-4 text-sm font-medium border-b-2 ${selectedTab === 'menciones' ? 'text-primary-600 border-primary-600 dark:text-primary-500 dark:border-primary-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
              Menciones
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setSelectedTab('sentimiento')}
              className={`inline-block py-4 px-4 text-sm font-medium border-b-2 ${selectedTab === 'sentimiento' ? 'text-primary-600 border-primary-600 dark:text-primary-500 dark:border-primary-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
              Sentimiento
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setSelectedTab('redes')}
              className={`inline-block py-4 px-4 text-sm font-medium border-b-2 ${selectedTab === 'redes' ? 'text-primary-600 border-primary-600 dark:text-primary-500 dark:border-primary-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
              Redes Sociales
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido de las pestañas */}
      {selectedTab === 'resumen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Evolución de Menciones</h3>
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <LineChart labels={dashboardData?.menciones.labels} datasets={dashboardData?.menciones.datasets} />
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribución de Sentimiento</h3>
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <PieChart labels={dashboardData?.sentimiento.labels} data={dashboardData?.sentimiento.data} backgroundColor={dashboardData?.sentimiento.backgroundColor} />
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Menciones por Red Social</h3>
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <BarChart labels={dashboardData?.redes.labels} datasets={dashboardData?.redes.datasets} horizontal />
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Temas Principales</h3>
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <BarChart labels={dashboardData?.temas.labels} datasets={dashboardData?.temas.datasets} />
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Evolución del Sentimiento</h3>
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <LineChart labels={dashboardData?.sentimientoTendencia.labels} datasets={dashboardData?.sentimientoTendencia.datasets} />
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tendencia por Red Social</h3>
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <LineChart labels={dashboardData?.redesTendencia.labels} datasets={dashboardData?.redesTendencia.datasets} />
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribución por Dispositivo</h3>
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <PieChart labels={dashboardData?.dispositivos.labels} data={dashboardData?.dispositivos.data} backgroundColor={dashboardData?.dispositivos.backgroundColor} donut />
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actividad por Horario</h3>
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <LineChart labels={dashboardData?.horarios.labels} datasets={dashboardData?.horarios.datasets} />
              )}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'menciones' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Análisis de Menciones</h3>
          <p className="text-gray-600 dark:text-gray-400">Contenido detallado de menciones...</p>
        </div>
      )}

      {selectedTab === 'sentimiento' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Análisis de Sentimiento</h3>
          <p className="text-gray-600 dark:text-gray-400">Contenido detallado de sentimiento...</p>
        </div>
      )}

      {selectedTab === 'redes' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Análisis por Redes Sociales</h3>
          <p className="text-gray-600 dark:text-gray-400">Contenido detallado por redes sociales...</p>
        </div>
      )}
    </div>
  );
}
