"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, BarChart3, Globe, TrendingUp, ArrowUpRight, DollarSign, Activity, FileText, Bell, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AdminDashboard() {
  // Datos de ejemplo para el dashboard
  const estadisticas = [
    { 
      titulo: 'Usuarios Activos', 
      valor: 145, 
      cambio: '+12%', 
      icono: <Users className="h-6 w-6" />,
      colorIcono: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      colorCambio: 'text-green-500 dark:text-green-400'
    },
    { 
      titulo: 'Créditos Asignados', 
      valor: '348,950', 
      cambio: '+8%', 
      icono: <CreditCard className="h-6 w-6" />,
      colorIcono: 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300',
      colorCambio: 'text-green-500 dark:text-green-400'
    },
    { 
      titulo: 'Créditos Consumidos', 
      valor: '142,380', 
      cambio: '+15%', 
      icono: <BarChart3 className="h-6 w-6" />,
      colorIcono: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300',
      colorCambio: 'text-green-500 dark:text-green-400'
    },
    { 
      titulo: 'Redes Conectadas', 
      valor: 512, 
      cambio: '+3%', 
      icono: <Globe className="h-6 w-6" />,
      colorIcono: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      colorCambio: 'text-green-500 dark:text-green-400'
    }
  ];

  // Animaciones con Framer Motion
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
      transition: {
        duration: 0.5
      }
    }
  };

  // Datos para los gráficos
  const consumosPorCanal = [
    { canal: 'Facebook', valor: 42380, color: '#1877F2' },
    { canal: 'Instagram', valor: 38750, color: '#E4405F' },
    { canal: 'X', valor: 31200, color: '#000000' },
    { canal: 'LinkedIn', valor: 18450, color: '#0A66C2' },
    { canal: 'TikTok', valor: 11600, color: '#000000' }
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Título del Dashboard */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel de Administración</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Monitoreo general de la plataforma Reputación Online.
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {estadisticas.map((stat, index) => (
          <motion.div
            key={index}
            className="card overflow-hidden bg-white p-6 dark:bg-gray-800"
            variants={itemVariants}
          >
            <div className="flex items-center">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.colorIcono}`}>
                {stat.icono}
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.titulo}</h2>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.valor}</p>
                <p className={`text-sm ${stat.colorCambio}`}>
                  <TrendingUp className="mr-1 inline h-3 w-3" /> {stat.cambio} vs mes anterior
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gráficos y análisis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Consumo por canal */}
        <motion.div 
          className="card p-6" 
          variants={itemVariants}
        >
          <h2 className="heading-secondary mb-4">Consumo por Canal</h2>
          <div className="space-y-4">
            {consumosPorCanal.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.canal}
                </div>
                <div className="ml-2 flex-1">
                  <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div 
                      className="h-4 rounded-full" 
                      style={{
                        width: `${(item.valor / 45000) * 100}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 w-24 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.valor.toLocaleString('es-CO')}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Ver reporte completo <ArrowUpRight className="ml-1 inline h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Usuarios más activos */}
        <motion.div 
          className="card p-6" 
          variants={itemVariants}
        >
          <h2 className="heading-secondary mb-4">Usuarios más Activos</h2>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Redes</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Créditos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {[
                  { nombre: 'Carlos Rodríguez', redes: 5, creditos: 25840 },
                  { nombre: 'María López', redes: 4, creditos: 18650 },
                  { nombre: 'Juan Martínez', redes: 3, creditos: 12470 },
                  { nombre: 'Ana Gómez', redes: 3, creditos: 9830 },
                  { nombre: 'Pedro Sánchez', redes: 2, creditos: 7620 }
                ].map((usuario, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{usuario.nombre}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{usuario.redes}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-primary-600 dark:text-primary-400">{usuario.creditos.toLocaleString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Ver todos los usuarios <ArrowUpRight className="ml-1 inline h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Actividad reciente y alertas */}
      <motion.div 
        className="card p-6" 
        variants={itemVariants}
      >
        <h2 className="heading-secondary mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              <CreditCard className="h-4 w-4" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-white">Carlos Rodríguez</span> ha consumido 1,250 créditos en análisis de sentimiento.
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Hace 30 minutos</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
              <Users className="h-4 w-4" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-white">5 nuevos usuarios</span> se han registrado en la plataforma.
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Hace 2 horas</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
              <CreditCard className="h-4 w-4" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-white">Se han asignado 15,000 créditos</span> a 3 usuarios.
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Hace 5 horas</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300">
              <Globe className="h-4 w-4" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-white">8 nuevas conexiones</span> de redes sociales realizadas.
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Hace 1 día</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-right">
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            Ver toda la actividad <ArrowUpRight className="ml-1 inline h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
