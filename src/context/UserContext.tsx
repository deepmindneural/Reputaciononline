"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { gsap } from 'gsap';

// Tipado para redes sociales
interface SocialMedia {
  platform: 'x' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok';
  username: string;
  followers: number;
  connected: boolean;
  profileUrl: string;
}

// Tipado para menciones
interface Mention {
  id: string;
  source: 'x' | 'facebook' | 'instagram' | 'linkedin' | 'news' | 'blogs';
  author: string;
  content: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  engagement: number;
  url: string;
}

// Tipado para datos de reputación
interface ReputationData {
  score: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
  positiveMentions: number;
  neutralMentions: number;
  negativeMentions: number;
  totalMentions: number;
  recentMentions: Mention[];
}

// Tipado para usuario completo
export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;  // Agregado campo company
  profileType?: 'personal' | 'political' | 'business';
  avatarUrl: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  credits: number;
  isPro?: boolean;
  settings?: {
    darkMode: boolean;
    notifications: boolean;
    [key: string]: any;
  };
  nextBillingDate?: string;
  socialMedia?: SocialMedia[];
  reputation?: ReputationData;
}

// Valor por defecto para el contexto
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  updateUser: (updates: Partial<User>) => void;
  toggleSocialMediaConnection: (platform: SocialMedia['platform'], connected: boolean) => void;
  addCredits: (amount: number) => void;
  logout: () => void;
}

// Crear el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Función para obtener usuario desde localStorage
const getUserFromLocalStorage = (): User | null => {
  if (typeof window === 'undefined') return null; // Server-side rendering check
  
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    return null;
  }
};

// Inicializa la base de datos si estamos en el cliente
const initializeDBIfNeeded = async () => {
  if (typeof window !== 'undefined') {
    try {
      // Importar de forma dinámica para evitar problemas con SSR
      const { initializeDatabase } = await import('../services/dbService');
      initializeDatabase();
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
};

// Proveedor del Contexto
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar DB y cargar usuario desde localStorage al inicio
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Inicializar base de datos (precarga usuarios predefinidos)
        await initializeDBIfNeeded();
        
        // Intentar cargar usuario de localStorage primero (más rápido)
        const savedUser = getUserFromLocalStorage();
        
        if (savedUser) {
          console.log('Usuario cargado desde localStorage:', savedUser.name);
          setUser(savedUser);
        } else {
          // Si estamos en desarrollo, usar usuario demo para desarrollo
          if (process.env.NODE_ENV === 'development') {
            try {
              // Importar el servicio de DB bajo demanda
              const { getUserByEmail } = await import('@/services/dbService');
              const demoUser = await getUserByEmail('elmer.zapata@example.com');
              
              if (demoUser) {
                console.log('Usuario demo cargado para desarrollo:', demoUser.name);
                setUser(demoUser);
                // Guardar en localStorage para persistencia
                localStorage.setItem('currentUser', JSON.stringify(demoUser));
              }
            } catch (e) {
              console.error('Error cargando usuario demo:', e);
            }
          }
          
          // Si seguimos sin usuario y estamos en una ruta protegida, redirigir
          if (!savedUser && typeof window !== 'undefined' && 
              window.location.pathname.startsWith('/dashboard')) {
            window.location.href = '/login';
            return;
          }
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Error al cargar datos de usuario');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
    
    // Suscribirse a eventos de almacenamiento para sincronizar entre pestañas
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentUser') {
        if (event.newValue) {
          try {
            const updatedUser = JSON.parse(event.newValue);
            setUser(updatedUser);
          } catch (e) {
            console.error('Error parsing user from storage event:', e);
          }
        } else {
          // Usuario eliminado
          setUser(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Actualizar usuario
  const updateUser = (updates: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const updatedUser = { ...prevUser, ...updates };
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      
      return updatedUser;
    });
  };

  // Manejar conexión/desconexión de redes sociales
  const toggleSocialMediaConnection = (platform: SocialMedia['platform'], connected: boolean) => {
    setUser(prev => {
      if (!prev) return null;
      
      // Verificar que socialMedia existe antes de manipularlo
      const currentSocialMedia = prev.socialMedia || [];
      
      const updatedSocialMedia = currentSocialMedia.map((sm) =>
        sm.platform === platform ? { ...sm, connected } : sm
      );

      return { ...prev, socialMedia: updatedSocialMedia };
    });

    // Simular notificación o feedback visual
    if (connected) {
      // Mostrar notificación de éxito
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 notification-toast';
      notification.innerHTML = `<div class="flex"><div class="py-1"><svg class="h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div><div><p class="font-bold">Conexión exitosa</p><p>Conectado a ${platform} correctamente.</p></div></div>`;
      document.body.appendChild(notification);

      // Animar entrada y salida
      gsap.fromTo(notification, 
        { x: 50, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.5,
          onComplete: () => {
            setTimeout(() => {
              gsap.to(notification, { 
                x: 50, 
                opacity: 0, 
                duration: 0.5,
                onComplete: () => notification.remove() 
              });
            }, 3000);
          }
        }
      );
    }
  };

  // Función para añadir créditos
  const addCredits = (amount: number) => {
    setUser(prev => {
      if (!prev) return null;
      
      // Animar contador de créditos si hay un elemento con ID "credit-counter"
      const creditCounter = document.getElementById('credit-counter');
      if (creditCounter) {
        const originalValue = prev.credits;
        const finalValue = originalValue + amount;
        
        // Crear animación de contador
        let start = originalValue;
        const duration = 1.5;
        const interval = 30;
        const totalSteps = duration * 1000 / interval;
        const step = (finalValue - originalValue) / totalSteps;
        
        const updateCounter = () => {
          start += step;
          creditCounter.textContent = Math.round(start).toLocaleString();
          
          if ((step > 0 && start >= finalValue) || (step < 0 && start <= finalValue)) {
            creditCounter.textContent = finalValue.toLocaleString();
            clearInterval(animation);
          }
        };
        
        const animation = setInterval(updateCounter, interval);
      }
      
      return { ...prev, credits: prev.credits + amount };
    });
  };

  // Función para cerrar sesión
  const logout = () => {
    // Limpiar información de usuario
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      // Redirigir al login
      window.location.href = '/login';
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        updateUser,
        toggleSocialMediaConnection,
        addCredits,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
};
