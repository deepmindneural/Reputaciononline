"use client";

import { useState, useEffect } from 'react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaCheck,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';
import { useSession } from 'next-auth/react';
import SocialAuthService from '@/services/socialAuth';

type Platform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok';

interface SocialMediaAuthProps {
  onSuccess?: (platform: Platform, token: any) => void;
  onError?: (platform: Platform, error: any) => void;
  showTitle?: boolean;
  className?: string;
  buttonVariant?: 'full' | 'compact';
}

export default function SocialMediaAuth({ 
  onSuccess, 
  onError, 
  showTitle = true,
  className = '',
  buttonVariant = 'full'
}: SocialMediaAuthProps) {
  const { data: session } = useSession();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authPlatform, setAuthPlatform] = useState<Platform | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Record<Platform, boolean>>({
    facebook: false,
    twitter: false,
    instagram: false,
    linkedin: false,
    tiktok: false
  });
  const [authError, setAuthError] = useState<{platform: Platform, message: string} | null>(null);

  // Verifica las plataformas conectadas al cargar el componente
  useEffect(() => {
    // Obtener las plataformas conectadas usando el servicio
    const connected = SocialAuthService.getConnectedPlatforms();
    setConnectedPlatforms(connected);
    
    // Si hay una sesión activa, actualizar el estado
    if (session?.provider) {
      const platform = session.provider as Platform;
      if (session.accessToken && session.expiresAt) {
        // Guardar el token en el servicio
        SocialAuthService.saveToken(
          platform,
          session.accessToken,
          session.expiresAt,
          session.user.id
        );
        
        // Actualizar el estado local
        setConnectedPlatforms(prev => ({
          ...prev,
          [platform]: true
        }));
        
        // Llamar al callback de éxito si existe
        if (onSuccess) {
          onSuccess(platform, {
            token: session.accessToken,
            expiresAt: session.expiresAt,
            userId: session.user.id
          });
        }
      }
    }
  }, [session, onSuccess]);

  const handleSocialAuth = async (platform: Platform) => {
    setIsAuthenticating(true);
    setAuthPlatform(platform);
    setAuthError(null);
    
    try {
      // En desarrollo, redireccionar directamente a la página de espera en lugar de autenticar
      // Esto evita el error 404 cuando las cuentas de desarrollador aún no están aprobadas
      window.location.href = `/conectando-red-social?network=${platform}`;
      
      // Comentado temporalmente hasta que las cuentas de desarrollador estén aprobadas
      // await SocialAuthService.authenticate(platform);
      
      // Actualizamos el estado por si acaso, aunque la página se recargará
      setConnectedPlatforms(prev => ({
        ...prev,
        [platform]: true
      }));
      
      // No llamamos a onSuccess aquí porque se manejará en el useEffect cuando la sesión cambie
    } catch (error) {
      console.error(`Error authenticating with ${platform}:`, error);
      setAuthError({
        platform,
        message: `Error al conectar con ${platform}. Por favor intenta nuevamente.`
      });
      
      // Llamamos al callback onError si existe
      if (onError) {
        onError(platform, error);
      }
    } finally {
      setIsAuthenticating(false);
      setAuthPlatform(null);
    }
  };

  const disconnectPlatform = async (platform: Platform) => {
    try {
      // Usar el servicio para desconectar la plataforma
      await SocialAuthService.disconnect(platform);
      
      // Actualizar el estado local
      setConnectedPlatforms(prev => ({
        ...prev,
        [platform]: false
      }));
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
      setAuthError({
        platform,
        message: `Error al desconectar de ${platform}. Por favor intenta nuevamente.`
      });
    }
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'facebook':
        return <FaFacebook className="text-[#1877F2]" />;
      case 'twitter':
        return <FaTwitter className="text-[#1DA1F2]" />;
      case 'instagram':
        return <FaInstagram className="text-[#E1306C]" />;
      case 'linkedin':
        return <FaLinkedin className="text-[#0077B5]" />;
      case 'tiktok':
        return <FaTiktok className="text-[#000000]" />;
    }
  };

  const getPlatformName = (platform: Platform) => {
    switch (platform) {
      case 'facebook':
        return 'Facebook';
      case 'twitter':
        return 'Twitter/X';
      case 'instagram':
        return 'Instagram';
      case 'linkedin':
        return 'LinkedIn';
      case 'tiktok':
        return 'TikTok';
    }
  };

  const getPlatformColors = (platform: Platform) => {
    switch (platform) {
      case 'facebook':
        return 'bg-[#1877F2] hover:bg-[#166FE5] focus:ring-[#1877F2]/50';
      case 'twitter':
        return 'bg-[#1DA1F2] hover:bg-[#1A91DA] focus:ring-[#1DA1F2]/50';
      case 'instagram':
        return 'bg-gradient-to-r from-[#E1306C] to-[#C13584] hover:from-[#D92D68] hover:to-[#B12D7C] focus:ring-[#E1306C]/50';
      case 'linkedin':
        return 'bg-[#0077B5] hover:bg-[#006699] focus:ring-[#0077B5]/50';
      case 'tiktok':
        return 'bg-black hover:bg-gray-800 focus:ring-gray-700/50';
    }
  };

  return (
    <div className={`${className}`}>
      {showTitle && (
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Conecta tus redes sociales
        </h2>
      )}

      {authError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-start">
          <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error al conectar con {getPlatformName(authError.platform)}</p>
            <p className="text-sm">{authError.message}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {buttonVariant === 'full' ? (
          // Botones grandes (estilo completo)
          <>
            <button
              onClick={() => handleSocialAuth('facebook')}
              className={`w-full px-4 py-2 flex items-center justify-center rounded-md ${
                connectedPlatforms.facebook 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' 
                  : 'bg-[#1877F2] text-white hover:bg-[#166FE5]'
              } transition-colors`}
              disabled={isAuthenticating}
            >
              <FaFacebook className="mr-2 flex-shrink-0" />
              <span className="truncate">
                {connectedPlatforms.facebook ? 'Facebook conectado' : 'Conectar con Facebook'}
              </span>
              {isAuthenticating && authPlatform === 'facebook' && (
                <span className="ml-2 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
              )}
            </button>
            
            <button
              onClick={() => handleSocialAuth('twitter')}
              className={`w-full px-4 py-2 flex items-center justify-center rounded-md ${
                connectedPlatforms.twitter 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' 
                  : 'bg-[#1DA1F2] text-white hover:bg-[#1A94DA]'
              } transition-colors`}
              disabled={isAuthenticating}
            >
              <FaTwitter className="mr-2 flex-shrink-0" />
              <span className="truncate">
                {connectedPlatforms.twitter ? 'Twitter/X conectado' : 'Conectar con Twitter/X'}
              </span>
              {isAuthenticating && authPlatform === 'twitter' && (
                <span className="ml-2 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
              )}
            </button>
            
            <button
              onClick={() => handleSocialAuth('instagram')}
              className={`w-full px-4 py-2 flex items-center justify-center rounded-md ${
                connectedPlatforms.instagram 
                  ? 'bg-pink-50 text-pink-700 border border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800' 
                  : 'bg-gradient-to-r from-[#405DE6] via-[#E1306C] to-[#FFDC80] text-white'
              } transition-colors`}
              disabled={isAuthenticating}
            >
              <FaInstagram className="mr-2 flex-shrink-0" />
              <span className="truncate">
                {connectedPlatforms.instagram ? 'Instagram conectado' : 'Conectar con Instagram'}
              </span>
              {isAuthenticating && authPlatform === 'instagram' && (
                <span className="ml-2 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
              )}
            </button>
            
            <button
              onClick={() => handleSocialAuth('linkedin')}
              className={`w-full px-4 py-2 flex items-center justify-center rounded-md ${
                connectedPlatforms.linkedin 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' 
                  : 'bg-[#0077B5] text-white hover:bg-[#006699]'
              } transition-colors`}
              disabled={isAuthenticating}
            >
              <FaLinkedin className="mr-2 flex-shrink-0" />
              <span className="truncate">
                {connectedPlatforms.linkedin ? 'LinkedIn conectado' : 'Conectar con LinkedIn'}
              </span>
              {isAuthenticating && authPlatform === 'linkedin' && (
                <span className="ml-2 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
              )}
            </button>
            
            <button
              onClick={() => handleSocialAuth('tiktok')}
              className={`w-full px-4 py-2 flex items-center justify-center rounded-md ${
                connectedPlatforms.tiktok 
                  ? 'bg-gray-50 text-gray-900 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800' 
                  : 'bg-black text-white hover:bg-gray-800'
              } transition-colors`}
              disabled={isAuthenticating}
            >
              <FaTiktok className="mr-2 flex-shrink-0" />
              <span className="truncate">
                {connectedPlatforms.tiktok ? 'TikTok conectado' : 'Conectar con TikTok'}
              </span>
              {isAuthenticating && authPlatform === 'tiktok' && (
                <span className="ml-2 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
              )}
            </button>
          </>
        ) : (
          // Botones compactos para modales o espacios reducidos
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialAuth('facebook')}
              className={`px-3 py-2 flex items-center justify-center rounded-md ${
                connectedPlatforms.facebook 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' 
                  : 'bg-[#1877F2] text-white hover:bg-[#166FE5]'
              } transition-colors`}
              disabled={isAuthenticating}
            >
              <FaFacebook className="mr-2 flex-shrink-0" />
              <span className="truncate">Facebook</span>
              {isAuthenticating && authPlatform === 'facebook' && (
                <span className="ml-2 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
              )}
            </button>
            
            <button
              onClick={() => handleSocialAuth('twitter')}
              className={`px-3 py-2 flex items-center justify-center rounded-md ${
                connectedPlatforms.twitter 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' 
                  : 'bg-[#1DA1F2] text-white hover:bg-[#1A94DA]'
              } transition-colors`}
              disabled={isAuthenticating}
            >
              <FaTwitter className="mr-2 flex-shrink-0" />
              <span className="truncate">Twitter/X</span>
              {isAuthenticating && authPlatform === 'twitter' && (
                <span className="ml-2 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
              )}
            </button>
            
            <button
              onClick={() => handleSocialAuth('instagram')}
              className={`px-3 py-2 flex items-center justify-center rounded-md ${
                connectedPlatforms.instagram 
                  ? 'bg-pink-50 text-pink-700 border border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800' 
                  : 'bg-gradient-to-r from-[#405DE6] via-[#E1306C] to-[#FFDC80] text-white'
              } transition-colors`}
              disabled={isAuthenticating}
            >
              <FaInstagram className="mr-2 flex-shrink-0" />
              <span className="truncate">Instagram</span>
              {isAuthenticating && authPlatform === 'instagram' && (
                <span className="ml-2 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
              )}
            </button>
            
            <button
              onClick={() => handleSocialAuth('linkedin')}
              className={`px-3 py-2 flex items-center justify-center rounded-md ${
                connectedPlatforms.linkedin 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' 
                  : 'bg-[#0077B5] text-white hover:bg-[#006699]'
              } transition-colors`}
              disabled={isAuthenticating}
            >
              <FaLinkedin className="mr-2 flex-shrink-0" />
              <span className="truncate">LinkedIn</span>
              {isAuthenticating && authPlatform === 'linkedin' && (
                <span className="ml-2 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
              )}
            </button>
            
            <button
              onClick={() => handleSocialAuth('tiktok')}
              className={`px-3 py-2 flex items-center justify-center rounded-md ${
                connectedPlatforms.tiktok 
                  ? 'bg-gray-50 text-gray-900 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800' 
                  : 'bg-black text-white hover:bg-gray-800'
              } transition-colors`}
              disabled={isAuthenticating}
            >
              <FaTiktok className="mr-2 flex-shrink-0" />
              <span className="truncate">TikTok</span>
              {isAuthenticating && authPlatform === 'tiktok' && (
                <span className="ml-2 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
