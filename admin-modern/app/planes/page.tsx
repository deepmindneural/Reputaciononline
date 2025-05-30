"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function PlanesPage() {
  const planes = [
    { 
      id: 1, 
      nombre: "Plan Básico", 
      descripcion: "Ideal para pequeñas empresas que comienzan con gestión de reputación online", 
      precio: 250000, 
      creditos: 10000, 
      caracteristicas: ["Monitoreo de 3 redes sociales", "Respuestas automáticas básicas", "Panel de control simple", "Soporte por email"] 
    },
    { 
      id: 2, 
      nombre: "Plan Avanzado", 
      descripcion: "Para empresas en crecimiento que necesitan gestionar su presencia digital", 
      precio: 500000, 
      creditos: 25000, 
      caracteristicas: ["Monitoreo de 5 redes sociales", "Respuestas automáticas avanzadas", "Panel analítico completo", "Soporte prioritario", "Informes mensuales"] 
    },
    { 
      id: 3, 
      nombre: "Plan Premium", 
      descripcion: "Solución completa para empresas que requieren gestión profesional de su reputación", 
      precio: 1000000, 
      creditos: 60000, 
      caracteristicas: ["Monitoreo ilimitado de redes sociales", "IA para respuestas personalizadas", "Análisis predictivo", "Soporte 24/7", "Informes semanales", "Gestión de crisis"] 
    },
  ];

  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Planes</h1>
          <button className="bg-[#00B3B0] hover:bg-[#00B3B0]/90 text-white px-4 py-2 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Crear Nuevo Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planes.map((plan, index) => (
            <motion.div
              key={plan.id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className={`h-3 ${
                plan.id === 1 ? 'bg-blue-500' : 
                plan.id === 2 ? 'bg-[#0CA5E9]' : 
                'bg-[#00B3B0]'
              }`}></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.nombre}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.descripcion}</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${plan.precio.toLocaleString('es-CO')}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">COP / mes</span>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
                    Incluye:
                  </h4>
                  <div className="text-xl font-bold text-[#0CA5E9] mb-2">
                    {plan.creditos.toLocaleString('es-CO')} créditos
                  </div>
                  <ul className="space-y-2">
                    {plan.caracteristicas.map((caracteristica, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{caracteristica}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-[#0CA5E9] hover:bg-[#0CA5E9]/90 text-white px-4 py-2 rounded-md">
                    Editar
                  </button>
                  <button className="flex-1 border border-[#00B3B0] text-[#00B3B0] hover:bg-[#00B3B0]/10 px-4 py-2 rounded-md">
                    Duplicar
                  </button>
                  <button className="flex-shrink-0 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Estadísticas de Planes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Distribución de Usuarios</h3>
              <div className="h-40 flex items-center justify-center text-gray-500 dark:text-gray-400">
                [Gráfico de Distribución]
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Ingresos Mensuales</h3>
              <div className="h-40 flex items-center justify-center text-gray-500 dark:text-gray-400">
                [Gráfico de Ingresos]
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Consumo de Créditos</h3>
              <div className="h-40 flex items-center justify-center text-gray-500 dark:text-gray-400">
                [Gráfico de Consumo]
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
