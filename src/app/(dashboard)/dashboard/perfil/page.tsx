"use client";

import React, { useState } from 'react';
import { FaSave, FaUser, FaImage } from 'react-icons/fa';
import ImageUploader from '@/components/upload/ImageUploader';

export default function PerfilPage() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [profileUploadStatus, setProfileUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [logoUploadStatus, setLogoUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedChanges, setSavedChanges] = useState(false);
  const [userName, setUserName] = useState('Juan Pérez');
  
  // Cargar nombre de usuario guardado al iniciar
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('userName');
      if (savedName) {
        setUserName(savedName);
      }
    }
  }, []);

  // Función para manejar la carga de la foto de perfil
  const handleProfileImageUpload = (image: File) => {
    setProfileImage(image);
    setProfileUploadStatus('uploading');
    
    // Simulando una carga al servidor
    setTimeout(() => {
      setProfileUploadStatus('success');
      setSavedChanges(false);
    }, 1500);
  };

  // Función para manejar la carga del logo
  const handleLogoImageUpload = (image: File) => {
    setLogoImage(image);
    setLogoUploadStatus('uploading');
    
    // Simulando una carga al servidor
    setTimeout(() => {
      setLogoUploadStatus('success');
      setSavedChanges(false);
    }, 1500);
  };

  // Función para guardar los cambios
  const handleSaveChanges = () => {
    // Guardar el nombre de usuario en localStorage
    if (userName.trim() !== '') {
      localStorage.setItem('userName', userName);
    }
    
    // Aquí iría la lógica real para enviar las imágenes al servidor
    // Por ahora, simulamos el proceso
    setSavedChanges(true);

    // Actualizar la página para reflejar los cambios en toda la aplicación
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración de Perfil</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Personaliza la apariencia de tu plataforma con tu foto de perfil y logo
          </p>
        </div>

        <button
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          onClick={handleSaveChanges}
          disabled={profileUploadStatus === 'uploading' || logoUploadStatus === 'uploading'}
        >
          <FaSave className="mr-2" />
          Guardar Cambios
        </button>
      </div>

      {savedChanges && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          <p className="font-medium">¡Cambios guardados correctamente!</p>
          <p>Las imágenes se han actualizado en el sistema.</p>
        </div>
      )}

      <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Información Personal</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ingrese su nombre completo"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Carga de foto de perfil */}
        <ImageUploader
          title="Foto de Perfil"
          description="Sube tu foto de perfil para personificar tu cuenta. Esta imagen se mostrará en la dashboard y en tu perfil público."
          currentImage="/images/profile/juan-perez.jpg" // URL de la imagen actual (podría venir de una API)
          onImageUpload={handleProfileImageUpload}
          uploadStatus={profileUploadStatus}
          errorMessage={errorMessage}
          imageType="profile"
        />

        {/* Carga de logo */}
        <ImageUploader
          title="Logo de la Organización"
          description="Sube el logo de tu organización o campaña. Este logo se mostrará en las cabeceras y los reportes generados."
          currentImage="/images/logo.png" // URL del logo actual (podría venir de una API)
          onImageUpload={handleLogoImageUpload}
          uploadStatus={logoUploadStatus}
          errorMessage={errorMessage}
          imageType="logo"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recomendaciones para imágenes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-2">
              <FaUser className="mr-2 text-primary-500" />
              Foto de Perfil
            </h3>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
              <li>Utiliza una fotografía profesional y de alta calidad</li>
              <li>Asegúrate de que tu rostro sea claramente visible</li>
              <li>Fondo neutro y sin distracciones</li>
              <li>Formato recomendado: cuadrado (1:1)</li>
              <li>Resolución mínima: 400x400 píxeles</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-2">
              <FaImage className="mr-2 text-primary-500" />
              Logo
            </h3>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
              <li>Utiliza un archivo con fondo transparente (PNG)</li>
              <li>Asegúrate de que sea legible incluso en tamaños pequeños</li>
              <li>Mantén los colores alineados con tu marca</li>
              <li>Formato recomendado: PNG con transparencia</li>
              <li>Resolución mínima: 200x200 píxeles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
