"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthenticatedRoot() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated') {
      // Si el usuario es administrador, redirigir al panel de administraciu00f3n
      if (session?.user?.role === 'admin') {
        router.push('/admin/creditos');
        return;
      }

      // Si es un usuario regular, redirigir al dashboard de menciones
      router.push('/dashboard/menciones');
    }
  }, [status, session, router]);

  // Mostrar un indicador de carga mientras se verifica la sesiu00f3n
  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-700">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Cargando tu experiencia</h2>
          <p className="text-gray-600 dark:text-gray-300">Por favor espera un momento...</p>
        </div>
      </div>
    );
  }

  // Si no estu00e1 autenticado, devolver null para que se muestre la pu00e1gina de inicio
  return null;
}
