import { NextRequest, NextResponse } from 'next/server';
import { validateAdminAuth } from '../route';

// Tipos para las transacciones de cru00e9ditos
interface Transaccion {
  id: string;
  fecha: string;
  usuarioId: string;
  usuario: string;
  tipo: 'asignacion' | 'consumo';
  cantidad: number;
  canal?: string;
  estado: 'completado' | 'pendiente' | 'fallido';
  descripcion?: string;
  admin?: string;
}

// Datos simulados de transacciones de cru00e9ditos (en un entorno real, esto estaru00eda en una base de datos)
const transacciones: Transaccion[] = [
  {
    id: 'TRX-001',
    fecha: '2025-05-28',
    usuarioId: 'USR-001',
    usuario: 'Carlos Garcu00eda',
    tipo: 'asignacion',
    cantidad: 10000,
    estado: 'completado',
    descripcion: 'Asignaciu00f3n de cru00e9ditos por compra de plan Premium',
    admin: 'ADM-001'
  },
  {
    id: 'TRX-002',
    fecha: '2025-05-28',
    usuarioId: 'USR-002',
    usuario: 'Maru00eda Lu00f3pez',
    tipo: 'consumo',
    cantidad: 350,
    canal: 'facebook',
    estado: 'completado',
    descripcion: 'Anu00e1lisis de perfil de Facebook'
  },
  {
    id: 'TRX-003',
    fecha: '2025-05-27',
    usuarioId: 'USR-003',
    usuario: 'Juan Martu00ednez',
    tipo: 'consumo',
    cantidad: 275,
    canal: 'instagram',
    estado: 'completado',
    descripcion: 'Anu00e1lisis de perfil de Instagram'
  },
  {
    id: 'TRX-004',
    fecha: '2025-05-27',
    usuarioId: 'USR-004',
    usuario: 'Laura Hernu00e1ndez',
    tipo: 'asignacion',
    cantidad: 5000,
    estado: 'completado',
    descripcion: 'Asignaciu00f3n de cru00e9ditos por compra de plan Bu00e1sico',
    admin: 'ADM-001'
  },
  {
    id: 'TRX-005',
    fecha: '2025-05-26',
    usuarioId: 'USR-005',
    usuario: 'Roberto Su00e1nchez',
    tipo: 'consumo',
    cantidad: 520,
    canal: 'twitter',
    estado: 'completado',
    descripcion: 'Anu00e1lisis de perfil de Twitter'
  },
  {
    id: 'TRX-006',
    fecha: '2025-05-26',
    usuarioId: 'USR-001',
    usuario: 'Carlos Garcu00eda',
    tipo: 'asignacion',
    cantidad: 20000,
    estado: 'completado',
    descripcion: 'Asignaciu00f3n de cru00e9ditos por compra de plan Enterprise',
    admin: 'ADM-002'
  },
  {
    id: 'TRX-007',
    fecha: '2025-05-25',
    usuarioId: 'USR-003',
    usuario: 'Juan Martu00ednez',
    tipo: 'consumo',
    cantidad: 180,
    canal: 'linkedin',
    estado: 'completado',
    descripcion: 'Anu00e1lisis de perfil de LinkedIn'
  },
  {
    id: 'TRX-008',
    fecha: '2025-05-25',
    usuarioId: 'USR-002',
    usuario: 'Maru00eda Lu00f3pez',
    tipo: 'consumo',
    cantidad: 420,
    canal: 'facebook',
    estado: 'completado',
    descripcion: 'Anu00e1lisis de perfil de Facebook'
  },
  {
    id: 'TRX-009',
    fecha: '2025-05-24',
    usuarioId: 'USR-004',
    usuario: 'Laura Hernu00e1ndez',
    tipo: 'asignacion',
    cantidad: 15000,
    estado: 'completado',
    descripcion: 'Asignaciu00f3n de cru00e9ditos por compra de plan Pro',
    admin: 'ADM-001'
  },
  {
    id: 'TRX-010',
    fecha: '2025-05-24',
    usuarioId: 'USR-005',
    usuario: 'Roberto Su00e1nchez',
    tipo: 'consumo',
    cantidad: 390,
    canal: 'instagram',
    estado: 'completado',
    descripcion: 'Anu00e1lisis de perfil de Instagram'
  },
];

