"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarError, setMostrarError] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('usuario');
  const router = useRouter();
  const { login } = useAuth();

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (correo && contrasena) {
      const ok = await login(correo, contrasena);
      if (ok) {
        if (tipoUsuario === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setMostrarError(true);
        setMensajeError('Credenciales incorrectas');
      }
    } else {
      setMostrarError(true);
      setMensajeError('Por favor, completa todos los campos.');
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
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {mostrarError && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{mensajeError}</span>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Acceder
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
