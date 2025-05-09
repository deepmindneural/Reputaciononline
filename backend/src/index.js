const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const path = require('path');

// Rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const mentionRoutes = require('./routes/mentionRoutes');
const agencyRoutes = require('./routes/agencyRoutes');
const hospitalityRoutes = require('./routes/hospitalityRoutes');
const politicalRoutes = require('./routes/politicalRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Middlewares
const errorMiddleware = require('./middlewares/errorMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');

// Configuración
dotenv.config();
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Reputación Online funcionando correctamente' });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/mentions', authMiddleware, mentionRoutes);
app.use('/api/agency', authMiddleware, agencyRoutes);
app.use('/api/hospitality', authMiddleware, hospitalityRoutes);
app.use('/api/political', authMiddleware, politicalRoutes);
app.use('/api/search', searchRoutes); // No requiere autenticación para permitir búsquedas públicas

// Middleware de manejo de errores
app.use(errorMiddleware);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Manejador de excepciones no capturadas
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!');
  console.log(err.name, err.message);
  process.exit(1);
});

module.exports = app; // Para testing
