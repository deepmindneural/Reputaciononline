'use client';

import React from 'react';
import Link from 'next/link';

// Función para manejar el scroll suave
const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function LandingNavbar() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-cyan-500 rounded-md flex items-center justify-center text-white font-bold mr-2">
                <span>R</span>
              </div>
              <h1 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">Reputación Online</h1>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <a onClick={() => scrollToSection('caracteristicas')} className="text-gray-700 hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan-400 cursor-pointer">
              Características
            </a>
            <a onClick={() => scrollToSection('planes')} className="text-gray-700 hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan-400 cursor-pointer">
              Planes
            </a>
            <a onClick={() => scrollToSection('testimonios')} className="text-gray-700 hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan-400 cursor-pointer">
              Testimonios
            </a>
          </nav>
          <div className="flex space-x-4">
            <Link 
              href="/login"
              className="px-4 py-2 text-sm font-medium text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              Iniciar sesión
            </Link>
            <Link 
              href="/registro"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
