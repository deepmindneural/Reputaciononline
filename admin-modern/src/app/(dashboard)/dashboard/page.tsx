import { Metadata } from "next";
import { Users, CreditCard, Package, TrendingUp } from "lucide-react";
import { formatearCantidad } from "../../../lib/utils";
import { EstadisticaCard } from "../../../components/estadistica-card";
import { GraficoUsoCreditos } from "../../../components/grafico-uso-creditos";
import { TransaccionesRecientes } from "../../../components/transacciones-recientes";

export const metadata: Metadata = {
  title: "Dashboard | Reputación Online",
  description: "Panel de control de Reputación Online",
};

export default function DashboardPage() {
  // Datos de ejemplo para las estadísticas
  const estadisticas = {
    totalUsuarios: 145,
    cambioUsuarios: 12,
    totalCreditos: 45000,
    cambioCreditos: 8,
    creditosConsumidos: 28500,
    cambioConsumo: 15,
    totalPlanes: 4,
    cambioPlanes: 0,
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <EstadisticaCard
          title="Total Usuarios"
          value={estadisticas.totalUsuarios.toString()}
          icon={<Users className="h-5 w-5 text-white" />}
          cambio={estadisticas.cambioUsuarios}
          iconColor="bg-primary"
        />
        <EstadisticaCard
          title="Créditos Asignados"
          value={formatearCantidad(estadisticas.totalCreditos)}
          icon={<CreditCard className="h-5 w-5 text-white" />}
          cambio={estadisticas.cambioCreditos}
          iconColor="bg-secondary"
        />
        <EstadisticaCard
          title="Créditos Consumidos"
          value={formatearCantidad(estadisticas.creditosConsumidos)}
          icon={<TrendingUp className="h-5 w-5 text-white" />}
          cambio={estadisticas.cambioConsumo}
          iconColor="bg-cyan-500"
        />
        <EstadisticaCard
          title="Planes Activos"
          value={estadisticas.totalPlanes.toString()}
          icon={<Package className="h-5 w-5 text-white" />}
          cambio={estadisticas.cambioPlanes}
          iconColor="bg-emerald-500"
        />
      </div>

      {/* Gráfico de uso de créditos y transacciones recientes */}
      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4">
          <GraficoUsoCreditos />
        </div>
        <div className="md:col-span-3">
          <TransaccionesRecientes />
        </div>
      </div>

      {/* Estadísticas adicionales */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Tasa de Consumo de Créditos</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Consultas de Reputación</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <div className="progress-bar progress-turquesa">
                <div style={{ width: "75%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Análisis de Competencia</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="progress-bar progress-cyan">
                <div style={{ width: "45%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Reportes Especiales</span>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="progress-bar progress-turquesa">
                <div style={{ width: "30%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Alertas Automáticas</span>
                <span className="text-sm font-medium">60%</span>
              </div>
              <div className="progress-bar progress-cyan">
                <div style={{ width: "60%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Distribución por Planes</h3>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Plan Básico</span>
                  <span className="text-xs text-muted-foreground">42 usuarios</span>
                </div>
                <div className="progress-bar progress-turquesa mt-1">
                  <div style={{ width: "29%" }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Plan Estándar</span>
                  <span className="text-xs text-muted-foreground">68 usuarios</span>
                </div>
                <div className="progress-bar progress-cyan mt-1">
                  <div style={{ width: "47%" }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Plan Premium</span>
                  <span className="text-xs text-muted-foreground">35 usuarios</span>
                </div>
                <div className="progress-bar mt-1">
                  <div style={{ width: "24%" }} className="bg-emerald-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
