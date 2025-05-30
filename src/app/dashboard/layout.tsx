"use client";

import React from 'react';
import Link from 'next/link';
import { CreditosProvider } from '@/context/CreditosContext';
import { Home, CreditCard, BarChart3, Settings, Bell, Search, User, LogOut, Menu, X, Share2 } from 'lucide-react';
import ChatSofia from '@/components/chat/ChatSofia';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CreditosProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Barra lateral de navegaciu00f3n */}
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-shrink-0 transform flex-col bg-white shadow-lg transition-transform duration-300 dark:bg-gray-800 md:flex md:translate-x-0">
          <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6 dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-600"></div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">Reputaciu00f3n Online</span>
            </Link>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              <Link href="/dashboard" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                <Home className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-white" />
                Dashboard
              </Link>

              <Link href="/dashboard/creditos" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                <CreditCard className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-white" />
                Cru00e9ditos
              </Link>

              <Link href="/dashboard/analisis" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                <BarChart3 className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-white" />
                Análisis
              </Link>

              <Link href="/dashboard/redes-sociales" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                <Share2 className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-white" />
                Redes Sociales
              </Link>

              <Link href="/dashboard/configuracion" className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-white" />
                Configuraciu00f3n
              </Link>
            </nav>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="flex flex-1 flex-col md:pl-64">
          {/* Barra superior */}
          <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow dark:bg-gray-800">
            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1">
                <div className="flex w-full items-center md:ml-0">
                  <div className="max-w-lg flex-1">
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-primary-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                        placeholder="Buscar..."
                        type="search"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-4 flex items-center md:ml-6">
                {/* Botu00f3n de notificaciones */}
                <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white">
                  <span className="sr-only">Ver notificaciones</span>
                  <Bell className="h-6 w-6" />
                </button>

                {/* Perfil de usuario */}
                <div className="relative ml-3">
                  <div>
                    <button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-800">
                      <span className="sr-only">Abrir menu00fa de usuario</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                        <User className="h-5 w-5" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Contenido principal */}
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
        {/* Chat con Sofia (IA de la plataforma) */}
        <ChatSofia />
      </div>
    </CreditosProvider>
  );
}
