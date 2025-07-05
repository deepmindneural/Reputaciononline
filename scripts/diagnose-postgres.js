#!/usr/bin/env node

// Script de diagnóstico completo para PostgreSQL
const { Pool } = require('pg');

console.log('🔍 DIAGNÓSTICO COMPLETO DE POSTGRESQL');
console.log('=' .repeat(60));

// Mostrar todas las variables de entorno relacionadas
console.log('\n📋 Variables de entorno:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ NO configurada');
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? '✅ Configurada' : '❌ NO configurada');
console.log('NODE_ENV:', process.env.NODE_ENV || 'No definido');

// Mostrar la URL completa (ocultando parte de la contraseña)
if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL;
  const passwordMatch = url.match(/:([^@]+)@/);
  if (passwordMatch) {
    const password = passwordMatch[1];
    const maskedUrl = url.replace(password, password.substring(0, 3) + '***');
    console.log('DATABASE_URL value:', maskedUrl);
  }
}

// Intentar múltiples configuraciones
const configurations = [
  {
    name: 'Config 1: Variable de entorno DATABASE_URL',
    connectionString: process.env.DATABASE_URL
  },
  {
    name: 'Config 2: URL hardcodeada con admin123',
    connectionString: 'postgres://postgres:admin123@rkgwkkss048ck00skskc08gs:5432/postgres'
  },
  {
    name: 'Config 3: URL con host localhost',
    connectionString: 'postgres://postgres:admin123@localhost:5432/postgres'
  },
  {
    name: 'Config 4: URL con IP del contenedor PostgreSQL',
    connectionString: 'postgres://postgres:admin123@postgresql-database-rkgwkkss048ck00skskc08gs:5432/postgres'
  }
];

async function testConnection(config) {
  console.log(`\n🔧 Probando: ${config.name}`);
  
  if (!config.connectionString) {
    console.log('❌ No hay connectionString para esta configuración');
    return;
  }

  const pool = new Pool({
    connectionString: config.connectionString,
    ssl: false,
    max: 1,
    connectionTimeoutMillis: 5000,
  });

  try {
    const client = await pool.connect();
    console.log('✅ CONEXIÓN EXITOSA!');
    
    const result = await client.query('SELECT NOW()');
    console.log('   Hora del servidor:', result.rows[0].now);
    
    const dbResult = await client.query('SELECT current_database()');
    console.log('   Base de datos:', dbResult.rows[0].current_database);
    
    client.release();
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    if (error.code === '28P01') {
      console.log('   → La contraseña es incorrecta');
    } else if (error.code === 'ENOTFOUND') {
      console.log('   → El host no se puede resolver');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('   → Conexión rechazada (puerto cerrado o servicio no disponible)');
    }
  } finally {
    await pool.end();
  }
}

async function runDiagnostics() {
  console.log('\n🚀 Iniciando diagnóstico...\n');
  
  // Probar todas las configuraciones
  for (const config of configurations) {
    await testConnection(config);
  }
  
  console.log('\n📊 RESUMEN:');
  console.log('Si ninguna conexión funcionó, posibles causas:');
  console.log('1. La contraseña "admin123" no es correcta');
  console.log('2. El host "rkgwkkss048ck00skskc08gs" no es accesible desde el contenedor de la app');
  console.log('3. PostgreSQL no está escuchando en el puerto 5432');
  console.log('4. Hay un firewall o configuración de red bloqueando la conexión');
  
  console.log('\n💡 SOLUCIONES SUGERIDAS:');
  console.log('1. Verificar la contraseña real en Coolify (pestaña de la base de datos)');
  console.log('2. Verificar que ambos contenedores estén en la misma red de Docker');
  console.log('3. Intentar con el nombre del servicio PostgreSQL en lugar del hash');
  console.log('4. Verificar los logs de PostgreSQL para ver intentos de conexión');
}

runDiagnostics()
  .then(() => {
    console.log('\n✅ Diagnóstico completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });