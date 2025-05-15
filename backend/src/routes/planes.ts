import { Router } from 'express';
import { getPlanes, getPlanById, crearPlan, actualizarPlan, eliminarPlan } from '../controllers/planes.controller';
import { isAdmin } from '../middleware/auth';

const router = Router();

// Rutas públicas
router.get('/', getPlanes);
router.get('/:id', getPlanById);

// Rutas protegidas (solo admin)
router.post('/', isAdmin, crearPlan);
router.put('/:id', isAdmin, actualizarPlan);
router.delete('/:id', isAdmin, eliminarPlan);

export default router;
