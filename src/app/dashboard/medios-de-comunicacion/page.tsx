"use client";

import React, { useState } from 'react';
import { Radio, Globe, Plus, Settings, ToggleLeft, ToggleRight, ExternalLink, Trash2 } from 'lucide-react';

interface MediaSource {
  id: string;
  name: string;
  type: 'traditional' | 'digital' | 'custom';
  url?: string;
  isActive: boolean;
  description: string;
}

const MediosComunicacionPage = () => {
  const [mediaSources, setMediaSources] = useState<MediaSource[]>([
    {
      id: '1',
      name: 'El Tiempo',
      type: 'traditional',
      url: 'https://www.eltiempo.com',
      isActive: true,
      description: 'Periódico nacional de Colombia'
    },
    {
      id: '2',
      name: 'El Espectador',
      type: 'traditional',
      url: 'https://www.elespectador.com',
      isActive: true,
      description: 'Diario nacional colombiano'
    },
    {
      id: '3',
      name: 'Semana',
      type: 'traditional',
      url: 'https://www.semana.com',
      isActive: false,
      description: 'Revista semanal de noticias'
    },
    {
      id: '4',
      name: 'Caracol Radio',
      type: 'traditional',
      url: 'https://www.caracol.com.co',
      isActive: true,
      description: 'Cadena radial nacional'
    },
    {
      id: '5',
      name: 'RCN Radio',
      type: 'traditional',
      url: 'https://www.rcnradio.com',
      isActive: false,
      description: 'Red de emisoras de radio'
    },
    {
      id: '6',
      name: 'Blu Radio',
      type: 'digital',
      url: 'https://www.bluradio.com',
      isActive: true,
      description: 'Emisora digital de noticias'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaDescription, setNewMediaDescription] = useState('');

  const toggleMediaSource = (id: string) => {
    setMediaSources(prev => 
      prev.map(media => 
        media.id === id ? { ...media, isActive: !media.isActive } : media
      )
    );
  };

  const addCustomMedia = () => {
    if (newMediaName.trim() && newMediaUrl.trim()) {
      const newMedia: MediaSource = {
        id: Date.now().toString(),
        name: newMediaName.trim(),
        type: 'custom',
        url: newMediaUrl.trim(),
        isActive: true,
        description: newMediaDescription.trim() || 'Medio personalizado'
      };
      
      setMediaSources(prev => [...prev, newMedia]);
      setNewMediaName('');
      setNewMediaUrl('');
      setNewMediaDescription('');
      setShowAddForm(false);
    }
  };

  const removeCustomMedia = (id: string) => {
    setMediaSources(prev => prev.filter(media => media.id !== id));
  };

  const activeCount = mediaSources.filter(media => media.isActive).length;
  const totalCount = mediaSources.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#01257D]/10 rounded-lg">
              <Radio className="h-6 w-6 text-[#01257D]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Medios de Comunicación
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gestiona las fuentes de monitoreo de medios tradicionales y digitales
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#01257D]">{activeCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">de {totalCount} activos</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Radio className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Medios Tradicionales</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {mediaSources.filter(m => m.type === 'traditional' && m.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Medios Digitales</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {mediaSources.filter(m => m.type === 'digital' && m.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Plus className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Medios Personalizados</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {mediaSources.filter(m => m.type === 'custom' && m.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Media Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#01257D] hover:bg-[#013AAA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01257D] transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Medio Personalizado
        </button>
      </div>

      {/* Add Custom Media Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Agregar Medio Personalizado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Medio
              </label>
              <input
                type="text"
                value={newMediaName}
                onChange={(e) => setNewMediaName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#01257D] focus:border-[#01257D] dark:bg-gray-700 dark:text-white"
                placeholder="Ej: Mi Blog Favorito"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL del Medio
              </label>
              <input
                type="url"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#01257D] focus:border-[#01257D] dark:bg-gray-700 dark:text-white"
                placeholder="https://ejemplo.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción (Opcional)
              </label>
              <input
                type="text"
                value={newMediaDescription}
                onChange={(e) => setNewMediaDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#01257D] focus:border-[#01257D] dark:bg-gray-700 dark:text-white"
                placeholder="Descripción del medio de comunicación"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01257D]"
            >
              Cancelar
            </button>
            <button
              onClick={addCustomMedia}
              disabled={!newMediaName.trim() || !newMediaUrl.trim()}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#01257D] hover:bg-[#013AAA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01257D] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agregar Medio
            </button>
          </div>
        </div>
      )}

      {/* Media Sources List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Fuentes de Medios Configuradas
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Activa o desactiva las fuentes de monitoreo según tus necesidades
          </p>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {mediaSources.map((media) => (
            <div key={media.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    media.type === 'traditional' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    media.type === 'digital' ? 'bg-green-100 dark:bg-green-900/20' :
                    'bg-purple-100 dark:bg-purple-900/20'
                  }`}>
                    {media.type === 'traditional' ? (
                      <Radio className={`h-5 w-5 ${
                        media.type === 'traditional' ? 'text-blue-600 dark:text-blue-400' :
                        media.type === 'digital' ? 'text-green-600 dark:text-green-400' :
                        'text-purple-600 dark:text-purple-400'
                      }`} />
                    ) : (
                      <Globe className={`h-5 w-5 ${
                        media.type === 'digital' ? 'text-green-600 dark:text-green-400' :
                        'text-purple-600 dark:text-purple-400'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {media.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        media.type === 'traditional' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        media.type === 'digital' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                      }`}>
                        {media.type === 'traditional' ? 'Tradicional' :
                         media.type === 'digital' ? 'Digital' : 'Personalizado'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {media.description}
                    </p>
                    {media.url && (
                      <a 
                        href={media.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-[#01257D] hover:text-[#013AAA] mt-1"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {media.url}
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {media.type === 'custom' && (
                    <button
                      onClick={() => removeCustomMedia(media.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Eliminar medio personalizado"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => toggleMediaSource(media.id)}
                    className="flex items-center space-x-2"
                  >
                    {media.isActive ? (
                      <ToggleRight className="h-6 w-6 text-[#01257D]" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediosComunicacionPage;
