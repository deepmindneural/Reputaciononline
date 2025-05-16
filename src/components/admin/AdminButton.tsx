"use client";

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { ADMIN_THEME } from '@/theme/admin-theme';

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  className = '',
  ...props
}) => {
  // Estilos base
  const baseStyles = "transition-all duration-300 inline-flex items-center justify-center font-medium rounded-lg focus:outline-none";
  
  // Variantes de estilo
  const variantStyles = {
    primary: {
      background: ADMIN_THEME.colors.gradients.cyan,
      text: "text-white",
      hover: "hover:shadow-lg transform hover:scale-105",
      active: "active:scale-95",
      disabled: "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
    },
    secondary: {
      background: "bg-white",
      text: "text-cyan-700",
      hover: "hover:bg-gray-50 hover:shadow",
      active: "active:bg-gray-100",
      disabled: "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
      border: "border border-gray-300"
    },
    outline: {
      background: "bg-transparent",
      text: "text-cyan-600",
      hover: "hover:bg-cyan-50",
      active: "active:bg-cyan-100",
      disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
      border: "border border-cyan-600"
    },
    danger: {
      background: ADMIN_THEME.colors.gradients.red,
      text: "text-white",
      hover: "hover:shadow-lg transform hover:scale-105",
      active: "active:scale-95",
      disabled: "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
    }
  };
  
  // Tamaños
  const sizeStyles = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3"
  };
  
  // Combinar estilos
  const style = variantStyles[variant];
  
  const buttonStyle = `
    ${baseStyles}
    ${style.text}
    ${style.hover}
    ${style.active}
    ${style.disabled}
    ${style.border || ''}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <button
      className={buttonStyle}
      style={variant === 'primary' || variant === 'danger' ? {background: style.background, boxShadow: ADMIN_THEME.shadows.button} : {}}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      )}
    </button>
  );
};
