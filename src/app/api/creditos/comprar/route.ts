import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Definimos interfaces para los tipos de planes
interface PlanBase {
  nombre: string;
  creditos: number;
  precio: number;
  id: string;
}

interface PlanAgencia extends PlanBase {
  ciclo: 'mensual' | 'anual';
}

type Plan = PlanBase | PlanAgencia;

// Planes disponibles para clientes individuales
const PLANES_INDIVIDUALES = {
  basico: {
    nombre: 'Plan Bu00e1sico',
    creditos: 100,
    precio: 49900, // en pesos (499.00 COP)
    id: 'plan_basico'
  },
  estandar: {
    nombre: 'Plan Estu00e1ndar',
    creditos: 300,
    precio: 99900, // en pesos (999.00 COP)
    id: 'plan_estandar'
  },
  premium: {
    nombre: 'Plan Premium',
    creditos: 500,
    precio: 199900, // en pesos (1,999.00 COP)
    id: 'plan_premium'
  },
  agencia: {
    nombre: 'Plan Agencia',
    creditos: 1000,
    precio: 499900, // en pesos (4,999.00 COP)
    id: 'plan_agencia'
  }
};

// Planes disponibles para agencias
const PLANES_AGENCIA = {
  'basico-mensual': {
    nombre: 'Plan Bu00e1sico Mensual',
    creditos: 5000,
    precio: 299000, // en pesos (299,000 COP)
    ciclo: 'mensual',
    id: 'basico-mensual'
  },
  'profesional-mensual': {
    nombre: 'Plan Profesional Mensual',
    creditos: 10000,
    precio: 499000, // en pesos (499,000 COP)
    ciclo: 'mensual',
    id: 'profesional-mensual'
  },
  'premium-mensual': {
    nombre: 'Plan Premium Mensual',
    creditos: 20000,
    precio: 799000, // en pesos (799,000 COP)
    ciclo: 'mensual',
    id: 'premium-mensual'
  },
  'basico-anual': {
    nombre: 'Plan Bu00e1sico Anual',
    creditos: 60000,
    precio: 2990000, // en pesos (2,990,000 COP)
    ciclo: 'anual',
    id: 'basico-anual'
  },
  'profesional-anual': {
    nombre: 'Plan Profesional Anual',
    creditos: 120000,
    precio: 4990000, // en pesos (4,990,000 COP)
    ciclo: 'anual',
    id: 'profesional-anual'
  },
  'premium-anual': {
    nombre: 'Plan Premium Anual',
    creditos: 240000,
    precio: 7990000, // en pesos (7,990,000 COP)
    ciclo: 'anual',
    id: 'premium-anual'
  }
};

// Combinamos todos los planes en un único objeto
const PLANES = {
  ...PLANES_INDIVIDUALES,
  ...PLANES_AGENCIA
};

export async function POST(req: NextRequest) {
  try {
    // Verificar que el usuario estu00e9 autenticado
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener datos de la solicitud
    const data = await req.json();
    const { planId, metodoPago, creditos, monto, ciclo } = data;

    let plan;
    
    // Verificar si se está usando un plan predefinido o valores personalizados
    if (planId) {
      plan = Object.values(PLANES).find(p => p.id === planId);
      if (!plan) {
        return NextResponse.json({ error: 'Plan no vu00e1lido' }, { status: 400 });
      }
    } else if (creditos && monto) {
      // Plan personalizado con valores proporcionados directamente
      plan = {
        nombre: 'Plan Personalizado',
        creditos: creditos,
        precio: monto,
        ciclo: ciclo || 'mensual',
        id: `custom_${Date.now()}`
      };
    } else {
      return NextResponse.json({ error: 'Datos de plan incompletos' }, { status: 400 });
    }

    // En un sistema real, aquí integraríamos con Stripe/PayPal
    // Por ahora, vamos a simular una compra exitosa

    // Registrar la transacciu00f3n
    const transaccion = await prisma.creditTransaction.create({
      data: {
        userId: session.user.id,
        amount: plan.creditos,
        type: 'purchase',
        description: `Compra de ${plan.nombre}${plan.ciclo ? ` (${plan.ciclo})` : ''}`,
        paymentMethod: metodoPago || 'credit_card',
        paymentReference: `ref_${Date.now()}`,
        status: 'completed',
        price: plan.precio
      }
    });

    // Actualizar los cru00e9ditos del usuario
    const usuario = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        credits: { increment: plan.creditos }
      }
    });

    // Si el usuario es una agencia, actualizar su estado de suscripción
    if (session.user.role === 'agencia' && session.user.agencyProfile) {
      // Obtenemos el perfil de agencia del usuario
      const agencyProfile = await prisma.agencyProfile.findUnique({
        where: { id: Number(session.user.agencyProfile) }
      });
      
      if (agencyProfile) {
        await prisma.agencyProfile.update({
          where: { id: agencyProfile.id },
          data: {
            subscriptionActive: true,
            subscriptionPlan: plan.nombre,
            subscriptionEndDate: 'ciclo' in plan && plan.ciclo === 'anual'
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)  // Un año
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),  // Un mes por defecto
            lastBillingDate: new Date()
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Has adquirido ${plan.creditos.toLocaleString()} cru00e9ditos exitosamente`,
      transaction: transaccion,
      creditsBalance: usuario.credits,
      plan: {
        nombre: plan.nombre,
        ciclo: 'ciclo' in plan ? plan.ciclo : 'único'
      }
    });

  } catch (error) {
    console.error('Error al procesar la compra:', error);
    return NextResponse.json({ error: 'Error al procesar la compra' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Obtener el tipo de planes solicitados (individual, agencia o todos)
  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get('tipo');
  
  if (tipo === 'individual') {
    return NextResponse.json({ planes: PLANES_INDIVIDUALES });
  } else if (tipo === 'agencia') {
    return NextResponse.json({ planes: PLANES_AGENCIA });
  } else {
    // Devolver todos los planes disponibles por defecto
    return NextResponse.json({ planes: PLANES });
  }
}
