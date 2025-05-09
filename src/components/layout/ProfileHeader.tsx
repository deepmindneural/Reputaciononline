"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface ProfileHeaderProps {
  userName?: string;
  userJob?: string;
  appName?: string;
  userPlan?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userName,
  userJob = "Usuario",
  appName = "Reputación Online",
  userPlan
}) => {
  const { data: session } = useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [storedUserName, setStoredUserName] = useState(userName || 'Usuario');
  const [userRole, setUserRole] = useState(userJob);
  const [userPlanName, setUserPlanName] = useState<string | null>(null);
  
  // Cargar datos del usuario desde la sesión y localStorage
  useEffect(() => {
    // Priorizar la información de la sesión de autenticación
    if (session?.user?.name) {
      setStoredUserName(session.user.name);
      // Guardar también en localStorage para persistencia
      localStorage.setItem('userName', session.user.name);
    }
    
    // Establecer el rol del usuario si está disponible en la sesión
    if (session?.user?.role) {
      const role = session.user.role === 'admin' ? 'Administrador' : 'Usuario';
      setUserRole(role);
    }
    
    // Cargar imagen de perfil desde session o localStorage
    if (session?.user?.image) {
      setProfileImage(session.user.image);
      localStorage.setItem('userProfileImage', session.user.image);
    } else if (typeof window !== 'undefined') {
      const savedProfileImage = localStorage.getItem('userProfileImage');
      if (savedProfileImage) {
        setProfileImage(savedProfileImage);
      }
    }
    
    // Cargar el logo
    if (typeof window !== 'undefined') {
      const savedLogo = localStorage.getItem('appLogo');
      if (savedLogo) {
        setLogoImage(savedLogo);
      }
    }
    
    // Intentar cargar nombre de usuario desde localStorage solo si no hay sesión
    if (!session?.user?.name && typeof window !== 'undefined') {
      const savedUserName = localStorage.getItem('userName');
      if (savedUserName && savedUserName !== 'undefined') {
        setStoredUserName(savedUserName);
      }
    }
    
    // Cargar el plan del usuario - prioridad: props > localStorage
    if (userPlan) {
      // Si se pasa como prop, tiene prioridad
      setUserPlanName(formatearNombrePlan(userPlan));
    } else if (typeof window !== 'undefined') {
      // Cargar desde localStorage si está disponible
      const planGuardado = localStorage.getItem('userPlan');
      if (planGuardado && planGuardado !== 'undefined') {
        setUserPlanName(formatearNombrePlan(planGuardado));
      }
    }
  }, [session, userName, userPlan]);
  
  // Función para formatear el nombre del plan
  const formatearNombrePlan = (planId: string): string => {
    const planes: Record<string, string> = {
      'basico': 'Plan Básico',
      'profesional': 'Plan Profesional',
      'empresarial': 'Plan Empresarial'
    };
    
    return planes[planId] || planId;
  };

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
                {storedUserName.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="font-medium text-sm text-gray-900 dark:text-white">{storedUserName}</div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">{userRole}</span>
            {userPlanName && (
              <>
                <span className="mx-1 text-xs text-gray-400">•</span>
                <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">{userPlanName}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
