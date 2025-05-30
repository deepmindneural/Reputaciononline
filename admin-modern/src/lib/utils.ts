import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatearCantidad(cantidad: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(cantidad);
}

export function formatearFecha(fecha: string | Date) {
  return new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function porcentajeCambio(actual: number, anterior: number) {
  if (anterior === 0) return 100;
  return Math.round(((actual - anterior) / anterior) * 100);
}

export function obtenerColorEstado(estado: string) {
  switch (estado.toLowerCase()) {
    case 'activo':
    case 'completado':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'pendiente':
    case 'en proceso':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'inactivo':
    case 'fallido':
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}
