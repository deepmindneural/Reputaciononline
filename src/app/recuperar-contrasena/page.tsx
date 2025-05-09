"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RecuperarContrasenaPage() {
  const [correo, setCorreo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const router = useRouter();

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo) return;

    try {
      setEnviando(true);
      setMensaje({ tipo: '', texto: '' });

      const res = await fetch('/api/auth/recuperar-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: correo }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje({
          tipo: 'exito',
          texto: data.message || 'Hemos enviado un correo con instrucciones para restablecer tu contraseña',
        });
        // Limpiar el formulario
        setCorreo('');
      } else {
        setMensaje({
          tipo: 'error',
          texto: data.error || 'No se pudo procesar tu solicitud. Inténtalo de nuevo.',
        });
      }
    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña:', error);
      setMensaje({
        tipo: 'error',
        texto: 'Error de conexión. Por favor, inténtalo más tarde.',
      });
    } finally {
      setEnviando(false);
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
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Recuperar contraseña</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Ingresa tu correo electrónico y te enviaremos instrucciones para restablecerla
            </p>
          </div>
          
          {mensaje.texto && (
            <div 
              className={`mb-6 ${mensaje.tipo === 'exito' ? 'bg-green-100 dark:bg-green-900/30 border-green-400 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-400'} border px-4 py-3 rounded relative`} 
              role="alert"
            >
              <span className="block sm:inline">{mensaje.texto}</span>
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
                  disabled={enviando}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={enviando}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enviando ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  'Enviar instrucciones'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300">
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
