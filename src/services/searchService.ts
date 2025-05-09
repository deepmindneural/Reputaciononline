import axios from 'axios';

// Tipos para el motor de búsqueda
export type EntityType = 'person' | 'company' | 'product' | 'agency' | 'hotel' | 'place' | 'entity' | 'news' | 'mention' | 'comment' | 'post' | 'article' | 'document' | 'file' | 'report' | 'analysis' | 'user' | 'all';
export type SourceType = 'web' | 'social' | 'news' | 'reviews' | 'platform' | 'internal' | 'document' | 'database' | 'all';

// Tipo para excluir 'all' de EntityType cuando se necesite
export type ConcreteEntityType = Exclude<EntityType, 'all'> | 'reviews' | 'related';

// Interfaces para los resultados de búsqueda
export interface Rating {
  source: string;
  score: number;
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface Mention {
  id?: string;
  source: string;
  text: string;
  date: string;
  author?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  likes?: number;
  shares?: number;
  authorImage?: string;
  url?: string;
}

export interface SearchResult {
  id: string;
  name: string;
  type: EntityType | 'news' | 'reviews' | 'related';
  description: string;
  url: string;
  imageUrl?: string;
  domain?: string;
  ratings: Rating[];
  mentions: Mention[];
  overallScore: number;
  overallSentiment: string;
  socialProfiles: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
    google?: string;
  };
  metadata: {
    source: string;
    timestamp: string;
    location?: string;
    department?: string;
    author?: string;
    format?: string;
    size?: string;
    pages?: number;
    [key: string]: any;
  };
}

// Parámetros de búsqueda
export interface SearchParams {
  query: string;
  entityType?: EntityType;
  sources?: SourceType[];
  location?: string;
  limit?: number;
  includeRatings?: boolean;
  includeMentions?: boolean;
  includeSocialProfiles?: boolean;
  startDate?: string;
  endDate?: string;
}

// Respuesta general de búsqueda
export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  timeMs?: number;
  sources: string[];
  query: string;
  message?: string;
}

// URLs de API (se usarán las versiones simuladas para el entorno de demostración)
export const API_ENDPOINTS = {
  // URL relativa al origen actual - funciona con cualquier origen
  search: '/api/search', // Endpoint principal
  entities: '/api/entities', // Recupera entidades
  mentions: '/api/mentions', // Recupera menciones
  ratings: '/api/ratings', // Recupera calificaciones
  profiles: '/api/profiles', // Recupera perfiles sociales
  recommendations: '/api/recommendations', // Recupera recomendaciones
};

/**
 * Servicio principal de búsqueda
 * Integra múltiples fuentes para obtener información completa sobre entidades
 */
class SearchService {
  // Palabras clave asociadas a cada tipo de entidad
  private keywordsByType: Record<ConcreteEntityType, string[]> = {
    person: ['presidente', 'actor', 'actriz', 'senador', 'político', 'artista', 'doctor', 'médico', 'abogado', 'profesional', 'usuario', 'persona', 'cliente', 'contacto'],
    company: ['empresa', 'compañía', 'corporación', 'grupo', 'marca', 'fabricante', 'industria', 'productor', 'negocio', 'pyme', 'comercio'],
    product: ['producto', 'modelo', 'dispositivo', 'objeto', 'item', 'versión', 'edición', 'servicio', 'solución', 'herramienta'],
    agency: ['agencia', 'institución', 'organización', 'entidad', 'departamento', 'oficina', 'despacho', 'sede', 'sucursal'],
    hotel: ['hotel', 'hostal', 'hospedaje', 'alojamiento', 'posada', 'resort', 'cabaña', 'habitación', 'suite', 'reserva'],
    place: ['ciudad', 'lugar', 'sitio', 'destino', 'país', 'región', 'provincia', 'municipio', 'localidad', 'dirección', 'ubicación'],
    entity: ['institución', 'organización', 'entidad', 'sistema', 'concepto', 'estructura', 'componente'],
    news: ['noticia', 'artículo', 'reportaje', 'publicación', 'información', 'comunicado', 'novedad', 'actualización', 'anuncio'],
    mention: ['mención', 'referencia', 'cita', 'alusión', 'comentario', 'publicación', 'post', 'tweet', 'hashtag'],
    comment: ['comentario', 'respuesta', 'reacción', 'mensaje', 'conversación', 'interacción', 'discusión'],
    post: ['publicación', 'post', 'entrada', 'contenido', 'actualización', 'estado', 'historia', 'tweet'],
    article: ['artículo', 'publicación', 'blog', 'entrada', 'contenido', 'editorial', 'columna'],
    document: ['documento', 'archivo', 'pdf', 'presentación', 'informe', 'reporte', 'hoja', 'libro', 'manual'],
    file: ['archivo', 'fichero', 'documento', 'imagen', 'video', 'audio', 'multimedia', 'adjunto'],
    report: ['reporte', 'informe', 'estadística', 'análisis', 'resumen', 'resultado', 'métrica', 'indicador'],
    analysis: ['análisis', 'estudio', 'investigación', 'evaluación', 'diagnóstico', 'hallazgo', 'conclusión'],
    user: ['usuario', 'cliente', 'miembro', 'suscriptor', 'cuenta', 'perfil', 'contacto', 'persona'],
    reviews: ['reseña', 'opinión', 'valoración', 'calificación', 'evaluación', 'crítica', 'testimonio', 'feedback'],
    related: ['relacionado', 'similar', 'asociado', 'vinculado', 'conectado', 'conexo', 'afín']
  };

