"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, CreditCard, TrendingUp, Download, Calendar, Filter } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { formatearCantidad, formatearFecha, obtenerColorEstado } from "../../../lib/utils";

interface Transaccion {
  id: string;
  fecha: string;
  usuarioId: string;
  usuario: string;
  tipo: 'asignacion' | 'consumo' | 'compra';
  cantidad: number;
  estado: 'pendiente' | 'completado' | 'fallido';
  descripcion: string;
  admin?: string;
}

export default function CreditosPage() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");

  // Datos de ejemplo para transacciones
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
      admin: "Admin 1"
    },
    {
      id: "TRX-002",
      fecha: "2023-05-27",
      usuarioId: "USR-023",
      usuario: "Consultora XYZ",
      tipo: "consumo",
      cantidad: 15,
      estado: "completado",
      descripcion: "Monitoreo de reputaciu00f3n mensual"
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
      admin: "Admin 2"
    },
    {
      id: "TRX-004",
      fecha: "2023-05-26",
      usuarioId: "USR-112",
      usuario: "Hotel Esplendor",
      tipo: "consumo",
      cantidad: 25,
      estado: "fallido",
      descripcion: "Anu00e1lisis de reputaciu00f3n competitiva"
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
      admin: "Admin 1"
    },
    {
      id: "TRX-006",
      fecha: "2023-05-25",
      usuarioId: "USR-056",
      usuario: "Universidad Futuro",
      tipo: "consumo",
      cantidad: 50,
      estado: "completado",
      descripcion: "Reporte mensual de menciones"
    },
    {
      id: "TRX-007",
      fecha: "2023-05-24",
      usuarioId: "USR-071",
      usuario: "Servicios Legales JR",
      tipo: "compra",
      cantidad: 300,
      estado: "completado",
      descripcion: "Compra de cru00e9ditos adicionales",
      admin: "Admin 3"
    },
    {
      id: "TRX-008",
      fecha: "2023-05-23",
      usuarioId: "USR-023",
      usuario: "Consultora XYZ",
      tipo: "consumo",
      cantidad: 10,
      estado: "completado",
      descripcion: "Alerta de menciu00f3n negativa"
    },
  ];

  // Filtrar transacciones
  const transaccionesFiltradas = transacciones.filter((tx) => {
    // Filtrar por bu00fasqueda
    const coincideBusqueda =
      busqueda === "" ||
      tx.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      tx.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      tx.id.toLowerCase().includes(busqueda.toLowerCase());

    // Filtrar por tipo de transacciu00f3n
    const coincideTipo =
      filtroTipo === "todos" || tx.tipo === filtroTipo;

    return coincideBusqueda && coincideTipo;
  });

  // Estadu00edsticas de cru00e9ditos
  const totalCreditosAsignados = transacciones
    .filter(tx => tx.tipo === "asignacion" && tx.estado === "completado")
    .reduce((total, tx) => total + tx.cantidad, 0);

  const totalCreditosConsumidos = transacciones
    .filter(tx => tx.tipo === "consumo" && tx.estado === "completado")
    .reduce((total, tx) => total + tx.cantidad, 0);

  const totalCreditosComprados = transacciones
    .filter(tx => tx.tipo === "compra" && tx.estado === "completado")
    .reduce((total, tx) => total + tx.cantidad, 0);

  // Formatear los tipos de transacciones
  const getTipoTransaccion = (tipo: string) => {
    switch (tipo) {
      case "asignacion":
        return (
          <Badge variant="success">
            Asignaciu00f3n
          </Badge>
        );
      case "consumo":
        return (
          <Badge variant="secondary">
            Consumo
          </Badge>
        );
      case "compra":
        return (
          <Badge variant="turquesa">
            Compra
          </Badge>
        );
      default:
        return <Badge>{tipo}</Badge>;
    }
  };

  // Obtener el color para el estado de la transacciu00f3n
  const getEstadoTransaccion = (estado: string) => {
    switch (estado) {
      case "completado":
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Completado
          </span>
        );
      case "pendiente":
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pendiente
          </span>
        );
      case "fallido":
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Fallido
          </span>
        );
      default:
        return <span>{estado}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera con acciones */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cru00e9ditos</h2>
          <p className="text-muted-foreground">
            Administra las transacciones y asignaciones de cru00e9ditos.
          </p>
        </div>
        <div className="flex gap-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Asignar Cru00e9ditos</span>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Estadu00edsticas de cru00e9ditos */}
      <div className="grid gap-6 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Asignados</CardTitle>
              <div className="p-2 rounded-full bg-primary">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatearCantidad(totalCreditosAsignados)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Cru00e9ditos totales asignados a usuarios
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Consumidos</CardTitle>
              <div className="p-2 rounded-full bg-secondary">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatearCantidad(totalCreditosConsumidos)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Cru00e9ditos utilizados por los usuarios
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Comprados</CardTitle>
              <div className="p-2 rounded-full bg-emerald-500">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatearCantidad(totalCreditosComprados)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Cru00e9ditos adquiridos mediante compras
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filtros y bu00fasqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por usuario, descripciu00f3n o ID..."
                className="pl-8"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filtroTipo === "todos" ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroTipo("todos")}
              >
                Todos
              </Button>
              <Button
                variant={filtroTipo === "asignacion" ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroTipo("asignacion")}
              >
                Asignaciones
              </Button>
              <Button
                variant={filtroTipo === "consumo" ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroTipo("consumo")}
              >
                Consumos
              </Button>
              <Button
                variant={filtroTipo === "compra" ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroTipo("compra")}
              >
                Compras
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de transacciones */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Descripciu00f3n</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaccionesFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                ) : (
                  transaccionesFiltradas.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.id}</TableCell>
                      <TableCell>{formatearFecha(tx.fecha)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{tx.usuario}</span>
                          <span className="text-xs text-muted-foreground">
                            {tx.usuarioId}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getTipoTransaccion(tx.tipo)}</TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${tx.tipo === "consumo" ? "text-red-500" : "text-green-500"}`}
                        >
                          {tx.tipo === "consumo" ? "-" : "+"}{formatearCantidad(tx.cantidad)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[250px] truncate" title={tx.descripcion}>
                          {tx.descripcion}
                        </div>
                      </TableCell>
                      <TableCell>{getEstadoTransaccion(tx.estado)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
