"use client";

import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

interface SocialStat {
  network: string;
  followers: number;
  color: string;
  icon: React.ReactNode;
}

interface Achievement {
  text: string;
}

interface Tag {
  text: string;
  color: string;
}

interface ProfileCardProps {
  name: string;
  title: string;
  location: string;
  campaignPeriod: string;
  photoUrl?: string;
  socialStats: SocialStat[];
  keyTopics: Tag[];
  achievements: Achievement[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  location,
  campaignPeriod,
  photoUrl,
  socialStats,
  keyTopics,
  achievements
}) => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Perfil principal */}
        <div className="flex-none bg-gray-50 dark:bg-gray-700 p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary-500 animate-pulse-slow"></div>
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white dark:border-gray-600 mx-auto flex items-center justify-center bg-cyan-50">
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt={name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-primary-100 dark:bg-primary-800 w-full h-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-300">
                    {name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {title}
          </p>
          
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            <FaMapMarkerAlt className="mr-1" />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
            <FaCalendarAlt className="mr-1" />
            <span>{campaignPeriod}</span>
          </div>
        </div>
        
        {/* Información adicional */}
        <div className="flex-grow p-6">
          {/* Estadísticas sociales */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {socialStats.map((stat, index) => (
              <div key={index} className={`p-3 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-center`}>
                <div className="flex justify-center mb-1">
                  {stat.icon}
                </div>
                <div className="font-bold text-gray-900 dark:text-white">
                  {stat.followers >= 1000 
                    ? `${(stat.followers / 1000).toFixed(stat.followers >= 10000 ? 0 : 1)}K` 
                    : stat.followers}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.network}
                </div>
              </div>
            ))}
          </div>
          
          {/* Temas clave */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Temas Clave</h4>
            <div className="flex flex-wrap gap-2">
              {keyTopics.map((topic, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 text-sm rounded-full bg-${topic.color}-100 dark:bg-${topic.color}-900/30 text-${topic.color}-800 dark:text-${topic.color}-300`}
                >
                  {topic.text}
                </span>
              ))}
            </div>
          </div>
          
          {/* Logros destacados */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Logros Destacados</h4>
            <ul className="space-y-2">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mt-1.5 mr-2 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{achievement.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
