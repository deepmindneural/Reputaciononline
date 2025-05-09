const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controlador para gestionar monitoreo de Airbnb, Booking y TripAdvisor
const hospitalityController = {
  // Obtener todas las propiedades del usuario
  getProperties: async (req, res) => {
    try {
      const { userId } = req;
      const { platform, status } = req.query;
      
      const whereClause = {
        userId,
        ...(platform && { platform }),
        ...(status === 'active' ? { active: true } : status === 'inactive' ? { active: false } : {})
      };
      
      const properties = await prisma.hospitalityProperty.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          _count: {
            select: { reviews: true }
          }
        }
      });
      
      return res.status(200).json({ properties });
    } catch (error) {
      console.error('Error al obtener propiedades:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Obtener detalles de una propiedad específica
  getPropertyById: async (req, res) => {
    try {
      const { userId } = req;
      const { propertyId } = req.params;
      
      const property = await prisma.hospitalityProperty.findFirst({
        where: {
          id: propertyId,
          userId
        },
        include: {
          reviews: {
            orderBy: {
              date: 'desc'
            },
            take: 10
          },
          _count: {
            select: { reviews: true }
          }
        }
      });
      
      if (!property) {
        return res.status(404).json({ message: 'Propiedad no encontrada' });
      }
      
      return res.status(200).json({ property });
    } catch (error) {
      console.error('Error al obtener detalles de propiedad:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Añadir o actualizar una propiedad
  upsertProperty: async (req, res) => {
    try {
      const { userId } = req;
      const { 
        id,
        name, 
        description, 
        platform, 
        externalId,
        address,
        propertyType,
        imageUrl,
        originalUrl
      } = req.body;
      
      if (!name || !platform) {
        return res.status(400).json({ message: 'El nombre y la plataforma son obligatorios' });
      }
      
      let property;
      
      if (id) {
        // Actualizar propiedad existente
        property = await prisma.hospitalityProperty.update({
          where: {
            id
          },
          data: {
            name,
            description,
            platform,
            externalId,
            address,
            propertyType,
            imageUrl,
            originalUrl,
            updatedAt: new Date()
          }
        });
      } else {
        // Crear nueva propiedad
        property = await prisma.hospitalityProperty.create({
          data: {
            name,
            description,
            platform,
            externalId,
            address,
            propertyType,
            imageUrl,
            originalUrl,
            userId
          }
        });
      }
      
      return res.status(200).json({ 
        message: id ? 'Propiedad actualizada correctamente' : 'Propiedad creada correctamente',
        property
      });
    } catch (error) {
      console.error('Error al crear/actualizar propiedad:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Eliminar una propiedad
  deleteProperty: async (req, res) => {
    try {
      const { userId } = req;
      const { propertyId } = req.params;
      
      // Verificar que la propiedad exista y pertenezca al usuario
      const property = await prisma.hospitalityProperty.findFirst({
        where: {
          id: propertyId,
          userId
        }
      });
      
      if (!property) {
        return res.status(404).json({ message: 'Propiedad no encontrada' });
      }
      
      // Eliminar las reviews asociadas
      await prisma.hospitalityReview.deleteMany({
        where: {
          propertyId
        }
      });
      
      // Eliminar la propiedad
      await prisma.hospitalityProperty.delete({
        where: {
          id: propertyId
        }
      });
      
      return res.status(200).json({ message: 'Propiedad eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar propiedad:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Obtener reseñas de una propiedad
  getPropertyReviews: async (req, res) => {
    try {
      const { userId } = req;
      const { propertyId } = req.params;
      const { page = 1, limit = 20, sentiment } = req.query;
      
      // Verificar que la propiedad exista y pertenezca al usuario
      const property = await prisma.hospitalityProperty.findFirst({
        where: {
          id: propertyId,
          userId
        }
      });
      
      if (!property) {
        return res.status(404).json({ message: 'Propiedad no encontrada' });
      }
      
      // Calcular paginación
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Construir cláusula where
      const whereClause = {
        propertyId,
        ...(sentiment && { sentiment })
      };
      
      // Obtener reseñas
      const reviews = await prisma.hospitalityReview.findMany({
        where: whereClause,
        orderBy: {
          date: 'desc'
        },
        skip,
        take: parseInt(limit)
      });
      
      // Obtener total de reseñas para paginación
      const totalReviews = await prisma.hospitalityReview.count({
        where: whereClause
      });
      
      return res.status(200).json({
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalItems: totalReviews,
          totalPages: Math.ceil(totalReviews / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error al obtener reseñas:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Añadir o actualizar una reseña
  upsertReview: async (req, res) => {
    try {
      const { userId } = req;
      const { 
        id,
        propertyId,
        author,
        content,
        rating,
        date,
        platform,
        responseContent,
        responseDate,
        sentiment,
        tags
      } = req.body;
      
      if (!propertyId || !author || !content || !rating || !date || !platform) {
        return res.status(400).json({ 
          message: 'Faltan campos obligatorios: propertyId, author, content, rating, date, platform' 
        });
      }
      
      // Verificar que la propiedad exista y pertenezca al usuario
      const property = await prisma.hospitalityProperty.findFirst({
        where: {
          id: propertyId,
          userId
        }
      });
      
      if (!property) {
        return res.status(404).json({ message: 'Propiedad no encontrada' });
      }
      
      let review;
      
      if (id) {
        // Actualizar reseña existente
        review = await prisma.hospitalityReview.update({
          where: {
            id
          },
          data: {
            author,
            content,
            rating: parseFloat(rating),
            date: new Date(date),
            platform,
            responseContent,
            responseDate: responseDate ? new Date(responseDate) : null,
            sentiment,
            tags: tags || {},
            updatedAt: new Date()
          }
        });
      } else {
        // Crear nueva reseña
        review = await prisma.hospitalityReview.create({
          data: {
            property: {
              connect: {
                id: propertyId
              }
            },
            author,
            content,
            rating: parseFloat(rating),
            date: new Date(date),
            platform,
            responseContent,
            responseDate: responseDate ? new Date(responseDate) : null,
            sentiment,
            tags: tags || {}
          }
        });
        
        // Actualizar métricas de la propiedad
        await prisma.hospitalityProperty.update({
          where: {
            id: propertyId
          },
          data: {
            totalReviews: {
              increment: 1
            },
            averageRating: {
              set: await calculateAverageRating(propertyId)
            }
          }
        });
      }
      
      return res.status(200).json({ 
        message: id ? 'Reseña actualizada correctamente' : 'Reseña agregada correctamente',
        review
      });
    } catch (error) {
      console.error('Error al crear/actualizar reseña:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Responder a una reseña
  respondToReview: async (req, res) => {
    try {
      const { userId } = req;
      const { reviewId } = req.params;
      const { responseContent } = req.body;
      
      if (!responseContent) {
        return res.status(400).json({ message: 'El contenido de la respuesta es obligatorio' });
      }
      
      // Verificar que la reseña exista y pertenezca a una propiedad del usuario
      const review = await prisma.hospitalityReview.findFirst({
        where: {
          id: reviewId,
          property: {
            userId
          }
        }
      });
      
      if (!review) {
        return res.status(404).json({ message: 'Reseña no encontrada' });
      }
      
      // Actualizar la reseña con la respuesta
      const updatedReview = await prisma.hospitalityReview.update({
        where: {
          id: reviewId
        },
        data: {
          responseContent,
          responseDate: new Date()
        }
      });
      
      return res.status(200).json({
        message: 'Respuesta guardada correctamente',
        review: updatedReview
      });
    } catch (error) {
      console.error('Error al responder a la reseña:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Obtener métricas y análisis
  getAnalytics: async (req, res) => {
    try {
      const { userId } = req;
      const { propertyId, period } = req.query;
      
      // Determinar el período de tiempo
      const today = new Date();
      let startDate;
      
      switch (period) {
        case 'week':
          startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          break;
        case 'quarter':
          startDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
          break;
        case 'year':
          startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
          break;
        default:
          startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      }
      
      // Construir cláusula where
      const whereClause = {
        date: {
          gte: startDate
        },
        property: {
          userId
        },
        ...(propertyId && { propertyId })
      };
      
      // Obtener reseñas para análisis
      const reviews = await prisma.hospitalityReview.findMany({
        where: whereClause,
        orderBy: {
          date: 'asc'
        },
        include: {
          property: {
            select: {
              name: true,
              platform: true
            }
          }
        }
      });
      
      // Preparar datos para el análisis
      const sentimentCounts = {
        positive: reviews.filter(r => r.sentiment === 'positive').length,
        neutral: reviews.filter(r => r.sentiment === 'neutral').length,
        negative: reviews.filter(r => r.sentiment === 'negative').length
      };
      
      // Calcular promedios por plataforma
      const platformData = {};
      reviews.forEach(review => {
        if (!platformData[review.platform]) {
          platformData[review.platform] = {
            count: 0,
            ratingSum: 0,
            avgRating: 0
          };
        }
        
        platformData[review.platform].count++;
        platformData[review.platform].ratingSum += review.rating;
      });
      
      // Calcular promedios
      Object.keys(platformData).forEach(platform => {
        platformData[platform].avgRating = 
          platformData[platform].ratingSum / platformData[platform].count;
      });
      
      // Extraer tendencias por fecha
      const ratingsByDate = {};
      reviews.forEach(review => {
        const dateStr = review.date.toISOString().split('T')[0];
        if (!ratingsByDate[dateStr]) {
          ratingsByDate[dateStr] = {
            count: 0,
            ratingSum: 0
          };
        }
        
        ratingsByDate[dateStr].count++;
        ratingsByDate[dateStr].ratingSum += review.rating;
      });
      
      // Convertir a serie temporal para gráficos
      const timelineData = Object.keys(ratingsByDate).map(dateStr => ({
        date: dateStr,
        avgRating: ratingsByDate[dateStr].ratingSum / ratingsByDate[dateStr].count,
        count: ratingsByDate[dateStr].count
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      return res.status(200).json({
        totalReviews: reviews.length,
        averageRating: reviews.length > 0 
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
          : 0,
        sentiment: sentimentCounts,
        platforms: platformData,
        timeline: timelineData,
        period
      });
    } catch (error) {
      console.error('Error al obtener análisis:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  // Función para sincronizar datos simulados
  syncReviews: async (req, res) => {
    try {
      const { userId } = req;
      const { propertyId, platform } = req.body;
      
      if (!propertyId || !platform) {
        return res.status(400).json({ message: 'El id de propiedad y plataforma son obligatorios' });
      }
      
      // Verificar que la propiedad exista y pertenezca al usuario
      const property = await prisma.hospitalityProperty.findFirst({
        where: {
          id: propertyId,
          userId
        }
      });
      
      if (!property) {
        return res.status(404).json({ message: 'Propiedad no encontrada' });
      }
      
      // Simular la sincronización obteniendo datos simulados
      const simulatedReviews = generateSimulatedReviews(platform, 5);
      
      // Guardar reseñas simuladas
      const savedReviews = [];
      for (const reviewData of simulatedReviews) {
        const review = await prisma.hospitalityReview.create({
          data: {
            property: {
              connect: {
                id: propertyId
              }
            },
            ...reviewData
          }
        });
        
        savedReviews.push(review);
      }
      
      // Actualizar métricas de la propiedad
      await prisma.hospitalityProperty.update({
        where: {
          id: propertyId
        },
        data: {
          totalReviews: {
            increment: simulatedReviews.length
          },
          averageRating: {
            set: await calculateAverageRating(propertyId)
          },
          updatedAt: new Date()
        }
      });
      
      return res.status(200).json({
        message: `${savedReviews.length} reseñas sincronizadas correctamente`,
        reviews: savedReviews
      });
    } catch (error) {
      console.error('Error al sincronizar reseñas:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
};

// Función auxiliar para calcular la calificación promedio
async function calculateAverageRating(propertyId) {
  const result = await prisma.hospitalityReview.aggregate({
    where: {
      propertyId
    },
    _avg: {
      rating: true
    }
  });
  
  return result._avg.rating || 0;
}

// Función para generar reseñas simuladas
function generateSimulatedReviews(platform, count = 5) {
  const reviews = [];
  const sentiments = ['positive', 'neutral', 'negative'];
  const now = new Date();
  
  const positiveComments = [
    "Excelente lugar, lo recomendaría sin dudarlo.",
    "La ubicación es inmejorable y el personal muy atento.",
    "Una experiencia increíble, volveremos seguro.",
    "Muy limpio y cómodo, superó nuestras expectativas.",
    "La mejor opción en la zona, vale cada peso."
  ];
  
  const neutralComments = [
    "Estuvo bien, nada extraordinario pero cumplió.",
    "Aceptable para el precio que pagamos.",
    "Tiene sus pros y contras, pero en general está bien.",
    "Un lugar promedio, podría mejorar algunos aspectos.",
    "Ni bueno ni malo, simplemente cumplió su función."
  ];
  
  const negativeComments = [
    "Decepcionante, no volvería a hospedarme aquí.",
    "La limpieza deja mucho que desear.",
    "El personal no fue nada amable.",
    "Muy ruidoso, no pudimos descansar bien.",
    "No recomendaría este lugar, hay mejores opciones."
  ];
  
  for (let i = 0; i < count; i++) {
    const sentimentIndex = Math.floor(Math.random() * 3);
    const sentiment = sentiments[sentimentIndex];
    
    let content;
    let rating;
    
    if (sentiment === 'positive') {
      content = positiveComments[Math.floor(Math.random() * positiveComments.length)];
      rating = 4 + Math.random(); // Entre 4 y 5
    } else if (sentiment === 'neutral') {
      content = neutralComments[Math.floor(Math.random() * neutralComments.length)];
      rating = 2.5 + Math.random() * 1.5; // Entre 2.5 y 4
    } else {
      content = negativeComments[Math.floor(Math.random() * negativeComments.length)];
      rating = 1 + Math.random() * 1.5; // Entre 1 y 2.5
    }
    
    // Generar fecha aleatoria en los últimos 3 meses
    const date = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    
    reviews.push({
      author: `Usuario ${Math.floor(Math.random() * 1000)}`,
      content,
      rating: Math.round(rating * 10) / 10, // Redondear a 1 decimal
      date,
      platform,
      sentiment,
      tags: { 
        type: sentiment, 
        source: platform.toLowerCase()
      }
    });
  }
  
  return reviews;
}

module.exports = hospitalityController;
