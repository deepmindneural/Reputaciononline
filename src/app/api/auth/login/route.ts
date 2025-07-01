// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/services/authServiceReal';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 LOGIN: Iniciando proceso de login');
    
    const body = await request.json();
    const { email, password } = body;

    console.log('🔍 LOGIN: Datos recibidos:', { email, password: '***' });

    // Validaciones básicas
    if (!email || !password) {
      console.log('❌ LOGIN: Faltan email o password');
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    console.log('🔍 LOGIN: Llamando al servicio de autenticación...');
    // Intentar login
    const result = await login(email, password);
    console.log('🔍 LOGIN: Resultado del servicio:', { success: result.success, message: result.message, hasUser: !!result.user });
    
    if (result.user) {
      console.log('🔍 LOGIN: Datos del usuario:', { id: result.user.id, email: result.user.email, name: result.user.name });
    } else {
      console.log('❌ LOGIN: No se devolvió objeto usuario');
    }

    if (!result.success) {
      console.log('❌ LOGIN: Fallo en autenticación:', result.message);
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    console.log('✅ LOGIN: Autenticación exitosa, configurando cookie...');
    // Configurar cookie con el token
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Login exitoso'
    });

    if (result.token) {
      console.log('🔍 LOGIN: Estableciendo cookie auth-token');
      const isSecure = process.env.NEXTAUTH_URL?.startsWith('https');
      response.cookies.set('auth-token', result.token, {
        httpOnly: true,
        secure: Boolean(isSecure),
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 días
      });
    } else {
      console.log('⚠️ LOGIN: No se generó token');
    }

    console.log('✅ LOGIN: Proceso completado exitosamente');
    return response;
  } catch (error) {
    console.error('💥 LOGIN ERROR:', error);
    console.error('💥 LOGIN ERROR STACK:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('💥 LOGIN ERROR MESSAGE:', error instanceof Error ? error.message : String(error));
    
    // Si es un error de base de datos en producción, devolver 503
    if (error instanceof Error && error.message.includes('ENOTFOUND')) {
      return NextResponse.json(
        { success: false, message: 'Error de conexión a la base de datos' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
