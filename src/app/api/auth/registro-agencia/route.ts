import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Usamos un singleton para evitar múltiples instancias de Prisma en desarrollo
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(req: NextRequest) {
  try {
    console.log('Recibida solicitud de registro de agencia');
    const data = await req.json();
    console.log('Datos recibidos:', JSON.stringify({
      ...data,
      password: '***OCULTO***' // No mostramos la contraseña en los logs
    }));
    
    const {
      nombreAgencia,
      emailAgencia,
      telefonoAgencia,
      sitioWeb,
      direccion,
      password,
      nombreContacto,
      apellidoContacto,
      cargoContacto,
      emailContacto
    } = data;

    // Verificar si el email ya estu00e1 registrado
    const existingUser = await prisma.user.findUnique({
      where: { email: emailAgencia }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya estu00e1 registrado' },
        { status: 400 }
      );
    }

    // Hashear la contrasen\u00f1a
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear la agencia y el usuario en una transacciu00f3n
    const result = await prisma.$transaction(async (tx) => {
      try {
        // 1. Crear el perfil de agencia
        console.log('Creando perfil de agencia...');
        const agencyProfile = await tx.agencyProfile.create({
          data: {
            name: nombreAgencia,
            description: `Agencia ${nombreAgencia}`,
            website: sitioWeb || null,
            phone: telefonoAgencia,
            address: direccion,
            commissionRate: 10.0, // Tasa de comisiu00f3n predeterminada (10%)
          }
        });
        console.log('Perfil de agencia creado con ID:', agencyProfile.id);

        // 2. Crear el usuario asociado a la agencia
        console.log('Creando usuario asociado a la agencia...');
        // Verificamos el tipo de ID que espera agencyProfileId
        console.log('Tipo de agencyProfile.id:', typeof agencyProfile.id);
        console.log('Valor de agencyProfile.id:', agencyProfile.id);
        
        const user = await tx.user.create({
          data: {
            email: emailAgencia,
            password: hashedPassword,
            name: `${nombreContacto} ${apellidoContacto}`,
            role: 'agencia',
            credits: 0, // Inicia sin cru00e9ditos hasta que compre un plan
            // Usamos connect en lugar de asignar directamente el ID
            agencyProfile: {
              connect: {
                id: agencyProfile.id
              }
            },
            profileInfo: {
              create: {
                biography: `${cargoContacto} en ${nombreAgencia}`,
                socialNetworks: JSON.stringify({
                  email: emailContacto,
                  website: sitioWeb || null
                }),
              }
            }
          }
        });
        console.log('Usuario creado con ID:', user.id);

        return { user, agencyProfile };
      } catch (err) {
        console.error('Error en la transacciu00f3n:', err);
        throw err;
      }
    });

    console.log('Registro completado exitosamente');
    return NextResponse.json({
      message: 'Cuenta de agencia creada correctamente',
      userId: result.user.id,
      agencyId: result.agencyProfile.id
    });

  } catch (error: any) {
    console.error('Error al registrar agencia:', error);
    // Enviar un mensaje de error más descriptivo al cliente
    return NextResponse.json(
      { 
        error: error.message || 'Error al crear la cuenta de agencia',
        details: error.toString(),
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

// Endpoint para verificar si el servicio está funcionando
export async function GET() {
  return NextResponse.json({ status: 'API de registro de agencias operativa' });
}
