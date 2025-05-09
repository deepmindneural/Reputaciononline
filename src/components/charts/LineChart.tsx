"use client";

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registramos los componentes que necesitamos
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  title?: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
  height?: number;
  showLegend?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  title = '',
  labels,
  datasets,
  height = 300,
  showLegend = true
}) => {
  // Configurar colores por defecto si no se proporcionan
  const defaultColors = [
    { borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)' },
    { borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.1)' },
    { borderColor: '#F97316', backgroundColor: 'rgba(249, 115, 22, 0.1)' },
    { borderColor: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.1)' },
    { borderColor: '#EC4899', backgroundColor: 'rgba(236, 72, 153, 0.1)' },
  ];

  const configuredDatasets = datasets?.map((dataset, index) => {
    const defaultColor = defaultColors[index % defaultColors.length];
    return {
      ...dataset,
      borderColor: dataset.borderColor || defaultColor.borderColor,
      backgroundColor: dataset.backgroundColor || `${defaultColor.backgroundColor}20`,
      fill: dataset.fill !== undefined ? dataset.fill : false,
      tension: 0.4,
      pointBackgroundColor: dataset.borderColor || defaultColor.borderColor,
      pointBorderColor: '#fff',
      pointRadius: 4,
      pointHoverRadius: 6
    };
  }) || [];

  const data = {
    labels,
    datasets: configuredDatasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
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
        displayColors: true,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.15)',
        },
        ticks: {
          font: {
            size: 11,
          },
          padding: 8,
        },
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        hitRadius: 10,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  // Verificar si hay datos válidos para renderizar el gráfico
  const hasValidData = labels && labels.length > 0 && configuredDatasets && configuredDatasets.length > 0;
  
  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      {hasValidData ? (
        <Line data={data} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
        </div>
      )}
    </div>
  );
};

export default LineChart;
