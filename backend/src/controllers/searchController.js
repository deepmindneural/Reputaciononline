const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controlador para el motor de búsqueda global
class SearchController {
  /**
   * Realiza una búsqueda general en todas las fuentes
   */
  async search(req, res) {
    try {
      const { 
        query, 
        entityType = 'all', 
        sources = ['all'], 
        location, 
        limit = 10,
        includeRatings = true,
        includeMentions = true,
        includeSocialProfiles = true,
        startDate,
        endDate 
      } = req.query;

      // Validar que exista la consulta
      if (!query || query.trim() === '') {
        return res.status(400).json({
          error: 'Se requiere un término de búsqueda'
        });
      }

      // Construir la respuesta con datos simulados para la demostración
      // En una implementación real, esto consultaría múltiples APIs y bases de datos
      const results = [];
      const totalResults = Math.floor(Math.random() * 1000) + 20;
      
      // Determinar qué tipos de entidades incluir en los resultados
      const typesToInclude = 
        entityType === 'all' 
          ? ['person', 'company', 'product', 'agency', 'hotel', 'place'] 
          : [entityType];
      
      // Función para generar un ID único basado en la consulta
      const generateId = (index) => {
        return `entity_${query.replace(/\\s+/g, '_').toLowerCase()}_${index}`;
      };
      
      // Generar resultados simulados
      for (let i = 0; i < limit; i++) {
        const resultType = typesToInclude[i % typesToInclude.length];
        const id = generateId(i);
        
        // Generar calificaciones simuladas
        const ratings = await this.getSimulatedRatings(id);
        
        // Calcular puntuación general basada en calificaciones
        const overallScore = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
        
        // Determinar sentimiento general
        let overallSentiment = 'neutral';
        if (overallScore >= 4) overallSentiment = 'positive';
        else if (overallScore < 2.5) overallSentiment = 'negative';
        
        // Generar menciones simuladas
        const mentions = includeMentions 
          ? await this.getSimulatedMentions(id, { startDate, endDate })
          : [];
        
        // Generar perfiles sociales simulados
        const socialProfiles = includeSocialProfiles 
          ? await this.getSimulatedSocialProfiles(id)
          : {};
        
        // Construir resultado
        const result = {
          id,
          name: this.generateEntityName(query, resultType, i),
          type: resultType,
          description: this.generateDescription(query, resultType),
          imageUrl: this.generateImageUrl(resultType, i),
          ratings: includeRatings ? ratings : [],
          mentions,
          overallScore,
          overallSentiment,
          socialProfiles,
          metadata: this.generateMetadata(resultType),
        };
        
        results.push(result);
      }
      
      // Tiempo de búsqueda simulado (en segundos)
      const timeElapsed = Math.random() * 2 + 0.5;
      
      return res.json({
        results,
        totalResults,
        searchStats: {
          sourcesSearched: Math.floor(Math.random() * 10) + 5,
          timeElapsed,
        },
      });
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      return res.status(500).json({
        error: 'Error al procesar la búsqueda',
        details: error.message
      });
    }
  }

  /**
   * Obtiene calificaciones para una entidad específica
   */
  async getRatings(req, res) {
    try {
      const { entityId } = req.params;
      const { sources } = req.query;
      
      if (!entityId) {
        return res.status(400).json({
          error: 'Se requiere un ID de entidad'
        });
      }
      
      const ratings = await this.getSimulatedRatings(entityId);
      
      return res.json(ratings);
    } catch (error) {
      console.error('Error al obtener calificaciones:', error);
      return res.status(500).json({
        error: 'Error al obtener calificaciones',
        details: error.message
      });
    }
  }

  /**
   * Obtiene menciones para una entidad específica
   */
  async getMentions(req, res) {
    try {
      const { entityId } = req.params;
      const { startDate, endDate, sentiment = 'all', limit = 10 } = req.query;
      
      if (!entityId) {
        return res.status(400).json({
          error: 'Se requiere un ID de entidad'
        });
      }
      
      const mentions = await this.getSimulatedMentions(entityId, {
        startDate,
        endDate,
        sentiment,
        limit: parseInt(limit, 10)
      });
      
      return res.json(mentions);
    } catch (error) {
      console.error('Error al obtener menciones:', error);
      return res.status(500).json({
        error: 'Error al obtener menciones',
        details: error.message
      });
    }
  }

  /**
   * Obtiene perfiles sociales para una entidad específica
   */
  async getSocialProfiles(req, res) {
    try {
      const { entityId } = req.params;
      
      if (!entityId) {
        return res.status(400).json({
          error: 'Se requiere un ID de entidad'
        });
      }
      
      const socialProfiles = await this.getSimulatedSocialProfiles(entityId);
      
      return res.json(socialProfiles);
    } catch (error) {
      console.error('Error al obtener perfiles sociales:', error);
      return res.status(500).json({
        error: 'Error al obtener perfiles sociales',
        details: error.message
      });
    }
  }

