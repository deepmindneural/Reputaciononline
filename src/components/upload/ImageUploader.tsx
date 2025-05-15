"use client";

import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaSpinner, FaCheck, FaTimesCircle } from 'react-icons/fa';

interface ImageUploaderProps {
  title: string;
  description: string;
  currentImage?: string;
  onImageUpload: (image: File) => void;
  uploadStatus?: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
  imageType: 'profile' | 'logo';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  title,
  description,
  currentImage,
  onImageUpload,
  uploadStatus = 'idle',
  errorMessage = '',
  imageType
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const handleFileChange = (file: File) => {
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor sube un formato de imagen válido (JPG, PNG, GIF, SVG)');
      return;
    }

    // Validar tamaño de archivo (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar los 2MB');
      return;
    }

    // Mostrar vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageData = e.target.result as string;
        setPreviewImage(imageData);
        
        // Guardar la imagen en localStorage según su tipo
        if (imageType === 'profile') {
          localStorage.setItem('userProfileImage', imageData);
        } else if (imageType === 'logo') {
          localStorage.setItem('appLogo', imageData);
        }
      }
    };
    reader.readAsDataURL(file);

    // Llamar a la función de carga
    onImageUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'} ${uploadStatus === 'error' ? 'border-red-500' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        style={{ cursor: 'pointer' }}
      >
        {previewImage ? (
          <div className="flex flex-col items-center">
            <img 
              src={previewImage} 
              alt={imageType === 'profile' ? 'Foto de perfil' : 'Logo'}
              className={`mb-4 ${imageType === 'profile' ? 'w-32 h-32 rounded-full object-cover' : 'max-h-24 object-contain'}`}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">Haz clic o arrastra una nueva imagen para cambiarla</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FaCloudUploadAlt className="text-5xl text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Haz clic o arrastra una imagen aquí</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">PNG, JPG, GIF o SVG (máx. 2MB)</p>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          accept="image/*"
          ref={fileInputRef}
        />
      </div>

      {uploadStatus === 'uploading' && (
        <div className="flex items-center mt-3 text-primary-600 dark:text-primary-400">
          <FaSpinner className="animate-spin mr-2" />
          <span>Subiendo imagen...</span>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="flex items-center mt-3 text-green-600 dark:text-green-400">
          <FaCheck className="mr-2" />
          <span>¡Imagen subida correctamente!</span>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="flex items-center mt-3 text-red-600 dark:text-red-400">
          <FaTimesCircle className="mr-2" />
          <span>{errorMessage || 'Error al subir la imagen. Inténtalo de nuevo.'}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
