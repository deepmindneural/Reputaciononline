"use client";

import React, { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaRegEdit,
  FaTrashAlt,
  FaEye,
  FaFilter,
  FaPlus,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaSort,
  FaChartLine
} from 'react-icons/fa';

// Tipos para las publicaciones
type SocialNetworkType = 'x' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok';
type PublicacionStatus = 'publicado' | 'programado' | 'borrador';

interface Publicacion {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
  redes: SocialNetworkType[];
  estado: PublicacionStatus;
  engagement: {
    likes: number;
    comentarios: number;
    compartidos: number;
  };
  imagen?: string;
}

// Componente para mostrar una tarjeta de publicación
const PublicacionCard = ({ publicacion }: { publicacion: Publicacion }) => {
  // Función para obtener los iconos de las redes sociales
  const getNetworkIcons = () => {
    return (
      <div className="flex space-x-1">
        {publicacion.redes.map((red) => {
          switch(red) {
            case 'x':
              return <img key={red} src="/images/social/x-logo.png" alt="X" className="w-4 h-4" />;
            case 'facebook':
              return <FaFacebook key={red} className="text-[#1877F2]" />;
            case 'instagram':
              return <FaInstagram key={red} className="text-[#E1306C]" />;
            case 'linkedin':
              return <FaLinkedin key={red} className="text-[#0077B5]" />;
            case 'tiktok':
              return <FaTiktok key={red} className="text-black dark:text-white" />;
            default:
              return null;
          }
        })}
      </div>
    );
  };

  // Función para obtener la clase de color según el estado
  const getStatusClass = () => {
    switch(publicacion.estado) {
      case 'publicado':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'programado':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'borrador':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Imagen de la publicación si existe */}
      {publicacion.imagen && (
        <img src={publicacion.imagen} alt={publicacion.titulo} className="w-full h-40 object-cover" />
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{publicacion.titulo}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass()}`}>
            {publicacion.estado === 'publicado' ? 'Publicado' : 
             publicacion.estado === 'programado' ? 'Programado' : 'Borrador'}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {publicacion.contenido}
        </p>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <FaCalendarAlt className="mr-1" />
            <span>{publicacion.fecha}</span>
          </div>
          {getNetworkIcons()}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between">
            <div className="flex space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <span className="mr-1">👍</span> {publicacion.engagement.likes}
              </span>
              <span className="flex items-center">
                <span className="mr-1">💬</span> {publicacion.engagement.comentarios}
              </span>
              <span className="flex items-center">
                <span className="mr-1">🔄</span> {publicacion.engagement.compartidos}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                <FaEye />
              </button>
              <button className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
                <FaRegEdit />
              </button>
              <button className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                <FaTrashAlt />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Datos de ejemplo para mostrar publicaciones
const publicacionesData: Publicacion[] = [
  {
    id: '1',
    titulo: 'Propuesta de educación para el futuro',
    contenido: 'Hoy presentamos nuestra propuesta integral para mejorar el sistema educativo en Colombia. #EducaciónParaTodos #EleccionesSenado2026',
    fecha: '18 abril, 2025 - 10:30',
    redes: ['x', 'facebook', 'instagram'],
    estado: 'publicado',
    engagement: {
      likes: 256,
      comentarios: 48,
      compartidos: 32
    },
    imagen: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: '2',
    titulo: 'Desarrollo sostenible para nuestras comunidades',
    contenido: 'El desarrollo económico debe ir de la mano con la protección ambiental. Nuestra propuesta contempla iniciativas de economía circular y energías renovables. #DesarrolloSostenible',
    fecha: '19 abril, 2025 - 08:15',
    redes: ['x', 'linkedin'],
    estado: 'programado',
    engagement: {
      likes: 0,
      comentarios: 0,
      compartidos: 0
    }
  },
  {
    id: '3',
    titulo: 'Seguridad ciudadana: una prioridad',
    contenido: 'Trabajando en nuestra propuesta de seguridad ciudadana con un enfoque integral que combina prevención, tecnología y participación comunitaria.',
    fecha: 'Sin fecha',
    redes: ['facebook'],
    estado: 'borrador',
    engagement: {
      likes: 0,
      comentarios: 0,
      compartidos: 0
    }
  },
  {
    id: '4',
    titulo: 'Invitación a debate público',
    contenido: 'Este jueves estaremos participando en el debate sobre políticas ambientales. ¡No te lo pierdas! Transmisión en vivo por nuestras redes sociales. #DebateAmbiental',
    fecha: '20 abril, 2025 - 18:00',
    redes: ['x', 'facebook', 'instagram', 'linkedin'],
    estado: 'programado',
    engagement: {
      likes: 0,
      comentarios: 0,
      compartidos: 0
    },
    imagen: 'https://images.unsplash.com/photo-1551817958-20204d6ab212?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: '5',
    titulo: 'Agradecimiento por el apoyo',
    contenido: 'Queremos agradecer a todas las personas que nos han acompañado en este camino. Su apoyo es fundamental para construir el país que soñamos. #Gratitud',
    fecha: '15 abril, 2025 - 15:45',
    redes: ['x', 'facebook', 'instagram'],
    estado: 'publicado',
    engagement: {
      likes: 423,
      comentarios: 67,
      compartidos: 51
    }
  }
];

// Página principal de publicaciones
export default function PublicacionesPage() {
  const [filtro, setFiltro] = useState<string>('todas');
  const [orden, setOrden] = useState<string>('recientes');
  const [redSocial, setRedSocial] = useState<string>('todas');
  
  // Filtrar y ordenar publicaciones
  const publicacionesFiltradas = () => {
    let resultado = [...publicacionesData];
    
    // Filtrar por estado
    if (filtro !== 'todas') {
      resultado = resultado.filter(p => p.estado === filtro);
    }
    
    // Filtrar por red social
    if (redSocial !== 'todas') {
      resultado = resultado.filter(p => p.redes.includes(redSocial as SocialNetworkType));
    }
    
    // Ordenar las publicaciones
    if (orden === 'recientes') {
      resultado.sort((a, b) => a.fecha === 'Sin fecha' ? 1 : b.fecha === 'Sin fecha' ? -1 : 
        new Date(b.fecha.split(' - ')[0]).getTime() - new Date(a.fecha.split(' - ')[0]).getTime());
    } else if (orden === 'engagement') {
      resultado.sort((a, b) => {
        const engA = a.engagement.likes + a.engagement.comentarios + a.engagement.compartidos;
        const engB = b.engagement.likes + b.engagement.comentarios + b.engagement.compartidos;
        return engB - engA;
      });
    }
    
    return resultado;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Publicaciones</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona y programa el contenido para tus redes sociales
          </p>
        </div>
        
        <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
          <FaPlus className="mr-2" />
          Nueva Publicación
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-2 rounded-md ${filtro === 'todas' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              onClick={() => setFiltro('todas')}
            >
              Todas
            </button>
            
            <button 
              className={`px-3 py-2 rounded-md ${filtro === 'publicado' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              onClick={() => setFiltro('publicado')}
            >
              Publicadas
            </button>
            
            <button 
              className={`px-3 py-2 rounded-md ${filtro === 'programado' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              onClick={() => setFiltro('programado')}
            >
              Programadas
            </button>
            
            <button 
              className={`px-3 py-2 rounded-md ${filtro === 'borrador' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              onClick={() => setFiltro('borrador')}
            >
              Borradores
            </button>
          </div>
          
          <div className="flex-1 md:flex md:items-center md:justify-end space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Red:</span>
              <select 
                className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-800 dark:text-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 p-2 text-sm"
                value={redSocial}
                onChange={(e) => setRedSocial(e.target.value)}
              >
                <option value="todas">Todas</option>
                <option value="x">X</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Ordenar:</span>
              <select 
                className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-800 dark:text-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 p-2 text-sm"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option value="recientes">Más recientes</option>
                <option value="engagement">Mayor engagement</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {publicacionesFiltradas().length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No se encontraron publicaciones con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicacionesFiltradas().map(publicacion => (
            <PublicacionCard key={publicacion.id} publicacion={publicacion} />
          ))}
        </div>
      )}

      {/* Estadísticas de rendimiento */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FaChartLine className="mr-2 text-primary-500" />
          Rendimiento de publicaciones
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Las métricas detalladas de rendimiento están disponibles en el módulo de Análisis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total interacciones</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">877</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Publicaciones activas</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Programadas</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
