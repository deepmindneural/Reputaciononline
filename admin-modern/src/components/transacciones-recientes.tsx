"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatearCantidad, formatearFecha, obtenerColorEstado } from "../lib/utils";

interface Transaccion {
  id: string;
  fecha: string;
  usuarioId: string;
  usuario: string;
  tipo: 'asignacion' | 'consumo' | 'compra';
  cantidad: number;
  estado: 'pendiente' | 'completado' | 'fallido';
  descripcion: string;
}

export function TransaccionesRecientes() {
  // Datos de ejemplo para las transacciones recientes
  const transacciones: Transaccion[] = [
    {
      id: "TRX-001",
      fecha: "2023-05-28",
      usuarioId: "USR-045",
      usuario: "Empresa ABC",
      tipo: "asignacion",
      cantidad: 500,
      estado: "completado",
      descripcion: "Asignaciu00f3n por compra de plan Premium",
    },
    {
      id: "TRX-002",
      fecha: "2023-05-27",
      usuarioId: "USR-023",
      usuario: "Consultora XYZ",
      tipo: "consumo",
      cantidad: 15,
      estado: "completado",
      descripcion: "Monitoreo de reputaciu00f3n mensual",
    },
    {
      id: "TRX-003",
      fecha: "2023-05-27",
      usuarioId: "USR-078",
      usuario: "Restaurant El Sabor",
      tipo: "compra",
      cantidad: 1000,
      estado: "pendiente",
      descripcion: "Compra de plan Empresarial",
    },
    {
      id: "TRX-004",
      fecha: "2023-05-26",
      usuarioId: "USR-112",
      usuario: "Hotel Esplendor",
      tipo: "consumo",
      cantidad: 25,
      estado: "fallido",
      descripcion: "Anu00e1lisis de reputaciu00f3n competitiva",
    },
    {
      id: "TRX-005",
      fecha: "2023-05-26",
      usuarioId: "USR-089",
      usuario: "Clu00ednica Salud Total",
      tipo: "asignacion",
      cantidad: 200,
      estado: "completado",
      descripcion: "Bonificaciu00f3n por referido",
    },
  ];

  const getTipoTransaccionText = (tipo: string) => {
    switch (tipo) {
      case "asignacion":
        return "Asignaciu00f3n";
      case "consumo":
        return "Consumo";
      case "compra":
        return "Compra";
      default:
        return tipo;
    }
  };

  const getTipoTransaccionColor = (tipo: string) => {
    switch (tipo) {
      case "asignacion":
        return "success";
      case "consumo":
        return "secondary";
      case "compra":
        return "turquesa";
      default:
        return "default";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {transacciones.map((tx, index) => (
              <motion.div 
                key={tx.id}
                className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 border-b pb-4 last:border-0"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant={getTipoTransaccionColor(tx.tipo)} className="mr-2">
                        {getTipoTransaccionText(tx.tipo)}
                      </Badge>
                      <span className="font-medium text-sm">{tx.usuario}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatearFecha(tx.fecha)}</span>
                  </div>
                  
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{tx.descripcion}</p>
                    <span className={`font-medium ${tx.tipo === 'consumo' ? 'text-red-500' : 'text-green-500'}`}>
                      {tx.tipo === 'consumo' ? '-' : '+'}{formatearCantidad(tx.cantidad)}
                    </span>
                  </div>

                  <div className="mt-1 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{tx.id}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${obtenerColorEstado(tx.estado)}`}>
                      {tx.estado.charAt(0).toUpperCase() + tx.estado.slice(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
