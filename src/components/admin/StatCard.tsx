"use client";

import { ReactNode } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { ADMIN_THEME, STAT_CARD_STYLES } from '@/theme/admin-theme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  changeType?: 'up' | 'down';
  color?: 'blue' | 'green' | 'cyan' | 'orange' | 'purple' | 'red';
  isCurrency?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType,
  color = 'cyan',
  isCurrency = false
}) => {
  const colorStyle = STAT_CARD_STYLES[color] || STAT_CARD_STYLES.cyan;
  
  // Formateador para valores numéricos
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      // Si es moneda, formatear como pesos colombianos
      if (isCurrency) {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      }
      // Si no es moneda, solo formato numérico
      return val.toLocaleString('es-CO');
    }
    return val;
  };
  
  return (
    <div 
      className="rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      style={{
        background: colorStyle.gradient,
        boxShadow: ADMIN_THEME.shadows.card
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white text-opacity-85">{title}</p>
            <p className={`mt-2 text-3xl font-bold ${colorStyle.textColor}`}>
              {formatValue(value)}
            </p>
          </div>
          <div className={`p-4 rounded-full ${colorStyle.iconBg}`}>
            {icon}
          </div>
        </div>
        {change !== undefined && changeType && (
          <div className="mt-5 flex items-center">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              changeType === 'up' ? colorStyle.change.up : colorStyle.change.down
            }`}>
              {changeType === 'up' ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              {change}%
            </span>
            <span className="ml-2 text-sm text-white text-opacity-85">vs mes anterior</span>
          </div>
        )}
      </div>
    </div>
  );
};