// GET: Obtener todas las transacciones o una transacciu00f3n especu00edfica por ID
export async function GET(request: NextRequest) {
  // Validar autenticaciu00f3n del administrador
  const authResult = await validateAdminAuth(request);
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  // Obtener ID de transacciu00f3n de la URL si existe
  const url = new URL(request.url);
  const transaccionId = url.searchParams.get('id');
  const usuarioId = url.searchParams.get('usuarioId');

  if (transaccionId) {
    // Buscar transacciu00f3n por ID
    const transaccion = transacciones.find(t => t.id === transaccionId);
    if (!transaccion) {
      return NextResponse.json({ error: 'Transacciu00f3n no encontrada' }, { status: 404 });
    }
    return NextResponse.json(transaccion);
  }

  // Filtrar por ID de usuario si se proporciona
  let transaccionesFiltradas = [...transacciones];
  if (usuarioId) {
    transaccionesFiltradas = transaccionesFiltradas.filter(t => t.usuarioId === usuarioId);
  }

  // Obtener paru00e1metros de paginaciu00f3n y filtrado
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const tipo = url.searchParams.get('tipo') || '';
  const fechaInicio = url.searchParams.get('fechaInicio') || '';
  const fechaFin = url.searchParams.get('fechaFin') || '';
  const canal = url.searchParams.get('canal') || '';
  const estado = url.searchParams.get('estado') || '';

  // Aplicar filtros adicionales
  if (tipo) {
    transaccionesFiltradas = transaccionesFiltradas.filter(t => t.tipo === tipo);
  }

  if (fechaInicio) {
    transaccionesFiltradas = transaccionesFiltradas.filter(t => t.fecha >= fechaInicio);
  }

  if (fechaFin) {
    transaccionesFiltradas = transaccionesFiltradas.filter(t => t.fecha <= fechaFin);
  }

  if (canal) {
    transaccionesFiltradas = transaccionesFiltradas.filter(t => t.canal === canal);
  }

  if (estado) {
    transaccionesFiltradas = transaccionesFiltradas.filter(t => t.estado === estado);
  }

  // Ordenar por fecha, mu00e1s reciente primero
  transaccionesFiltradas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  // Calcular paginaciu00f3n
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedTransacciones = transaccionesFiltradas.slice(startIndex, endIndex);

  // Preparar resumen estadu00edstico
  const totalAsignaciones = transaccionesFiltradas.filter(t => t.tipo === 'asignacion')
    .reduce((sum, t) => sum + t.cantidad, 0);
  
  const totalConsumos = transaccionesFiltradas.filter(t => t.tipo === 'consumo')
    .reduce((sum, t) => sum + t.cantidad, 0);

  // Agrupar por canal para estadu00edsticas
  const consumoPorCanal = transaccionesFiltradas
    .filter(t => t.tipo === 'consumo' && t.canal)
    .reduce((acc: Record<string, number>, t) => {
      const canal = t.canal || 'otros';
      acc[canal] = (acc[canal] || 0) + t.cantidad;
      return acc;
    }, {});

  return NextResponse.json({
    transacciones: paginatedTransacciones,
    total: transaccionesFiltradas.length,
    page,
    limit,
    totalPages: Math.ceil(transaccionesFiltradas.length / limit),
    estadisticas: {
      totalAsignaciones,
      totalConsumos,
      saldoNeto: totalAsignaciones - totalConsumos,
      consumoPorCanal
    }
  });
}

// POST: Registrar una nueva transacciu00f3n de cru00e9ditos (asignaciu00f3n)
export async function POST(request: NextRequest) {
  // Validar autenticaciu00f3n del administrador
  const authResult = await validateAdminAuth(request);
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.usuarioId || !data.cantidad || data.cantidad <= 0) {
      return NextResponse.json(
        { error: 'Datos incompletos. Se requiere usuarioId y cantidad positiva' }, 
        { status: 400 }
      );
    }

    // Crear nueva transacciu00f3n (en un entorno real, se guardaru00eda en la base de datos)
    const nuevaTransaccion: Transaccion = {
      id: `TRX-${(transacciones.length + 1).toString().padStart(3, '0')}`,
      fecha: new Date().toISOString().split('T')[0],
      usuarioId: data.usuarioId,
      usuario: data.usuario || `Usuario ${data.usuarioId}`, // En un entorno real, se buscaru00eda el nombre del usuario
      tipo: 'asignacion',
      cantidad: data.cantidad,
      estado: 'completado',
      descripcion: data.descripcion || 'Asignaciu00f3n de cru00e9ditos',
      admin: authResult.adminId
    };

    // En un entorno real, aquu00ed tambiu00e9n se actualizaru00eda el saldo de cru00e9ditos del usuario

    // Guardar la transacciu00f3n
    transacciones.push(nuevaTransaccion);

    return NextResponse.json(nuevaTransaccion, { status: 201 });
  } catch (error) {
    console.error('Error al registrar transacciu00f3n:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' }, 
      { status: 500 }
    );
  }
}

