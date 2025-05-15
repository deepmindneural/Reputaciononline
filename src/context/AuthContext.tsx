"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (nombre: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

axios.defaults.baseURL = 'http://localhost:4000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Cargar datos guardados en localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { token: jwt, user } = res.data;
      setToken(jwt);
      setUser(user);
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  };

  // Función para registrar usuario
  const register = async (nombre: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('Enviando registro a:', axios.defaults.baseURL);
      console.log('Datos:', { nombre, email, password: '***' });
      
      const res = await axios.post('/auth/registro', { nombre, email, password });
      console.log('Respuesta del servidor:', res.data);
      
      const { token: jwt, user } = res.data;
      setToken(jwt);
      setUser(user);
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
      return true;
    } catch (error: any) {
      console.error('Error al registrar:', error);
      console.error('Detalles del error:', error.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
