import React from 'react';
import { useCreditosContext } from '@/context/CreditosContext';
import { motion } from 'framer-motion';

interface CreditosSummaryProps {
  showDetails?: boolean;
}

export default function CreditosSummary({ showDetails = true }: CreditosSummaryProps) {
  const { creditos, cargandoCreditos } = useCreditosContext();
  
  const total = creditos.disponibles + creditos.gastados;
  const porcentajeDisponible = total > 0 ? (creditos.disponibles / total) * 100 : 0;
  const porcentajeGastado = total > 0 ? (creditos.gastados / total) * 100 : 0;
  
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
    <div className="card p-4 sm:p-6">
      <h2 className="heading-secondary mb-4 flex items-center justify-between">
        <span>Resumen de Créditos</span>
        {cargandoCreditos && (
          <span className="ml-2 inline-flex h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-primary-600"></span>
        )}
      </h2>
      
      <div className="mb-6 space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Créditos Disponibles
            </span>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {creditos.disponibles.toLocaleString('es-CO')}
            </span>
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
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {creditos.gastados.toLocaleString('es-CO')}
                </p>
              </div>
              
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Asignados</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {total.toLocaleString('es-CO')}
                </p>
              </div>
            </div>

            {creditos.proximaExpiracion && (
              <div className="mt-4 rounded-md bg-amber-50 p-3 dark:bg-amber-900/20">
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  <span className="font-medium">Próxima expiración:</span>{' '}
                  {new Date(creditos.proximaExpiracion).toLocaleDateString('es-CO', {
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
