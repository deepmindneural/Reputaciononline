"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditosProvider } from '@/context/CreditosContext';
import { UserProvider } from '@/context/UserContext';
import { Home, CreditCard, BarChart3, Settings, Bell, Search, Menu, X, Share2, ChevronLeft, ChevronRight, Hash, Users } from 'lucide-react';
import ChatSofia from '@/components/chat/ChatSofia';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import UserProfile from '@/components/user/UserProfile';
import { gsap } from 'gsap';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setMenuOpen(false);
      } else {
        setMenuOpen(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Animar apertura/cierre del menú
  useEffect(() => {
    if (isMobile) {
      if (menuOpen) {
        gsap.to('.sidebar', {
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to('.sidebar', {
          x: '-100%',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    } else {
      if (menuOpen) {
        gsap.to('.sidebar', {
          width: '16rem',
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to('.main-content', {
          paddingLeft: '16rem',
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to('.sidebar', {
          width: '5rem',
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to('.main-content', {
          paddingLeft: '5rem',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  }, [menuOpen, isMobile]);

  // Cerrar menú al navegar en móvil
  useEffect(() => {
    if (isMobile) {
      setMenuOpen(false);
    }
  }, [pathname, isMobile]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <UserProvider>
      <CreditosProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Overlay para cerrar el menú en móvil */}
          {isMobile && menuOpen && (
            <div 
              className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 transition-opacity" 
              onClick={() => setMenuOpen(false)}
            />
          )}

          {/* Barra lateral de navegación */}
          <aside 
            className={`sidebar fixed inset-y-0 left-0 z-50 flex flex-col bg-white shadow-lg transition-all duration-300 dark:bg-gray-800 ${isMobile ? 'w-64' : menuOpen ? 'w-64' : 'w-20'}`}
            style={isMobile && !menuOpen ? { transform: 'translateX(-100%)' } : {}}
          >
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
              <Link href="/dashboard" className="flex items-center overflow-hidden">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex-shrink-0"></div>
                {(menuOpen || isMobile) && (
                  <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white truncate">Reputación Online</span>
                )}
              </Link>
              {!isMobile && (
                <button 
                  onClick={toggleMenu} 
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  {menuOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
              )}
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto">
              <nav className="flex-1 space-y-1 px-2 py-4">
                <Link href="/dashboard" className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${pathname === '/dashboard' ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'}`}>
                  <Home className={`${menuOpen || isMobile ? 'mr-3' : 'mx-auto'} h-5 w-5 ${pathname === '/dashboard' ? 'text-primary-600 dark:text-white' : 'text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-white'}`} />
                  {(menuOpen || isMobile) && 'Dashboard'}
                </Link>

                <Link href="/dashboard/creditos" className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${pathname === '/dashboard/creditos' ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'}`}>
                  <CreditCard className={`${menuOpen || isMobile ? 'mr-3' : 'mx-auto'} h-5 w-5 ${pathname === '/dashboard/creditos' ? 'text-primary-600 dark:text-white' : 'text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-white'}`} />
                  {(menuOpen || isMobile) && 'Créditos'}
                </Link>

                <Link href="/dashboard/analisis" className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${pathname === '/dashboard/analisis' ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'}`}>
                  <BarChart3 className={`${menuOpen || isMobile ? 'mr-3' : 'mx-auto'} h-5 w-5 ${pathname === '/dashboard/analisis' ? 'text-primary-600 dark:text-white' : 'text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-white'}`} />
                  {(menuOpen || isMobile) && 'Análisis'}
                </Link>

                <Link href="/dashboard/redes-sociales" className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${pathname === '/dashboard/redes-sociales' ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'}`}>
                  <Share2 className={`${menuOpen || isMobile ? 'mr-3' : 'mx-auto'} h-5 w-5 ${pathname === '/dashboard/redes-sociales' ? 'text-primary-600 dark:text-white' : 'text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-white'}`} />
                  {(menuOpen || isMobile) && 'Redes Sociales'}
                </Link>

                <Link href="/dashboard/hashtags" className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${pathname === '/dashboard/hashtags' ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'}`}>
                  <Hash className={`${menuOpen || isMobile ? 'mr-3' : 'mx-auto'} h-5 w-5 ${pathname === '/dashboard/hashtags' ? 'text-primary-600 dark:text-white' : 'text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-white'}`} />
                  {(menuOpen || isMobile) && 'Hashtags'}
                </Link>

                <Link href="/dashboard/audiencia" className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${pathname === '/dashboard/audiencia' ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'}`}>
                  <Users className={`${menuOpen || isMobile ? 'mr-3' : 'mx-auto'} h-5 w-5 ${pathname === '/dashboard/audiencia' ? 'text-primary-600 dark:text-white' : 'text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-white'}`} />
                  {(menuOpen || isMobile) && 'Análisis de Audiencia'}
                </Link>

                <Link href="/dashboard/configuracion" className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${pathname === '/dashboard/configuracion' ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'}`}>
                  <Settings className={`${menuOpen || isMobile ? 'mr-3' : 'mx-auto'} h-5 w-5 ${pathname === '/dashboard/configuracion' ? 'text-primary-600 dark:text-white' : 'text-gray-400 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-white'}`} />
                  {(menuOpen || isMobile) && 'Configuración'}
                </Link>
              </nav>
            </div>
          </aside>

          {/* Contenido principal */}
          <div className="main-content flex flex-1 flex-col transition-all duration-300" style={{ paddingLeft: isMobile ? '0' : menuOpen ? '16rem' : '5rem' }}>
            {/* Barra superior */}
            <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow dark:bg-gray-800">
              <div className="flex flex-1 justify-between px-4">
                <div className="flex flex-1 items-center">
                  {/* Botón toggle menu para móvil */}
                  <button
                    className="mr-4 rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:hidden"
                    onClick={toggleMenu}
                  >
                    <span className="sr-only">Abrir menú</span>
                    <Menu className="h-5 w-5" />
                  </button>
                  
                  <div className="max-w-lg flex-1 md:ml-0">
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-primary-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                        placeholder="Buscar..."
                        type="search"
                      />
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex items-center justify-end space-x-4">
                  {/* Centro de notificaciones */}
                  <NotificationCenter />
                  
                  {/* Perfil del usuario */}
                  <UserProfile />
                </div>
              </div>
            </header>

            {/* Contenido principal */}
            <main className="flex-1">
              <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                  {children}
                </div>
              </div>
            </main>
          </div>
          {/* Chat con Sofia (IA de la plataforma) */}
          <ChatSofia />
        </div>
      </CreditosProvider>
    </UserProvider>
  );
}
