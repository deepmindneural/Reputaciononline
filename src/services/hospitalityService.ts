/**
 * Servicio para monitoreo de plataformas de hospedaje (AirBnb, Booking, TripAdvisor)
 */

export type HospitalityPlatform = 'airbnb' | 'booking' | 'tripadvisor';
export type PropertyType = 'hotel' | 'apartment' | 'house' | 'room';
export type ReviewSentiment = 'positive' | 'neutral' | 'negative';

export interface HospitalityProperty {
  id: string;
  name: string;
  description?: string;
  externalId?: string;
  platform: HospitalityPlatform;
  address?: string;
  propertyType?: PropertyType;
  averageRating?: number;
  totalReviews: number;
  imageUrl?: string;
  originalUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HospitalityReview {
  id: string;
  propertyId: string;
  platform: HospitalityPlatform;
  author: string;
  content: string;
  rating: number;
  date: string;
  responseContent?: string;
  responseDate?: string;
  sentiment?: ReviewSentiment;
  tags?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyAnalytics {
  totalReviews: number;
  averageRating: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  platforms: Record<string, {
    count: number;
    avgRating: number;
  }>;
  timeline: Array<{
    date: string;
    avgRating: number;
    count: number;
  }>;
  period: string;
}

class HospitalityService {
  private apiUrl: string;
  
  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }
  
  // Función auxiliar para realizar peticiones con token de autenticación
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    // En producción, obtener el token del almacenamiento local o contexto
    const token = localStorage.getItem('authToken') || '';
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };
    
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        ...options,
        headers
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }
      
      return data;
    } catch (error) {
      console.error('Error en fetchWithAuth:', error);
      throw error;
    }
  }
  
  // Obtener todas las propiedades
  async getProperties(filters?: { platform?: HospitalityPlatform, status?: 'active' | 'inactive' }): Promise<{ properties: HospitalityProperty[] }> {
    // Cuando la API esté lista, usar esto:
    // let queryParams = '';
    // if (filters) {
    //   const params = new URLSearchParams();
    //   if (filters.platform) params.append('platform', filters.platform);
    //   if (filters.status) params.append('status', filters.status);
    //   queryParams = `?${params.toString()}`;
    // }
    // return this.fetchWithAuth(`/api/hospitality/properties${queryParams}`);
    
    // Mientras tanto, datos simulados
    const properties: HospitalityProperty[] = [
      {
        id: '1',
        name: 'Hotel Boutique Centro Histórico',
        description: 'Hermoso hotel boutique ubicado en el corazón del centro histórico',
        platform: 'booking',
        address: 'Calle 10 #5-20, Cartagena',
        propertyType: 'hotel',
        averageRating: 4.7,
        totalReviews: 120,
        imageUrl: 'https://example.com/hotel-image.jpg',
        originalUrl: 'https://booking.com/hotel-boutique',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Apartamento Premium Zona Rosa',
        description: 'Apartamento de lujo con vista panorámica',
        platform: 'airbnb',
        address: 'Calle 85 #11-20, Bogotá',
        propertyType: 'apartment',
        averageRating: 4.8,
        totalReviews: 87,
        imageUrl: 'https://example.com/apartment-image.jpg',
        originalUrl: 'https://airbnb.com/premium-apartment',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Casa Colonial Parque Lleras',
        description: 'Hermosa casa colonial cerca al Parque Lleras',
        platform: 'tripadvisor',
        address: 'Carrera 37 #10-20, Medellín',
        propertyType: 'house',
        averageRating: 4.3,
        totalReviews: 45,
        imageUrl: 'https://example.com/house-image.jpg',
        originalUrl: 'https://tripadvisor.com/colonial-house',
        active: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Habitación en el Eje Cafetero',
        description: 'Habitación con vista a las montañas del Eje Cafetero',
        platform: 'airbnb',
        address: 'Vereda El Rosario, Salento',
        propertyType: 'room',
        averageRating: 4.9,
        totalReviews: 32,
        imageUrl: 'https://example.com/room-image.jpg',
        originalUrl: 'https://airbnb.com/coffee-region-room',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Aplicar filtros
    if (filters) {
      return { 
        properties: properties.filter(p => {
          if (filters.platform && p.platform !== filters.platform) return false;
          if (filters.status === 'active' && !p.active) return false;
          if (filters.status === 'inactive' && p.active) return false;
          return true;
        })
      };
    }
    
    return { properties };
  }
  
  // Obtener propiedad por ID
  async getPropertyById(propertyId: string): Promise<{ property: HospitalityProperty & { reviews: HospitalityReview[] } }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth(`/api/hospitality/properties/${propertyId}`);
    
    // Mientras tanto, datos simulados
    const property: HospitalityProperty = {
      id: propertyId,
      name: 'Hotel Boutique Centro Histórico',
      description: 'Hermoso hotel boutique ubicado en el corazón del centro histórico',
      platform: 'booking',
      address: 'Calle 10 #5-20, Cartagena',
      propertyType: 'hotel',
      averageRating: 4.7,
      totalReviews: 120,
      imageUrl: 'https://example.com/hotel-image.jpg',
      originalUrl: 'https://booking.com/hotel-boutique',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const reviews: HospitalityReview[] = [
      {
        id: '1',
        propertyId,
        platform: 'booking',
        author: 'Juan Pérez',
        content: 'Excelente hotel, muy bien ubicado y con un servicio de primera.',
        rating: 5,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        sentiment: 'positive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        propertyId,
        platform: 'booking',
        author: 'María Rodríguez',
        content: 'Buena ubicación, pero la habitación era un poco pequeña.',
        rating: 4,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        responseContent: 'Gracias por sus comentarios, tomaremos en cuenta sus observaciones.',
        responseDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        sentiment: 'neutral',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        propertyId,
        platform: 'booking',
        author: 'Carlos Gómez',
        content: 'Mala experiencia. El aire acondicionado no funcionaba y el personal no fue amable.',
        rating: 2,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        responseContent: 'Lamentamos su experiencia, hemos tomado medidas para corregir estos problemas.',
        responseDate: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
        sentiment: 'negative',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    return { property: { ...property, reviews } };
  }
  
  // Añadir o actualizar propiedad
  async upsertProperty(propertyData: Partial<HospitalityProperty> & { name: string, platform: HospitalityPlatform }): Promise<{ property: HospitalityProperty }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth('/api/hospitality/properties', {
    //   method: 'POST',
    //   body: JSON.stringify(propertyData)
    // });
    
    // Mientras tanto, datos simulados
    return {
      property: {
        id: propertyData.id || Math.random().toString(36).substring(7),
        name: propertyData.name,
        description: propertyData.description || '',
        platform: propertyData.platform,
        address: propertyData.address || '',
        propertyType: propertyData.propertyType || 'hotel',
        averageRating: propertyData.averageRating || 0,
        totalReviews: propertyData.totalReviews || 0,
        imageUrl: propertyData.imageUrl || '',
        originalUrl: propertyData.originalUrl || '',
        active: propertyData.active !== undefined ? propertyData.active : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }
  
  // Eliminar propiedad
  async deleteProperty(propertyId: string): Promise<{ message: string }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth(`/api/hospitality/properties/${propertyId}`, {
    //   method: 'DELETE'
    // });
    
    // Mientras tanto, datos simulados
    return { message: 'Propiedad eliminada correctamente' };
  }
  
  // Obtener reseñas de una propiedad
  async getPropertyReviews(propertyId: string, filters?: { 
    page?: number, 
    limit?: number, 
    sentiment?: ReviewSentiment 
  }): Promise<{ 
    reviews: HospitalityReview[], 
    pagination: { page: number, limit: number, totalItems: number, totalPages: number } 
  }> {
    // Cuando la API esté lista, usar esto:
    // let queryParams = '';
    // if (filters) {
    //   const params = new URLSearchParams();
    //   if (filters.page) params.append('page', filters.page.toString());
    //   if (filters.limit) params.append('limit', filters.limit.toString());
    //   if (filters.sentiment) params.append('sentiment', filters.sentiment);
    //   queryParams = `?${params.toString()}`;
    // }
    // return this.fetchWithAuth(`/api/hospitality/properties/${propertyId}/reviews${queryParams}`);
    
    // Mientras tanto, datos simulados
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    
    const allReviews: HospitalityReview[] = Array.from({ length: 35 }).map((_, i) => {
      const sentiment: ReviewSentiment[] = ['positive', 'neutral', 'negative'];
      const randomSentiment = sentiment[Math.floor(Math.random() * sentiment.length)];
      const rating = randomSentiment === 'positive' ? 4 + Math.random() : 
                    randomSentiment === 'neutral' ? 3 + Math.random() : 1 + Math.random();
      
      return {
        id: (i + 1).toString(),
        propertyId,
        platform: ['airbnb', 'booking', 'tripadvisor'][Math.floor(Math.random() * 3)] as HospitalityPlatform,
        author: `Usuario ${i + 1}`,
        content: randomSentiment === 'positive' ? 'Excelente propiedad, muy recomendada.' :
                randomSentiment === 'neutral' ? 'Buena propiedad, aunque podría mejorar algunos aspectos.' :
                'No cumplió con mis expectativas, hay mejores opciones.',
        rating: Math.floor(rating * 10) / 10,
        date: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
        sentiment: randomSentiment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });
    
    // Aplicar filtros
    let filteredReviews = allReviews;
    if (filters?.sentiment) {
      filteredReviews = filteredReviews.filter(r => r.sentiment === filters.sentiment);
    }
    
    // Paginación
    const totalItems = filteredReviews.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);
    
    return {
      reviews: paginatedReviews,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages
      }
    };
  }
  
  // Añadir o actualizar reseña
  async upsertReview(reviewData: Partial<HospitalityReview> & { 
    propertyId: string,
    author: string, 
    content: string, 
    rating: number, 
    date: string, 
    platform: HospitalityPlatform 
  }): Promise<{ review: HospitalityReview }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth('/api/hospitality/reviews', {
    //   method: 'POST',
    //   body: JSON.stringify(reviewData)
    // });
    
    // Mientras tanto, datos simulados
    return {
      review: {
        id: reviewData.id || Math.random().toString(36).substring(7),
        propertyId: reviewData.propertyId,
        author: reviewData.author,
        content: reviewData.content,
        rating: reviewData.rating,
        date: reviewData.date,
        platform: reviewData.platform,
        responseContent: reviewData.responseContent,
        responseDate: reviewData.responseDate,
        sentiment: this.determineSentiment(reviewData.rating),
        tags: reviewData.tags || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }
  
  // Responder a una reseña
  async respondToReview(reviewId: string, responseContent: string): Promise<{ review: HospitalityReview }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth(`/api/hospitality/reviews/${reviewId}/respond`, {
    //   method: 'POST',
    //   body: JSON.stringify({ responseContent })
    // });
    
    // Mientras tanto, datos simulados
    return {
      review: {
        id: reviewId,
        propertyId: '1',
        platform: 'booking',
        author: 'Juan Pérez',
        content: 'Excelente hotel, muy bien ubicado y con un servicio de primera.',
        rating: 5,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        responseContent,
        responseDate: new Date().toISOString(),
        sentiment: 'positive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }
  
  // Obtener análisis y métricas
  async getAnalytics(filters?: { propertyId?: string, period?: 'week' | 'month' | 'quarter' | 'year' }): Promise<{ analytics: PropertyAnalytics }> {
    // Cuando la API esté lista, usar esto:
    // let queryParams = '';
    // if (filters) {
    //   const params = new URLSearchParams();
    //   if (filters.propertyId) params.append('propertyId', filters.propertyId);
    //   if (filters.period) params.append('period', filters.period);
    //   queryParams = `?${params.toString()}`;
    // }
    // return this.fetchWithAuth(`/api/hospitality/analytics${queryParams}`);
    
    // Mientras tanto, datos simulados
    const period = filters?.period || 'month';
    
    return {
      analytics: {
        totalReviews: 120,
        averageRating: 4.3,
        sentiment: {
          positive: 78,
          neutral: 32,
          negative: 10
        },
        platforms: {
          'airbnb': {
            count: 45,
            avgRating: 4.5
          },
          'booking': {
            count: 65,
            avgRating: 4.2
          },
          'tripadvisor': {
            count: 10,
            avgRating: 4.0
          }
        },
        timeline: this.generateTimelineData(period),
        period
      }
    };
  }
  
  // Sincronizar reseñas (simulado)
  async syncReviews(syncData: { propertyId: string, platform: HospitalityPlatform }): Promise<{ 
    message: string, 
    reviews: HospitalityReview[] 
  }> {
    // Cuando la API esté lista, usar esto:
    // return this.fetchWithAuth('/api/hospitality/sync', {
    //   method: 'POST',
    //   body: JSON.stringify(syncData)
    // });
    
    // Mientras tanto, datos simulados
    const reviews: HospitalityReview[] = Array.from({ length: 5 }).map((_, i) => {
      const sentiment: ReviewSentiment[] = ['positive', 'neutral', 'negative'];
      const randomSentiment = sentiment[Math.floor(Math.random() * sentiment.length)];
      const rating = randomSentiment === 'positive' ? 4 + Math.random() : 
                    randomSentiment === 'neutral' ? 3 + Math.random() : 1 + Math.random();
      
      return {
        id: Math.random().toString(36).substring(7),
        propertyId: syncData.propertyId,
        platform: syncData.platform,
        author: `Usuario Sincronizado ${i + 1}`,
        content: randomSentiment === 'positive' ? 'Excelente propiedad, muy recomendada.' :
                randomSentiment === 'neutral' ? 'Buena propiedad, aunque podría mejorar algunos aspectos.' :
                'No cumplió con mis expectativas, hay mejores opciones.',
        rating: Math.floor(rating * 10) / 10,
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        sentiment: randomSentiment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });
    
    return {
      message: `5 reseñas sincronizadas correctamente desde ${syncData.platform}`,
      reviews
    };
  }
  
  // Generar datos de línea de tiempo para gráficos
  private generateTimelineData(period: string): Array<{ date: string, avgRating: number, count: number }> {
    const today = new Date();
    const data: Array<{ date: string, avgRating: number, count: number }> = [];
    
    let numDays = 30; // Por defecto, un mes
    
    switch (period) {
      case 'week':
        numDays = 7;
        break;
      case 'month':
        numDays = 30;
        break;
      case 'quarter':
        numDays = 90;
        break;
      case 'year':
        numDays = 365;
        break;
    }
    
    // Generar datos diarios para períodos cortos
    if (period === 'week' || period === 'month') {
      for (let i = numDays - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          avgRating: 3.5 + Math.random() * 1.5,
          count: Math.floor(Math.random() * 5) + 1
        });
      }
    } 
    // Generar datos semanales para períodos largos
    else {
      const numWeeks = Math.ceil(numDays / 7);
      
      for (let i = numWeeks - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (i * 7));
        
        data.push({
          date: date.toISOString().split('T')[0],
          avgRating: 3.5 + Math.random() * 1.5,
          count: Math.floor(Math.random() * 15) + 5
        });
      }
    }
    
    return data;
  }
  
  // Determinar sentimiento en base a calificación
  private determineSentiment(rating: number): ReviewSentiment {
    if (rating >= 4) return 'positive';
    if (rating >= 3) return 'neutral';
    return 'negative';
  }
}

export const hospitalityService = new HospitalityService();
