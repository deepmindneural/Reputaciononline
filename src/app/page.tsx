'use client';

import React from 'react';
import Link from 'next/link';
import { FaChartLine, FaShieldAlt, FaRocket, FaCheck, FaUsers, FaComments, FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaStar, FaQuoteLeft } from 'react-icons/fa';
import LandingNavbar from '@/components/layout/LandingNavbar';
import AuthenticatedPage from './AuthenticatedPage';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Componente que verifica si el usuario está autenticado y redirecciona si es necesario */}
      <AuthenticatedPage />
        
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
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#planes" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-cyan-800 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10">
                  Ver planes
                </a>
                <Link
                  href="/login"
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-900 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
                >
                  Iniciar ahora
                </Link>
                <Link
                  href="/registro-agencia"
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 md:py-4 md:text-lg md:px-10"
                >
                  Registro para Agencias
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
                Notificaciones inmediatas ante posibles situaciones negativas para tu reputación, permitiéndote actuar rápidamente y prevenir crisis de imagen.
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

            {/* Característica 4 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-cyan-500 p-3 bg-cyan-100 dark:bg-cyan-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaComments className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Análisis de sentimiento</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Evaluación automatizada de la percepción positiva, negativa o neutral de las menciones sobre tu marca.
              </p>
            </div>

            {/* Característica 5 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-cyan-500 p-3 bg-cyan-100 dark:bg-cyan-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaRocket className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sofia IA</h3>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Nuestro avanzado asistente de inteligencia artificial diseñado específicamente para el monitoreo y gestión de reputación online, con capacidades predictivas y análisis semántico avanzado para optimizar el uso de tus créditos.
              </p>
              <div className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Procesamiento de lenguaje natural</li>
                  <li>Análisis predictivo de tendencias</li>
                  <li>Recomendaciones personalizadas</li>
                  <li>Respuestas a consultas en tiempo real</li>
                </ul>
              </div>
            </div>

            {/* Característica 6 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-cyan-500 p-3 bg-cyan-100 dark:bg-cyan-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaChartLine className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Informes personalizados</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Genera informes detallados adaptados a tus necesidades específicas, con visualizaciones claras y datos accionables.
              </p>
            </div>
            
            {/* Característica 7 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-cyan-500 p-3 bg-cyan-100 dark:bg-cyan-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20ZM12 18C10.4087 18 8.88258 17.3679 7.75736 16.2426C6.63214 15.1174 6 13.5913 6 12C6 10.4087 6.63214 8.88258 7.75736 7.75736C8.88258 6.63214 10.4087 6 12 6C13.5913 6 15.1174 6.63214 16.2426 7.75736C17.3679 8.88258 18 10.4087 18 12C18 13.5913 17.3679 15.1174 16.2426 16.2426C15.1174 17.3679 13.5913 18 12 18ZM13 16H15V14H13C12.2044 14 11.4413 13.6839 10.8787 13.1213C10.3161 12.5587 10 11.7956 10 11V8H8V10H10V11C10 11.5304 10.2107 12.0391 10.5858 12.4142C10.9609 12.7893 11.4696 13 12 13H13V16Z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Gestión de Créditos</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sistema completo para administrar tus créditos disponibles, visualizar gastos, histórico de transacciones y recomendaciones para optimizar tu inversión.
              </p>
              <div className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Visualización de créditos disponibles y usados</li>
                  <li>Historial detallado de transacciones</li>
                  <li>Análisis de consumo con gráficos</li>
                  <li>Compra y gestión de nuevos planes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de planes */}
      <section id="planes" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Planes y precios
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Elige el plan que mejor se adapte a tus necesidades y objetivos.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Plan Básico */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div className="px-6 py-8 bg-white dark:bg-gray-900 sm:p-10 sm:pb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">Básico</h3>
                <div className="mt-4 flex justify-center">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">$299.000</span>
                  <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400 self-end">COP</span>
                </div>
                <p className="mt-5 text-lg text-gray-500 dark:text-gray-400 text-center">Para emprendedores y pequeñas marcas</p>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50 dark:bg-gray-800 sm:p-10 sm:pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaCheck className="h-5 w-5 text-cyan-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                      5.000 créditos
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaCheck className="h-5 w-5 text-cyan-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                      Monitoreo de 2 redes sociales
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaCheck className="h-5 w-5 text-cyan-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                      Reportes básicos
                    </p>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link
                    href="/login"
                    className="w-full inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Comenzar ahora
                  </Link>
                </div>
              </div>
            </div>

            {/* Plan Profesional */}
            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 pt-2 pr-4">
                <span className="inline-flex px-3 py-1 text-xs font-semibold leading-5 tracking-wide uppercase bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-100 rounded-full">
                  Popular
                </span>
              </div>
              <div className="px-6 py-8 bg-white dark:bg-gray-900 sm:p-10 sm:pb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">Profesional</h3>
                <div className="mt-4 flex justify-center">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">$699.000</span>
                  <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400 self-end">COP</span>
                </div>
                <p className="mt-5 text-lg text-gray-500 dark:text-gray-400 text-center">Para negocios y profesionales</p>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50 dark:bg-gray-800 sm:p-10 sm:pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaCheck className="h-5 w-5 text-cyan-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                      15.000 créditos
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaCheck className="h-5 w-5 text-cyan-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                      Monitoreo de todas las redes sociales
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaCheck className="h-5 w-5 text-cyan-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                      Análisis de sentimiento avanzado
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaCheck className="h-5 w-5 text-cyan-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                      Asistente Sofia IA
                    </p>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link
                    href="/login"
                    className="w-full inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Comenzar ahora
                  </Link>
                </div>
              </div>
            </div>

            {/* Plan Empresarial */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div className="px-6 py-8 bg-white dark:bg-gray-900 sm:p-10 sm:pb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">Empresarial</h3>
                <div className="mt-4 flex justify-center">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">$1.499.000</span>
                  <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400 self-end">COP</span>
                </div>
                <p className="mt-5 text-lg text-gray-500 dark:text-gray-400 text-center">Para empresas y organizaciones</p>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50 dark:bg-gray-800 sm:p-10 sm:pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaCheck className="h-5 w-5 text-cyan-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                      50.000 créditos
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaCheck className="h-5 w-5 text-cyan-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                      Monitoreo ilimitado en todas las plataformas
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaCheck className="h-5 w-5 text-cyan-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                      Análisis predictivo
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaCheck className="h-5 w-5 text-cyan-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                      Soporte prioritario 24/7
                    </p>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link
                    href="/login"
                    className="w-full inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Comenzar ahora
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secciu00f3n de canales de monitoreo */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Redes sociales y canales monitoreados
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Vigilamos todas las plataformas relevantes para tu marca con anu00e1lisis en tiempo real e histu00f3rico
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FaTwitter className="h-10 w-10 text-blue-400" />
              </div>
              <span className="mt-2 text-gray-700 dark:text-gray-300">X (Twitter)</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitoreo completo de menciones, hashtags y tendencias</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FaFacebook className="h-10 w-10 text-blue-600" />
              </div>
              <span className="mt-2 text-gray-700 dark:text-gray-300">Facebook</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Seguimiento de comentarios en pu00e1ginas y grupos relevantes</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-4 bg-pink-100 dark:bg-pink-900 rounded-full">
                <FaInstagram className="h-10 w-10 text-pink-500" />
              </div>
              <span className="mt-2 text-gray-700 dark:text-gray-300">Instagram</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Anu00e1lisis de contenido visual y menciones en stories</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FaLinkedin className="h-10 w-10 text-blue-700" />
              </div>
              <span className="mt-2 text-gray-700 dark:text-gray-300">LinkedIn</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitoreo de contenido profesional y corporativo</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                <FaTiktok className="h-10 w-10 text-black dark:text-white" />
              </div>
              <span className="mt-2 text-gray-700 dark:text-gray-300">TikTok</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Seguimiento de tendencias virales y opiniones</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="p-4 bg-cyan-100 dark:bg-cyan-900 rounded-full">
                <svg className="h-10 w-10 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 2H14V7H5V15.5H5.82L6 16.5H3V19H15V16H8V10H21V13.53C21.17 13.62 21.33 13.72 21.5 13.83V7L17.5 2ZM16 5V3.5L18.5 6H16V5Z" />
                  <path d="M16.5 10C14 10 12 12 12 14.5C12 17 14 19 16.5 19C19 19 21 17 21 14.5C21 12 19 10 16.5 10ZM16.5 16.5L14 13.9L14.7 13.05L16.07 14.69L19.24 12.03L19.95 12.87L16.5 16.5Z" />
                </svg>
              </div>
              <span className="mt-2 text-gray-700 dark:text-gray-300">Noticias</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitoreo de medios digitales y prensa online</p>
            </div>
          </div>
        </div>
      </section>

      {/* Secciu00f3n de testimonios */}
      <section id="testimonios" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Lo que dicen nuestros clientes
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Descubre cu00f3mo hemos ayudado a empresas y profesionales a mejorar su reputaciu00f3n online
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonio 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="text-cyan-500">
                  <FaQuoteLeft className="h-8 w-8" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                "Desde que empezamos a usar Reputaciu00f3n Online, hemos logrado identificar y resolver problemas con clientes antes de que escalen. Nuestra valoraciu00f3n en redes ha mejorado notablemente."
              </p>
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-full mr-4"
                  src="https://randomuser.me/api/portraits/women/32.jpg"
                  alt="Ana Martu00ednez"
                />
                <div>
                  <h4 className="text-gray-900 dark:text-white font-medium">Ana Martu00ednez</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Directora de Marketing, TechCo</p>
                </div>
                <div className="ml-auto flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="text-cyan-500">
                  <FaQuoteLeft className="h-8 w-8" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                "La herramienta de anu00e1lisis de sentimiento nos ha permitido entender mejor cu00f3mo percibe el mercado nuestra marca. Sofia IA nos brinda insights que antes nos tomaba semanas descubrir."
              </p>
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-full mr-4"
                  src="https://randomuser.me/api/portraits/men/41.jpg"
                  alt="Carlos Ruiz"
                />
                <div>
                  <h4 className="text-gray-900 dark:text-white font-medium">Carlos Ruiz</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">CEO, Innovaciu00f3n Digital</p>
                </div>
                <div className="ml-auto flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="text-cyan-500">
                  <FaQuoteLeft className="h-8 w-8" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                "La gestiu00f3n de cru00e9ditos es transparente y nos da total control sobre nuestro presupuesto. El sistema de alertas tempranas nos ha salvado varias veces de potenciales crisis reputacionales."
              </p>
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-full mr-4"
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="Laura Gu00f3mez"
                />
                <div>
                  <h4 className="text-gray-900 dark:text-white font-medium">Laura Gu00f3mez</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Gerente, Retail Plus</p>
                </div>
                <div className="ml-auto flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA y Footer */}
      <section className="py-12 bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Comienza a mejorar tu reputaciu00f3n digital
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-cyan-100">
              Regu00edstrate hoy y obtu00e9n un anu00e1lisis gratuito de tu presencia actual en redes sociales
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/login"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-cyan-800 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
              >
                Comenzar gratis
              </Link>
              <Link
                href="#planes"
                className="ml-4 px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-900 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
              >
                Ver planes
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <p className="text-3xl font-bold text-white">Reputación Online</p>
              <p className="text-gray-400 text-base">
                Tu aliado para monitorear, analizar y mejorar la presencia digital de tu marca.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaTwitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaFacebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaLinkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                    Plataforma
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#caracteristicas" className="text-base text-gray-400 hover:text-white">
                        Características
                      </a>
                    </li>
                    <li>
                      <a href="#planes" className="text-base text-gray-400 hover:text-white">
                        Planes
                      </a>
                    </li>
                    <li>
                      <a href="#testimonios" className="text-base text-gray-400 hover:text-white">
                        Testimonios
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Guías
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                    Compañía
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Acerca de
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Socios
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Prensa
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                    Legal
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Privacidad
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Términos
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                    Soporte
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Ayuda
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Contacto
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Reputación Online. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
