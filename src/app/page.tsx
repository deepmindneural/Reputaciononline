"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-600"></div>
            <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">Reputación Online</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="button-outline text-sm">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="button-primary text-sm">
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Monitorea tu</span>
              <span className="block text-primary-600 dark:text-primary-400">presencia digital</span>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300">
              Gestiona la reputación de tu marca en todas las redes sociales. Analiza menciones, mide el sentimiento y toma decisiones estratégicas.
            </p>
            <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link href="/register" className="button-primary text-center">
                Comenzar Gratis
              </Link>
              <Link href="/planes" className="button-secondary text-center">
                Ver Planes
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-64 overflow-hidden rounded-lg shadow-xl sm:h-80 lg:h-96"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-cyan-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-center text-xl font-bold text-white">Dashboard de análisis de redes sociales</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Características Principales</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300">
              Todo lo que necesitas para gestionar tu reputación online en un solo lugar.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-lg bg-white p-6 shadow dark:bg-gray-700"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                  <span className="text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-600 py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white">Comienza a monitorear tu reputación hoy</h2>
          <p className="mx-auto mt-4 max-w-xl text-xl text-primary-100">
            Prueba nuestra plataforma sin costo y descubre el poder del análisis de redes sociales.
          </p>
          <div className="mt-8">
            <Link href="/register" className="rounded-md bg-white px-5 py-3 text-base font-medium text-primary-600 hover:bg-primary-50">
              Crear Cuenta Gratuita
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold">Reputación Online</h3>
              <p className="mt-4 text-sm text-gray-300">
                La plataforma más completa para el monitoreo y análisis de tu presencia en redes sociales.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Producto</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li><Link href="/features" className="hover:text-primary-400">Características</Link></li>
                <li><Link href="/planes" className="hover:text-primary-400">Planes y Precios</Link></li>
                <li><Link href="/demo" className="hover:text-primary-400">Solicitar Demo</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Recursos</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li><Link href="/blog" className="hover:text-primary-400">Blog</Link></li>
                <li><Link href="/guides" className="hover:text-primary-400">Guías</Link></li>
                <li><Link href="/support" className="hover:text-primary-400">Soporte</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Empresa</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li><Link href="/about" className="hover:text-primary-400">Sobre Nosotros</Link></li>
                <li><Link href="/contact" className="hover:text-primary-400">Contacto</Link></li>
                <li><Link href="/privacy" className="hover:text-primary-400">Política de Privacidad</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Reputación Online. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    title: 'Monitoreo de Redes Sociales',
    description: 'Conecta todas tus redes sociales y monitorea las menciones de tu marca en tiempo real.'
  },
  {
    title: 'Análisis de Sentimiento',
    description: 'Comprende cómo percibe tu audiencia tu marca con análisis avanzado de sentimiento.'
  },
  {
    title: 'Informes Detallados',
    description: 'Obtén informes completos sobre tu presencia digital para tomar decisiones informadas.'
  },
  {
    title: 'Gestión de Créditos',
    description: 'Sistema flexible de créditos para gestionar tu consumo según tus necesidades específicas.'
  },
  {
    title: 'Visualización Geográfica',
    description: 'Visualiza la distribución geográfica de tus menciones para estrategias localizadas.'
  },
  {
    title: 'Alertas Personalizadas',
    description: 'Configura alertas para estar al tanto de menciones importantes instantáneamente.'
  }
];
