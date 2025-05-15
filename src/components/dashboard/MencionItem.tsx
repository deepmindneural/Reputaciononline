import React from 'react';
import { 
  // FaTwitter, // Usaremos imagen de X
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaTiktok, 
  FaNewspaper,
  // FaRetweet, // Reemplazado por reposts
  FaComment,
  FaThumbsUp,
  FaShare,
  FaHeart,
  FaBookmark
} from 'react-icons/fa';

type SentimentType = 'positivo' | 'negativo' | 'neutral';
type SocialNetworkType = 'x' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'news';

export interface MencionItemProps {
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
        return <img src="/images/social/x-logo.png" alt="X" className="w-4 h-4" />;
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
        return <img src="/images/social/x-logo.png" alt="X" className="w-4 h-4" />;
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
                <FaHeart className="mr-1" />
                {engagement.likes.toLocaleString()}
              </span>
            )}
            {engagement.reposts !== undefined && (
              <span className="flex items-center">
                <img src="/images/social/x-logo.png" alt="X" className="w-3 h-3 mr-1" />
                {engagement.reposts.toLocaleString()}
              </span>
            )}
            {engagement.comments !== undefined && (
              <span className="flex items-center">
                <FaComment className="mr-1" />
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
                <FaThumbsUp className="mr-1" />
                {engagement.likes.toLocaleString()}
              </span>
            )}
            {engagement.comments !== undefined && (
              <span className="flex items-center">
                <FaComment className="mr-1" />
                {engagement.comments.toLocaleString()}
              </span>
            )}
            {engagement.shares !== undefined && (
              <span className="flex items-center">
                <FaShare className="mr-1" />
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
                <FaHeart className="mr-1" />
                {engagement.likes.toLocaleString()}
              </span>
            )}
            {engagement.comments !== undefined && (
              <span className="flex items-center">
                <FaComment className="mr-1" />
                {engagement.comments.toLocaleString()}
              </span>
            )}
          </div>
        );
      case 'linkedin':
        return (
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {engagement.likes !== undefined && (
              <span className="flex items-center">
                <FaThumbsUp className="mr-1" />
                {engagement.likes.toLocaleString()}
              </span>
            )}
            {engagement.comments !== undefined && (
              <span className="flex items-center">
                <FaComment className="mr-1" />
                {engagement.comments.toLocaleString()}
              </span>
            )}
            {engagement.shares !== undefined && (
              <span className="flex items-center">
                <FaShare className="mr-1" />
                {engagement.shares.toLocaleString()}
              </span>
            )}
          </div>
        );
      case 'tiktok':
        return (
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {engagement.likes !== undefined && (
              <span className="flex items-center">
                <FaHeart className="mr-1" />
                {engagement.likes.toLocaleString()}
              </span>
            )}
            {engagement.comments !== undefined && (
              <span className="flex items-center">
                <FaComment className="mr-1" />
                {engagement.comments.toLocaleString()}
              </span>
            )}
            {engagement.shares !== undefined && (
              <span className="flex items-center">
                <FaShare className="mr-1" />
                {engagement.shares.toLocaleString()}
              </span>
            )}
          </div>
        );
      case 'news':
        return (
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {engagement.comments !== undefined && (
              <span className="flex items-center">
                <FaComment className="mr-1" />
                {engagement.comments.toLocaleString()}
              </span>
            )}
            {engagement.shares !== undefined && (
              <span className="flex items-center">
                <FaShare className="mr-1" />
                {engagement.shares.toLocaleString()}
              </span>
            )}
            {engagement.likes !== undefined && (
              <span className="flex items-center">
                <FaBookmark className="mr-1" />
                {engagement.likes.toLocaleString()}
              </span>
            )}
          </div>
        );
      default:
        return null;
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

export default MencionItem;
