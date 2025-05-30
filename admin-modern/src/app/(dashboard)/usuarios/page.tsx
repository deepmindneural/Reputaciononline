"use client";

import { useState } from "react";
import { Metadata } from "next";
import { motion } from "framer-motion";
import { Search, Plus, Filter, RefreshCw, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatearFecha } from "@/lib/utils";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  empresa: string;
  plan: string;
  creditosActuales: number;
  fechaRegistro: string;
  estado: "activo" | "inactivo" | "pendiente";
}

export default function UsuariosPage() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");

  // Datos de ejemplo para usuarios
  const usuarios: Usuario[] = [
    {
      id: "USR-001",
      nombre: "María González",
      email: "maria@empresaabc.com",
      empresa: "Empresa ABC",
      plan: "Premium",
      creditosActuales: 750,
      fechaRegistro: "2023-01-15",
      estado: "activo",
    },
    {
      id: "USR-002",
      nombre: "Juan Rodríguez",
      email: "juan@consultoraxyz.com",
      empresa: "Consultora XYZ",
      plan: "Estándar",
      creditosActuales: 350,
      fechaRegistro: "2023-02-22",
      estado: "activo",
    },
    {
      id: "USR-003",
      nombre: "Ana Martínez",
      email: "ana@elsabor.com",
      empresa: "Restaurant El Sabor",
      plan: "Básico",
      creditosActuales: 100,
      fechaRegistro: "2023-03-10",
      estado: "pendiente",
    },
    {
      id: "USR-004",
      nombre: "Carlos López",
      email: "carlos@hotelesplendor.com",
      empresa: "Hotel Esplendor",
      plan: "Premium",
      creditosActuales: 1200,
      fechaRegistro: "2023-01-05",
      estado: "activo",
    },
    {
      id: "USR-005",
      nombre: "Laura Sánchez",
      email: "laura@clinicasalud.com",
      empresa: "Clínica Salud Total",
      plan: "Estándar",
      creditosActuales: 0,
      fechaRegistro: "2023-04-18",
      estado: "inactivo",
    },
    {
      id: "USR-006",
      nombre: "Roberto Fernández",
      email: "roberto@tecnoinnova.com",
      empresa: "TecnoInnova",
      plan: "Premium",
      creditosActuales: 890,
      fechaRegistro: "2023-02-28",
      estado: "activo",
    },
  ];

  const usuariosFiltrados = usuarios.filter((usuario) => {
    // Filtrar por búsqueda
    const coincideBusqueda =
      busqueda === "" ||
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.empresa.toLowerCase().includes(busqueda.toLowerCase());

    // Filtrar por estado
    const coincideEstado =
      filtroEstado === "todos" || usuario.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const getColorPlan = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "premium":
        return "bg-primary text-white";
      case "estándar":
        return "bg-secondary text-white";
      case "básico":
        return "bg-cyan-500 text-white";
      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getEstadoUsuario = (estado: string) => {
    switch (estado) {
      case "activo":
        return (
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            <span>Activo</span>
          </div>
        );
      case "inactivo":
        return (
          <div className="flex items-center">
            <XCircle className="w-4 h-4 mr-1 text-red-500" />
            <span>Inactivo</span>
          </div>
        );
      case "pendiente":
        return (
          <div className="flex items-center">
            <RefreshCw className="w-4 h-4 mr-1 text-yellow-500" />
            <span>Pendiente</span>
          </div>
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
          <h2 className="text-3xl font-bold tracking-tight">Usuarios</h2>
          <p className="text-muted-foreground">
            Gestiona los usuarios registrados en la plataforma.
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            <span>Nuevo Usuario</span>
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
                placeholder="Buscar por nombre, email o empresa..."
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
              <Button
                variant={filtroEstado === "pendiente" ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroEstado("pendiente")}
              >
                Pendientes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
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
                  <TableHead>Usuario</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Créditos</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                ) : (
                  usuariosFiltrados.map((usuario, index) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{usuario.nombre}</span>
                          <span className="text-sm text-muted-foreground">
                            {usuario.email}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {usuario.empresa}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getColorPlan(usuario.plan)}>
                          {usuario.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${usuario.creditosActuales === 0 ? "text-red-500" : ""}`}
                        >
                          {usuario.creditosActuales.toLocaleString("es-CO")}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatearFecha(usuario.fechaRegistro)}
                      </TableCell>
                      <TableCell>{getEstadoUsuario(usuario.estado)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
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
