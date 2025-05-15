"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definir interfaces para la tipología de datos
interface Usuario {
  id: string;
  nombre: string;
  email: string;
  plan: string;
  creditosDisponibles: number;
  creditosGastados: number;
  ultimaActividad: string;
  estado: 'activo' | 'advertencia' | 'sin_creditos';
}

interface TransaccionCredito {
  id: string;
  fecha: string;
  descripcion: string;
  tipo: 'consumo' | 'recarga';
  cantidad: number;
  canal?: 'X' | 'Facebook' | 'Instagram' | 'LinkedIn' | 'TikTok' | 'Búsqueda';
  usuarioId: string;
}

interface PlanCredito {
  id: string;
  nombre: string;
  creditos: number;
  precio: number;
  caracteristicas: string[];
  destacado?: boolean;
}

interface CreditosContextType {
  // Estado
  creditos: {
    disponibles: number;
    gastados: number;
    ultimaRecarga: string;
    plan: string;
  };
  historialTransacciones: TransaccionCredito[];
  planesDisponibles: PlanCredito[];
  usuarios: Usuario[];
  usuarioActual: Usuario | null;
  
  // Métodos
  cargarCreditosUsuario: (usuarioId: string) => void;
  asignarCreditos: (usuarioId: string, cantidad: number, motivo?: string) => Promise<boolean>;
  consumirCreditos: (cantidad: number, descripcion: string, canal?: TransaccionCredito['canal']) => Promise<boolean>;
  comprarCreditos: (planId: string) => Promise<boolean>;
  verificarCreditosSuficientes: (cantidad: number) => boolean;
}

// Crear el contexto
const CreditosContext = createContext<CreditosContextType | undefined>(undefined);

// Datos iniciales para demo
const usuariosDemo: Usuario[] = [
  { 
    id: '1', 
    nombre: 'Carlos Rodríguez', 
    email: 'carlos@empresa.co', 
    plan: 'Empresarial',
    creditosDisponibles: 42500,
    creditosGastados: 7500,
    ultimaActividad: '16/04/2025',
    estado: 'activo'
  },
  { 
    id: '2', 
    nombre: 'María López', 
    email: 'maria@consultora.co', 
    plan: 'Profesional',
    creditosDisponibles: 8700,
    creditosGastados: 6300,
    ultimaActividad: '15/04/2025',
    estado: 'activo'
  },
  { 
    id: '3', 
    nombre: 'Juan Pérez', 
    email: 'juan@startup.co', 
    plan: 'Básico',
    creditosDisponibles: 200,
    creditosGastados: 4800,
    ultimaActividad: '10/04/2025',
    estado: 'advertencia'
  },
  { 
    id: '4', 
    nombre: 'Ana Gómez', 
    email: 'ana@agencia.co', 
    plan: 'Empresarial',
    creditosDisponibles: 25000,
    creditosGastados: 25000,
    ultimaActividad: '16/04/2025',
    estado: 'activo'
  },
  { 
    id: '5', 
    nombre: 'Roberto Jiménez', 
    email: 'roberto@compania.co', 
    plan: 'Profesional',
    creditosDisponibles: 0,
    creditosGastados: 15000,
    ultimaActividad: '05/04/2025',
    estado: 'sin_creditos'
  },
];

const transaccionesDemo: TransaccionCredito[] = [
  {
    id: '1',
    fecha: '16/04/2025 16:32',
    descripcion: 'Análisis de sentimientos Instagram',
    tipo: 'consumo',
    cantidad: 250,
    canal: 'Instagram',
    usuarioId: '1'
  },
  {
    id: '2',
    fecha: '15/04/2025 10:20',
    descripcion: 'Monitoreo de menciones en X',
    tipo: 'consumo',
    cantidad: 500,
    canal: 'X',
    usuarioId: '1'
  },
  {
    id: '3',
    fecha: '14/04/2025 14:45',
    descripcion: 'Búsqueda de hashtags en tendencia',
    tipo: 'consumo',
    cantidad: 100,
    canal: 'Búsqueda',
    usuarioId: '1'
  },
  {
    id: '4',
    fecha: '12/04/2025 09:15',
    descripcion: 'Compra de paquete de créditos',
    tipo: 'recarga',
    cantidad: 10000,
    usuarioId: '1'
  },
  {
    id: '5',
    fecha: '10/04/2025 18:05',
    descripcion: 'Análisis de audiencia TikTok',
    tipo: 'consumo',
    cantidad: 300,
    canal: 'TikTok',
    usuarioId: '1'
  },
];

