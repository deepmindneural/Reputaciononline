import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Obtener la ruta actual
  const path = request.nextUrl.pathname;
  
  // Verificar si el usuario está autenticado usando NextAuth
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const isAuthenticated = !!session;
  
  // Rutas que requieren autenticación
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/admin');
  
  // Verificar el rol de usuario para rutas de administrador
  const isAdminRoute = path.startsWith('/admin');
  const isAdmin = session?.role === 'admin';
  
  // Redirecciones específicas para mejorar la navegación
  if (path === '/dashboard' && isAuthenticated) {
    // Redirección para la ruta /dashboard exacta - asegurándonos de usar la ruta correcta
    return NextResponse.redirect(new URL('/dashboard/menciones', request.url));
  }
  
  // Si es ruta de admin y el usuario no es admin, redirigir al dashboard
  if (isAdminRoute && isAuthenticated && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard/menciones', request.url));
  }
  
  // Si el usuario intenta acceder a una ruta protegida sin estar autenticado
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Por defecto, permitir la navegación
  return NextResponse.next();
}

export const config = {
  // Matcher para rutas específicas - excluimos explícitamente rutas de NextAuth
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|images|js|css).*)'],
};
