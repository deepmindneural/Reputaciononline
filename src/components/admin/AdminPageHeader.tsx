"use client";

import { ReactNode } from 'react';
import { ADMIN_THEME } from '@/theme/admin-theme';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ 
  title, 
  description, 
  icon,
  actions
}) => {
  return (
    <div 
      className="rounded-xl overflow-hidden mb-8" 
      style={{ 
        background: ADMIN_THEME.colors.gradients.cyan,
        boxShadow: ADMIN_THEME.shadows.card 
      }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {icon && <div className="mr-3 text-white">{icon}</div>}
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-white text-opacity-80">
                  {description}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div>
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
