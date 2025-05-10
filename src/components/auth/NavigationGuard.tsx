"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Componente de seguridad que maneja la navegación basada en la autenticación y rol del usuario
 * Se debe colocar en el layout principal para garantizar redirecciones correctas
 */
export default function NavigationGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    // No hacer nada mientras carga
    if (status === 'loading') return;

    // Verificar rutas protegidas por rol
    const isAdminRoute = pathname?.startsWith('/admin');
    const isDashboardRoute = pathname?.startsWith('/dashboard');
    
    // Rutas públicas que no requieren autenticación
    const isPublicRoute = 
      pathname === '/' || 
      pathname === '/login' || 
      pathname === '/registro' || 
      pathname === '/recuperar-contrasena' ||
      pathname?.startsWith('/auth/');

    // Si no está autenticado y trata de acceder a una ruta protegida
    if (status === 'unauthenticated' && (isDashboardRoute || isAdminRoute)) {
      console.log('Usuario no autenticado intentando acceder a ruta protegida');
      router.push('/login');
      return;
    }

    // Si está autenticado pero está en una página de autenticación, redirigir al dashboard
    if (status === 'authenticated' && isPublicRoute) {
      const destination = session.user.role === 'admin' ? '/admin/creditos' : '/dashboard/menciones';
      console.log(`Redirigiendo a usuario autenticado desde ruta pública a ${destination}`);
      router.push(destination);
      return;
    }

    // Si el usuario no es admin pero intenta acceder a rutas de admin
    if (status === 'authenticated' && isAdminRoute && session.user.role !== 'admin') {
      console.log('Usuario regular intentando acceder a ruta de administrador');
      router.push('/dashboard/menciones');
      return;
    }

    // Si el usuario está en la raíz del dashboard, redirigir a menciones
    if (status === 'authenticated' && pathname === '/dashboard') {
      console.log('Redirigiendo a usuario desde /dashboard a /dashboard/menciones');
      router.push('/dashboard/menciones');
      return;
    }

    // Si el usuario es admin y está en la raíz de admin, redirigir a créditos
    if (status === 'authenticated' && pathname === '/admin' && session.user.role === 'admin') {
      console.log('Redirigiendo a administrador desde /admin a /admin/creditos');
      router.push('/admin/creditos');
      return;
    }
  }, [pathname, router, session, status]);

  // Asegurándonos de devolver un elemento JSX válido (no solo ReactNode)
  return <>{children}</>;
}
