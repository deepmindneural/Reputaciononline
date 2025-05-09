const express = require('express');
const router = express.Router();
const hospitalityController = require('../controllers/hospitalityController');

// Rutas para el módulo de monitoreo de AirBnb, Booking y TripAdvisor
// Ruta base: /api/hospitality

// Obtener todas las propiedades del usuario
router.get('/properties', hospitalityController.getProperties);

// Obtener detalles de una propiedad específica
router.get('/properties/:propertyId', hospitalityController.getPropertyById);

// Añadir o actualizar una propiedad
router.post('/properties', hospitalityController.upsertProperty);

// Eliminar una propiedad
router.delete('/properties/:propertyId', hospitalityController.deleteProperty);

// Obtener reseñas de una propiedad
router.get('/properties/:propertyId/reviews', hospitalityController.getPropertyReviews);

// Añadir o actualizar una reseña
router.post('/reviews', hospitalityController.upsertReview);

// Responder a una reseña
router.post('/reviews/:reviewId/respond', hospitalityController.respondToReview);

// Obtener métricas y análisis
router.get('/analytics', hospitalityController.getAnalytics);

// Sincronizar reseñas (simulado)
router.post('/sync', hospitalityController.syncReviews);

module.exports = router;
