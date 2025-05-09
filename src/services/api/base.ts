/**
 * Servicio base para APIs de redes sociales
 * Contiene funciones comunes para todas las APIs
 */

// Función para manejar errores de API
export const handleApiError = (error: any, platform: string) => {
  console.error(`Error en API de ${platform}:`, error);
  return {
    error: true,
    message: `Error al conectar con ${platform}: ${error.message || 'Error desconocido'}`,
    status: error.status || 500,
  };
};

// Función para verificar si un token ha expirado
export const isTokenExpired = (expiresAt: number | undefined): boolean => {
  if (!expiresAt) return true;
  return Date.now() >= expiresAt * 1000;
};

// Función para formatear fechas
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Función para analizar sentimiento (simulado)
export const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
  // En una implementación real, esto usaría un modelo de NLP
  const positiveWords = ['bueno', 'excelente', 'genial', 'increíble', 'feliz', 'contento', 'gracias', 'amor', 'like'];
  const negativeWords = ['malo', 'terrible', 'horrible', 'pésimo', 'triste', 'enojado', 'odio', 'fracaso', 'problema'];
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

// Interfaz común para menciones de todas las plataformas
export interface CommonMention {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
  author: {
    id: string;
    name: string;
    username?: string;
    profileUrl?: string;
    profileImage?: string;
  };
  content: string;
  date: string;
  formattedDate: string;
  url?: string;
  engagement?: {
    likes: number;
    comments: number;
    shares?: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
  location?: {
    country?: string;
    city?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}