  // Dominios asociados a cada tipo de entidad
  private domainsByType: Record<ConcreteEntityType, string[]> = {
    person: ['linkedin.com', 'wikipedia.org', 'facebook.com', 'twitter.com', 'instagram.com'],
    company: ['linkedin.com', 'facebook.com', 'crunchbase.com', 'glassdoor.com', 'bloomberg.com'],
    product: ['amazon.com', 'mercadolibre.com', 'ebay.com', 'falabella.com', 'exito.com'],
    agency: ['gov.co', 'gob.co', 'org', 'org.co', 'edu.co'],
    hotel: ['booking.com', 'hotels.com', 'tripadvisor.com', 'airbnb.com', 'expedia.com'],
    place: ['tripadvisor.com', 'lonelyplanet.com', 'viator.com', 'maps.google.com'],
    entity: ['wikipedia.org', 'britannica.com', 'gov.co', 'org.co'],
    news: ['eltiempo.com', 'elespectador.com', 'caracol.com.co', 'rcn.com.co', 'semana.com'],
    mention: ['twitter.com', 'facebook.com', 'instagram.com', 'linkedin.com', 'tiktok.com'],
    comment: ['twitter.com', 'facebook.com', 'instagram.com', 'youtube.com', 'disqus.com'],
    post: ['facebook.com', 'instagram.com', 'twitter.com', 'linkedin.com', 'medium.com'],
    article: ['medium.com', 'blogger.com', 'wordpress.com', 'substack.com', 'eltiempo.com'],
    document: ['drive.google.com', 'docs.google.com', 'office.com', 'dropbox.com', 'sharepoint.com'],
    file: ['drive.google.com', 'dropbox.com', 'onedrive.com', 'box.com', 'wetransfer.com'],
    report: ['drive.google.com', 'docs.google.com', 'office.com', 'tableau.com', 'datastudio.google.com'],
    analysis: ['tableau.com', 'datastudio.google.com', 'metabase.com', 'powerbi.microsoft.com', 'looker.com'],
    user: ['facebook.com', 'linkedin.com', 'twitter.com', 'instagram.com', 'github.com'],
    reviews: ['tripadvisor.com', 'google.com/maps', 'yelp.com', 'trustpilot.com'],
    related: ['google.com', 'wikipedia.org', 'youtube.com']
  };

