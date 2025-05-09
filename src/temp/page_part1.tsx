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
