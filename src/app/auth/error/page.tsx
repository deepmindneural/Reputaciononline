"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'Callback':
        return 'Hubo un problema al procesar la autenticación.';
      case 'OAuthSignin':
        return 'Error al iniciar el proceso de autenticación.';
      case 'OAuthCallback':
        return 'Error en la respuesta de la red social.';
      case 'OAuthCreateAccount':
        return 'No se pudo crear la cuenta con la red social.';
      case 'EmailCreateAccount':
        return 'No se pudo crear la cuenta con el email proporcionado.';
      case 'AccessDenied':
        return 'Acceso denegado por la plataforma.';
      default:
        return 'Ocurrió un error durante la autenticación. Por favor intenta nuevamente.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center">
              <FaExclamationTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900 dark:text-white">
              Error de autenticación
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {getErrorMessage(error)}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Link 
              href="/auth/signin"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Intentar nuevamente
            </Link>
            
            <Link 
              href="/dashboard"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              <FaArrowLeft className="mr-2" />
              Volver al dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
