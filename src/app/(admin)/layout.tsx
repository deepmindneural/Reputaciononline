"use client";

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { CreditosProvider } from '@/context/CreditosContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CreditosProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar isAdmin={true} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header isAdmin={true} userRole="Administrador" />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </CreditosProvider>
  );
}
