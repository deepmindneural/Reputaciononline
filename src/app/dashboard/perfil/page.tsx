"use client";

import React, { useState, useEffect } from 'react';
import { User, Camera, Save, X, UserCog, Shield, Megaphone, Award } from 'lucide-react';

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
  const [userType, setUserType] = useState<'personal' | 'politico'>('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
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
    // Asegurarse de que estamos en el cliente antes de acceder a localStorage
    if (typeof window !== 'undefined') {
      // Cargar tipo de usuario desde localStorage
      const storedType = localStorage.getItem('tipoPerfil');
      if (storedType === 'politico' || storedType === 'personal') {
        setUserType(storedType);
      }
      
      // Simulación de carga de datos del usuario
      setIsLoading(true);
      setTimeout(() => {
        setFormData({
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          telefono: '+34 612 345 678',
          empresa: userType === 'politico' ? 'Partido Democrático' : 'Empresa ABC',
          bio: userType === 'politico' 
            ? 'Político comprometido con el desarrollo sostenible y la transparencia en la gestión pública.' 
            : 'Profesional con experiencia en marketing digital y gestión de reputación online.',
          partidoPolitico: userType === 'politico' ? 'Partido Democrático' : '',
          cargoActual: userType === 'politico' ? 'Candidato a Concejal' : '',
          propuestasPrincipales: userType === 'politico' ? 'Transparencia, desarrollo sostenible, educación de calidad' : '',
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [userType]);

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
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary-100 text-primary dark:bg-primary-900 dark:text-primary-300">
                    {userType === 'politico' ? 
                      <UserCog className="h-16 w-16" /> : 
                      <User className="h-16 w-16" />
                    }
                  </div>
                )}
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-primary-700"
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
              <span className="mt-1 inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary dark:bg-primary-900 dark:text-primary-300">
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 dark:bg-primary-600 dark:hover:bg-primary-700"
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
    </div>
  );
}
