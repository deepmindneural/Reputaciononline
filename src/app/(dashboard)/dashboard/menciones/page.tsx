"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaFacebook, 
  FaTwitter,
  FaInstagram, 
  FaLinkedin, 
  FaTiktok, 
  FaNewspaper,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaDownload,
  FaSort,
  FaListAlt,
  FaTh,
  FaBookmark,
  FaBell,
  FaExclamationCircle,
  FaSpinner,
  FaThumbsUp,
  FaThumbsDown,
  FaMeh,
  FaComment,
  FaShare,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Tipos para el componente
type SentimentType = 'positive' | 'negative' | 'neutral';
type SocialNetworkType = 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'news';

// Interfaz para las propiedades del componente MencionItem
interface MencionItemProps {
  id: string;
  autor: {
    nombre: string;
    usuario?: string;
    imagen?: string;
    url?: string;
  };
  contenido: string;
  fecha: string;
  red: SocialNetworkType;
  sentimiento: SentimentType;
  engagement: {
    likes?: number;
    comentarios?: number;
    compartidos?: number;
  };
  relevancia?: number;
  url?: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
  ubicacion?: {
    pais?: string;
    ciudad?: string;
    coordenadas?: {
      latitude: number;
      longitude: number;
    };
  };
}

// Componente MencionItem para mostrar una mención individual
const MencionItem: React.FC<MencionItemProps> = ({
  id,
  autor,
  contenido,
  fecha,
  red,
  sentimiento,
  engagement,
  url,
  media,
  ubicacion
}) => {
  // Determinar el icono de la red social
  const getNetworkIcon = () => {
    switch (red) {
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
      case 'news':
        return <FaNewspaper className="text-[#FF6600]" />;
      default:
        return <FaNewspaper className="text-gray-500" />;
    }
  };

  // Determinar el color del sentimiento
  const getSentimentColor = () => {
    switch (sentimiento) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'neutral':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Determinar el icono del sentimiento
  const getSentimentIcon = () => {
    switch (sentimiento) {
      case 'positive':
        return <FaThumbsUp className="mr-1" />;
      case 'negative':
        return <FaThumbsDown className="mr-1" />;
      case 'neutral':
        return <FaMeh className="mr-1" />;
      default:
        return <FaMeh className="mr-1" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-start">
        {/* Avatar del autor */}
        <div className="flex-shrink-0 mr-3">
          <img 
            src={autor.imagen || '/images/avatars/default.png'} 
            alt={autor.nombre} 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        
        {/* Contenido principal */}
        <div className="flex-1">
          {/* Encabezado con información del autor */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center">
                <h4 className="font-medium text-gray-900 dark:text-white">{autor.nombre}</h4>
                {autor.usuario && (
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">@{autor.usuario}</span>
                )}
                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{fecha}</span>
              </div>
            </div>
            
            {/* Icono de la red social */}
            <div className="flex items-center">
              <span className="mr-2">{getNetworkIcon()}</span>
              <div className={`px-2 py-0.5 rounded-full text-xs ${getSentimentColor()} flex items-center`}>
                {getSentimentIcon()}
                <span>
                  {sentimiento === 'positive' ? 'Positivo' : 
                   sentimiento === 'negative' ? 'Negativo' : 'Neutral'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Contenido de la mención */}
          <p className="text-gray-700 dark:text-gray-300 mb-3">{contenido}</p>
          
          {/* Medios adjuntos (imágenes o videos) */}
          {media && media.length > 0 && (
            <div className="mb-3">
              <div className="grid grid-cols-2 gap-2">
                {media.map((item, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    {item.type === 'image' ? (
                      <img src={item.url} alt="Media" className="w-full h-32 object-cover" />
                    ) : (
                      <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">Video</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Estadísticas de engagement */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            {engagement.likes !== undefined && (
              <div className="flex items-center mr-4">
                <FaThumbsUp className="mr-1" />
                <span>{engagement.likes}</span>
              </div>
            )}
            {engagement.comentarios !== undefined && (
              <div className="flex items-center mr-4">
                <FaComment className="mr-1" />
                <span>{engagement.comentarios}</span>
              </div>
            )}
            {engagement.compartidos !== undefined && (
              <div className="flex items-center">
                <FaShare className="mr-1" />
                <span>{engagement.compartidos}</span>
              </div>
            )}
          </div>
          
          {/* Ubicación si está disponible */}
          {ubicacion && ubicacion.ciudad && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <FaMapMarkerAlt className="mr-1" />
              <span>{ubicacion.ciudad}, {ubicacion.pais}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Datos de ejemplo para mostrar cuando no hay redes conectadas o mientras se cargan los datos reales
const mencionesEjemplo: MencionItemProps[] = [
  {
    id: '1',
    autor: {
      nombre: 'María García',
      usuario: 'mariagarcia',
      imagen: '/images/avatars/avatar-1.jpg',
      url: '#'
    },
    contenido: 'Me gusta mucho la propuesta del candidato @usuario sobre educación. ¡Tiene mi voto! #Elecciones2025',
    fecha: '2025-04-28T15:30:00',
    red: 'twitter',
    sentimiento: 'positive',
    engagement: {
      likes: 45,
      comentarios: 12,
      compartidos: 8
    },
    relevancia: 85,
    url: '#',
    ubicacion: {
      pais: 'Colombia',
      ciudad: 'Bogotá'
    }
  },
  {
    id: '2',
    autor: {
      nombre: 'Carlos Rodríguez',
      usuario: 'carlosrodriguez',
      imagen: '/images/avatars/avatar-2.jpg',
      url: '#'
    },
    contenido: 'No estoy de acuerdo con la posición de @usuario sobre el tema ambiental. Falta más compromiso con nuestros recursos naturales. #MedioAmbiente',
    fecha: '2025-04-28T14:15:00',
    red: 'facebook',
    sentimiento: 'negative',
    engagement: {
      likes: 23,
      comentarios: 34,
      compartidos: 5
    },
    relevancia: 78,
    url: '#',
    ubicacion: {
      pais: 'Colombia',
      ciudad: 'Medellín'
    }
  },
  {
    id: '3',
    autor: {
      nombre: 'Laura Martínez',
      usuario: 'lauramartinez',
      imagen: '/images/avatars/avatar-3.jpg',
      url: '#'
    },
    contenido: 'Interesante debate sobre políticas públicas ayer. Varios puntos importantes fueron discutidos. #Política',
    fecha: '2025-04-28T10:45:00',
    red: 'instagram',
    sentimiento: 'neutral',
    engagement: {
      likes: 67,
      comentarios: 8,
      compartidos: 0
    },
    relevancia: 65,
    url: '#',
    media: [
      {
        type: 'image',
        url: '/images/posts/debate.jpg'
      }
    ],
    ubicacion: {
      pais: 'Colombia',
      ciudad: 'Cali'
    }
  },
  {
    id: '4',
    autor: {
      nombre: 'El Tiempo',
      usuario: 'eltiempo',
      imagen: '/images/avatars/eltiempo.jpg',
      url: '#'
    },
    contenido: 'Candidato @usuario lidera las encuestas con un 45% de intención de voto según la última encuesta nacional.',
    fecha: '2025-04-27T18:20:00',
    red: 'news',
    sentimiento: 'neutral',
    engagement: {
      likes: 120,
      comentarios: 45,
      compartidos: 78
    },
    relevancia: 95,
    url: '#',
    media: [
      {
        type: 'image',
        url: '/images/posts/encuesta.jpg'
      }
    ]
  },
  {
    id: '5',
    autor: {
      nombre: 'Pedro Gómez',
      usuario: 'pedrogomez',
      imagen: '/images/avatars/avatar-4.jpg',
      url: '#'
    },
    contenido: '¡Excelente propuesta de @usuario sobre infraestructura! Es justo lo que necesitamos para mejorar la movilidad en la ciudad. #Transporte #Desarrollo',
    fecha: '2025-04-27T09:10:00',
    red: 'linkedin',
    sentimiento: 'positive',
    engagement: {
      likes: 89,
      comentarios: 23,
      compartidos: 12
    },
    relevancia: 82,
    url: '#',
    ubicacion: {
      pais: 'Colombia',
      ciudad: 'Barranquilla'
    }
  }
];

// Componente principal de la página de menciones
export default function MencionesPage() {
  // Estado y hooks
  const { data: session, status } = useSession();
  const router = useRouter();
  const [menciones, setMenciones] = useState<MencionItemProps[]>([]);
  const [filteredMenciones, setFilteredMenciones] = useState<MencionItemProps[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState<SocialNetworkType[]>([]);
  const [selectedSentiment, setSelectedSentiment] = useState('todos');
  const [sortBy, setSortBy] = useState<'recent' | 'relevance'>('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    porRed: {} as Record<string, number>,
    porSentimiento: {} as Record<string, number>,
    porFecha: {} as Record<string, number>,
    topUbicaciones: [] as {name: string, count: number}[],
  });
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    facebook: false,
    twitter: false,
    instagram: false,
    linkedin: false,
  });
  
  // Función para ir a la página de conexión de redes sociales
  const goToSocialNetworksPage = () => {
    router.push('/dashboard/redes-sociales');
  };
  
  // Función para obtener menciones desde la API
  const fetchMenciones = async () => {
    setLoading(true);
    try {
      // Llamada a la API para obtener menciones
      const response = await fetch('/api/menciones');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Convertir las menciones al formato esperado por la UI
      const convertedMenciones = data.mentions.map(convertToMencionItem);
      setMenciones(convertedMenciones);
      
      // Usar las estadísticas proporcionadas por la API
      if (data.statistics) {
        setStats({
          total: data.statistics.total,
          porRed: data.statistics.byPlatform,
          porSentimiento: data.statistics.bySentiment,
          porFecha: data.statistics.byDate,
          topUbicaciones: data.statistics.topLocations,
        });
      } else {
        // Calcular estadísticas localmente si no vienen de la API
        calculateStats(convertedMenciones);
      }
      
      // Mostrar errores de API si los hay
      if (data.errors && data.errors.length > 0) {
        setError(`Algunas redes sociales reportaron errores: ${data.errors.map((e: {platform: string, message: string}) => `${e.platform} - ${e.message}`).join(', ')}`);
      }
    } catch (error) {
      console.error('Error al obtener menciones:', error);
      setError('No se pudieron cargar las menciones. Inténtalo de nuevo más tarde.');
      
      // Si hay un error, usar datos simulados para desarrollo
      setMenciones(mencionesEjemplo);
      calculateStats(mencionesEjemplo);
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular estadísticas a partir de las menciones
  const calculateStats = (menciones: MencionItemProps[]) => {
    // Calcular total
    const total = menciones.length;
    
    // Calcular por red social
    const porRed: Record<string, number> = {};
    menciones.forEach(mencion => {
      porRed[mencion.red] = (porRed[mencion.red] || 0) + 1;
    });
    
    // Calcular por sentimiento
    const porSentimiento: Record<string, number> = {};
    menciones.forEach(mencion => {
      porSentimiento[mencion.sentimiento] = (porSentimiento[mencion.sentimiento] || 0) + 1;
    });
    
    // Calcular por fecha (agrupadas por día)
    const porFecha: Record<string, number> = {};
    menciones.forEach(mencion => {
      const fecha = new Date(mencion.fecha).toISOString().split('T')[0];
      porFecha[fecha] = (porFecha[fecha] || 0) + 1;
    });
    
    // Calcular top ubicaciones
    const ubicaciones: Record<string, number> = {};
    menciones.forEach(mencion => {
      if (mencion.ubicacion?.ciudad) {
        const ubicacionKey = `${mencion.ubicacion.ciudad}, ${mencion.ubicacion.pais || 'Colombia'}`;
        ubicaciones[ubicacionKey] = (ubicaciones[ubicacionKey] || 0) + 1;
      }
    });
    
    const topUbicaciones = Object.entries(ubicaciones)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Actualizar estado de estadísticas
    setStats({
      total,
      porRed,
      porSentimiento,
      porFecha,
      topUbicaciones,
    });
  };

  // Función para convertir una mención común a formato de UI
  const convertToMencionItem = (mention: any): MencionItemProps => {
    return {
      id: mention.id,
      red: mention.platform,
      autor: {
        nombre: mention.author.name,
        usuario: mention.author.username || '',
        imagen: mention.author.profileImage || '/images/avatars/default.png',
        url: mention.author.profileUrl || '#',
      },
      contenido: mention.content,
      fecha: mention.formattedDate || mention.date,
      sentimiento: mention.sentiment,
      engagement: {
        likes: mention.engagement?.likes || 0,
        comentarios: mention.engagement?.comments || 0,
        compartidos: mention.engagement?.shares || 0,
      },
      relevancia: Math.floor(Math.random() * 100), // Simulamos relevancia por ahora
      url: mention.url || '#',
      media: mention.media || [],
      ubicacion: mention.location ? {
        pais: mention.location.country || 'Colombia',
        ciudad: mention.location.city || '',
        coordenadas: mention.location.coordinates,
      } : undefined,
    };
  };

  // Cargar menciones al montar el componente
  useEffect(() => {
    fetchMenciones();
  }, []);

  // Verificar qué redes sociales están conectadas
  useEffect(() => {
    if (session && session.user && session.user.connectedNetworks) {
      const connectedNetworks = session.user.connectedNetworks;
      setConnectedPlatforms({
        facebook: connectedNetworks.includes('facebook'),
        twitter: connectedNetworks.includes('twitter'),
        instagram: connectedNetworks.includes('instagram'),
        linkedin: connectedNetworks.includes('linkedin')
      });
    }
  }, [session]);

  // Aplicar filtros cuando cambian los criterios
  useEffect(() => {
    let resultado = [...menciones];
    
    // Filtrar por consulta de búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      resultado = resultado.filter(mencion => {
        return (
          mencion.contenido.toLowerCase().includes(query) ||
          mencion.autor.nombre.toLowerCase().includes(query) ||
          (mencion.autor.usuario && mencion.autor.usuario.toLowerCase().includes(query))
        );
      });
    }
    
    // Filtrar por redes seleccionadas
    if (selectedNetworks.length > 0) {
      resultado = resultado.filter(mencion => selectedNetworks.includes(mencion.red));
    }
    
    // Filtrar por sentimiento
    if (selectedSentiment !== 'todos') {
      resultado = resultado.filter(mencion => mencion.sentimiento === selectedSentiment);
    }
    
    // Ordenar resultados
    if (sortBy === 'recent') {
      // Ordenar por fecha (más recientes primero)
      resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    } else if (sortBy === 'relevance') {
      resultado.sort((a, b) => (b.relevancia || 0) - (a.relevancia || 0));
    }
    
    setFilteredMenciones(resultado);
  }, [menciones, searchQuery, selectedNetworks, selectedSentiment, sortBy]);

  // Alternar la selección de redes
  const toggleNetwork = (network: SocialNetworkType) => {
    setSelectedNetworks(prev => {
      if (prev.includes(network)) {
        return prev.filter(n => n !== network);
      } else {
        return [...prev, network];
      }
    });
  };

  return (
    <div className="py-6 px-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menciones</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitorea todas las menciones en redes sociales y noticias
          </p>
        </div>
        
        {/* Estado de conexiu00f3n de redes sociales */}
        <div className="mt-4 md:mt-0 flex items-center">
          {Object.values(connectedPlatforms).some(val => val) ? (
            <div className="flex items-center mr-4">
              <div className="flex -space-x-2 mr-2">
                {connectedPlatforms.facebook && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-white">
                    <FaFacebook className="text-[#1877F2]" />
                  </div>
                )}
                {connectedPlatforms.twitter && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-white">
                    <FaTwitter className="text-[#1DA1F2]" />
                  </div>
                )}
                {connectedPlatforms.instagram && (
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center ring-2 ring-white">
                    <FaInstagram className="text-[#E1306C]" />
                  </div>
                )}
                {connectedPlatforms.linkedin && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-white">
                    <FaLinkedin className="text-[#0077B5]" />
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Object.values(connectedPlatforms).filter(Boolean).length} redes conectadas
              </span>
            </div>
          ) : (
            <div className="flex items-center text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-md mr-4">
              <FaExclamationCircle className="mr-2" />
              <span className="text-sm">Sin redes conectadas</span>
            </div>
          )}
          
          <button
            onClick={goToSocialNetworksPage}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors"
          >
            Conectar redes
          </button>
        </div>
      </div>
      
      {/* Controles de filtrado y bu00fasqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Buscador */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Buscar en menciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filtro de redes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Redes</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleNetwork('twitter')}
                className={`px-2 py-1 text-xs rounded-full flex items-center ${selectedNetworks.includes('twitter') ? 'bg-[#1DA1F2] text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                <FaTwitter className="w-3 h-3 mr-1" />
                Twitter
              </button>
              <button
                onClick={() => toggleNetwork('facebook')}
                className={`px-2 py-1 text-xs rounded-full flex items-center ${selectedNetworks.includes('facebook') ? 'bg-[#1877F2] text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                <FaFacebook className="mr-1" />
                Facebook
              </button>
              <button
                onClick={() => toggleNetwork('instagram')}
                className={`px-2 py-1 text-xs rounded-full flex items-center ${selectedNetworks.includes('instagram') ? 'bg-[#E1306C] text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                <FaInstagram className="mr-1" />
                Instagram
              </button>
              <button
                onClick={() => toggleNetwork('linkedin')}
                className={`px-2 py-1 text-xs rounded-full flex items-center ${selectedNetworks.includes('linkedin') ? 'bg-[#0077B5] text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                <FaLinkedin className="mr-1" />
                LinkedIn
              </button>
            </div>
          </div>
          
          {/* Filtro de sentimiento */}
          <div>
            <label htmlFor="filterSentiment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sentimiento
            </label>
            <select
              id="filterSentiment"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="positive">Positivo</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negativo</option>
            </select>
          </div>
          
          {/* Ordenar por */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ordenar por
            </label>
            <select
              id="sortBy"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'relevance')}
            >
              <option value="recent">Mu00e1s recientes</option>
              <option value="relevance">Relevancia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de menciones */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {loading ? 'Cargando menciones...' : `${filteredMenciones.length} menciones encontradas`}
          </h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchMenciones()}
              className="p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              title="Actualizar menciones"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            <button
              className="p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              title="Exportar menciones"
            >
              <FaDownload className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {/* Indicador de carga */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-primary-500 text-2xl" />
          </div>
        ) : filteredMenciones.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No se encontraron menciones con los filtros actuales.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMenciones.map((mencion) => (
              <MencionItem key={mencion.id} {...mencion} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
