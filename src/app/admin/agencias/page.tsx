"use client";

import { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiEdit2, 
  FiTrash2, 
  FiChevronLeft, 
  FiChevronRight,
  FiUsers,
  FiUserCheck,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCheck,
  FiBriefcase
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { AdminPageHeader, StatCard, ContentCard, AdminButton } from '@/components/admin';
import { ADMIN_THEME } from '@/theme/admin-theme';

interface Agencia {
  id: string;
  nombre: string;
  contacto: string;
  email: string;
  telefono: string;
  usuarios: number;
  activa: boolean;
  fechaCreacion: string;
}

export default function AgenciasAdmin() {
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentAgencia, setCurrentAgencia] = useState<Agencia | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    email: '',
    telefono: '',
  });

  const itemsPerPage = 10;

  // Simular carga de datos
  useEffect(() => {
    const fetchAgencias = async () => {
      try {
        // Aquí iría la llamada a la API real
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos de ejemplo
        const mockAgencias: Agencia[] = Array.from({ length: 25 }, (_, i) => ({
          id: `ag-${i + 1}`,
          nombre: `Agencia ${i + 1}`,
          contacto: `Contacto ${i + 1}`,
          email: `contacto${i + 1}@agencia.com`,
          telefono: `+57 3${Math.floor(1000000 + Math.random() * 9000000)}`,
          usuarios: Math.floor(Math.random() * 50) + 1,
          activa: Math.random() > 0.3,
          fechaCreacion: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30 * 6)).toISOString(),
        }));
        
        setAgencias(mockAgencias);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar las agencias:', error);
        toast.error('Error al cargar las agencias');
        setLoading(false);
      }
    };

    fetchAgencias();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Aquí iría la llamada a la API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (currentAgencia) {
        // Actualizar agencia existente
        const updatedAgencias = agencias.map(ag => 
          ag.id === currentAgencia.id ? { ...ag, ...formData } : ag
        );
        setAgencias(updatedAgencias);
        toast.success('Agencia actualizada correctamente');
      } else {
        // Crear nueva agencia
        const newAgencia: Agencia = {
          id: `ag-${Date.now()}`,
          ...formData,
          usuarios: 0,
          activa: true,
          fechaCreacion: new Date().toISOString(),
        };
        setAgencias([newAgencia, ...agencias]);
        toast.success('Agencia creada correctamente');
      }
      
      setShowModal(false);
      setFormData({ nombre: '', contacto: '', email: '', telefono: '' });
      setCurrentAgencia(null);
    } catch (error) {
      console.error('Error al guardar la agencia:', error);
      toast.error('Error al guardar la agencia');
    }
  };

  const handleEdit = (agencia: Agencia) => {
    setCurrentAgencia(agencia);
    setFormData({
      nombre: agencia.nombre,
      contacto: agencia.contacto,
      email: agencia.email,
      telefono: agencia.telefono,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta agencia?')) return;
    
    try {
      // Aquí iría la llamada a la API real
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAgencias(agencias.filter(ag => ag.id !== id));
      toast.success('Agencia eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar la agencia:', error);
      toast.error('Error al eliminar la agencia');
    }
  };

  const filteredAgencias = agencias.filter(agencia =>
    agencia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agencia.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agencia.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgencias.length / itemsPerPage);
  const paginatedAgencias = filteredAgencias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  // Calcular estadísticas
  const totalAgencias = agencias.length;
  const agenciasActivas = agencias.filter(a => a.activa).length;
  const totalUsuarios = agencias.reduce((sum, agencia) => sum + agencia.usuarios, 0);
  const agenciaReciente = agencias.length > 0 ? new Date(Math.max(...agencias.map(a => new Date(a.fechaCreacion).getTime()))).toLocaleDateString('es-CO') : '-';

  return (
    <div className="p-6">
      <AdminPageHeader 
        title="Gestión de Agencias" 
        description="Administra las agencias registradas en la plataforma"
        icon={<FiBriefcase size={24} />}
        actions={
          <AdminButton
            onClick={() => {
              setCurrentAgencia(null);
              setFormData({ nombre: '', contacto: '', email: '', telefono: '' });
              setShowModal(true);
            }}
            icon={<FiPlus />}
          >
            Nueva Agencia
          </AdminButton>
        }
      />
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total de Agencias"
          value={totalAgencias}
          icon={<FiBriefcase className="h-6 w-6 text-white" />}
          color="blue"
        />
        <StatCard 
          title="Agencias Activas"
          value={agenciasActivas}
          icon={<FiCheck className="h-6 w-6 text-white" />}
          color="green"
        />
        <StatCard 
          title="Total de Usuarios"
          value={totalUsuarios}
          icon={<FiUsers className="h-6 w-6 text-white" />}
          color="purple"
        />
        <StatCard 
          title="Última Agencia"
          value={agenciaReciente}
          icon={<FiCalendar className="h-6 w-6 text-white" />}
          color="cyan"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                placeholder="Buscar agencias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <AdminButton
                variant="secondary"
                size="sm"
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <FiFilter className="mr-2" />
                Filtros
              </AdminButton>
              <AdminButton
                variant="secondary"
                size="sm"
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Exportar
              </AdminButton>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Teléfono
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usuarios
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha de Creación
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedAgencias.length > 0 ? (
                paginatedAgencias.map((agencia) => (
                  <tr key={agencia.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300">
                          <FiBriefcase className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{agencia.nombre}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-200">{agencia.contacto}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-200">{agencia.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-200">{agencia.telefono}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-200">{agencia.usuarios}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${agencia.activa ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {agencia.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(agencia.fechaCreacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <AdminButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(agencia)}
                          icon={<FiEdit2 />}
                        >
                          Editar
                        </AdminButton>
                        <AdminButton
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(agencia.id)}
                          icon={<FiTrash2 />}
                        >
                          Eliminar
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                    No se encontraron agencias que coincidan con la búsqueda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAgencias.length)}</span> de <span className="font-medium">{filteredAgencias.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-l-md rounded-r-none"
                  >
                    <span className="sr-only">Anterior</span>
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </AdminButton>

                  {Array.from({length: totalPages}, (_, i) => i).map((number) => (
                    <AdminButton
                      key={number + 1}
                      variant={currentPage === number + 1 ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setCurrentPage(number + 1)}
                      className={`rounded-none border-l-0 ${currentPage === number + 1 ? 'z-10' : ''}`}
                    >
                      {number + 1}
                    </AdminButton>
                  ))}

                  <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-r-md rounded-l-none border-l-0"
                  >
                    <span className="sr-only">Siguiente</span>
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                  </AdminButton>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal para agregar/editar agencia */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900 sm:mx-0 sm:h-10 sm:w-10">
                    <FiBriefcase className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      {currentAgencia ? 'Editar Agencia' : 'Nueva Agencia'}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nombre de la agencia *
                          </label>
                          <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="contacto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Persona de contacto *
                          </label>
                          <input
                            type="text"
                            id="contacto"
                            name="contacto"
                            value={formData.contacto}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email de contacto *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Teléfono de contacto *
                          </label>
                          <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <AdminButton
                  onClick={handleSubmit}
                  className="sm:ml-3"
                >
                  {currentAgencia ? 'Actualizar' : 'Crear'}
                </AdminButton>
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setCurrentAgencia(null);
                    setFormData({ nombre: '', contacto: '', email: '', telefono: '' });
                  }}
                  className="sm:ml-3"
                >
                  Cancelar
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
