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
  FaSearch,
  FaTrash,
  FaEdit,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin
} from 'react-icons/fa';
import Link from 'next/link';
import { useCreditos } from '@/context/CreditosContext';

// Importamos los componentes de gráficos avanzados
import { 
  ConsumosPorCanalChart, 
  TendenciaUsoChart, 
  CreditosPorUsuarioChart, 
  PrediccionUsoChart 
} from '@/components/admin/CreditosCharts';

// Importar gráficos para visualización de datos
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

// Funciones auxiliares
function getTipoClasses(tipo: string): string {
  switch (tipo) {
    case 'compra':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
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

interface SocialMediaToken {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
  token: string;
  userId: string;
  expiresAt: string;
}

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
  creditosGastados: number;
  ultimaActividad?: string;
  estado?: 'activo' | 'advertencia' | 'sin_creditos';
}

interface EstadisticaMensual {
  mes: string;
  compras: number;
  consumos: number;
  total: number;
}

// Componente principal
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

  // Estado para confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transaccionToDelete, setTransaccionToDelete] = useState<number | null>(null);

  // Estado para autenticación de redes sociales
  const [showSocialAuthModal, setShowSocialAuthModal] = useState(false);
  const [socialTokens, setSocialTokens] = useState<SocialMediaToken[]>([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authPlatform, setAuthPlatform] = useState<'facebook' | 'twitter' | 'instagram' | 'linkedin' | null>(null);

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
      correo: 'ana@empresa.com',
      plan: 'Profesional',
      creditosDisponibles: 8500,
      creditosGastados: 7500,
      ultimaActividad: '17/04/2025',
      estado: 'activo'
    },
    {
      id: 2,
      nombre: 'Carlos Ruiz',
      correo: 'carlos@empresa.com',
      plan: 'Básico',
      creditosDisponibles: 2300,
      creditosGastados: 2700,
      ultimaActividad: '15/04/2025',
      estado: 'advertencia'
    },
    {
      id: 3,
      nombre: 'Laura Gómez',
      correo: 'laura@empresa.com',
      plan: 'Básico',
      creditosDisponibles: 1200,
      creditosGastados: 3800,
      ultimaActividad: '16/04/2025',
      estado: 'advertencia'
    },
    {
      id: 4,
      nombre: 'Miguel Sánchez',
      correo: 'miguel@empresa.com',
      plan: 'Profesional',
      creditosDisponibles: 6800,
      creditosGastados: 8200,
      ultimaActividad: '17/04/2025',
      estado: 'activo'
    },
    {
      id: 5,
      nombre: 'Sofía Torres',
      correo: 'sofia@empresa.com',
      plan: 'Empresarial',
      creditosDisponibles: 32000,
      creditosGastados: 18000,
      ultimaActividad: '18/04/2025',
      estado: 'activo'
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

  // Cu00e1lculos de estadu00edsticas
  const totalCreditos = usuarios.reduce((acc, usuario) => acc + usuario.creditosDisponibles, 0);
  const totalCompras = transacciones
    .filter(t => t.tipo === 'compra' && t.estado === 'completada')
    .reduce((acc, t) => acc + t.cantidad, 0);
  const totalConsumos = transacciones
    .filter(t => t.tipo === 'consumo')
    .reduce((acc, t) => acc + t.cantidad, 0);

  // Distribuciu00f3n de cru00e9ditos por plan
  const distribucionPorPlan = [
    { name: 'Bu00e1sico', value: usuarios.filter(u => u.plan === 'Bu00e1sico').reduce((acc, u) => acc + u.creditosDisponibles, 0) },
    { name: 'Profesional', value: usuarios.filter(u => u.plan === 'Profesional').reduce((acc, u) => acc + u.creditosDisponibles, 0) },
    { name: 'Empresarial', value: usuarios.filter(u => u.plan === 'Empresarial').reduce((acc, u) => acc + u.creditosDisponibles, 0) }
  ];

  // Colores para los gru00e1ficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Datos para gráficos avanzados
  const datosConsumosPorCanal = [
    { name: 'Facebook', value: 12500, color: '#4267B2' },
    { name: 'Twitter/X', value: 18300, color: '#1DA1F2' },
    { name: 'Instagram', value: 15200, color: '#C13584' },
    { name: 'LinkedIn', value: 7800, color: '#0077B5' },
    { name: 'TikTok', value: 9350, color: '#000000' },
    { name: 'Búsqueda', value: 5400, color: '#34A853' },
  ];
  
  const datosTendenciaUso = [
    { fecha: 'Ene', consumidos: 32000, recargados: 50000 },
    { fecha: 'Feb', consumidos: 48000, recargados: 40000 },
    { fecha: 'Mar', consumidos: 37000, recargados: 45000 },
    { fecha: 'Abr', consumidos: 42000, recargados: 55000 },
    { fecha: 'May', consumidos: 35000, recargados: 30000 },
    { fecha: 'Jun', consumidos: 40000, recargados: 60000 },
  ];
  
  const datosCreditosPorUsuario = usuarios
    .sort((a, b) => (b.creditosDisponibles + b.creditosGastados) - (a.creditosDisponibles + a.creditosGastados))
    .slice(0, 10)
    .map(usuario => ({
      nombre: usuario.nombre,
      disponibles: usuario.creditosDisponibles,
      gastados: usuario.creditosGastados || 0,
    }));
  
  const datosPrediccionUso = [
    { fecha: 'Ene', actual: 32000, prediccion: 32000 },
    { fecha: 'Feb', actual: 48000, prediccion: 45000 },
    { fecha: 'Mar', actual: 37000, prediccion: 40000 },
    { fecha: 'Abr', actual: 42000, prediccion: 39000 },
    { fecha: 'May', prediccion: 44000 },
    { fecha: 'Jun', prediccion: 48000 },
    { fecha: 'Jul', prediccion: 52000 },
  ];

  // Ver detalles de transacciu00f3n
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

    // Crear nueva transacciu00f3n
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

    // Actualizar cru00e9ditos de usuario
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

  // Mostrar confirmaciu00f3n de eliminaciu00f3n
  const handleConfirmDelete = (id: number) => {
    setTransaccionToDelete(id);
    setShowDeleteModal(true);
  };

  // Eliminar transacciu00f3n
  const handleDeleteTransaccion = () => {
    if (transaccionToDelete !== null) {
      // Eliminar la transacciu00f3n
      setTransacciones(transacciones.filter(t => t.id !== transaccionToDelete));
      
      // Si la transacciu00f3n es un ajuste o reembolso, revertir los cru00e9ditos
      const transaccion = transacciones.find(t => t.id === transaccionToDelete);
      if (transaccion && (transaccion.tipo === 'ajuste' || transaccion.tipo === 'reembolso')) {
        setUsuarios(usuarios.map(usuario => {
          if (usuario.id === transaccion.usuarioId) {
            return {
              ...usuario,
              creditosDisponibles: usuario.creditosDisponibles - transaccion.cantidad
            };
          }
          return usuario;
        }));
      }
      
      setShowDeleteModal(false);
      setTransaccionToDelete(null);
    }
  };

  // Autenticaciu00f3n con redes sociales
  const handleSocialAuth = async (platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin') => {
    setIsAuthenticating(true);
    setAuthPlatform(platform);
    
    try {
      let token: SocialMediaToken | null = null;
      
      // Simulaciu00f3n de autenticaciu00f3n con diferentes plataformas
      switch (platform) {
        case 'facebook':
          // En un entorno real, esto abriru00eda una ventana OAuth
          await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay
          token = {
            platform: 'facebook',
            token: 'fb-token-' + Date.now(),
            userId: 'fb-user-123',
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
          };
          break;
          
        case 'twitter':
          await new Promise(resolve => setTimeout(resolve, 1500));
          token = {
            platform: 'twitter',
            token: 'tw-token-' + Date.now(),
            userId: 'tw-user-456',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          };
          break;
          
        case 'instagram':
          await new Promise(resolve => setTimeout(resolve, 1500));
          token = {
            platform: 'instagram',
            token: 'ig-token-' + Date.now(),
            userId: 'ig-user-789',
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
          };
          break;
          
        case 'linkedin':
          await new Promise(resolve => setTimeout(resolve, 1500));
          token = {
            platform: 'linkedin',
            token: 'li-token-' + Date.now(),
            userId: 'li-user-101',
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
          };
          break;
      }
      
      if (token) {
        // Actualizar tokens (reemplazar si ya existe uno para esa plataforma)
        setSocialTokens(prev => {
          const newTokens = prev.filter(t => t.platform !== platform);
          return [...newTokens, token!];
        });
        
        alert(`Autenticaciu00f3n con ${platform} exitosa!`);
      }
    } catch (error) {
      console.error(`Error al autenticar con ${platform}:`, error);
      alert(`Error al autenticar con ${platform}. Intu00e9ntelo de nuevo.`);
    } finally {
      setIsAuthenticating(false);
      setAuthPlatform(null);
    }
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
          <button 
            onClick={() => setShowSocialAuthModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors"
          >
            <FaFacebook className="mr-2" />
            Conectar redes
          </button>
          <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors">
            <FaDownload className="mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
              <FaMoneyBillWave size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{totalCreditos.toLocaleString()}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Créditos Disponibles</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
              <FaExchangeAlt size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{totalCompras.toLocaleString()}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Créditos Comprados</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 mr-4">
              <FaChartBar size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{Math.abs(totalConsumos).toLocaleString()}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Créditos Consumidos</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mr-4">
              <FaUserCircle size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{usuarios.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Usuarios Activos</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard de análisis avanzado */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Análisis Avanzado de Créditos</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ConsumosPorCanalChart data={datosConsumosPorCanal} />
          <TendenciaUsoChart data={datosTendenciaUso} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CreditosPorUsuarioChart data={datosCreditosPorUsuario} />
          <PrediccionUsoChart data={datosPrediccionUso} />
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

      {/* Redes sociales conectadas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Redes Sociales Conectadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => {
            const isConnected = socialTokens.some(t => t.platform === platform);
            const token = socialTokens.find(t => t.platform === platform);
            const expiryDate = token ? new Date(token.expiresAt).toLocaleDateString('es-CO') : null;
            
            return (
              <div key={platform} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {platform === 'facebook' && <FaFacebook className="text-blue-600 mr-2 text-xl" />}
                    {platform === 'twitter' && <FaTwitter className="text-blue-400 mr-2 text-xl" />}
                    {platform === 'instagram' && <FaInstagram className="text-pink-600 mr-2 text-xl" />}
                    {platform === 'linkedin' && <FaLinkedin className="text-blue-700 mr-2 text-xl" />}
                    <span className="font-medium capitalize">{platform}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {isConnected ? 'Conectado' : 'No conectado'}
                  </span>
                </div>
                {isConnected && expiryDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Expira: {expiryDate}</p>
                )}
                <button
                  onClick={() => isConnected ? null : handleSocialAuth(platform as any)}
                  disabled={isConnected}
                  className={`mt-2 w-full py-1 px-2 text-xs font-medium rounded ${isConnected ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  {isConnected ? 'Conectado' : 'Conectar'}
                </button>
              </div>
            );
          })}
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
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                      title="Ver detalles"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleConfirmDelete(transaccion.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Eliminar transacciu00f3n"
                    >
                      <FaTrash />
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

      {/* Modal de detalles de transacciu00f3n */}
      {showModal && transaccionActual && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Detalles de la transacciu00f3n #{transaccionActual.id}
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
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Mu00e9todo de pago:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{transaccionActual.metodoPago}</span>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Descripciu00f3n:</h4>
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

      {/* Modal de ajuste de cru00e9ditos */}
      {showAjusteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Ajuste de cru00e9ditos
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
                      Agregar cru00e9ditos
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
                      Restar cru00e9ditos
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
                  Descripciu00f3n / Motivo
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
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Confirmar eliminación
              </h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700 dark:text-gray-300">
                ¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md mr-2 hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteTransaccion}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de autenticación con redes sociales */}
      {showSocialAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Conectar con redes sociales
              </h3>
              <button 
                onClick={() => setShowSocialAuthModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Conecta la plataforma con las redes sociales para monitorear menciones y gestionar reportes.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleSocialAuth('facebook')}
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating && authPlatform === 'facebook' ? (
                    <span>Conectando...</span>
                  ) : (
                    <>
                      <FaFacebook className="mr-2" />
                      <span>Conectar con Facebook</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleSocialAuth('twitter')}
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-400 hover:bg-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating && authPlatform === 'twitter' ? (
                    <span>Conectando...</span>
                  ) : (
                    <>
                      <FaTwitter className="mr-2" />
                      <span>Conectar con Twitter/X</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleSocialAuth('instagram')}
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating && authPlatform === 'instagram' ? (
                    <span>Conectando...</span>
                  ) : (
                    <>
                      <FaInstagram className="mr-2" />
                      <span>Conectar con Instagram</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleSocialAuth('linkedin')}
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating && authPlatform === 'linkedin' ? (
                    <span>Conectando...</span>
                  ) : (
                    <>
                      <FaLinkedin className="mr-2" />
                      <span>Conectar con LinkedIn</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right">
              <button
                type="button"
                onClick={() => setShowSocialAuthModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
