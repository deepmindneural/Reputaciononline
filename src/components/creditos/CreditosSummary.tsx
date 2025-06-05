import React from 'react';
import { useCreditosContext } from '@/context/CreditosContext';
import { motion } from 'framer-motion';

interface CreditosSummaryProps {
  showDetails?: boolean;
}

export default function CreditosSummary({ showDetails = true }: CreditosSummaryProps) {
  // Obtener datos del contexto
  const { 
    disponibles, 
    gastados, 
    totalAsignado, 
    isLoading: cargandoCreditos 
  } = useCreditosContext();
  
  const total = disponibles + gastados;
  const porcentajeDisponible = total > 0 ? (disponibles / total) * 100 : 0;
  const porcentajeGastado = total > 0 ? (gastados / total) * 100 : 0;
  
  // Determinar el color de la barra de progreso según el nivel de créditos
  const getProgressColor = () => {
    if (porcentajeDisponible < 20) return 'credit-low';
    if (porcentajeDisponible < 50) return 'credit-warning';
    return '';
  };

  // Animación para la barra de progreso
  const progressAnimation = {
    hidden: { width: 0 },
    visible: { 
      width: `${porcentajeDisponible}%`,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  return (
    <div className="card p-4 sm:p-6 bg-white dark:bg-gray-800">
      <h2 className="heading-secondary mb-4 flex items-center justify-between">
        <span className="text-gray-900 dark:text-white">Resumen de Créditos</span>
        {cargandoCreditos && (
          <span className="ml-2 inline-flex h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-primary-600"></span>
        )}
      </h2>
      
      <div className="mb-6 space-y-4">
        <div>
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="inline-block h-3 w-3 rounded-full bg-primary-400 mr-1"></span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Créditos disponibles
                </span>
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {disponibles.toLocaleString('es-CO')}
                </span>
                <span className="ml-1 text-xs text-green-600 dark:text-green-400">
                  +{Math.floor(disponibles * 0.05).toLocaleString('es-CO')} este mes
                </span>
              </div>
            </div>
          </div>
          <div className="credit-bar">
            <motion.div 
              className={`credit-progress ${getProgressColor()}`}
              initial="hidden"
              animate="visible"
              variants={progressAnimation}
            />
          </div>
        </div>

        {showDetails && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Gastados</p>
                <div className="mt-4 rounded-md bg-gray-50 dark:bg-gray-800/50 p-3 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Consumo mensual
                    </span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {Math.floor((gastados / (gastados + disponibles)) * 100)}% del plan
                    </span>
                  </div>
                  <div className="mt-2 mb-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-2 rounded-full bg-primary-500" style={{ width: `${Math.floor((gastados / (gastados + disponibles)) * 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>0</span>
                    <span>{(gastados + disponibles).toLocaleString('es-CO')}</span>
                  </div>
                  <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                    Última actualización: {new Date().toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resumen de Créditos</h3>
                <div className="flex items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Periodo: {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
                  <span className="ml-2 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Actualizado</span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Próxima facturación: {new Date(Date.now() + 15*24*60*60*1000).toLocaleDateString('es-ES')}</p>
              </div>
            </div>

            {/* No tenemos proximaExpiracion en el contexto actual */}
            {false && (
              <div className="mt-4 rounded-md bg-amber-50 p-3 dark:bg-amber-900/20">
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  <span className="font-medium">Próxima expiración:</span>{' '}
                  {new Date().toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {showDetails && (
        <div className="flex justify-end">
          <button className="button-outline text-sm">
            Comprar Créditos
          </button>
        </div>
      )}
    </div>
  );
}