// PUT: Actualizar el estado de una transacciu00f3n
export async function PUT(request: NextRequest) {
  // Validar autenticaciu00f3n del administrador
  const authResult = await validateAdminAuth(request);
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Validar ID de transacciu00f3n
    if (!data.id) {
      return NextResponse.json(
        { error: 'Se requiere el ID de la transacciu00f3n' }, 
        { status: 400 }
      );
    }

    // Buscar la transacciu00f3n por ID
    const index = transacciones.findIndex(t => t.id === data.id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Transacciu00f3n no encontrada' }, 
        { status: 404 }
      );
    }

    // Validar que solo se pueda cambiar ciertos campos como el estado o la descripciu00f3n
    // No permitir cambios en campos como usuarioId, cantidad, tipo, etc.
    const transaccionActualizada = {
      ...transacciones[index],
      estado: data.estado || transacciones[index].estado,
      descripcion: data.descripcion || transacciones[index].descripcion
    };

    transacciones[index] = transaccionActualizada;

    return NextResponse.json(transaccionActualizada);
  } catch (error) {
    console.error('Error al actualizar transacciu00f3n:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' }, 
      { status: 500 }
    );
  }
}

// Endpoint para estadu00edsticas de cru00e9ditos
export async function PATCH(request: NextRequest) {
  // Validar autenticaciu00f3n del administrador
  const authResult = await validateAdminAuth(request);
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  // Obtener paru00e1metros para filtrar las estadu00edsticas
  const url = new URL(request.url);
  const periodo = url.searchParams.get('periodo') || 'mes'; // mes, semana, au00f1o
  
  // Calcular fecha lu00edmite segu00fan el periodo
  const hoy = new Date();
  let fechaLimite = new Date();
  
  if (periodo === 'semana') {
    fechaLimite.setDate(hoy.getDate() - 7);
  } else if (periodo === 'mes') {
    fechaLimite.setMonth(hoy.getMonth() - 1);
  } else if (periodo === 'au00f1o') {
    fechaLimite.setFullYear(hoy.getFullYear() - 1);
  }
  
  const fechaLimiteStr = fechaLimite.toISOString().split('T')[0];
  
  // Filtrar transacciones por periodo
  const transaccionesPeriodo = transacciones.filter(t => t.fecha >= fechaLimiteStr);
  
  // Calcular estadu00edsticas
  const totalAsignaciones = transaccionesPeriodo
    .filter(t => t.tipo === 'asignacion')
    .reduce((sum, t) => sum + t.cantidad, 0);
    
  const totalConsumos = transaccionesPeriodo
    .filter(t => t.tipo === 'consumo')
    .reduce((sum, t) => sum + t.cantidad, 0);
  
  // Consumo por canal
  const consumoPorCanal = transaccionesPeriodo
    .filter(t => t.tipo === 'consumo' && t.canal)
    .reduce((acc: Record<string, number>, t) => {
      const canal = t.canal || 'otros';
      acc[canal] = (acc[canal] || 0) + t.cantidad;
      return acc;
    }, {});
  
  // Cru00e9ditos por usuario (top 5)
  const creditosPorUsuario = Object.entries(
    transaccionesPeriodo.reduce((acc: Record<string, { usuario: string, asignados: number, consumidos: number }>, t) => {
      if (!acc[t.usuarioId]) {
        acc[t.usuarioId] = { usuario: t.usuario, asignados: 0, consumidos: 0 };
      }
      
      if (t.tipo === 'asignacion') {
        acc[t.usuarioId].asignados += t.cantidad;
      } else {
        acc[t.usuarioId].consumidos += t.cantidad;
      }
      
      return acc;
    }, {})
  )
  .map(([id, data]) => ({
    id,
    usuario: data.usuario,
    asignados: data.asignados,
    consumidos: data.consumidos,
    saldo: data.asignados - data.consumidos
  }))
  .sort((a, b) => b.consumidos - a.consumidos)
  .slice(0, 5);
  
  // Tendencia de uso diario para el periodo
  const tendenciaUso: Record<string, { asignados: number, consumidos: number }> = {};
  
  // Inicializar todas las fechas en el periodo
  let fechaActual = new Date(fechaLimiteStr);
  while (fechaActual <= hoy) {
    const fechaStr = fechaActual.toISOString().split('T')[0];
    tendenciaUso[fechaStr] = { asignados: 0, consumidos: 0 };
    fechaActual.setDate(fechaActual.getDate() + 1);
  }
  
  // Llenar con datos reales
  transaccionesPeriodo.forEach(t => {
    if (t.tipo === 'asignacion') {
      tendenciaUso[t.fecha].asignados += t.cantidad;
    } else {
      tendenciaUso[t.fecha].consumidos += t.cantidad;
    }
  });
  
  // Convertir a array para la respuesta
  const tendenciaArray = Object.entries(tendenciaUso).map(([fecha, datos]) => ({
    fecha,
    asignados: datos.asignados,
    consumidos: datos.consumidos
  }));
  
  return NextResponse.json({
    periodo,
    fechaInicio: fechaLimiteStr,
    fechaFin: hoy.toISOString().split('T')[0],
    totalTransacciones: transaccionesPeriodo.length,
    totalAsignaciones,
    totalConsumos,
    saldoNeto: totalAsignaciones - totalConsumos,
    consumoPorCanal,
    creditosPorUsuario,
    tendenciaUso: tendenciaArray
  });
}
