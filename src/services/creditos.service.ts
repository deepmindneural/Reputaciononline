import { apiFetch } from './api';

// Tipos para la API de créditos
export interface CreditosSummary {
  creditosDisponibles: number;
  creditosGastados: number;
  plan: string;
  estado: string;
  ultimaRecarga: string | null;
}

export interface TransaccionCredito {
  id: string;
  fecha: string;
  descripcion: string;
  tipo: 'consumo' | 'recarga';
  cantidad: number;
  canal?: 'X' | 'Facebook' | 'Instagram' | 'LinkedIn' | 'TikTok' | 'Búsqueda';
}

export interface HistorialCreditosResponse {
  transacciones: TransaccionCredito[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Plan {
  id: number;
  nombre: string;
  creditos: number;
  precio: number;
  caracteristicas: string; // JSON string
  destacado?: boolean;
}

// Métodos compatibles con código anterior
export async function obtenerSaldo(usuarioId: number, token?: string) {
  return apiFetch<{ saldo: number, consumidos: number, total: number }>(`/creditos/saldo/${usuarioId}`, {}, token);
}

export async function obtenerHistorial(usuarioId: number, token?: string) {
  return apiFetch<TransaccionCredito[]>(`/creditos/historial/${usuarioId}`, {}, token);
}

export async function comprarCreditos(
  usuarioId: number,
  cantidad: number,
  descripcion: string,
  token?: string
) {
  return apiFetch('/creditos/comprar', {
    method: 'POST',
    body: JSON.stringify({ usuarioId, cantidad, descripcion }),
  }, token);
}

// Nuevas funciones que usan la API actualizada
export async function getMiSaldo(token: string) {
  return apiFetch<CreditosSummary>('/creditos/mi-saldo', {}, token);
}

export async function getHistorialCreditos(page: number = 1, limit: number = 10, token: string) {
  return apiFetch<HistorialCreditosResponse>(`/creditos/historial?page=${page}&limit=${limit}`, {}, token);
}

export async function consumirCreditos(
  cantidad: number, 
  descripcion: string, 
  canal?: string,
  token?: string
) {
  return apiFetch('/creditos/consumir', {
    method: 'POST',
    body: JSON.stringify({ cantidad, descripcion, canal }),
  }, token);
}

export async function comprarPlan(
  planId: string,
  token?: string
) {
  return apiFetch('/creditos/comprar-plan', {
    method: 'POST',
    body: JSON.stringify({ planId }),
  }, token);
}

export async function getPlanesDisponibles(token?: string) {
  return apiFetch<Plan[]>('/planes', {}, token);
}
