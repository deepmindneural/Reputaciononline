"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaUserPlus, FaSearch, FaEdit, FaTrash, FaEye, FaSync, FaChartBar, FaHistory, 
  FaExclamationTriangle, FaCheck, FaDownload, FaFacebook, FaTwitter, FaInstagram, 
  FaLinkedin, FaArrowUp, FaArrowDown, FaArrowsAltH
} from 'react-icons/fa';
import Link from 'next/link';

interface HistorialItem {
  id: number;
  fecha: string;
  accion: string;
  detalles: string;
  creditosUsados?: number;
}

interface EstadisticaUsuario {
  totalMenciones: number;
  redes: {
    facebook: number;
    twitter: number;
    instagram: number;
    linkedin: number;
  };
  sentimiento: {
    positivo: number;
    neutro: number;
    negativo: number;
  };
  tendencia: 'alza' | 'estable' | 'baja';
  ultimaActividad: string;
}

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  plan: string;
  estado: 'Activo' | 'Inactivo' | 'Pendiente';
  creditosDisponibles: number;
  fechaRegistro: string;
  historial?: HistorialItem[];
  estadisticas?: EstadisticaUsuario;
}

export default function GestionUsuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('Todos');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [accionConfirm, setAccionConfirm] = useState<'activar' | 'desactivar' | 'eliminar'>('activar');
  const [showEstadisticasModal, setShowEstadisticasModal] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [showPerfilCompletoModal, setShowPerfilCompletoModal] = useState(false);
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    plan: 'Básico',
    estado: 'Activo',
    creditosDisponibles: 5000
  });
  
  // Estado para validación de formularios
  const [formErrors, setFormErrors] = useState({
    nombre: '',
    correo: '',
    creditosDisponibles: ''
  });

  // Planes disponibles para asignar a usuarios
  const planesDisponibles = [
    { id: 1, nombre: 'Básico', creditos: 5000 },
    { id: 2, nombre: 'Profesional', creditos: 15000 },
    { id: 3, nombre: 'Empresarial', creditos: 50000 },
    { id: 4, nombre: 'Premium', creditos: 100000 }
  ];

  // Datos de ejemplo
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nombre: 'Ana Martínez',
      correo: 'ana.martinez@ejemplo.com',
      plan: 'Profesional',
      estado: 'Activo',
      creditosDisponibles: 14250,
      fechaRegistro: '2023-11-15',
      historial: [
        { id: 1, fecha: '2024-03-15', accion: 'Análisis de mención', detalles: 'Análisis de comentarios en Twitter', creditosUsados: 150 },
        { id: 2, fecha: '2024-03-10', accion: 'Monitoreo automático', detalles: 'Configuración de monitoreo semanal', creditosUsados: 500 },
        { id: 3, fecha: '2024-02-25', accion: 'Reporte mensual', detalles: 'Generación de reporte de reputación', creditosUsados: 1000 },
      ],
      estadisticas: {
        totalMenciones: 278,
        redes: {
          facebook: 65,
          twitter: 120,
          instagram: 72,
          linkedin: 21
        },
        sentimiento: {
          positivo: 62,
          neutro: 30,
          negativo: 8
        },
        tendencia: 'alza',
        ultimaActividad: '2024-03-15'
      }
    },
    {
      id: 2,
      nombre: 'Carlos Ruiz',
      correo: 'carlos.ruiz@ejemplo.com',
      plan: 'Empresarial',
      estado: 'Activo',
      creditosDisponibles: 48720,
      fechaRegistro: '2023-09-28',
      historial: [
        { id: 1, fecha: '2024-03-18', accion: 'Análisis competencia', detalles: 'Comparativa con 3 competidores', creditosUsados: 2500 },
        { id: 2, fecha: '2024-03-05', accion: 'Monitoreo diario', detalles: 'Configuración de alertas', creditosUsados: 1800 },
      ],
      estadisticas: {
        totalMenciones: 1250,
        redes: {
          facebook: 350,
          twitter: 580,
          instagram: 220,
          linkedin: 100
        },
        sentimiento: {
          positivo: 72,
          neutro: 20,
          negativo: 8
        },
        tendencia: 'estable',
        ultimaActividad: '2024-03-18'
      }
    },
    {
      id: 3,
      nombre: 'Laura Gómez',
      correo: 'laura.gomez@ejemplo.com',
      plan: 'Básico',
      estado: 'Activo',
      creditosDisponibles: 4125,
      fechaRegistro: '2024-01-05',
      historial: [
        { id: 1, fecha: '2024-03-01', accion: 'Primer análisis', detalles: 'Análisis inicial de perfil', creditosUsados: 500 },
        { id: 2, fecha: '2024-02-15', accion: 'Configuración', detalles: 'Configuración de cuenta', creditosUsados: 0 },
      ],
      estadisticas: {
        totalMenciones: 56,
        redes: {
          facebook: 15,
          twitter: 25,
          instagram: 12,
          linkedin: 4
        },
        sentimiento: {
          positivo: 60,
          neutro: 35,
          negativo: 5
        },
        tendencia: 'alza',
        ultimaActividad: '2024-03-01'
      }
    },
    {
      id: 4,
      nombre: 'Miguel Sánchez',
      correo: 'miguel.sanchez@ejemplo.com',
      plan: 'Profesional',
      estado: 'Inactivo',
      creditosDisponibles: 0,
      fechaRegistro: '2023-08-12',
      historial: [
        { id: 1, fecha: '2023-12-10', accion: 'Último análisis', detalles: 'Análisis antes de inactividad', creditosUsados: 800 },
        { id: 2, fecha: '2023-10-15', accion: 'Reporte trimestral', detalles: 'Generación de reporte', creditosUsados: 1200 },
      ],
      estadisticas: {
        totalMenciones: 350,
        redes: {
          facebook: 120,
          twitter: 150,
          instagram: 50,
          linkedin: 30
        },
        sentimiento: {
          positivo: 45,
          neutro: 30,
          negativo: 25
        },
        tendencia: 'baja',
        ultimaActividad: '2023-12-10'
      }
    },
    {
      id: 5,
      nombre: 'Sofía Torres',
      correo: 'sofia.torres@ejemplo.com',
      plan: 'Básico',
      estado: 'Pendiente',
      creditosDisponibles: 5000,
      fechaRegistro: '2024-02-20',
      historial: [],
      estadisticas: {
        totalMenciones: 0,
        redes: {
          facebook: 0,
          twitter: 0,
          instagram: 0,
          linkedin: 0
        },
        sentimiento: {
          positivo: 0,
          neutro: 0,
          negativo: 0
        },
        tendencia: 'estable',
        ultimaActividad: ''
      }
    },
  ]);

  // Filtrado de usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        usuario.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'Todos' || usuario.plan === filterPlan;
    const matchesEstado = filterEstado === 'Todos' || usuario.estado === filterEstado;
    
    return matchesSearch && matchesPlan && matchesEstado;
  });

  // Abrir modal para nuevo usuario
  const handleNuevoUsuario = () => {
    setFormData({
      nombre: '',
      correo: '',
      plan: 'Básico',
      estado: 'Activo',
      creditosDisponibles: 5000
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Abrir modal para editar usuario
  const handleEditarUsuario = (usuario: Usuario) => {
    setFormData({
      nombre: usuario.nombre,
      correo: usuario.correo,
      plan: usuario.plan,
      estado: usuario.estado,
      creditosDisponibles: usuario.creditosDisponibles
    });
    setUsuarioActual(usuario);
    setIsEditing(true);
    setShowModal(true);
  };

  // Validar formulario
  const validarFormulario = () => {
    const errores = {
      nombre: '',
      correo: '',
      creditosDisponibles: ''
    };
    let formValido = true;
    
    // Validar nombre
    if (!formData.nombre.trim()) {
      errores.nombre = 'El nombre es obligatorio';
      formValido = false;
    } else if (formData.nombre.length < 3) {
      errores.nombre = 'El nombre debe tener al menos 3 caracteres';
      formValido = false;
    }
    
    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      errores.correo = 'El correo electrónico es obligatorio';
      formValido = false;
    } else if (!emailRegex.test(formData.correo)) {
      errores.correo = 'El formato del correo electrónico no es válido';
      formValido = false;
    }
    
    // Validar créditos
    if (formData.creditosDisponibles < 0) {
      errores.creditosDisponibles = 'Los créditos no pueden ser negativos';
      formValido = false;
    }
    
    setFormErrors(errores);
    return formValido;
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'creditosDisponibles' ? parseInt(value) : value
    }));
    
    // Limpiar error específico al modificar un campo
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Guardar usuario (nuevo o editado)
  const handleGuardarUsuario = () => {
    if (!validarFormulario()) {
      return; // Detener si hay errores de validación
    }
    
    if (isEditing && usuarioActual) {
      // Actualizar usuario existente
      setUsuarios(usuarios.map(u => 
        u.id === usuarioActual.id ? {
          ...u,
          nombre: formData.nombre,
          correo: formData.correo,
          plan: formData.plan,
          estado: formData.estado as 'Activo' | 'Inactivo' | 'Pendiente',
          creditosDisponibles: formData.creditosDisponibles
        } : u
      ));
    } else {
      // Crear nuevo usuario
      const nuevoUsuario: Usuario = {
        id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
        nombre: formData.nombre,
        correo: formData.correo,
        plan: formData.plan,
        estado: formData.estado as 'Activo' | 'Inactivo' | 'Pendiente',
        creditosDisponibles: formData.creditosDisponibles,
        fechaRegistro: new Date().toISOString().split('T')[0],
        historial: [],
        estadisticas: {
          totalMenciones: 0,
          redes: { facebook: 0, twitter: 0, instagram: 0, linkedin: 0 },
          sentimiento: { positivo: 0, neutro: 0, negativo: 0 },
          tendencia: 'estable',
          ultimaActividad: ''
        }
      };
      setUsuarios([...usuarios, nuevoUsuario]);
    }
    setShowModal(false);
  };

  // Eliminar usuario
  const handleActivarDesactivarUsuario = (id: number, accion: 'activar' | 'desactivar') => {
    setUsuarios(usuarios.map(usuario => {
      if (usuario.id === id) {
        return {
          ...usuario,
          estado: accion === 'activar' ? 'Activo' : 'Inactivo'
        };
      }
      return usuario;
    }));
    setShowConfirmModal(false);
  };

  const handleEliminarUsuario = (id: number) => {
    setUsuarios(usuarios.filter(usuario => usuario.id !== id));
    setShowConfirmModal(false);
  };

  const handleCambiarPlan = (id: number, nuevoPlan: string, creditosNuevoPlan: number) => {
    setUsuarios(usuarios.map(usuario => {
      if (usuario.id === id) {
        // Calcular créditos proporcionales respecto al plan anterior
        const creditosActuales = usuario.creditosDisponibles;
        return {
          ...usuario,
          plan: nuevoPlan,
          creditosDisponibles: creditosNuevoPlan
        };
      }
      return usuario;
    }));
    setShowPlanModal(false);
  };

  return (
    <div className="py-6 px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra los usuarios registrados en la plataforma
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={handleNuevoUsuario}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors"
          >
            <FaUserPlus className="mr-2" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o correo"
                className="pl-10 p-2.5 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="p-2.5 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
            >
              <option value="Todos">Todos los planes</option>
              <option value="Básico">Plan Básico</option>
              <option value="Profesional">Plan Profesional</option>
              <option value="Empresarial">Plan Empresarial</option>
            </select>
          </div>
          <div>
            <select
              className="p-2.5 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Créditos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha registro
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setUsuarioActual(usuario);
                      setShowPerfilCompletoModal(true);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-200 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-lg">
                          {usuario.nombre.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {usuario.nombre}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {usuario.correo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.plan === 'Básico' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : usuario.plan === 'Profesional' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                        {usuario.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.estado === 'Activo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : usuario.estado === 'Inactivo' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {usuario.creditosDisponibles.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(usuario.fechaRegistro).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => {
                            setUsuarioActual(usuario);
                            setShowEstadisticasModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                          title="Ver estadísticas"
                        >
                          <FaChartBar />
                        </button>
                        <button 
                          onClick={() => {
                            setUsuarioActual(usuario);
                            setShowHistorialModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                          title="Ver historial"
                        >
                          <FaHistory />
                        </button>
                        <button 
                          onClick={() => handleEditarUsuario(usuario)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Editar usuario"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => {
                            setAccionConfirm('activar');
                            setUsuarioActual(usuario);
                            setShowConfirmModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Activar usuario"
                        >
                          <FaSync />
                        </button>
                        <button 
                          onClick={() => {
                            setAccionConfirm('desactivar');
                            setUsuarioActual(usuario);
                            setShowConfirmModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Desactivar usuario"
                        >
                          <FaTrash />
                        </button>
                        <button 
                          onClick={() => {
                            setAccionConfirm('eliminar');
                            setUsuarioActual(usuario);
                            setShowConfirmModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Eliminar usuario"
                        >
                          <FaTrash />
                        </button>
                        <button 
                          onClick={() => {
                            setUsuarioActual(usuario);
                            setShowPlanModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Cambiar plan"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No se encontraron usuarios con los filtros seleccionados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios</span>
            <span className="ml-2 text-primary-600 dark:text-primary-400">Haz clic en cualquier usuario para ver su perfil completo</span>
          </div>
          <div className="flex space-x-1">
            <button disabled className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
              Anterior
            </button>
            <button className="px-3 py-1 rounded-md bg-primary-600 text-white">
              1
            </button>
            <button disabled className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modal para nuevo/editar usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
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
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre completo</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleFormChange}
                    className={`mt-1 block w-full p-2.5 border ${formErrors.nombre ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    required
                  />
                  {formErrors.nombre && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.nombre}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="correo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleFormChange}
                    className={`mt-1 block w-full p-2.5 border ${formErrors.correo ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    required
                  />
                  {formErrors.correo && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.correo}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="plan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plan</label>
                  <select
                    id="plan"
                    name="plan"
                    value={formData.plan}
                    onChange={handleFormChange}
                    className="mt-1 block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Profesional">Profesional</option>
                    <option value="Empresarial">Empresarial</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleFormChange}
                    className="mt-1 block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="creditosDisponibles" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Créditos disponibles</label>
                  <input
                    type="number"
                    id="creditosDisponibles"
                    name="creditosDisponibles"
                    value={formData.creditosDisponibles}
                    onChange={handleFormChange}
                    className={`mt-1 block w-full p-2.5 border ${formErrors.creditosDisponibles ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    min="0"
                  />
                  {formErrors.creditosDisponibles && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.creditosDisponibles}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md mr-2 hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGuardarUsuario}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                {isEditing ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para cambiar plan */}
      {showPlanModal && usuarioActual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cambiar Plan - {usuarioActual.nombre}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Plan actual: <span className="font-medium text-primary-600 dark:text-primary-400">{usuarioActual.plan}</span>
              </p>
            </div>
            
            <div className="p-4">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Selecciona el nuevo plan para el usuario. Los créditos disponibles se ajustarán automáticamente.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {planesDisponibles.map(plan => (
                  <div key={plan.id} 
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      plan.nombre === usuarioActual.plan
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                    onClick={() => handleCambiarPlan(usuarioActual.id, plan.nombre, plan.creditos)}
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">{plan.nombre}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{plan.creditos.toLocaleString()} créditos</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-3 flex justify-end border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de estadísticas */}
      {showEstadisticasModal && usuarioActual && usuarioActual.estadisticas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-3xl" suppressHydrationWarning={true}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Estadísticas - {usuarioActual.nombre}
              </h3>
              <button 
                onClick={() => setShowEstadisticasModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Información General</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total de menciones:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{usuarioActual.estadisticas.totalMenciones}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tendencia:</span>
                      <span className={`font-medium ${usuarioActual.estadisticas.tendencia === 'alza' ? 'text-green-600 dark:text-green-400' : usuarioActual.estadisticas.tendencia === 'baja' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} suppressHydrationWarning={true}>
                        {usuarioActual.estadisticas.tendencia === 'alza' ? '↑ En alza' : usuarioActual.estadisticas.tendencia === 'baja' ? '↓ En baja' : '◆ Estable'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Última actividad:</span>
                      <span className="font-medium text-gray-900 dark:text-white" suppressHydrationWarning={true}>
                        {usuarioActual.estadisticas.ultimaActividad ? new Date(usuarioActual.estadisticas.ultimaActividad).toLocaleDateString() : 'Sin actividad'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribución por Redes</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Facebook</span>
                        <span className="text-sm text-gray-900 dark:text-white">{usuarioActual.estadisticas.redes.facebook}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, (usuarioActual.estadisticas.redes.facebook / (usuarioActual.estadisticas.totalMenciones || 1)) * 100)}%` }} suppressHydrationWarning={true}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Twitter/X</span>
                        <span className="text-sm text-gray-900 dark:text-white">{usuarioActual.estadisticas.redes.twitter}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div 
                          className="bg-blue-400 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, (usuarioActual.estadisticas.redes.twitter / (usuarioActual.estadisticas.totalMenciones || 1)) * 100)}%` }} suppressHydrationWarning={true}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Instagram</span>
                        <span className="text-sm text-gray-900 dark:text-white">{usuarioActual.estadisticas.redes.instagram}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div 
                          className="bg-pink-500 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, (usuarioActual.estadisticas.redes.instagram / (usuarioActual.estadisticas.totalMenciones || 1)) * 100)}%` }} suppressHydrationWarning={true}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">LinkedIn</span>
                        <span className="text-sm text-gray-900 dark:text-white">{usuarioActual.estadisticas.redes.linkedin}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div 
                          className="bg-blue-700 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, (usuarioActual.estadisticas.redes.linkedin / (usuarioActual.estadisticas.totalMenciones || 1)) * 100)}%` }} suppressHydrationWarning={true}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sentimiento</h4>
                  <div className="flex h-32 items-end">
                    <div className="flex-1 mx-1 flex flex-col items-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{usuarioActual.estadisticas.sentimiento.positivo}%</div>
                      <div 
                        className="w-full bg-green-500 rounded-t-lg" 
                        style={{ height: `${usuarioActual.estadisticas.sentimiento.positivo}%` }} suppressHydrationWarning={true}
                      ></div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Positivo</div>
                    </div>
                    <div className="flex-1 mx-1 flex flex-col items-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{usuarioActual.estadisticas.sentimiento.neutro}%</div>
                      <div 
                        className="w-full bg-gray-400 rounded-t-lg" 
                        style={{ height: `${usuarioActual.estadisticas.sentimiento.neutro}%` }} suppressHydrationWarning={true}
                      ></div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Neutro</div>
                    </div>
                    <div className="flex-1 mx-1 flex flex-col items-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{usuarioActual.estadisticas.sentimiento.negativo}%</div>
                      <div 
                        className="w-full bg-red-500 rounded-t-lg" 
                        style={{ height: `${usuarioActual.estadisticas.sentimiento.negativo}%` }} suppressHydrationWarning={true}
                      ></div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Negativo</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resumen de Cuenta</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Plan actual:</span>
                      <span className="font-medium text-primary-600 dark:text-primary-400">{usuarioActual.plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                      <span className={`font-medium ${usuarioActual.estado === 'Activo' ? 'text-green-600 dark:text-green-400' : usuarioActual.estado === 'Inactivo' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                        {usuarioActual.estado}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Créditos disponibles:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{usuarioActual.creditosDisponibles.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fecha de registro:</span>
                      <span className="font-medium text-gray-900 dark:text-white" suppressHydrationWarning={true}>{new Date(usuarioActual.fechaRegistro).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
              <button
                onClick={() => setShowEstadisticasModal(false)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md px-4 py-2"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de historial */}
      {showHistorialModal && usuarioActual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-2xl" suppressHydrationWarning={true}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Historial de Actividad - {usuarioActual.nombre}
              </h3>
              <button 
                onClick={() => setShowHistorialModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              {usuarioActual.historial && usuarioActual.historial.length > 0 ? (
                <div className="overflow-y-auto max-h-96">
                  {usuarioActual.historial.map((item) => (
                    <div key={item.id} className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white">{item.accion}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning={true}>{new Date(item.fecha).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{item.detalles}</p>
                      {item.creditosUsados !== undefined && (
                        <div className="mt-2 flex items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Créditos utilizados: </span>
                          <span className="ml-1 text-sm font-medium text-primary-600 dark:text-primary-400">{item.creditosUsados.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400">No hay actividad registrada para este usuario.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
              <button
                onClick={() => setShowHistorialModal(false)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md px-4 py-2"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación */}
      {showConfirmModal && usuarioActual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirmar Acción
              </h3>
            </div>
            
            <div className="p-4">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                {accionConfirm === 'activar' && `¿Estás seguro de que deseas activar al usuario ${usuarioActual.nombre}?`}
                {accionConfirm === 'desactivar' && `¿Estás seguro de que deseas desactivar al usuario ${usuarioActual.nombre}?`}
                {accionConfirm === 'eliminar' && `¿Estás seguro de que deseas eliminar al usuario ${usuarioActual.nombre}? Esta acción no se puede deshacer.`}
              </p>
            </div>
            
            <div className="p-3 flex justify-end space-x-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              
              <button
                type="button"
                onClick={() => {
                  if (accionConfirm === 'eliminar') {
                    handleEliminarUsuario(usuarioActual.id);
                  } else {
                    handleActivarDesactivarUsuario(usuarioActual.id, accionConfirm);
                  }
                }}
                className={`px-4 py-2 rounded text-white ${
                  accionConfirm === 'eliminar'
                    ? 'bg-red-600 hover:bg-red-700'
                    : accionConfirm === 'activar'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {accionConfirm === 'eliminar' ? 'Eliminar' : accionConfirm === 'activar' ? 'Activar' : 'Desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Perfil Completo */}
      {showPerfilCompletoModal && usuarioActual && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white flex items-center">
                <span className="w-10 h-10 rounded-full bg-primary-200 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-lg mr-3">
                  {usuarioActual.nombre.charAt(0).toUpperCase()}
                </span>
                Perfil Completo - {usuarioActual.nombre}
              </h3>
              <button 
                onClick={() => setShowPerfilCompletoModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
              {/* Sección de información general */}
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Información General</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Correo electrónico</p>
                        <p className="font-medium text-gray-900 dark:text-white">{usuarioActual.correo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Plan actual</p>
                        <p className={`font-medium ${
                            usuarioActual.plan === 'Básico' 
                              ? 'text-primary-600 dark:text-primary-400' 
                              : usuarioActual.plan === 'Profesional' 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-green-600 dark:text-green-400'
                          }`}>
                          {usuarioActual.plan}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                        <p className={`font-medium ${
                          usuarioActual.estado === 'Activo' 
                            ? 'text-green-600 dark:text-green-400' 
                            : usuarioActual.estado === 'Inactivo' 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {usuarioActual.estado}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Créditos disponibles</p>
                        <p className="font-medium text-gray-900 dark:text-white">{usuarioActual.creditosDisponibles.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de registro</p>
                        <p className="font-medium text-gray-900 dark:text-white">{new Date(usuarioActual.fechaRegistro).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Última actividad</p>
                        <p className="font-medium text-gray-900 dark:text-white">{usuarioActual.estadisticas?.ultimaActividad || 'Sin actividad reciente'}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex space-x-2">
                      <button 
                        onClick={() => handleEditarUsuario(usuarioActual)}
                        className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <FaEdit className="mr-1" /> Editar
                      </button>
                      <button 
                        onClick={() => {
                          setUsuarioActual(usuarioActual);
                          setShowPerfilCompletoModal(false);
                          setShowPlanModal(true);
                        }}
                        className="px-3 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors flex items-center"
                      >
                        <FaSync className="mr-1" /> Cambiar Plan
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resumen de Actividad</h4>
                  
                    {usuarioActual.estadisticas ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <h5 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Menciones por Red Social</h5>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center">
                              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 mr-3">
                                <FaFacebook />
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{usuarioActual.estadisticas.redes.facebook}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Facebook</p>
                              </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center">
                              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 mr-3">
                                <FaTwitter />
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{usuarioActual.estadisticas.redes.twitter}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Twitter</p>
                              </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center">
                              <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-500 mr-3">
                                <FaInstagram />
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{usuarioActual.estadisticas.redes.instagram}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Instagram</p>
                              </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center">
                              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 mr-3">
                                <FaLinkedin />
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{usuarioActual.estadisticas.redes.linkedin}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">LinkedIn</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Estadísticas de Sentimiento</h5>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                              <p className="text-lg font-semibold text-green-500">{usuarioActual.estadisticas.sentimiento.positivo}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Positivo</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                              <p className="text-lg font-semibold text-yellow-500">{usuarioActual.estadisticas.sentimiento.neutro}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Neutro</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                              <p className="text-lg font-semibold text-red-500">{usuarioActual.estadisticas.sentimiento.negativo}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Negativo</p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h5 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Tendencia</h5>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center">
                              <div className={`p-2 rounded-full mr-3 ${
                                usuarioActual.estadisticas.tendencia === 'alza' 
                                  ? 'bg-green-100 dark:bg-green-900 text-green-500' 
                                  : usuarioActual.estadisticas.tendencia === 'baja' 
                                    ? 'bg-red-100 dark:bg-red-900 text-red-500' 
                                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-500'
                              }`}>
                                {usuarioActual.estadisticas.tendencia === 'alza' ? <FaArrowUp /> : usuarioActual.estadisticas.tendencia === 'baja' ? <FaArrowDown /> : <FaArrowsAltH />}
                              </div>
                              <div>
                                <p className="text-md font-semibold text-gray-900 dark:text-white capitalize">{usuarioActual.estadisticas.tendencia}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Tendencia actual</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                          <h5 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Resumen de Actividad</h5>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between mb-2">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Total menciones monitoreadas</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{usuarioActual.estadisticas.totalMenciones}</p>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                              <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 text-center text-gray-500 dark:text-gray-400">
                        No hay estadísticas disponibles para este usuario
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sección de historial */}
              <div className="px-6 py-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex justify-between items-center">
                    <span>Historial de Actividad</span>
                    <button 
                      onClick={() => {
                        // Agregar aquí lógica para exportar el historial
                      }}
                      className="text-xs px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors flex items-center"
                    >
                      <FaDownload className="mr-1" /> Exportar historial
                    </button>
                  </h4>
                  
                  {usuarioActual.historial && usuarioActual.historial.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-100 dark:bg-gray-600">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acción</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Detalles</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Créditos</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {usuarioActual.historial.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.fecha}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.accion}</td>
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.detalles}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                {item.creditosUsados ? `${item.creditosUsados > 0 ? '+' : ''}${item.creditosUsados}` : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-5 text-center text-gray-500 dark:text-gray-400">
                      No hay registros de actividad para este usuario
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
