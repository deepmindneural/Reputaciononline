import { handleApiError, isTokenExpired, formatDate, analyzeSentiment, CommonMention } from './base';

/**
 * Servicio para interactuar con la API de Twitter (X)
 */
export const TwitterService = {
  /**
   * Obtiene menciones del usuario autenticado
   * @param accessToken Token de acceso de Twitter
   * @param expiresAt Timestamp de expiración del token
   * @param count Número de menciones a obtener
   */
  async getMentions(accessToken: string, expiresAt?: number, count: number = 20): Promise<CommonMention[] | { error: boolean; message: string }> {
    try {
      // Verificar si el token ha expirado
      if (isTokenExpired(expiresAt)) {
        return { error: true, message: 'El token de Twitter ha expirado. Por favor, vuelve a conectar tu cuenta.' };
      }

      // En una implementación real, haríamos una llamada a la API de Twitter
      // const response = await fetch(`https://api.twitter.com/2/users/me/mentions?max_results=${count}`, {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
      // const data = await response.json();

      // Por ahora, simulamos datos de menciones
      const mentions = this.generateMockMentions(count);
      return mentions;
    } catch (error) {
      return handleApiError(error, 'Twitter');
    }
  },

  /**
   * Obtiene el perfil del usuario autenticado
   * @param accessToken Token de acceso de Twitter
   * @param expiresAt Timestamp de expiración del token
   */
  async getProfile(accessToken: string, expiresAt?: number): Promise<any | { error: boolean; message: string }> {
    try {
      // Verificar si el token ha expirado
      if (isTokenExpired(expiresAt)) {
        return { error: true, message: 'El token de Twitter ha expirado. Por favor, vuelve a conectar tu cuenta.' };
      }

      // En una implementación real, haríamos una llamada a la API de Twitter
      // const response = await fetch('https://api.twitter.com/2/users/me', {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
      // const data = await response.json();

      // Por ahora, simulamos datos de perfil
      return {
        id: 'twitter_user_id',
        name: 'Usuario de Twitter',
        username: '@usuariotwitter',
        profileImage: 'https://via.placeholder.com/150',
        followersCount: 1250,
        followingCount: 450,
        tweetCount: 3200,
      };
    } catch (error) {
      return handleApiError(error, 'Twitter');
    }
  },

  /**
   * Genera menciones simuladas para desarrollo
   * @param count Número de menciones a generar
   */
  generateMockMentions(count: number): CommonMention[] {
    const mentions: CommonMention[] = [];
    const topics = [
      'política',
      'campaña electoral',
      'propuestas',
      'debate',
      'elecciones',
      'candidato',
      'votación',
      'congreso',
      'senado',
      'alcaldía',
    ];

    const positiveTemplates = [
      'Me gusta mucho la propuesta de {usuario} sobre {tema}. ¡Tiene mi voto!',
      '¡Excelente intervención de {usuario} en el debate sobre {tema}!',
      'Apoyo totalmente a {usuario} en su postura sobre {tema}. #BuenTrabajo',
      '{usuario} demuestra liderazgo en temas de {tema}. Colombia necesita más personas así.',
      'Felicitaciones a {usuario} por su compromiso con {tema}. ¡Seguimos adelante!',
    ];

    const negativeTemplates = [
      'No estoy de acuerdo con {usuario} sobre {tema}. Falta más profundidad.',
      '{usuario} debería reconsiderar su posición sobre {tema}. Muy decepcionante.',
      'Terrible propuesta de {usuario} respecto a {tema}. ¿Alguien más piensa igual?',
      '{usuario} no tiene idea de lo que habla cuando se refiere a {tema}. #NoConvence',
      'Me preocupa la falta de claridad de {usuario} en temas de {tema}. Necesitamos mejores líderes.',
    ];

    const neutralTemplates = [
      '¿Alguien sabe cuál es la postura de {usuario} sobre {tema}?',
      'Interesante lo que plantea {usuario} sobre {tema}. Quiero saber más.',
      '{usuario} habló hoy sobre {tema}. ¿Qué opinan ustedes?',
      'Estuve en el evento de {usuario} donde habló de {tema}.',
      'Acabo de leer sobre la propuesta de {usuario} para {tema}.',
    ];

    for (let i = 0; i < count; i++) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
      const sentimentType = Math.random() < 0.33 ? 'negative' : (Math.random() < 0.66 ? 'positive' : 'neutral');
      
      let content = '';
      if (sentimentType === 'positive') {
        content = positiveTemplates[Math.floor(Math.random() * positiveTemplates.length)];
      } else if (sentimentType === 'negative') {
        content = negativeTemplates[Math.floor(Math.random() * negativeTemplates.length)];
      } else {
        content = neutralTemplates[Math.floor(Math.random() * neutralTemplates.length)];
      }
      
      content = content.replace('{usuario}', '@candidato').replace('{tema}', randomTopic);
      
      const likes = Math.floor(Math.random() * 100);
      const comments = Math.floor(Math.random() * 20);
      const shares = Math.floor(Math.random() * 30);
      
      const mention: CommonMention = {
        id: `twitter_mention_${i}_${Date.now()}`,
        platform: 'twitter',
        author: {
          id: `twitter_user_${i}`,
          name: `Usuario Twitter ${i}`,
          username: `@usuario${i}`,
          profileUrl: `https://twitter.com/usuario${i}`,
          profileImage: `https://via.placeholder.com/50?text=User${i}`,
        },
        content,
        date: randomDate.toISOString(),
        formattedDate: formatDate(randomDate.toISOString()),
        url: `https://twitter.com/usuario${i}/status/${i}${Date.now()}`,
        engagement: {
          likes,
          comments,
          shares,
        },
        sentiment: sentimentType,
        media: Math.random() > 0.7 ? [
          {
            type: Math.random() > 0.5 ? 'image' : 'video',
            url: `https://via.placeholder.com/500x300?text=Twitter+Media+${i}`,
          },
        ] : undefined,
        location: Math.random() > 0.6 ? {
          country: 'Colombia',
          city: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'][Math.floor(Math.random() * 5)],
        } : undefined,
      };
      
      mentions.push(mention);
    }
    
    return mentions;
  },
};
