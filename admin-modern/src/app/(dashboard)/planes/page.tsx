"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Package, Star, Check, MoreHorizontal } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { formatearCantidad, formatearFecha } from "../../../lib/utils";

interface Plan {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  creditosIncluidos: number;
  duracion: string;
  caracteristicas: string[];
  destacado: boolean;
  estado: "activo" | "inactivo";
  fechaCreacion: string;
  color: string;
}

export default function PlanesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");

  // Datos de ejemplo para planes
  const planes: Plan[] = [
    {
      id: "PLAN-001",
      nombre: "Plan Básico",
      descripcion: "Ideal para pequeños negocios que inician su monitoreo de reputación online",
      precio: 99000,
      creditosIncluidos: 100,
      duracion: "mensual",
      caracteristicas: [
        "Monitoreo básico de menciones",
        "Hasta 3 palabras clave",
        "Reporte mensual",
        "Soporte por email"
      ],
      destacado: false,
      estado: "activo",
      fechaCreacion: "2023-01-10",
      color: "#0CA5E9"
    },
    {
      id: "PLAN-002",
      nombre: "Plan Estándar",
      descripcion: "Perfecto para empresas medianas que necesitan un seguimiento regular",
      precio: 249000,
      creditosIncluidos: 300,
      duracion: "mensual",
      caracteristicas: [
        "Monitoreo avanzado de menciones",
        "Hasta 8 palabras clave",
        "Análisis de sentimiento",
        "Reportes semanales",
        "Soporte prioritario"
      ],
      destacado: true,
      estado: "activo",
      fechaCreacion: "2023-01-15",
      color: "#00B3B0"
    },
    {
      id: "PLAN-003",
      nombre: "Plan Premium",
      descripcion: "Solución completa para grandes empresas con presencia digital significativa",
      precio: 499000,
      creditosIncluidos: 800,
      duracion: "mensual",
      caracteristicas: [
        "Monitoreo completo en todas las plataformas",
        "Palabras clave ilimitadas",
        "Análisis avanzado de sentimiento",
        "Análisis de competencia",
        "Alertas en tiempo real",
        "Reportes personalizados",
        "Soporte 24/7"
      ],
      destacado: false,
      estado: "activo",
      fechaCreacion: "2023-01-20",
      color: "#6366F1"
    },
    {
      id: "PLAN-004",
      nombre: "Plan Empresarial",
      descripcion: "Plan personalizado para corporaciones con necesidades específicas",
      precio: 999000,
      creditosIncluidos: 2000,
      duracion: "mensual",
      caracteristicas: [
        "Todo lo del plan Premium",
        "API de integración",
        "Dashboard personalizado",
        "Consultor dedicado",
        "Estrategias de gestión de crisis",
        "Informes ejecutivos mensuales"
      ],
      destacado: false,
      estado: "inactivo",
      fechaCreacion: "2023-02-05",
      color: "#8B5CF6"
    }
  ];

  // Filtrar planes
  const planesFiltrados = planes.filter((plan) => {
    // Filtrar por búsqueda
    const coincideBusqueda =
      busqueda === "" ||
      plan.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      plan.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    // Filtrar por estado
    const coincideEstado =
      filtroEstado === "todos" || plan.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="space-y-6">
      {/* Cabecera con acciones */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Planes</h2>
          <p className="text-muted-foreground">
            Gestiona los planes de suscripción disponibles en la plataforma.
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            <span>Nuevo Plan</span>
          </Button>
        </motion.div>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar planes..."
                className="pl-8"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filtroEstado === "todos" ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroEstado("todos")}
              >
                Todos
              </Button>
              <Button
                variant={filtroEstado === "activo" ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroEstado("activo")}
              >
                Activos
              </Button>
              <Button
                variant={filtroEstado === "inactivo" ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroEstado("inactivo")}
              >
                Inactivos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjetas de planes */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {planesFiltrados.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="h-full"
          >
            <Card className={`h-full overflow-hidden ${plan.destacado ? 'border-primary border-2' : ''}`}>
              {plan.destacado && (
                <div className="bg-primary w-full py-1 px-4 text-white text-center text-sm font-medium">
                  <Star className="h-4 w-4 inline mr-1" /> Plan Recomendado
                </div>
              )}
              <CardHeader 
                className="pb-3"
                style={{ backgroundColor: `${plan.color}10` }} // Color muy sutil de fondo
              >
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{plan.nombre}</CardTitle>
                    <span className="block mt-1 text-muted-foreground text-sm">{plan.duracion.charAt(0).toUpperCase() + plan.duracion.slice(1)}</span>
                  </div>
                  <Badge 
                    variant={plan.estado === "activo" ? "success" : "danger"}
                  >
                    {plan.estado === "activo" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-bold" style={{ color: plan.color }}>
                    {formatearCantidad(plan.precio)}
                  </span>
                  <span className="text-muted-foreground"> /mes</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">{plan.descripcion}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Créditos incluidos:</span>
                  <span className="font-bold">{plan.creditosIncluidos.toLocaleString('es-CO')}</span>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  {plan.caracteristicas.map((caracteristica, i) => (
                    <div key={i} className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-0.5" style={{ color: plan.color }} />
                      <span className="text-sm">{caracteristica}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <span className="text-xs text-muted-foreground">
                  Creado: {formatearFecha(plan.fechaCreacion)}
                </span>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {planesFiltrados.length === 0 && (
        <div className="text-center py-10">
          <Package className="mx-auto h-10 w-10 text-muted-foreground opacity-30" />
          <h3 className="mt-4 text-lg font-semibold">No se encontraron planes</h3>
          <p className="mt-2 text-muted-foreground">
            No hay planes que coincidan con los criterios de búsqueda.
          </p>
        </div>
      )}
    </div>
  );
}
