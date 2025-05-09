"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
  const error = searchParams?.get('error');

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider);
    await signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center text-cyan-600 hover:text-cyan-500 mb-6 ml-4">
          <FaArrowLeft className="mr-2" />
          Volver al inicio
        </Link>
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-16 w-auto"
              src="/images/logo.png"
              alt="Reputación Online"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Conectar con redes sociales
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Selecciona la plataforma con la que deseas conectarte
            </p>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 dark:bg-red-900/30 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error de autenticación
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>
                      {error === 'Callback' ? 'Hubo un problema al procesar la autenticación.' : 
                       error === 'OAuthSignin' ? 'Error al iniciar el proceso de autenticación.' :
                       error === 'OAuthCallback' ? 'Error en la respuesta de la red social.' :
                       error === 'OAuthCreateAccount' ? 'No se pudo crear la cuenta con la red social.' :
                       error === 'EmailCreateAccount' ? 'No se pudo crear la cuenta con el email proporcionado.' :
                       error === 'AccessDenied' ? 'Acceso denegado por la plataforma.' :
                       'Ocurrió un error durante la autenticación. Por favor intenta nuevamente.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <button
              onClick={() => handleSignIn('facebook')}
              disabled={isLoading !== null}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#1877F2] hover:bg-[#166FE5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2] ${isLoading === 'facebook' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading === 'facebook' ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <FaFacebook className="mr-2" />}
              Conectar con Facebook
            </button>

            <button
              onClick={() => handleSignIn('twitter')}
              disabled={isLoading !== null}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#1DA1F2] hover:bg-[#1A91DA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DA1F2] ${isLoading === 'twitter' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading === 'twitter' ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <FaTwitter className="mr-2" />}
              Conectar con Twitter/X
            </button>

            <button
              onClick={() => handleSignIn('instagram')}
              disabled={isLoading !== null}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-[#E1306C] to-[#C13584] hover:from-[#D92D68] hover:to-[#B12D7C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E1306C] ${isLoading === 'instagram' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading === 'instagram' ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <FaInstagram className="mr-2" />}
              Conectar con Instagram
            </button>

            <button
              onClick={() => handleSignIn('linkedin')}
              disabled={isLoading !== null}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#0077B5] hover:bg-[#006699] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077B5] ${isLoading === 'linkedin' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading === 'linkedin' ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <FaLinkedin className="mr-2" />}
              Conectar con LinkedIn
            </button>
          </div>

          <div className="mt-6">
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              Al conectar tu cuenta, aceptas nuestros <Link href="/terminos" className="text-cyan-600 hover:text-cyan-500">Términos de Servicio</Link> y <Link href="/privacidad" className="text-cyan-600 hover:text-cyan-500">Política de Privacidad</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
