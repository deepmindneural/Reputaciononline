import { NextRequest, NextResponse } from 'next/server';
import { validateAdminAuth } from '../route';

// Tipos para los planes
interface Plan {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  creditosIncluidos: number;
  duracion: number; // en días
  caracteristicas: string[];
  destacado: boolean;
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  color?: string;
}

// Datos simulados de planes (en un entorno real, esto estaría en una base de datos)
const planes: Plan[] = [
  {
    id: 'PLAN-001',
    nombre: 'Básico',
    descripcion: 'Plan inicial para pequeñas empresas',
    precio: 29900,
    creditosIncluidos: 5000,
    duracion: 30,
    caracteristicas: [
      'Análisis básico de perfiles',
      '2 redes sociales',
      'Reportes mensuales',
      'Soporte por email'
    ],
    destacado: false,
    estado: 'activo',
    fechaCreacion: '2025-01-01',
    color: '#0CA5E9' // Color cyan
  },
  {
    id: 'PLAN-002',
    nombre: 'Estándar',
    descripcion: 'Plan ideal para empresas en crecimiento',
    precio: 59900,
    creditosIncluidos: 15000,
    duracion: 30,
    caracteristicas: [
      'Análisis avanzado de perfiles',
      '4 redes sociales',
      'Reportes semanales',
      'Soporte por email y chat',
      'Monitoreo de comentarios'
    ],
    destacado: true,
    estado: 'activo',
    fechaCreacion: '2025-01-01',
    color: '#00B3B0' // Color turquesa
  },
  {
    id: 'PLAN-003',
    nombre: 'Premium',
    descripcion: 'Plan completo para empresas establecidas',
    precio: 99900,
    creditosIncluidos: 30000,
    duracion: 30,
    caracteristicas: [
      'Análisis completo de perfiles',
      'Todas las redes sociales',
      'Reportes diarios',
      'Soporte 24/7',
      'Monitoreo de comentarios',
      'Alertas en tiempo real',
      'Gestión de crisis'
    ],
    destacado: false,
    estado: 'activo',
    fechaCreacion: '2025-01-01',
    color: '#7C3AED' // Color púrpura
  },
  {
    id: 'PLAN-004',
    nombre: 'Enterprise',
    descripcion: 'Plan personalizado para grandes corporaciones',
    precio: 249900,
    creditosIncluidos: 100000,
    duracion: 30,
    caracteristicas: [
      'Análisis personalizado de perfiles',
      'Todas las redes sociales',
      'Reportes personalizados',
      'Soporte prioritario 24/7',
      'Monitoreo avanzado de comentarios',
      'Alertas en tiempo real',
      'Gestión de crisis',
      'Consultor dedicado',
      'API personalizada'
    ],
    destacado: false,
    estado: 'activo',
    fechaCreacion: '2025-01-01',
    color: '#F59E0B' // Color ámbar
  }
];

// GET: Obtener todos los planes o un plan específico por ID
export async function GET(request: NextRequest) {
  // Validar autenticación del administrador
  const authResult = await validateAdminAuth(request);
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  // Obtener ID de plan de la URL si existe
  const url = new URL(request.url);
  const planId = url.searchParams.get('id');

  if (planId) {
    // Buscar plan por ID
    const plan = planes.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 });
    }
    return NextResponse.json(plan);
  }

  // Obtener parámetros de filtrado
  const estado = url.searchParams.get('estado') || '';
  const destacado = url.searchParams.get('destacado');

  // Aplicar filtros
  let planesFiltrados = [...planes];
  
  if (estado) {
    planesFiltrados = planesFiltrados.filter(p => p.estado === estado);
  }

  if (destacado !== null) {
    const esDestacado = destacado === 'true';
    planesFiltrados = planesFiltrados.filter(p => p.destacado === esDestacado);
  }

  // Ordenar por precio
  planesFiltrados.sort((a, b) => a.precio - b.precio);

  return NextResponse.json({
    planes: planesFiltrados,
    total: planesFiltrados.length
  });
}

// POST: Crear un nuevo plan
export async function POST(request: NextRequest) {
  // Validar autenticación del administrador
  const authResult = await validateAdminAuth(request);
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.nombre || !data.precio || !data.creditosIncluidos || !data.duracion) {
      return NextResponse.json(
        { error: 'Datos incompletos. Se requiere nombre, precio, créditos incluidos y duración' }, 
        { status: 400 }
      );
    }

    // Crear nuevo plan (en un entorno real, se guardaría en la base de datos)
    const nuevoPlan: Plan = {
      id: `PLAN-${(planes.length + 1).toString().padStart(3, '0')}`,
      nombre: data.nombre,
      descripcion: data.descripcion || '',
      precio: data.precio,
      creditosIncluidos: data.creditosIncluidos,
      duracion: data.duracion,
      caracteristicas: data.caracteristicas || [],
      destacado: data.destacado || false,
      estado: 'activo',
      fechaCreacion: new Date().toISOString().split('T')[0],
      color: data.color || '#00B3B0' // Color turquesa por defecto
    };

    // En un entorno real, aquí se guardaría en la base de datos
    planes.push(nuevoPlan);

    return NextResponse.json(nuevoPlan, { status: 201 });
  } catch (error) {
    console.error('Error al crear plan:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' }, 
      { status: 500 }
    );
  }
}

// PUT: Actualizar un plan existente
export async function PUT(request: NextRequest) {
  // Validar autenticación del administrador
  const authResult = await validateAdminAuth(request);
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Validar ID de plan
    if (!data.id) {
      return NextResponse.json(
        { error: 'Se requiere el ID del plan' }, 
        { status: 400 }
      );
    }

    // Buscar el plan por ID
    const index = planes.findIndex(p => p.id === data.id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Plan no encontrado' }, 
        { status: 404 }
      );
    }

    // Actualizar plan (en un entorno real, se actualizaría en la base de datos)
    const planActualizado = {
      ...planes[index],
      ...data,
      id: planes[index].id // Asegurar que el ID no cambie
    };

    planes[index] = planActualizado;

    return NextResponse.json(planActualizado);
  } catch (error) {
    console.error('Error al actualizar plan:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' }, 
      { status: 500 }
    );
  }
}

// DELETE: Desactivar un plan
export async function DELETE(request: NextRequest) {
  // Validar autenticación del administrador
  const authResult = await validateAdminAuth(request);
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  // Obtener ID de plan de la URL
  const url = new URL(request.url);
  const planId = url.searchParams.get('id');

  if (!planId) {
    return NextResponse.json(
      { error: 'Se requiere el ID del plan' }, 
      { status: 400 }
    );
  }

  // Buscar el plan por ID
  const index = planes.findIndex(p => p.id === planId);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Plan no encontrado' }, 
      { status: 404 }
    );
  }

  // En un entorno real, normalmente no eliminaríamos planes, sino que los marcaríamos como inactivos
  planes[index] = {
    ...planes[index],
    estado: 'inactivo'
  };

  return NextResponse.json({ 
    message: 'Plan desactivado correctamente',
    id: planId
  });
}
