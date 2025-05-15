'use client';

import React from 'react';
import Link from 'next/link';
import { FaChartLine, FaShieldAlt, FaRocket, FaCheck, FaUsers, FaComments, FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaStar, FaQuoteLeft } from 'react-icons/fa';
import LandingNavbar from '@/components/layout/LandingNavbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Usando el componente LandingNavbar */}
      <LandingNavbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-cyan-600 to-blue-700 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pt-8 pb-16 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32 md:flex md:items-center">
            <div className="md:w-1/2 px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">Controla y mejora tu</span>
                <span className="block text-cyan-200">reputación digital</span>
              </h1>
              <p className="mt-3 text-base text-white sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
                La plataforma integral que monitorea, analiza y optimiza tu presencia en redes sociales y medios digitales.
              </p>
              <div className="mt-8 flex space-x-4">
                <a href="#planes" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-cyan-800 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10">
                  Ver planes
                </a>
                <Link
                  href="/login"
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-900 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
                >
                  Iniciar ahora
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0 px-4 sm:px-6 lg:px-8">
              <img
                className="w-full h-auto object-cover rounded-lg shadow-xl"
                src="https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Monitoreo de redes sociales"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de características */}
      <section id="caracteristicas" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Características principales
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Todo lo que necesitas para gestionar y mejorar tu reputación digital en un solo lugar.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Característica 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-cyan-500 p-3 bg-cyan-100 dark:bg-cyan-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaChartLine className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Monitoreo en tiempo real</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Seguimiento constante de menciones, comentarios y tendencias relacionadas con tu marca en todas las redes sociales.
              </p>
              <div className="mt-4 flex space-x-2">
                <FaTwitter className="text-blue-400" title="X (Twitter)" />
                <FaFacebook className="text-blue-600" title="Facebook" />
                <FaInstagram className="text-pink-500" title="Instagram" />
                <FaLinkedin className="text-blue-700" title="LinkedIn" />
                <FaTiktok className="text-black dark:text-white" title="TikTok" />
              </div>
            </div>

            {/* Característica 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-cyan-500 p-3 bg-cyan-100 dark:bg-cyan-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaShieldAlt className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Alerta de crisis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Notificaciones inmediatas ante posibles situaciones negativas para tu reputación, permitiéndote actuar rápidamente.
              </p>
            </div>

            {/* Característica 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-cyan-500 p-3 bg-cyan-100 dark:bg-cyan-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaUsers className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Análisis de audiencia</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comprende a tu público objetivo con datos demográficos detallados, intereses y comportamientos online.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
