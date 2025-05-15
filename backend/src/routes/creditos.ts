import { Router } from 'express';
import { getCreditosUsuario, getHistorialCreditos, consumirCreditos, asignarCreditos, comprarPlan } from '../controllers/creditos.controller';
import { isAdmin, isAuth } from '../middleware/auth';
import prisma from '../prisma';

const router = Router();

// Rutas para usuario autenticado
router.get('/mi-saldo', isAuth, getCreditosUsuario);
router.get('/historial', isAuth, getHistorialCreditos);
router.post('/consumir', isAuth, consumirCreditos);
router.post('/comprar-plan', isAuth, comprarPlan);

// Rutas para administradores
router.post('/asignar', isAdmin, asignarCreditos);

// Rutas de compatibilidad para mantener código existente
// Saldo de créditos (versión compatible con código anterior)
router.get('/saldo/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(usuarioId) },
      select: { creditosDisponibles: true, creditosGastados: true }
    });
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json({ 
      saldo: usuario.creditosDisponibles,
      consumidos: usuario.creditosGastados,
      total: usuario.creditosDisponibles + usuario.creditosGastados
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener saldo' });
  }
});

// Historial (versión compatible con código anterior)
router.get('/historial/:usuarioId', async (req, res) => {
  try {
    const historial = await prisma.credito.findMany({
      where: { usuarioId: Number(req.params.usuarioId) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial' });
  }
});

// Comprar créditos (versión compatible con código anterior)
router.post('/comprar', async (req, res) => {
  try {
    const { usuarioId, cantidad, descripcion } = req.body;
    
    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(usuarioId) }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const nuevo = await prisma.$transaction([
      // Registrar la transacción
      prisma.credito.create({
        data: { 
          usuarioId: Number(usuarioId), 
          cantidad, 
          descripcion, 
          tipo: 'recarga'
        },
      }),
      
      // Actualizar el saldo del usuario
      prisma.usuario.update({
        where: { id: Number(usuarioId) },
        data: { 
          creditosDisponibles: usuario.creditosDisponibles + cantidad,
          estado: 'activo' 
        }
      })
    ]);
    
    res.json(nuevo[0]); // Devolver la transacción creada para compatibilidad
  } catch (error) {
    console.error('Error al comprar créditos:', error);
    res.status(500).json({ message: 'Error al comprar créditos' });
  }
});

export default router;
