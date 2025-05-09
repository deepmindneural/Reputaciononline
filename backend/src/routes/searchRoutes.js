const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Ruta para búsqueda general
router.get('/', searchController.search.bind(searchController));

// Ruta para obtener calificaciones de una entidad
router.get('/ratings/:entityId', searchController.getRatings.bind(searchController));

// Ruta para obtener menciones de una entidad
router.get('/mentions/:entityId', searchController.getMentions.bind(searchController));

// Ruta para obtener perfiles sociales de una entidad
router.get('/social-profiles/:entityId', searchController.getSocialProfiles.bind(searchController));

module.exports = router;
