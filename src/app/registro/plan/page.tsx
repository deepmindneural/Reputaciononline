"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { CreditosProvider, useCreditos } from '@/context/CreditosContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

function PlanSelection() {
  const { planesDisponibles } = useCreditos();
  const { user } = useAuth();
  const router = useRouter();

  const seleccionarPlan = async (planId: string) => {
    if (!user) return;
    const plan = planesDisponibles.find(p => p.id === planId);
    if (!plan) return;
    try {
      await axios.post('/api/creditos/comprar', {
        usuarioId: user.id,
        cantidad: plan.creditos,
        descripcion: `Compra plan ${plan.nombre}`,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al comprar plan', error);
      alert('Error al procesar el pago');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-cyan-600 dark:text-cyan-400">Selecciona un plan de créditos</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {planesDisponibles.map(plan => (
            <div key={plan.id} className={`border rounded-lg p-6 shadow bg-white dark:bg-gray-800 flex flex-col ${plan.destacado ? 'ring-2 ring-cyan-500' : ''}`}>
              <h2 className="text-xl font-semibold mb-2 text-center text-gray-800 dark:text-gray-200">{plan.nombre}</h2>
              <p className="text-4xl font-bold text-center text-cyan-600 dark:text-cyan-400">
                {plan.creditos.toLocaleString()} <span className="text-base font-medium text-gray-600 dark:text-gray-400">créditos</span>
              </p>
              <p className="text-center text-2xl mt-2 text-gray-700 dark:text-gray-300">{plan.precio.toLocaleString()} COP</p>
              <ul className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-300 flex-1">
                {plan.caracteristicas.map((c, idx) => (
                  <li key={idx}>• {c}</li>
                ))}
              </ul>
              <button onClick={() => seleccionarPlan(plan.id)} className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-md">Seleccionar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PlanPageWrapper() {
  return (
    <CreditosProvider>
      <PlanSelection />
    </CreditosProvider>
  );
}
