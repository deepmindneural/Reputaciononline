"use client";

import { useState, useEffect } from 'react';
import { 
  FaSignOutAlt, 
  FaCoins, 
  FaMoon,
  FaSun
} from 'react-icons/fa';
import Link from 'next/link';
import ReputationSearch from '@/components/search/ReputationSearch';
import { useSidebar } from '@/context/SidebarContext';
import { useSession } from 'next-auth/react';

interface HeaderProps {
  isAdmin?: boolean;
  userName?: string;
  userRole?: string;
  toggleSidebar?: () => void;
  toggleDarkMode?: () => void;
  isDarkMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  isAdmin = false, 
  userName, 
  userRole,
  toggleSidebar,
  toggleDarkMode,
  isDarkMode = false
}) => {
  const { collapsed, toggleCollapsed } = useSidebar();
  const { data: session } = useSession();
  
  // Estados para almacenar la informaciu00f3n del usuario
  const [userDisplayName, setUserDisplayName] = useState(userName || 'Usuario');
  const [userDisplayRole, setUserDisplayRole] = useState(userRole || 'Usuario');
  const [userPlan, setUserPlan] = useState('');
  const [userCredits, setUserCredits] = useState(0);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  useEffect(() => {
    // Cargar datos del usuario desde la sesiu00f3n o localStorage
    if (session?.user?.name) {
      setUserDisplayName(session.user.name);
    } else if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('userName');
      if (savedName && savedName !== 'undefined') {
        setUserDisplayName(savedName);
      }
    }
    
    // Cargar el rol
    if (session?.user?.role) {
      const role = session.user.role === 'admin' ? 'Administrador' : 'Usuario';
      setUserDisplayRole(role);
    }
    
    // Cargar el plan del usuario
    if (typeof window !== 'undefined') {
      const savedPlan = localStorage.getItem('userPlan');
      if (savedPlan && savedPlan !== 'undefined') {
        setUserPlan(formatPlanName(savedPlan));
      } else {
        setUserPlan('Bu00e1sico'); // Plan por defecto
      }
    }
    
    // Cargar cru00e9ditos (para demo, podemos ajustar estos valores seguu00fan el plan)
    const planCreditMapping: Record<string, number> = {
      'basico': 100000,
      'profesional': 300000,
      'empresarial': 800000,
    };
    
    if (typeof window !== 'undefined') {
      const savedPlan = localStorage.getItem('userPlan');
      if (savedPlan && savedPlan !== 'undefined') {
        const totalCredits = planCreditMapping[savedPlan] || 100000;
        setUserCredits(totalCredits);
        // Simular cru00e9ditos usados (entre 5% y 15% del total)
        const randomPercentage = Math.random() * 0.1 + 0.05;
        setCreditsUsed(Math.floor(totalCredits * randomPercentage));
      }
    }
    
    // Cargar imagen de perfil
    if (session?.user?.image) {
      setProfileImage(session.user.image);
    } else if (typeof window !== 'undefined') {
      const savedImage = localStorage.getItem('userProfileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [session, userName, userRole]);
  
  // Funciou00f3n para formatear el nombre del plan
  const formatPlanName = (planId: string): string => {
    const planes: Record<string, string> = {
      'basico': 'Bu00e1sico',
      'profesional': 'Profesional',
      'empresarial': 'Empresarial'
    };
    return planes[planId] || planId;
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10 shadow-sm">
      <div className="px-4 h-16 flex justify-between items-center">
        <div className="flex items-center">
          {toggleSidebar && (
            <button onClick={toggleSidebar} className="mr-4 lg:hidden text-gray-600 dark:text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <button
            onClick={toggleCollapsed}
            className="hidden lg:inline-flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Componente de búsqueda de reputación */}
        <div className="flex-1 items-center justify-center hidden md:flex px-4">
          <div className="w-full max-w-md">
            <ReputationSearch />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Perfil del usuario */}
          <div className="flex items-center mr-4">
            <div className="w-9 h-9 bg-primary-500 rounded-full overflow-hidden mr-2 flex-shrink-0">
              {profileImage ? (
                <img 
                  src={profileImage}
                  alt={userDisplayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <span>{userDisplayName.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{userDisplayName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{userDisplayRole}</div>
            </div>
          </div>
          
          {/* Cru00e9ditos */}
          <div className="mr-4">
            <div className="flex flex-col items-end">
              <Link 
                href="/dashboard/creditos"
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
              >
                <FaCoins className="mr-1 text-primary-500" />
                <span className="font-medium">{userCredits.toLocaleString()}</span>
              </Link>
              <div className="text-xs text-gray-500 flex items-center space-x-2">
                <span className="hidden sm:inline">Plan: <strong className="text-primary-600">{userPlan}</strong></span>
                <span className="w-px h-3 bg-gray-300" />
                <span>Gastados: <strong className="text-primary-600">{creditsUsed.toLocaleString()}</strong></span>
              </div>
              <div className="mt-1">
                <Link 
                  href="/dashboard/creditos/comprar"
                  className="text-xs bg-primary-100 text-primary-700 hover:bg-primary-200 px-2 py-0.5 rounded"
                >
                  Comprar mu00e1s
                </Link>
              </div>
            </div>
          </div>

          {/* Botu00f3n de cerrar sesiu00f3n */}
          <Link 
            href="/login"
            className="flex items-center py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
          >
            <FaSignOutAlt className="mr-2" />
            <span>Cerrar sesiu00f3n</span>
          </Link>

          {/* Toggle dark mode */}
          {toggleDarkMode && (
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 focus:outline-none"
            >
              {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
