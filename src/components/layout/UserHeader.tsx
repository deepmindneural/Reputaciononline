"use client";

import React from 'react';
import Link from 'next/link';
import { FaCoins, FaSignOutAlt } from 'react-icons/fa';

interface UserHeaderProps {
  userName?: string;
  userRole?: string;
  credits?: number;
  plan?: string;
  spent?: number;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  userName = "Juan Pérez",
  userRole = "Usuario",
  credits = 42500,
  plan = "Empresarial",
  spent = 7500
}) => {
  return (
    <div className="flex items-center justify-end space-x-4 py-2 px-4 bg-white dark:bg-gray-800 shadow-sm">
      {/* Perfil del usuario */}
      <div className="flex items-center">
        <div className="w-9 h-9 bg-primary-500 rounded-full overflow-hidden mr-2 flex-shrink-0">
          {typeof window !== 'undefined' && localStorage.getItem('userProfileImage') ? (
            <img 
              src={localStorage.getItem('userProfileImage') || ''}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <span>{userName.charAt(0)}</span>
            </div>
          )}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{userName}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{userRole}</div>
        </div>
      </div>
      
      {/* Créditos */}
      <div>
        <div className="flex flex-col items-end">
          <Link 
            href="/dashboard/creditos"
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
          >
            <FaCoins className="mr-1 text-primary-500" />
            <span className="font-medium">{credits.toLocaleString()}</span>
          </Link>
          <div className="text-xs text-gray-500 flex flex-col items-end">
            <span>Plan: {plan}</span>
            <span>Gastados: {spent.toLocaleString()}</span>
          </div>
          <div className="mt-1">
            <Link 
              href="/dashboard/creditos/comprar"
              className="text-xs bg-primary-100 text-primary-700 hover:bg-primary-200 px-2 py-0.5 rounded"
            >
              Comprar más
            </Link>
          </div>
        </div>
      </div>

      {/* Botón de cerrar sesión */}
      <Link 
        href="/login"
        className="flex items-center py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
      >
        <FaSignOutAlt className="mr-2" />
        <span>Cerrar sesión</span>
      </Link>
    </div>
  );
};

export default UserHeader;
