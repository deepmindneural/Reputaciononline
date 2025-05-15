"use client";

import React, { useState } from 'react';
import { useCreditos } from '@/context/CreditosContext';
import CreditosUsageChart from '@/components/CreditosUsageChart';
import { FaChartLine, FaCalendarAlt, FaArrowLeft, FaDownload } from 'react-icons/fa';

export default function AnalisisCreditosPage() {
  const { creditos, historialTransacciones } = useCreditos();
  const [rangoTiempo, setRangoTiempo] = useState<'week' | 'month'>('month');

  // Calcular estadu00edsticas generales
  const calcularEstadisticas = () => {
    const consumoPorCanal: Record<string, number> = {};
    let totalConsumo = 0;
    let promedioConsumo = 0;
    let maxConsumo = 0;
    let fechaMaxConsumo = '';
    
    // Filtrar transacciones de consumo
    const consumos = historialTransacciones.filter(t => t.tipo === 'consumo');
    
    if (consumos.length > 0) {
      // Calcular consumo por canal
      consumos.forEach(t => {
        if (t.canal) {
          consumoPorCanal[t.canal] = (consumoPorCanal[t.canal] || 0) + t.cantidad;
        }
        totalConsumo += t.cantidad;
        
        // Encontrar el consumo mu00e1ximo
        if (t.cantidad > maxConsumo) {
          maxConsumo = t.cantidad;
          fechaMaxConsumo = t.fecha;
        }
      });
      
      // Calcular promedio
      promedioConsumo = Math.round(totalConsumo / consumos.length);
    }
    
    // Encontrar el canal con mayor consumo
    let canalMayorConsumo = '';
    let mayorConsumo = 0;
    
    Object.entries(consumoPorCanal).forEach(([canal, consumo]) => {
      if (consumo > mayorConsumo) {
        mayorConsumo = consumo;
        canalMayorConsumo = canal;
      }
    });
    
    return {
      totalConsumo,
      promedioConsumo,
      maxConsumo,
      fechaMaxConsumo,
      canalMayorConsumo,
      porcentajeCanalMayor: totalConsumo ? Math.round((mayorConsumo / totalConsumo) * 100) : 0,
    };
  };
  
  const estadisticas = calcularEstadisticas();
  
  // Calcular predicciu00f3n de duraciu00f3n de cru00e9ditos
  const calcularPrediccion = () => {
    if (estadisticas.totalConsumo === 0) return 'No hay suficientes datos';
    
    // Calcular promedio diario de consumo
    const consumos = historialTransacciones.filter(t => t.tipo === 'consumo');
    if (consumos.length < 2) return 'Se necesitan mu00e1s datos para una predicciu00f3n precisa';
    
    // Obtener la fecha mu00e1s antigua y mu00e1s reciente
    const fechas = consumos.map(t => new Date(t.fecha.split(' ')[0].split('/').reverse().join('-')).getTime());
    const fechaMinima = new Date(Math.min(...fechas));
    const fechaMaxima = new Date(Math.max(...fechas));
    
    // Calcular du00edas transcurridos
    const diasTranscurridos = Math.max(
      1, // Mu00ednimo 1 du00eda para evitar divisiu00f3n por cero
      Math.floor((fechaMaxima.getTime() - fechaMinima.getTime()) / (1000 * 60 * 60 * 24))
    );
    
    // Promedio diario
    const promedioDiario = estadisticas.totalConsumo / diasTranscurridos;
    
    // Du00edas restantes con los cru00e9ditos actuales
    const diasRestantes = Math.floor(creditos.disponibles / promedioDiario);
    
    if (diasRestantes <= 0) return 'Cru00e9ditos insuficientes para continuar con el uso actual';
    if (diasRestantes > 365) return 'Mu00e1s de un au00f1o con el uso actual';
    
    // Calcular fecha estimada de agotamiento
    const fechaAgotamiento = new Date();
    fechaAgotamiento.setDate(fechaAgotamiento.getDate() + diasRestantes);
    
    return `Aproximadamente ${diasRestantes} du00edas (hasta el ${fechaAgotamiento.toLocaleDateString('es-CO')})`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <a href="/dashboard/creditos" className="flex items-center text-primary-600 hover:text-primary-700">
          <FaArrowLeft className="mr-2" />
          Volver a Cru00e9ditos
        </a>
      </div>
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Anu00e1lisis de Uso de Cru00e9ditos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualiza y analiza los patrones de consumo de cru00e9ditos en tu plataforma de Reputaciu00f3n Online
        </p>
      </header>
      
      {/* Filtros y opciones */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 dark:text-gray-300">Periodo:</span>
          <div className="flex rounded-md overflow-hidden">
            <button 
              className={`px-4 py-2 text-sm font-medium ${rangoTiempo === 'week' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
              onClick={() => setRangoTiempo('week')}
            >
              7 du00edas
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${rangoTiempo === 'month' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
              onClick={() => setRangoTiempo('month')}
            >
              30 du00edas
            </button>
          </div>
        </div>
        
        <button className="btn-secondary flex items-center text-sm">
          <FaDownload className="mr-2" />
          Exportar informe
        </button>
      </div>
      
      {/* Gru00e1ficos de uso */}
      <CreditosUsageChart timeRange={rangoTiempo} />
      
      {/* Tarjetas de estadu00edsticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg text-gray-700 dark:text-gray-300">Consumo total</h3>
            <span className="text-primary-600 bg-primary-100 dark:bg-primary-900 dark:text-primary-300 p-2 rounded-full">
              <FaChartLine />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {estadisticas.totalConsumo.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Cru00e9ditos consumidos en el periodo
          </p>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg text-gray-700 dark:text-gray-300">Cru00e9ditos restantes</h3>
            <span className="text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 p-2 rounded-full">
              <FaCalendarAlt />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {creditos.disponibles.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Duraciu00f3n estimada: {calcularPrediccion()}
          </p>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg text-gray-700 dark:text-gray-300">Mayor consumo</h3>
            <span className="text-indigo-600 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707.707-.707A1 1 0 0115 2h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-.707-.293L14 5.414l-.707.707A1 1 0 0112 7h-2a1 1 0 01-1-1V4a1 1 0 011-1h2zm0 10a1 1 0 01.707.293l.707.707.707-.707A1 1 0 0115 12h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-.707-.293L14 15.414l-.707.707A1 1 0 0112 17h-2a1 1 0 01-1-1v-2a1 1 0 011-1h2z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {estadisticas.maxConsumo.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {estadisticas.fechaMaxConsumo ? `El ${estadisticas.fechaMaxConsumo.split(' ')[0]}` : 'No hay datos'}
          </p>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg text-gray-700 dark:text-gray-300">Canal principal</h3>
            <span className="text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {estadisticas.canalMayorConsumo || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {estadisticas.porcentajeCanalMayor}% del consumo total
          </p>
        </div>
      </div>
      
      {/* Panel de recomendaciones */}
      <div className="card p-6 mt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recomendaciones de IA para optimizar tus cru00e9ditos
        </h3>
        
        <div className="space-y-4">
          {estadisticas.canalMayorConsumo && (
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Optimiza tu consumo en {estadisticas.canalMayorConsumo}:</span> Este canal representa el {estadisticas.porcentajeCanalMayor}% de tu consumo. Considera utilizar filtros mu00e1s especu00edficos para reducir el volumen de datos procesados.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-blue-600 text-sm font-bold">2</span>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Programa tus consultas:</span> Establece horarios especu00edficos para ejecutar consultas masivas en lugar de mantenerlas activas continuamente.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-blue-600 text-sm font-bold">3</span>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Actualiza tus palabras clave:</span> Revisa y refina tus palabras clave para mejorar la precisiu00f3n y reducir el ruido en los resultados.
              </p>
            </div>
          </div>
          
          {estadisticas.promedioConsumo > 0 && (
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">4</span>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Considera un plan superior:</span> Con tu consumo promedio de {estadisticas.promedioConsumo.toLocaleString()} cru00e9ditos por operaciu00f3n, un plan con mayor volumen de cru00e9ditos podru00eda ofrecerte mejor relaciu00f3n costo-beneficio.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