  // === Métodos para generar datos simulados ===

  async getSimulatedRatings(entityId) {
    const sources = ['Google', 'Facebook', 'Yelp', 'TripAdvisor', 'Amazon', 'Trustpilot'];
    const ratings = [];
    
    // Generar entre 3 y 6 calificaciones
    const ratingCount = Math.floor(Math.random() * 4) + 3;
    
    for (let i = 0; i < ratingCount; i++) {
      const score = Math.min(5, Math.max(1, Math.random() * 5)); // Entre 1 y 5
      let sentiment = 'neutral';
      
      if (score >= 4) sentiment = 'positive';
      else if (score < 2.5) sentiment = 'negative';
      
      ratings.push({
        source: sources[i % sources.length],
        score,
        count: Math.floor(Math.random() * 500) + 10,
        sentiment,
      });
    }
    
    return ratings;
  }

  async getSimulatedMentions(entityId, params = {}) {
    const { startDate, endDate, sentiment = 'all', limit = 10 } = params;
    
    const sources = ['Twitter', 'Facebook', 'Instagram', 'Blog', 'News', 'Forum'];
    const sentiments = ['positive', 'neutral', 'negative'];
    const mentions = [];
    
    // Generar menciones simuladas
    const mentionCount = parseInt(limit, 10) || Math.floor(Math.random() * 6) + 5;
    
    for (let i = 0; i < mentionCount; i++) {
      const mentionSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      
      // Si se especifica un sentimiento y no es 'all', filtrar
      if (sentiment && sentiment !== 'all' && mentionSentiment !== sentiment) {
        continue;
      }
      
      const now = new Date();
      const randomDays = Math.floor(Math.random() * 30);
      const date = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
      
      mentions.push({
        source: sources[Math.floor(Math.random() * sources.length)],
        url: `https://example.com/mention/${entityId}/${i}`,
        text: this.generateMentionText(entityId, mentionSentiment),
        date: date.toISOString(),
        sentiment: mentionSentiment,
      });
    }
    
    return mentions;
  }

  async getSimulatedSocialProfiles(entityId) {
    // Generar URLs simuladas basadas en el ID de entidad
    const name = entityId.replace('entity_', '').replace(/_/g, '');
    
    return {
      facebook: Math.random() > 0.2 ? `https://facebook.com/${name}` : undefined,
      twitter: Math.random() > 0.3 ? `https://twitter.com/${name}` : undefined,
      instagram: Math.random() > 0.4 ? `https://instagram.com/${name}` : undefined,
      linkedin: Math.random() > 0.5 ? `https://linkedin.com/in/${name}` : undefined,
      website: Math.random() > 0.1 ? `https://${name}.com` : undefined,
    };
  }

  // Métodos para generar datos específicos simulados

  generateEntityName(query, type, index) {
    const names = {
      person: ['Juan Pérez', 'María González', 'Carlos Rodríguez', 'Ana López', 'Pedro Martínez'],
      company: ['Empresa', 'Corporación', 'Grupo', 'Industrias', 'Servicios'],
      product: ['Smart', 'Pro', 'Ultra', 'Plus', 'Premium'],
      agency: ['Agencia', 'Consultora', 'Gestora', 'Asesores', 'Asociados'],
      hotel: ['Hotel', 'Hostal', 'Posada', 'Resort', 'Suite'],
      place: ['Restaurante', 'Café', 'Bar', 'Centro', 'Tienda'],
    };
    
    const typeNames = names[type] || names.company;
    const randomName = typeNames[index % typeNames.length];
    
    // Para crear variedad en los resultados
    if (type === 'person') {
      return randomName;
    } else if (type === 'product') {
      return `${query} ${randomName} ${Math.floor(Math.random() * 1000)}`;
    } else {
      return `${randomName} ${query}`;
    }
  }

