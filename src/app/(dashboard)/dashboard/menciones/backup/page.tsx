"use client";

import React, { useState } from 'react';
import { 
  // FaTwitter removido
  FaFacebook, 
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
  FaBell
} from 'react-icons/fa';

// Importación de los tipos desde un componente que aún creamos
type SentimentType = 'positivo' | 'negativo' | 'neutral';
type SocialNetworkType = 'x' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'news';

interface MencionItemProps {
  id: string;
  author: string;
  authorUsername?: string;
  authorImage?: string;
  content: string;
  date: string;
  network: SocialNetworkType;
  sentiment: SentimentType;
  engagement: {
    likes?: number;
    comments?: number;
    shares?: number;
    reposts?: number;
  };
  relevance: number; // 0-100
}

// Componente MencionItem incrustado directamente para evitar problemas de importación
const MencionItem: React.FC<MencionItemProps> = ({
  author,
  authorUsername,
  authorImage,
  content,
  date,
  network,
  sentiment,
  engagement,
  relevance
}) => {
  // Obtener el icono de la red social
  const getNetworkIcon = () => {
    switch(network) {
      case 'x':
        return <FaX className="text-black dark:text-white" />;
      case 'facebook':
        return <FaFacebook className="text-[#1877F2]" />;
      case 'instagram':
        return <FaInstagram className="text-[#E4405F]" />;
      case 'linkedin':
        return <FaLinkedin className="text-[#0A66C2]" />;
      case 'tiktok':
        return <FaTiktok className="text-black dark:text-white" />;
      case 'news':
        return <FaNewspaper className="text-gray-700 dark:text-gray-300" />;
      default:
        return <FaX className="text-black dark:text-white" />;
    }
  };

  // Obtener el badge de sentimiento con el color correcto
  const getSentimentBadge = () => {
    switch(sentiment) {
      case 'positivo':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
            Positivo
          </span>
        );
      case 'negativo':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs">
            Negativo
          </span>
        );
      case 'neutral':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full text-xs">
            Neutral
          </span>
        );
      default:
        return null;
    }
  };

  // Obtener los iconos de engagement según la red social
  const getEngagementIcons = () => {
    switch(network) {
      case 'x':
        return (
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {engagement.likes !== undefined && (
              <span className="flex items-center">
                <img src="/images/social/x-logo.png" alt="X" className="w-4 h-4 mr-1" />
                {engagement.likes.toLocaleString()}
              </span>
            )}
            {engagement.reposts !== undefined && (
              <span className="flex items-center">
                <img src="/images/social/x-logo.png" alt="X" className="w-4 h-4 mr-1" />
                {engagement.reposts.toLocaleString()}
                <span className="ml-1">reposts</span>
              </span>
            )}
            {engagement.comments !== undefined && (
              <span className="flex items-center">
                <img src="/images/social/x-logo.png" alt="X" className="w-4 h-4 mr-1" />
                {engagement.comments.toLocaleString()}
              </span>
            )}
          </div>
        );
      case 'facebook':
        return (
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {engagement.likes !== undefined && (
              <span className="flex items-center">
                <FaFacebook className="mr-1" />
                {engagement.likes.toLocaleString()}
              </span>
            )}
            {engagement.comments !== undefined && (
              <span className="flex items-center">
                <FaFacebook className="mr-1" />
                {engagement.comments.toLocaleString()}
              </span>
            )}
            {engagement.shares !== undefined && (
              <span className="flex items-center">
                <FaFacebook className="mr-1" />
                {engagement.shares.toLocaleString()}
              </span>
            )}
          </div>
        );
      case 'instagram':
        return (
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {engagement.likes !== undefined && (
              <span className="flex items-center">
                <FaInstagram className="mr-1" />
                {engagement.likes.toLocaleString()}
              </span>
            )}
            {engagement.comments !== undefined && (
              <span className="flex items-center">
                <FaInstagram className="mr-1" />
                {engagement.comments.toLocaleString()}
              </span>
            )}
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {engagement.likes !== undefined && (
              <span className="flex items-center">
                <FaBookmark className="mr-1" />
                {engagement.likes.toLocaleString()}
              </span>
            )}
          </div>
        );
    }
  };

  // Color de borde según el sentimiento
  const getBorderColor = () => {
    switch(sentiment) {
      case 'positivo':
        return 'border-green-500';
      case 'negativo':
        return 'border-red-500';
      case 'neutral':
      default:
        return 'border-gray-300 dark:border-gray-700';
    }
  };

  return (
    <div className={`border-l-4 ${getBorderColor()} pl-4 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {/* Avatar o inicial del autor */}
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3 overflow-hidden">
            {authorImage ? (
              <img src={authorImage} alt={author} className="h-full w-full object-cover" />
            ) : (
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {author.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          {/* Información del autor */}
          <div>
            <div className="flex items-center">
              <span className="font-medium text-gray-900 dark:text-white">{author}</span>
              {authorUsername && (
                <span className="ml-1 text-gray-500 dark:text-gray-400 text-sm">
                  @{authorUsername}
                </span>
              )}
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">{date}</span>
            </div>
            <div className="flex items-center mt-0.5">
              <span className="text-lg mr-1">{getNetworkIcon()}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {network === 'news' ? 'Noticia' : network === 'x' ? 'X' : network}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {getSentimentBadge()}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1">
            <span className="text-xs font-medium" title="Relevancia">
              {relevance}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Contenido de la mencion */}
      <div className="my-3">
        <p className="text-gray-800 dark:text-gray-200">{content}</p>
      </div>
      
      {/* Engagement */}
      <div className="mt-2">
        {getEngagementIcons()}
      </div>
    </div>
  );
};

// Datos para mostrar en la interfaz
const menciones: MencionItemProps[] = [
  {
    id: '1',
    author: 'María García',
    authorUsername: 'MariaGarcia',
    content: 'Las propuestas de @CarlosRodriguezG sobre educación son exactamente lo que necesitamos. Por fin alguien que entiende los problemas reales! #EleccionesSenado2026',
    date: 'Hace 35 minutos',
    network: 'x',
    sentiment: 'positivo',
    engagement: {
      likes: 48,
      reposts: 12,
      comments: 5
    },
    relevance: 82
  },
  {
    id: '2',
    author: 'Juan Política',
    authorUsername: 'JuanPolitica',
    content: 'Hoy estuve en el debate con @CarlosRodriguezG y otros candidatos al Senado. Interesantes propuestas de todos. ¿Qué opinan ustedes? #DebatePolítico #Elecciones',
    date: 'Hace 2 horas',
    network: 'instagram',
    sentiment: 'neutral',
    engagement: {
      likes: 126,
      comments: 34
    },
    relevance: 75
  },
  {
    id: '3',
    author: 'Pedro Sánchez',
    content: 'No estoy de acuerdo con lo que plantea Carlos Rodríguez sobre seguridad. Su plan no aborda los problemas estructurales y solo ofrece soluciones temporales. Necesitamos propuestas más serias.',
    date: 'Hace 5 horas',
    network: 'facebook',
    sentiment: 'negativo',
    engagement: {
      likes: 23,
      comments: 18,
      shares: 4
    },
    relevance: 65
  },
  {
    id: '4',
    author: 'El Tiempo',
    content: 'Carlos Rodríguez presenta su plan de gobierno para el Senado con énfasis en desarrollo sostenible. "Necesitamos políticas que garanticen el futuro de las próximas generaciones", afirmó durante el evento de lanzamiento.',
    date: 'Hace 8 horas',
    network: 'news',
    sentiment: 'positivo',
    engagement: {
      comments: 8,
      shares: 15
    },
    relevance: 90
  },
  {
    id: '5',
    author: 'Laura Mendoza',
    authorUsername: 'LauraMen',
    content: '¡Muy impresionada con la propuesta económica de @CarlosRodriguezG! Su enfoque en emprendimiento y desarrollo sostenible es justo lo que Colombia necesita. #FuturoSostenible #Elecciones2026',
    date: 'Hace 12 horas',
    network: 'x',
    sentiment: 'positivo',
    engagement: {
      likes: 87,
      reposts: 35,
      comments: 12
    },
    relevance: 88
  },
  {
    id: '6',
    author: 'Roberto García',
    authorUsername: 'RobGarcia',
    content: 'He analizado todas las propuestas de los candidatos al Senado y tengo serias dudas sobre la viabilidad fiscal del plan de @CarlosRodriguezG. Los números simplemente no cuadran. #AnálisisEconómico',
    date: 'Hace 18 horas',
    network: 'x',
    sentiment: 'negativo',
    engagement: {
      likes: 42,
      reposts: 8,
      comments: 16
    },
    relevance: 72
  },
  {
    id: '7',
    author: 'Ana Martínez',
    content: 'Asistí al foro ambiental donde Carlos Rodríguez presentó su plan. Quedé gratamente sorprendida con su conocimiento sobre energías renovables y conservación. Comparto algunas fotos del evento.',
    date: 'Hace 1 día',
    network: 'facebook',
    sentiment: 'positivo',
    engagement: {
      likes: 124,
      comments: 28,
      shares: 15
    },
    relevance: 79
  },
  {
    id: '8',
    author: 'Economía Hoy',
    content: 'Análisis: El impacto fiscal de las propuestas de Carlos Rodríguez para el Senado. Expertos debaten sobre la viabilidad y sostenibilidad de las iniciativas económicas del candidato.',
    date: 'Hace 1 día',
    network: 'news',
    sentiment: 'neutral',
    engagement: {
      comments: 15,
      shares: 22
    },
    relevance: 84
  },
  {
    id: '9',
    author: 'Diego Lopera',
    content: '¡El discurso de Carlos Rodríguez en Medellín fue espectacular! Sus propuestas para mejorar la educación superior y el apoyo a emprendedores son exactamente lo que los jóvenes necesitamos. #FuturoJoven',
    date: 'Hace 2 días',
    network: 'instagram',
    sentiment: 'positivo',
    engagement: {
      likes: 235,
      comments: 42
    },
    relevance: 77
  },
  {
    id: '10',
    author: 'Camila Torres',
    authorUsername: 'CamiTorres',
    content: 'Las propuestas de movilidad sostenible de @CarlosRodriguezG son interesantes, pero ¿cómo se financiarían? Necesitamos más detalles sobre las fuentes de recursos. #MovilidadSostenible #Elecciones',
    date: 'Hace 2 días',
    network: 'x',
    sentiment: 'neutral',
    engagement: {
      likes: 56,
      reposts: 7,
      comments: 19
    },
    relevance: 68
  }
];

export default function MencionesPage() {
  const [filteredMenciones, setFilteredMenciones] = useState(menciones);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [selectedSentiment, setSelectedSentiment] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recientes');
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'grid'

  // Red social total de menciones
  const networkCounts = {
    x: menciones.filter(m => m.network === 'x').length,
    facebook: menciones.filter(m => m.network === 'facebook').length,
    instagram: menciones.filter(m => m.network === 'instagram').length,
    linkedin: menciones.filter(m => m.network === 'linkedin').length,
    tiktok: menciones.filter(m => m.network === 'tiktok').length,
    news: menciones.filter(m => m.network === 'news').length
  };

  // Función para filtrar menciones
  const filterMenciones = () => {
    let result = [...menciones];
    
    // Filtrar por texto de búsqueda
    if (searchQuery) {
      result = result.filter(m => 
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.authorUsername && m.authorUsername.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filtrar por redes sociales
    if (selectedNetworks.length > 0) {
      result = result.filter(m => selectedNetworks.includes(m.network));
    }
    
    // Filtrar por sentimiento
    if (selectedSentiment.length > 0) {
      result = result.filter(m => selectedSentiment.includes(m.sentiment));
    }
    
    // Ordenar resultados
    switch(sortBy) {
      case 'recientes':
        // Ya están ordenados por recientes
        break;
      case 'relevancia':
        result.sort((a, b) => b.relevance - a.relevance);
        break;
      case 'engagement':
        result.sort((a, b) => {
          const engA = (a.engagement.likes || 0) + (a.engagement.comments || 0) + (a.engagement.shares || 0) + (a.engagement.reposts || 0);
          const engB = (b.engagement.likes || 0) + (b.engagement.comments || 0) + (b.engagement.shares || 0) + (b.engagement.reposts || 0);
          return engB - engA;
        });
        break;
      default:
        break;
    }
    
    setFilteredMenciones(result);
  };

  // Aplicar filtros cuando cambien
  React.useEffect(() => {
    filterMenciones();
  }, [searchQuery, selectedNetworks, selectedSentiment, sortBy]);

  // Actualizar redes seleccionadas
  const toggleNetwork = (network: string) => {
    if (selectedNetworks.includes(network)) {
      setSelectedNetworks(selectedNetworks.filter(n => n !== network));
    } else {
      setSelectedNetworks([...selectedNetworks, network]);
    }
  };

  // Actualizar sentimientos seleccionados
  const toggleSentiment = (sentiment: string) => {
    if (selectedSentiment.includes(sentiment)) {
      setSelectedSentiment(selectedSentiment.filter(s => s !== sentiment));
    } else {
      setSelectedSentiment([...selectedSentiment, sentiment]);
    }
  };

  return (
    <div className="py-6 px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menciones</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitoreo de menciones en redes sociales y medios digitales
          </p>
        </div>
        

setFilteredMenciones(result);
};
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Facebook</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{networkCounts.facebook}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <span className="text-[#1877F2]">
              <FaFacebook />
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Instagram</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{networkCounts.instagram}</p>
          </div>
          <div className="bg-pink-100 dark:bg-pink-900 p-3 rounded-full">
            <span className="text-[#E4405F]">
              <FaInstagram />
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">LinkedIn</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{networkCounts.linkedin}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <span className="text-[#0A66C2]">
              <FaLinkedin />
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">TikTok</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{networkCounts.tiktok}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
            <span className="text-black dark:text-white">
              <FaTiktok />
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Noticias</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{networkCounts.news}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
            <span className="text-gray-700 dark:text-gray-300">
              <FaNewspaper />
            </span>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Buscar menciones, autores, hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md">
                <FaSort />
                <span>Ordenar: {sortBy === 'recientes' ? 'Recientes' : sortBy === 'relevancia' ? 'Relevancia' : 'Engagement'}</span>
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 hidden">
                <div className="py-1">
                  <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left" onClick={() => setSortBy('recientes')}>Más recientes</button>
                  <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left" onClick={() => setSortBy('relevancia')}>Por relevancia</button>
                  <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left" onClick={() => setSortBy('engagement')}>Mayor engagement</button>
                </div>
              </div>
            </div>
            
            <button 
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              onClick={() => setViewMode('list')}
              title="Vista de lista"
            >
              <FaListAlt />
            </button>
            
            <button 
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              onClick={() => setViewMode('grid')}
              title="Vista de cuadrícula"
            >
              <FaTh />
            </button>
            
            <button 
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300"
              title="Filtros"
            >
              <FaFilter />
            </button>
          </div>
        </div>
        
        {/* Filtros por red social y sentimiento */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Redes sociales:</p>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`flex items-center rounded-full px-3 py-1 text-sm ${selectedNetworks.includes('x') ? 'bg-black text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => toggleNetwork('x')
              >
                <img src="/images/social/x-logo.png" alt="X" className="w-4 h-4 mr-1" />
                X
              </button>
              <button 
                className={`flex items-center rounded-full px-3 py-1 text-sm ${selectedNetworks.includes('facebook') ? 'bg-[#1877F2] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => toggleNetwork('facebook')}
              >
                <FaFacebook className="mr-1" />
                Facebook
              </button>
              <button 
                className={`flex items-center rounded-full px-3 py-1 text-sm ${selectedNetworks.includes('instagram') ? 'bg-[#E4405F] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => toggleNetwork('instagram')}
              >
                <FaInstagram className="mr-1" />
                Instagram
              </button>
              <button 
                className={`flex items-center rounded-full px-3 py-1 text-sm ${selectedNetworks.includes('linkedin') ? 'bg-[#0A66C2] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => toggleNetwork('linkedin')}
              >
                <FaLinkedin className="mr-1" />
                LinkedIn
              </button>
              <button 
                className={`flex items-center rounded-full px-3 py-1 text-sm ${selectedNetworks.includes('tiktok') ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => toggleNetwork('tiktok')}
              >
                <FaTiktok className="mr-1" />
                TikTok
              </button>
              <button 
                className={`flex items-center rounded-full px-3 py-1 text-sm ${selectedNetworks.includes('news') ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => toggleNetwork('news')}
              >
                <FaNewspaper className="mr-1" />
                Noticias
              </button>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sentimiento:</p>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`rounded-full px-3 py-1 text-sm ${selectedSentiment.includes('positivo') ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}
                onClick={() => toggleSentiment('positivo')}
              >
                Positivo
              </button>
              <button 
                className={`rounded-full px-3 py-1 text-sm ${selectedSentiment.includes('neutral') ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                onClick={() => toggleSentiment('neutral')}
              >
                Neutral
              </button>
              <button 
                className={`rounded-full px-3 py-1 text-sm ${selectedSentiment.includes('negativo') ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                onClick={() => toggleSentiment('negativo')}
              >
                Negativo
              </button>
            </div>
          </div>
          
          <div className="ml-auto">
            <button className="flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
              <FaBookmark className="mr-1" />
              Guardar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de menciones */}
      <div className="space-y-4">
        {filteredMenciones.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No se encontraron menciones que coincidan con los criterios de búsqueda.
            </p>
            <button 
              className="mt-4 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
              onClick={() => {
                setSearchQuery('');
                setSelectedNetworks([]);
                setSelectedSentiment([]);
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          filteredMenciones.map((mencion) => (
            <MencionItem key={mencion.id} {...mencion} />
          ))
        )}
      </div>
    </div>
  );
}
