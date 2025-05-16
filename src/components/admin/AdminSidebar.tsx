"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiPieChart,
  FiSettings,
  FiClipboard,
  FiBell,
  FiFileText,
  FiLogOut,
  FiBriefcase
} from 'react-icons/fi';
import { ADMIN_THEME } from '@/theme/admin-theme';

const adminMenuItems = [
  { name: 'Dashboard', icon: <FiHome />, href: '/admin' },
  { name: 'Usuarios', icon: <FiUsers />, href: '/admin/usuarios' },
  { name: 'Créditos', icon: <FiDollarSign />, href: '/admin/creditos' },
  { name: 'Planes', icon: <FiClipboard />, href: '/admin/planes' },
  { name: 'Agencias', icon: <FiBriefcase />, href: '/admin/agencias' },
  { name: 'Reportes', icon: <FiFileText />, href: '/admin/reportes' },
  { name: 'Configuración', icon: <FiSettings />, href: '/admin/configuracion' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800 text-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 py-5" 
              style={{
                background: ADMIN_THEME.colors.gradients.cyan,
                boxShadow: ADMIN_THEME.shadows.small
              }}>
              <h1 className="text-xl font-bold text-white">Reputación Online</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {adminMenuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
            <button
              onClick={() => {
                // Lógica de cierre de sesión
                window.location.href = '/';
              }}
              className="flex-shrink-0 w-full group block hover:bg-gray-700 px-4 py-2 rounded-md transition-all duration-200"
            >
              <div className="flex items-center">
                <div>
                  <FiLogOut className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-300 group-hover:text-white">
                    Cerrar sesión
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
