"use client";

import React from 'react';
import CreditosSummary from '@/components/creditos/CreditosSummary';
import { motion } from 'framer-motion';
import { ArrowUpRight, RefreshCw, TrendingUp, TrendingDown, Twitter, Facebook, Instagram, CreditCard } from 'lucide-react';

export default function Dashboard() {
  // Animación para las tarjetas
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <button className="button-outline flex items-center text-sm">
          <RefreshCw className="mr-2 h-4 w-4" /> Actualizar
        </button>
      </div>

      {/* Resumen de créditos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <CreditosSummary showDetails={false} />
        </div>
        
        {/* Estadísticas rápidas */}
        <motion.div 
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card p-4"
        >
          <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Menciones Totales</h3>
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
        </motion.div>
        
        <motion.div 
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="card p-4"
        >
          <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Sentimiento Positivo</h3>
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
        </motion.div>
      </div>

      {/* Menciones recientes y actividad */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Menciones recientes */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <h2 className="heading-secondary">Menciones Recientes</h2>
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
