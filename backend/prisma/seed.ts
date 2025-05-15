import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando población de datos iniciales...');

  // Crear usuarios de prueba
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('usuario123', 10);

  // Crear admin
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@reputaciononline.co' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@reputaciononline.co',
      password: adminPassword,
      rol: 'admin',
      creditosDisponibles: 100000,
      creditosGastados: 5000,
      estado: 'activo',
      plan: 'empresarial'
    },
  });

  // Crear usuario
  const usuario = await prisma.usuario.upsert({
    where: { email: 'usuario@gmail.com' },
    update: {},
    create: {
      nombre: 'Usuario Demo',
      email: 'usuario@gmail.com',
      password: userPassword,
      rol: 'usuario',
      creditosDisponibles: 15000,
      creditosGastados: 5000,
      estado: 'activo',
      plan: 'profesional'
    },
  });

  // Crear planes
  const planes = await Promise.all([
    prisma.plan.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nombre: 'Básico',
        creditos: 5000,
        precio: 299000,
        caracteristicas: JSON.stringify([
          'Monitoreo de 3 redes sociales',
          'Hasta 10 palabras clave',
          'Reportes semanales',
        ])
      }
    }),
    prisma.plan.upsert({
      where: { id: 2 },
      update: {},
      create: {
        nombre: 'Profesional',
        creditos: 15000,
        precio: 699000,
        caracteristicas: JSON.stringify([
          'Monitoreo de todas las redes sociales',
          'Hasta 30 palabras clave',
          'Reportes diarios',
          'Análisis de sentimientos',
        ]),
        destacado: true
      }
    }),
    prisma.plan.upsert({
      where: { id: 3 },
      update: {},
      create: {
        nombre: 'Empresarial',
        creditos: 50000,
        precio: 1499000,
        caracteristicas: JSON.stringify([
          'Monitoreo ilimitado de redes',
          'Palabras clave ilimitadas',
          'Reportes personalizados',
          'Análisis avanzado con IA',
          'Soporte prioritario',
        ])
      }
    })
  ]);

  // Crear algunas transacciones de créditos
  const transacciones = await Promise.all([
    prisma.credito.create({
      data: {
        usuarioId: usuario.id,
        tipo: 'recarga',
        cantidad: 15000,
        descripcion: 'Compra inicial de plan Profesional'
      }
    }),
    prisma.credito.create({
      data: {
        usuarioId: usuario.id,
        tipo: 'consumo',
        cantidad: 500,
        descripcion: 'Análisis de menciones en X',
        canal: 'X'
      }
    }),
    prisma.credito.create({
      data: {
        usuarioId: usuario.id,
        tipo: 'consumo',
        cantidad: 300,
        descripcion: 'Análisis de sentimientos Instagram',
        canal: 'Instagram'
      }
    })
  ]);

  // Crear un monitoreo
  const monitoreo = await prisma.monitoreo.create({
    data: {
      nombre: 'Monitoreo de Marca',
      tipo: 'red_social',
      canal: 'Instagram',
      palabrasClave: JSON.stringify(['marca', 'producto', 'servicio']),
      frecuencia: 'diario',
      usuarioId: usuario.id
    }
  });

  // Crear algunas menciones
  await prisma.mencion.createMany({
    data: [
      {
        monitoreoId: monitoreo.id,
        usuarioId: usuario.id,
        contenido: 'Esta marca es increíble, me encanta su servicio',
        url: 'https://instagram.com/post/123',
        autor: '@usuario_feliz',
        canal: 'Instagram',
        sentimiento: 'positivo',
        impacto: 7
      },
      {
        monitoreoId: monitoreo.id,
        usuarioId: usuario.id,
        contenido: 'No estoy muy contento con la atención recibida',
        url: 'https://instagram.com/post/456',
        autor: '@cliente_molesto',
        canal: 'Instagram',
        sentimiento: 'negativo',
        impacto: 4
      }
    ]
  });

  // Crear alertas
  await prisma.alerta.create({
    data: {
      usuarioId: usuario.id,
      titulo: 'Mención negativa detectada',
      descripcion: 'Se ha detectado una mención negativa que requiere atención',
      tipo: 'mencion_negativa'
    }
  });

  console.log('Datos iniciales creados exitosamente');
}

main()
  .catch((e) => {
    console.error('Error al poblar la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
