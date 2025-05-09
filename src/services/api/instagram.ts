import { handleApiError, isTokenExpired, formatDate, analyzeSentiment, CommonMention } from './base';

/**
 * Servicio para interactuar con la API de Instagram
 */
export const InstagramService = {
  /**
   * Obtiene menciones del usuario autenticado
   * @param accessToken Token de acceso de Instagram
   * @param expiresAt Timestamp de expiraciu00f3n del token
   * @param count Nu00famero de menciones a obtener
   */
  async getMentions(accessToken: string, expiresAt?: number, count: number = 20): Promise<CommonMention[] | { error: boolean; message: string }> {
    try {
      // Verificar si el token ha expirado
      if (isTokenExpired(expiresAt)) {
        return { error: true, message: 'El token de Instagram ha expirado. Por favor, vuelve a conectar tu cuenta.' };
      }

      // En una implementaciu00f3n real, haru00edamos una llamada a la API de Instagram (a travu00e9s de la Graph API de Facebook)
      // const response = await fetch(`https://graph.instagram.com/me/tags?fields=id,caption,media_url,permalink,timestamp,username,comments_count,like_count&limit=${count}`, {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
      // const data = await response.json();

      // Por ahora, simulamos datos de menciones
      const mentions = this.generateMockMentions(count);
      return mentions;
    } catch (error) {
      return handleApiError(error, 'Instagram');
    }
  },

  /**
   * Obtiene el perfil del usuario autenticado
   * @param accessToken Token de acceso de Instagram
   * @param expiresAt Timestamp de expiraciu00f3n del token
   */
  async getProfile(accessToken: string, expiresAt?: number): Promise<any | { error: boolean; message: string }> {
    try {
      // Verificar si el token ha expirado
      if (isTokenExpired(expiresAt)) {
        return { error: true, message: 'El token de Instagram ha expirado. Por favor, vuelve a conectar tu cuenta.' };
      }

      // En una implementaciu00f3n real, haru00edamos una llamada a la API de Instagram
      // const response = await fetch('https://graph.instagram.com/me?fields=id,username,account_type,media_count', {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
      // const data = await response.json();

      // Por ahora, simulamos datos de perfil
      return {
        id: 'instagram_user_id',
        username: 'usuario_instagram',
        accountType: 'PERSONAL',
        mediaCount: 320,
        followersCount: 2500,
        followingCount: 650,
        profileImage: 'https://via.placeholder.com/150',
      };
    } catch (error) {
      return handleApiError(error, 'Instagram');
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
      'campau00f1a',
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
      'u00a1Gran evento con {usuario} hablando de {tema}! u2728 #Inspirador',
      'Apoyando a {usuario} en su campau00f1a por {tema} u2764ufe0f #VamosPorMu00e1s',
      'Orgulloso de trabajar junto a {usuario} por un mejor {tema} u2705 #Comprometidos',
      '{usuario} tiene las mejores propuestas para {tema} u2728 #FuturoPrometedor',
      'Momentos inspiradores con {usuario} discutiendo sobre {tema} u2764ufe0f #LiderazgoPositivo',
    ];

    const negativeTemplates = [
      'Decepcionado con las propuestas de {usuario} sobre {tema} u274c #NoConvence',
      '{usuario} debe explicar su posiciu00f3n sobre {tema} u26a0ufe0f #Transparencia',
      'No estoy de acuerdo con {usuario} en temas de {tema} u274c #OtrasPropuestas',
      'Preocupante la posiciu00f3n de {usuario} frente a {tema} u26a0ufe0f #AlertaRoja',
      '{usuario} evita hablar claramente sobre {tema} u274c #SinRespuestas',
    ];

    const neutralTemplates = [
      'Hoy en el evento de {usuario} hablando sobre {tema} u2139ufe0f #Informaciu00f3n',
      'Escuchando las propuestas de {usuario} sobre {tema} u2753 #Analizando',
      '{usuario} presentu00f3 su plan para {tema} u2139ufe0f #Noticias',
      'Debate interesante con {usuario} sobre {tema} u2753 #Reflexiones',
      'Conociendo mu00e1s sobre la visiiu00f3n de {usuario} para {tema} u2139ufe0f #Actualidad',
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
      
      content = content.replace('{usuario}', '@candidato_oficial').replace('{tema}', randomTopic);
      
      const likes = Math.floor(Math.random() * 300);
      const comments = Math.floor(Math.random() * 50);
      
      const mention: CommonMention = {
        id: `instagram_mention_${i}_${Date.now()}`,
        platform: 'instagram',
        author: {
          id: `instagram_user_${i}`,
          name: `Usuario Instagram ${i}`,
          username: `usuario.insta.${i}`,
          profileUrl: `https://instagram.com/usuario.insta.${i}`,
          profileImage: `https://via.placeholder.com/50?text=IG${i}`,
        },
        content,
        date: randomDate.toISOString(),
        formattedDate: formatDate(randomDate.toISOString()),
        url: `https://instagram.com/p/${i}${Date.now().toString(36)}`,
        engagement: {
          likes,
          comments,
        },
        sentiment: sentimentType,
        media: Math.random() > 0.2 ? [
          {
            type: Math.random() > 0.4 ? 'image' : 'video',
            url: `https://via.placeholder.com/1080x1080?text=Instagram+Media+${i}`,
          },
        ] : undefined,
        location: Math.random() > 0.5 ? {
          country: 'Colombia',
          city: ['Bogotu00e1', 'Medellu00edn', 'Cali', 'Barranquilla', 'Cartagena'][Math.floor(Math.random() * 5)],
        } : undefined,
      };
      
      mentions.push(mention);
    }
    
    return mentions;
  },
};
