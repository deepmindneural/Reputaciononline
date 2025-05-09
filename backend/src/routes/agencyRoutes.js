const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agencyController');
const { checkRole } = require('../middlewares/roleMiddleware');

// Rutas para el módulo de agencias
// Ruta base: /api/agency

// Obtener perfil de agencia actual
router.get('/profile', agencyController.getAgencyProfile);

// Crear o actualizar perfil de agencia
router.post('/profile', agencyController.updateAgencyProfile);

// Obtener listado de clientes de la agencia
router.get('/clients', checkRole(['agencia', 'admin']), agencyController.getAgencyClients);

// Añadir un nuevo cliente a la agencia
router.post('/clients', checkRole(['agencia', 'admin']), agencyController.addAgencyClient);

// Registrar una venta
router.post('/sales', checkRole(['agencia', 'admin']), agencyController.registerSale);

// Obtener historial de ventas
router.get('/sales', checkRole(['agencia', 'admin']), agencyController.getSalesHistory);

// Solicitar retiro de comisiones
router.post('/withdrawals', checkRole(['agencia', 'admin']), agencyController.requestWithdrawal);

// Obtener historial de retiros
router.get('/withdrawals', checkRole(['agencia', 'admin']), agencyController.getWithdrawals);

module.exports = router;
