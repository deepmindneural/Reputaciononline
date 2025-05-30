import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos para transacciones y créditos
type TipoTransaccion = 'asignacion' | 'consumo' | 'compra' | 'expiracion';
type Canal = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'general';

export interface Transaccion {
  id: string;
  usuarioId: string;
  tipo: TipoTransaccion;
  cantidad: number;
  descripcion: string;
  canal?: Canal;
  fecha: Date;
  planId?: string;
}

export interface EstadoCreditos {
  disponibles: number;
  gastados: number;
  historial: Transaccion[];
  umbralAlerta: number;
  proximaExpiracion?: Date;
  planActual?: string;
}

interface CreditosContextType {
  creditos: EstadoCreditos;
  cargandoCreditos: boolean;
  error: string | null;
  cargarCreditosUsuario: (usuarioId: string) => Promise<void>;
  asignarCreditos: (usuarioId: string, cantidad: number, descripcion: string) => Promise<boolean>;
  consumirCreditos: (cantidad: number, descripcion: string, canal: Canal) => Promise<boolean>;
  comprarCreditos: (planId: string, cantidad: number, monto: number) => Promise<boolean>;
  verificarCreditosSuficientes: (cantidad: number) => boolean;
  actualizarUmbralAlerta: (umbral: number) => void;
}

const CreditosContext = createContext<CreditosContextType | null>(null);

export function useCreditosContext() {
  const context = useContext(CreditosContext);
  if (!context) {
    throw new Error('useCreditosContext debe usarse dentro de un CreditosProvider');
  }
  return context;
}

interface CreditosProviderProps {
  children: ReactNode;
}

