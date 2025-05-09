"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registramos los componentes que necesitamos
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  title?: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
  height?: number;
  stacked?: boolean;
  horizontal?: boolean;
  showLegend?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  title = '',
  labels,
  datasets,
  height = 300,
  stacked = false,
  horizontal = false,
  showLegend = true
}) => {
  // Configurar colores por defecto si no se proporcionan
  const defaultColors = [
    '#10B981', // Verde
    '#3B82F6', // Azul
    '#F97316', // Naranja
    '#8B5CF6', // Púrpura
    '#EC4899', // Rosa
    '#0EA5E9', // Celeste
    '#EAB308', // Amarillo
    '#C026D3', // Magenta
  ];
  
  const configuredDatasets = datasets?.map((dataset, index) => {
    const defaultColor = defaultColors[index % defaultColors.length];
    return {
      ...dataset,
      backgroundColor: dataset.backgroundColor || defaultColor,
      borderColor: dataset.borderColor || defaultColor,
      borderWidth: dataset.borderWidth || 1,
      borderRadius: 4,
      maxBarThickness: 40,
    };
  }) || [];

  const data = {
    labels,
    datasets: configuredDatasets,
  };

  const hasValidData = labels && labels.length > 0 && configuredDatasets && configuredDatasets.length > 0;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
        labels: {
          color: 'gray',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        color: 'gray',
        font: {
          size: 16,
          weight: 'bold' as const,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y !== null ? context.parsed.y.toLocaleString() : '';
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: stacked,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'gray',
          maxRotation: 0,
          minRotation: 0,
        }
      },
      y: {
        stacked: stacked,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: 'gray',
          callback: function(value: any) {
            return value.toLocaleString();
          }
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      {hasValidData ? (
        <Bar 
          data={data} 
          options={horizontal ? { ...options, indexAxis: 'y' } : options} 
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
        </div>
      )}
    </div>
  );
};

export default BarChart;
