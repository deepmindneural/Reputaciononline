"use client";

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SessionProvider from '@/components/providers/SessionProvider';

// Importamos dinámicamente el componente de menciones del dashboard sin incluir el route group
const DashboardMenciones = dynamic(() => import('@/app/dashboard/menciones/page'), { ssr: false });

// Componente que verifica la autenticación y muestra el contenido de menciones
function MencionesContent() {
  const router = useRouter();
  const { status } = useSession();

  // Si no hay sesión, redirigir a login
  if (status === 'unauthenticated') {
    router.push('/login');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-700">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Redirigiendo...</h2>
          <p className="text-gray-600 dark:text-gray-300">Por favor espera mientras te redirigimos al login...</p>
        </div>
      </div>
    );
  }

  // Si está cargando, mostrar indicador de carga
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-700">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Cargando menciones</h2>
          <p className="text-gray-600 dark:text-gray-300">Por favor espera mientras preparamos tu experiencia...</p>
        </div>
      </div>
    );
  }

  // Si está autenticado, mostrar el componente de menciones
  return <DashboardMenciones />;
}

// Componente principal que envuelve el contenido con el SessionProvider
export default function MencionesPage() {
  return (
    <SessionProvider>
      <MencionesContent />
    </SessionProvider>
  );
}
