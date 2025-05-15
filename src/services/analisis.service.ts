import { apiFetch } from './api';

export async function analizarSentimiento(texto: string, token?: string) {
  return apiFetch<{ sentimiento: string }>('/analisis/sentimiento', {
    method: 'POST',
    body: JSON.stringify({ texto }),
  }, token);
}

export async function generarReporte(datos: string, token?: string) {
  return apiFetch<{ reporte: string }>('/analisis/reporte', {
    method: 'POST',
    body: JSON.stringify({ datos }),
  }, token);
}
