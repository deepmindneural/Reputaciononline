"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SessionProvider from '@/components/providers/SessionProvider';

// Componente interno que maneja la redirección basada en la autenticación
function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated') {
      // Si el usuario es administrador, redirigir al panel de administración
      if (session?.user?.role === 'admin') {
        router.push('/admin/creditos');
        return;
      }

      // Si es un usuario regular, redirigir al dashboard de menciones
      // Usamos window.location para forzar una navegación completa y evitar problemas de caché
      window.location.href = '/dashboard/menciones';
    }
  }, [status, session, router]);

  // No renderizamos nada, solo manejamos la redirección
  return null;
}

// Componente que envuelve AuthRedirect con el SessionProvider
export default function AuthenticatedPage() {
  return (
    <SessionProvider>
      <AuthRedirect />
    </SessionProvider>
  );
}