  /**
   * Realiza una búsqueda completa de una entidad
   * @param params Parámetros de búsqueda
   * @returns Resultados de búsqueda completos
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    const startTime = Date.now();
    
    try {
      // Intentar buscar a través de la API
      const apiParams = {
        q: params.query,
        type: params.entityType || 'all',
        limit: params.limit || 20,
        location: params.location || undefined,
        startDate: params.startDate || undefined,
        endDate: params.endDate || undefined,
        sources: params.sources?.join(',') || undefined
      };
      
      const response = await axios.get(`${API_ENDPOINTS.search}`, { params: apiParams });
      
      // Si hay resultados válidos, devolverlos
      if (response.data && response.data.results && response.data.results.length > 0) {
        return {
          results: response.data.results,
          totalResults: response.data.totalResults || response.data.results.length,
          timeMs: Date.now() - startTime,
          sources: response.data.sources || ['api'],
          query: params.query
        };
      }
      
      // Si no hay resultados de la API, buscar en múltiples fuentes y combinar resultados
      const combinedResults = [];
      
      // Buscar entidades
      const entityResults = this.getSimulatedSearch(params.query).results;
      combinedResults.push(...entityResults);
      
      // Buscar menciones en redes sociales
      const mentions = this.searchInSocialMedia(params.query);
      combinedResults.push(...mentions.map(mention => ({
        id: `mention_${mention.id || Date.now()}_${Math.random().toString(36).substring(2)}`,
        name: mention.source,
        type: 'mention',
        description: mention.text,
        url: mention.url || '',
        imageUrl: mention.authorImage || `https://picsum.photos/200/200?random=${Math.random()}`,
        ratings: [],
        mentions: [mention],
        overallScore: mention.sentiment === 'positive' ? 4.5 : mention.sentiment === 'negative' ? 1.5 : 3,
        overallSentiment: mention.sentiment,
        socialProfiles: {},
        metadata: {
          source: 'social_media',
          timestamp: mention.date
        }
      })));
      
      // Buscar en la base de datos interna
      const internalResults = this.searchInInternalDatabase(params.query);
      combinedResults.push(...internalResults as SearchResult[]);
      
      // Buscar en documentos
      const documentResults = this.searchInDocuments(params.query);
      combinedResults.push(...documentResults as SearchResult[]);
      
      // Aplicar filtros si existen
      let filteredResults = combinedResults;
      
      // Filtrar por tipo de entidad
      if (params.entityType && params.entityType !== 'all') {
        filteredResults = filteredResults.filter(result => result.type === params.entityType);
      }
      
      // Filtrar por ubicación
      if (params.location) {
        const locationLower = params.location.toLowerCase();
        filteredResults = filteredResults.filter(result => {
          const description = result.description?.toLowerCase() || '';
          // Verificar si metadata.location existe de manera segura
          const location = typeof result.metadata === 'object' && 
                           result.metadata !== null && 
                           'location' in result.metadata && 
                           typeof result.metadata.location === 'string' ? 
                           result.metadata.location.toLowerCase() : '';
          return description.includes(locationLower) || location.includes(locationLower);
        });
      }
      
      // Filtrar por fecha
      if (params.startDate || params.endDate) {
        filteredResults = filteredResults.filter(result => {
          const resultDate = new Date(result.metadata.timestamp);
          const startDateOk = params.startDate ? resultDate >= new Date(params.startDate) : true;
          const endDateOk = params.endDate ? resultDate <= new Date(params.endDate) : true;
          return startDateOk && endDateOk;
        });
      }
      
      // Limitar el número de resultados
      const limitedResults = filteredResults.slice(0, params.limit || 20);
      
      return {
        results: limitedResults,
        totalResults: filteredResults.length,
        timeMs: Date.now() - startTime,
        sources: ['api', 'simulation', 'social_media', 'internal_database', 'documents'],
        query: params.query,
        message: 'Resultados combinados de múltiples fuentes'
      };
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      
      // En caso de error, buscar en múltiples fuentes como respaldo
      const combinedResults = [];
      
      // Buscar entidades
      const entityResults = this.getSimulatedSearch(params.query).results;
      combinedResults.push(...entityResults);
      
      // Buscar menciones en redes sociales
      const mentions = this.searchInSocialMedia(params.query);
      combinedResults.push(...mentions.map(mention => ({
        id: `mention_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        name: mention.source,
        type: 'mention',
        description: mention.text,
        url: mention.url || '',
        imageUrl: mention.authorImage || `https://picsum.photos/200/200?random=${Math.random()}`,
        ratings: [],
        mentions: [mention],
        overallScore: mention.sentiment === 'positive' ? 4.5 : mention.sentiment === 'negative' ? 1.5 : 3,
        overallSentiment: mention.sentiment,
        socialProfiles: {},
        metadata: {
          source: 'social_media',
          timestamp: mention.date
        }
      })));
      
      // Limitar el número de resultados
      const limitedResults = combinedResults.slice(0, params.limit || 20);
      
      return {
        results: limitedResults,
        totalResults: combinedResults.length,
        timeMs: Date.now() - startTime,
        sources: ['simulation', 'social_media'],
        query: params.query,
        message: 'Resultados de respaldo debido a un error en la API'
      };
    }
  }

  /**
   * Obtiene menciones para una entidad
   */
  async getMentions(
    entityId: string, 
    params?: { 
      startDate?: string; 
      endDate?: string; 
      sentiment?: 'positive' | 'neutral' | 'negative' | 'all';
      limit?: number;
    }
  ): Promise<Mention[]> {
    // Para este prototipo usamos datos simulados
    return this.getSimulatedMentions(entityId, params);
  }

