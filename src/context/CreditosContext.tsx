"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';

export interface HistorialTransaccion {
  id: string;
  fecha: string;
  monto: number;
  descripcion: string;
  tipo: 'ingreso' | 'egreso';
  canal?: string;
}

interface CreditosContextType {
  saldo: number;
  historial: HistorialTransaccion[];
  comprarCreditos: (monto: number) => void;
  usarCreditos: (monto: number, descripcion: string) => void;
  isLoading: boolean;
  // Propiedades adicionales necesarias para componentes
  disponibles: number;
  gastados: number;
  umbralAlerta: number;
  totalAsignado: number;
}

const CreditosContext = createContext<CreditosContextType | undefined>(undefined);

export const CreditosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [saldo, setSaldo] = useState<number>(2500);
  const [historial, setHistorial] = useState<HistorialTransaccion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Estados adicionales necesarios para componentes existentes
  const [gastados, setGastados] = useState<number>(250); // Valor inicial para demo

  // Simulación de carga de datos inicial
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Datos simulados para el usuario
        const historialInicial: HistorialTransaccion[] = [
          {
            id: 'tx-001',
            fecha: '2025-06-03T15:30:00',
            monto: 500,
            descripcion: 'Compra de créditos',
            tipo: 'ingreso',
            canal: 'general'
          },
          {
            id: 'tx-002',
            fecha: '2025-06-01T10:12:00',
            monto: 250,
            descripcion: 'Uso en campaña de X',
            tipo: 'egreso',
            canal: 'x'
          },
          {
            id: 'tx-003',
            fecha: '2025-05-28T14:45:00',
            monto: 1000,
            descripcion: 'Créditos de bienvenida',
            tipo: 'ingreso',
            canal: 'general'
          },
          {
            id: 'tx-004',
            fecha: '2025-05-25T09:30:00',
            monto: 1500,
            descripcion: 'Compra de créditos',
            tipo: 'ingreso',
            canal: 'general'
          },
          {
            id: 'tx-005',
            fecha: '2025-05-20T11:15:00',
            monto: 150,
            descripcion: 'Análisis de reputación en Facebook',
            tipo: 'egreso',
            canal: 'facebook'
          },
          {
            id: 'tx-006',
            fecha: '2025-05-15T16:30:00',
            monto: 100,
            descripcion: 'Monitoreo avanzado de Instagram',
            tipo: 'egreso',
            canal: 'instagram'
          },
          {
            id: 'tx-007',
            fecha: '2025-05-10T13:20:00',
            monto: 75,
            descripcion: 'Análisis de LinkedIn',
            tipo: 'egreso',
            canal: 'linkedin'
          },
          {
            id: 'tx-008',
            fecha: '2025-05-05T08:45:00',
            monto: 50,
            descripcion: 'Monitoreo de TikTok',
            tipo: 'egreso',
            canal: 'tiktok'
          }
        ];
        
        // Calcular el saldo actual basado en el historial
        const saldoCalculado = historialInicial.reduce((acc, tx) => {
          return tx.tipo === 'ingreso' ? acc + tx.monto : acc - tx.monto;
        }, 0);
        
        setSaldo(saldoCalculado);
        setHistorial(historialInicial);
        setGastados(historialInicial
          .filter(tx => tx.tipo === 'egreso')
          .reduce((sum, tx) => sum + tx.monto, 0));
        setIsLoading(false);
      } catch (error) {
        console.error("Error cargando datos de créditos:", error);
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const comprarCreditos = (monto: number) => {
    if (monto <= 0) return;
    
    const nuevaTransaccion: HistorialTransaccion = {
      id: `tx-${Date.now()}`,
      fecha: new Date().toISOString(),
      monto,
      descripcion: 'Compra de créditos',
      tipo: 'ingreso'
    };
    
    // Actualizar saldo con animación
    const elementoSaldo = document.getElementById('saldo-creditos');
    if (elementoSaldo) {
      const saldoOriginal = saldo;
      const saldoNuevo = saldo + monto;
      
      gsap.to({}, {
        duration: 1,
        onUpdate: function() {
          const progress = this.progress();
          const valorActual = saldoOriginal + Math.round(progress * monto);
          elementoSaldo.textContent = valorActual.toLocaleString();
        },
        onComplete: function() {
          elementoSaldo.textContent = saldoNuevo.toLocaleString();
        }
      });
    }
    
    setSaldo(prevSaldo => prevSaldo + monto);
    setHistorial(prevHistorial => [nuevaTransaccion, ...prevHistorial]);
    
    // Mostrar notificación visual
    const notificacion = document.createElement('div');
    notificacion.className = 'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50';
    notificacion.innerHTML = `
      <div class="flex">
        <div class="py-1">
          <svg class="h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div>
          <p class="font-bold">Créditos añadidos</p>
          <p>Se han añadido ${monto} créditos a tu cuenta.</p>
        </div>
      </div>
    `;
    document.body.appendChild(notificacion);
    
    gsap.fromTo(notificacion, 
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
    
    setTimeout(() => {
      gsap.to(notificacion, {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          notificacion.remove();
        }
      });
    }, 3000);
  };

  const usarCreditos = (monto: number, descripcion: string) => {
    if (monto <= 0 || monto > saldo) return;
    
    const nuevaTransaccion: HistorialTransaccion = {
      id: `tx-${Date.now()}`,
      fecha: new Date().toISOString(),
      monto,
      descripcion,
      tipo: 'egreso'
    };
    
    // Actualizar saldo con animación
    const elementoSaldo = document.getElementById('saldo-creditos');
    if (elementoSaldo) {
      const saldoOriginal = saldo;
      const saldoNuevo = saldo - monto;
      
      gsap.to({}, {
        duration: 1,
        onUpdate: function() {
          const progress = this.progress();
          const valorActual = saldoOriginal - Math.round(progress * monto);
          elementoSaldo.textContent = valorActual.toLocaleString();
        },
        onComplete: function() {
          elementoSaldo.textContent = saldoNuevo.toLocaleString();
        }
      });
    }
    
    setSaldo(prevSaldo => prevSaldo - monto);
    setHistorial(prevHistorial => [nuevaTransaccion, ...prevHistorial]);
  };

  // Calcular valores adicionales
  const disponibles = saldo;
  const totalAsignado = saldo + gastados;
  const umbralAlerta = 20; // Porcentaje de alerta cuando los créditos bajan de este nivel

  // Actualizar gastados cuando se usa créditos
  useEffect(() => {
    // Calcular gastados basado en el historial de egresos
    const totalGastado = historial
      .filter(tx => tx.tipo === 'egreso')
      .reduce((sum, tx) => sum + tx.monto, 0);
    
    setGastados(totalGastado);
  }, [historial]);

  return (
    <CreditosContext.Provider
      value={{
        saldo,
        historial,
        comprarCreditos,
        usarCreditos,
        isLoading,
        disponibles,
        gastados,
        umbralAlerta,
        totalAsignado
      }}
    >
      {children}
    </CreditosContext.Provider>
  );
};

export const useCreditos = () => {
  const context = useContext(CreditosContext);
  if (context === undefined) {
    throw new Error('useCreditos debe ser usado dentro de un CreditosProvider');
  }
  return context;
};

// Exportar el mismo hook con nombre alternativo para compatibilidad
export const useCreditosContext = () => {
  return useCreditos();
};
