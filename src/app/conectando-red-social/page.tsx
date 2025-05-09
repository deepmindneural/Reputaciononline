"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSpinner, FaCheckCircle, FaExclamationCircle, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';
import Link from 'next/link';

export default function ConectandoRedSocialPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Conectando con la red social...');
  const [countdown, setCountdown] = useState(10);
  const network = searchParams?.get('network') || 'red social';

  // Mapeo de nombres de plataformas
  const platformNames: Record<string, string> = {
    'facebook': 'Facebook',
    'twitter': 'Twitter',
    'linkedin': 'LinkedIn',
    'instagram': 'Instagram',
    'tiktok': 'TikTok',
    'red social': 'Red Social'
  };

  // Obtener el ícono correcto para la plataforma
  const getPlatformIcon = () => {
    switch (network.toLowerCase()) {
      case 'facebook':
        return <FaFacebook className="text-[#1877F2] text-5xl" />;
      case 'twitter':
        return <FaTwitter className="text-[#1DA1F2] text-5xl" />;
      case 'linkedin':
        return <FaLinkedin className="text-[#0A66C2] text-5xl" />;
      case 'instagram':
        return <FaInstagram className="text-[#E4405F] text-5xl" />;
      case 'tiktok':
        return <FaTiktok className="text-black dark:text-white text-5xl" />;
      default:
        return <FaSpinner className="text-cyan-500 text-5xl" />;
    }
  };

  useEffect(() => {
    // Mostrar mensaje de desarrollo después de 3 segundos
    const messageTimer = setTimeout(() => {
      setStatus('pending');
      setMessage(`Esta aplicación está esperando la aprobación de las cuentas de desarrollador por parte de ${platformNames[network.toLowerCase()] || 'la red social'}. Pronto estará disponible esta funcionalidad.`);
    }, 3000);

    // Iniciar redirección después de 5 segundos
    const redirectTimer = setTimeout(() => {
      router.push('/dashboard/redes-sociales');
    }, 8000);

    return () => {
      clearTimeout(messageTimer);
      clearTimeout(redirectTimer);
    };
  }, [network, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          
          {/* Icono de la red social */}
          <div className="mb-6 flex items-center justify-center">
            <div className="w-20 h-20 flex items-center justify-center">
              {getPlatformIcon()}
              
              {/* Indicador de carga simple */}
              {status === 'loading' && (
                <FaSpinner className="absolute text-cyan-500 text-2xl animate-spin" />
              )}
            </div>
          </div>
          
          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {status === 'loading' ? 
              `Conectando con ${platformNames[network] || 'la red social'}...` : 
              `Aplicación en desarrollo`}
          </h2>
          
          {/* Mensaje */}
          <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
          
          {/* Barra de progreso simple */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-cyan-500 h-2 rounded-full transition-all" 
              style={{ width: status === 'loading' ? '75%' : '100%' }}
            ></div>
          </div>
          
          {/* Botón de retorno */}
          <Link
            href="/dashboard/redes-sociales"
            className="mt-4 w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-center font-medium"
          >
            Volver a Redes Sociales
          </Link>
        </div>
      </div>
    </div>
  );
}