  /**
   * Obtiene perfiles sociales para una entidad
   */
  async getSocialProfiles(entityId: string): Promise<SearchResult['socialProfiles']> {
    // Para este prototipo usamos datos simulados
    return this.getSimulatedSocialProfiles(entityId);
  }

  /**
   * Obtiene recomendaciones basadas en la entidad
   */
  async getRecommendations(entityId: string): Promise<SearchResult[]> {
    // Para este prototipo usamos datos simulados
    return this.getSimulatedRecommendations(entityId);
  }

  /**
   * Método para búsqueda avanzada
   */
  async advancedSearch(params: any): Promise<SearchResponse> {
    // Implementar búsqueda avanzada
    return this.search(params as SearchParams);
  }

  /**
   * Versión simplificada de getEntities
   */
  async getEntities(params: SearchParams): Promise<SearchResponse> {
    return this.search(params);
  }

  /**
   * Genera menciones simuladas
   */
  getSimulatedMentions(
    entityId: string, 
    params?: { 
      startDate?: string; 
      endDate?: string; 
      sentiment?: 'positive' | 'neutral' | 'negative' | 'all';
      limit?: number;
    }
  ): Mention[] {
    const limit = params?.limit || 5;
    const mentions: Mention[] = [];
    
    // Generar menciones aleatorias
    for (let i = 0; i < limit; i++) {
      const sentiment = ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative';
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      mentions.push({
        source: ['twitter', 'facebook', 'news', 'review', 'instagram'][Math.floor(Math.random() * 5)],
        text: this.generateMentionText(entityId, sentiment),
        date: date.toISOString(),
        author: `Usuario${Math.floor(Math.random() * 1000)}`,
        sentiment,
        likes: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 30),
        url: `https://example.com/mention/${Date.now() + i}`
      });
    }
    
    // Filtrar por sentimiento si es necesario
    if (params?.sentiment && params.sentiment !== 'all') {
      return mentions.filter(m => m.sentiment === params.sentiment);
    }
    