export function CreditosProvider({ children }: CreditosProviderProps) {
  const [creditos, setCreditos] = useState<EstadoCreditos>({
    disponibles: 0,
    gastados: 0,
    historial: [],
    umbralAlerta: 20, // Porcentaje por defecto para alertas
  });
  const [cargandoCreditos, setCargandoCreditos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar créditos para un usuario específico
  const cargarCreditosUsuario = async (usuarioId: string) => {
    setCargandoCreditos(true);
    setError(null);
    try {
      // Aquí se realizaría la petición a la API para cargar los créditos del usuario
      // Por ahora, simularemos datos
      const mockHistorial: Transaccion[] = [
        {
          id: '1',
          usuarioId,
          tipo: 'asignacion',
          cantidad: 1000,
          descripcion: 'Plan inicial',
          fecha: new Date(2025, 4, 25),
          planId: 'plan-basico'
        },
        {
          id: '2',
          usuarioId,
          tipo: 'consumo',
          cantidad: 50,
          descripcion: 'Análisis de sentimiento',
          canal: 'twitter',
          fecha: new Date(2025, 4, 26)
        },
        {
          id: '3',
          usuarioId,
          tipo: 'consumo',
          cantidad: 30,
          descripcion: 'Monitoreo de menciones',
          canal: 'instagram',
          fecha: new Date(2025, 4, 27)
        },
        {
          id: '4',
          usuarioId,
          tipo: 'compra',
          cantidad: 500,
          descripcion: 'Recarga créditos',
          fecha: new Date(2025, 4, 28),
          planId: 'plan-recarga'
        }
      ];

      // Calcular disponibles y gastados basado en el historial
      const disponibles = mockHistorial.reduce((total, t) => {
        if (t.tipo === 'asignacion' || t.tipo === 'compra') {
          return total + t.cantidad;
        } else if (t.tipo === 'consumo' || t.tipo === 'expiracion') {
          return total - t.cantidad;
        }
        return total;
      }, 0);

      const gastados = mockHistorial
        .filter(t => t.tipo === 'consumo')
        .reduce((total, t) => total + t.cantidad, 0);

      setCreditos({
        disponibles,
        gastados,
        historial: mockHistorial,
        umbralAlerta: creditos.umbralAlerta,
        proximaExpiracion: new Date(2025, 8, 25), // 4 meses después
        planActual: 'Plan Básico'
      });
    } catch (e) {
      setError('Error al cargar los créditos');
      console.error(e);
    } finally {
      setCargandoCreditos(false);
    }
  };

  // Asignar créditos a un usuario (solo admin)
  const asignarCreditos = async (usuarioId: string, cantidad: number, descripcion: string): Promise<boolean> => {
    setCargandoCreditos(true);
    setError(null);
    try {
      // Simulando petición a API
      const nuevaTransaccion: Transaccion = {
        id: `asig-${Date.now()}`,
        usuarioId,
        tipo: 'asignacion',
        cantidad,
        descripcion,
        fecha: new Date()
      };

      setCreditos(prev => ({
        ...prev,
        disponibles: prev.disponibles + cantidad,
        historial: [nuevaTransaccion, ...prev.historial]
      }));

      return true;
    } catch (e) {
      setError('Error al asignar créditos');
      console.error(e);
      return false;
    } finally {
      setCargandoCreditos(false);
    }
  };

  // Consumir créditos al utilizar funcionalidades
  const consumirCreditos = async (cantidad: number, descripcion: string, canal: Canal): Promise<boolean> => {
    if (!verificarCreditosSuficientes(cantidad)) {
      setError('No hay suficientes créditos disponibles');
      return false;
    }

    setCargandoCreditos(true);
    setError(null);
    try {
      // Simulando petición a API
      const nuevaTransaccion: Transaccion = {
        id: `cons-${Date.now()}`,
        usuarioId: 'usuario-actual', // En un caso real, esto vendría del contexto de autenticación
        tipo: 'consumo',
        cantidad,
        descripcion,
        canal,
        fecha: new Date()
      };

      setCreditos(prev => ({
        ...prev,
        disponibles: prev.disponibles - cantidad,
        gastados: prev.gastados + cantidad,
        historial: [nuevaTransaccion, ...prev.historial]
      }));

      return true;
    } catch (e) {
      setError('Error al consumir créditos');
      console.error(e);
      return false;
    } finally {
      setCargandoCreditos(false);
    }
  };

  // Comprar créditos adicionales
  const comprarCreditos = async (planId: string, cantidad: number, monto: number): Promise<boolean> => {
    setCargandoCreditos(true);
    setError(null);
    try {
      // Simulando petición a API y proceso de pago
      const nuevaTransaccion: Transaccion = {
        id: `comp-${Date.now()}`,
        usuarioId: 'usuario-actual', // En un caso real, esto vendría del contexto de autenticación
        tipo: 'compra',
        cantidad,
        descripcion: `Compra de ${cantidad} créditos - $${monto.toLocaleString('es-CO')}`,
        fecha: new Date(),
        planId
      };

      setCreditos(prev => ({
        ...prev,
        disponibles: prev.disponibles + cantidad,
        historial: [nuevaTransaccion, ...prev.historial]
      }));

      return true;
    } catch (e) {
      setError('Error al procesar la compra de créditos');
      console.error(e);
      return false;
    } finally {
      setCargandoCreditos(false);
    }
  };

  // Verificar si hay suficientes créditos para una operación
  const verificarCreditosSuficientes = (cantidad: number): boolean => {
    return creditos.disponibles >= cantidad;
  };

  // Actualizar el umbral de alerta para notificaciones
  const actualizarUmbralAlerta = (umbral: number) => {
    setCreditos(prev => ({
      ...prev,
      umbralAlerta: umbral
    }));
  };

  // Efecto para verificar si los créditos están bajo el umbral y mostrar alerta
  useEffect(() => {
    if (creditos.disponibles > 0) {
      const porcentajeDisponible = (creditos.disponibles / (creditos.disponibles + creditos.gastados)) * 100;
      if (porcentajeDisponible <= creditos.umbralAlerta) {
        // Aquí se podría mostrar una notificación al usuario
        console.warn(`¡Alerta! Créditos por debajo del ${creditos.umbralAlerta}%`);
      }
    }
  }, [creditos.disponibles, creditos.gastados, creditos.umbralAlerta]);

  const value = {
    creditos,
    cargandoCreditos,
    error,
    cargarCreditosUsuario,
    asignarCreditos,
    consumirCreditos,
    comprarCreditos,
    verificarCreditosSuficientes,
    actualizarUmbralAlerta
  };

  return <CreditosContext.Provider value={value}>{children}</CreditosContext.Provider>;
}
