"use client";

import { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ADMIN_THEME } from '@/theme/admin-theme';
import { FiSettings } from 'react-icons/fi';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header 
            className="z-10 py-4 px-8"
            style={{
              background: ADMIN_THEME.colors.gradients.cyan,
              boxShadow: ADMIN_THEME.shadows.medium
            }}
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <FiSettings className="mr-2" /> 
                Panel de Administración
              </h1>
              <div className="text-white text-sm">
                Reputación Online
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto focus:outline-none">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
