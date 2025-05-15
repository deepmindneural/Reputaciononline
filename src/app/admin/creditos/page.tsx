"use client";

import React, { useState } from 'react';
import { FaSearch, FaFilter, FaCreditCard, FaUserPlus, FaDownload } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Registrar ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Datos de ejemplo para la demo
const usuariosDemo = [
  { 
    id: '1', 
    nombre: 'Carlos Rodru00edguez', 
    email: 'carlos@empresa.co', 
    plan: 'Empresarial',
    creditosDisponibles: 42500,
    creditosGastados: 7500,
    ultimaActividad: '16/04/2025',
    estado: 'activo'
  },
  { 
    id: '2', 
    nombre: 'Maru00eda Lu00f3pez', 
    email: 'maria@consultora.co', 
    plan: 'Profesional',
    creditosDisponibles: 8700,
    creditosGastados: 6300,
    ultimaActividad: '15/04/2025',
    estado: 'activo'
  },
  { 
    id: '3', 
    nombre: 'Juan Pu00e9rez', 
    email: 'juan@startup.co', 
    plan: 'Bu00e1sico',
    creditosDisponibles: 200,
    creditosGastados: 4800,
    ultimaActividad: '10/04/2025',
    estado: 'advertencia'
  },
  { 
    id: '4', 
    nombre: 'Ana Gu00f3mez', 
    email: 'ana@agencia.co', 
    plan: 'Empresarial',
    creditosDisponibles: 25000,
    creditosGastados: 25000,
    ultimaActividad: '16/04/2025',
    estado: 'activo'
  },
  { 
    id: '5', 
    nombre: 'Roberto Jimu00e9nez', 
    email: 'roberto@compania.co', 
    plan: 'Profesional',
    creditosDisponibles: 0,
    creditosGastados: 15000,
    ultimaActividad: '05/04/2025',
    estado: 'sin_creditos'
  },
];

// Datos para el gru00e1fico de consumo por plan
const datosConsumoPlanes = {
  labels: ['Bu00e1sico', 'Profesional', 'Empresarial'],
  datasets: [
    {
      label: 'Cru00e9ditos Consumidos',
      data: [25000, 45000, 72000],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

// Datos para el gru00e1fico de consumo por canal
const datosConsumoCanales = {
  labels: ['X', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'Otros'],
  datasets: [
    {
      label: 'Cru00e9ditos Consumidos',
      data: [35000, 20000, 25000, 15000, 30000, 8000],
      backgroundColor: 'rgba(0, 230, 217, 0.6)',
      borderColor: 'rgba(0, 230, 217, 1)',
      borderWidth: 1,
    },
  ],
};

export default function AdminCreditosPage() {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string | null>(null);

  // Filtrar usuarios segu00fan bu00fasqueda y filtro
  const usuariosFiltrados = usuariosDemo.filter(usuario => {
    const coincideBusqueda = usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                            usuario.email.toLowerCase().includes(busqueda.toLowerCase());
    
    if (filtro === 'todos') return coincideBusqueda;
    if (filtro === 'sin_creditos') return coincideBusqueda && usuario.creditosDisponibles === 0;
    if (filtro === 'advertencia') return coincideBusqueda && usuario.creditosDisponibles < 1000;
    if (filtro === 'plan_basico') return coincideBusqueda && usuario.plan === 'Bu00e1sico';
    if (filtro === 'plan_profesional') return coincideBusqueda && usuario.plan === 'Profesional';
    if (filtro === 'plan_empresarial') return coincideBusqueda && usuario.plan === 'Empresarial';
    
    return coincideBusqueda;
  });

  // Renderiza el estado del usuario con color apropiado
  const renderEstadoUsuario = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Activo</span>;
      case 'advertencia':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">Pocos cru00e9ditos</span>;
      case 'sin_creditos':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">Sin cru00e9ditos</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">{estado}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Administraciu00f3n de Cru00e9ditos</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitorea y gestiona los cru00e9ditos de todos los usuarios
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button className="btn-primary flex items-center text-sm">
            <FaUserPlus className="mr-2" />
            Asignar cru00e9ditos
          </button>
          <button className="btn-secondary flex items-center text-sm">
            <FaDownload className="mr-2" />
            Exportar datos
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Gru00e1fico de consumo por plan */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Consumo por Plan</h3>
          <div className="h-64">
            <Pie data={datosConsumoPlanes} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        
        {/* Gru00e1fico de consumo por canal */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Consumo por Canal</h3>
          <div className="h-64">
            <Bar 
              data={datosConsumoCanales} 
              options={{
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Cru00e9ditos Consumidos'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Tabla de usuarios y sus cru00e9ditos */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 md:mb-0">
            Usuarios y Cru00e9ditos
          </h3>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 input-field"
                placeholder="Buscar usuario..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 input-field appearance-none"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              >
                <option value="todos">Todos los usuarios</option>
                <option value="sin_creditos">Sin cru00e9ditos</option>
                <option value="advertencia">Pocos cru00e9ditos</option>
                <option value="plan_basico">Plan Bu00e1sico</option>
                <option value="plan_profesional">Plan Profesional</option>
                <option value="plan_empresarial">Plan Empresarial</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Disponibles
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Consumidos
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {usuario.nombre}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {usuario.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 text-xs font-medium">
                      {usuario.plan}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {renderEstadoUsuario(usuario.estado)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                    {usuario.creditosDisponibles.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                    {usuario.creditosGastados.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
                    <button 
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                      onClick={() => setUsuarioSeleccionado(usuario.id)}
                    >
                      <FaCreditCard />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {usuariosFiltrados.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No se encontraron usuarios que coincidan con la bu00fasqueda.
            </div>
          )}
        </div>
      </div>

      {/* Modal para asignar cru00e9ditos a un usuario */}
      {usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Asignar Cru00e9ditos</h2>
                <button 
                  onClick={() => setUsuarioSeleccionado(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Detalles del usuario seleccionado */}
              {usuariosDemo.find(u => u.id === usuarioSeleccionado) && (
                <div className="mb-6">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {usuariosDemo.find(u => u.id === usuarioSeleccionado)?.nombre}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {usuariosDemo.find(u => u.id === usuarioSeleccionado)?.email}
                  </p>
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Plan actual:</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {usuariosDemo.find(u => u.id === usuarioSeleccionado)?.plan}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Cru00e9ditos disponibles:</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {usuariosDemo.find(u => u.id === usuarioSeleccionado)?.creditosDisponibles.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <label htmlFor="creditos" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nu00famero de cru00e9ditos a asignar
                </label>
                <input
                  type="number"
                  id="creditos"
                  className="input-field"
                  placeholder="Ingrese la cantidad de cru00e9ditos"
                  min="1"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motivo (opcional)
                </label>
                <textarea
                  id="motivo"
                  className="input-field"
                  placeholder="Por ejemplo: Bonificaciu00f3n por fidelidad, correcciu00f3n de error, etc."
                  rows={3}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setUsuarioSeleccionado(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancelar
                </button>
                <button className="btn-primary">
                  Asignar Cru00e9ditos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
