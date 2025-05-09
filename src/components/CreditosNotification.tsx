import React, { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import { useCreditos } from '@/context/CreditosContext';

interface CreditosNotificationProps {
  umbralCreditos?: number; // Umbral para mostrar la advertencia, predeterminado: 1000
}

const CreditosNotification: React.FC<CreditosNotificationProps> = ({ 
  umbralCreditos = 1000 
}) => {
  const { creditos } = useCreditos();
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
  
  useEffect(() => {
    // Mostrar la notificación si los créditos están por debajo del umbral
    setMostrarNotificacion(creditos.disponibles <= umbralCreditos);
  }, [creditos.disponibles, umbralCreditos]);

  if (!mostrarNotificacion) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50 animate-fade-in-up">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 border-orange-500 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Créditos bajos
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Te quedan <span className="font-bold text-orange-500">{creditos.disponibles}</span> créditos disponibles. 
              Considera adquirir más créditos para continuar utilizando todas las funcionalidades.
            </p>
            <div className="mt-3">
              <a
                href="/dashboard/creditos"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:bg-orange-900 dark:text-orange-100 dark:hover:bg-orange-800"
              >
                Comprar créditos
              </a>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={() => setMostrarNotificacion(false)}
            >
              <span className="sr-only">Cerrar</span>
              <FaTimesCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditosNotification;