const planesDisponiblesDemo: PlanCredito[] = [
  {
    id: 'basico',
    nombre: 'Básico',
    creditos: 5000,
    precio: 299000, // en pesos colombianos
    caracteristicas: [
      'Monitoreo de 3 redes sociales',
      'Hasta 10 palabras clave',
      'Reportes semanales',
    ],
  },
  {
    id: 'profesional',
    nombre: 'Profesional',
    creditos: 15000,
    precio: 699000,
    caracteristicas: [
      'Monitoreo de todas las redes sociales',
      'Hasta 30 palabras clave',
      'Reportes diarios',
      'Análisis de sentimientos',
    ],
    destacado: true,
  },
  {
    id: 'empresarial',
    nombre: 'Empresarial',
    creditos: 50000,
    precio: 1499000,
    caracteristicas: [
      'Monitoreo ilimitado de redes',
      'Palabras clave ilimitadas',
      'Reportes personalizados',
      'Análisis avanzado con IA',
      'Soporte prioritario',
    ],
  },
];

// Proveedor del contexto
export const CreditosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Para la demo, se usa un ID fijo. En producción, sería el ID del usuario autenticado
  const usuarioIdDemo = '1';
  
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosDemo);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [historialTransacciones, setHistorialTransacciones] = useState<TransaccionCredito[]>([]);
  const [creditos, setCreditos] = useState({
    disponibles: 0,
    gastados: 0,
    ultimaRecarga: '',
    plan: '',
  });

  // Cargar créditos del usuario
  const cargarCreditosUsuario = (usuarioId: string) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (usuario) {
      setUsuarioActual(usuario);
      setCreditos({
        disponibles: usuario.creditosDisponibles,
        gastados: usuario.creditosGastados,
        ultimaRecarga: obtenerUltimaRecarga(usuarioId),
        plan: usuario.plan,
      });
      setHistorialTransacciones(transaccionesDemo.filter(t => t.usuarioId === usuarioId));
    }
  };

  // Obtener la fecha de la última recarga
  const obtenerUltimaRecarga = (usuarioId: string) => {
    const recargas = transaccionesDemo.filter(t => t.usuarioId === usuarioId && t.tipo === 'recarga');
    if (recargas.length > 0) {
      recargas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      return recargas[0].fecha.split(' ')[0]; // Solo tomar la fecha, no la hora
    }
    return 'No disponible';
  };

  // Asignar créditos (para administradores)
  const asignarCreditos = async (usuarioId: string, cantidad: number, motivo?: string): Promise<boolean> => {
    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Actualizar el estado local
      const nuevaTransaccion: TransaccionCredito = {
        id: Date.now().toString(),
        fecha: new Date().toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        descripcion: motivo || 'Asignación de créditos',
        tipo: 'recarga',
        cantidad,
        usuarioId,
      };
      
      // Actualizar usuarios
      setUsuarios(prevUsuarios => {
        return prevUsuarios.map(u => {
          if (u.id === usuarioId) {
            const nuevosCreditosDisponibles = u.creditosDisponibles + cantidad;
            const nuevoEstado = nuevosCreditosDisponibles === 0 
              ? 'sin_creditos' 
              : nuevosCreditosDisponibles < 1000 
                ? 'advertencia' 
                : 'activo';
            
            return {
              ...u,
              creditosDisponibles: nuevosCreditosDisponibles,
              estado: nuevoEstado,
              ultimaActividad: nuevaTransaccion.fecha.split(' ')[0],
            };
          }
          return u;
        });
      });
      
      // Si el usuario actual es el que recibe los créditos, actualizar su estado
      if (usuarioActual && usuarioActual.id === usuarioId) {
        setCreditos(prev => ({
          ...prev,
          disponibles: prev.disponibles + cantidad,
          ultimaRecarga: nuevaTransaccion.fecha.split(' ')[0],
        }));
        setHistorialTransacciones(prev => [nuevaTransaccion, ...prev]);
      }
      
      return true;
    } catch (error) {
      console.error('Error al asignar créditos:', error);
      return false;
    }
  };

  // Consumir créditos
  const consumirCreditos = async (cantidad: number, descripcion: string, canal?: TransaccionCredito['canal']): Promise<boolean> => {
    if (!usuarioActual) return false;
    if (usuarioActual.creditosDisponibles < cantidad) return false;
    
    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Crear la nueva transacción
      const nuevaTransaccion: TransaccionCredito = {
        id: Date.now().toString(),
        fecha: new Date().toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        descripcion,
        tipo: 'consumo',
        cantidad,
        canal,
        usuarioId: usuarioActual.id,
      };
      
      // Actualizar usuarios
      setUsuarios(prevUsuarios => {
        return prevUsuarios.map(u => {
          if (u.id === usuarioActual.id) {
            const nuevosCreditosDisponibles = u.creditosDisponibles - cantidad;
            const nuevoEstado = nuevosCreditosDisponibles === 0 
              ? 'sin_creditos' 
              : nuevosCreditosDisponibles < 1000 
                ? 'advertencia' 
                : 'activo';
            
            return {
              ...u,
              creditosDisponibles: nuevosCreditosDisponibles,
              creditosGastados: u.creditosGastados + cantidad,
              estado: nuevoEstado,
              ultimaActividad: nuevaTransaccion.fecha.split(' ')[0],
            };
          }
          return u;
        });
      });
      
      // Actualizar estado local del usuario actual
      setCreditos(prev => ({
        ...prev,
        disponibles: prev.disponibles - cantidad,
        gastados: prev.gastados + cantidad,
      }));
      
      // Actualizar historial de transacciones
      setHistorialTransacciones(prev => [nuevaTransaccion, ...prev]);
      
      return true;
    } catch (error) {
      console.error('Error al consumir créditos:', error);
      return false;
    }
  };

  // Comprar créditos
  const comprarCreditos = async (planId: string): Promise<boolean> => {
    try {
      const planSeleccionado = planesDisponiblesDemo.find(p => p.id === planId);
      if (!planSeleccionado || !usuarioActual) return false;
      
      // Simular una llamada a la API de pago
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar el usuario
      return await asignarCreditos(
        usuarioActual.id, 
        planSeleccionado.creditos, 
        `Compra de plan ${planSeleccionado.nombre}`
      );
    } catch (error) {
      console.error('Error al comprar créditos:', error);
      return false;
    }
  };

  // Verificar si el usuario tiene suficientes créditos
  const verificarCreditosSuficientes = (cantidad: number): boolean => {
    if (!usuarioActual) return false;
    return usuarioActual.creditosDisponibles >= cantidad;
  };

  // Cargar créditos del usuario actual al iniciar
  useEffect(() => {
    cargarCreditosUsuario(usuarioIdDemo);
  }, []);

  // El valor que se proveerá a través del contexto
  const value = {
    creditos,
    historialTransacciones,
    planesDisponibles: planesDisponiblesDemo,
    usuarios,
    usuarioActual,
    cargarCreditosUsuario,
    asignarCreditos,
    consumirCreditos,
    comprarCreditos,
    verificarCreditosSuficientes,
  };

  return (
    <CreditosContext.Provider value={value}>
      {children}
    </CreditosContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useCreditos = (): CreditosContextType => {
  const context = useContext(CreditosContext);
  if (context === undefined) {
    throw new Error('useCreditos debe ser usado dentro de un CreditosProvider');
  }
  return context;
};
