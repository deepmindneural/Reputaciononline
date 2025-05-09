"use client";

import React, { useState } from 'react';
import CreditosSummary from '@/components/CreditosSummary';
import HistorialCreditos from '@/components/HistorialCreditos';
import { FaCreditCard, FaArrowUp, FaChartLine } from 'react-icons/fa';

// Datos de ejemplo para la demo
const datosDemoCreditos = {
  creditosDisponibles: 15000,
  creditosGastados: 5000,
  ultimaRecarga: '12/04/2025',
  plan: 'Empresarial',
};

const datosHistorial = [
  {
    id: '1',
    fecha: '16/04/2025 16:32',
    descripcion: 'Análisis de sentimientos Instagram',
    tipo: 'consumo' as const,
    cantidad: 250,
    canal: 'Instagram' as const,
  },
  {
    id: '2',
    fecha: '15/04/2025 10:20',
    descripcion: 'Monitoreo de menciones en X',
    tipo: 'consumo' as const,
    cantidad: 500,
    canal: 'X' as const,
  },
  {
    id: '3',
    fecha: '14/04/2025 14:45',
    descripcion: 'Búsqueda de hashtags en tendencia',
    tipo: 'consumo' as const,
    cantidad: 100,
    canal: 'Búsqueda' as const,
  },
  {
    id: '4',
    fecha: '12/04/2025 09:15',
    descripcion: 'Compra de paquete de créditos',
    tipo: 'recarga' as const,
    cantidad: 10000,
  },
  {
    id: '5',
    fecha: '10/04/2025 18:05',
    descripcion: 'Análisis de audiencia TikTok',
    tipo: 'consumo' as const,
    cantidad: 300,
    canal: 'TikTok' as const,
  },
];

// Planes disponibles para compra
const planesDisponibles = [
  {
    id: 'basico',
    nombre: 'Básico',
    creditos: 5000,
    precio: 299000, // en pesos colombianos
    caracteristicas: [
      'Monitoreo de 3 redes sociales',
      'Hasta 10 palabras clave',
      'Reportes semanales',
    ],
  },
  {
    id: 'profesional',
    nombre: 'Profesional',
    creditos: 15000,
    precio: 699000,
    caracteristicas: [
      'Monitoreo de todas las redes sociales',
      'Hasta 30 palabras clave',
      'Reportes diarios',
      'Análisis de sentimientos',
    ],
    destacado: true,
  },
  {
    id: 'empresarial',
    nombre: 'Empresarial',
    creditos: 50000,
    precio: 1499000,
    caracteristicas: [
      'Monitoreo ilimitado de redes',
      'Palabras clave ilimitadas',
      'Reportes personalizados',
      'Análisis avanzado con IA',
      'Soporte prioritario',
    ],
  },
];

export default function CreditosPage() {
  const [mostrarPlanes, setMostrarPlanes] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestión de Créditos</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitorea y administra tus créditos para análisis de reputación online
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Resumen de créditos */}
        <div className="lg:col-span-1">
          <CreditosSummary 
            creditosDisponibles={datosDemoCreditos.creditosDisponibles}
            creditosGastados={datosDemoCreditos.creditosGastados}
            ultimaRecarga={datosDemoCreditos.ultimaRecarga}
            plan={datosDemoCreditos.plan}
          />
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
              onClick={() => setMostrarPlanes(true)}
              className="btn-primary flex items-center justify-center"
            >
              <FaCreditCard className="mr-2" />
              Comprar créditos
            </button>
            <button className="btn-secondary flex items-center justify-center">
              <FaChartLine className="mr-2" />
              Análisis de uso
            </button>
          </div>
        </div>
        
        {/* Historial de transacciones */}
        <div className="lg:col-span-2">
          <HistorialCreditos transacciones={datosHistorial} />
        </div>
      </div>
      
      {/* Modal para comprar créditos */}
      {mostrarPlanes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comprar Créditos</h2>
                <button 
                  onClick={() => setMostrarPlanes(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {planesDisponibles.map((plan) => (
                  <div 
                    key={plan.id} 
                    className={`border rounded-lg overflow-hidden ${plan.destacado ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-50' : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    {plan.destacado && (
                      <div className="bg-primary-500 text-white text-center py-1 text-sm font-medium">
                        Recomendado
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.nombre}</h3>
                      <div className="flex items-end mb-4">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(plan.precio)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">/mes</span>
                      </div>
                      <p className="text-primary-600 font-medium mb-4">
                        {plan.creditos.toLocaleString()} créditos
                      </p>
                      <ul className="mb-6 space-y-2">
                        {plan.caracteristicas.map((caracteristica, index) => (
                          <li key={index} className="flex items-start">
                            <FaArrowUp className="text-primary-500 mr-2 mt-1 transform rotate-45" />
                            <span className="text-gray-600 dark:text-gray-400">{caracteristica}</span>
                          </li>
                        ))}
                      </ul>
                      <button className={`w-full py-2 px-4 rounded-md font-medium ${plan.destacado ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}>
                        Seleccionar plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Métodos de pago aceptados</h4>
                <div className="flex space-x-4">
                  <img src="/credit-cards/visa.svg" alt="Visa" className="h-8" />
                  <img src="/credit-cards/mastercard.svg" alt="Mastercard" className="h-8" />
                  <img src="/credit-cards/pse.svg" alt="PSE" className="h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
