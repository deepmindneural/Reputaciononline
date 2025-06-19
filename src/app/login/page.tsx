"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { fadeInUp, staggerFadeIn, createTimeline } from '../../lib/gsap-animations';
import { aiPatternLearning, aiRecognitionResponse, aiNeuralConnections } from '../../lib/ai-animations';
import AnimatedBackground from '../../components/ui/AnimatedBackground';

export default function LoginPage() {
  // Estados para manejar la entrada de usuario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  
  // Referencias para animaciones
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Inicializar animaciones
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const tl = createTimeline({ defaults: { ease: 'power3.out' } });
    
    // Animar título y logo con efecto "inteligente"
    if (titleRef.current) {
      tl.from(titleRef.current, {
        opacity: 0, 
        y: -20, 
        duration: 0.7,
        clearProps: 'all'
      });
    }
    
    // Animar subtítulo con efecto adaptativo
    if (subtitleRef.current) {
      tl.from(subtitleRef.current, {
        opacity: 0, 
        filter: 'blur(8px)',
        duration: 0.8,
        clearProps: 'all'
      }, '-=0.4');
    }
    
    // Animar características con efecto de IA de reconocimiento de patrones
    if (featuresRef.current && featuresRef.current.children.length > 0) {
      aiPatternLearning(featuresRef.current, '*', {
        delay: 0.3
      });
    }
    
    // Animar formulario con efecto "inteligente" de reconocimiento
    if (formRef.current) {
      const formInputs = formRef.current.querySelectorAll('input');
      const formLabels = formRef.current.querySelectorAll('label');
      const formButtons = formRef.current.querySelectorAll('button');
      
      tl.from(formRef.current, {
        opacity: 0, 
        scale: 0.95, 
        duration: 0.5,
        clearProps: 'all'
      }, '-=0.2');
      
      // Simulación de análisis de campos - delay reducido para menor lag
      aiNeuralConnections(Array.from(formLabels), Array.from(formInputs), {
        delay: 0.2
      });
      
      // Simulación de respuesta de IA al formulario - delay reducido
      aiRecognitionResponse(formRef.current, Array.from(formButtons), {
        delay: 0.4
      });
    }
    
    return () => {
      tl.kill();
    };
  }, []);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña');
      return;
    }
    
    // Autenticación con API de Prisma
    try {
      setCargando(true);
      setError('');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        // Guardar usuario en localStorage para mantener la sesión
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        // Redirección basada en onboarding
        if (data.user.onboardingCompleted) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/onboarding';
        }
      } else {
        setError(data.message || 'Credenciales incorrectas. Por favor verifica tu correo y contraseña.');
      }
    } catch (err) {
      console.error('Error de autenticación:', err);
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Panel lateral - Solo visible en pantallas medianas y grandes */}
      <div className="relative hidden w-1/2 bg-[#01257D] md:block">
        <AnimatedBackground 
          className="opacity-40" 
          particleColor="rgba(255, 255, 255, 0.6)" 
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <div
            ref={titleRef}
            className="mb-8 flex flex-col items-center text-center"
          >
            {/* Logo ROL */}
            <div className="mb-6">
              <img 
                src="/reputacion-online-logo.png" 
                alt="ROL - Reputación Online" 
                className="h-20 w-auto"
              />
            </div>
          </div>
          
          <h2 
            ref={subtitleRef}
            className="text-center text-xl font-light leading-relaxed max-w-md"
          >
            Monitorea, analiza, gestiona y protege tu Reputación Online
          </h2>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-white text-opacity-70">
          2025 Reputación Online. Todos los derechos reservados.
        </div>
      </div>
      
      {/* Formulario de inicio de sesión */}
      <div className="flex w-full items-center justify-center px-4 md:w-1/2 md:px-0">
        <div 
          ref={formRef}
          className="w-full max-w-md space-y-8 p-8"
        >
          {/* Logo solo visible en móviles */}
          <div className="text-center md:hidden">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#01257D]">
              <div className="h-8 w-8 rounded-full bg-white"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reputación Online</h1>
            <p className="text-gray-500 dark:text-gray-400">Gestiona tu presencia digital</p>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Iniciar Sesión</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Accede a tu cuenta para gestionar tu reputación online
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Correo electrónico
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
                    className="block w-full rounded-md border-gray-300 py-3 pl-10 placeholder-gray-400 shadow-sm focus:border-[#01257D] focus:ring-[#01257D] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="usuario@empresa.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={mostrarPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-300 py-3 pl-10 pr-10 placeholder-gray-400 shadow-sm focus:border-[#01257D] focus:ring-[#01257D] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="••••••••"
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
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="recordarme"
                  name="recordarme"
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#01257D] focus:ring-[#01257D] dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="recordarme" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Recordarme
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-[#01257D] hover:text-[#013AAA] dark:text-[#01257D]">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={cargando}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#01257D] py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#013AAA] focus:outline-none focus:ring-2 focus:ring-[#01257D] focus:ring-offset-2 disabled:opacity-75 dark:bg-[#01257D] dark:hover:bg-[#013AAA]"
              >
                {cargando ? (
                  <span className="flex items-center">
                    <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="font-medium text-[#01257D] hover:text-[#013AAA] dark:text-[#01257D]">
                Regístrate
              </Link>
            </p>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                  O continúa con
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.09.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.918.678 1.85 0 1.338-.012 2.416-.012 2.744 0 .267.18.578.688.48C19.138 20.16 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
                <span>GitHub</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                </svg>
                <span>Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
