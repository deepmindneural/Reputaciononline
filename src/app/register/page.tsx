"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Check, Building } from 'lucide-react';

export default function RegisterPage() {
  // Estados para manejar la entrada de usuario
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);
  const [aceptarTerminos, setAceptarTerminos] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [paso, setPaso] = useState(1); // Para el proceso de registro en 2 pasos

  // Función para validar el correo electrónico
  const esEmailValido = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Función para validar la contraseña
  const esPasswordValida = (password: string) => {
    return password.length >= 8; // Criterio mínimo
  };

  // Función para manejar el envío del formulario del primer paso
  const handlePaso1 = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!nombre || !email || !password || !confirmarPassword) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }
    
    if (!esEmailValido(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }
    
    if (!esPasswordValida(password)) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    // Avanzar al siguiente paso si todo está bien
    setError('');
    setPaso(2);
  };

  // Función para manejar el envío del formulario completo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!empresa) {
      setError('Por favor ingresa el nombre de tu empresa');
      return;
    }
    
    if (!aceptarTerminos) {
      setError('Debes aceptar los términos y condiciones para continuar');
      return;
    }
    
    // Simulación de registro
    try {
      setCargando(true);
      setError('');
      
      // Simulación de un proceso de registro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirección a dashboard (en producción se haría después de registrar)
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Error al registrar tu cuenta. Por favor intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Panel lateral - Solo visible en pantallas medianas y grandes */}
      <div className="relative hidden w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 md:block">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center"
          >
            <div className="mr-3 h-12 w-12 rounded-full bg-white bg-opacity-20"></div>
            <h1 className="text-3xl font-bold">Reputación Online</h1>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-center text-2xl font-light"
          >
            Únete hoy y comienza a gestionar tu presencia digital como un profesional
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="rounded-lg bg-white bg-opacity-10 p-4">
              <div className="mb-2 flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-400" />
                <h3 className="text-lg font-medium">Plan Básico Gratuito</h3>
              </div>
              <ul className="ml-7 list-disc space-y-1 text-sm">
                <li>500 créditos de bienvenida</li>
                <li>Monitoreo básico de menciones</li>
                <li>Análisis de sentimiento</li>
                <li>Soporte por correo electrónico</li>
              </ul>
            </div>
            
            <p className="text-center text-sm">
              Al registrarte, recibirás créditos de bienvenida para que puedas comenzar a utilizar nuestra plataforma inmediatamente.
            </p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-white text-opacity-70">
          © 2025 Reputación Online. Todos los derechos reservados.
        </div>
      </div>
      
      {/* Formulario de registro */}
      <div className="flex w-full items-center justify-center px-4 md:w-1/2 md:px-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 p-8"
        >
          {/* Logo solo visible en móviles */}
          <div className="text-center md:hidden">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600">
              <div className="h-8 w-8 rounded-full bg-white"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reputación Online</h1>
            <p className="text-gray-500 dark:text-gray-400">Gestiona tu presencia digital</p>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Crear una cuenta</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {paso === 1 ? 'Comienza con tus datos personales' : 'Un paso más para completar tu registro'}
            </p>
          </div>
          
          {/* Indicador de pasos */}
          <div className="relative mx-auto mt-4 w-full max-w-xs">
            <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 transform bg-gray-200 dark:bg-gray-700"></div>
            <div className="relative flex justify-between">
              <div className="flex flex-col items-center">
                <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${paso >= 1 ? 'bg-primary-600 text-white dark:bg-primary-500' : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'}`}>
                  <span className="text-sm font-medium">1</span>
                </div>
                <span className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">Cuenta</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${paso >= 2 ? 'bg-primary-600 text-white dark:bg-primary-500' : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'}`}>
                  <span className="text-sm font-medium">2</span>
                </div>
                <span className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">Detalles</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}
          
          {paso === 1 ? (
            <form className="mt-8 space-y-6" onSubmit={handlePaso1}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      autoComplete="name"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="block w-full rounded-md border-gray-300 py-3 pl-10 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-gray-300 py-3 pl-10 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      placeholder="usuario@empresa.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={mostrarPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-gray-300 py-3 pl-10 pr-10 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                    >
                      {mostrarPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmar-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirmar contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmar-password"
                      name="confirmar-password"
                      type={mostrarConfirmarPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmarPassword}
                      onChange={(e) => setConfirmarPassword(e.target.value)}
                      className="block w-full rounded-md border-gray-300 py-3 pl-10 pr-10 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      placeholder="Confirma tu contraseña"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                      onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                    >
                      {mostrarConfirmarPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-700 dark:hover:bg-primary-600"
                >
                  Continuar
                </button>
              </div>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre de la empresa <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="empresa"
                      name="empresa"
                      type="text"
                      autoComplete="organization"
                      required
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      className="block w-full rounded-md border-gray-300 py-3 pl-10 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                </div>
                
                <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selecciona tu plan inicial</h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="plan-basico"
                        name="plan"
                        type="radio"
                        defaultChecked
                        className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <label htmlFor="plan-basico" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Plan Básico - <span className="font-bold text-primary-600 dark:text-primary-400">Gratuito</span>
                      </label>
                    </div>
                    <div className="ml-7 text-xs text-gray-500 dark:text-gray-400">
                      500 créditos de bienvenida para que comiences a monitorear tu reputación online.
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="terminos"
                      name="terminos"
                      type="checkbox"
                      checked={aceptarTerminos}
                      onChange={(e) => setAceptarTerminos(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terminos" className="font-medium text-gray-700 dark:text-gray-300">
                      Acepto los <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">Términos y Condiciones</a> y la <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">Política de Privacidad</a> <span className="text-red-500">*</span>
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Al registrarme, acepto recibir comunicaciones y actualizaciones sobre el servicio.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPaso(1)}
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Volver
                </button>
                
                <button
                  type="submit"
                  disabled={cargando}
                  className="group relative flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-75 dark:bg-primary-700 dark:hover:bg-primary-600"
                >
                  {cargando ? (
                    <span className="flex items-center">
                      <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registrando...
                    </span>
                  ) : (
                    'Completar registro'
                  )}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
