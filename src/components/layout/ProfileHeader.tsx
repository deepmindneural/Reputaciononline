"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ProfileHeaderProps {
  userName?: string;
  userJob?: string;
  appName?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userName = "Juan Pérez",
  userJob = "Candidato a Senado",
  appName = "Reputación Online"
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [storedUserName, setStoredUserName] = useState(userName);
  
  // Cargar imágenes y nombre de usuario desde localStorage al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Cargar datos del perfil
      const savedProfileImage = localStorage.getItem('userProfileImage');
      if (savedProfileImage) {
        setProfileImage(savedProfileImage);
      }
      
      // Cargar el logo
      const savedLogo = localStorage.getItem('appLogo');
      if (savedLogo) {
        setLogoImage(savedLogo);
      }
      
      // Cargar el nombre de usuario
      const savedUserName = localStorage.getItem('userName');
      if (savedUserName) {
        setStoredUserName(savedUserName);
      }
    }
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {/* Logo de la aplicación */}
      <div className="relative">
        {logoImage ? (
          <div className="w-10 h-10 rounded overflow-hidden">
            <img 
              src={logoImage} 
              alt="Reputación Online" 
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center bg-primary-500 rounded text-white font-bold text-lg">
            R
          </div>
        )}
      </div>
      
      <div className="border-r border-gray-300 dark:border-gray-700 h-8" />
      
      {/* Perfil del usuario */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          {profileImage ? (
            <div className="w-9 h-9 rounded-full border-2 border-primary-500 overflow-hidden bg-white">
              <img 
                src={profileImage} 
                alt={storedUserName} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full border-2 border-primary-500 overflow-hidden bg-primary-100">
              <div className="w-full h-full flex items-center justify-center text-primary-600 font-bold">
                {storedUserName.charAt(0)}
              </div>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{storedUserName}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{userJob}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
