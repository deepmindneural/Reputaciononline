"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaRegBell,
  FaCheck,
  FaExclamationTriangle,
  FaEye,
  FaChartLine,
  FaCommentDots,
  FaUserFriends,
  FaArrowUp,
  FaArrowDown,
  FaShieldAlt,
  FaInfoCircle,
  FaCog,
  FaSpinner,
  FaHeart,
  FaShareAlt
} from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';
import { useSession } from 'next-auth/react';
import SocialMediaMapbox from '@/components/maps/SocialMediaMapbox';
import MapSection from './MapSection';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SocialMediaAuth from '@/components/SocialMediaAuth';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import SocialAuthService from '@/services/socialAuth';

// Definición de tipos
type Platform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok';

// Tipo para datos de región en el mapa
interface RegionMention {
  id: string;
  region: string;
  coordinates: [number, number]; // [longitud, latitud]
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  platform?: string;
  platformColor?: string;
}

interface SocialToken {
  id: string;
  platform: Platform;
  token: string;
  expiresAt: string;
  userId: string;
}

// Tipo para los datos de cada plataforma
interface PlatformData {
  followers: number;
  engagement: number;
  posts: number;
  reach: number;
  mentions: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentPosts: {
    id: string;
    content: string;
    date: string;
    likes: number;
    comments: number;
    shares: number;
  }[];
}

// Función para generar datos de ejemplo para cada plataforma
const generatePlatformData = (platform: Platform): PlatformData => {
  const baseFollowers = {
    facebook: 98500,
    twitter: 3241,
    instagram: 76300,
    linkedin: 42100,
    tiktok: 125600
  };
  
  const baseEngagement = {
    facebook: 3.2,
    twitter: 1.8,
    instagram: 4.5,
    linkedin: 2.7,
    tiktok: 5.8
  };
  
  // Generar datos aleatorios pero realistas
  return {
    followers: baseFollowers[platform],
    engagement: baseEngagement[platform],
    posts: Math.floor(Math.random() * 50) + 20,
    reach: Math.floor(baseFollowers[platform] * (Math.random() * 2 + 1.5)),
    mentions: Math.floor(Math.random() * 200) + 50,
    sentiment: {
      positive: Math.floor(Math.random() * 30) + 50, // 50-80%
      neutral: Math.floor(Math.random() * 20) + 10, // 10-30%
      negative: Math.floor(Math.random() * 10) + 5, // 5-15%
    },
    recentPosts: Array(5).fill(null).map((_, i) => ({
      id: `${platform}_post_${i}_${Date.now()}`,
      content: `Ejemplo de publicación en ${platform} #${i+1}. ¡Gracias por su apoyo!`,
      date: new Date(Date.now() - (i * 86400000 * (Math.random() * 3 + 1))).toISOString(),
      likes: Math.floor(Math.random() * 100) + 10,
      comments: Math.floor(Math.random() * 30) + 5,
      shares: Math.floor(Math.random() * 20) + 2,
    }))
  };
};

// Función para obtener el nombre para mostrar de una plataforma
const getPlatformName = (platform: Platform): string => {
  const names = {
    facebook: 'Facebook',
    twitter: 'Twitter / X',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    tiktok: 'TikTok'
  };
  return names[platform];
};

// Función para obtener el color de una plataforma
const getPlatformColor = (platform: Platform): string => {
  const colors = {
    facebook: 'text-blue-600',
    twitter: 'text-blue-400',
    instagram: 'text-pink-500',
    linkedin: 'text-blue-700',
    tiktok: 'text-black dark:text-white'
  };
  return colors[platform];
};

// Función para obtener el ícono de una plataforma
const getPlatformIcon = (platform: Platform) => {
  const icons = {
    facebook: <FaFacebook />,
    twitter: <FaTwitter />,
    instagram: <FaInstagram />,
    linkedin: <FaLinkedin />,
    tiktok: <FaTiktok />
  };
  return icons[platform];
};

