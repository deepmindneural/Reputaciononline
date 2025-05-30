"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";

interface DatosCreditos {
  fecha: string;
  asignados: number;
  consumidos: number;
}

export function GraficoUsoCreditos() {
  const [periodoActivo, setPeriodoActivo] = useState<'semana' | 'mes' | 'anio'>('mes');
  
  // Datos de ejemplo para el gráfico
  const datosSemanales: DatosCreditos[] = [
    { fecha: "Lun", asignados: 150, consumidos: 45 },
    { fecha: "Mar", asignados: 200, consumidos: 75 },
    { fecha: "Mié", asignados: 180, consumidos: 90 },
    { fecha: "Jue", asignados: 250, consumidos: 120 },
    { fecha: "Vie", asignados: 300, consumidos: 180 },
    { fecha: "Sáb", asignados: 180, consumidos: 100 },
    { fecha: "Dom", asignados: 120, consumidos: 50 },
  ];

  const datosMensuales: DatosCreditos[] = [
    { fecha: "Ene", asignados: 1200, consumidos: 850 },
    { fecha: "Feb", asignados: 1500, consumidos: 1200 },
    { fecha: "Mar", asignados: 1800, consumidos: 1450 },
    { fecha: "Abr", asignados: 2200, consumidos: 1900 },
    { fecha: "May", asignados: 2500, consumidos: 2100 },
    { fecha: "Jun", asignados: 2800, consumidos: 2300 },
    { fecha: "Jul", asignados: 3000, consumidos: 2500 },
    { fecha: "Ago", asignados: 3200, consumidos: 2700 },
    { fecha: "Sep", asignados: 3400, consumidos: 2900 },
    { fecha: "Oct", asignados: 3600, consumidos: 3100 },
    { fecha: "Nov", asignados: 3800, consumidos: 3300 },
    { fecha: "Dic", asignados: 4000, consumidos: 3500 },
  ];

  const datosAnuales: DatosCreditos[] = [
    { fecha: "2019", asignados: 10000, consumidos: 8500 },
    { fecha: "2020", asignados: 15000, consumidos: 12000 },
    { fecha: "2021", asignados: 20000, consumidos: 18000 },
    { fecha: "2022", asignados: 25000, consumidos: 22000 },
    { fecha: "2023", asignados: 30000, consumidos: 26000 },
  ];

  const datosMostrados = 
    periodoActivo === 'semana' ? datosSemanales : 
    periodoActivo === 'mes' ? datosMensuales : 
    datosAnuales;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-bold">{label}</p>
          <p className="text-sm text-primary">
            Asignados: {payload[0].value.toLocaleString('es-CO')} créditos
          </p>
          <p className="text-sm text-secondary">
            Consumidos: {payload[1].value.toLocaleString('es-CO')} créditos
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Uso de Créditos</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant={periodoActivo === 'semana' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriodoActivo('semana')}
            >
              Semana
            </Button>
            <Button 
              variant={periodoActivo === 'mes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriodoActivo('mes')}
            >
              Mes
            </Button>
            <Button 
              variant={periodoActivo === 'anio' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriodoActivo('anio')}
            >
              Año
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={datosMostrados}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAsignados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B3B0" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00B3B0" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorConsumidos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0CA5E9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0CA5E9" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="asignados"
                  name="Créditos Asignados"
                  stroke="#00B3B0"
                  fillOpacity={1}
                  fill="url(#colorAsignados)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="consumidos"
                  name="Créditos Consumidos"
                  stroke="#0CA5E9"
                  fillOpacity={1}
                  fill="url(#colorConsumidos)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
