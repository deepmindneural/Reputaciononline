import { apiFetch } from './api';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    rol: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registro(nombre: string, email: string, password: string) {
  return apiFetch('/auth/registro', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password }),
  });
}
