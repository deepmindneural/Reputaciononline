'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { CreditosProvider } from '@/context/CreditosContext';
import CreditosNotification from '@/components/CreditosNotification';
import SessionProvider from '@/components/providers/SessionProvider';
import ReputationSearch from '@/components/search/ReputationSearch';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

// Componente interno que consume el estado de Sidebar
const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const [userName, setUserName] = useState('Usuario');
  const [isMobile, setIsMobile] = useState(false);
  const { collapsed } = useSidebar();

  // Detectar modo móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar datos reales del usuario
  useEffect(() => {
    // Primero intentamos obtener el nombre desde localStorage
    if (typeof window !== 'undefined') {
      const savedUserName = localStorage.getItem('userName');
      if (savedUserName && savedUserName !== 'undefined') {
        setUserName(savedUserName);
        return;
      }
    }
    
    // Si no hay nombre guardado, usamos un nombre por defecto
    // pero mostraremos un indicador de carga
    const timeout = setTimeout(() => setUserName('Usuario'), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userName={userName} />
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isMobile ? 'w-full' : collapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-20 lg:ml-64'
        }`}
      >
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 pt-16 px-4 md:px-6">
          <div className="max-w-7xl mx-auto w-full">
            {/* Barra de búsqueda móvil */}
            <div className="md:hidden my-4">
              <div className="w-full max-w-md mx-auto">
                <ReputationSearch />
              </div>
            </div>
            {children}
          </div>
        </main>
        {/* Notificación de créditos bajos */}
        <CreditosNotification umbralCreditos={1000} />
      </div>
    </div>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CreditosProvider>
        <SidebarProvider>
          <DashboardShell>{children}</DashboardShell>
        </SidebarProvider>
      </CreditosProvider>
    </SessionProvider>
  );
}
