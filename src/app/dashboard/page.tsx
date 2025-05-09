"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardRedirect() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState(false);
  const [count, setCount] = useState(5);

  useEffect(() => {
    // Función para intentar la redirección
    const attemptRedirect = () => {
      try {
        // Si está cargando la sesión, esperar
        if (status === 'loading') return;
        
        // Si no está autenticado, ir a login
        if (status === 'unauthenticated') {
          router.push('/login');
          return;
        }
        
        // Si está autenticado, mostrar el contenido del dashboard
        // En lugar de redireccionar a menciones (que causa un ciclo), mostramos el contenido directamente
        if (status === 'authenticated') {
          // Usamos window.location para forzar una recarga completa y evitar problemas de caché
          // Redirigimos a la ruta real donde están los componentes
          window.location.href = '/dashboard/menciones';
        }
      } catch (e) {
        console.error('Error en redirección:', e);
        setError(true);
      }
    };

    // Intentar la redirección inmediatamente
    attemptRedirect();

    // Si hay un error, establecer cuenta regresiva para redirección manual
    if (error && count > 0) {
      const timer = setTimeout(() => setCount(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (error && count === 0) {
      // Al finalizar la cuenta regresiva, redirigir a menciones sin usar router (enlace directo)
      window.location.href = '/dashboard/menciones';
    }
  }, [router, status, session, error, count]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-700">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Cargando dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Por favor espera mientras preparamos tu experiencia...</p>
        
        {error && (
          <div className="mt-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded relative mb-4" role="alert">
              <p>Estamos teniendo problemas con la redirección automática.</p>
              <p>Serás redirigido en <span className="font-bold">{count}</span> segundos o puedes hacer clic en el botón.</p>
            </div>
            
            <Link 
              href="/dashboard/menciones"
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
            >
              Ir a Menciones
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
