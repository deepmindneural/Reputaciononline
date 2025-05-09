"use client";

import React, { useState } from 'react';
import { 
  FaUsers, 
  FaChartLine, 
  FaServer, 
  FaUserPlus, 
  FaRegBell,
  FaDownload,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt
} from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Componente para las tarjetas de resumen
const StatCard = ({ icon, title, value, change, changeType, info, color = 'primary' }: any) => {
  const colorClasses: {[key: string]: {bg: string, text: string, darkBg: string, darkText: string}} = {
    primary: {
      bg: 'bg-primary-100',
      text: 'text-primary-500',
      darkBg: 'dark:bg-primary-900',
      darkText: 'dark:text-primary-300'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-500',
      darkBg: 'dark:bg-purple-900',
      darkText: 'dark:text-purple-300'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-500',
      darkBg: 'dark:bg-blue-900',
      darkText: 'dark:text-blue-300'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-500',
      darkBg: 'dark:bg-green-900',
      darkText: 'dark:text-green-300'
    },
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 has-tooltip">
        <FaInfoCircle />
        <span className="tooltip bg-black text-white text-sm p-2 rounded absolute -mt-12 -ml-32 w-48">
          {info}
        </span>
      </div>
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full mr-4 ${colorClasses[color].bg} ${colorClasses[color].text} ${colorClasses[color].darkBg} ${colorClasses[color].darkText}`}>
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
        <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">vs. mes anterior</span>
      </div>
    </div>
  );
};

export default function AdminDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  return (
    <div className="py-6 px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel de Administraciu00f3n</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiu00f3n centralizadau00a0de la plataforma Reputaciu00f3n Online
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <FaCalendarAlt className="mr-2" />
            Actualizado: 16 de abril de 2025
          </div>
          
          <button className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors">
            <FaDownload className="mr-2" />
            Exportar informe
          </button>
        </div>
      </div>

      {/* Estadu00edsticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard 
            icon={<FaUsers className="text-xl" />} 
            title="Usuarios activos" 
            value="248" 
            change="15.3%" 
            changeType="up"
            info="Nu00famero total de usuarios activos en la plataforma durante el periodo seleccionado."
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard 
            icon={<FaChartLine className="text-xl" />} 
            title="Menciones procesadas" 
            value="1,248,652" 
            change="32.7%" 
            changeType="up"
            info="Total de menciones procesadas en todas las plataformas monitoreadas."
            color="blue"
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard 
            icon={<FaServer className="text-xl" />} 
            title="Cru00e9ditos consumidos" 
            value="12.8M" 
            change="8.4%" 
            changeType="up"
            info="Total de cru00e9ditos consumidos por todos los usuarios de la plataforma."
            color="purple"
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <StatCard 
            icon={<FaUserPlus className="text-xl" />} 
            title="Nuevos usuarios" 
            value="37" 
            change="12.1%" 
            changeType="down"
            info="Nu00famero de nuevos usuarios registrados durante el periodo seleccionado."
            color="green"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Usuarios por plan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Usuarios por Plan</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Plan Empresarial</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">65 usuarios</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Plan Profesional</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">112 usuarios</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Plan Bu00e1sico</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">71 usuarios</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="font-medium text-gray-900 dark:text-white">248 usuarios activos</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Link 
              href="/admin/usuarios"
              className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
            >
              Ver todos los usuarios
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Actividad reciente */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Actividad reciente</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciu00f3n
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Detalles
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                        AR
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Ana Rodriguez</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Plan Empresarial</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Compra de cru00e9ditos
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Hace 15 minutos
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <a href="#" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">Ver</a>
                  </td>
                </tr>
                
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        JM
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Juan Martinez</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Plan Profesional</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Conexiu00f3n nueva red
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Hace 42 minutos
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <a href="#" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">Ver</a>
                  </td>
                </tr>
                
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                        CG
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Carlos Gu00f3mez</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Plan Bu00e1sico</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      Actualizar perfil
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Hace 1 hora
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <a href="#" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">Ver</a>
                  </td>
                </tr>
                
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center">
                        LV
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Laura Vargas</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Plan Empresarial</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Descarga informe
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Hace 3 horas
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <a href="#" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">Ver</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <Link 
              href="/admin/actividad"
              className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
            >
              Ver toda la actividad
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Alertas del sistema */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Alertas del sistema</h2>
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center">
            <FaRegBell className="mr-2" />
            Configurar alertas
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-600">
            <div className="flex-shrink-0 text-yellow-500 dark:text-yellow-400 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Alto uso de API</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                El uso de la API de X ha alcanzado el 85% del límite diario. Considere aumentar la cuota o ajustar la frecuencia de solicitudes.
              </p>
              <div className="mt-2">
                <button className="text-xs text-yellow-800 dark:text-yellow-300 underline">
                  Revisar configuraciones
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex p-4 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600">
            <div className="flex-shrink-0 text-red-500 dark:text-red-400 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Fallo en la conexiu00f3n de Instagram</h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                La API de Instagram reporta errores de autenticaciu00f3n. 12 usuarios afectados. Se requiere renovar las credenciales.
              </p>
              <div className="mt-2">
                <button className="text-xs text-red-800 dark:text-red-300 underline">
                  Solucionar ahora
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600">
            <div className="flex-shrink-0 text-green-500 dark:text-green-400 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Actualizaciu00f3n de modelos de IA completa</h3>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Los modelos de IA para anu00e1lisis de sentimientos y detecciu00f3n de tendencias han sido actualizados exitosamente a la versiu00f3n 2.4.5.
              </p>
              <div className="mt-2">
                <button className="text-xs text-green-800 dark:text-green-300 underline">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accesos ru00e1pidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Gestor de usuarios</h3>
          <p className="mb-6 opacity-90">Administre usuarios, asigne roles y gestione permisos de la plataforma.</p>
          <Link 
            href="/admin/usuarios"
            className="inline-flex items-center px-4 py-2 bg-white text-primary-600 rounded-md font-medium shadow-sm hover:bg-gray-100 transition-colors"
          >
            <FaUsers className="mr-2" />
            Ir a usuarios
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Gestor de cru00e9ditos</h3>
          <p className="mb-6 opacity-90">Configure planes, asigne cru00e9ditos y monitoree el consumo de recursos.</p>
          <Link 
            href="/admin/creditos"
            className="inline-flex items-center px-4 py-2 bg-white text-purple-600 rounded-md font-medium shadow-sm hover:bg-gray-100 transition-colors"
          >
            <FaServer className="mr-2" />
            Gestionar cru00e9ditos
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Configuraciones avanzadas</h3>
          <p className="mb-6 opacity-90">Configure parau00e1metros del sistema, APIs externas y recursos de IA.</p>
          <Link 
            href="/admin/configuracion"
            className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-md font-medium shadow-sm hover:bg-gray-100 transition-colors"
          >
            <FaServer className="mr-2" />
            Configurar sistema
          </Link>
        </div>
      </div>
    </div>
  );
}
