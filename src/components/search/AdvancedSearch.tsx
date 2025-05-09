"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, ArrowRight, Calendar, SlidersHorizontal, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import SearchResultItem from './SearchResultItem';
import EntityDetailView from './EntityDetailView';
import ExportReportButton from '@/components/reports/ExportReportButton';
import { searchService, SearchParams, SearchResult, EntityType, SourceType } from '@/services/searchService';

// Cache local para resultados de búsqueda frecuentes
const searchResultsCache = new Map<string, SearchResult[]>();

export default function AdvancedSearch() {
  // Estados básicos
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [entityType, setEntityType] = useState<EntityType>('all');
  const [sources, setSources] = useState<SourceType[]>(['all']);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<SearchResult | null>(null);
  const [showSearchBox, setShowSearchBox] = useState(false);
  
  // Estados de filtros avanzados
  const [showFilters, setShowFilters] = useState(false);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [location, setLocation] = useState<string>('');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [minScore, setMinScore] = useState<number>(0);
  const [date, setDate] = useState<DateRange | undefined>();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [includeImages, setIncludeImages] = useState<boolean>(true);
  const [includeMentions, setIncludeMentions] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'score'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Historial de búsqueda
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
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

  // Cargar historial de búsqueda al inicio
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

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
        
        // Crear una clave para el caché basada en los parámetros de búsqueda
        const cacheKey = JSON.stringify({
          query: debouncedSearch,
          entityType,
          sources,
          location,
          sentimentFilter,
          minScore,
          date,
          sortBy,
          sortOrder
        });
        
        // Verificar si tenemos resultados en caché
        if (searchResultsCache.has(cacheKey)) {
          console.log('Usando resultados en caché para:', debouncedSearch);
          setResults(searchResultsCache.get(cacheKey) || []);
          setIsLoading(false);
          return;
        }
        
        const searchParams: SearchParams = {
          query: debouncedSearch,
          entityType,
          sources,
          location: location || undefined,
          limit: 10,
          includeRatings: true,
          includeMentions,
          includeSocialProfiles: true,
          startDate: date?.from ? date.from.toISOString() : undefined,
          endDate: date?.to ? date.to.toISOString() : undefined,
        };
        
        const response = await searchService.search(searchParams);
        
        // Filtrar y ordenar resultados según los criterios avanzados
        let filteredResults = response.results;
        
        // Filtrar por puntuación mínima
        if (minScore > 0) {
          filteredResults = filteredResults.filter(result => result.overallScore >= minScore);
        }
        
        // Filtrar por sentimiento
        if (sentimentFilter !== 'all') {
          filteredResults = filteredResults.filter(result => result.overallSentiment === sentimentFilter);
        }
        
        // Ordenar resultados
        filteredResults.sort((a, b) => {
          switch (sortBy) {
            case 'date':
              const dateA = new Date(a.metadata.timestamp).getTime();
              const dateB = new Date(b.metadata.timestamp).getTime();
              return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            case 'score':
              return sortOrder === 'asc' ? a.overallScore - b.overallScore : b.overallScore - a.overallScore;
            default: // relevance - mantener el orden original
              return 0;
          }
        });
        
        setResults(filteredResults);
        
        // Guardar los resultados en la caché usando los mismos parámetros de búsqueda
        // que ya utilizamos para la clave de búsqueda en caché
        const resultCacheKey = JSON.stringify({
          query: debouncedSearch,
          entityType,
          sources,
          location,
          sentimentFilter,
          minScore,
          date,
          sortBy,
          sortOrder
        });
        searchResultsCache.set(resultCacheKey, filteredResults);
        
        // Limitar tamaño de caché (máximo 50 búsquedas)
        if (searchResultsCache.size > 50) {
          // Eliminar la entrada más antigua
          const firstKey = searchResultsCache.keys().next().value;
          searchResultsCache.delete(firstKey);
        }
        
        // Guardar en historial de búsqueda
        if (debouncedSearch.trim() !== '' && !searchHistory.includes(debouncedSearch)) {
          const newHistory = [debouncedSearch, ...searchHistory.slice(0, 9)];
          setSearchHistory(newHistory);
          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }
      } catch (err) {
        console.error('Error al buscar:', err);
        setError('Ha ocurrido un error al buscar. Por favor, inténtalo de nuevo.');
        setResults([]);
        
        // Registrar error de manera más detallada para depuración
        if (process.env.NODE_ENV === 'development') {
          console.group('Error de búsqueda');
          console.error('Parámetros de búsqueda:', {
            query: debouncedSearch,
            entityType,
            sources,
            location,
            sentimentFilter,
            minScore,
            date
          });
          console.error('Error:', err);
          console.groupEnd();
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    performSearch();
  }, [debouncedSearch, entityType, sources, location, sentimentFilter, minScore, date, includeMentions, sortBy, sortOrder]);

  // Manejar el enfoque en el input cuando se abre el cuadro de búsqueda
  useEffect(() => {
    if (showSearchBox && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchBox]);

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
  
  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setEntityType('all');
    setSources(['all']);
    setLocation('');
    setSentimentFilter('all');
    setMinScore(0);
    setDate(undefined);
    setIncludeMentions(true);
    setIncludeImages(true);
    setSortBy('relevance');
    setSortOrder('desc');
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
  
  // Seleccionar desde el historial
  const selectHistoryItem = (item: string) => {
    setQuery(item);
    setShowHistory(false);
  };
  
  // Limpiar historial
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Componente de búsqueda minimizado (botón)
  const MinimizedSearch = () => (
    <Button 
      variant="outline" 
      className="flex items-center gap-2 rounded-full border-cyan-300 bg-white hover:bg-cyan-50 text-cyan-700 shadow-sm"
      onClick={toggleSearchBox}
    >
      <Search className="h-4 w-4 text-cyan-500" />
      <span className="hidden sm:inline font-medium">Buscar reputación</span>
    </Button>
  );

  // Diálogo de filtros avanzados
  const AdvancedFiltersDialog = () => (
    <Dialog open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtros avanzados</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Ubicación</Label>
            <Input 
              placeholder="Ciudad, país, región..." 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Sentimiento</Label>
            <Select 
              value={sentimentFilter} 
              onValueChange={(value) => setSentimentFilter(value as 'all' | 'positive' | 'neutral' | 'negative')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sentimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="positive">Positivo</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label>Puntuación mínima</Label>
              <span className="text-sm text-gray-500">{minScore}</span>
            </div>
            <Slider
              value={[minScore]}
              onValueChange={(value: number[]) => setMinScore(value[0])}
              min={0}
              max={5}
              step={0.5}
              onValueChange={(value) => setMinScore(value[0])}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Periodo de tiempo</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'PPP', { locale: es })} -{' '}
                        {format(date.to, 'PPP', { locale: es })}
                      </>
                    ) : (
                      format(date.from, 'PPP', { locale: es })
                    )
                  ) : (
                    <span>Seleccionar período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  locale={es}
                />
                <div className="flex justify-end gap-2 p-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setDate(undefined);
                      setDatePickerOpen(false);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpiar
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setDatePickerOpen(false)}
                  >
                    Aplicar
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label>Incluir en resultados</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-mentions"
                checked={includeMentions}
                onCheckedChange={(checked) => setIncludeMentions(checked as boolean)}
              />
              <Label htmlFor="include-mentions">Menciones</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-images"
                checked={includeImages}
                onCheckedChange={(checked) => setIncludeImages(checked as boolean)}
              />
              <Label htmlFor="include-images">Imágenes</Label>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Ordenar por</Label>
            <div className="flex gap-2">
              <Select 
                value={sortBy} 
                onValueChange={(value) => setSortBy(value as 'relevance' | 'date' | 'score')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevancia</SelectItem>
                  <SelectItem value="date">Fecha</SelectItem>
                  <SelectItem value="score">Puntuación</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Orden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descendente</SelectItem>
                  <SelectItem value="asc">Ascendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={clearAllFilters}
          >
            Limpiar filtros
          </Button>
          <Button onClick={() => setAdvancedFiltersOpen(false)}>
            Aplicar filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Componente de búsqueda expandido
  const ExpandedSearch = () => (
    <Card className="w-full max-w-5xl mx-auto shadow-lg border-cyan-200 bg-white dark:bg-gray-800 flex flex-col max-h-[80vh]">
      <CardContent className="p-4 flex-1 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {/* Barra de búsqueda */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-cyan-500" />
            <Input
              autoFocus
              ref={searchInputRef}
              type="text"
              placeholder="Buscar personas, empresas, productos, agencias, hoteles..."
              className="pl-10 pr-10 border-cyan-300 focus:border-cyan-500 focus:ring-cyan-500 bg-white dark:bg-gray-900/70"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClick={() => setShowHistory(searchHistory.length > 0)}
              onFocus={() => setShowHistory(searchHistory.length > 0)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
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
          
          {/* Historial de búsqueda */}
          {showHistory && searchHistory.length > 0 && (
            <div className="absolute top-14 left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto p-2">
              <div className="flex justify-between items-center mb-2 px-2">
                <h3 className="text-sm font-medium text-gray-700">Búsquedas recientes</h3>
                <button 
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Limpiar historial
                </button>
              </div>
              <ul>
                {searchHistory.map((item, index) => (
                  <li 
                    key={index} 
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm"
                    onClick={() => selectHistoryItem(item)}
                  >
                    <div className="flex items-center">
                      <Search className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{item}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Botones de filtros */}
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros básicos</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAdvancedFiltersOpen(true)}
                className="flex items-center gap-1 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filtros avanzados</span>
              </Button>
            </div>
            
            {results.length > 0 && (
              <ExportReportButton 
                entities={results}
                mentions={results.flatMap(r => r.mentions)}
                variant="outline"
                size="sm"
                className="text-cyan-600 border-cyan-300 hover:bg-cyan-50"
              />
            )}
          </div>
          
          {/* Filtros básicos */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={entityType} onValueChange={handleEntityTypeChange}>
                <SelectTrigger className="w-[180px] border-cyan-300">
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
          <div className="flex flex-wrap gap-2">
            {entityType !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1 bg-cyan-50 text-cyan-700 border-cyan-200">
                {entityType === 'person' && 'Personas'}
                {entityType === 'company' && 'Empresas'}
                {entityType === 'product' && 'Productos'}
                {entityType === 'agency' && 'Agencias'}
                {entityType === 'hotel' && 'Hoteles'}
                {entityType === 'place' && 'Lugares'}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setEntityType('all')} />
              </Badge>
            )}
            
            {location && (
              <Badge variant="outline" className="flex items-center gap-1 bg-cyan-50 text-cyan-700 border-cyan-200">
                Ubicación: {location}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setLocation('')} />
              </Badge>
            )}
            
            {sentimentFilter !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1 bg-cyan-50 text-cyan-700 border-cyan-200">
                Sentimiento: {sentimentFilter === 'positive' ? 'Positivo' : sentimentFilter === 'negative' ? 'Negativo' : 'Neutral'}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSentimentFilter('all')} />
              </Badge>
            )}
            
            {minScore > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 bg-cyan-50 text-cyan-700 border-cyan-200">
                Puntuación mínima: {minScore}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setMinScore(0)} />
              </Badge>
            )}
            
            {date?.from && (
              <Badge variant="outline" className="flex items-center gap-1 bg-cyan-50 text-cyan-700 border-cyan-200">
                Periodo: {format(date.from, 'dd/MM/yyyy')} {date.to && `- ${format(date.to, 'dd/MM/yyyy')}`}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setDate(undefined)} />
              </Badge>
            )}
            
            {sortBy !== 'relevance' && (
              <Badge variant="outline" className="flex items-center gap-1 bg-cyan-50 text-cyan-700 border-cyan-200">
                Ordenado por: {sortBy === 'date' ? 'Fecha' : 'Puntuación'} ({sortOrder === 'asc' ? 'Ascendente' : 'Descendente'})
                <X className="h-3 w-3 cursor-pointer" onClick={() => { setSortBy('relevance'); setSortOrder('desc'); }} />
              </Badge>
            )}
          </div>
          
          {/* Estado de carga */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-700"></div>
              <span className="ml-2 text-cyan-700">Buscando...</span>
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
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {results.length} resultados encontrados
                </h3>
                {results.length > 0 && (
                  <ExportReportButton 
                    entities={results}
                    mentions={results.flatMap(r => r.mentions)}
                    variant="outline"
                    size="sm"
                    className="text-cyan-600 border-cyan-300 hover:bg-cyan-50"
                  />
                )}
              </div>
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
              <div className="flex justify-between items-center mb-3">
                <button
                  onClick={handleCloseDetail}
                  className="flex items-center text-sm text-cyan-600 hover:text-cyan-800"
                >
                  <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" />
                  Volver a resultados
                </button>
                
                <ExportReportButton 
                  entity={selectedEntity}
                  mentions={selectedEntity.mentions}
                  variant="outline"
                  size="sm"
                  className="text-cyan-600 border-cyan-300 hover:bg-cyan-50"
                />
              </div>
              <EntityDetailView entity={selectedEntity} />
            </div>
          )}
          
          {/* Sin resultados */}
          {!isLoading && query.trim() !== '' && results.length === 0 && !error && (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 rounded-md p-4">
              <div className="mb-3">
                <Search className="h-12 w-12 mx-auto text-gray-300" />
              </div>
              <p className="text-lg font-medium mb-1">No se encontraron resultados</p>
              <p className="text-sm">No hay coincidencias para "{query}". Prueba con otras palabras clave o modifica los filtros de búsqueda.</p>
            </div>
          )}
          
          {/* Botón para cerrar */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSearchBox}
              className="text-cyan-600 border-cyan-300 hover:bg-cyan-50"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Diálogo de filtros avanzados */}
      <AdvancedFiltersDialog />
    </Card>
  );

  return (
    <div className="relative z-50">
      {!showSearchBox ? <MinimizedSearch /> : (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 z-50 overflow-y-auto">
          <div className="w-full max-w-5xl">
            <ExpandedSearch />
          </div>
        </div>
      )}
    </div>
  );
}
