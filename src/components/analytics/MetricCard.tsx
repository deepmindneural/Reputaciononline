"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorScheme?: 'primary' | 'blue' | 'green' | 'red' | 'yellow';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  colorScheme = 'primary'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);

  const colorMap = {
    primary: {
      light: 'bg-primary-50 text-primary-600',
      dark: 'dark:bg-primary-900/20 dark:text-primary-400',
      icon: 'text-primary-600 dark:text-primary-400'
    },
    blue: {
      light: 'bg-blue-50 text-blue-600',
      dark: 'dark:bg-blue-900/20 dark:text-blue-400',
      icon: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      light: 'bg-green-50 text-green-600',
      dark: 'dark:bg-green-900/20 dark:text-green-400',
      icon: 'text-green-600 dark:text-green-400'
    },
    red: {
      light: 'bg-red-50 text-red-600',
      dark: 'dark:bg-red-900/20 dark:text-red-400',
      icon: 'text-red-600 dark:text-red-400'
    },
    yellow: {
      light: 'bg-yellow-50 text-yellow-600',
      dark: 'dark:bg-yellow-900/20 dark:text-yellow-400',
      icon: 'text-yellow-600 dark:text-yellow-400'
    }
  };

  useEffect(() => {
    if (!cardRef.current) return;

    // Animación de entrada para la tarjeta
    gsap.from(cardRef.current, {
      duration: 0.6,
      y: 20,
      opacity: 0,
      ease: 'power2.out'
    });

    // Animación para el valor numérico
    if (valueRef.current) {
      try {
        gsap.from(valueRef.current, {
          textContent: 0,
          duration: 1.5,
          delay: 0.3,
          ease: 'power1.out',
          snap: { textContent: 1 },
          onUpdate: function() {
            if (valueRef.current) {
              const numValue = Number(this.targets()[0].textContent) || 0;
              valueRef.current.innerHTML = numValue.toLocaleString();
            }
          }
        });
      } catch (error) {
        console.error('Error en animación de MetricCard:', error);
        // Asegurarse de que el valor se muestra aunque la animación falle
        if (valueRef.current) {
          valueRef.current.innerHTML = (value || 0).toLocaleString();
        }
      }
    }
  }, [value]);

  return (
    <div 
      ref={cardRef}
      className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
    >
      <div className="flex items-center">
        <div className={`mr-4 flex h-12 w-12 items-center justify-center rounded-lg ${colorMap[colorScheme].light} ${colorMap[colorScheme].dark}`}>
          <Icon className={`h-6 w-6 ${colorMap[colorScheme].icon}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <div className="mt-1 flex items-end">
            <div 
              ref={valueRef}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              0
            </div>

            {trend && (
              <div className={`ml-2 flex items-center text-sm font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <span>{trend.value}%</span>
                <svg 
                  className={`ml-1 h-3 w-3 ${trend.isPositive ? 'rotate-0' : 'rotate-180'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
