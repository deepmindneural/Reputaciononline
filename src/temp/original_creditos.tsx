// Archivo temporal para preservar el original
"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaMoneyBillWave, 
  FaExchangeAlt, 
  FaChartBar, 
  FaDownload, 
  FaFilter,
  FaCalendarAlt,
  FaUserCircle,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaSearch
} from 'react-icons/fa';
import Link from 'next/link';

// Gráfico de líneas para visualización de datos
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Transaccion {
  id: number;
  usuario: string;
  usuarioId: number;
  tipo: 'compra' | 'consumo' | 'ajuste' | 'reembolso';
  cantidad: number;
  fecha: string;
  descripcion: string;
  estado: 'completada' | 'pendiente' | 'fallida';
  plan?: string;
  metodoPago?: string;
}

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  plan: string;
  creditosDisponibles: number;
}

interface EstadisticaMensual {
  mes: string;
  compras: number;
  consumos: number;
  total: number;
}

export default function GestionCreditos() {
  // Estados para filtros
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('ultimo-mes');
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroPlan, setFiltroPlan] = useState('todos');
  
  // Estado para modal de detalles
  const [showModal, setShowModal] = useState(false);
  const [transaccionActual, setTransaccionActual] = useState<Transaccion | null>(null);
  
  // Estado para nuevo ajuste de créditos
  const [showAjusteModal, setShowAjusteModal] = useState(false);
  const [ajusteData, setAjusteData] = useState({
    usuarioId: 0,
    usuario: '',
    cantidad: 0,
    descripcion: '',
    tipo: 'ajuste'
  });

  // Datos de ejemplo - Transacciones
  const [transacciones, setTransacciones] = useState<Transaccion[]>([
    {
      id: 1,
      usuario: 'Ana Martínez',
      usuarioId: 1,
      tipo: 'compra',
      cantidad: 15000,
      fecha: '2024-02-15T10:30:00',
      descripcion: 'Compra de Plan Profesional',
      estado: 'completada',
      plan: 'Profesional',
      metodoPago: 'Tarjeta de crédito'
    },
    {
      id: 2,
      usuario: 'Carlos Ruiz',
      usuarioId: 2,
      tipo: 'consumo',
      cantidad: -1250,
      fecha: '2024-02-16T14:20:00',
      descripcion: 'Monitoreo de menciones en Twitter',
      estado: 'completada'
    },
    {
      id: 3,
      usuario: 'Laura Gómez',
      usuarioId: 3,
      tipo: 'compra',
      cantidad: 5000,
      fecha: '2024-02-18T09:45:00',
      descripcion: 'Compra de Plan Básico',
      estado: 'completada',
      plan: 'Básico',
      metodoPago: 'PayPal'
    },
    {
      id: 4,
      usuario: 'Carlos Ruiz',
      usuarioId: 2,
      tipo: 'ajuste',
      cantidad: 2000,
      fecha: '2024-02-20T11:15:00',
      descripcion: 'Bonificación por referido',
      estado: 'completada'
    },
    {
      id: 5,
      usuario: 'Miguel Sánchez',
      usuarioId: 4,
      tipo: 'reembolso',
      cantidad: 5000,
      fecha: '2024-02-22T16:30:00',
      descripcion: 'Reembolso por cancelación de servicio',
      estado: 'pendiente'
    },
    {
      id: 6,
      usuario: 'Ana Martínez',
      usuarioId: 1,
      tipo: 'consumo',
      cantidad: -750,
      fecha: '2024-02-23T08:10:00',
      descripcion: 'Análisis de sentimiento en Instagram',
      estado: 'completada'
    },
    {
      id: 7,
      usuario: 'Sofía Torres',
      usuarioId: 5,
      tipo: 'compra',
      cantidad: 50000,
      fecha: '2024-02-25T13:40:00',
      descripcion: 'Compra de Plan Empresarial',
      estado: 'completada',
      plan: 'Empresarial',
      metodoPago: 'Transferencia bancaria'
    },
    {
      id: 8,
      usuario: 'Laura Gómez',
      usuarioId: 3,
      tipo: 'consumo',
      cantidad: -450,
      fecha: '2024-02-26T10:20:00',
      descripcion: 'Monitoreo de menciones en Facebook',
      estado: 'completada'
    },
    {
      id: 9,
      usuario: 'Miguel Sánchez',
      usuarioId: 4,
      tipo: 'compra',
      cantidad: 15000,
      fecha: '2024-03-01T09:30:00',
      descripcion: 'Compra de Plan Profesional',
      estado: 'fallida',
      plan: 'Profesional',
      metodoPago: 'Tarjeta de crédito'
    },
    {
      id: 10,
      usuario: 'Sofía Torres',
      usuarioId: 5,
      tipo: 'consumo',
      cantidad: -2500,
      fecha: '2024-03-02T15:15:00',
      descripcion: 'Generación de informe completo',
      estado: 'completada'
    }
  ]);

  // Datos de ejemplo - Usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nombre: 'Ana Martínez',
      correo: 'ana.martinez@ejemplo.com',
      plan: 'Profesional',
      creditosDisponibles: 14250
    },
    {
      id: 2,
      nombre: 'Carlos Ruiz',
      correo: 'carlos.ruiz@ejemplo.com',
      plan: 'Empresarial',
      creditosDisponibles: 48720
    },
    {
      id: 3,
      nombre: 'Laura Gómez',
      correo: 'laura.gomez@ejemplo.com',
      plan: 'Básico',
      creditosDisponibles: 4125
    },
    {
      id: 4,
      nombre: 'Miguel Sánchez',
      correo: 'miguel.sanchez@ejemplo.com',
      plan: 'Profesional',
      creditosDisponibles: 0
    },
    {
      id: 5,
      nombre: 'Sofía Torres',
      correo: 'sofia.torres@ejemplo.com',
      plan: 'Empresarial',
      creditosDisponibles: 47500
    }
  ]);

  // Estadísticas mensuales
  const [estadisticasMensuales, setEstadisticasMensuales] = useState<EstadisticaMensual[]>([
    { mes: 'Ene', compras: 450000, consumos: -320000, total: 130000 },
    { mes: 'Feb', compras: 520000, consumos: -380000, total: 140000 },
    { mes: 'Mar', compras: 600000, consumos: -420000, total: 180000 },
    { mes: 'Abr', compras: 580000, consumos: -390000, total: 190000 },
    { mes: 'May', compras: 670000, consumos: -460000, total: 210000 },
    { mes: 'Jun', compras: 720000, consumos: -510000, total: 210000 }
  ]);

  // Filtrado de transacciones
  const transaccionesFiltradas = transacciones.filter(transaccion => {
    // Filtro por tipo
    const matchesTipo = filtroTipo === 'todos' || transaccion.tipo === filtroTipo;
    
    // Filtro por fecha
    let fechaLimite = new Date();
    if (filtroFecha === 'ultimo-mes') {
      fechaLimite.setMonth(fechaLimite.getMonth() - 1);
    } else if (filtroFecha === 'ultimos-3-meses') {
      fechaLimite.setMonth(fechaLimite.getMonth() - 3);
    } else if (filtroFecha === 'ultimo-ano') {
      fechaLimite.setFullYear(fechaLimite.getFullYear() - 1);
    }
    const fechaTransaccion = new Date(transaccion.fecha);
    const matchesFecha = filtroFecha === 'todos' || fechaTransaccion >= fechaLimite;
    
    // Filtro por usuario
    const matchesUsuario = filtroUsuario === '' || 
                          transaccion.usuario.toLowerCase().includes(filtroUsuario.toLowerCase());
    
    // Filtro por plan
    const matchesPlan = filtroPlan === 'todos' || transaccion.plan === filtroPlan;
    
    return matchesTipo && matchesFecha && matchesUsuario && matchesPlan;
  });

  // Cálculos de estadísticas
  const totalCreditos = usuarios.reduce((acc, usuario) => acc + usuario.creditosDisponibles, 0);
  const totalCompras = transacciones
    .filter(t => t.tipo === 'compra' && t.estado === 'completada')
    .reduce((acc, t) => acc + t.cantidad, 0);
  const totalConsumos = transacciones
    .filter(t => t.tipo === 'consumo')
    .reduce((acc, t) => acc + t.cantidad, 0);

  // Distribución de créditos por plan
  const distribucionPorPlan = [
    { name: 'Básico', value: usuarios.filter(u => u.plan === 'Básico').reduce((acc, u) => acc + u.creditosDisponibles, 0) },
    { name: 'Profesional', value: usuarios.filter(u => u.plan === 'Profesional').reduce((acc, u) => acc + u.creditosDisponibles, 0) },
    { name: 'Empresarial', value: usuarios.filter(u => u.plan === 'Empresarial').reduce((acc, u) => acc + u.creditosDisponibles, 0) }
  ];

  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Ver detalles de transacción
  const handleVerDetalles = (transaccion: Transaccion) => {
    setTransaccionActual(transaccion);
    setShowModal(true);
  };

  // Mostrar modal de ajuste
  const handleMostrarAjuste = () => {
    setAjusteData({
      usuarioId: 0,
      usuario: '',
      cantidad: 0,
      descripcion: '',
      tipo: 'ajuste'
    });
    setShowAjusteModal(true);
  };

  // Manejar cambios en el formulario de ajuste
  const handleAjusteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'usuario') {
      const usuarioSeleccionado = usuarios.find(u => u.nombre === value);
      if (usuarioSeleccionado) {
        setAjusteData({
          ...ajusteData,
          usuario: value,
          usuarioId: usuarioSeleccionado.id
        });
      }
    } else if (name === 'cantidad') {
      setAjusteData({
        ...ajusteData,
        cantidad: parseInt(value) || 0
      });
    } else {
      setAjusteData({
        ...ajusteData,
        [name]: value
      });
    }
  };

  // Guardar ajuste
  const handleGuardarAjuste = () => {
    if (!ajusteData.usuario || !ajusteData.cantidad || !ajusteData.descripcion) {
      alert('Por favor, complete todos los campos');
      return;
    }

    // Crear nueva transacción
    const nuevaTransaccion: Transaccion = {
      id: Math.max(...transacciones.map(t => t.id)) + 1,
      usuario: ajusteData.usuario,
      usuarioId: ajusteData.usuarioId,
      tipo: ajusteData.tipo as 'ajuste' | 'reembolso',
      cantidad: ajusteData.tipo === 'ajuste' ? Math.abs(ajusteData.cantidad) : -Math.abs(ajusteData.cantidad),
      fecha: new Date().toISOString(),
      descripcion: ajusteData.descripcion,
      estado: 'completada'
    };

    // Actualizar transacciones
    setTransacciones([...transacciones, nuevaTransaccion]);

    // Actualizar créditos de usuario
    setUsuarios(usuarios.map(usuario => {
      if (usuario.id === ajusteData.usuarioId) {
        return {
          ...usuario,
          creditosDisponibles: usuario.creditosDisponibles + (ajusteData.tipo === 'ajuste' ? Math.abs(ajusteData.cantidad) : -Math.abs(ajusteData.cantidad))
        };
      }
      return usuario;
    }));

    setShowAjusteModal(false);
  };

  return (
    <div className="py-6 px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Créditos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra los créditos y transacciones de todos los usuarios
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <button 
            onClick={handleMostrarAjuste}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors"
          >
            <FaMoneyBillWave className="mr-2" />
            Realizar ajuste
          </button>
          <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors">
            <FaDownload className="mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <FaCreditCard className="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Créditos Disponibles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCreditos.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <FaMoneyBillWave className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Compras</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCompras.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
              <FaExchangeAlt className="text-red-600 dark:text-red-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Consumos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.abs(totalConsumos).toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
              <FaUserCircle className="text-purple-600 dark:text-purple-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usuarios con Créditos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{usuarios.filter(u => u.creditosDisponibles > 0).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actividad Mensual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={estadisticasMensuales}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value: any) => new Intl.NumberFormat('es-CO').format(Math.abs(Number(value)))} />
              <Legend />
              <Bar dataKey="compras" name="Compras" fill="#4F46E5" />
              <Bar dataKey="consumos" name="Consumos" fill="#EF4444" />
              <Bar dataKey="total" name="Balance" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribución de Créditos por Plan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribucionPorPlan}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distribucionPorPlan.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => new Intl.NumberFormat('es-CO').format(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="filtroTipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de transacción</label>
            <select
              id="filtroTipo"
              className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="compra">Compras</option>
              <option value="consumo">Consumos</option>
              <option value="ajuste">Ajustes</option>
              <option value="reembolso">Reembolsos</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="filtroFecha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Período</label>
            <select
              id="filtroFecha"
              className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            >
              <option value="todos">Todo el tiempo</option>
              <option value="ultimo-mes">Último mes</option>
              <option value="ultimos-3-meses">Últimos 3 meses</option>
              <option value="ultimo-ano">Último año</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="filtroPlan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plan</label>
            <select
              id="filtroPlan"
              className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filtroPlan}
              onChange={(e) => setFiltroPlan(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="Básico">Básico</option>
              <option value="Profesional">Profesional</option>
              <option value="Empresarial">Empresarial</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="filtroUsuario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                id="filtroUsuario"
                placeholder="Buscar por nombre"
                className="pl-10 p-2.5 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
    </div>
    
    <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
      <button 
        onClick={handleMostrarAjuste}
        className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors"
      >
        <FaMoneyBillWave className="mr-2" />
        Realizar ajuste
      </button>
      <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors">
        <FaDownload className="mr-2" />
        Exportar
      </button>
    </div>
  </div>

  {/* Tarjetas de estadísticas */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
          <FaCreditCard className="text-green-600 dark:text-green-400 text-xl" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Créditos Disponibles</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCreditos.toLocaleString()}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
          <FaMoneyBillWave className="text-blue-600 dark:text-blue-400 text-xl" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Compras</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCompras.toLocaleString()}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
          <FaExchangeAlt className="text-red-600 dark:text-red-400 text-xl" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Consumos</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.abs(totalConsumos).toLocaleString()}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
          <FaUserCircle className="text-purple-600 dark:text-purple-400 text-xl" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usuarios con Créditos</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{usuarios.filter(u => u.creditosDisponibles > 0).length}</p>
        </div>
      </div>
    </div>
  </div>

  {/* Gráficos */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actividad Mensual</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={estadisticasMensuales}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip formatter={(value: any) => new Intl.NumberFormat('es-CO').format(Math.abs(Number(value)))} />
          <Legend />
          <Bar dataKey="compras" name="Compras" fill="#4F46E5" />
          <Bar dataKey="consumos" name="Consumos" fill="#EF4444" />
          <Bar dataKey="total" name="Balance" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribución de Créditos por Plan</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={distribucionPorPlan}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {distribucionPorPlan.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => new Intl.NumberFormat('es-CO').format(Number(value))} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Filtros */}
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label htmlFor="filtroTipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de transacción</label>
        <select
          id="filtroTipo"
          className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="compra">Compras</option>
          <option value="consumo">Consumos</option>
          <option value="ajuste">Ajustes</option>
          <option value="reembolso">Reembolsos</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="filtroFecha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Período</label>
        <select
          id="filtroFecha"
          className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        >
          <option value="todos">Todo el tiempo</option>
          <option value="ultimo-mes">Último mes</option>
          <option value="ultimos-3-meses">Últimos 3 meses</option>
          <option value="ultimo-ano">Último año</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="filtroPlan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plan</label>
        <select
          id="filtroPlan"
          className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={filtroPlan}
          onChange={(e) => setFiltroPlan(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="Básico">Básico</option>
          <option value="Profesional">Profesional</option>
          <option value="Empresarial">Empresarial</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="filtroUsuario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            id="filtroUsuario"
            placeholder="Buscar por nombre"
            className="pl-10 p-2.5 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
          />
        </div>
      </div>
    </div>
  </div>

  {/* Tabla de transacciones */}
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Historial de transacciones</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {transaccionesFiltradas.length} transacciones encontradas
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usuario</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cantidad</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {transaccionesFiltradas.map((transaccion) => (
            <tr key={transaccion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">#{transaccion.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{transaccion.usuario}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoClasses(transaccion.tipo)}`}>
                  {getTipoLabel(transaccion.tipo)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={transaccion.cantidad > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {transaccion.cantidad > 0 ? '+' : ''}{transaccion.cantidad.toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(transaccion.fecha).toLocaleString('es-CO', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClasses(transaccion.estado)}`}>
                  {getEstadoLabel(transaccion.estado)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleVerDetalles(transaccion)}
                  className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <FaEye className="inline" /> Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {transaccionesFiltradas.length === 0 && (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No se encontraron transacciones con los filtros aplicados.</p>
      </div>
    )}
  </div>

  {/* Modal de detalles de transacción */}
  {showModal && transaccionActual && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Detalles de la transacción #{transaccionActual.id}
          </h3>
          <button 
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo:</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTipoClasses(transaccionActual.tipo)}`}>
                {getTipoLabel(transaccionActual.tipo)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado:</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoClasses(transaccionActual.estado)}`}>
                {getEstadoLabel(transaccionActual.estado)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Usuario:</span>
              <span className="text-sm text-gray-900 dark:text-white">{transaccionActual.usuario}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Cantidad:</span>
              <span className={`text-sm ${transaccionActual.cantidad > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {transaccionActual.cantidad > 0 ? '+' : ''}{transaccionActual.cantidad.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha:</span>
              <span className="text-sm text-gray-900 dark:text-white">
                {new Date(transaccionActual.fecha).toLocaleString('es-CO')}
              </span>
            </div>
            {transaccionActual.plan && (
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan:</span>
                <span className="text-sm text-gray-900 dark:text-white">{transaccionActual.plan}</span>
              </div>
            )}
            {transaccionActual.metodoPago && (
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Método de pago:</span>
                <span className="text-sm text-gray-900 dark:text-white">{transaccionActual.metodoPago}</span>
              </div>
            )}
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Descripción:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{transaccionActual.descripcion}</p>
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-right">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Modal de ajuste de créditos */}
  {showAjusteModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Ajuste de créditos
          </h3>
          <button 
            onClick={() => setShowAjusteModal(false)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Usuario
            </label>
            <select
              id="usuario"
              name="usuario"
              className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={ajusteData.usuario}
              onChange={handleAjusteChange}
              required
            >
              <option value="">Seleccionar usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.nombre}>
                  {usuario.nombre} - {usuario.correo}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de ajuste
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="ajuste"
                  name="tipo"
                  value="ajuste"
                  checked={ajusteData.tipo === 'ajuste'}
                  onChange={handleAjusteChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="ajuste" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Agregar créditos
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="reembolso"
                  name="tipo"
                  value="reembolso"
                  checked={ajusteData.tipo === 'reembolso'}
                  onChange={handleAjusteChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="reembolso" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Restar créditos
                </label>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cantidad
            </label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={ajusteData.cantidad}
              onChange={handleAjusteChange}
              className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="1"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción / Motivo
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              value={ajusteData.descripcion}
              onChange={handleAjusteChange}
              className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            ></textarea>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right">
          <button
            type="button"
            onClick={() => setShowAjusteModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md mr-2 hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleGuardarAjuste}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )}
</div>
);

// Funciones auxiliares para obtener clases y etiquetas
function getTipoClasses(tipo: string): string {
  switch (tipo) {
    case 'compra':
{{ ... }}
    case 'consumo':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'ajuste':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'reembolso':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

function getTipoLabel(tipo: string): string {
  switch (tipo) {
    case 'compra':
      return 'Compra';
    case 'consumo':
      return 'Consumo';
    case 'ajuste':
      return 'Ajuste';
    case 'reembolso':
      return 'Reembolso';
    default:
      return tipo;
  }
}

function getEstadoClasses(estado: string): string {
  switch (estado) {
    case 'completada':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'fallida':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

function getEstadoLabel(estado: string): string {
  switch (estado) {
    case 'completada':
      return 'Completada';
    case 'pendiente':
      return 'Pendiente';
    case 'fallida':
      return 'Fallida';
    default:
      return estado;
  }
}
