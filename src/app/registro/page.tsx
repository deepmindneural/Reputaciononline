"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegistroPage() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mostrarError, setMostrarError] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const router = useRouter();
  const { register } = useAuth();

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre && correo && contrasena && confirmarContrasena) {
      if (contrasena !== confirmarContrasena) {
        setMostrarError(true);
        setMensajeError('Las contraseñas no coinciden.');
        return;
      }
      
      const ok = await register(nombre, correo, contrasena);
      if (ok) {
        router.push('/registro/plan');
      } else {
        setMostrarError(true);
        setMensajeError('Error al registrar');
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
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Crear cuenta</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Únete a nuestra plataforma para gestionar tu reputación digital
            </p>
          </div>

          <form className="space-y-6" onSubmit={manejarEnvio}>
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre completo
              </label>
              <div className="mt-1">
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                  placeholder="Juan Pérez"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar contraseña
              </label>
              <div className="mt-1">
                <input
                  id="confirmarContrasena"
                  name="confirmarContrasena"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmarContrasena}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
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
                Crear cuenta
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
                  ¿Ya tienes una cuenta?
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link href="/login" className="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium">
                Iniciar sesión
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
