"use client";

import React, { useState } from 'react';
import { 
  FaDownload, 
  FaRegFilePdf, 
  FaRegFileExcel,
  FaRegFileAlt,
  FaFilter,
  FaCalendarAlt,
  FaChartLine,
  FaRegClone,
  FaPlus
} from 'react-icons/fa';

// Tipos para los reportes
type ReportType = 'analisis' | 'menciones' | 'audiencia' | 'tendencias' | 'personalizado';
type ReportFormat = 'pdf' | 'excel' | 'csv';

interface Reporte {
  id: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  tipo: ReportType;
  formatos: ReportFormat[];
  tamano?: string;
  vistas: number;
  nuevo?: boolean;
}

// Componente para tarjeta de reporte
const ReporteCard = ({ reporte }: { reporte: Reporte }) => {
  // Obtener icono segu00fan tipo de reporte
  const getTipoIcon = () => {
    switch(reporte.tipo) {
      case 'analisis':
        return <FaChartLine className="text-primary-500" />;
      case 'menciones':
        return <FaRegClone className="text-indigo-500" />;
      case 'audiencia':
        return <FaChartLine className="text-green-500" />;
      case 'tendencias':
        return <FaChartLine className="text-orange-500" />;
      case 'personalizado':
        return <FaRegFileAlt className="text-gray-500" />;
      default:
        return <FaRegFileAlt />;
    }
  };
  
  // Obtener icono segu00fan formato de archivo
  const getFormatoIcon = (formato: ReportFormat) => {
    switch(formato) {
      case 'pdf':
        return <FaRegFilePdf className="text-red-600" />;
      case 'excel':
        return <FaRegFileExcel className="text-green-600" />;
      case 'csv':
        return <FaRegFileAlt className="text-gray-600" />;
      default:
        return <FaRegFileAlt />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 transition-transform hover:scale-[1.01]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start">
          <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3">
            {getTipoIcon()}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              {reporte.nombre}
              {reporte.nuevo && (
                <span className="ml-2 text-xs px-2 py-0.5 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full">
                  Nuevo
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{reporte.descripcion}</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 p-2">
          <FaDownload />
        </button>
      </div>
      
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center mr-4">
          <FaCalendarAlt className="mr-1" />
          <span>{reporte.fecha}</span>
        </div>
        {reporte.tamano && (
          <div className="mr-4">
            <span>{reporte.tamano}</span>
          </div>
        )}
        <div>
          <span>{reporte.vistas} vistas</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {reporte.formatos.map(formato => (
            <button 
              key={formato}
              className="flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
            >
              {getFormatoIcon(formato)}
              <span className="ml-1 uppercase">{formato}</span>
            </button>
          ))}
        </div>
        
        <div className="text-xs text-primary-600 dark:text-primary-400 font-medium cursor-pointer hover:underline">
          Ver detalles
        </div>
      </div>
    </div>
  );
};

// Datos de ejemplo para mostrar reportes
const reportesData: Reporte[] = [
  {
    id: '1',
    nombre: 'Anu00e1lisis de Sentimiento',
    descripcion: 'Reporte detallado del anu00e1lisis de sentimiento en todas las redes sociales',
    fecha: '18 abril, 2025',
    tipo: 'analisis',
    formatos: ['pdf', 'excel'],
    tamano: '2.4 MB',
    vistas: 12,
    nuevo: true
  },
  {
    id: '2',
    nombre: 'Menciones en redes - Marzo 2025',
    descripcion: 'Compilaciu00f3n de todas las menciones en X, Facebook e Instagram',
    fecha: '05 abril, 2025',
    tipo: 'menciones',
    formatos: ['pdf', 'excel', 'csv'],
    tamano: '4.1 MB',
    vistas: 8
  },
  {
    id: '3',
    nombre: 'Anu00e1lisis demogru00e1fico',
    descripcion: 'Perfil demogru00e1fico detallado de la audiencia en todas las plataformas',
    fecha: '22 marzo, 2025',
    tipo: 'audiencia',
    formatos: ['pdf', 'excel'],
    tamano: '1.8 MB',
    vistas: 15
  },
  {
    id: '4',
    nombre: 'Tendencias - Educaciu00f3n y Medio Ambiente',
    descripcion: 'Anu00e1lisis de tendencias relacionadas con temas educativos y ambientales',
    fecha: '10 marzo, 2025',
    tipo: 'tendencias',
    formatos: ['pdf'],
    tamano: '1.2 MB',
    vistas: 6
  },
  {
    id: '5',
    nombre: 'Reporte Comparativo con Competidores',
    descripcion: 'Anu00e1lisis comparativo con otros candidatos en tu00e9rminos de menciones y engagement',
    fecha: '01 marzo, 2025',
    tipo: 'personalizado',
    formatos: ['pdf', 'excel'],
    tamano: '3.5 MB',
    vistas: 23
  },
  {
    id: '6',
    nombre: 'Resumen Mensual - Febrero 2025',
    descripcion: 'Resumen de actividad, menciones y crecimiento durante el mes de febrero',
    fecha: '02 marzo, 2025',
    tipo: 'analisis',
    formatos: ['pdf', 'excel'],
    tamano: '2.8 MB',
    vistas: 18
  }
];

// Pu00e1gina principal de reportes
export default function ReportesPage() {
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroFormato, setFiltroFormato] = useState<string>('todos');
  
  // Filtrar reportes
  const reportesFiltrados = () => {
    let resultado = [...reportesData];
    
    // Filtrar por tipo
    if (filtroTipo !== 'todos') {
      resultado = resultado.filter(r => r.tipo === filtroTipo);
    }
    
    // Filtrar por formato
    if (filtroFormato !== 'todos') {
      resultado = resultado.filter(r => r.formatos.includes(filtroFormato as ReportFormat));
    }
    
    // Ordenar por fecha (mu00e1s recientes primero)
    resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    
    return resultado;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reportes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Exporta y analiza datos de manera detallada con informes personalizados
          </p>
        </div>
        
        <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
          <FaPlus className="mr-2" />
          Nuevo Reporte
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center">
            <FaFilter className="text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Filtros:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-800 dark:text-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 p-2 text-sm"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="analisis">Anu00e1lisis</option>
              <option value="menciones">Menciones</option>
              <option value="audiencia">Audiencia</option>
              <option value="tendencias">Tendencias</option>
              <option value="personalizado">Personalizados</option>
            </select>
            
            <select
              className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-800 dark:text-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 p-2 text-sm"
              value={filtroFormato}
              onChange={(e) => setFiltroFormato(e.target.value)}
            >
              <option value="todos">Todos los formatos</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
      </div>
      
      {reportesFiltrados().length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No se encontraron reportes con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportesFiltrados().map(reporte => (
            <ReporteCard key={reporte.id} reporte={reporte} />
          ))}
        </div>
      )}
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">u00bfNecesitas un reporte personalizado?</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Puedes crear reportes personalizados seleccionando las mu00e9tricas, peru00edodos y formatos que necesites. Tambiu00e9n puedes programar la generaciu00f3n automu00e1tica de reportes periu00f3dicos.
        </p>
        <div className="mt-4">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
            Crear Reporte Personalizado
          </button>
        </div>
      </div>
    </div>
  );
}
