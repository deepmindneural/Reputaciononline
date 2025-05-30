"use client";

import React from 'react';
import CreditosSummary from '@/components/creditos/CreditosSummary';
import HistorialCreditos from '@/components/creditos/HistorialCreditos';
import CreditosUsageChart from '@/components/creditos/CreditosUsageChart';
import { motion } from 'framer-motion';
import { CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CreditosPage() {
  // Planes disponibles para comprar
  const planes = [
    {
      id: 'plan-basico',
      nombre: 'Plan Básico',
      creditos: 500,
      precio: 99000,
      duracion: '30 días',
      caracteristicas: [
        'Monitoreo de menciones básico',
        'Análisis de sentimiento limitado',
        'Soporte por email'
      ]
    },
    {
      id: 'plan-pro',
      nombre: 'Plan Profesional',
      creditos: 1500,
      precio: 249000,
      duracion: '30 días',
      popular: true,
      caracteristicas: [
        'Monitoreo avanzado de menciones',
        'Análisis de sentimiento ilimitado',
        'Informes semanales',
        'Soporte prioritario'
      ]
    },
    {
      id: 'plan-empresa',
      nombre: 'Plan Empresarial',
      creditos: 5000,
      precio: 699000,
      duracion: '30 días',
      caracteristicas: [
        'Monitoreo completo de redes sociales',
        'Análisis de sentimiento avanzado',
        'Informes personalizados',
        'API para integración',
        'Soporte 24/7'
      ]
    }
  ];

  // Animación para los elementos de la página
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

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Título de la página */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Créditos</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Administra tus créditos, revisa el historial de consumo y adquiere más para continuar utilizando la plataforma.
        </p>
      </div>

      {/* Resumen de créditos */}
      <motion.div variants={itemVariants}>
        <CreditosSummary />
      </motion.div>

      {/* Análisis de uso de créditos */}
      <motion.div variants={itemVariants}>
        <CreditosUsageChart />
      </motion.div>

      {/* Historial de transacciones */}
      <motion.div variants={itemVariants}>
        <HistorialCreditos />
      </motion.div>

      {/* Planes disponibles */}
      <motion.div variants={itemVariants}>
        <div className="card p-6">
          <h2 className="heading-secondary mb-6">Planes Disponibles</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {planes.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`relative overflow-hidden rounded-lg border ${plan.popular ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-200 dark:border-gray-700'}`}
                variants={itemVariants}
                custom={index}
              >
                {plan.popular && (
                  <div className="absolute -right-12 top-6 w-36 -rotate-45 bg-primary-500 py-1 text-center text-sm font-medium text-white">
                    Más Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{plan.nombre}</h3>
                  <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                    <span className="text-3xl font-extrabold tracking-tight">
                      ${plan.precio.toLocaleString('es-CO')}
                    </span>
                    <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400">/mes</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {plan.creditos.toLocaleString('es-CO')} créditos | {plan.duracion} de validez
                  </p>

                  <ul className="mt-6 space-y-3">
                    {plan.caracteristicas.map((caracteristica, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary-500 dark:text-primary-400" />
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{caracteristica}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <button
                      className={`flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-700 dark:hover:bg-primary-600' : 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:text-primary-400 dark:hover:bg-gray-700'}`}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Comprar Ahora
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 rounded-md bg-gray-50 p-4 dark:bg-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">¿Necesitas un plan personalizado?</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Si necesitas una cantidad específica de créditos o tienes requerimientos especiales, contacta con nuestro equipo comercial.
            </p>
            <div className="mt-3">
              <button className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Solicitar plan personalizado <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
