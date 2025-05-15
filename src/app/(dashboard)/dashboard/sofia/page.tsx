"use client";

import React, { useState } from 'react';
import SofiaChat from '@/components/sofia/SofiaChat';
import { FaChartLine, FaHistory, FaDatabase, FaWaveSquare } from 'react-icons/fa';

export default function SofiaPage() {
  const [activeTab, setActiveTab] = useState('chat');
  // Datos de análisis pre-configurados para Juan Pérez, candidato al senado
  const [analysisResults, setAnalysisResults] = useState<any>({
    sentiment: {
      positive: 65,
      neutral: 22,
      negative: 13
    },
    topics: [
      { name: 'Transformación Digital', count: 245, sentiment: 82 },
      { name: 'Innovación', count: 187, sentiment: 78 },
      { name: 'Juventud', count: 156, sentiment: 74 },
      { name: 'Tecnología', count: 134, sentiment: 71 },
      { name: 'Educación', count: 98, sentiment: 65 },
    ],
    networks: [
      { name: 'X', percentage: 42, growth: 8.3 },
      { name: 'Instagram', percentage: 28, growth: 12.1 },
      { name: 'Facebook', percentage: 18, growth: 3.2 },
      { name: 'TikTok', percentage: 9, growth: 15.7 },
      { name: 'LinkedIn', percentage: 3, growth: 5.9 },
    ],
    recommendations: [
      'Incrementar contenido relacionado con propuestas de transformación digital para atraer a votantes jóvenes',
      'Enfatizar tu experiencia como Secretario de Tecnología de Medellín en la campaña',
      'Contrarrestar menciones negativas sobre regulación tecnológica con propuestas concretas',
      'Aumentar presencia en TikTok, que muestra el mayor crecimiento entre tu audiencia',
      'Crear más contenido que conecte la innovación con la generación de empleo para jóvenes'
    ],
    insights: [
      'El sentimiento positivo ha aumentado un 8.5% desde el foro sobre tecnología de la semana pasada',
      'Los votantes entre 18-34 años muestran mayor interés en tus propuestas de transformación digital',
      'Las menciones en Antioquia son 32% más positivas que el promedio nacional',
      'Tu iniciativa "Colombia Digital" es tu propuesta con mejor recepción en redes',
      'Hay oportunidad de mejorar percepción en temas de seguridad y salud'
    ]
  });

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
    setActiveTab('analysis');
  };

  return (
    <div className="py-6 px-8 h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sofia</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tu asistente inteligente para análisis de reputación en <strong>Reputación Online</strong>
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            className={`px-4 py-2 rounded-md flex items-center ${activeTab === 'chat' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('chat')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
              <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.178-.331.176-.662.352-.988.528-2.56 1.386-4.926 2.837-6.735 4.246a60.376 60.376 0 0 0-1.257.95 4.125 4.125 0 0 0-.296.282c-.166.16-.33.32-.487.485l-.006.006a2.619 2.619 0 0 0-.361.39c-.088.108-.172.22-.25.337a2.99 2.99 0 0 0-.225.394 3.81 3.81 0 0 0-.101.783c0 .903.462 1.697 1.16 2.157.55.36 1.257.53 2.069.53a5.33 5.33 0 0 0 1.564-.239c.542-.174 1.096-.429 1.675-.76C11.043 22.56 14.61 20.895 17.6 19.5c5.298-2.477 7.951-5.41 7.951-7.5 0-1.041-.406-2.042-1.194-2.982A6.753 6.753 0 0 0 22.8 7.4a6.08 6.08 0 0 0-1.964-1.872A6.893 6.893 0 0 0 18.724 4.8c-.47 0-.914.073-1.312.219a5.69 5.69 0 0 0-1.56.95 5.491 5.491 0 0 0-1.13 1.215c-.238.35-.43.7-.57 1.05a4.751 4.751 0 0 0-.076-.572 6.414 6.414 0 0 0-.064-.401c-.071-.363-.17-.693-.3-.985a4.57 4.57 0 0 0-.394-.8c-.629-1.013-1.68-1.684-2.955-1.684-1.442 0-2.697.66-3.262 1.653-.59 1.035-.59 2.354 0 3.59.137.283.313.55.521.798.467.556 1.155 1.038 1.997 1.455a1.674 1.674 0 0 1-.557-.797c-.113-.325-.069-.678.137-.976.06-.088.128-.172.2-.25a1.87 1.87 0 0 1 .272-.25c.123-.095.263-.178.426-.241.208-.088.458-.142.769-.142.3 0 .559.054.785.142a1.81 1.81 0 0 1 .484.297a1.668 1.668 0 0 1 .342.454c.072.131.124.295.156.491.07.426.01.81-.193 1.148a1.744 1.744 0 0 1-.43.467a5.212 5.212 0 0 1-.495.327a9.05 9.05 0 0 1-.583.29c-.2.095-.398.179-.592.242-1.95.661-3.203 1.358-3.762 2.09a3.272 3.272 0 0 0-.305.546c-.592 1.298-.157 2.433 1.307 3.388 1.157.757 2.646 1.136 4.467 1.136 1.87 0 4.126-.449 6.767-1.345 2.601-.882 4.992-2.133 7.17-3.75a.75.75 0 0 0 .272-.83 21.999 21.999 0 0 0-12.271-14.987Z" />
            </svg>
            Chat
          </button>
          <button 
            className={`px-4 py-2 rounded-md flex items-center ${activeTab === 'analisis' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('analisis')}
            disabled={!analysisResults}
          >
            <FaChartLine className="mr-2" />
            Análisis
          </button>
          <button 
            className={`px-4 py-2 rounded-md flex items-center ${activeTab === 'historial' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveTab('historial')}
          >
            <FaHistory className="mr-2" />
            Historial
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100%-88px)]">
        {/* Panel izquierdo - Chat de Sofia o análisis */}
        <div className="flex-1 mr-4">
          {activeTab === 'chat' && (
            <SofiaChat 
              initialMessage="Hola, soy Sofia, tu asistente inteligente de reputación online. Puedo ayudarte a analizar menciones, identificar tendencias o sugerir estrategias para mejorar tu imagen digital. ¿En qué puedo asistirte hoy?"
              onAnalysisComplete={handleAnalysisComplete}
            />
          )}
          
          {activeTab === 'analisis' && analysisResults && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full overflow-auto p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Resultados del Análisis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sentimiento</h3>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-700">
                          Positivo
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-green-700">
                          {analysisResults.sentiment.positive}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                      <div style={{ width: `${analysisResults.sentiment.positive}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                    </div>
                    
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-gray-200 text-gray-700">
                          Neutral
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-gray-700">
                          {analysisResults.sentiment.neutral}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div style={{ width: `${analysisResults.sentiment.neutral}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-500"></div>
                    </div>
                    
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-red-200 text-red-700">
                          Negativo
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-red-700">
                          {analysisResults.sentiment.negative}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                      <div style={{ width: `${analysisResults.sentiment.negative}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Palabras clave</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.keywords.map((keyword: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribución por canal</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">X</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{analysisResults.channels.X}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${analysisResults.channels.X}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Instagram</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{analysisResults.channels.instagram}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-pink-500 h-2.5 rounded-full" style={{ width: `${analysisResults.channels.instagram}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{analysisResults.channels.facebook}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${analysisResults.channels.facebook}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recomendaciones de IA</h3>
                
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <span className="text-green-600 text-lg font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Enfoque positivo:</span> Incrementa contenido relacionado con "desarrollo" y "propuestas" que muestran un sentimiento muy positivo (82%). Programa al menos 3 publicaciones semanales sobre estos temas.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-lg font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Mitigación de críticas:</span> Abordar proactivamente temas relacionados con "transporte público" que generan sentimiento negativo. Sugiero publicar un video explicativo sobre tu plan de movilidad sostenible.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <span className="text-purple-600 text-lg font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Oportunidad en Instagram:</span> Tus menciones en Instagram tienen mayor sentimiento positivo pero menor volumen. Incrementa la frecuencia de publicaciones en esta red un 25%.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <button className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                      <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.178-.331.176-.662.352-.988.528-2.56 1.386-4.926 2.837-6.735 4.246a60.376 60.376 0 0 0-1.257.95 4.125 4.125 0 0 0-.296.282c-.166.16-.33.32-.487.485l-.006.006a2.619 2.619 0 0 0-.361.39c-.088.108-.172.22-.25.337a2.99 2.99 0 0 0-.225.394 3.81 3.81 0 0 0-.101.783c0 .903.462 1.697 1.16 2.157.55.36 1.257.53 2.069.53a5.33 5.33 0 0 0 1.564-.239c.542-.174 1.096-.429 1.675-.76C11.043 22.56 14.61 20.895 17.6 19.5c5.298-2.477 7.951-5.41 7.951-7.5 0-1.041-.406-2.042-1.194-2.982A6.753 6.753 0 0 0 22.8 7.4a6.08 6.08 0 0 0-1.964-1.872A6.893 6.893 0 0 0 18.724 4.8c-.47 0-.914.073-1.312.219a5.69 5.69 0 0 0-1.56.95 5.491 5.491 0 0 0-1.13 1.215c-.238.35-.43.7-.57 1.05a4.751 4.751 0 0 0-.076-.572 6.414 6.414 0 0 0-.064-.401c-.071-.363-.17-.693-.3-.985a4.57 4.57 0 0 0-.394-.8c-.629-1.013-1.68-1.684-2.955-1.684-1.442 0-2.697.66-3.262 1.653-.59 1.035-.59 2.354 0 3.59.137.283.313.55.521.798.467.556 1.155 1.038 1.997 1.455a1.674 1.674 0 0 1-.557-.797c-.113-.325-.069-.678.137-.976.06-.088.128-.172.2-.25a1.87 1.87 0 0 1 .272-.25c.123-.095.263-.178.426-.241.208-.088.458-.142.769-.142.3 0 .559.054.785.142a1.81 1.81 0 0 1 .484.297a1.668 1.668 0 0 1 .342.454c.072.131.124.295.156.491.07.426.01.81-.193 1.148a1.744 1.744 0 0 1-.43.467a5.212 5.212 0 0 1-.495.327a9.05 9.05 0 0 1-.583.29c-.2.095-.398.179-.592.242-1.95.661-3.203 1.358-3.762 2.09a3.272 3.272 0 0 0-.305.546c-.592 1.298-.157 2.433 1.307 3.388 1.157.757 2.646 1.136 4.467 1.136 1.87 0 4.126-.449 6.767-1.345 2.601-.882 4.992-2.133 7.17-3.75a.75.75 0 0 0 .272-.83 21.999 21.999 0 0 0-12.271-14.987Z" />
                    </svg>
                    Consultar a Sofia para más detalles
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Menciones destacadas analizadas</h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800 dark:text-white">@MariaGonzalez</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">X - Hace 2 días</span>
                      <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                        Positivo (92%)
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                      Las propuestas de desarrollo sostenible de @CarlosRodriguezG son exactamente lo que necesitamos. Un político que entiende el futuro! #Desarrollo #CiudadesSostenibles
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800 dark:text-white">@JuanPerez</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">X - Hace 4 días</span>
                      <span className="ml-auto px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs">
                        Negativo (87%)
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                      La propuesta de transporte público de Rodriguez no soluciona los problemas de fondo. Más de lo mismo, necesitamos soluciones reales no promesas vacías. #TransportePublico
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'historial' && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full overflow-auto p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Historial de conversaciones</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">Análisis de tendencias políticas</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">15/04/2025 - 14:32</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    Sofia analizó las tendencias políticas del último mes, destacando oportunidades en temas de sostenibilidad y educación...
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">Estrategia para LinkedIn</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">10/04/2025 - 09:15</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    Desarrollo de plan de contenidos para LinkedIn enfocado en propuestas de desarrollo económico y generación de empleo...
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">Análisis de sentimiento en X</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">05/04/2025 - 16:48</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    Reporte detallado de sentimiento en X, mostrando un 68% de menciones positivas relacionadas con propuestas de medio ambiente...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Panel derecho - Capacidades de Sofia */}
        <div className="w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 overflow-auto">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Capacidades de Sofia IA
          </h3>
          
          <div className="space-y-5">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 mr-3">
                  <FaChartLine />
                </div>
                <h4 className="font-medium text-gray-800 dark:text-white">Análisis de sentimientos</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 pl-10">
                Evaluación del tono emocional (positivo, negativo, neutral) de las menciones en redes sociales.
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-500 mr-3">
                  <FaWaveSquare />
                </div>
                <h4 className="font-medium text-gray-800 dark:text-white">Detección de tendencias</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 pl-10">
                Identificación de temas emergentes y patrones en las conversaciones relacionadas con tu perfil.
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-500 mr-3">
                  <FaDatabase />
                </div>
                <h4 className="font-medium text-gray-800 dark:text-white">Extracción de insights</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 pl-10">
                Generación de conocimientos accionables a partir del análisis de datos sociales.
              </p>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
              <h4 className="font-medium text-gray-800 dark:text-white mb-3">Comandos útiles</h4>
              
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">•</span>
                  "Analiza mis menciones en X"
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">•</span>
                  "Compara mi presencia en Facebook e Instagram"
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">•</span>
                  "Sugiéreme contenido para mejorar mi imagen"
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">•</span>
                  "Identifica posibles riesgos reputacionales"
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">•</span>
                  "Genera un reporte de tendencias del sector"
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
