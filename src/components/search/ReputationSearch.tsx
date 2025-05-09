"use client";

import React, { useState, useEffect, useRef } from 'react';
import { searchService, SearchParams, SearchResult, EntityType, SourceType } from '@/services/searchService';
import { Search, X, Filter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchResultItem from './SearchResultItem';
import EntityDetailView from './EntityDetailView';

export default function ReputationSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [entityType, setEntityType] = useState<EntityType>('all');
  const [sources, setSources] = useState<SourceType[]>(['all']);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<SearchResult | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Custom debounce hook
  const useDebounce = (value: string, delay: number) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
  };

  const debouncedSearch = useDebounce(query, 400);

  // Realizar la búsqueda cuando cambia la consulta con debounce
  useEffect(() => {
    if (debouncedSearch.trim() === '') {
      setResults([]);
      return;
    }
    
    const performSearch = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const searchParams: SearchParams = {
          query: debouncedSearch,
          entityType,
          sources,
          limit: 10,
          includeRatings: true,
          includeMentions: true,
          includeSocialProfiles: true,
        };
        
        const response = await searchService.search(searchParams);
        setResults(response.results);
      } catch (err) {
        console.error('Error en la búsqueda:', err);
        setError('Ocurrió un error al realizar la búsqueda. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    
    performSearch();
  }, [debouncedSearch, entityType, sources]);

  // Manejar el enfoque en el input cuando se abre el cuadro de búsqueda
  useEffect(() => {
    if (showSearchBox && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchBox]);

  // Asegurar que el input conserve el foco mientras el cuadro esté abierto
  useEffect(() => {
    if (showSearchBox && searchInputRef.current && document.activeElement !== searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchBox, query]);

  // Manejar la apertura del cuadro de búsqueda
  const toggleSearchBox = () => {
    setShowSearchBox(!showSearchBox);
    if (!showSearchBox && query === '') {
      setResults([]);
      setSelectedEntity(null);
    }
  };
  
  // Limpiar la búsqueda
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSelectedEntity(null);
    setError(null);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  // Manejar el cambio de tipo de entidad
  const handleEntityTypeChange = (value: string) => {
    setEntityType(value as EntityType);
  };
  
  // Manejar la selección de una entidad
  const handleSelectEntity = (entity: SearchResult) => {
    setSelectedEntity(entity);
  };
  
  // Cerrar la vista detallada
  const handleCloseDetail = () => {
    setSelectedEntity(null);
  };

  // Componente de búsqueda minimizado (botón)
  const MinimizedSearch = () => (
    <Button 
      variant="outline" 
      className="flex items-center gap-2 rounded-full border-primary-300 bg-white hover:bg-primary-50 text-primary-700 shadow-sm"
      onClick={toggleSearchBox}
    >
      <Search className="h-4 w-4 text-primary-500" />
      <span className="hidden sm:inline font-medium">Buscar reputación</span>
    </Button>
  );

  // Componente de búsqueda expandido
  const ExpandedSearch = () => (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary-200 bg-white dark:bg-gray-800 flex flex-col max-h-[80vh]">
      <CardContent className="p-4 flex-1 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {/* Barra de búsqueda */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-primary-500" />
            <Input
              autoFocus
              ref={searchInputRef}
              type="text"
              placeholder="Buscar personas, empresas, productos, agencias, hoteles..."
              className="pl-10 pr-10 border-primary-300 focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-900/70"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={clearSearch}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-primary-600 hover:bg-primary-50 hover:text-primary-700"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
            
            {showFilters && (
              <div className="flex flex-wrap gap-2 items-center">
                <Select value={entityType} onValueChange={handleEntityTypeChange}>
                  <SelectTrigger className="w-[180px] border-primary-300">
                    <SelectValue placeholder="Tipo de entidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="person">Personas</SelectItem>
                    <SelectItem value="company">Empresas</SelectItem>
                    <SelectItem value="product">Productos</SelectItem>
                    <SelectItem value="agency">Agencias</SelectItem>
                    <SelectItem value="hotel">Hoteles</SelectItem>
                    <SelectItem value="place">Lugares</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Etiquetas de filtros activos */}
            {entityType !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1 bg-primary-50 text-primary-700 border-primary-200">
                {entityType === 'person' && 'Personas'}
                {entityType === 'company' && 'Empresas'}
                {entityType === 'product' && 'Productos'}
                {entityType === 'agency' && 'Agencias'}
                {entityType === 'hotel' && 'Hoteles'}
                {entityType === 'place' && 'Lugares'}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setEntityType('all')} />
              </Badge>
            )}
          </div>
          
          {/* Estado de carga */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-700"></div>
              <span className="ml-2 text-primary-700">Buscando...</span>
            </div>
          )}
          
          {/* Error */}
          {error && (
            <div className="text-red-500 py-2 bg-red-50 px-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          {/* Resultados */}
          {!isLoading && results.length > 0 && !selectedEntity && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {results.length} resultados encontrados
              </h3>
              {results.map((result) => (
                <SearchResultItem 
                  key={result.id} 
                  result={result} 
                  onSelect={() => handleSelectEntity(result)} 
                />
              ))}
            </div>
          )}
          
          {/* Vista detallada de una entidad */}
          {selectedEntity && (
            <div className="pt-2">
              <button
                onClick={handleCloseDetail}
                className="flex items-center text-sm text-primary-600 hover:text-primary-800 mb-3"
              >
                <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" />
                Volver a resultados
              </button>
              <EntityDetailView entity={selectedEntity} />
            </div>
          )}
          
          {/* Sin resultados */}
          {!isLoading && query.trim() !== '' && results.length === 0 && !error && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400 bg-gray-50 rounded-md p-4">
              No se encontraron resultados para "{query}".
            </div>
          )}
          
          {/* Botón para cerrar */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSearchBox}
              className="text-primary-600 border-primary-300 hover:bg-primary-50"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="relative z-50">
      {!showSearchBox ? <MinimizedSearch /> : (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 z-50 overflow-y-auto">
          <div className="w-full max-w-4xl">
            <ExpandedSearch />
          </div>
        </div>
      )}
    </div>
  );
}
