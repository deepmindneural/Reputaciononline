"use client";

import React, { useState } from 'react';
import { 
  FaFileAlt, 
  FaDownload, 
  FaCalendarAlt, 
  FaChartLine,
  FaUsers,
  FaComments,
  FaStar,
  FaExclamationTriangle,
  FaRegFileAlt,
  FaFileExport,
  FaRegCalendarAlt,
  FaFilter
} from 'react-icons/fa';
import Link from 'next/link';

// Tipo para los informes
interface Informe {
  id: string;
  titulo: string;
  tipo: 'semanal' | 'mensual' | 'personalizado';
  fecha: string;
  descripcion: string;
  formato: 'pdf' | 'excel' | 'pptx';
  tamano: string;
  estado: 'listo' | 'procesando' | 'programado';
}

// Datos simulados para los informes
const informesData: Informe[] = [
  {
    id: '1',
    titulo: 'Reporte de Reputaciu00f3n Abril 2025',
    tipo: 'mensual',
    fecha: '30/04/2025',
    descripcion: 'Anu00e1lisis completo de menciones y sentimientos en redes sociales durante abril 2025',
    formato: 'pdf',
    tamano: '4.2 MB',
    estado: 'listo',
  },
  {
    id: '2',
    titulo: 'Tendencias Hashtags - Semana 16',
    tipo: 'semanal',
    fecha: '22/04/2025',
    descripcion: 'Anu00e1lisis de los hashtags mu00e1s relevantes en la semana 16 de 2025',
    formato: 'excel',
    tamano: '2.8 MB',
    estado: 'listo',
  },
  {
    id: '3',
    titulo: 'Comparativo Competidores Polu00edticos',
    tipo: 'personalizado',
    fecha: '15/04/2025',
    descripcion: 'Comparaciu00f3n de presencia digital entre Juan Pu00e9rez y otros candidatos al senado',
    formato: 'pdf',
    tamano: '8.5 MB',
    estado: 'listo',
  },
  {
    id: '4',
    titulo: 'Reporte de Reputaciu00f3n Marzo 2025',
    tipo: 'mensual',
    fecha: '31/03/2025',
    descripcion: 'Anu00e1lisis completo de menciones y sentimientos en redes sociales durante marzo 2025',
    formato: 'pdf',
    tamano: '4.5 MB',
    estado: 'listo',
  },
  {
    id: '5',
    titulo: 'Impacto del Debate Presidencial',
    tipo: 'personalizado',
    fecha: '18/03/2025',
    descripcion: 'Anu00e1lisis del impacto y repercusiones del debate presidencial del 15 de marzo',
    formato: 'pptx',
    tamano: '12.3 MB',
    estado: 'listo',
  },
  {
    id: '6',
    titulo: 'Reporte de Mayo 2025',
    tipo: 'mensual',
    fecha: '31/05/2025',
    descripcion: 'Anu00e1lisis completo de menciones y sentimientos en redes sociales durante mayo 2025',
    formato: 'pdf',
    tamano: '4.8 MB',
    estado: 'programado',
  },
  {
    id: '7',
    titulo: 'Tendencias Hashtags - Semana 17',
    tipo: 'semanal',
    fecha: '29/04/2025',
    descripcion: 'Anu00e1lisis de los hashtags mu00e1s relevantes en la semana 17 de 2025',
    formato: 'excel',
    tamano: '3.1 MB',
    estado: 'procesando',
  },
];

