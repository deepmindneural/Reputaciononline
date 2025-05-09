import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { SocialMediaService } from '@/services/api';

/**
 * Endpoint para obtener menciones de redes sociales
 */
export async function GET(req: NextRequest) {
  try {
    // Verificar si el usuario está autenticado
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener parámetros de consulta
    const url = new URL(req.url);
    const count = parseInt(url.searchParams.get('count') || '20');
    const platform = url.searchParams.get('platform') || '';
    
    // Si se especifica una plataforma, obtener solo menciones de esa plataforma
    if (platform && ['twitter', 'facebook', 'instagram', 'linkedin'].includes(platform)) {
      // Verificar si la plataforma está conectada
      const connectedNetworks = session?.user?.connectedNetworks || [];
      if (!connectedNetworks.includes(platform)) {
        return NextResponse.json(
          { error: `La plataforma ${platform} no está conectada` },
          { status: 400 }
        );
      }
      
      // Obtener menciones de la plataforma específica
      const profile = await SocialMediaService.getProfile(platform, session);
      if (profile.error) {
        return NextResponse.json(
          { error: profile.message },
          { status: 400 }
        );
      }
      
      // Obtener menciones según la plataforma
      let mentions;
      const { TwitterService, FacebookService, InstagramService, LinkedInService } = await import('@/services/api');
      
      switch (platform) {
        case 'twitter':
          mentions = await TwitterService.getMentions(
            session.accessToken || '',
            session.expiresAt ? Number(session.expiresAt) : undefined,
            count
          );
          break;
        case 'facebook':
          mentions = await FacebookService.getMentions(
            session.accessToken || '',
            session.expiresAt ? Number(session.expiresAt) : undefined,
            count
          );
          break;
        case 'instagram':
          mentions = await InstagramService.getMentions(
            session.accessToken || '',
            session.expiresAt ? Number(session.expiresAt) : undefined,
            count
          );
          break;
        case 'linkedin':
          mentions = await LinkedInService.getMentions(
            session.accessToken || '',
            session.expiresAt ? Number(session.expiresAt) : undefined,
            count
          );
          break;
        default:
          mentions = [];
      }
      
      if (Array.isArray(mentions)) {
        return NextResponse.json({ mentions, profile });
      } else {
        return NextResponse.json(
          { error: mentions.message },
          { status: 400 }
        );
      }
    }
    
    // Obtener menciones de todas las plataformas conectadas
    const { mentions, errors } = await SocialMediaService.getAllMentions(session, count);
    
    // Obtener estadísticas
    const statistics = SocialMediaService.getStatistics(mentions);
    
    return NextResponse.json({
      mentions,
      statistics,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error al obtener menciones:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
