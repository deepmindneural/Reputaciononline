"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import {
  FaHome,
  FaComments,
  FaChartLine,
  FaUsers,
  FaCog,
  FaFileAlt,
  FaBullhorn,
  FaHashtag,
  FaRobot,
  FaAngleRight,
  FaUser,
  FaNewspaper,
  FaUserShield,
  FaMapMarkerAlt,
  FaBriefcase,
  FaHotel,
  FaBuilding,
  FaMoneyBillWave
} from 'react-icons/fa';

const menuItems = [
  { name: 'Dashboard', icon: <FaHome />, href: '/dashboard' },
  { name: 'Menciones', icon: <FaComments />, href: '/dashboard/menciones' },
  { name: 'Audiencia', icon: <FaUsers />, href: '/dashboard/audiencia' },
  { name: 'Tendencias', icon: <FaChartLine />, href: '/dashboard/tendencias' },
  { name: 'Reportes', icon: <FaFileAlt />, href: '/dashboard/reportes' },
  { name: 'Redes Sociales', icon: <FaBullhorn />, href: '/dashboard/redes-sociales' },
  { name: 'Geográfico', icon: <FaMapMarkerAlt />, href: '/dashboard/geografico' },
  { name: 'Hospedajes', icon: <FaHotel />, href: '/dashboard/hospedaje' },
  { name: 'Agencia', icon: <FaBriefcase />, href: '/dashboard/agencia' },
  { name: 'Sofia', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.178-.331.176-.662.352-.988.528-2.56 1.386-4.926 2.837-6.735 4.246a60.376 60.376 0 0 0-1.257.95 4.125 4.125 0 0 0-.296.282c-.166.16-.33.32-.487.485l-.006.006a2.619 2.619 0 0 0-.361.39c-.088.108-.172.22-.25.337a2.99 2.99 0 0 0-.225.394 3.81 3.81 0 0 0-.101.783c0 .903.462 1.697 1.16 2.157.55.36 1.257.53 2.069.53a5.33 5.33 0 0 0 1.564-.239c.542-.174 1.096-.429 1.675-.76C11.043 22.56 14.61 20.895 17.6 19.5c5.298-2.477 7.951-5.41 7.951-7.5 0-1.041-.406-2.042-1.194-2.982A6.753 6.753 0 0 0 22.8 7.4a6.08 6.08 0 0 0-1.964-1.872A6.893 6.893 0 0 0 18.724 4.8c-.47 0-.914.073-1.312.219a5.69 5.69 0 0 0-1.56.95 5.491 5.491 0 0 0-1.13 1.215c-.238.35-.43.7-.57 1.05a4.751 4.751 0 0 0-.076-.572 6.414 6.414 0 0 0-.064-.401c-.071-.363-.17-.693-.3-.985a4.57 4.57 0 0 0-.394-.8c-.629-1.013-1.68-1.684-2.955-1.684-1.442 0-2.697.66-3.262 1.653-.59 1.035-.59 2.354 0 3.59.137.283.313.55.521.798.467.556 1.155 1.038 1.997 1.455a1.674 1.674 0 0 1-.557-.797c-.113-.325-.069-.678.137-.976.06-.088.128-.172.2-.25a1.87 1.87 0 0 1 .272-.25c.123-.095.263-.178.426-.241.208-.088.458-.142.769-.142.3 0 .559.054.785.142a1.81 1.81 0 0 1 .484.297 1.668 1.668 0 0 1 .342.454c.072.131.124.295.156.491.07.426.01.81-.193 1.148a1.744 1.744 0 0 1-.43.467 5.212 5.212 0 0 1-.495.327 9.05 9.05 0 0 1-.583.29c-.2.095-.398.179-.592.242-1.95.661-3.203 1.358-3.762 2.09a3.272 3.272 0 0 0-.305.546c-.592 1.298-.157 2.433 1.307 3.388 1.157.757 2.646 1.136 4.467 1.136 1.87 0 4.126-.449 6.767-1.345 2.601-.882 4.992-2.133 7.17-3.75a.75.75 0 0 0 .272-.83 21.999 21.999 0 0 0-12.271-14.987Z" />
  </svg>, href: '/dashboard/sofia', highlight: true },
  { name: 'Perfil', icon: <FaUser />, href: '/dashboard/perfil' },
];

interface SidebarProps {
  isAdmin?: boolean;
  userName?: string;
  userPlan?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false, userName = 'Usuario', userPlan }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userPlanName, setUserPlanName] = useState<string | null>(null);
  // Estado de colapso global proveniente del contexto
  const { collapsed, setCollapsed } = useSidebar();

  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobileOpen(false);
    }
    
    // Cargar plan del usuario desde props o localStorage
    if (userPlan) {
      setUserPlanName(formatearNombrePlan(userPlan));
    } else if (typeof window !== 'undefined') {
      const planGuardado = localStorage.getItem('userPlan');
      if (planGuardado && planGuardado !== 'undefined') {
        setUserPlanName(formatearNombrePlan(planGuardado));
      }
    }
  }, [pathname, userPlan]);
  
  // Función para formatear el nombre del plan
  const formatearNombrePlan = (planId: string): string => {
    const planes: Record<string, string> = {
      'basico': 'Plan Básico',
      'profesional': 'Plan Profesional',
      'empresarial': 'Plan Empresarial'
    };
    
    return planes[planId] || planId;
  };

  const sidebarItems = isAdmin
    ? [...menuItems, { name: 'Administración', icon: <FaUserShield />, href: '/admin' }]
    : menuItems;

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <button
        className="fixed top-4 left-4 z-30 bg-white dark:bg-gray-800 rounded-md p-2 shadow-md md:hidden"
        onClick={toggleMobileMenu}
        aria-label="Menú principal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <div 
        className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen transition-all duration-300 fixed left-0 top-0 z-20
                   ${collapsed ? 'w-20' : 'w-64'} 
                   ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo y nombre de la aplicación */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              {typeof window !== 'undefined' && localStorage.getItem('appLogo') ? (
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={localStorage.getItem('appLogo') || ''} 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center mr-3">
                  <span className="text-xl font-bold">R</span>
                </div>
              )}
              {!collapsed && <h1 className="text-lg font-bold text-gray-900 dark:text-white">Reputación</h1>}
            </div>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FaAngleRight className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Menú de navegación */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname ? (pathname === item.href || pathname.startsWith(`${item.href}/`)) : false;
                return (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center py-3 px-4 rounded-md mb-1 transition-colors
                      ${isActive 
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 font-medium'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}
                      ${item.highlight && !isActive ? 'border border-primary-500 text-primary-700 dark:border-primary-400 dark:text-primary-400' : ''}
                    `}
                  >
                    <span className={`text-xl flex-shrink-0 ${isActive ? 'text-primary-600' : ''}`}>{item.icon}</span>
                    {!collapsed && (
                      <span className="ml-4 truncate whitespace-nowrap overflow-hidden text-ellipsis" title={item.name}>
                        {item.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Información del usuario y su plan */}
          <div className="mt-auto border-t border-gray-200 dark:border-gray-800 p-4">
            {/* Mostrar nombre del usuario y su plan */}
            {!collapsed && (
              <div className="flex flex-col mb-3">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{userName}</span>
                {userPlanName && (
                  <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">{userPlanName}</span>
                )}
              </div>
            )}
            
            {/* Panel de Admin si corresponde */}
            {isAdmin && !collapsed && (
              <Link 
                href="/admin"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <FaUserShield className="mr-3" />
                <span>Panel de Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
