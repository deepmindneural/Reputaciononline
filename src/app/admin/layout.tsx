"use client";

import React from 'react';
import Link from 'next/link';
import { CreditProvider } from '@/context/CreditosContext';
import { 
  Home, CreditCard, BarChart3, Settings, Bell, Users, 
  Search, User, LogOut, Menu, X, Database, Globe
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <CreditProvider>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Barra lateral con estilo AdminLTE */}
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-shrink-0 transform flex-col bg-gray-800 transition-transform duration-300 dark:bg-gray-900 md:flex md:translate-x-0">
          <div className="flex h-16 items-center justify-center border-b border-gray-700 bg-gray-900 px-6">
            <Link href="/admin" className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-primary-600"></div>
              <span className="ml-3 text-xl font-bold text-white">Admin Panel</span>
            </Link>
          </div>

          {/* Usuario admin */}
          <div className="border-b border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-700 text-white">
                <User className="h-6 w-6" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin Usuario</p>
                <p className="text-xs text-gray-400">Administrador</p>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto py-4">
            <div className="px-3 py-2">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Dashboard</h3>
              <nav className="space-y-1">
                <Link href="/admin" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  <Home className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                  Inicio
                </Link>
              </nav>
            </div>

            <div className="px-3 py-2">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Créditos</h3>
              <nav className="space-y-1">
                <Link href="/admin/creditos" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  <CreditCard className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                  Gestión de Créditos
                </Link>
                <Link href="/admin/creditos/asignar" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  <Database className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                  Asignar Créditos
                </Link>
                <Link href="/admin/creditos/reportes" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  <BarChart3 className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                  Reportes
                </Link>
              </nav>
            </div>

            <div className="px-3 py-2">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Gestión</h3>
              <nav className="space-y-1">
                <Link href="/admin/usuarios" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  <Users className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                  Usuarios
                </Link>
                <Link href="/admin/redes-sociales" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  <Globe className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                  Redes Sociales
                </Link>
                <Link href="/admin/configuracion" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                  Configuración
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="flex flex-1 flex-col md:pl-64">
          {/* Barra superior */}
          <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow dark:bg-gray-800">
            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1 items-center md:ml-0">
                <button className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden">
                  <span className="sr-only">Abrir menú</span>
                  <Menu className="h-6 w-6" />
                </button>
                <div className="ml-4 flex w-full max-w-xs items-center md:ml-0">
                  <div className="relative w-full">
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

              <div className="ml-4 flex items-center md:ml-6">
                {/* Botón de notificaciones */}
                <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white">
                  <span className="sr-only">Ver notificaciones</span>
                  <Bell className="h-6 w-6" />
                </button>

                {/* Perfil de usuario */}
                <div className="relative ml-3">
                  <div>
                    <button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-800">
                      <span className="sr-only">Abrir menú de usuario</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-700 text-white">
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
      </div>
    </CreditProvider>
  );
}
