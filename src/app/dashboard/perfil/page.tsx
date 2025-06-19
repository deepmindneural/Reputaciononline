"use client";

import React, { useState, useEffect } from 'react';
import { User, Camera, Save, X, UserCog, Shield, Megaphone, Award, Facebook, Instagram, Share2, Linkedin, Youtube, Globe } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import SocialNetworkConnector from '@/components/user/SocialNetworkConnectorFixed';

interface ProfileFormData {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  bio: string;
  // Campos específicos para políticos
  partidoPolitico?: string;
  cargoActual?: string;
  propuestasPrincipales?: string;
}

export default function ProfilePage() {
  const { user, updateUser } = useUser();
  const [userType, setUserType] = useState<'personal' | 'politico'>('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('perfil'); // Nueva variable para las pestañas: 'perfil' o 'cuentas'
  const [formData, setFormData] = useState<ProfileFormData>({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    bio: '',
    partidoPolitico: '',
    cargoActual: '',
    propuestasPrincipales: '',
  });

  useEffect(() => {
    // Cargar datos reales del usuario desde el contexto
    if (user) {
      setFormData({
        nombre: user.name || '',
        email: user.email || '',
        telefono: user.telefono || '',
        empresa: user.empresa || '',
        bio: user.bio || '',
        partidoPolitico: user.partidoPolitico || '',
        cargoActual: user.cargoActual || '',
        propuestasPrincipales: user.propuestasPrincipales || '',
      });
      
      // Establecer avatar si existe
      if (user.avatar) {
        setAvatar(user.avatar);
      }
      
      // Establecer tipo de usuario si existe en los datos
      if (user.profileCategory) {
        const isPolitico = user.profileCategory.toLowerCase().includes('político') || 
                          user.profileCategory.toLowerCase().includes('gubernamental');
        setUserType(isPolitico ? 'politico' : 'personal');
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulación de envío de datos
    try {
      // Aquí iría la llamada a la API para guardar los datos
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      {/* Pestañas de navegación */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('perfil')}
              className={`inline-flex items-center py-4 px-4 text-sm font-medium text-center border-b-2 ${activeTab === 'perfil' 
                ? 'text-[#01257D] border-[#01257D] dark:text-[#01257D] dark:border-[#01257D]' 
                : 'border-transparent hover:text-[#01257D] hover:border-[#01257D] dark:hover:text-[#01257D]'}`}
            >
              <User className="mr-2 h-5 w-5" />
              Información Personal
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('cuentas')}
              className={`inline-flex items-center py-4 px-4 text-sm font-medium text-center border-b-2 ${activeTab === 'cuentas' 
                ? 'text-[#01257D] border-[#01257D] dark:text-[#01257D] dark:border-[#01257D]' 
                : 'border-transparent hover:text-[#01257D] hover:border-[#01257D] dark:hover:text-[#01257D]'}`}
            >
              <Share2 className="mr-2 h-5 w-5" />
              Conectar Redes Sociales
            </button>
          </li>
        </ul>
      </div>

      {activeTab === 'perfil' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sidebar con información general */}
          <div className="col-span-1">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="mb-6 flex flex-col items-center">
              <div className="relative mb-4">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Avatar" 
                    className="h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#01257D]-100 text-primary dark:bg-[#01257D]-900 dark:text-primary-300">
                    {userType === 'politico' ? 
                      <UserCog className="h-16 w-16" /> : 
                      <User className="h-16 w-16" />
                    }
                  </div>
                )}
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#01257D] text-white hover:bg-[#01257D]-700"
                >
                  <Camera className="h-4 w-4" />
                </label>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                />
              </div>

              <h2 className="text-lg font-medium text-gray-900 dark:text-white">{formData.nombre}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</p>
              <span className="mt-1 inline-flex items-center rounded-full bg-[#01257D]-100 px-3 py-1 text-xs font-medium text-primary dark:bg-[#01257D]-900 dark:text-primary-300">
                {userType === 'politico' ? 'Perfil Político' : 'Persona Natural'}
              </span>
            </div>

            <div className="space-y-4">
              {userType === 'politico' ? (
                <>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/30">
                    <div className="mb-2 flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-primary" />
                      <h3 className="font-medium text-gray-900 dark:text-white">Nivel de Verificación</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Perfil político verificado</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/30">
                    <div className="mb-2 flex items-center">
                      <Megaphone className="mr-2 h-5 w-5 text-primary" />
                      <h3 className="font-medium text-gray-900 dark:text-white">Estado de Campaña</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Campaña activa</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/30">
                    <div className="mb-2 flex items-center">
                      <Award className="mr-2 h-5 w-5 text-primary" />
                      <h3 className="font-medium text-gray-900 dark:text-white">Plan Actual</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Plan Básico</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Formulario principal */}
        <div className="col-span-1 lg:col-span-2">
          <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-6 border-b border-gray-200 pb-3 text-xl font-medium text-gray-900 dark:border-gray-700 dark:text-white">
              Información Personal
            </h2>

            <div className="mb-8 grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-[#01257D] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-[#01257D] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-[#01257D] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {userType === 'politico' ? 'Partido político' : 'Empresa o marca'}
                </label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-[#01257D] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Biografía / Descripción
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-[#01257D] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              ></textarea>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Breve descripción que aparecerá en tu perfil público.
              </p>
            </div>

            {/* Campos específicos para perfil político */}
            {userType === 'politico' && (
              <>
                <h2 className="mb-6 border-b border-gray-200 pb-3 text-xl font-medium text-gray-900 dark:border-gray-700 dark:text-white">
                  Información Política
                </h2>
                
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="cargoActual" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cargo actual o al que aspira
                    </label>
                    <input
                      type="text"
                      id="cargoActual"
                      name="cargoActual"
                      value={formData.cargoActual}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-[#01257D] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="propuestasPrincipales" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Propuestas principales
                  </label>
                  <textarea
                    id="propuestasPrincipales"
                    name="propuestasPrincipales"
                    rows={4}
                    value={formData.propuestasPrincipales}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-[#01257D] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Resume tus principales propuestas políticas o áreas de interés.
                  </p>
                </div>
              </>
            )}

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-white hover:bg-gray-50 focus:outline-none dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center rounded-lg bg-[#01257D] px-4 py-2 text-sm font-medium text-white hover:bg-[#013AAA] focus:outline-none focus:ring-4 focus:ring-[#01257D]/50 dark:bg-[#01257D] dark:hover:bg-[#013AAA]"
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : (
      /* Pestaña de Redes Sociales */
      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Conectar Redes Sociales</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Conecta tus redes sociales para monitorear tu reputación online. Esto permitirá a la IA analizar menciones y sentimientos sobre tu marca o perfil.  
          </p>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Facebook */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center">
                <div className="mr-3 rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  <Facebook className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">Facebook</h3>
              </div>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Conecta tu perfil o página de Facebook</p>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#01257D] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#013AAA] focus:outline-none focus:ring-4 focus:ring-[#01257D]/50 dark:bg-[#01257D] dark:hover:bg-[#013AAA]"
              >
                Conectar cuenta
              </button>
            </div>
            
            {/* X */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center">
                <div className="mr-3 rounded-full bg-gray-100 p-2 text-black dark:bg-gray-700 dark:text-white">
                  <X className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">X</h3>
              </div>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Conecta tu cuenta de X</p>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#01257D] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#013AAA] focus:outline-none focus:ring-4 focus:ring-[#01257D]/50 dark:bg-[#01257D] dark:hover:bg-[#013AAA]"
              >
                Conectar cuenta
              </button>
            </div>
            
            {/* Instagram */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center">
                <div className="mr-3 rounded-full bg-pink-100 p-2 text-pink-600 dark:bg-pink-900 dark:text-pink-300">
                  <Instagram className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">Instagram</h3>
              </div>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Conecta tu cuenta de Instagram</p>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#01257D] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#013AAA] focus:outline-none focus:ring-4 focus:ring-[#01257D]/50 dark:bg-[#01257D] dark:hover:bg-[#013AAA]"
              >
                Conectar cuenta
              </button>
            </div>
            
            {/* Threads */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center">
                <div className="mr-3 rounded-full bg-black p-2 text-white dark:bg-gray-700 dark:text-gray-300">
                  <div className="flex h-6 w-6 items-center justify-center font-bold">@</div>
                </div>
                <h3 className="text-lg font-medium">Threads</h3>
              </div>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Conecta tu cuenta de Threads</p>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#01257D] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#013AAA] focus:outline-none focus:ring-4 focus:ring-[#01257D]/50 dark:bg-[#01257D] dark:hover:bg-[#013AAA]"
              >
                Conectar cuenta
              </button>
            </div>
            
            {/* LinkedIn */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center">
                <div className="mr-3 rounded-full bg-blue-100 p-2 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  <Linkedin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">LinkedIn</h3>
              </div>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Conecta tu perfil de LinkedIn</p>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#01257D] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#013AAA] focus:outline-none focus:ring-4 focus:ring-[#01257D]/50 dark:bg-[#01257D] dark:hover:bg-[#013AAA]"
              >
                Conectar cuenta
              </button>
            </div>
            
            {/* YouTube */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center">
                <div className="mr-3 rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900 dark:text-red-300">
                  <Youtube className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">YouTube</h3>
              </div>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Conecta tu canal de YouTube</p>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#01257D] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#013AAA] focus:outline-none focus:ring-4 focus:ring-[#01257D]/50 dark:bg-[#01257D] dark:hover:bg-[#013AAA]"
              >
                Conectar cuenta
              </button>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-[#01257D] px-4 py-2 text-sm font-medium text-white hover:bg-[#013AAA] focus:outline-none focus:ring-4 focus:ring-[#01257D]/50 dark:bg-[#01257D] dark:hover:bg-[#013AAA]"
            >
              Guardar configuración
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
