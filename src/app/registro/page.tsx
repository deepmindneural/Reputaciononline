"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegistroPage() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mostrarError, setMostrarError] = useState(false);
  const [mensajeError, setMensajeError] = useState('Por favor, completa todos los campos.');
  const router = useRouter();

  const [planSeleccionado, setPlanSeleccionado] = useState<'basico' | 'profesional' | 'empresarial'>('profesional');
  const [registrando, setRegistrando] = useState(false);
  const [paso, setPaso] = useState(1); // Paso 1: Datos personales, Paso 2: Selección de plan, Paso 3: Confirmación
  
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paso === 1) {
      // Validar datos personales
      if (nombre && correo && contrasena && confirmarContrasena) {
        if (contrasena !== confirmarContrasena) {
          setMostrarError(true);
          setMensajeError('Las contraseñas no coinciden.');
          return;
        }
        // Avanzar al paso de selección de plan
        setPaso(2);
        setMostrarError(false);
      } else {
        setMostrarError(true);
        setMensajeError('Por favor, completa todos los campos.');
      }
    } 
    else if (paso === 2) {
      // Avanzar al paso de confirmación
      setPaso(3);
    }
    else if (paso === 3) {
      // Proceso de registro final
      setRegistrando(true);
      
      try {
        // En un sistema real, esto se conectaría con una API para registrar al usuario
        // Simular registro exitoso
        
        // 1. Guardar datos en localStorage para persistencia
        localStorage.setItem('userName', nombre);
        localStorage.setItem('userEmail', correo);
        localStorage.setItem('userPlan', planSeleccionado);
        
        // 2. Redireccionar al login con mensaje de éxito
        router.push('/login?registrado=true');
      } catch (error) {
        console.error('Error al registrar:', error);
        setMostrarError(true);
        setMensajeError('Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.');
        setRegistrando(false);
      }
    }
  };
  
  const volverPaso = () => {
    if (paso > 1) {
      setPaso(paso - 1);
    }
  };

  // Definir los planes disponibles
  const planes = [
    {
      id: 'basico',
      nombre: 'Básico',
      precio: 99000,
      caracteristicas: [
        'Monitoreo de 1 red social',
        '100 créditos mensuales',
        'Análisis básico de sentimiento',
        'Dashboard personalizado'
      ]
    },
    {
      id: 'profesional',
      nombre: 'Profesional',
      precio: 199000,
      caracteristicas: [
        'Monitoreo de 3 redes sociales',
        '300 créditos mensuales',
        'Análisis avanzado de sentimiento',
        'Asistente Sofia básico',
        'Reportes semanales'
      ]
    },
    {
      id: 'empresarial',
      nombre: 'Empresarial',
      precio: 349000,
      caracteristicas: [
        'Monitoreo ilimitado de redes',
        '800 créditos mensuales',
        'Análisis avanzado con gráficos',
        'Asistente Sofia completo',
        'Reportes personalizados',
        'Soporte prioritario'
      ]
    }
  ];
  
  // Formato para mostrar precios en pesos colombianos
  const formatoPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-700 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
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
          
          {/* Indicador de pasos */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paso >= 1 ? 'bg-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                1
              </div>
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">Datos</span>
            </div>
            <div className={`flex-grow h-1 ${paso >= 2 ? 'bg-cyan-500' : 'bg-gray-200 dark:bg-gray-700'} mx-2`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paso >= 2 ? 'bg-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                2
              </div>
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">Plan</span>
            </div>
            <div className={`flex-grow h-1 ${paso >= 3 ? 'bg-cyan-500' : 'bg-gray-200 dark:bg-gray-700'} mx-2`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paso >= 3 ? 'bg-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                3
              </div>
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">Confirmar</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={manejarEnvio}>
            {/* Paso 1: Formulario de Datos Personales */}
            {paso === 1 && (
              <>
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
              </>
            )}

            {/* Paso 2: Seleccion de Plan */}
            {paso === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">Selecciona tu plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {planes.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        planSeleccionado === plan.id 
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-md transform -translate-y-1' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-800'
                      }`}
                      onClick={() => setPlanSeleccionado(plan.id as any)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900 dark:text-white">{plan.nombre}</h4>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          planSeleccionado === plan.id 
                            ? 'border-cyan-500 bg-white dark:bg-gray-800' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {planSeleccionado === plan.id && <div className="w-3 h-3 rounded-full bg-cyan-500"></div>}
                        </div>
                      </div>
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatoPrecio(plan.precio)}</span>
                        <span className="text-gray-500 dark:text-gray-400"> /mes</span>
                      </div>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                        {plan.caracteristicas.map((caracteristica, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg className="h-5 w-5 text-cyan-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {caracteristica}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 3: Confirmacion y Pago */}
            {paso === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">Confirma tu información</h3>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Información personal</h4>
                      <p className="text-gray-900 dark:text-white mt-1">{nombre}</p>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">{correo}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan seleccionado</h4>
                      <p className="text-gray-900 dark:text-white mt-1">{planes.find(p => p.id === planSeleccionado)?.nombre}</p>
                      <p className="text-cyan-600 dark:text-cyan-400 font-bold mt-1">{formatoPrecio(planes.find(p => p.id === planSeleccionado)?.precio || 0)}/mes</p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Método de pago</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="tarjeta"
                        name="metodoPago"
                        type="radio"
                        defaultChecked
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                      />
                      <label htmlFor="tarjeta" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tarjeta de crédito o débito
                      </label>
                    </div>
                    
                    <div className="pl-7 space-y-4">
                      <div>
                        <label htmlFor="numeroTarjeta" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Número de tarjeta
                        </label>
                        <input
                          type="text"
                          id="numeroTarjeta"
                          placeholder="1234 5678 9012 3456"
                          className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="fechaExpiracion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Fecha de expiración
                          </label>
                          <input
                            type="text"
                            id="fechaExpiracion"
                            placeholder="MM/AA"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Código de seguridad
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            placeholder="123"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mostrarError && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{mensajeError}</span>
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              {/* Botón Atrás - Solo visible en pasos 2 y 3 */}
              {paso > 1 ? (
                <button
                  type="button"
                  onClick={volverPaso}
                  className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Atrás
                </button>
              ) : (
                <div></div> /* Espacio vacío para mantener el flex justify-between */
              )}
              
              {/* Botón Siguiente o Finalizar */}
              <button
                type="submit"
                disabled={registrando}
                className={`flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  registrando ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
                }`}
              >
                {registrando ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : paso === 3 ? (
                  'Finalizar registro'
                ) : (
                  'Continuar'
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
