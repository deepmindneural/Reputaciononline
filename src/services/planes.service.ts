import { apiFetch } from './api';
import { Plan } from './creditos.service';

/**
 * Obtiene todos los planes disponibles
 */
export async function obtenerPlanes(token?: string) {
  return apiFetch<Plan[]>('/planes', {}, token);
}

/**
 * Obtiene los detalles de un plan específico
 */
export async function obtenerPlan(planId: string | number, token?: string) {
  return apiFetch<Plan>(`/planes/${planId}`, {}, token);
}

/**
 * Crea un nuevo plan (solo administradores)
 */
export async function crearPlan(
  plan: {
    nombre: string;
    creditos: number;
    precio: number;
    caracteristicas: string[];
    destacado?: boolean;
  },
  token: string
) {
  return apiFetch<Plan>('/planes', {
    method: 'POST',
    body: JSON.stringify(plan),
  }, token);
}

/**
 * Actualiza un plan existente (solo administradores)
 */
export async function actualizarPlan(
  planId: string | number,
  datos: {
    nombre?: string;
    creditos?: number;
    precio?: number;
    caracteristicas?: string[];
    destacado?: boolean;
    activo?: boolean;
  },
  token: string
) {
  return apiFetch<Plan>(`/planes/${planId}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  }, token);
}

/**
 * Elimina un plan (solo administradores)
 */
export async function eliminarPlan(planId: string | number, token: string) {
  return apiFetch(`/planes/${planId}`, {
    method: 'DELETE',
  }, token);
}
