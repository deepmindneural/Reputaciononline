"use client";

// Funciones auxiliares para el componente de gestión de créditos

// Función para obtener las clases CSS según el tipo de transacción
export function getTipoClasses(tipo: string): string {
  switch (tipo) {
    case 'compra':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'consumo':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'ajuste':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'reembolso':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

// Función para obtener la etiqueta según el tipo de transacción
export function getTipoLabel(tipo: string): string {
  switch (tipo) {
    case 'compra':
      return 'Compra';
    case 'consumo':
      return 'Consumo';
    case 'ajuste':
      return 'Ajuste';
    case 'reembolso':
      return 'Reembolso';
    default:
      return tipo;
  }
}

// Función para obtener las clases CSS según el estado de la transacción
export function getEstadoClasses(estado: string): string {
  switch (estado) {
    case 'completada':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'fallida':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

// Función para obtener la etiqueta según el estado de la transacción
export function getEstadoLabel(estado: string): string {
  switch (estado) {
    case 'completada':
      return 'Completada';
    case 'pendiente':
      return 'Pendiente';
    case 'fallida':
      return 'Fallida';
    default:
      return estado;
  }
}

// Interfaces para los tipos de datos
export interface Transaccion {
  id: number;
  usuario: string;
  usuarioId: number;
  tipo: 'compra' | 'consumo' | 'ajuste' | 'reembolso';
  cantidad: number;
  fecha: string;
  descripcion: string;
  estado: 'completada' | 'pendiente' | 'fallida';
  plan?: string;
  metodoPago?: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  plan: string;
  creditosDisponibles: number;
}

export interface EstadisticaMensual {
  mes: string;
  compras: number;
  consumos: number;
  total: number;
}

// Integración con redes sociales
export interface SocialMediaToken {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
  token: string;
  userId: string;
  expiresAt: string;
}

// Funciones para manejar la autenticación con redes sociales
export async function authenticateWithFacebook(): Promise<SocialMediaToken | null> {
  // En un entorno real, esta función usaría la API de Facebook para OAuth
  console.log('Autenticando con Facebook...');
  // Simulación de autenticación exitosa
  return {
    platform: 'facebook',
    token: 'facebook-mock-token-' + Date.now(),
    userId: 'facebook-user-123',
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 días
  };
}

export async function authenticateWithTwitter(): Promise<SocialMediaToken | null> {
  // En un entorno real, esta función usaría la API de Twitter para OAuth
  console.log('Autenticando con Twitter/X...');
  // Simulación de autenticación exitosa
  return {
    platform: 'twitter',
    token: 'twitter-mock-token-' + Date.now(),
    userId: 'twitter-user-456',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
  };
}

export async function authenticateWithInstagram(): Promise<SocialMediaToken | null> {
  // En un entorno real, esta función usaría la API de Instagram para OAuth
  console.log('Autenticando con Instagram...');
  // Simulación de autenticación exitosa
  return {
    platform: 'instagram',
    token: 'instagram-mock-token-' + Date.now(),
    userId: 'instagram-user-789',
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 días
  };
}

export async function authenticateWithLinkedIn(): Promise<SocialMediaToken | null> {
  // En un entorno real, esta función usaría la API de LinkedIn para OAuth
  console.log('Autenticando con LinkedIn...');
  // Simulación de autenticación exitosa
  return {
    platform: 'linkedin',
    token: 'linkedin-mock-token-' + Date.now(),
    userId: 'linkedin-user-101',
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 días
  };
}

// API Mock para CRUD de transacciones
export async function fetchTransacciones(): Promise<Transaccion[]> {
  // En un entorno real, esta función haría una llamada a la API
  console.log('Obteniendo transacciones de la API...');
  // Simulamos un tiempo de respuesta
  await new Promise(resolve => setTimeout(resolve, 500));
  // Retornamos datos de ejemplo
  return [
    {
      id: 1,
      usuario: 'Ana Martínez',
      usuarioId: 1,
      tipo: 'compra',
      cantidad: 15000,
      fecha: '2024-02-15T10:30:00',
      descripcion: 'Compra de Plan Profesional',
      estado: 'completada',
      plan: 'Profesional',
      metodoPago: 'Tarjeta de crédito'
    },
    // más transacciones...
  ];
}

export async function createTransaccion(transaccion: Omit<Transaccion, 'id' | 'fecha'>): Promise<Transaccion> {
  // En un entorno real, esta función haría una llamada POST a la API
  console.log('Creando transacción en la API...', transaccion);
  // Simulamos un tiempo de respuesta
  await new Promise(resolve => setTimeout(resolve, 500));
  // Retornamos la transacción con un ID generado
  return {
    ...transaccion,
    id: Math.floor(Math.random() * 1000) + 10,
    fecha: new Date().toISOString()
  };
}

export async function updateTransaccion(id: number, updates: Partial<Omit<Transaccion, 'id'>>): Promise<Transaccion> {
  // En un entorno real, esta función haría una llamada PUT/PATCH a la API
  console.log(`Actualizando transacción #${id} en la API...`, updates);
  // Simulamos un tiempo de respuesta
  await new Promise(resolve => setTimeout(resolve, 500));
  // Retornamos la transacción actualizada (simulada)
  return {
    id,
    usuario: 'Usuario Actualizado',
    usuarioId: 1,
    tipo: 'ajuste',
    cantidad: 1000,
    fecha: new Date().toISOString(),
    descripcion: 'Transacción actualizada',
    estado: 'completada',
    ...updates
  };
}

export async function deleteTransaccion(id: number): Promise<boolean> {
  // En un entorno real, esta función haría una llamada DELETE a la API
  console.log(`Eliminando transacción #${id} de la API...`);
  // Simulamos un tiempo de respuesta
  await new Promise(resolve => setTimeout(resolve, 500));
  // Retornamos éxito (simulado)
  return true;
}
