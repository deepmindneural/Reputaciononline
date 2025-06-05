"use client";

import React from 'react';
import CreditosSummary from '@/components/creditos/CreditosSummary';
import MencionesMap from '@/components/dashboard/MencionesMap';
import { motion } from 'framer-motion';
import { ArrowUpRight, RefreshCw, TrendingUp, TrendingDown, Twitter, Facebook, Instagram, CreditCard } from 'lucide-react';
import dynamic from 'next/dynamic';

// Importar el mapa dinámicamente para evitar problemas con SSR
const DynamicMencionesMap = dynamic(() => import('@/components/dashboard/MencionesMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
      <div className="text-gray-500 dark:text-gray-400">Cargando mapa...</div>
    </div>
  ),
});

// Simulación de datos para garantizar visualización
const simulationData = {
  mentions: {
    total: 1245,
    positive: 845,
    negative: 124,
    neutral: 276,
    trend: '+12%',
    byPlatform: {
      twitter: 682,
      facebook: 215,
      instagram: 178,
      news: 92,
      blogs: 78
    },
    recent: [
      { id: 'm1', author: 'María López', content: 'Excelente servicio y atención', sentiment: 'positive', date: '2025-06-05T10:45:00', platform: 'twitter' },
      { id: 'm2', author: 'Carlos Ruiz', content: 'Me encantó el producto, muy recomendable', sentiment: 'positive', date: '2025-06-05T09:30:00', platform: 'facebook' },
      { id: 'm3', author: 'Ana Martínez', content: 'Tuve problemas con la entrega pero lo resolvieron rápido', sentiment: 'neutral', date: '2025-06-04T18:20:00', platform: 'instagram' }
    ],
    timeSeries: [
      { date: '2025-06-01', value: 120 },
      { date: '2025-06-02', value: 145 },
      { date: '2025-06-03', value: 132 },
      { date: '2025-06-04', value: 190 },
      { date: '2025-06-05', value: 210 }
    ]
  },
  reputation: {
    score: 87,
    previousScore: 82,
    trend: 'up'
  },
  ranking: {
    position: 3,
    previousPosition: 5,
    totalCompetitors: 28,
    trend: 'up'
  }
};

export default function Dashboard() {
  // Animación para las tarjetas
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05, // Reducir delay para que aparezcan más rápido
        duration: 0.4,
        ease: 'easeOut'
      }
    })
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">Bienvenido a tu centro de monitoreo de reputación online</p>
        </div>
        <button className="button-primary flex items-center text-sm">
          <RefreshCw className="mr-2 h-4 w-4" /> Actualizar Datos
        </button>
      </div>

      {/* Resumen de créditos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <CreditosSummary showDetails={true} />
        </div>
        
        {/* Estadísticas rápidas */}
        <motion.div 
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card p-4 bg-white dark:bg-gray-800"
        >
          <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Menciones Totales</h3>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">1,248</p>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span className="text-sm font-medium">+12.5%</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-2 rounded-full bg-primary-600" style={{ width: '70%' }}></div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
            <span className="font-medium">428</span> nuevas menciones esta semana
          </div>
        </motion.div>
        
        <motion.div 
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card p-4 bg-white dark:bg-gray-800"
        >
          <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Sentimiento Positivo</h3>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">68.2%</p>
            <div className="flex items-center text-red-600 dark:text-red-400">
              <TrendingDown className="mr-1 h-4 w-4" />
              <span className="text-sm font-medium">-3.1%</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '68.2%' }}></div>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-300">
            <span>Negativo: <span className="font-medium">18.3%</span></span>
            <span>Neutral: <span className="font-medium">13.5%</span></span>
          </div>
        </motion.div>
      </div>

      {/* Mapa de menciones */}
      <div className="mb-6">
        <DynamicMencionesMap />
      </div>
      
      {/* Menciones recientes y actividad */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Menciones recientes */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden bg-white dark:bg-gray-800">
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="heading-secondary">Menciones Recientes</h2>
                <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                  12 nuevas hoy
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {/* Mención 1 */}
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300">
                        <Twitter className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">@usuario123</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Twitter • Hace 2 horas</p>
                      </div>
                    </div>
                    <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                      Positivo
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    ¡Excelente servicio de @MarcaEjemplo! Resolvieron mi problema rápidamente. Muy recomendado 👍
                  </p>
                </div>
                
                {/* Mención 2 */}
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300">
                        <Facebook className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">María García</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Facebook • Hace 5 horas</p>
                      </div>
                    </div>
                    <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                      Negativo
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Llevo 3 días esperando respuesta de @MarcaEjemplo. Pésima atención al cliente.
                  </p>
                </div>
                
                {/* Mención 3 */}
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-500 dark:bg-pink-900 dark:text-pink-300">
                        <Instagram className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">@influencer_oficial</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Instagram • Hace 8 horas</p>
                      </div>
                    </div>
                    <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      Neutral
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Probando los nuevos productos de @MarcaEjemplo. ¿Alguien más los ha usado? Cuéntenme su experiencia.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                  Ver todas las menciones <ArrowUpRight className="ml-1 inline h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actividad reciente */}
        <div className="card overflow-hidden">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <h2 className="heading-secondary">Actividad Reciente</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium text-gray-900 dark:text-white">Análisis completado</span> para Twitter
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hace 30 minutos</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium text-gray-900 dark:text-white">50 créditos consumidos</span> en análisis de sentimiento
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hace 1 hora</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium text-gray-900 dark:text-white">Aumento de menciones</span> detectado en Facebook
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hace 3 horas</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium text-gray-900 dark:text-white">30 créditos consumidos</span> en monitoreo de menciones
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hace 5 horas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
