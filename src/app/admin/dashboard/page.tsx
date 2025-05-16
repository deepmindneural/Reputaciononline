"use client";

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { RecentUsersTable } from '@/components/admin/RecentUsersTable';
import { 
  FiUsers, 
  FiCreditCard, 
  FiBarChart, 
  FiClock,
  FiRefreshCw,
  FiActivity,
  FiTrendingUp,
  FiTrendingDown,
  FiCommand,
  FiEye
} from 'react-icons/fi';
import { AdminPageHeader, StatCard, ContentCard, AdminButton } from '@/components/admin';
import { ADMIN_THEME } from '@/theme/admin-theme';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCredits: 0,
    activeMonitors: 0,
    mentionsToday: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await adminService.getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <AdminPageHeader 
        title="Panel de Control" 
        description="Resumen general de la plataforma Reputación Online"
        icon={<FiCommand size={24} />}
        actions={
          <AdminButton
            onClick={() => window.location.reload()}
            variant="secondary"
            size="sm"
            icon={<FiRefreshCw />}
          >
            Actualizar
          </AdminButton>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Usuarios Totales"
          value={stats.totalUsers}
          icon={<FiUsers className="h-6 w-6 text-white" />}
          color="blue"
          change={5.2}
          changeType="up"
        />
        <StatCard
          title="Créditos Totales"
          value={stats.totalCredits}
          icon={<FiCreditCard className="h-6 w-6 text-white" />}
          color="green"
          change={12.8}
          changeType="up"
          isCurrency={true}
        />
        <StatCard
          title="Monitoreos Activos"
          value={stats.activeMonitors}
          icon={<FiEye className="h-6 w-6 text-white" />}
          color="purple"
        />
        <StatCard
          title="Menciones Hoy"
          value={stats.mentionsToday}
          icon={<FiBarChart className="h-6 w-6 text-white" />}
          color="cyan"
          change={3.4}
          changeType="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentCard
          title="Últimos Usuarios Registrados"
          icon={<FiUsers />}
          color="blue"
        >
          <div className="overflow-x-auto">
            <RecentUsersTable />
          </div>
          <div className="bg-gray-50 px-6 py-3 text-right text-sm">
            <a 
              href="/admin/usuarios" 
              className="text-cyan-600 hover:text-cyan-800 font-medium"
            >
              Ver todos los usuarios →
            </a>
          </div>
        </ContentCard>

        <ContentCard
          title="Actividad Reciente"
          icon={<FiActivity />}
          color="purple"
        >
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div 
                      className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                      style={{ 
                        background: 'linear-gradient(to right, #0ea5e9, #06b6d4)', 
                        boxShadow: ADMIN_THEME.shadows.small 
                      }}
                    >
                      <FiUsers className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">Nuevo usuario registrado</p>
                        <p className="text-xs text-gray-500">hace 2h</p>
                      </div>
                      <p className="text-sm text-gray-500">usuario{i}@ejemplo.com se ha registrado</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 text-right text-sm">
            <a 
              href="/admin/actividad" 
              className="text-cyan-600 hover:text-cyan-800 font-medium"
            >
              Ver toda la actividad →
            </a>
          </div>
        </ContentCard>
      </div>
    </div>
  );
}
