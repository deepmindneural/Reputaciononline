import { Request, Response } from 'express';
import prisma from '../prisma';

// Obtener los créditos de un usuario
export async function getCreditosUsuario(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        creditosDisponibles: true,
        creditosGastados: true,
        plan: true,
        estado: true
      }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Obtener la última recarga
    const ultimaRecarga = await prisma.credito.findFirst({
      where: {
        usuarioId: userId,
        tipo: 'recarga'
      },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    });

    return res.json({
      creditosDisponibles: usuario.creditosDisponibles,
      creditosGastados: usuario.creditosGastados,
      plan: usuario.plan,
      estado: usuario.estado,
      ultimaRecarga: ultimaRecarga?.createdAt || null
    });
  } catch (error) {
    console.error('Error al obtener créditos de usuario:', error);
    return res.status(500).json({ message: 'Error al obtener créditos' });
  }
}

// Obtener historial de transacciones de créditos
export async function getHistorialCreditos(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { limit = 10, page = 1 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);

    const transacciones = await prisma.credito.findMany({
      where: { usuarioId: userId },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip
    });

    const total = await prisma.credito.count({
      where: { usuarioId: userId }
    });

    return res.json({
      transacciones,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error al obtener historial de créditos:', error);
    return res.status(500).json({ message: 'Error al obtener historial' });
  }
}

// Consumir créditos
export async function consumirCreditos(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { cantidad, descripcion, canal } = req.body;

    if (!cantidad || !descripcion) {
      return res.status(400).json({ message: 'Cantidad y descripción son obligatorios' });
    }

    // Verificar si el usuario tiene suficientes créditos
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!usuario || usuario.creditosDisponibles < cantidad) {
      return res.status(400).json({ message: 'Créditos insuficientes' });
    }

    // Crear la transacción y actualizar créditos en una sola transacción
    const resultado = await prisma.$transaction([
      // Registrar el consumo
      prisma.credito.create({
        data: {
          usuarioId: userId,
          tipo: 'consumo',
          cantidad,
          descripcion,
          canal
        }
      }),
      
      // Actualizar los créditos del usuario
      prisma.usuario.update({
        where: { id: userId },
        data: {
          creditosDisponibles: usuario.creditosDisponibles - cantidad,
          creditosGastados: usuario.creditosGastados + cantidad,
          ultimaActividad: new Date(),
          estado: (usuario.creditosDisponibles - cantidad) === 0 
            ? 'sin_creditos' 
            : (usuario.creditosDisponibles - cantidad < 1000)
              ? 'advertencia'
              : 'activo'
        }
      })
    ]);

    return res.json({ 
      success: true,
      transaccion: resultado[0],
      nuevoSaldo: resultado[1].creditosDisponibles
    });
  } catch (error) {
    console.error('Error al consumir créditos:', error);
    return res.status(500).json({ message: 'Error al consumir créditos' });
  }
}

// Asignar créditos (solo admin)
export async function asignarCreditos(req: Request, res: Response) {
  try {
    const { usuarioId, cantidad, descripcion } = req.body;

    if (!usuarioId || !cantidad) {
      return res.status(400).json({ message: 'ID de usuario y cantidad son obligatorios' });
    }

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(usuarioId) }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Realizar la asignación en una transacción
    const resultado = await prisma.$transaction([
      // Registrar la recarga
      prisma.credito.create({
        data: {
          usuarioId: Number(usuarioId),
          tipo: 'recarga',
          cantidad,
          descripcion: descripcion || 'Asignación por administrador'
        }
      }),
      
      // Actualizar los créditos del usuario
      prisma.usuario.update({
        where: { id: Number(usuarioId) },
        data: {
          creditosDisponibles: usuario.creditosDisponibles + cantidad,
          estado: 'activo' // Actualiza el estado ya que recibió créditos
        }
      })
    ]);

    return res.json({ 
      success: true,
      transaccion: resultado[0],
      nuevoSaldo: resultado[1].creditosDisponibles
    });
  } catch (error) {
    console.error('Error al asignar créditos:', error);
    return res.status(500).json({ message: 'Error al asignar créditos' });
  }
}

// Comprar créditos (procesar compra de plan)
export async function comprarPlan(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: 'ID de plan es obligatorio' });
    }

    // Buscar el plan
    const plan = await prisma.plan.findUnique({
      where: { id: Number(planId) }
    });

    if (!plan || !plan.activo) {
      return res.status(404).json({ message: 'Plan no encontrado o no disponible' });
    }

    // Buscar el usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Procesar la compra (en un entorno real, aquí iría la integración con el sistema de pago)
    // Simulamos que el pago fue exitoso
    const resultado = await prisma.$transaction([
      // Registrar la recarga
      prisma.credito.create({
        data: {
          usuarioId: userId,
          tipo: 'recarga',
          cantidad: plan.creditos,
          descripcion: `Compra de plan ${plan.nombre}`
        }
      }),
      
      // Actualizar los créditos y plan del usuario
      prisma.usuario.update({
        where: { id: userId },
        data: {
          creditosDisponibles: usuario.creditosDisponibles + plan.creditos,
          plan: plan.nombre,
          estado: 'activo' // Actualiza el estado ya que recibió créditos
        }
      })
    ]);

    return res.json({ 
      success: true,
      transaccion: resultado[0],
      planAdquirido: plan.nombre,
      nuevoSaldo: resultado[1].creditosDisponibles
    });
  } catch (error) {
    console.error('Error al comprar plan:', error);
    return res.status(500).json({ message: 'Error al procesar la compra' });
  }
}