// Componente para cada tarjeta de informes
const InformeCard = ({ informe }: { informe: Informe }) => {
  // Funciu00f3n para obtener el icono segu00fan el formato
  const getFormatIcon = () => {
    switch(informe.formato) {
      case 'pdf':
        return (
          <div className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 p-2 rounded-md">
            <FaFileAlt />
          </div>
        );
      case 'excel':
        return (
          <div className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 p-2 rounded-md">
            <FaFileAlt />
          </div>
        );
      case 'pptx':
        return (
          <div className="bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400 p-2 rounded-md">
            <FaFileAlt />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 p-2 rounded-md">
            <FaFileAlt />
          </div>
        );
    }
  };

  // Funciu00f3n para obtener el badge de estado
  const getStatusBadge = () => {
    switch(informe.estado) {
      case 'listo':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
            Listo
          </span>
        );
      case 'procesando':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
            Procesando
          </span>
        );
      case 'programado':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs">
            Programado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          {getFormatIcon()}
          {getStatusBadge()}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{informe.titulo}</h3>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <FaCalendarAlt className="mr-1" />
          <span>{informe.fecha}</span>
          <span className="mx-2">•</span>
          <span className="capitalize">{informe.tipo}</span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {informe.descripcion}
        </p>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">{informe.tamano}</span>
          
          {informe.estado === 'listo' ? (
            <button className="flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
              <FaDownload className="mr-1" />
              Descargar
            </button>
          ) : (
            <button className="flex items-center text-gray-500 dark:text-gray-400 text-sm font-medium cursor-not-allowed">
              <FaDownload className="mr-1" />
              {informe.estado === 'procesando' ? 'Procesando...' : 'Programado'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para generar un nuevo informe
const NuevoInformeCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 dark:border-gray-700">
    <div className="p-6 flex flex-col items-center justify-center h-full text-center">
      <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
        <FaFileAlt className="text-xl" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Crear Nuevo Informe</h3>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        Genera un informe personalizado con los datos y mu00e9tricas que necesites
      </p>
      
      <button className="mt-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors">
        Generar Informe
      </button>
    </div>
  </div>
);

const InformesPage = () => {
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // Filtrar informes segu00fan los criterios seleccionados
  const informesFiltrados = informesData.filter(informe => {
    const cumpleTipo = filtroTipo === 'todos' || informe.tipo === filtroTipo;
    const cumpleEstado = filtroEstado === 'todos' || informe.estado === filtroEstado;
    return cumpleTipo && cumpleEstado;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Informes</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Reportes detallados sobre tu reputaciu00f3n online y presencia en redes sociales
        </p>
      </header>

      {/* Filtros y controles */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm py-1 px-3 flex items-center space-x-2">
            <FaFileAlt className="text-gray-500" />
            <select 
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
              className="bg-transparent text-gray-700 dark:text-gray-300 font-medium focus:outline-none py-1"
            >
              <option value="todos">Todos los informes</option>
              <option value="semanal">Informes semanales</option>
              <option value="mensual">Informes mensuales</option>
              <option value="personalizado">Informes personalizados</option>
            </select>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm py-1 px-3 flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <select 
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
              className="bg-transparent text-gray-700 dark:text-gray-300 font-medium focus:outline-none py-1"
            >
              <option value="todos">Todos los estados</option>
              <option value="listo">Listos para descargar</option>
              <option value="procesando">En procesamiento</option>
              <option value="programado">Programados</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-4">
          <button className="bg-white dark:bg-gray-800 shadow-sm rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 font-medium flex items-center">
            <FaCalendarAlt className="mr-2" />
            Programar informe
          </button>
          
          <button className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2 font-medium flex items-center transition-colors">
            <FaFileAlt className="mr-2" />
            Nuevo informe
          </button>
        </div>
      </div>

      {/* Estadu00edsticas de informes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total informes</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">24</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              <FaFileAlt />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Descargas</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">156</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
              <FaDownload />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Programados</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3</h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400">
              <FaCalendarAlt />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cru00e9ditos restantes</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">34</h3>
            </div>
            <div className="p-3 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
              <FaChartLine />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de informes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuevoInformeCard />
        
        {informesFiltrados.map(informe => (
          <InformeCard key={informe.id} informe={informe} />
        ))}
        
        {informesFiltrados.length === 0 && (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <FaExclamationTriangle className="text-4xl text-yellow-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron informes</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              No hay informes que coincidan con los filtros seleccionados. Intenta modificar tus filtros o crea un nuevo informe.
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors">
              Crear Nuevo Informe
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InformesPage;
