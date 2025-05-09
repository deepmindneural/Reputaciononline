"use client";

import React from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Registramos los componentes que necesitamos
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface PieChartProps {
  title?: string;
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  height?: number;
  donut?: boolean;
  showLegend?: boolean;
  showPercentage?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  title = '',
  labels,
  data,
  backgroundColor,
  height = 300,
  donut = false,
  showLegend = true,
  showPercentage = true
}) => {
  // Colores por defecto
  const defaultColors = [
    '#10B981', // Verde
    '#3B82F6', // Azul
    '#F97316', // Naranja
    '#8B5CF6', // Pu00farpura
    '#EC4899', // Rosa
    '#0EA5E9', // Celeste
    '#EAB308', // Amarillo
    '#C026D3', // Magenta
    '#64748B', // Gris azulado
    '#14B8A6', // Turquesa
  ];
  
  const chartData = {
    labels,
    datasets: [
      {
        data: data || [],
        backgroundColor: backgroundColor || defaultColors.slice(0, (data || []).length),
        borderColor: 'white',
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: donut ? '50%' : 0,
    plugins: {
      legend: {
        display: showLegend,
        position: 'right' as const,
        labels: {
          font: {
            size: 12,
            family: 'sans-serif',
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
          family: 'sans-serif',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: showPercentage ? {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart._metasets[context.datasetIndex].total;
            const percentage = Math.round((value * 100) / total);
            return `${label}: ${percentage}% (${value})`;
          }
        } : {},
        displayColors: true,
      },
    },
  };

  // Verificar si hay datos válidos para renderizar el gráfico
  const hasValidData = labels && labels.length > 0 && data && data.length > 0;
  
  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      {hasValidData ? (
        donut ? (
          <Doughnut data={chartData} options={options} />
        ) : (
          <Pie data={chartData} options={options} />
        )
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
        </div>
      )}
    </div>
  );
};

export default PieChart;
