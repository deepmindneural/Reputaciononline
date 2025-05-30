import { NextRequest, NextResponse } from 'next/server';
import { validateAdminAuth } from '../route';

// Datos simulados de usuarios (en un entorno real, esto estaría en una base de datos)
const usuarios = [
  { 
    id: 'USR-001', 
    nombre: 'Carlos García', 
    email: 'carlos@ejemplo.com', 
    empresa: 'TechSolutions', 
    plan: 'Premium', 
    creditosActuales: 5200,
    fechaRegistro: '2025-01-15',
    estado: 'activo'
  },
  { 
    id: 'USR-002', 
    nombre: 'María López', 
    email: 'maria@ejemplo.com', 
    empresa: 'MarketingPro', 
    plan: 'Básico', 
    creditosActuales: 1800,
    fechaRegistro: '2025-02-20',
    estado: 'activo'
  },
  { 
    id: 'USR-003', 
    nombre: 'Juan Martínez', 
    email: 'juan@ejemplo.com', 
    empresa: 'DigitalAgency', 
    plan: 'Premium', 
    creditosActuales: 7500,
    fechaRegistro: '2025-01-05',
    estado: 'activo'
  },
  { 
    id: 'USR-004', 
    nombre: 'Laura Hernández', 
    email: 'laura@ejemplo.com', 
    empresa: 'ContentCreators', 
    plan: 'Estándar', 
    creditosActuales: 3200,
    fechaRegistro: '2025-03-10',
    estado: 'activo'
  },
  { 
    id: 'USR-005', 
    nombre: 'Roberto Sánchez', 
    email: 'roberto@ejemplo.com', 
    empresa: 'SocialMedia', 
    plan: 'Premium', 
    creditosActuales: 9800,
    fechaRegistro: '2024-12-18',
    estado: 'activo'
  },
];

// GET: Obtener todos los usuarios o un usuario específico por ID
export async function GET(request: NextRequest) {
  // Validar autenticación del administrador
  const authResult = await validateAdminAuth(request);
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  // Obtener ID de usuario de la URL si existe
  const url = new URL(request.url);
  const userId = url.searchParams.get('id');

  if (userId) {
    // Buscar usuario por ID
    const usuario = usuarios.find(u => u.id === userId);
    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    return NextResponse.json(usuario);
  }

  // Obtener parámetros de paginación y filtrado
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const search = url.searchParams.get('search') || '';
  const plan = url.searchParams.get('plan') || '';
  const estado = url.searchParams.get('estado') || '';

  // Aplicar filtros
  let usuariosFiltrados = [...usuarios];
  
  if (search) {
    const searchLower = search.toLowerCase();
    usuariosFiltrados = usuariosFiltrados.filter(
      u => u.nombre.toLowerCase().includes(searchLower) || 
           u.email.toLowerCase().includes(searchLower) || 
           u.empresa.toLowerCase().includes(searchLower)
    );
  }

  if (plan) {
    usuariosFiltrados = usuariosFiltrados.filter(u => u.plan === plan);
  }

  if (estado) {
    usuariosFiltrados = usuariosFiltrados.filter(u => u.estado === estado);
  }

  // Calcular paginación
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedUsuarios = usuariosFiltrados.slice(startIndex, endIndex);

  return NextResponse.json({
    usuarios: paginatedUsuarios,
    total: usuariosFiltrados.length,
    page,
    limit,
    totalPages: Math.ceil(usuariosFiltrados.length / limit)
  });
}

// POST: Crear un nuevo usuario
export async function POST(request: NextRequest) {
  // Validar autenticación del administrador
  const authResult = await validateAdminAuth(request);
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.nombre || !data.email || !data.empresa || !data.plan) {
      return NextResponse.json(
        { error: 'Datos incompletos. Se requiere nombre, email, empresa y plan' }, 
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    if (usuarios.some(u => u.email === data.email)) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este correo electrónico' }, 
        { status: 400 }
      );
    }

    // Crear nuevo usuario (en un entorno real, se guardaría en la base de datos)
    const nuevoUsuario = {
      id: `USR-${(usuarios.length + 1).toString().padStart(3, '0')}`,
      nombre: data.nombre,
      email: data.email,
      empresa: data.empresa,
      plan: data.plan,
      creditosActuales: data.creditosIniciales || 0,
      fechaRegistro: new Date().toISOString().split('T')[0],
      estado: 'activo'
    };

    // En un entorno real, aquí se guardaría en la base de datos
    usuarios.push(nuevoUsuario);

    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' }, 
      { status: 500 }
    );
  }
}

// PUT: Actualizar un usuario existente
export async function PUT(request: NextRequest) {
  // Validar autenticación del administrador
  const authResult = await validateAdminAuth(request);
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Validar ID de usuario
    if (!data.id) {
      return NextResponse.json(
        { error: 'Se requiere el ID del usuario' }, 
        { status: 400 }
      );
    }

    // Buscar el usuario por ID
    const index = usuarios.findIndex(u => u.id === data.id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' }, 
        { status: 404 }
      );
    }

    // Actualizar usuario (en un entorno real, se actualizaría en la base de datos)
    const usuarioActualizado = {
      ...usuarios[index],
      ...data,
      id: usuarios[index].id // Asegurar que el ID no cambie
    };

    usuarios[index] = usuarioActualizado;

    return NextResponse.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' }, 
      { status: 500 }
    );
  }
}

// DELETE: Desactivar o eliminar un usuario
export async function DELETE(request: NextRequest) {
  // Validar autenticación del administrador
  const authResult = await validateAdminAuth(request);
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  // Obtener ID de usuario de la URL
  const url = new URL(request.url);
  const userId = url.searchParams.get('id');

  if (!userId) {
    return NextResponse.json(
      { error: 'Se requiere el ID del usuario' }, 
      { status: 400 }
    );
  }

  // Buscar el usuario por ID
  const index = usuarios.findIndex(u => u.id === userId);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Usuario no encontrado' }, 
      { status: 404 }
    );
  }

  // En un entorno real, dependiendo de los requisitos, podríamos:
  // 1. Eliminar completamente el usuario de la base de datos
  // 2. Marcar el usuario como inactivo (soft delete)
  
  // Para esta implementación, marcaremos como inactivo
  usuarios[index] = {
    ...usuarios[index],
    estado: 'inactivo'
  };

  return NextResponse.json({ 
    message: 'Usuario desactivado correctamente',
    id: userId
  });
}
