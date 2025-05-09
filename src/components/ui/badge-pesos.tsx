import React from 'react';

interface BadgePesosProps {
  /**
   * Valor numérico a mostrar. Se mantiene la prop "value" para compatibilidad,
   * pero se prefiere usar "valor" en español.
   */
  valor?: number;
  value?: number; // soporte legacy
  size?: 'sm' | 'md' | 'lg';
  showDecimals?: boolean;
  className?: string;
}

export function BadgePesos({
  valor,
  value,
  size = 'md',
  showDecimals = false,
  className = '',
}: BadgePesosProps) {
  // Elegir el primer valor definido
  const amount = typeof valor === 'number' ? valor : (value ?? 0);

  // Función para formatear valores en pesos colombianos
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(amount);
  };

  // Determinamos el tamaño de la fuente según el prop size
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full bg-cyan-100 text-cyan-800 font-medium ${sizeClasses[size]} ${className}`}
    >
      {formatCurrency(amount)}
    </span>
  );
}
