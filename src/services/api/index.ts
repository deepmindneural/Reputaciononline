import { TwitterService } from './twitter';
import { FacebookService } from './facebook';
import { InstagramService } from './instagram';
import { LinkedInService } from './linkedin';
import { CommonMention } from './base';

/**
 * Servicio principal para interactuar con todas las APIs de redes sociales
 */
export const SocialMediaService = {
  /**
   * Obtiene menciones de todas las plataformas conectadas
   * @param session Sesión del usuario con tokens de acceso
   * @param count Número de menciones a obtener por plataforma
   */
  async getAllMentions(session: any, count: number = 20): Promise<{
    mentions: CommonMention[];
    errors: { platform: string; message: string }[];
  }> {
    const mentions: CommonMention[] = [];
    const errors: { platform: string; message: string }[] = [];
    const connectedNetworks = session?.user?.connectedNetworks || [];

    // Obtener menciones de Twitter si está conectado
    if (connectedNetworks.includes('twitter')) {
      try {
        const twitterMentions = await TwitterService.getMentions(
          session.accessToken,
          session.expiresAt,
          count
        );

        if (Array.isArray(twitterMentions)) {
          mentions.push(...twitterMentions);
        } else if (twitterMentions.error) {
          errors.push({
            platform: 'twitter',
            message: twitterMentions.message,
          });
        }
      } catch (error) {
        errors.push({
          platform: 'twitter',
          message: 'Error al obtener menciones de Twitter',
        });
      }
    }

    // Obtener menciones de Facebook si está conectado
    if (connectedNetworks.includes('facebook')) {
      try {
        const facebookMentions = await FacebookService.getMentions(
          session.accessToken,
          session.expiresAt,
          count
        );

        if (Array.isArray(facebookMentions)) {
          mentions.push(...facebookMentions);
        } else if (facebookMentions.error) {
          errors.push({
            platform: 'facebook',
            message: facebookMentions.message,
          });
        }
      } catch (error) {
        errors.push({
          platform: 'facebook',
          message: 'Error al obtener menciones de Facebook',
        });
      }
    }

    // Obtener menciones de Instagram si está conectado
    if (connectedNetworks.includes('instagram')) {
      try {
        const instagramMentions = await InstagramService.getMentions(
          session.accessToken,
          session.expiresAt,
          count
        );

        if (Array.isArray(instagramMentions)) {
          mentions.push(...instagramMentions);
        } else if (instagramMentions.error) {
          errors.push({
            platform: 'instagram',
            message: instagramMentions.message,
          });
        }
      } catch (error) {
        errors.push({
          platform: 'instagram',
          message: 'Error al obtener menciones de Instagram',
        });
      }
    }

    // Obtener menciones de LinkedIn si está conectado
    if (connectedNetworks.includes('linkedin')) {
      try {
        const linkedinMentions = await LinkedInService.getMentions(
          session.accessToken,
          session.expiresAt,
          count
        );

        if (Array.isArray(linkedinMentions)) {
          mentions.push(...linkedinMentions);
        } else if (linkedinMentions.error) {
          errors.push({
            platform: 'linkedin',
            message: linkedinMentions.message,
          });
        }
      } catch (error) {
        errors.push({
          platform: 'linkedin',
          message: 'Error al obtener menciones de LinkedIn',
        });
      }
    }

    // Si no hay redes conectadas, generar menciones simuladas de todas las plataformas
    if (connectedNetworks.length === 0) {
      const twitterMentions = TwitterService.generateMockMentions(Math.floor(count / 4));
      const facebookMentions = FacebookService.generateMockMentions(Math.floor(count / 4));
      const instagramMentions = InstagramService.generateMockMentions(Math.floor(count / 4));
      const linkedinMentions = LinkedInService.generateMockMentions(Math.floor(count / 4));
      
      mentions.push(
        ...twitterMentions,
        ...facebookMentions,
        ...instagramMentions,
        ...linkedinMentions
      );
    }

    // Ordenar menciones por fecha (más recientes primero)
    mentions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { mentions, errors };
  },

  /**
   * Obtiene el perfil de usuario de una plataforma específica
   * @param platform Plataforma (twitter, facebook, instagram, linkedin)
   * @param session Sesión del usuario con tokens de acceso
   */
  async getProfile(platform: string, session: any): Promise<any> {
    if (!session?.accessToken) {
      return { error: true, message: 'No hay sesión activa' };
    }

    switch (platform) {
      case 'twitter':
        return TwitterService.getProfile(session.accessToken, session.expiresAt);
      case 'facebook':
        return FacebookService.getProfile(session.accessToken, session.expiresAt);
      case 'instagram':
        return InstagramService.getProfile(session.accessToken, session.expiresAt);
      case 'linkedin':
        return LinkedInService.getProfile(session.accessToken, session.expiresAt);
      default:
        return { error: true, message: 'Plataforma no soportada' };
    }
  },

  /**
   * Obtiene estadísticas de menciones por plataforma, sentimiento, etc.
   * @param mentions Lista de menciones
   */
  getStatistics(mentions: CommonMention[]): any {
    if (!mentions || mentions.length === 0) {
      return {
        total: 0,
        byPlatform: {},
        bySentiment: {},
        byDate: {},
        topLocations: [],
      };
    }

    // Estadísticas por plataforma
    const byPlatform = mentions.reduce((acc, mention) => {
      acc[mention.platform] = (acc[mention.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Estadísticas por sentimiento
    const bySentiment = mentions.reduce((acc, mention) => {
      acc[mention.sentiment] = (acc[mention.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Estadísticas por fecha (agrupadas por día)
    const byDate = mentions.reduce((acc, mention) => {
      const date = new Date(mention.date).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top ubicaciones
    const locations: Record<string, number> = {};
    mentions.forEach(mention => {
      if (mention.location?.city) {
        const locationKey = `${mention.location.city}, ${mention.location.country || 'Colombia'}`;
        locations[locationKey] = (locations[locationKey] || 0) + 1;
      }
    });

    const topLocations = Object.entries(locations)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total: mentions.length,
      byPlatform,
      bySentiment,
      byDate,
      topLocations,
    };
  },

  /**
   * Filtra menciones por varios criterios
   * @param mentions Lista de menciones
   * @param filters Filtros a aplicar
   */
  filterMentions(mentions: CommonMention[], filters: {
    platforms?: string[];
    sentiment?: string[];
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): CommonMention[] {
    return mentions.filter(mention => {
      // Filtrar por plataforma
      if (filters.platforms && filters.platforms.length > 0) {
        if (!filters.platforms.includes(mention.platform)) {
          return false;
        }
      }

      // Filtrar por sentimiento
      if (filters.sentiment && filters.sentiment.length > 0) {
        if (!filters.sentiment.includes(mention.sentiment)) {
          return false;
        }
      }

      // Filtrar por fecha desde
      if (filters.dateFrom) {
        const mentionDate = new Date(mention.date).getTime();
        const fromDate = new Date(filters.dateFrom).getTime();
        if (mentionDate < fromDate) {
          return false;
        }
      }

      // Filtrar por fecha hasta
      if (filters.dateTo) {
        const mentionDate = new Date(mention.date).getTime();
        const toDate = new Date(filters.dateTo).getTime() + 86400000; // Añadir un día para incluir el día seleccionado
        if (mentionDate > toDate) {
          return false;
        }
      }

      // Filtrar por búsqueda de texto
      if (filters.search && filters.search.trim() !== '') {
        const searchLower = filters.search.toLowerCase();
        const contentLower = mention.content.toLowerCase();
        const authorNameLower = mention.author.name.toLowerCase();
        const authorUsernameLower = mention.author.username?.toLowerCase() || '';
        
        return (
          contentLower.includes(searchLower) ||
          authorNameLower.includes(searchLower) ||
          authorUsernameLower.includes(searchLower)
        );
      }

      return true;
    });
  },
};

// Exportar todos los servicios
export { TwitterService, FacebookService, InstagramService, LinkedInService };
export * from './base';
