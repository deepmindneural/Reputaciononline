import React, { useState } from 'react';
import { useCreditosContext } from '@/context/CreditosContext';
import { motion } from 'framer-motion';
import { 
  Facebook, Instagram, Twitter, Linkedin, 
  TrendingUp, TrendingDown, CreditCard, AlertTriangle,
  Search, Calendar, Filter, ChevronDown
} from 'lucide-react';

type FiltroCanal = 'todos' | 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'general';
type FiltroTipo = 'todos' | 'asignacion' | 'consumo' | 'compra' | 'expiracion';

export default function HistorialCreditos() {
  const { creditos, cargandoCreditos } = useCreditosContext();
  const [filtroCanal, setFiltroCanal] = useState<FiltroCanal>('todos');
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Filtrar transacciones basadas en los criterios seleccionados
  const transaccionesFiltradas = creditos.historial.filter(transaccion => {
    // Filtro por canal
    if (filtroCanal !== 'todos' && transaccion.canal !== filtroCanal) {
      return false;
    }

    // Filtro por tipo
    if (filtroTipo !== 'todos' && transaccion.tipo !== filtroTipo) {
      return false;
    }

    // Filtro por búsqueda en descripción
    if (busqueda && !transaccion.descripcion.toLowerCase().includes(busqueda.toLowerCase())) {
      return false;
    }

    // Filtro por fecha inicio
    if (fechaInicio) {
      const fechaInicioObj = new Date(fechaInicio);
      if (transaccion.fecha < fechaInicioObj) {
        return false;
      }
    }

    // Filtro por fecha fin
    if (fechaFin) {
      const fechaFinObj = new Date(fechaFin);
      fechaFinObj.setHours(23, 59, 59, 999); // Final del día
      if (transaccion.fecha > fechaFinObj) {
        return false;
      }
    }

    return true;
  });

  // Animación para las filas de la tabla
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };

  // Función para obtener el ícono del canal
  const getIconoCanal = (canal?: string) => {
    switch (canal) {
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-600" />;
      case 'twitter':
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-blue-800" />;
      case 'tiktok':
        return <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs font-bold text-white">T</span>;
      default:
        return null;
    }
  };

  // Función para obtener el ícono del tipo de transacción
  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'asignacion':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'consumo':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'compra':
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'expiracion':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  // Función para formatear la fecha
  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Clase CSS según el tipo de transacción
  const getClaseTransaccion = (tipo: string) => {
    switch (tipo) {
      case 'asignacion':
      case 'compra':
        return 'transaction-success';
      case 'consumo':
        return '';
      case 'expiracion':
        return 'transaction-error';
      default:
        return '';
    }
  };

  // Formatear cantidad según tipo
  const formatearCantidad = (cantidad: number, tipo: string) => {
    const esPositivo = tipo === 'asignacion' || tipo === 'compra';
    return `${esPositivo ? '+' : '-'}${cantidad.toLocaleString('es-CO')}`;
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-4 sm:p-6">
        <h2 className="heading-secondary mb-4 flex items-center justify-between">
          <span>Historial de Transacciones</span>
          {cargandoCreditos && (
            <span className="ml-2 inline-flex h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-primary-600"></span>
          )}
        </h2>

        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-8 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              value={filtroCanal}
              onChange={(e) => setFiltroCanal(e.target.value as FiltroCanal)}
            >
              <option value="todos">Todos los canales</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
              <option value="general">General</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-8 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as FiltroTipo)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="asignacion">Asignación</option>
              <option value="consumo">Consumo</option>
              <option value="compra">Compra</option>
              <option value="expiracion">Expiración</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              placeholder="Fecha"
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabla de transacciones */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Canal</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Cantidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {transaccionesFiltradas.length > 0 ? (
              transaccionesFiltradas.map((transaccion, index) => (
                <motion.tr
                  key={transaccion.id}
                  className={`transaction-row ${getClaseTransaccion(transaccion.tipo)}`}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatearFecha(transaccion.fecha)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center">
                      {getIconoTipo(transaccion.tipo)}
                      <span className="ml-2 capitalize">{transaccion.tipo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {transaccion.descripcion}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      {getIconoCanal(transaccion.canal)}
                      {transaccion.canal && (
                        <span className="ml-2 capitalize">{transaccion.canal}</span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <span className={getClaseTransaccion(transaccion.tipo)}>
                      {formatearCantidad(transaccion.cantidad, transaccion.tipo)}
                    </span>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No se encontraron transacciones con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
