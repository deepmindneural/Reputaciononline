import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Configurar el manejador de NextAuth usando la configuración centralizada
const handler = NextAuth(authOptions);

// Exportar las funciones GET y POST con manejo adecuado de respuestas
export async function GET(req: Request) {
  try {
    const response = await handler(req);
    return response;
  } catch (error) {
    console.error('Error en NextAuth GET:', error);
    return NextResponse.json(
      { error: 'Error interno en autenticación' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const response = await handler(req);
    return response;
  } catch (error) {
    console.error('Error en NextAuth POST:', error);
    return NextResponse.json(
      { error: 'Error interno en autenticación' },
      { status: 500 }
    );
  }
}
