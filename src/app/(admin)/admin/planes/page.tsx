"use client";

import React, { useState } from 'react';
import { FaPlusCircle, FaSearch, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaStar, FaGlobe, FaCopy, FaExclamationTriangle } from 'react-icons/fa';

interface Plan {
  id: number;
  nombre: string;
  precio: number;
  creditos: number;
  periodoFacturacion: string;
  caracteristicas: string[];
  activo: boolean;
  destacado: boolean;
  fechaCreacion: string;
  usuariosActivos: number;
}

export default function GestionPlanes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [planActual, setPlanActual] = useState<Plan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    precio: 299000,
    creditos: 5000,
    periodoFacturacion: 'Mensual',
    caracteristicas: ['Monitoreo de 2 redes sociales', 'Reportes básicos', 'Soporte por email'],
    activo: true,
    destacado: false,
    nuevaCaracteristica: ''
  });

  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState({
    nombre: '',
    precio: '',
    creditos: '',
    caracteristicas: ''
  });

  // Datos de ejemplo
  const [planes, setPlanes] = useState<Plan[]>([
    {
      id: 1,
      nombre: 'Básico',
      precio: 299000,
      creditos: 5000,
      periodoFacturacion: 'Mensual',
      caracteristicas: [
        'Monitoreo de 2 redes sociales',
        'Reportes básicos',
        'Soporte por email'
      ],
      activo: true,
      destacado: false,
      fechaCreacion: '2023-10-01',
      usuariosActivos: 71
    },
    {
      id: 2,
      nombre: 'Profesional',
      precio: 699000,
      creditos: 15000,
      periodoFacturacion: 'Mensual',
      caracteristicas: [
        'Monitoreo de todas las redes sociales',
        'Análisis de sentimiento avanzado',
        'Asistente Sofia IA',
        'Soporte prioritario'
      ],
      activo: true,
      destacado: true,
      fechaCreacion: '2023-10-01',
      usuariosActivos: 112
    },
    {
      id: 3,
      nombre: 'Empresarial',
      precio: 1499000,
      creditos: 50000,
      periodoFacturacion: 'Mensual',
      caracteristicas: [
        'Monitoreo ilimitado en todas las plataformas',
        'Análisis predictivo',
        'Asistente Sofia IA Premium',
        'Soporte prioritario 24/7',
        'API de integración'
      ],
      activo: true,
      destacado: false,
      fechaCreacion: '2023-10-01',
      usuariosActivos: 65
    },
    {
      id: 4,
      nombre: 'Semestral',
      precio: 1599000,
      creditos: 30000,
      periodoFacturacion: 'Semestral',
      caracteristicas: [
        'Monitoreo de todas las redes sociales',
        'Análisis de sentimiento avanzado',
        'Soporte prioritario',
        '10% de descuento sobre el precio mensual'
      ],
      activo: false,
      destacado: false,
      fechaCreacion: '2023-12-15',
      usuariosActivos: 0
    },
  ]);

  // Filtrado de planes
  const planesFiltrados = planes.filter(plan => {
    return plan.nombre.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Abrir modal para nuevo plan
  const handleNuevoPlan = () => {
    setFormData({
      nombre: '',
      precio: 299000,
      creditos: 5000,
      periodoFacturacion: 'Mensual',
      caracteristicas: ['Monitoreo de 2 redes sociales', 'Reportes básicos', 'Soporte por email'],
      activo: true,
      destacado: false,
      nuevaCaracteristica: ''
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Abrir modal para editar plan
  const handleEditarPlan = (plan: Plan) => {
    setFormData({
      nombre: plan.nombre,
      precio: plan.precio,
      creditos: plan.creditos,
      periodoFacturacion: plan.periodoFacturacion,
      caracteristicas: [...plan.caracteristicas],
      activo: plan.activo,
      destacado: plan.destacado,
      nuevaCaracteristica: ''
    });
    setPlanActual(plan);
    setIsEditing(true);
    setShowModal(true);
  };

  // Validar el formulario
  const validarFormulario = () => {
    const errores = {
      nombre: '',
      precio: '',
      creditos: '',
      caracteristicas: ''
    };
    let formValido = true;
    
    // Validar nombre
    if (!formData.nombre.trim()) {
      errores.nombre = 'El nombre del plan es obligatorio';
      formValido = false;
    } else if (formData.nombre.length < 3) {
      errores.nombre = 'El nombre debe tener al menos 3 caracteres';
      formValido = false;
    }
    
    // Validar precio
    if (!formData.precio) {
      errores.precio = 'El precio es obligatorio';
      formValido = false;
    } else if (formData.precio <= 0) {
      errores.precio = 'El precio debe ser mayor que cero';
      formValido = false;
    }
    
    // Validar créditos
    if (!formData.creditos) {
      errores.creditos = 'Los créditos son obligatorios';
      formValido = false;
    } else if (formData.creditos <= 0) {
      errores.creditos = 'Los créditos deben ser mayores que cero';
      formValido = false;
    }
    
    // Validar características
    if (formData.caracteristicas.length === 0) {
      errores.caracteristicas = 'Debe agregar al menos una característica';
      formValido = false;
    }
    
    setFormErrors(errores);
    return formValido;
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else if (name === 'precio' || name === 'creditos') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Limpiar error específico al modificar un campo
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Agregar característica
  const handleAgregarCaracteristica = () => {
    if (formData.nuevaCaracteristica.trim()) {
      setFormData(prev => ({
        ...prev,
        caracteristicas: [...prev.caracteristicas, prev.nuevaCaracteristica.trim()],
        nuevaCaracteristica: ''
      }));
      
      // Limpiar error de características si existe
      if (formErrors.caracteristicas) {
        setFormErrors({
          ...formErrors,
          caracteristicas: ''
        });
      }
    }
  };

  // Eliminar característica
  const handleEliminarCaracteristica = (index: number) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((_, i) => i !== index)
    }));
  };

  // Guardar plan (nuevo o editado)
  const handleGuardarPlan = () => {
    // Validar el formulario antes de guardar
    if (!validarFormulario()) {
      return; // Detener si hay errores de validación
    }
    
    if (isEditing && planActual) {
      // Actualizar plan existente
      setPlanes(planes.map(p => 
        p.id === planActual.id ? {
          ...p,
          nombre: formData.nombre,
          precio: formData.precio,
          creditos: formData.creditos,
          periodoFacturacion: formData.periodoFacturacion,
          caracteristicas: formData.caracteristicas,
          activo: formData.activo,
          destacado: formData.destacado
        } : p
      ));
      
      // Mostrar mensaje de éxito temporal
      alert('Plan actualizado con éxito'); // Idealmente usar un toast o notificación más elegante
    } else {
      // Crear nuevo plan
      const nuevoPlan: Plan = {
        id: planes.length > 0 ? Math.max(...planes.map(p => p.id)) + 1 : 1,
        nombre: formData.nombre,
        precio: formData.precio,
        creditos: formData.creditos,
        periodoFacturacion: formData.periodoFacturacion,
        caracteristicas: formData.caracteristicas,
        activo: formData.activo,
        destacado: formData.destacado,
        fechaCreacion: new Date().toISOString().split('T')[0],
        usuariosActivos: 0
      };
      setPlanes([...planes, nuevoPlan]);
      
      // Mostrar mensaje de éxito temporal
      alert('Plan creado con éxito'); // Idealmente usar un toast o notificación más elegante
    }
    setShowModal(false);
  };

  // Eliminar plan
  const handleEliminarPlan = (id: number) => {
    // Verificar si hay usuarios activos en el plan (sólo mostrar advertencia en el modal)
    const planToDelete = planes.find(p => p.id === id);
    if (planToDelete && planToDelete.usuariosActivos > 0 && !showDeleteModal) {
      // Si intentan eliminar sin abrir el modal primero, mostrar advertencia
      setPlanActual(planToDelete);
      setShowDeleteModal(true);
      return;
    }

    // Efectivamente eliminar el plan
    setPlanes(planes.filter(p => p.id !== id));
    setShowDeleteModal(false);
  };
  
  // Función para cambiar estado de un plan
  const handleToggleEstado = (id: number) => {
    setPlanes(planes.map(p => 
      p.id === id ? { ...p, activo: !p.activo } : p
    ));
  };

  // Función para destacar/quitar destacado de un plan
  const handleToggleDestacado = (id: number) => {
    setPlanes(planes.map(plan => {
      if (plan.id === id) {
        return {
          ...plan,
          destacado: !plan.destacado
        };
      }
      return plan;
    }));
  };

  // Función para publicar plan
  const handlePublishPlan = (id: number) => {
    // Simplemente activa el plan y cierra el modal
    handleToggleEstado(id);
    setShowPublishModal(false);
  };

  return (
    <div className="py-6 px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Planes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra los planes de suscripción disponibles en la plataforma
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={handleNuevoPlan}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center transition-colors"
          >
            <FaPlusCircle className="mr-2" />
            Nuevo Plan
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
                placeholder="Buscar planes por nombre"
                className="pl-10 p-2.5 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-span-2 md:text-right">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {planesFiltrados.length} planes encontrados
            </span>
          </div>
        </div>
      </div>

      {/* Planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planesFiltrados.map((plan) => (
          <div key={plan.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border ${plan.destacado ? 'border-primary-500' : 'border-transparent'} relative`}>
            {plan.destacado && (
              <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                Popular
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.nombre}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${plan.activo ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {plan.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${Number(plan.precio).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">COP / {plan.periodoFacturacion.toLowerCase()}</span>
              </div>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Créditos: </span>
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{Number(plan.creditos).toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Usuarios activos: </span>
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{plan.usuariosActivos}</span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Incluye:</h4>
                <ul className="space-y-2">
                  {plan.caracteristicas.map((caracteristica, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{caracteristica}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditarPlan(plan)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Editar plan"
                >
                  <FaEdit />
                </button>
                
                {/* Botón para activar/desactivar plan */}
                <button
                  onClick={() => plan && handleToggleEstado(plan.id)}
                  className={`${plan.activo ? 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300' : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300'}`}
                  title={plan.activo ? 'Desactivar plan' : 'Activar plan'}
                >
                  <FaCheck />
                </button>
                
                {/* Botón para destacar plan */}
                <button
                  onClick={() => plan && handleToggleDestacado(plan.id)}
                  className={`${plan.destacado ? 'text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300' : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300'}`}
                  title={plan.destacado ? 'Quitar destacado' : 'Destacar plan'}
                >
                  <FaStar />
                </button>
                
                {/* Botón para publicar plan */}
                <button
                  onClick={() => {
                    setPlanActual(plan);
                    setShowPublishModal(true);
                  }}
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                  title="Publicar plan"
                >
                  <FaGlobe />
                </button>
                
                {/* Botón para eliminar plan */}
                <button
                  onClick={() => {
                    setPlanActual(plan);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Eliminar plan"
                >
                  <FaTrash />
                </button>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Creado el {new Date(plan.fechaCreacion).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de publicación */}
      {showPublishModal && planActual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Publicar Plan
              </h3>
            </div>
            
            <div className="p-4">
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg mb-4 border border-primary-200 dark:border-primary-800">
                <h4 className="font-medium text-primary-800 dark:text-primary-300 text-lg mb-1">{planActual.nombre}</h4>
                <p className="text-primary-700 dark:text-primary-400">
                  ${planActual.precio.toLocaleString()} COP / {planActual.periodoFacturacion}
                </p>
                <div className="mt-2">
                  <ul className="space-y-1">
                    {planActual.caracteristicas.map((caracteristica, idx) => (
                      <li key={idx} className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{caracteristica}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Al publicar este plan, estará disponible para que los usuarios lo contraten.
                ¿Deseas publicar este plan ahora?
              </p>
              
              {!planActual.activo && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded border border-amber-200 dark:border-amber-800 flex items-start mb-4">
                  <FaExclamationTriangle className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                  <p className="text-amber-700 dark:text-amber-400 text-sm">
                    Este plan está actualmente inactivo. Al publicarlo, se activará automáticamente.
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-3 flex justify-end space-x-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              
              <button
                type="button"
                onClick={() => planActual && handlePublishPlan(planActual.id)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded"
              >
                Publicar Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && planActual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Eliminar Plan
              </h3>
            </div>
            
            <div className="p-4">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                ¿Estás seguro de que deseas eliminar el plan <span className="font-medium text-primary-600 dark:text-primary-400">{planActual.nombre}</span>?
              </p>
              
              {planActual.usuariosActivos > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800 flex items-start mb-4">
                  <FaExclamationTriangle className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-400 text-sm">
                    <strong>Advertencia:</strong> Este plan tiene {planActual.usuariosActivos} usuarios activos.
                    La eliminación de este plan no afectará a los usuarios actuales hasta que finalice su período de facturación.
                  </p>
                </div>
              )}
              
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Esta acción no se puede deshacer.
              </p>
            </div>
            
            <div className="p-3 flex justify-end space-x-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              
              <button
                type="button"
                onClick={() => planActual && handleEliminarPlan(planActual.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para nuevo/editar plan */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {isEditing ? 'Editar Plan' : 'Nuevo Plan'}
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
            <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del plan</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleFormChange}
                    className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="periodoFacturacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Periodo de facturación</label>
                  <select
                    id="periodoFacturacion"
                    name="periodoFacturacion"
                    value={formData.periodoFacturacion}
                    onChange={handleFormChange}
                    className="block w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Mensual">Mensual</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="precio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio (COP)</label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleFormChange}
                    className={`mt-1 block w-full p-2.5 border ${formErrors.precio ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    min="0"
                    step="1000"
                    required
                  />
                  {formErrors.precio && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.precio}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="creditos" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Créditos incluidos</label>
                  <input
                    type="number"
                    id="creditos"
                    name="creditos"
                    value={formData.creditos}
                    onChange={handleFormChange}
                    className={`mt-1 block w-full p-2.5 border ${formErrors.creditos ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    min="0"
                    step="100"
                    required
                  />
                  {formErrors.creditos && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.creditos}</p>
                  )}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="destacado"
                    name="destacado"
                    checked={formData.destacado}
                    onChange={handleFormChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="destacado" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Destacar este plan (popular)
                  </label>
                </div>
              </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Características</label>
                  
                  <div className="space-y-2 mb-4">
                    {formData.caracteristicas.map((caracteristica, index) => (
                      <div key={index} className="flex items-center">
                        <span className="flex-grow p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm">
                          {caracteristica}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => handleEliminarCaracteristica(index)}
                          className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                  {formErrors.caracteristicas && (
                    <p className="mt-1 mb-2 text-sm text-red-600 dark:text-red-500">{formErrors.caracteristicas}</p>
                  )}
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Nueva característica"
                      value={formData.nuevaCaracteristica}
                      onChange={(e) => setFormData({...formData, nuevaCaracteristica: e.target.value})}
                      className="flex-grow p-2.5 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAgregarCaracteristica}
                      className="px-4 py-2.5 bg-primary-600 text-white font-medium rounded-r-md hover:bg-primary-700"
                    >
                      Agregar
                    </button>
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
                onClick={handleGuardarPlan}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                {isEditing ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
