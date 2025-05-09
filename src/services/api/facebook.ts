import { handleApiError, isTokenExpired, formatDate, analyzeSentiment, CommonMention } from './base';

/**
 * Servicio para interactuar con la API de Facebook
 */
export const FacebookService = {
  /**
   * Obtiene menciones del usuario autenticado
   * @param accessToken Token de acceso de Facebook
   * @param expiresAt Timestamp de expiraciu00f3n del token
   * @param count Nu00famero de menciones a obtener
   */
  async getMentions(accessToken: string, expiresAt?: number, count: number = 20): Promise<CommonMention[] | { error: boolean; message: string }> {
    try {
      // Verificar si el token ha expirado
      if (isTokenExpired(expiresAt)) {
        return { error: true, message: 'El token de Facebook ha expirado. Por favor, vuelve a conectar tu cuenta.' };
      }

      // En una implementaciu00f3n real, haru00edamos una llamada a la API de Facebook
      // const response = await fetch(`https://graph.facebook.com/v17.0/me/tagged?fields=id,message,created_time,from,permalink_url,comments.limit(0).summary(true),reactions.limit(0).summary(true)&limit=${count}`, {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
      // const data = await response.json();

      // Por ahora, simulamos datos de menciones
      const mentions = this.generateMockMentions(count);
      return mentions;
    } catch (error) {
      return handleApiError(error, 'Facebook');
    }
  },

  /**
   * Obtiene el perfil del usuario autenticado
   * @param accessToken Token de acceso de Facebook
   * @param expiresAt Timestamp de expiraciu00f3n del token
   */
  async getProfile(accessToken: string, expiresAt?: number): Promise<any | { error: boolean; message: string }> {
    try {
      // Verificar si el token ha expirado
      if (isTokenExpired(expiresAt)) {
        return { error: true, message: 'El token de Facebook ha expirado. Por favor, vuelve a conectar tu cuenta.' };
      }

      // En una implementaciu00f3n real, haru00edamos una llamada a la API de Facebook
      // const response = await fetch('https://graph.facebook.com/v17.0/me?fields=id,name,picture,friends.limit(0).summary(true),posts.limit(0).summary(true)', {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
      // const data = await response.json();

      // Por ahora, simulamos datos de perfil
      return {
        id: 'facebook_user_id',
        name: 'Usuario de Facebook',
        profileImage: 'https://via.placeholder.com/150',
        friendsCount: 850,
        postsCount: 1200,
      };
    } catch (error) {
      return handleApiError(error, 'Facebook');
    }
  },

  /**
   * Genera menciones simuladas para desarrollo
   * @param count Nu00famero de menciones a generar
   */
  generateMockMentions(count: number): CommonMention[] {
    const mentions: CommonMention[] = [];
    const topics = [
      'polu00edtica',
      'campau00f1a electoral',
      'propuestas',
      'debate',
      'elecciones',
      'candidato',
      'votaciu00f3n',
      'congreso',
      'senado',
      'alcaldu00eda',
    ];

    const positiveTemplates = [
      'Me encanta la propuesta de {usuario} sobre {tema}. u00a1Cuenta con mi apoyo!',
      'Felicitaciones a {usuario} por su excelente gestiu00f3n en {tema}. u00a1Sigue adelante!',
      'Gran trabajo de {usuario} abordando {tema}. u00a1Asu00ed se hace!',
      '{usuario} demuestra verdadero compromiso con {tema}. Colombia merece lu00edderes asu00ed.',
      'u00a1Quu00e9 buena iniciativa de {usuario} para mejorar {tema}! Totalmente de acuerdo.',
    ];

    const negativeTemplates = [
      'Decepcionado con {usuario} por su postura sobre {tema}. Esperaba mu00e1s.',
      '{usuario} no cumple sus promesas sobre {tema}. u00a1Ya no mu00e1s mentiras!',
      'Pu00e9sima gestiu00f3n de {usuario} en temas de {tema}. Necesitamos un cambio urgente.',
      'No puedo creer que {usuario} piense asu00ed sobre {tema}. Totalmente equivocado.',
      '{usuario} debe reconsiderar su enfoque sobre {tema}. No estu00e1 funcionando.',
    ];

    const neutralTemplates = [
      'u00bfAlguien sabe quu00e9 opina {usuario} sobre {tema}?',
      'Hoy escuchu00e9 a {usuario} hablar sobre {tema}. Interesante perspectiva.',
      '{usuario} publicu00f3 algo sobre {tema}. u00bfQuu00e9 opinan?',
      'Acabo de ver la publicaciu00f3n de {usuario} sobre {tema}.',
      'Me gustaru00eda saber mu00e1s sobre la posiciu00f3n de {usuario} en {tema}.',
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
      
      content = content.replace('{usuario}', 'Candidato Ejemplo').replace('{tema}', randomTopic);
      
      const likes = Math.floor(Math.random() * 150);
      const comments = Math.floor(Math.random() * 30);
      const shares = Math.floor(Math.random() * 40);
      
      const mention: CommonMention = {
        id: `facebook_mention_${i}_${Date.now()}`,
        platform: 'facebook',
        author: {
          id: `facebook_user_${i}`,
          name: `Usuario Facebook ${i}`,
          username: `usuario.facebook.${i}`,
          profileUrl: `https://facebook.com/usuario.facebook.${i}`,
          profileImage: `https://via.placeholder.com/50?text=FB${i}`,
        },
        content,
        date: randomDate.toISOString(),
        formattedDate: formatDate(randomDate.toISOString()),
        url: `https://facebook.com/posts/${i}${Date.now()}`,
        engagement: {
          likes,
          comments,
          shares,
        },
        sentiment: sentimentType,
        media: Math.random() > 0.6 ? [
          {
            type: Math.random() > 0.3 ? 'image' : 'video',
            url: `https://via.placeholder.com/600x400?text=Facebook+Media+${i}`,
          },
        ] : undefined,
        location: Math.random() > 0.7 ? {
          country: 'Colombia',
          city: ['Bogotu00e1', 'Medellu00edn', 'Cali', 'Barranquilla', 'Cartagena'][Math.floor(Math.random() * 5)],
        } : undefined,
      };
      
      mentions.push(mention);
    }
    
    return mentions;
  },
};
