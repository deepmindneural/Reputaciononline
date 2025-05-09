"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useCreditos } from '@/context/CreditosContext';

// Registrar componentes de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface CreditosUsageChartProps {
  timeRange?: 'week' | 'month' | 'year';
}

const CreditosUsageChart: React.FC<CreditosUsageChartProps> = ({ timeRange = 'month' }) => {
  const { historialTransacciones } = useCreditos();

  // Calcular consumo por canal
  const consumoPorCanal = () => {
    const canales: Record<string, number> = {};
    
    historialTransacciones
      .filter(t => t.tipo === 'consumo' && t.canal)
      .forEach(t => {
        if (t.canal) {
          canales[t.canal] = (canales[t.canal] || 0) + t.cantidad;
        }
      });
    
    return {
      labels: Object.keys(canales),
      data: Object.values(canales),
    };
  };

  // Preparar datos para el gráfico de consumo diario (últimos 7 días o 30 días)
  const consumoDiario = () => {
    const hoy = new Date();
    const dias = timeRange === 'week' ? 7 : 30;
    const etiquetas: string[] = [];
    const datos: number[] = [];

    // Crear fechas para los últimos X días
    for (let i = dias - 1; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      const etiqueta = fecha.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' });
      etiquetas.push(etiqueta);
      datos.push(0); // Valor inicial 0
    }

    // Sumar consumos por día
    historialTransacciones
      .filter(t => t.tipo === 'consumo')
      .forEach(t => {
        const fechaTransaccion = new Date(t.fecha.split(' ')[0].split('/').reverse().join('-'));
        const difDias = Math.floor((hoy.getTime() - fechaTransaccion.getTime()) / (1000 * 60 * 60 * 24));
        
        if (difDias < dias) {
          datos[dias - difDias - 1] += t.cantidad;
        }
      });

    return {
      labels: etiquetas,
      data: datos,
    };
  };

  // Datos para el gráfico de consumo por canal
  const datosDonut = {
    labels: consumoPorCanal().labels,
    datasets: [
      {
        data: consumoPorCanal().data,
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico de línea de consumo diario
  const datosLinea = {
    labels: consumoDiario().labels,
    datasets: [
      {
        label: 'Créditos usados',
        data: consumoDiario().data,
        borderColor: 'rgb(0, 230, 217)',
        backgroundColor: 'rgba(0, 230, 217, 0.5)',
        tension: 0.2,
        fill: true,
      },
    ],
  };

  // Opciones para el gráfico de línea
  const opcionesLinea = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Consumo diario de créditos (últimos ${timeRange === 'week' ? '7 días' : '30 días'})`,
        font: {
          size: 14,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Créditos',
        },
      },
    },
  };

  // Opciones para el gráfico de dona
  const opcionesDonut = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Distribución de consumo por canal',
        font: {
          size: 14,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card p-4">
        <Line data={datosLinea} options={opcionesLinea} />
      </div>
      
      <div className="card p-4">
        <Doughnut data={datosDonut} options={opcionesDonut} />
      </div>
    </div>
  );
};

export default CreditosUsageChart;
