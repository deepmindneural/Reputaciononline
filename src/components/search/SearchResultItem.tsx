import React, { useState, useEffect } from 'react';
import { SearchResult } from '@/services/searchService';
import { Star, User, Building2, Package, Briefcase, Hotel, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchResultItemProps {
  result: SearchResult;
  onSelect: () => void;
}

interface Mention {
  source: string;
  text: string;
  date: string;
  author?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  likes?: number;
  shares?: number;
  authorImage?: string;
  url?: string;
}

const MentionItem: React.FC<{ mention: Mention }> = ({ mention }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'twitter':
        return '🐦';
      case 'facebook':
        return 'ƒ';
      case 'instagram':
        return '📷';
      case 'news':
        return '📰';
      case 'tripadvisor':
        return '✈️';
      case 'booking':
        return '🏨';
      default:
        return '💬';
    }
  };

  const formattedDate = new Date(mention.date).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="border-b border-gray-200 py-3 last:border-b-0">
      <div className="flex items-start">
        {mention.authorImage ? (
          <img
            src={mention.authorImage}
            alt={mention.author}
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center text-lg">
            {getSourceIcon(mention.source)}
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <span className="font-medium text-gray-900">{mention.author || mention.source}</span>
              <span className="mx-1 text-gray-400">•</span>
              <span className="text-sm text-gray-500">{formattedDate}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(mention.sentiment)}`}>
              {mention.sentiment === 'positive' ? 'Positivo' : mention.sentiment === 'negative' ? 'Negativo' : 'Neutral'}
            </span>
          </div>
          <p className="text-gray-800 mb-2">{mention.text}</p>
          {(mention.likes !== undefined || mention.shares !== undefined) && (
            <div className="flex text-xs text-gray-500">
              {mention.likes !== undefined && (
                <span className="mr-3">❤️ {mention.likes}</span>
              )}
              {mention.shares !== undefined && (
                <span>🔄 {mention.shares}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function SearchResultItem({ result, onSelect }: SearchResultItemProps) {
  // Función para obtener el icono según el tipo de entidad
  const getEntityIcon = () => {
    switch (result.type) {
      case 'person':
        return <User className="h-4 w-4" />;
      case 'company':
        return <Building2 className="h-4 w-4" />;
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'agency':
        return <Briefcase className="h-4 w-4" />;
      case 'hotel':
        return <Hotel className="h-4 w-4" />;
      case 'place':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  // Función para obtener el texto del tipo de entidad
  const getEntityTypeText = () => {
    switch (result.type) {
      case 'person':
        return 'Persona';
      case 'company':
        return 'Empresa';
      case 'product':
        return 'Producto';
      case 'agency':
        return 'Agencia';
      case 'hotel':
        return 'Hotel';
      case 'place':
        return 'Lugar';
      default:
        return 'Entidad';
    }
  };

  // Función para obtener el color del sentimiento
  const getSentimentColor = () => {
    switch (result.overallSentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  // Función para obtener el texto del sentimiento
  const getSentimentText = () => {
    switch (result.overallSentiment) {
      case 'positive':
        return 'Positiva';
      case 'negative':
        return 'Negativa';
      default:
        return 'Neutral';
    }
  };

  // Renderizar estrellas según la puntuación
  const renderStars = () => {
    const starsArray = [];
    const fullStars = Math.floor(result.overallScore);
    const hasHalfStar = result.overallScore - fullStars >= 0.5;
    
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

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [showMentions, setShowMentions] = useState<boolean>(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (result.domain) {
      (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?sz=64&domain=${result.domain}`;
    }
  };

  return (
    <Card 
      className="hover:shadow-md cursor-pointer transition-all border-primary-100 hover:border-primary-300" 
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
          {/* Imagen de la entidad */}
          <div className="relative w-full md:w-32 h-32 bg-gray-100 flex-shrink-0">
            <div className={`absolute inset-0 flex items-center justify-center ${imageLoaded ? 'hidden' : ''}`}>
              <div className="animate-pulse w-12 h-12 rounded-full bg-gray-200"></div>
            </div>
            {!imageError && result.imageUrl && (
              <img
                src={result.imageUrl}
                alt={result.name}
                className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                onLoad={() => setImageLoaded(true)}
                onError={handleError}
              />
            )}
            {(imageError || !result.imageUrl) && (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                {getEntityIcon()}
              </div>
            )}
          </div>

          {/* Información de la entidad */}
          <div className="flex-1 p-4 overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{result.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                  {result.description}
                </p>
                
                {/* Calificación y sentimiento */}
                <div className="flex flex-wrap items-center mt-2 gap-2">
                  <div className="flex items-center">
                    {renderStars()}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {result.overallScore.toFixed(1)}
                    </span>
                  </div>
                  
                  <Badge className={`ml-2 ${getSentimentColor()}`}>
                    {getSentimentText()}
                  </Badge>
                  
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    {result.ratings.length} fuentes
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-3">
              <div className="flex justify-between items-center">
                {/* Perfiles sociales */}
                <div className="flex space-x-2">
                  {result.socialProfiles && Object.entries(result.socialProfiles).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700 transition-colors"
                      title={`Ver perfil en ${platform}`}
                    >
                      {platform === 'twitter' ? '🐦 Twitter' : 
                       platform === 'facebook' ? 'ƒ Facebook' : 
                       platform === 'linkedin' ? 'in LinkedIn' : 
                       platform === 'instagram' ? '📷 Instagram' : 
                       platform === 'website' ? '🌐 Sitio web' : platform}
                    </a>
                  ))}
                </div>
                
                {/* Botón para mostrar menciones si existen */}
                {result.mentions && result.mentions.length > 0 && (
                  <button
                    onClick={() => setShowMentions(!showMentions)}
                    className="px-3 py-1 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-full text-xs font-medium transition-colors"
                  >
                    {showMentions ? 'Ocultar menciones' : `Ver ${result.mentions.length} menciones`}
                  </button>
                )}
              </div>
              
              {/* Menciones en redes sociales */}
              {showMentions && result.mentions && result.mentions.length > 0 && (
                <div className="mt-3 border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 border-b text-sm font-medium text-gray-700">
                    Menciones en redes sociales
                  </div>
                  <div className="p-3 max-h-80 overflow-y-auto">
                    {result.mentions.map((mention, index) => (
                      <MentionItem key={index} mention={mention} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
