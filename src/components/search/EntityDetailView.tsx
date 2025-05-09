import React, { useState, useEffect } from 'react';
import { SearchResult, Mention, searchService } from '@/services/searchService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Facebook, Twitter, Instagram, Linkedin, Globe, Star } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

interface EntityDetailViewProps {
  entity: SearchResult;
}

export default function EntityDetailView({ entity }: EntityDetailViewProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [extendedMentions, setExtendedMentions] = useState<Mention[]>([]);
  const [isLoadingMentions, setIsLoadingMentions] = useState(false);

  // Cargar menciones adicionales al montar el componente
  useEffect(() => {
    const loadMoreMentions = async () => {
      try {
        setIsLoadingMentions(true);
        const mentions = await searchService.getMentions(entity.id, { limit: 30 });
        setExtendedMentions(mentions);
      } catch (error) {
        console.error('Error al cargar menciones adicionales:', error);
      } finally {
        setIsLoadingMentions(false);
      }
    };

    loadMoreMentions();
  }, [entity.id]);

  // Función para agrupar menciones por fuente
  const getMentionsBySource = () => {
    const sources: { [key: string]: number } = {};
    
    extendedMentions.forEach(mention => {
      if (sources[mention.source]) {
        sources[mention.source]++;
      } else {
        sources[mention.source] = 1;
      }
    });
    
    return Object.keys(sources).map(source => ({
      name: source,
      value: sources[source]
    }));
  };

  // Función para agrupar menciones por sentimiento
  const getMentionsBySentiment = () => {
    const sentiments = {
      positive: 0,
      neutral: 0,
      negative: 0
    };
    
    extendedMentions.forEach(mention => {
      sentiments[mention.sentiment]++;
    });
    
    return [
      { name: 'Positivo', value: sentiments.positive, color: '#10b981' },
      { name: 'Neutral', value: sentiments.neutral, color: '#6b7280' },
      { name: 'Negativo', value: sentiments.negative, color: '#ef4444' }
    ];
  };

  // Función para agrupar menciones por fecha (últimos 30 días)
  const getMentionsByDate = () => {
    const today = new Date();
    const dateMap: { [key: string]: { positive: number, neutral: number, negative: number } } = {};
    
    // Inicializar últimos 30 días
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      dateMap[dateString] = { positive: 0, neutral: 0, negative: 0 };
    }
    
    // Agrupar menciones por fecha y sentimiento
    extendedMentions.forEach(mention => {
      const mentionDate = new Date(mention.date);
      const dateString = mentionDate.toISOString().split('T')[0];
      
      if (dateMap[dateString]) {
        dateMap[dateString][mention.sentiment]++;
      }
    });
    
    // Convertir a formato para gráfico
    return Object.keys(dateMap)
      .sort()
      .map(date => ({
        date,
        positivo: dateMap[date].positive,
        neutral: dateMap[date].neutral,
        negativo: dateMap[date].negative,
        total: dateMap[date].positive + dateMap[date].neutral + dateMap[date].negative
      }))
      .slice(-14); // Últimos 14 días para el gráfico
  };

  // Icono para la fuente de redes sociales
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'twitter':
        return <Twitter className="h-5 w-5 text-blue-400" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-600" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5 text-blue-700" />;
      default:
        return <Globe className="h-5 w-5 text-gray-600" />;
    }
  };

  // Estilo para el sentimiento
  const getSentimentStyle = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  // Texto para el sentimiento
  const getSentimentText = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive':
        return 'Positivo';
      case 'negative':
        return 'Negativo';
      default:
        return 'Neutral';
    }
  };

  // Colores para gráficos por sentimiento
  const SENTIMENT_COLORS = {
    positivo: '#10b981', // verde
    neutral: '#6b7280', // gris
    negativo: '#ef4444', // rojo
  };

  // Renderizar estrellas según la puntuación
  const renderStars = (score: number) => {
    const starsArray = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score - fullStars >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsArray.push(
          <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
        );
      } else if (i === fullStars && hasHalfStar) {
        starsArray.push(
          <div key={i} className="relative">
            <Star className="h-4 w-4 text-gray-300 dark:text-gray-700" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 fill-current text-yellow-500" />
            </div>
          </div>
        );
      } else {
        starsArray.push(
          <Star key={i} className="h-4 w-4 text-gray-300 dark:text-gray-700" />
        );
      }
    }
    
    return starsArray;
  };

  return (
    <div className="space-y-4">
      {/* Cabecera con información principal */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Imagen/Avatar */}
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
              {entity.imageUrl ? (
                <img src={entity.imageUrl} alt={entity.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full w-full text-gray-400">
                  <span className="text-3xl">
                    {entity.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Información general */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {entity.name}
                </h2>
                <Badge>
                  {entity.type === 'person' ? 'Persona' : 
                   entity.type === 'company' ? 'Empresa' : 
                   entity.type === 'product' ? 'Producto' : 
                   entity.type === 'agency' ? 'Agencia' : 
                   entity.type === 'hotel' ? 'Hotel' : 'Lugar'}
                </Badge>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {entity.description}
              </p>
              
              {/* Puntuación general */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {renderStars(entity.overallScore)}
                  <span className="ml-1 text-gray-700 dark:text-gray-300">
                    {entity.overallScore.toFixed(1)}
                  </span>
                </div>
                
                <Badge className={getSentimentStyle(entity.overallSentiment)}>
                  {getSentimentText(entity.overallSentiment)}
                </Badge>
                
                <span className="text-sm text-gray-500">
                  {entity.ratings.length} fuentes evaluadas
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs para diferente información */}
      <Tabs defaultValue="general" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="menciones">Menciones</TabsTrigger>
          <TabsTrigger value="sentiment">Sentimiento</TabsTrigger>
          <TabsTrigger value="perfiles">Perfiles</TabsTrigger>
        </TabsList>
        
        {/* Tab: Información general */}
        <TabsContent value="general" className="space-y-4">
          {/* Gráfico de calificaciones por fuente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calificaciones por fuente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entity.ratings.map((rating, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {rating.source}
                      </span>
                      <div className="flex items-center">
                        {renderStars(rating.score)}
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          ({rating.score.toFixed(1)}) - {rating.count} calificaciones
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={rating.score * 20} 
                      className="h-2"
                      indicatorClassName={
                        rating.sentiment === 'positive' ? 'bg-green-500' :
                        rating.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                      } 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Gráfico de distribución de sentimiento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribución de sentimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getMentionsBySentiment()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {getMentionsBySentiment().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} menciones`, 'Cantidad']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Menciones */}
        <TabsContent value="menciones" className="space-y-4">
          {/* Gráfico de menciones por tiempo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tendencia de menciones</CardTitle>
              <CardDescription>Últimos 14 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getMentionsByDate()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        return `${d.getDate()}/${d.getMonth() + 1}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'total' ? 'Total' : String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
                      labelFormatter={(date) => {
                        const d = new Date(date);
                        return d.toLocaleDateString();
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="positivo" stroke="#10b981" strokeWidth={1.5} />
                    <Line type="monotone" dataKey="neutral" stroke="#6b7280" strokeWidth={1.5} />
                    <Line type="monotone" dataKey="negativo" stroke="#ef4444" strokeWidth={1.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Gráfico de menciones por fuente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Menciones por fuente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getMentionsBySource()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} menciones`, 'Cantidad']} />
                    <Legend />
                    <Bar dataKey="value" name="Menciones" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Lista de menciones recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Menciones recientes</CardTitle>
              <CardDescription>
                {extendedMentions.length} menciones analizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMentions ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {extendedMentions.map((mention, index) => (
                    <div 
                      key={index} 
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          {getSocialIcon(mention.source)}
                          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {mention.source}
                          </span>
                        </div>
                        <Badge className={getSentimentStyle(mention.sentiment)}>
                          {getSentimentText(mention.sentiment)}
                        </Badge>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                        {mention.text}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {new Date(mention.date).toLocaleDateString()} · {new Date(mention.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <a 
                          href={mention.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Ver original
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab: Análisis de sentimiento */}
        <TabsContent value="sentiment" className="space-y-4">
          {/* Resumen del sentimiento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Análisis de sentimiento</CardTitle>
              <CardDescription>
                Evaluación de la percepción general en línea
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Distribución de sentimiento */}
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Distribución de sentimiento
                  </h3>
                  <div className="flex h-6 rounded-full overflow-hidden">
                    {getMentionsBySentiment().map((item, index) => (
                      <div
                        key={index}
                        style={{ 
                          width: `${(item.value / extendedMentions.length) * 100}%`,
                          backgroundColor: item.color
                        }}
                        className="relative group"
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          {item.name}: {item.value} ({((item.value / extendedMentions.length) * 100).toFixed(1)}%)
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {getMentionsBySentiment().map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-1"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        {item.name}: {((item.value / extendedMentions.length) * 100).toFixed(1)}%
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Evaluación por aspectos (simulados) */}
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Evaluación por aspectos
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Servicio al cliente</span>
                        <span>{Math.random() > 0.5 ? 'Positivo' : 'Neutral'}</span>
                      </div>
                      <Progress 
                        value={Math.floor(Math.random() * 40) + 60} 
                        className="h-2"
                        indicatorClassName="bg-green-500" 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Calidad</span>
                        <span>{Math.random() > 0.7 ? 'Positivo' : 'Neutral'}</span>
                      </div>
                      <Progress 
                        value={Math.floor(Math.random() * 30) + 70} 
                        className="h-2"
                        indicatorClassName="bg-green-500" 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Precio</span>
                        <span>{Math.random() > 0.3 ? 'Neutral' : 'Negativo'}</span>
                      </div>
                      <Progress 
                        value={Math.floor(Math.random() * 40) + 30} 
                        className="h-2"
                        indicatorClassName="bg-yellow-500" 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Confiabilidad</span>
                        <span>{Math.random() > 0.6 ? 'Positivo' : 'Neutral'}</span>
                      </div>
                      <Progress 
                        value={Math.floor(Math.random() * 30) + 65} 
                        className="h-2"
                        indicatorClassName="bg-green-500" 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Palabras clave más asociadas */}
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Palabras clave más asociadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Profesional', 'Confiable', 'Servicio', 'Calidad', 'Recomendado', 'Respuesta', 'Atención', 'Experiencia'].map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="text-xs py-1"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Evolución del sentimiento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evolución del sentimiento</CardTitle>
              <CardDescription>
                Tendencia de los últimos 14 días
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getMentionsByDate()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        return `${d.getDate()}/${d.getMonth() + 1}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'total' ? 'Total' : String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
                      labelFormatter={(date) => {
                        const d = new Date(date);
                        return d.toLocaleDateString();
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="positivo" name="Positivo" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="neutral" name="Neutral" stroke="#6b7280" strokeWidth={2} />
                    <Line type="monotone" dataKey="negativo" name="Negativo" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Ejemplos de menciones por sentimiento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ejemplos de menciones por sentimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="positivo">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="positivo">Positivas</TabsTrigger>
                  <TabsTrigger value="neutral">Neutrales</TabsTrigger>
                  <TabsTrigger value="negativo">Negativas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="positivo" className="mt-4">
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {extendedMentions
                      .filter(m => m.sentiment === 'positive')
                      .slice(0, 3)
                      .map((mention, index) => (
                        <div key={index} className="p-3 border border-green-200 dark:border-green-900 rounded-lg bg-green-50 dark:bg-green-900/20">
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                            "{mention.text}"
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>{mention.source} · {new Date(mention.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="neutral" className="mt-4">
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {extendedMentions
                      .filter(m => m.sentiment === 'neutral')
                      .slice(0, 3)
                      .map((mention, index) => (
                        <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                            "{mention.text}"
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>{mention.source} · {new Date(mention.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="negativo" className="mt-4">
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {extendedMentions
                      .filter(m => m.sentiment === 'negative')
                      .slice(0, 3)
                      .map((mention, index) => (
                        <div key={index} className="p-3 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-900/20">
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                            "{mention.text}"
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>{mention.source} · {new Date(mention.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab: Perfiles sociales */}
        <TabsContent value="perfiles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perfiles sociales</CardTitle>
              <CardDescription>
                Presencia en internet y redes sociales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entity.socialProfiles.website && (
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Globe className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Sitio web
                      </h3>
                      <a 
                        href={entity.socialProfiles.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        {entity.socialProfiles.website}
                      </a>
                    </div>
                  </div>
                )}
                
                {entity.socialProfiles.facebook && (
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Facebook className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Facebook
                      </h3>
                      <a 
                        href={entity.socialProfiles.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        {entity.socialProfiles.facebook.split('/').pop()}
                      </a>
                    </div>
                  </div>
                )}
                
                {entity.socialProfiles.twitter && (
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Twitter className="h-5 w-5 text-blue-400 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Twitter
                      </h3>
                      <a 
                        href={entity.socialProfiles.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        @{entity.socialProfiles.twitter.split('/').pop()}
                      </a>
                    </div>
                  </div>
                )}
                
                {entity.socialProfiles.instagram && (
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Instagram className="h-5 w-5 text-pink-600 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Instagram
                      </h3>
                      <a 
                        href={entity.socialProfiles.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        @{entity.socialProfiles.instagram.split('/').pop()}
                      </a>
                    </div>
                  </div>
                )}
                
                {entity.socialProfiles.linkedin && (
                  <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Linkedin className="h-5 w-5 text-blue-700 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        LinkedIn
                      </h3>
                      <a 
                        href={entity.socialProfiles.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        {entity.socialProfiles.linkedin.split('/').pop()}
                      </a>
                    </div>
                  </div>
                )}
                
                {!entity.socialProfiles.website && 
                 !entity.socialProfiles.facebook && 
                 !entity.socialProfiles.twitter && 
                 !entity.socialProfiles.instagram && 
                 !entity.socialProfiles.linkedin && (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No se encontraron perfiles sociales para esta entidad.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Metadatos específicos según el tipo de entidad */}
          {Object.keys(entity.metadata).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información adicional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(entity.metadata).map(([key, value]) => (
                    <div key={key} className="flex items-start">
                      <div className="font-medium text-gray-700 dark:text-gray-300 mr-2">
                        {(key as string).charAt(0).toUpperCase() + (key as string).slice(1)}:
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
