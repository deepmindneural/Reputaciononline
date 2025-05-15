import { Request, Response } from 'express';
import prisma from '../prisma';

// Obtener todos los planes disponibles
export async function getPlanes(req: Request, res: Response) {
  try {
    const planes = await prisma.plan.findMany({
      where: { activo: true },
      orderBy: { precio: 'asc' }
    });
    
    return res.json(planes);
  } catch (error) {
    console.error('Error al obtener planes:', error);
    return res.status(500).json({ message: 'Error al obtener planes' });
  }
}

// Obtener plan por ID
export async function getPlanById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const plan = await prisma.plan.findUnique({
      where: { id: Number(id) }
    });
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan no encontrado' });
    }
    
    return res.json(plan);
  } catch (error) {
    console.error('Error al obtener plan:', error);
    return res.status(500).json({ message: 'Error al obtener plan' });
  }
}

// Crear un nuevo plan (solo para administradores)
export async function crearPlan(req: Request, res: Response) {
  try {
    const { nombre, creditos, precio, caracteristicas, destacado } = req.body;
    
    const nuevoPlan = await prisma.plan.create({
      data: {
        nombre,
        creditos,
        precio,
        caracteristicas: JSON.stringify(caracteristicas),
        destacado: destacado || false
      }
    });
    
    return res.status(201).json(nuevoPlan);
  } catch (error) {
    console.error('Error al crear plan:', error);
    return res.status(500).json({ message: 'Error al crear plan' });
  }
}

// Actualizar un plan (solo para administradores)
export async function actualizarPlan(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nombre, creditos, precio, caracteristicas, destacado, activo } = req.body;
    
    const planActualizado = await prisma.plan.update({
      where: { id: Number(id) },
      data: {
        nombre,
        creditos,
        precio,
        caracteristicas: caracteristicas ? JSON.stringify(caracteristicas) : undefined,
        destacado,
        activo
      }
    });
    
    return res.json(planActualizado);
  } catch (error) {
    console.error('Error al actualizar plan:', error);
    return res.status(500).json({ message: 'Error al actualizar plan' });
  }
}

// Eliminar un plan (solo para administradores)
export async function eliminarPlan(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    await prisma.plan.delete({
      where: { id: Number(id) }
    });
    
    return res.json({ message: 'Plan eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar plan:', error);
    return res.status(500).json({ message: 'Error al eliminar plan' });
  }
}
