"use client";

import dynamic from 'next/dynamic';
import { FiPieChart } from 'react-icons/fi';
import { AdminPageHeader, ContentCard } from '@/components/admin';

// Importación dinámica con SSR deshabilitado
const TestChart = dynamic(() => import('../test-chart'), { 
  ssr: false 
});

export default function TestPage() {
  return (
    <div className="p-6 space-y-8">
      <AdminPageHeader 
        title="Prueba de Gráficos" 
        description="Visualización de datos utilizando gráficos interactivos"
        icon={<FiPieChart size={24} />}
      />
      
      <ContentCard
        title="Gráfico de Prueba"
        icon={<FiPieChart />}
        color="cyan"
      >
        <div className="p-4">
          <TestChart />
        </div>
      </ContentCard>
    </div>
  );
}
