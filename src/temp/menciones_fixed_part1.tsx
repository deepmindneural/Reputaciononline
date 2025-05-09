"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaFacebook, 
  FaTwitter,
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
  FaBell,
  FaExclamationCircle
} from 'react-icons/fa';
import SocialMediaAuth from '@/components/SocialMediaAuth';

// Tipos para el componente
type SentimentType = 'positivo' | 'negativo' | 'neutral';
type SocialNetworkType = 'x' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'news';
type Platform = 'facebook' | 'twitter' | 'instagram' | 'linkedin';

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

// Componente MencionItem incrustado directamente 
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
        return <FaInstagram className="text-[#E1306C]" />;
      case 'linkedin':
        return <FaLinkedin className="text-[#0077B5]" />;
      case 'tiktok':
        return <FaTiktok className="text-[#000000]" />;
      case 'news':
        return <FaNewspaper className="text-gray-700 dark:text-gray-300" />;
      default:
        return <img src="/images/social/x-logo.png" alt="X" className="w-4 h-4" />;
    }
  };
  
  // Obtener la clase de color según el sentimiento
  const getSentimentClass = () => {
    switch(sentiment) {
      case 'positivo':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'negativo':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'neutral':
        return 'border-gray-500 bg-gray-50 dark:bg-gray-800';
      default:
        return 'border-gray-300 bg-white dark:bg-gray-800';
    }
  };
  
  // Obtener el componente indicador de sentimiento
  const getSentimentIndicator = () => {
    switch(sentiment) {
      case 'positivo':
        return <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>;
      case 'negativo':
        return <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>;
      case 'neutral':
        return <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>;
      default:
        return null;
    }
  };

  return (
    <div className={`border-l-4 ${getSentimentClass()} p-4 rounded-lg mb-4 hover:shadow-md transition-shadow`}>
      <div>
        <div className="flex justify-between">
          <div className="flex items-center mb-2">
            {getSentimentIndicator()}
            <span className="text-sm font-medium capitalize">
              {sentiment}
              {relevance > 0 && (
                <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs">
                  Relevancia: {relevance}%
                </span>
              )}
            </span>
            <div className="ml-auto">
              <button className="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                <FaBookmark />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido de la mención */}
        <div className="mb-4">
          <p className="text-gray-800 dark:text-gray-200">
            {content}
          </p>
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
    </div>
  );
};
