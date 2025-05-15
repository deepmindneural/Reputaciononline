import React from 'react';
import { FaCreditCard, FaHistory } from 'react-icons/fa';

interface CreditosSummaryProps {
  creditosDisponibles: number;
  creditosGastados: number;
  ultimaRecarga: string;
  plan: string;
}

const CreditosSummary: React.FC<CreditosSummaryProps> = ({
  creditosDisponibles,
  creditosGastados,
  ultimaRecarga,
  plan
}) => {
  // Calcular porcentaje de créditos usados para la barra de progreso
  const totalCreditos = creditosDisponibles + creditosGastados;
  const porcentajeUsado = Math.round((creditosGastados / totalCreditos) * 100);
  
  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Estado de Créditos</h3>
        <span className="badge bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
          Plan {plan}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Disponibles</p>
          <p className="text-2xl font-bold text-primary-600">{creditosDisponibles.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Gastados</p>
          <p className="text-2xl font-bold text-secondary">{creditosGastados.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1 text-sm">
          <span>Consumo</span>
          <span>{porcentajeUsado}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-primary-500 h-2.5 rounded-full" 
            style={{ width: `${porcentajeUsado}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center">
          <FaHistory className="mr-1" />
          Última recarga: {ultimaRecarga}
        </span>
        <button className="btn-primary text-sm py-1 flex items-center">
          <FaCreditCard className="mr-1" />
          Comprar más
        </button>
      </div>
    </div>
  );
};

export default CreditosSummary;
