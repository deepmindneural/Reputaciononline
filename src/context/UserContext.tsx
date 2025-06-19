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
  company?: string;
  phone?: string;
  telefono?: string; 
  empresa?: string; 
  bio?: string;
  profileType?: 'personal' | 'political' | 'business';
  category?: string;
  profileCategory?: string; 
  brandName?: string;
  otherCategory?: string;
  additionalSources?: string[];
  partidoPolitico?: string;
  cargoActual?: string;
  propuestasPrincipales?: string;
  avatarUrl: string;
  avatar?: string; 
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  credits: number;
  isPro?: boolean;
  onboardingCompleted?: boolean;
  settings?: {
    darkMode: boolean;
    notifications: boolean;
    [key: string]: any;
  };
  darkMode: boolean;
  notifications: boolean;
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
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    return null;
  }
};

// Proveedor del Contexto
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Todos los hooks SIEMPRE se llaman en el mismo orden
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuario desde localStorage y verificar sesión con cookies
  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Primero intentar verificar sesión con cookies
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user && isMounted) {
            setUser(data.user);
            // Sincronizar con localStorage
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            return;
          }
        }

        // Si falla la verificación por cookies, intentar con localStorage como fallback
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser) as User;
            if (isMounted) {
              setUser(userData);
            }
          } catch (e) {
            console.error('Error parsing stored user:', e);
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        
        // Fallback a localStorage si hay error de red
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser) as User;
            if (isMounted) {
              setUser(userData);
            }
          } catch (e) {
            console.error('Error parsing stored user:', e);
            localStorage.removeItem('currentUser');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, []); // Solo se ejecuta una vez

  // Segundo useEffect para eventos de storage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentUser' && event.newValue) {
        try {
          const updatedUser = JSON.parse(event.newValue) as User;
          setUser(updatedUser);
        } catch (e) {
          console.error('Error parsing updated user from storage:', e);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  // Actualizar usuario
  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      // Actualizar en la base de datos vía API
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Incluir cookies automáticamente
        body: JSON.stringify({
          userId: user.id,
          ...updates
        })
      });

      if (!response.ok) {
        throw new Error('Error updating user profile');
      }

      const result = await response.json();
      
      // Si la respuesta es exitosa, actualizar el estado local
      if (result.success && result.user) {
        setUser(prevUser => {
          if (!prevUser) return null;
          
          const updatedUser = { ...prevUser, ...result.user };
          
          // Guardar en localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
          
          return updatedUser;
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      // Si falla la API, al menos actualizar localmente
      setUser(prevUser => {
        if (!prevUser) return null;
        
        const updatedUser = { ...prevUser, ...updates };
        
        // Guardar en localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        
        return updatedUser;
      });
    }
  };

  // Manejar conexión/desconexión de redes sociales
  const toggleSocialMediaConnection = (platform: SocialMedia['platform'], connected: boolean) => {
    setUser(prev => {
      if (!prev) return null;
      
      const currentSocialMedia = prev.socialMedia || [];
      const updatedSocialMedia = currentSocialMedia.map((sm) =>
        sm.platform === platform ? { ...sm, connected } : sm
      );

      const updatedUser = { ...prev, socialMedia: updatedSocialMedia };
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      return updatedUser;
    });

    // Mostrar notificación si se conectó
    if (connected && typeof window !== 'undefined') {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50';
      notification.innerHTML = `
        <div class="flex">
          <div class="py-1">
            <svg class="h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <p class="font-bold">Conexión exitosa</p>
            <p>Conectado a ${platform} correctamente.</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);

      // Remover notificación después de 3 segundos
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
  };

  // Función para añadir créditos
  const addCredits = (amount: number) => {
    setUser(prev => {
      if (!prev) return null;
      
      const updatedUser = { ...prev, credits: prev.credits + amount };
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      // Animar contador si existe
      const creditCounter = document.getElementById('credit-counter');
      if (creditCounter) {
        const finalValue = updatedUser.credits;
        creditCounter.textContent = finalValue.toLocaleString();
      }
      
      return updatedUser;
    });
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setError(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
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
