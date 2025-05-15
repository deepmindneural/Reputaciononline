"use client";

import React, { useState } from 'react';
import { 
  // FaTwitter, // Reemplazado por el logo de X
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaTiktok, 
  FaNewspaper, 
  FaChartLine,
  FaInfoCircle,
  FaFilter,
  FaArrowUp,
  FaArrowDown,
  FaRobot
} from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Componente para las tarjetas de resumen
const StatCard = ({ icon, title, value, change, changeType, info }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 relative overflow-hidden">
    <div className="absolute top-0 right-0 mt-4 mr-4 text-primary-500 cursor-pointer has-tooltip">
      <FaInfoCircle />
      <span className="tooltip bg-black text-white text-sm p-2 rounded absolute -mt-12 -ml-32 w-48">
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
  const [selectedTab, setSelectedTab] = useState('resumen');

  return (
    <div className="py-6 px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1"><strong>Reputación Online</strong> - Gestión integral de la presencia digital para candidatos políticos</p>
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

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-6">
          <button
            className={`pb-3 ${selectedTab === 'resumen' ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'} font-medium`}
            onClick={() => setSelectedTab('resumen')}
          >
            Resumen
          </button>
          <button
            className={`pb-3 ${selectedTab === 'menciones' ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'} font-medium`}
            onClick={() => setSelectedTab('menciones')}
          >
            Menciones
          </button>
          <button
            className={`pb-3 ${selectedTab === 'sentimiento' ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'} font-medium`}
            onClick={() => setSelectedTab('sentimiento')}
          >
            Sentimiento
          </button>
          <button
            className={`pb-3 ${selectedTab === 'geografico' ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'} font-medium`}
            onClick={() => setSelectedTab('geografico')}
          >
            Mapa Geográfico
          </button>
        </nav>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard 
            icon={<img src="/images/social/x-logo.png" alt="X" className="w-5 h-5" />} 
            title="Menciones X" 
            value="125.800" 
            change="12.3%" 
            changeType="up"
            info="Total de menciones y likes en X relacionados con la marca o keywords monitoreadas."
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard 
            icon={<FaInstagram className="text-xl" />} 
            title="Alcance Instagram" 
            value="76.300" 
            change="5.8%" 
            changeType="up"
            info="Alcance total en Instagram incluyendo posts, stories y reels donde se menciona la marca."
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard 
            icon={<FaFacebook className="text-xl" />} 
            title="Engagement Facebook" 
            value="98.500" 
            change="2.1%" 
            changeType="down"
            info="Interacciones totales (me gusta, comentarios, compartidos) en Facebook."
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <StatCard 
            icon={<FaChartLine className="text-xl" />} 
            title="Sentimiento global" 
            value="71%" 
            change="4.3%" 
            changeType="up"
            info="Porcentaje de menciones con sentimiento positivo o neutral en todas las plataformas."
          />
        </motion.div>
      </div>

      {/* Perfil del candidato */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Chat con Sofia</h2>
        <div className="p-6 bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Sofia</h3>
              <p className="text-white/90">Tu asistente inteligente para análisis de reputación y estrategia política</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.178-.331.176-.662.352-.988.528-2.56 1.386-4.926 2.837-6.735 4.246a60.376 60.376 0 0 0-1.257.95 4.125 4.125 0 0 0-.296.282c-.166.16-.33.32-.487.485l-.006.006a2.619 2.619 0 0 0-.361.39c-.088.108-.172.22-.25.337a2.99 2.99 0 0 0-.225.394 3.81 3.81 0 0 0-.101.783c0 .903.462 1.697 1.16 2.157.55.36 1.257.53 2.069.53a5.33 5.33 0 0 0 1.564-.239c.542-.174 1.096-.429 1.675-.76C11.043 22.56 14.61 20.895 17.6 19.5c5.298-2.477 7.951-5.41 7.951-7.5 0-1.041-.406-2.042-1.194-2.982A6.753 6.753 0 0 0 22.8 7.4a6.08 6.08 0 0 0-1.964-1.872A6.893 6.893 0 0 0 18.724 4.8c-.47 0-.914.073-1.312.219a5.69 5.69 0 0 0-1.56.95 5.491 5.491 0 0 0-1.13 1.215c-.238.35-.43.7-.57 1.05a4.751 4.751 0 0 0-.076-.572 6.414 6.414 0 0 0-.064-.401c-.071-.363-.17-.693-.3-.985a4.57 4.57 0 0 0-.394-.8c-.629-1.013-1.68-1.684-2.955-1.684-1.442 0-2.697.66-3.262 1.653-.59 1.035-.59 2.354 0 3.59.137.283.313.55.521.798.467.556 1.155 1.038 1.997 1.455a1.674 1.674 0 0 1-.557-.797c-.113-.325-.069-.678.137-.976.06-.088.128-.172.2-.25a1.87 1.87 0 0 1 .272-.25c.123-.095.263-.178.426-.241.208-.088.458-.142.769-.142.3 0 .559.054.785.142a1.81 1.81 0 0 1 .484.297 1.668 1.668 0 0 1 .342.454c.072.131.124.295.156.491.07.426.01.81-.193 1.148a1.744 1.744 0 0 1-.43.467 5.212 5.212 0 0 1-.495.327 9.05 9.05 0 0 1-.583.29c-.2.095-.398.179-.592.242-1.95.661-3.203 1.358-3.762 2.09a3.272 3.272 0 0 0-.305.546c-.592 1.298-.157 2.433 1.307 3.388 1.157.757 2.646 1.136 4.467 1.136 1.87 0 4.126-.449 6.767-1.345 2.601-.882 4.992-2.133 7.17-3.75a.75.75 0 0 0 .272-.83 21.999 21.999 0 0 0-12.271-14.987Z" />
              </svg>
            </div>
          </div>
          <Link href="/dashboard/sofia" className="inline-block mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Iniciar conversación →
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Perfil del Candidato</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-500 shadow-lg flex items-center justify-center bg-primary-100">
                {typeof window !== 'undefined' && localStorage.getItem('userProfileImage') ? (
                  <img
                    src={localStorage.getItem('userProfileImage') || ''}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/images/profile/default-avatar.png"
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {typeof window !== 'undefined' && localStorage.getItem('userName') ? localStorage.getItem('userName') : 'Juan Pérez'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Candidato al Senado - Partido Nueva Esperanza</p>
              
              <div className="flex justify-center items-center mt-4 space-x-2">
                <div className="flex items-center">
                  <span className="text-primary-500 mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Medellín, Antioquia</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-primary-500 mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Campaña desde 2024</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-black dark:text-white mb-1"><img src="/images/social/x-logo.png" alt="X Logo" className="w-5 h-5" /></div>
                <h4 className="font-medium text-gray-800 dark:text-white">3,241</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">X</p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-blue-600 mb-1"><FaFacebook /></div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">98,500</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Facebook</p>
              </div>
              
              <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg text-center">
                <div className="text-pink-600 mb-1"><FaInstagram /></div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">76,300</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Instagram</p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-blue-700 mb-1"><FaLinkedin /></div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">42,100</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">LinkedIn</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-black dark:text-white mb-1"><FaTiktok /></div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">35,700</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">TikTok</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                Temas Clave
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                  Innovación
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm">
                  Juventud
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm">
                  Transformación Digital
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm">
                  Seguridad
                </span>
              </div>
              
              <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                Logros Destacados
              </h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">•</span>
                  Secretario de Tecnología de Medellín (2022-2024)
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">•</span>
                  Fundador de la iniciativa "Colombia Digital"
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">•</span>
                  Premio Innovador del Año 2023
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Últimas menciones */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Últimas menciones</h2>
          <Link href="/dashboard/menciones" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm">
            Ver todas
          </Link>
        </div>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-center">
              <img src="/images/social/x-logo.png" alt="X" className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">@MariaGarcia</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Hace 35 minutos</span>
              <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                Positivo
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Las propuestas de @JuanPerezSenado sobre transformación digital son muy interesantes. Me gusta su visión de futuro para Colombia. #InnovacionPolitica #Elecciones2026 #Colombia
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="mr-4">12 Retweets</span>
              <span>48 Me gusta</span>
            </div>
          </div>
          
          <div className="border-l-4 border-pink-500 pl-4 py-2">
            <div className="flex items-center">
              <FaInstagram className="text-pink-500 mr-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">@JuanPolitica</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Hace 2 horas</span>
              <span className="ml-auto px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full text-xs">
                Neutral
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              El foro sobre tecnología con @JuanPerezSenado fue excelente. Sus ideas para reducir la brecha digital en Colombia son muy necesarias. ¡Gran candidato! #ColombiaDigital #Elecciones2026
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="mr-4">126 Me gusta</span>
              <span>34 Comentarios</span>
            </div>
          </div>
          
          <div className="border-l-4 border-red-500 pl-4 py-2">
            <div className="flex items-center">
              <FaFacebook className="text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">Daniel Morales</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Hace 5 horas</span>
              <span className="ml-auto px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs">
                Negativo
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Discrepo con @JuanPerezSenado sobre el enfoque de regulación tecnológica. Su propuesta podría limitar la innovación en el sector. Necesitamos menos restricciones y más incentivos para el desarrollo.
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="mr-4">23 Me gusta</span>
              <span>18 Comentarios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Oportunidades */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Oportunidades detectadas por IA</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <span className="text-2xl text-primary-500 mr-3">{"📍"}</span>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Regiones</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Según el análisis de datos, su campaña podría beneficiarse de mayor presencia en:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
              <li>Costa Atlántica</li>
              <li>Eje Cafetero</li>
            </ul>
            <Link href="/dashboard/analisis/geografico" className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
              Ver análisis detallado →
            </Link>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <span className="text-2xl text-primary-500 mr-3">{"📊"}</span>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Plataformas</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Las redes con mayor potencial de crecimiento para su campaña son:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
              <li>TikTok</li>
              <li>LinkedIn</li>
            </ul>
            <Link href="/dashboard/analisis/plataformas" className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
              Ver estrategias sugeridas →
            </Link>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <span className="text-2xl text-primary-500 mr-3">{"📈"}</span>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Temas</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Los temas con mayor resonancia en su audiencia objetivo:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
              <li>Desarrollo tecnológico</li>
              <li>Emprendimiento</li>
            </ul>
            <Link href="/dashboard/analisis/temas" className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
              Ver tendencias completas →
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            href="/dashboard/sofia"
            className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            <FaRobot className="mr-2" />
            Consultar a Sofia IA para recomendaciones personalizadas
          </Link>
        </div>
      </div>
    </div>
  );
}
