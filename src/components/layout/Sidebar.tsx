"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  FaCoins,
  FaSignOutAlt,
  FaUserShield
} from 'react-icons/fa';
import Image from 'next/image';
import { useCreditos } from '@/context/CreditosContext';

const menuItems = [
  { name: 'Dashboard', icon: <FaHome />, href: '/dashboard' },
  { name: 'Menciones', icon: <FaComments />, href: '/dashboard/menciones' },
  { name: 'Audiencia', icon: <FaUsers />, href: '/dashboard/audiencia' },
  { name: 'Tendencias', icon: <FaChartLine />, href: '/dashboard/tendencias' },
  { name: 'Publicaciones', icon: <FaNewspaper />, href: '/dashboard/publicaciones' },
  { name: 'Reportes', icon: <FaFileAlt />, href: '/dashboard/reportes' },
  { name: 'Sofia', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.178-.331.176-.662.352-.988.528-2.56 1.386-4.926 2.837-6.735 4.246a60.376 60.376 0 0 0-1.257.95 4.125 4.125 0 0 0-.296.282c-.166.16-.33.32-.487.485l-.006.006a2.619 2.619 0 0 0-.361.39c-.088.108-.172.22-.25.337a2.99 2.99 0 0 0-.225.394 3.81 3.81 0 0 0-.101.783c0 .903.462 1.697 1.16 2.157.55.36 1.257.53 2.069.53a5.33 5.33 0 0 0 1.564-.239c.542-.174 1.096-.429 1.675-.76C11.043 22.56 14.61 20.895 17.6 19.5c5.298-2.477 7.951-5.41 7.951-7.5 0-1.041-.406-2.042-1.194-2.982A6.753 6.753 0 0 0 22.8 7.4a6.08 6.08 0 0 0-1.964-1.872A6.893 6.893 0 0 0 18.724 4.8c-.47 0-.914.073-1.312.219a5.69 5.69 0 0 0-1.56.95 5.491 5.491 0 0 0-1.13 1.215c-.238.35-.43.7-.57 1.05a4.751 4.751 0 0 0-.076-.572 6.414 6.414 0 0 0-.064-.401c-.071-.363-.17-.693-.3-.985a4.57 4.57 0 0 0-.394-.8c-.629-1.013-1.68-1.684-2.955-1.684-1.442 0-2.697.66-3.262 1.653-.59 1.035-.59 2.354 0 3.59.137.283.313.55.521.798.467.556 1.155 1.038 1.997 1.455a1.674 1.674 0 0 1-.557-.797c-.113-.325-.069-.678.137-.976.06-.088.128-.172.2-.25a1.87 1.87 0 0 1 .272-.25c.123-.095.263-.178.426-.241.208-.088.458-.142.769-.142.3 0 .559.054.785.142a1.81 1.81 0 0 1 .484.297a1.668 1.668 0 0 1 .342.454c.072.131.124.295.156.491.07.426.01.81-.193 1.148a1.744 1.744 0 0 1-.43.467 5.212 5.212 0 0 1-.495.327a9.05 9.05 0 0 1-.583.29c-.2.095-.398.179-.592.242-1.95.661-3.203 1.358-3.762 2.09a3.272 3.272 0 0 0-.305.546c-.592 1.298-.157 2.433 1.307 3.388 1.157.757 2.646 1.136 4.467 1.136 1.87 0 4.126-.449 6.767-1.345 2.601-.882 4.992-2.133 7.17-3.75a.75.75 0 0 0 .272-.83 21.999 21.999 0 0 0-12.271-14.987Z" />
  </svg>, href: '/dashboard/sofia', highlight: true },
  { name: 'Créditos', icon: <FaCoins />, href: '/dashboard/creditos' },
  { name: 'Perfil', icon: <FaUser />, href: '/dashboard/perfil' },
];

interface SidebarProps {
  isAdmin?: boolean;
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false, userName = 'Usuario' }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { creditos } = useCreditos();

  const handleLogout = () => {
    // Aquí iría la lógica para cerrar sesión como limpiar tokens, etc.
    router.push('/login');
  };

  // Si es administrador, agregar/modificar opciones especu00edficas
  const sidebarItems = isAdmin 
    ? [
        { name: 'Dashboard', icon: <FaHome />, href: '/admin' },
        { name: 'Usuarios', icon: <FaUsers />, href: '/admin/usuarios' },
        { name: 'Créditos', icon: <FaCoins />, href: '/admin/creditos' },
        { name: 'Análisis Global', icon: <FaChartLine />, href: '/admin/analisis' },
        { name: 'Configuracion', icon: <FaCog />, href: '/admin/configuracion' },
      ] 
    : menuItems;

  return (
    <aside 
      className={`bg-white dark:bg-gray-900 h-screen shadow-lg flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="p-4 flex justify-between items-center">
        {!collapsed ? (
          <Link href={isAdmin ? '/admin' : '/dashboard'} className="flex items-center">
            {typeof window !== 'undefined' && localStorage.getItem('appLogo') ? (
              <img 
                src={localStorage.getItem('appLogo') || ''} 
                alt="Reputación Online" 
                className="h-10 max-w-[140px] object-contain"
              />
            ) : (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-cyan-500 rounded-md flex items-center justify-center text-white font-bold mr-2">
                  <span>R</span>
                </div>
                <span className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">Reputación Online</span>
              </div>
            )}
          </Link>
        ) : (
          <Link href={isAdmin ? '/admin' : '/dashboard'} className="flex items-center mx-auto">
            {typeof window !== 'undefined' && localStorage.getItem('appLogo') ? (
              <img 
                src={localStorage.getItem('appLogo') || ''} 
                alt="ROI" 
                className="w-8 h-8 object-contain rounded-md"
              />
            ) : (
              <div className="w-8 h-8 bg-cyan-500 rounded-md flex items-center justify-center text-white font-bold">
                <span>R</span>
              </div>
            )}
          </Link>
        )}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-cyan-500 transition-colors"
        >
          <FaAngleRight className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-4 space-y-1">
          {sidebarItems.map((item) => {
            // Verificación de seguridad para pathname
const isActive = pathname ? (pathname === item.href || pathname.startsWith(`${item.href}/`)) : false;
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`
                  flex items-center py-3 px-4 rounded-md mb-1 transition-colors
                  ${isActive 
                      ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}
                  ${item.highlight && !isActive ? 'border border-cyan-500 text-cyan-700 dark:border-cyan-400 dark:text-cyan-400' : ''}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && <span className="ml-4">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Panel de usuario y logout */}
      <div className={`p-4 ${collapsed ? 'hidden' : 'block'}`}>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center">
              <span>{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{userName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{isAdmin ? 'Administrador' : 'Usuario'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none"
          >
            <FaSignOutAlt className="mr-2" /> Cerrar sesión
          </button>
        </div>

        {!isAdmin && (
          <div className="bg-cyan-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">Créditos</span>
              <Link 
                href="/dashboard/creditos"
                className="text-sm text-white bg-cyan-500 hover:bg-cyan-600 px-3 py-1 rounded-md transition-colors"
              >
                Comprar más
              </Link>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{creditos.disponibles.toLocaleString()}</span>
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              <p>Plan: {creditos.plan}</p>
              <p className="mt-0.5">Gastados: {creditos.gastados.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
