import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaSearch } from 'react-icons/fa';

interface TransaccionCredito {
  id: string;
  fecha: string;
  descripcion: string;
  tipo: 'consumo' | 'recarga';
  cantidad: number;
  canal?: 'X' | 'Facebook' | 'Instagram' | 'LinkedIn' | 'TikTok' | 'Búsqueda';
}

interface HistorialCreditosProps {
  transacciones: TransaccionCredito[];
}

const HistorialCreditos: React.FC<HistorialCreditosProps> = ({ transacciones }) => {
  // Función para obtener el ícono según el canal
  const getIconoCanal = (canal?: string) => {
    switch (canal) {
      case 'X':
        return <img src="/images/social/x-logo.png" alt="X" className="w-4 h-4" />;
      case 'Facebook':
        return <FaFacebook className="text-[#1877F2]" />;
      case 'Instagram':
        return <FaInstagram className="text-[#E4405F]" />;
      case 'LinkedIn':
        return <FaLinkedin className="text-[#0A66C2]" />;
      case 'TikTok':
        return <FaTiktok className="text-black dark:text-white" />;
      case 'Búsqueda':
        return <FaSearch className="text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Historial de Créditos
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Descripción
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Canal
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Créditos
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {transacciones.map((transaccion) => (
              <tr key={transaccion.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {transaccion.fecha}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                  {transaccion.descripcion}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {transaccion.canal && (
                    <div className="flex items-center">
                      <span className="mr-2">{getIconoCanal(transaccion.canal)}</span>
                      <span>{transaccion.canal}</span>
                    </div>
                  )}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-right ${
                  transaccion.tipo === 'consumo' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {transaccion.tipo === 'consumo' ? '-' : '+'}{transaccion.cantidad.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {transacciones.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No hay transacciones para mostrar
        </div>
      )}
    </div>
  );
};

export default HistorialCreditos;
