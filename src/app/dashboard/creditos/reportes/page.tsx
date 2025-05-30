"use client";

import React from 'react';
import { motion } from 'framer-motion';
import GeneradorReportes from '@/components/creditos/GeneradorReportes';
import { FileText, ChevronRight, Download, BarChart2 } from 'lucide-react';

export default function ReportesCreditosPage() {
  // Configuraciu00f3n de animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Reportes predefinidos
  const reportesPredefinidos = [
    {
      id: 'mensual-general',
      titulo: 'Reporte Mensual',
      descripcion: 'Consumo detallado de cru00e9ditos del u00faltimo mes',
      icono: <BarChart2 className="h-6 w-6 text-blue-500 dark:text-blue-400" />,
      color: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
    },
    {
      id: 'canales-sociales',
      titulo: 'Consumo por Canales',
      descripcion: 'Desglose de cru00e9ditos por cada red social',
      icono: <BarChart2 className="h-6 w-6 text-green-500 dark:text-green-400" />,
      color: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
    },
    {
      id: 'tendencias-trimestre',
      titulo: 'Tendencias Trimestrales',
      descripcion: 'Anu00e1lisis comparativo de los u00faltimos 3 meses',
      icono: <BarChart2 className="h-6 w-6 text-purple-500 dark:text-purple-400" />,
      color: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20'
    },
    {
      id: 'eficiencia-uso',
      titulo: 'Eficiencia de Uso',
      descripcion: 'Anu00e1lisis de optimizaciu00f3n y recomendaciones',
      icono: <BarChart2 className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
      color: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
    }
  ];

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Tu00edtulo de la pu00e1gina */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reportes de Cru00e9ditos</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Genera informes detallados sobre el consumo de cru00e9ditos para anu00e1lisis y optimizaciu00f3n.
        </p>
      </motion.div>

      {/* Migas de pan */}
      <motion.div variants={itemVariants} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <a href="/dashboard" className="hover:text-primary-600 dark:hover:text-primary-400">Dashboard</a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a href="/dashboard/creditos" className="hover:text-primary-600 dark:hover:text-primary-400">Cru00e9ditos</a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="text-gray-700 dark:text-gray-300">Reportes</span>
      </motion.div>

      {/* Reportes predefinidos */}
      <motion.div variants={itemVariants}>
        <div className="card p-6">
          <div className="mb-6 flex items-center">
            <FileText className="mr-3 h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h2 className="heading-secondary">Reportes Predefinidos</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reportesPredefinidos.map((reporte) => (
              <div 
                key={reporte.id}
                className={`flex flex-col rounded-lg border p-4 transition-transform hover:-translate-y-1 hover:shadow-md ${reporte.color}`}
              >
                <div className="mb-3 flex items-center">
                  {reporte.icono}
                  <h3 className="ml-2 text-base font-medium text-gray-900 dark:text-white">{reporte.titulo}</h3>
                </div>
                <p className="mb-4 flex-grow text-sm text-gray-700 dark:text-gray-300">{reporte.descripcion}</p>
                <button className="mt-auto inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Download className="mr-1.5 h-4 w-4" />
                  Descargar
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Historial de reportes */}
      <motion.div variants={itemVariants}>
        <div className="card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="mr-3 h-6 w-6 text-primary-600 dark:text-primary-400" />
              <h2 className="heading-secondary">Historial de Reportes</h2>
            </div>
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Ver todos
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Periodo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {[
                  {
                    nombre: 'Reporte Mensual Mayo 2025',
                    tipo: 'Completo',
                    periodo: '01/05/2025 - 31/05/2025',
                    fecha: '31/05/2025'
                  },
                  {
                    nombre: 'Anu00e1lisis de Canales Sociales',
                    tipo: 'Canales',
                    periodo: 'Abril 2025',
                    fecha: '30/04/2025'
                  },
                  {
                    nombre: 'Reporte de Optimizaciu00f3n',
                    tipo: 'Eficiencia',
                    periodo: 'Q1 2025',
                    fecha: '01/04/2025'
                  },
                  {
                    nombre: 'Tendencias Trimestrales',
                    tipo: 'Tendencia',
                    periodo: 'Ene - Mar 2025',
                    fecha: '01/04/2025'
                  },
                  {
                    nombre: 'Consumo por Tipo de Acciu00f3n',
                    tipo: 'Acciones',
                    periodo: 'Marzo 2025',
                    fecha: '31/03/2025'
                  }
                ].map((reporte, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{reporte.nombre}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{reporte.tipo}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{reporte.periodo}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{reporte.fecha}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button className="mr-2 inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <FileText className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Generador de reportes personalizados */}
      <motion.div variants={itemVariants}>
        <GeneradorReportes />
      </motion.div>
    </motion.div>
  );
}
