import { signIn, signOut, getSession } from 'next-auth/react';

type Platform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok';

interface SocialToken {
  id: string;
  platform: Platform;
  token: string;
  expiresAt: number;
  userId: string;
}

// Mapeo de plataformas a proveedores de NextAuth
const platformToProvider: Record<Platform, string> = {
  facebook: 'facebook',
  twitter: 'twitter',
  instagram: 'instagram',
  linkedin: 'linkedin',
  tiktok: 'tiktok',
};

/**
 * Servicio para manejar la autenticaciu00f3n con redes sociales
 */
export const SocialAuthService = {
  /**
   * Inicia el proceso de autenticaciu00f3n con una red social
   * @param platform Plataforma con la que autenticar
   * @returns Promise que resuelve cuando se completa el proceso
   */
  async authenticate(platform: Platform): Promise<void> {
    // En modo de desarrollo, redirigir a la página de espera en lugar de intentar autenticar
    // Esto evita el error 404 cuando las cuentas de desarrollador aún no están aprobadas
    window.location.href = `/conectando-red-social?network=${platform}`;
    
    // Comentado temporalmente hasta que las cuentas de desarrollador estén aprobadas
    // const provider = platformToProvider[platform];
    // await signIn(provider, { callbackUrl: window.location.href });
  },

  /**
   * Cierra la sesiu00f3n con una red social
   * @param platform Plataforma de la que desconectar
   */
  async disconnect(platform: Platform): Promise<void> {
    // Obtener la sesiu00f3n actual
    const session = await getSession();
    
    // Si la sesiu00f3n actual es de la plataforma que queremos desconectar, cerrarla
    if (session?.provider === platformToProvider[platform]) {
      await signOut({ callbackUrl: window.location.href });
    }
    
    // Eliminar el token de la plataforma del almacenamiento
    const savedTokens = localStorage.getItem('socialTokens');
    if (savedTokens) {
      try {
        const tokens: SocialToken[] = JSON.parse(savedTokens);
        const updatedTokens = tokens.filter(token => token.platform !== platform);
        localStorage.setItem('socialTokens', JSON.stringify(updatedTokens));
      } catch (e) {
        console.error('Error al desconectar la plataforma:', e);
      }
    }
  },

  /**
   * Guarda un token de acceso en el almacenamiento local
   * @param platform Plataforma del token
   * @param token Token de acceso
   * @param expiresAt Timestamp de expiraciu00f3n
   * @param userId ID del usuario
   */
  saveToken(platform: Platform, token: string, expiresAt: number, userId: string): void {
    const savedTokens = localStorage.getItem('socialTokens');
    let tokens: SocialToken[] = [];
    
    if (savedTokens) {
      try {
        tokens = JSON.parse(savedTokens);
        // Reemplazar el token si ya existe uno para esta plataforma
        tokens = tokens.filter(t => t.platform !== platform);
      } catch (e) {
        console.error('Error parsing social tokens:', e);
      }
    }
    
    tokens.push({
      id: `${platform}-${Date.now()}`,
      platform,
      token,
      expiresAt,
      userId
    });
    
    localStorage.setItem('socialTokens', JSON.stringify(tokens));
  },

  /**
   * Obtiene los tokens guardados para todas las plataformas
   * @returns Array de tokens sociales
   */
  getTokens(): SocialToken[] {
    const savedTokens = localStorage.getItem('socialTokens');
    if (savedTokens) {
      try {
        return JSON.parse(savedTokens);
      } catch (e) {
        console.error('Error parsing social tokens:', e);
      }
    }
    return [];
  },

  /**
   * Verifica quu00e9 plataformas estu00e1n conectadas
   * @returns Objeto con el estado de conexiu00f3n de cada plataforma
   */
  getConnectedPlatforms(): Record<Platform, boolean> {
    const connected = {
      facebook: false,
      twitter: false,
      instagram: false,
      linkedin: false,
      tiktok: false
    } as Record<Platform, boolean>;
    
    const tokens = this.getTokens();
    tokens.forEach(token => {
      connected[token.platform] = true;
    });
    
    return connected;
  },

  /**
   * Verifica si una plataforma estu00e1 conectada
   * @param platform Plataforma a verificar
   * @returns true si estu00e1 conectada, false en caso contrario
   */
  isPlatformConnected(platform: Platform): boolean {
    const tokens = this.getTokens();
    return tokens.some(token => token.platform === platform);
  }
};

export default SocialAuthService;
