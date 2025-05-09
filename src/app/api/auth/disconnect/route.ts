import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Endpoint para desconectar una red social
export async function POST(req: NextRequest) {
  try {
    // Verificar si el usuario está autenticado
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener la plataforma a desconectar del cuerpo de la solicitud
    const body = await req.json();
    const { platform } = body;
    
    if (!platform) {
      return NextResponse.json(
        { error: 'Se requiere especificar una plataforma' },
        { status: 400 }
      );
    }

    // En un entorno real, aquí se haría una llamada a la base de datos
    // para actualizar las redes sociales conectadas del usuario
    // Por ahora, simplemente devolvemos una respuesta exitosa

    return NextResponse.json(
      { success: true, message: `Plataforma ${platform} desconectada correctamente` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al desconectar la plataforma:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
