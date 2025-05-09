"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarError, setMostrarError] = useState(false);
  const [mensajeError, setMensajeError] = useState('Correo o contraseña incorrectos');
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('usuario');
  const [recordarme, setRecordarme] = useState(false);
  const [cargando, setCargando] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Verificar si el usuario viene de completar el registro
    const registrado = searchParams.get('registrado');
    if (registrado === 'true') {
      setMostrarExito(true);
      setMensajeExito('¡Registro completado con éxito! Ahora puedes iniciar sesión con tus credenciales.');
      
      // Obtener el correo del localStorage si está disponible
      const correoGuardado = localStorage.getItem('userEmail');
      if (correoGuardado) {
        setCorreo(correoGuardado);
      }
    }
  }, [searchParams]);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (correo && contrasena) {
      setMostrarError(false);
      setCargando(true);
      
      try {
        // Si recordarme está activado, guardar el correo en localStorage
        if (recordarme) {
          localStorage.setItem('userEmail', correo);
        } else {
          localStorage.removeItem('userEmail');
        }
        
        // Uso de setTimeout para asegurar que la UI se actualice antes
        // de la redirección para mejor experiencia de usuario
        setTimeout(async () => {
          try {
            // Usar NextAuth para iniciar sesión con credenciales
            // Cambiamos a redirección automática para evitar problemas con la sesión
            await signIn('credentials', {
              redirect: true,
              callbackUrl: tipoUsuario === 'admin' ? '/admin/creditos' : '/',  // Redirigimos a la raíz para usuarios regulares
              email: correo,
              password: contrasena,
              userType: tipoUsuario, // Enviar el tipo de usuario seleccionado
            });
            
            // No es necesario manejar la redirección manual ya que signIn con redirect:true lo hace
            // Esto sólo se ejecutará si hay algún problema con la redirección automática
            setCargando(false);
          } catch (innerError) {
            console.error('Error en el inicio de sesión:', innerError);
            setMostrarError(true);
            setMensajeError('Error al procesar el inicio de sesión. Por favor, inténtalo de nuevo.');
            setCargando(false);
          }
        }, 500);
        
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        setMostrarError(true);
        setMensajeError('Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
        setCargando(false);
      }
    } else {
      setMostrarError(true);
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-700 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">Reputación Online</h1>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Iniciar sesión</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Accede a tu cuenta para gestionar tu reputación digital
            </p>
          </div>
          <div className="mb-6">
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setTipoUsuario('usuario')}
                className={`py-2 px-4 rounded-md ${tipoUsuario === 'usuario' ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                Usuario
              </button>
              <button
                type="button"
                onClick={() => setTipoUsuario('admin')}
                className={`py-2 px-4 rounded-md ${tipoUsuario === 'admin' ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                Administrador
              </button>
            </div>
          </div>
          
          {/* Mensaje de éxito tras registro */}
          {mostrarExito && (
            <div className="mb-6 bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-400 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{mensajeExito}</span>
              <button
                type="button"
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setMostrarExito(false)}
              >
                <span className="sr-only">Cerrar</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
              </button>
            </div>
          )}

          <form className="space-y-6" onSubmit={manejarEnvio}>
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  autoComplete="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña
                </label>
                <Link href="/recuperar-contrasena" className="text-xs text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="mt-1 relative">
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                  disabled={cargando}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="recordarme"
                  name="recordarme"
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-cyan-400"
                />
                <label htmlFor="recordarme" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Recordar dispositivo
                </label>
              </div>
            </div>

            {mostrarError && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">Credenciales incorrectas o error al iniciar sesión. Por favor, inténtalo nuevamente.</span>
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={cargando}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cargando ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  'Acceder'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  ¿No tienes una cuenta?
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link href="/registro" className="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium">
                Registrarse
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                Volver a la página principal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