export default function RedesSocialesPage() {
  const { data: session, status } = useSession();
  const [connectedPlatforms, setConnectedPlatforms] = useState<{[key in Platform]?: boolean}>({});
  const [platformData, setPlatformData] = useState<{[key in Platform]?: PlatformData}>({});
  const [loadingData, setLoadingData] = useState<{[key in Platform]?: boolean}>({});
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
    platform: Platform | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authPlatform, setAuthPlatform] = useState<Platform | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'mentions' | 'analytics'>('overview');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  // Cargar las plataformas conectadas desde localStorage al montar el componente
  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    
    setIsLoading(false);
    
    // Recuperar del localStorage las plataformas conectadas
    if (typeof window !== 'undefined') {
      try {
        const savedConnections = JSON.parse(localStorage.getItem('connectedPlatforms') || '{}');
        setConnectedPlatforms(savedConnections);
        
        // Para cada plataforma conectada, cargar sus datos
        Object.entries(savedConnections).forEach(([platform, isConnected]) => {
          if (isConnected) {
            setLoadingData(prev => ({
              ...prev,
              [platform]: true
            }));
            
            // Simular carga de datos
            setTimeout(() => {
              setPlatformData(prev => ({
                ...prev,
                [platform as Platform]: generatePlatformData(platform as Platform)
              }));
              
              setLoadingData(prev => {
                const newState = { ...prev };
                delete newState[platform as Platform];
                return newState;
              });
            }, 1500);
          }
        });
      } catch (error) {
        console.error('Error al cargar conexiones guardadas:', error);
        localStorage.removeItem('connectedPlatforms');
      }
    }
  }, [status]);

  // Mostrar mensaje de éxito o error
  const showNotification = (success: boolean, message: string, platform: Platform | null) => {
    setConnectionStatus({
      success,
      message,
      platform
    });

    // Ocultar la notificación después de 5 segundos
    setTimeout(() => {
      setConnectionStatus(null);
    }, 5000);
  };

  // Función para conectar con una plataforma social (ahora REAL)
  const connectPlatform = async (platform: Platform) => {
    setConnecting(true);
    setAuthPlatform(platform);
    setError(null);
    try {
      await SocialAuthService.authenticate(platform);
    } catch (error) {
      console.error('Error al autenticar la plataforma:', error);
      showNotification(false, `Error al conectar con ${getPlatformName(platform)}. Por favor intenta nuevamente.`, platform);
    } finally {
      setConnecting(false);
      setAuthPlatform(null);
    }
  };

  // Función para desconectar una plataforma
  const disconnectPlatform = (platform: Platform) => {
    // Actualizar el estado local
    setConnectedPlatforms(prev => {
      const newState = { ...prev };
      delete newState[platform];
      return newState;
    });
    
    // Actualizar localStorage
    try {
      const connectedPlatforms = JSON.parse(localStorage.getItem('connectedPlatforms') || '{}');
      delete connectedPlatforms[platform];
      localStorage.setItem('connectedPlatforms', JSON.stringify(connectedPlatforms));
      
      // Eliminar el token asociado
      const tokens = JSON.parse(localStorage.getItem('socialTokens') || '[]');
      const updatedTokens = tokens.filter((token: SocialToken) => token.platform !== platform);
      localStorage.setItem('socialTokens', JSON.stringify(updatedTokens));
      
      // Eliminar los datos de la plataforma
      setPlatformData(prev => {
        const newData = { ...prev };
        delete newData[platform];
        return newData;
      });
      
      // Mostrar mensaje de éxito
      showNotification(true, `Se ha desconectado correctamente de ${getPlatformName(platform)}.`, platform);
    } catch (error) {
      console.error('Error al desconectar la plataforma:', error);
      showNotification(false, `Error al desconectar de ${getPlatformName(platform)}.`, platform);
    }
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Conectar Redes Sociales</h1>
      
      {/* Mensaje de notificación */}
      {connectionStatus && (
        <Card className={`mb-6 ${connectionStatus.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <CardContent className="p-4 flex items-center">
            {connectionStatus.success ? (
              <FaCheck className="mr-2 flex-shrink-0 text-green-600 dark:text-green-400" />
            ) : (
              <FaExclamationTriangle className="mr-2 flex-shrink-0 text-red-600 dark:text-red-400" />
            )}
            <span className={connectionStatus.success ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}>
              {connectionStatus.message}
            </span>
          </CardContent>
        </Card>
      )}

      {/* Estado de conexión de plataformas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {(['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok'] as Platform[]).map(platform => {
          const isConnected = !!connectedPlatforms[platform];
          const isLoading = !!loadingData[platform] || (connecting && authPlatform === platform);
          
          return (
            <Card key={platform} className="transition-all duration-200 hover:shadow-md overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center">
                  <Avatar className={`${getPlatformColor(platform)} bg-gray-50 dark:bg-gray-700`}>
                    <AvatarFallback>{getPlatformIcon(platform)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <CardTitle className="text-base">{getPlatformName(platform)}</CardTitle>
                    <CardDescription>
                      {isConnected ? 'Conectado' : 'No conectado'}
                    </CardDescription>
                  </div>
                </div>
                
                <Button
                  onClick={() => isConnected ? disconnectPlatform(platform) : connectPlatform(platform)}
                  disabled={isLoading}
                  variant={isConnected ? "destructive" : "default"}
                  size="sm"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      <span>Procesando...</span>
                    </div>
                  ) : isConnected ? 'Desconectar' : 'Conectar'}
                </Button>
              </CardHeader>
              
              {isConnected && platformData[platform] && (
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Seguidores</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {platformData[platform]?.followers.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Menciones</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {platformData[platform]?.mentions.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setSelectedPlatform(platform)}
                    variant="outline"
                    className="w-full"
                  >
                    Ver detalles
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Botones de conexión reales */}
      <Card className="mb-8">
        <CardContent>
          <SocialMediaAuth buttonVariant="full" />
        </CardContent>
      </Card>
      
      {/* Incluir el componente de mapa */}
      <MapSection connectedPlatforms={connectedPlatforms} getPlatformColor={getPlatformColor} />

      {/* Panel detallado para la plataforma seleccionada */}
      {selectedPlatform && platformData[selectedPlatform] && (
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center">
              <Avatar className={`${getPlatformColor(selectedPlatform)} bg-gray-50 dark:bg-gray-700`}>
                <AvatarFallback>{getPlatformIcon(selectedPlatform)}</AvatarFallback>
              </Avatar>
              <CardTitle className="ml-3">
                Análisis de {getPlatformName(selectedPlatform)}
              </CardTitle>
            </div>
            <Button 
              onClick={() => setSelectedPlatform(null)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
            >
              &times;
            </Button>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Seguidores</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {platformData[selectedPlatform]?.followers.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Alcance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {platformData[selectedPlatform]?.reach.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Engagement</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {platformData[selectedPlatform]?.engagement.toFixed(1)}%
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Publicaciones</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {platformData[selectedPlatform]?.posts}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Sentimiento</h3>
              <Progress 
                value={platformData[selectedPlatform]?.sentiment?.positive} 
                className="h-8 bg-gray-200 dark:bg-gray-700"
                indicatorClassName="bg-green-500"
              />
              <div className="grid grid-cols-3 text-xs mt-2 text-gray-600 dark:text-gray-400">
                <div>Positivo ({platformData[selectedPlatform]?.sentiment?.positive}%)</div>
                <div className="text-center">Neutral ({platformData[selectedPlatform]?.sentiment?.neutral}%)</div>
                <div className="text-right">Negativo ({platformData[selectedPlatform]?.sentiment?.negative}%)</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Publicaciones recientes</h3>
              <div className="space-y-4">
                {platformData[selectedPlatform]?.recentPosts?.map(post => (
                  <Card key={post.id} className="border border-gray-100 dark:border-gray-700">
                    <CardContent className="p-4">
                      <p className="text-gray-900 dark:text-white mb-2">{post.content}</p>
                      <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 dark:text-gray-400 gap-2">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <div className="flex space-x-4">
                          <span className="flex items-center">
                            <FaHeart className="mr-1 text-red-500" /> {post.likes}
                          </span>
                          <span className="flex items-center">
                            <FaCommentDots className="mr-1 text-blue-500" /> {post.comments}
                          </span>
                          <span className="flex items-center">
                            <FaShareAlt className="mr-1 text-green-500" /> {post.shares}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Instrucciones para conectar redes sociales */}
      {!Object.values(connectedPlatforms).some(Boolean) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>¿Por qué conectar tus redes sociales?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full mr-4">
                    <FaRegBell className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Alertas en tiempo real</h3>
                    <p className="text-gray-600 dark:text-gray-400">Recibe notificaciones inmediatas sobre menciones y comentarios relevantes para tu campaña política.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mr-4">
                    <FaEye className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Monitoreo centralizado</h3>
                    <p className="text-gray-600 dark:text-gray-400">Gestiona todas tus redes sociales desde un solo panel intuitivo y completo.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full mr-4">
                    <FaChartLine className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Análisis de rendimiento</h3>
                    <p className="text-gray-600 dark:text-gray-400">Obtén métricas detalladas y visualizaciones del impacto de tu presencia en redes sociales.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-full mr-4">
                    <FaCommentDots className="text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Análisis de sentimiento</h3>
                    <p className="text-gray-600 dark:text-gray-400">Comprende cómo el público percibe tu mensaje y ajusta tu estrategia en consecuencia.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full mr-4">
                    <FaUserFriends className="text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Identificación de influencers</h3>
                    <p className="text-gray-600 dark:text-gray-400">Descubre y conecta con personas influyentes que pueden amplificar tu mensaje político.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded-full mr-4">
                    <FaShieldAlt className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Gestión de crisis</h3>
                    <p className="text-gray-600 dark:text-gray-400">Identifica y responde rápidamente a situaciones potencialmente problemáticas antes de que escalen.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => connectPlatform('facebook')} className="mr-2">
              Empezar con Facebook
            </Button>
            <Button onClick={() => connectPlatform('twitter')} variant="outline">
              Empezar con Twitter
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Instrucciones adicionales si tiene al menos una plataforma conectada */}
      {Object.values(connectedPlatforms).some(Boolean) && !selectedPlatform && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Próximos pasos</CardTitle>
            <CardDescription>Maximiza el potencial de tus conexiones de redes sociales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full mr-4">
                  <FaInfoCircle className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Explora los datos</h3>
                  <p className="text-gray-600 dark:text-gray-400">Haz clic en "Ver detalles" en cualquier plataforma conectada para analizar métricas detalladas y publicaciones recientes.</p>
                </div>
              </div>
              
              <div className="flex items-start border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mr-4">
                  <FaCog className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Configura alertas</h3>
                  <p className="text-gray-600 dark:text-gray-400">Personaliza tus notificaciones para recibir alertas sobre menciones importantes, hashtags relevantes o competidores.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full mr-4">
                  <FaArrowUp className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Conecta más plataformas</h3>
                  <p className="text-gray-600 dark:text-gray-400">Para obtener una visión más completa de tu presencia digital, conecta todas tus redes sociales relevantes.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Indicador de carga inicial */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Cargando datos de redes sociales...</p>
          </div>
        </div>
      )}
    </div>
  );
}
