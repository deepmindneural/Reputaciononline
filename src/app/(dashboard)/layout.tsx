'use client';

import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { CreditosProvider } from '@/context/CreditosContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const userName = user?.nombre ?? 'Usuario';

  return (
    <CreditosProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar userName={userName} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header userName={userName} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 pt-24">
            {children}
          </main>
        </div>
      </div>
    </CreditosProvider>
  );
}
