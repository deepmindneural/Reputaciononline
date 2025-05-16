"use client";

import { ReactNode } from 'react';
import { ADMIN_THEME } from '@/theme/admin-theme';

interface ContentCardProps {
  title: string;
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'cyan' | 'orange' | 'purple' | 'red';
  children: ReactNode;
  actions?: ReactNode;
  noPadding?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({ 
  title, 
  icon, 
  color = 'cyan',
  children,
  actions,
  noPadding = false
}) => {
  // Mapear colores a gradientes
  const gradientMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    cyan: 'from-cyan-500 to-cyan-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600'
  };
  
  const gradientClass = gradientMap[color] || gradientMap.cyan;
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className={`p-4 border-b border-gray-100 bg-gradient-to-r ${gradientClass}`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-white flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </h3>
          {actions && (
            <div>
              {actions}
            </div>
          )}
        </div>
      </div>
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
    </div>
  );
};