  generateDescription(query, type) {
    const descriptions = {
      person: [
        `Experto en ${query} con amplia experiencia en el sector.`,
        `Profesional reconocido en el ámbito de ${query}.`,
        `Consultor especializado en ${query} y temas relacionados.`,
      ],
      company: [
        `Empresa líder en el sector de ${query}.`,
        `Organización especializada en soluciones para ${query}.`,
        `Compañía con más de 10 años de experiencia en ${query}.`,
      ],
      product: [
        `Producto innovador que revoluciona ${query}.`,
        `Solución avanzada para ${query}.`,
        `La mejor opción en el mercado de ${query}.`,
      ],
      agency: [
        `Agencia especializada en servicios de ${query}.`,
        `Consultora experta en estrategias para ${query}.`,
        `Asesores profesionales en el ámbito de ${query}.`,
      ],
      hotel: [
        `Alojamiento de calidad ubicado en la zona de ${query}.`,
        `Hotel con todas las comodidades cerca de ${query}.`,
        `Experiencia única de hospedaje en ${query}.`,
      ],
      place: [
        `Establecimiento popular en la zona de ${query}.`,
        `Punto de referencia para los amantes de ${query}.`,
        `Lugar ideal para disfrutar de ${query}.`,
      ],
    };
    
    const typeDescriptions = descriptions[type] || descriptions.company;
    return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
  }

  generateImageUrl(type, index) {
    // En una implementación real, esto sería una URL válida a una imagen
    return `https://via.placeholder.com/150?text=${type}_${index}`;
  }

  generateMetadata(type) {
    // Metadatos específicos según el tipo de entidad
    switch (type) {
      case 'person':
        return {
          age: Math.floor(Math.random() * 40) + 25,
          occupation: ['Político', 'Empresario', 'Influencer', 'Consultor', 'Director'][Math.floor(Math.random() * 5)],
          location: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'][Math.floor(Math.random() * 5)],
        };
      
      case 'company':
        return {
          employees: Math.floor(Math.random() * 1000) + 10,
          industry: ['Tecnología', 'Salud', 'Educación', 'Comercio', 'Servicios'][Math.floor(Math.random() * 5)],
          founded: 2000 + Math.floor(Math.random() * 22),
        };
      
      case 'product':
        return {
          price: Math.floor(Math.random() * 100000) + 10000,
          category: ['Electrónica', 'Hogar', 'Salud', 'Deporte', 'Moda'][Math.floor(Math.random() * 5)],
          inStock: Math.random() > 0.2,
        };
      
      case 'agency':
        return {
          services: ['Consultoría', 'Marketing', 'Diseño', 'Desarrollo', 'Asesoría'][Math.floor(Math.random() * 5)],
          clients: Math.floor(Math.random() * 100) + 10,
          location: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'][Math.floor(Math.random() * 5)],
        };
      
      case 'hotel':
        return {
          stars: Math.floor(Math.random() * 5) + 1,
          rooms: Math.floor(Math.random() * 100) + 20,
          amenities: ['WiFi', 'Piscina', 'Restaurante', 'Spa', 'Gimnasio'],
          location: ['Centro', 'Playa', 'Montaña', 'Suburbio', 'Rural'][Math.floor(Math.random() * 5)],
        };
      
      case 'place':
        return {
          category: ['Restaurante', 'Café', 'Tienda', 'Museo', 'Parque'][Math.floor(Math.random() * 5)],
          priceRange: ['$', '$$', '$$$', '$$$$'][Math.floor(Math.random() * 4)],
          location: ['Centro', 'Norte', 'Sur', 'Este', 'Oeste'][Math.floor(Math.random() * 5)],
        };
        
      default:
        return {};
    }
  }

  generateMentionText(entityId, sentiment) {
    const name = entityId.split('_').slice(1, -1).join(' ');
    
    const positiveTexts = [
      `${name} ofrece un servicio excepcional, realmente recomendado!`,
      `Mi experiencia con ${name} fue increíble, superó mis expectativas.`,
      `No puedo estar más satisfecho con ${name}, definitivamente volveré.`,
      `${name} tiene la mejor calidad que he encontrado en el mercado.`,
      `Felicidades a ${name} por su excelente atención al cliente.`,
    ];
    
    const neutralTexts = [
      `${name} cumple con lo básico, pero podría mejorar en algunos aspectos.`,
      `Mi experiencia con ${name} fue normal, ni buena ni mala.`,
      `${name} ofrece lo que promete, nada más y nada menos.`,
      `Visité ${name} ayer, el servicio fue estándar.`,
      `${name} tiene potencial pero necesita algunos ajustes.`,
    ];
    
    const negativeTexts = [
      `Lamentablemente, ${name} no cumplió con mis expectativas.`,
      `No recomendaría ${name}, tuve una mala experiencia.`,
      `El servicio de ${name} dejó mucho que desear.`,
      `${name} necesita mejorar urgentemente su atención al cliente.`,
      `Me decepcionó mi experiencia con ${name}, no volveré.`,
    ];
    
    let texts;
    switch (sentiment) {
      case 'positive':
        texts = positiveTexts;
        break;
      case 'negative':
        texts = negativeTexts;
        break;
      default:
        texts = neutralTexts;
    }
    
    return texts[Math.floor(Math.random() * texts.length)];
  }
}

module.exports = new SearchController();