    return mentions;
  }
  
  /**
   * Busca menciones en redes sociales relacionadas con una consulta
   * @param query Consulta de búsqueda
   * @returns Lista de menciones encontradas
   */
  searchInSocialMedia(query: string): Mention[] {
    // En un entorno real, esto se conectaría a las APIs de redes sociales
    const mentions: Mention[] = [];
    const platforms = ['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok'];
    
    // Generar entre 5 y 15 menciones aleatorias
    const count = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < count; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const sentiment = ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative';
      
      // Generar una fecha aleatoria en los últimos 30 días
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      // Generar un nombre de usuario aleatorio
      const authorName = `Usuario_${platform}_${Math.floor(Math.random() * 10000)}`;
      
      mentions.push({
        id: `${platform}_${Date.now()}_${i}`,
        source: platform,
        text: this.generateSocialMediaText(query, platform, sentiment),
        date: date.toISOString(),
        author: authorName,
        sentiment,
        likes: Math.floor(Math.random() * 500) + 10,
        shares: Math.floor(Math.random() * 100) + 5,
        authorImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`,
        url: `https://example.com/${platform}/status/${Date.now()}_${i}`
      });
    }
    
    // Filtrar por relevancia (simulada)
    const queryTokens = query.toLowerCase().split(/\s+/);
    const filteredMentions = mentions.filter(mention => {
      const mentionText = mention.text.toLowerCase();
      return queryTokens.some(token => mentionText.includes(token));
    });
    
    return filteredMentions;
  }
  
  /**
   * Busca en la base de datos interna por contenido relevante
   * @param query Consulta de búsqueda
   * @returns Lista de resultados de búsqueda
   */
  searchInInternalDatabase(query: string): SearchResult[] {
    const results: SearchResult[] = [];
    const internalTypes = ['document', 'report', 'analysis', 'user', 'file'] as const;
    type InternalType = typeof internalTypes[number];
    
    // Generar entre 2 y 8 resultados aleatorios
    const count = Math.floor(Math.random() * 6) + 2;
    
    for (let i = 0; i < count; i++) {
      const typeIndex = Math.floor(Math.random() * internalTypes.length);
      const type = internalTypes[typeIndex] as unknown as EntityType;
      const id = `internal_${type}_${Date.now()}_${i}`;
      
      // Crear título relevante basado en la consulta
      const name = `${(internalTypes[typeIndex] as string).charAt(0).toUpperCase() + (internalTypes[typeIndex] as string).slice(1)} relacionado con ${query}`;
      
      // Fecha aleatoria en los últimos 90 días
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));
      
      // Lista de ubicaciones
      const locations = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'];
      const departments = ['Marketing', 'Ventas', 'Tecnología', 'Finanzas', 'RRHH'];
      
      results.push({
        id,
        name,
        type,
        description: this.generateInternalDescription(query, internalTypes[typeIndex]),
        url: `https://example.com/internal/${type}/${id}`,
        imageUrl: this.getImageForType(internalTypes[typeIndex]),
        domain: 'internal.reputaciononline.com',
        ratings: [],
        mentions: [],
        overallScore: (Math.floor(Math.random() * 10) + 1) / 2, // 0.5 a 5.0
        overallSentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
        socialProfiles: {},
        metadata: {
          source: 'internal_database',
          timestamp: date.toISOString(),
          department: departments[Math.floor(Math.random() * departments.length)],
          author: `Usuario_${Math.floor(Math.random() * 100)}`,
          location: locations[Math.floor(Math.random() * locations.length)]
        }
      });
    }
    
    return results;
  }
  
  /**
   * Busca en documentos (PDFs, hojas de cálculo, etc.) por contenido relevante
   * @param query Consulta de búsqueda
   * @returns Lista de resultados de búsqueda
   */
  searchInDocuments(query: string): SearchResult[] {
    const results: SearchResult[] = [];
    const docTypes = ['document', 'report', 'file'] as const;
    type DocType = typeof docTypes[number];
    const fileFormats = ['PDF', 'Excel', 'Word', 'PowerPoint', 'CSV'];
    
    // Generar entre 2 y 5 resultados aleatorios
    const count = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < count; i++) {
      const typeIndex = Math.floor(Math.random() * docTypes.length);
      const type = docTypes[typeIndex] as unknown as EntityType;
      const format = fileFormats[Math.floor(Math.random() * fileFormats.length)];
      const id = `doc_${type}_${Date.now()}_${i}`;
      
      // Crear título relevante basado en la consulta
      const name = `${query} - ${format} ${i + 1}`;
      
      // Fecha aleatoria en los últimos 365 días
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      
      results.push({
        id,
        name,
        type,
        description: this.generateDocumentDescription(query, format),
        url: `https://example.com/documents/${id}.${format.toLowerCase()}`,
        imageUrl: this.getFormatIcon(format),
        domain: 'docs.reputaciononline.com',
        ratings: [],
        mentions: [],
        overallScore: (Math.floor(Math.random() * 10) + 1) / 2, // 0.5 a 5.0
        overallSentiment: 'neutral',
        socialProfiles: {},
        metadata: {
          source: 'document_repository',
          timestamp: date.toISOString(),
          format: format,
          size: `${Math.floor(Math.random() * 10000) + 100}KB`,
          pages: Math.floor(Math.random() * 50) + 1,
          author: `Usuario_${Math.floor(Math.random() * 100)}`
        }
      });
    }
    
    return results;
  }
  
  /**
   * Genera texto simulado para una mención en redes sociales
   */
  private generateSocialMediaText(query: string, platform: string, sentiment: 'positive' | 'neutral' | 'negative'): string {
    const queryWords = query.split(' ');
    const mainWord = queryWords[0];
    
    const positiveTemplates = [
      `Acabo de descubrir ${query} y es increíble! Totalmente recomendado #${mainWord} #Recomendación`,
      `Mi experiencia con ${query} ha sido excelente. Supera todas las expectativas ✨ #${mainWord}`,
      `${query} ofrece un servicio de primer nivel. Muy satisfecho con los resultados 👏`,
      `Definitivamente ${query} es lo mejor en su categoría. No busquen más! 5 estrellas ⭐⭐⭐⭐⭐`,
      `Impresionado con la calidad de ${query}. Vale cada peso invertido! #MejorOpción`
    ];
    
    const neutralTemplates = [
      `${query} es una opción a considerar si buscas este tipo de servicio. Tiene pros y contras.`,
      `He probado ${query} y cumple con lo básico. Nada extraordinario pero funciona.`,
      `Mi experiencia con ${query} ha sido normal. Ni excelente ni mala. #Neutral`,
      `${query} ofrece lo que promete, ni más ni menos. Una alternativa aceptable.`,
      `Conoce alguien ${query}? Estoy buscando opiniones sobre esto. #Pregunta`
    ];
    
    const negativeTemplates = [
      `Decepcionado con ${query}. No cumplió mis expectativas en absoluto. #NoRecomiendo`,
      `Tuve una mala experiencia con ${query}. Definitivamente buscaré otras alternativas.`,
      `${query} necesita mejorar urgentemente su servicio. Muchos problemas sin resolver.`,
      `No recomendaría ${query} a nadie. Perdí mi tiempo y dinero. ⚠️ #Advertencia`,
      `${query} tiene el peor servicio que he probado. Evítenlo a toda costa! 👎`
    ];
    
    // Seleccionar plantilla según el sentimiento
    const templates = sentiment === 'positive' ? positiveTemplates : 
                     sentiment === 'negative' ? negativeTemplates : 
                     neutralTemplates;
    
    // Seleccionar una plantilla aleatoria
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Adaptar la plantilla según la plataforma
    switch (platform) {
      case 'twitter':
        return `${template} #ReputaciónOnline`;
      case 'facebook':
        return `${template}

Qué opinan ustedes? Compartan su experiencia!`;
      case 'instagram':
        return `${template}
.
.
.
#${mainWord} #Colombia #ReputaciónOnline #Opinión`;
      case 'linkedin':
        return `[Opinión Profesional]

${template}

¿Qué experiencias han tenido ustedes? Interesado en conocer más perspectivas.`;
      case 'tiktok':
        return `${template} #${mainWord} #FYP #ParaTi #Colombia`;
      default:
        return template;
    }
  }
  
  /**
   * Genera una descripción para resultados de base de datos interna
   */
  private generateInternalDescription(query: string, type: string): string {
    switch (type) {
      case 'document':
        return `Documento interno relacionado con ${query}. Contiene información detallada sobre el tema y análisis relevantes para la toma de decisiones.`;
      case 'report':
        return `Reporte de análisis sobre ${query}. Incluye estadísticas, métricas clave y conclusiones basadas en datos recopilados durante el último trimestre.`;
      case 'analysis':
        return `Análisis en profundidad de ${query}. Examina tendencias, patrones y factores clave que afectan el rendimiento y la percepción pública.`;
      case 'user':
        return `Perfil de usuario relacionado con ${query}. Contiene información de contacto, historial de interacciones y preferencias.`;
      case 'file':
        return `Archivo con información sobre ${query}. Incluye datos estructurados y material de referencia para consulta interna.`;
      default:
        return `Elemento relacionado con ${query} en la base de datos interna. Contiene información relevante para el análisis de reputación.`;
    }
  }
  
  /**
   * Genera una descripción para resultados de documentos
   */
  private generateDocumentDescription(query: string, format: string): string {
    switch (format) {
      case 'PDF':
        return `Documento PDF con información completa sobre ${query}. Ideal para presentaciones y distribución oficial.`;
      case 'Excel':
        return `Hoja de cálculo con datos analizados sobre ${query}. Incluye gráficos, tablas dinámicas y análisis estadístico.`;
      case 'Word':
        return `Documento de texto detallando aspectos de ${query}. Contiene análisis, conclusiones y recomendaciones.`;
      case 'PowerPoint':
        return `Presentación sobre ${query} preparada para reuniones ejecutivas. Incluye datos clave y visualizaciones impactantes.`;
      case 'CSV':
        return `Archivo de datos en formato CSV relacionado con ${query}. Contiene información estructurada para análisis avanzado.`;
      default:
        return `Documento digital con información sobre ${query}. Recurso útil para investigación y consulta.`;
    }
  }
  
  /**
   * Obtiene una imagen representativa según el tipo de entidad
   */
  private getImageForType(type: string): string {
    switch (type) {
      case 'document':
        return 'https://cdn-icons-png.flaticon.com/512/2965/2965335.png';
      case 'report':
        return 'https://cdn-icons-png.flaticon.com/512/4301/4301702.png';
      case 'analysis':
        return 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png';
      case 'user':
        return 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png';
      case 'file':
        return 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png';
      default:
        return 'https://cdn-icons-png.flaticon.com/512/1238/1238961.png';
    }
  }
  
  /**
   * Obtiene un icono representativo según el formato de archivo
   */
  private getFormatIcon(format: string): string {
    switch (format) {
      case 'PDF':
        return 'https://cdn-icons-png.flaticon.com/512/337/337946.png';
      case 'Excel':
        return 'https://cdn-icons-png.flaticon.com/512/732/732220.png';
      case 'Word':
        return 'https://cdn-icons-png.flaticon.com/512/732/732226.png';
      case 'PowerPoint':
        return 'https://cdn-icons-png.flaticon.com/512/732/732229.png';
      case 'CSV':
        return 'https://cdn-icons-png.flaticon.com/512/1507/1507469.png';
      default:
        return 'https://cdn-icons-png.flaticon.com/512/2965/2965335.png';
    }
  }

  /**
   * Genera perfiles sociales simulados
   */
  getSimulatedSocialProfiles(entityId: string): SearchResult['socialProfiles'] {
    return {
      facebook: `https://facebook.com/search/top?q=${encodeURIComponent(entityId)}`,
      twitter: `https://twitter.com/search?q=${encodeURIComponent(entityId)}`,
      instagram: `https://www.instagram.com/explore/tags/${encodeURIComponent(entityId.replace(/\s+/g, ''))}`,
      linkedin: `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(entityId)}`,
      website: `https://google.com/search?q=${encodeURIComponent(entityId)}+sitio+oficial`
    };
  }

  /**
   * Genera recomendaciones simuladas
   */
  getSimulatedRecommendations(entityId: string): SearchResult[] {
    const results: SearchResult[] = [];
    
    // Generar recomendaciones aleatorias
    for (let i = 0; i < 3; i++) {
      const id = `rec_${Date.now()}_${i}`;
      const name = `Entidad relacionada con ${entityId} #${i + 1}`;
      
      results.push({
        id,
        name,
        type: 'related',
        description: `Esta entidad está relacionada con ${entityId}`,
        url: `https://example.com/entity/${id}`,
        imageUrl: `https://picsum.photos/200/200?random=${id}`,
        domain: 'example.com',
        ratings: [],
        mentions: [],
        overallScore: Math.floor(Math.random() * 5) + 1,
        overallSentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
        socialProfiles: this.getSimulatedSocialProfiles(name),
        metadata: {
          source: 'simulated',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    return results;
  }

  /**
   * Genera texto de mención simulada
   */
  private generateMentionText(entityId: string, sentiment: 'positive' | 'neutral' | 'negative'): string {
    const positiveTexts = [
      `${entityId} es realmente excelente y supera las expectativas.`,
      `Me encanta ${entityId}, siempre ofrece una calidad excepcional.`,
      `La experiencia con ${entityId} fue increíble, totalmente recomendado.`
    ];
    
    const neutralTexts = [
      `${entityId} es una opción a considerar para ciertas necesidades.`,
      `Mi experiencia con ${entityId} ha sido normal, ni excelente ni mala.`,
      `${entityId} cumple con lo básico, pero no destaca especialmente.`
    ];
    
    const negativeTexts = [
      `No recomendaría ${entityId}, mi experiencia fue decepcionante.`,
      `${entityId} necesita mejorar significativamente su servicio.`,
      `Tuve problemas con ${entityId}, espero que mejoren pronto.`
    ];
    
    const texts = sentiment === 'positive' 
      ? positiveTexts 
      : sentiment === 'negative' 
        ? negativeTexts 
        : neutralTexts;
    
    return texts[Math.floor(Math.random() * texts.length)];
  }

  /**
   * Obtiene resultados de búsqueda simulados
   */
  getSimulatedSearch(query: string): SearchResponse {
    // Crear resultados simulados
    const results: SearchResult[] = [];
    
    // Generar varios resultados simulados (entre 5 y 10)
    const resultCount = Math.floor(Math.random() * 5) + 5;
    for (let i = 0; i < resultCount; i++) {
      const id = `entity_${Date.now()}_${i}`;
      const typeIndex = Math.floor(Math.random() * Object.keys(this.keywordsByType).length);
      const typeKey = Object.keys(this.keywordsByType)[typeIndex] as keyof typeof this.keywordsByType;
      // Asegurarse de que el tipo sea compatible con EntityType
      let type: EntityType | 'reviews' | 'related';
      if (typeKey === 'reviews' || typeKey === 'related') {
        type = typeKey;
      } else {
        // Intentar convertir a EntityType
        const entityType = typeKey as EntityType;
        type = entityType;
      }
      
      // Lista de ubicaciones para metadatos
      const locations = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', '', '', '']; // Algunos valores vacíos para diversidad
      const departments = ['Marketing', 'Ventas', 'Tecnología', 'Finanzas', 'RRHH', '', '', '']; // Algunos valores vacíos para diversidad
      
      // Fecha aleatoria en los últimos 90 días
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));
      
      // Generar título relevante que incluya la consulta
      let name = '';
      if (i % 2 === 0) {
        name = `${query} - ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`;
      } else {
        name = `Información de ${type} sobre ${query}`;
      }
      
      results.push({
        id,
        name: name,
        type,
        description: `Información detallada sobre ${query} y resultados relacionados. Incluye datos relevantes para el análisis de reputación online.`,
        url: `https://example.com/${type}/${id}`,
        imageUrl: `https://picsum.photos/200/200?random=${id}`,
        domain: 'example.com',
        ratings: [],
        mentions: this.getSimulatedMentions(id),
        overallScore: Math.floor(Math.random() * 5) + 1,
        overallSentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
        socialProfiles: this.getSimulatedSocialProfiles(query),
        metadata: {
          source: 'simulated',
          timestamp: date.toISOString(),
          location: locations[Math.floor(Math.random() * locations.length)],
          department: departments[Math.floor(Math.random() * departments.length)],
          author: Math.random() > 0.5 ? `Usuario_${Math.floor(Math.random() * 100)}` : ''
        }
      });
    }
    
    return {
      results,
      totalResults: 50, // Simulamos que hay más resultados disponibles
      timeMs: Math.floor(Math.random() * 500) + 200, // Tiempo de respuesta aleatorio entre 200 y 700ms
      sources: ['web', 'social', 'internal', 'document', 'platform'],
      query,
      message: 'Resultados combinados de múltiples fuentes'
    };
  }
}

// Exportar una instancia del servicio
export const searchService = new SearchService();
