import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtener la ruta actual
  const path = request.nextUrl.pathname;
  
  // Comprobar si hay una cookie de sesión
  const isAuthenticated = request.cookies.has('auth_token');
  
  // Rutas públicas (no requieren autenticación)
  const publicRoutes = ['/', '/login', '/registro'];
  
  // Rutas que requieren autenticación
  const isProtectedRoute = path.includes('/dashboard') || path.includes('/admin');
  
  // Comprobar si es una ruta pública
  const isPublicRoute = publicRoutes.some(route => path === route);
  
  // Si el usuario intenta acceder a una ruta protegida sin estar autenticado
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Si el usuario está autenticado e intenta acceder a login o registro
  if (isAuthenticated && path.includes('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Por defecto, permitir la navegación
  return NextResponse.next();
}

export const config = {
  // Matcher para rutas específicas
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|js|css).*)'],
};
