#!/usr/bin/env node

// Script para probar diferentes formatos de URL de PostgreSQL
console.log('🔍 TEST-URL-FORMATS: Probando diferentes formatos de URL...');

const { Pool } = require('pg');
const { URL } = require('url');

// Función para probar una URL
async function testUrl(urlString, description) {
  console.log(`\n🔍 Probando: ${description}`);
  console.log(`   URL: ${urlString.replace(/:([^@]+)@/, ':***@')}`);
  
  try {
    // Analizar URL con Node.js URL parser
    const url = new URL(urlString);
    console.log('📋 Análisis con URL parser de Node.js:');
    console.log(`   Protocol: ${url.protocol}`);
    console.log(`   Username: ${url.username}`);
    console.log(`   Password: ${url.password}`);
    console.log(`   Password length: ${url.password.length}`);
    console.log(`   Hostname: ${url.hostname}`);
    console.log(`   Port: ${url.port}`);
    console.log(`   Pathname: ${url.pathname}`);
    
    // Analizar con regex
    const match = urlString.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (match) {
      const [, user, password, host, port, database] = match;
      console.log('📋 Análisis con regex:');
      console.log(`   Usuario: ${user}`);
      console.log(`   Contraseña: "${password}"`);
      console.log(`   Longitud: ${password.length}`);
      console.log(`   Host: ${host}`);
      console.log(`   Puerto: ${port}`);
      console.log(`   Base de datos: ${database}`);
    }
    
    // Probar conexión
    const pool = new Pool({ connectionString: urlString, ssl: false });
    
    try {
      const client = await pool.connect();
      console.log('✅ CONEXIÓN EXITOSA');
      client.release();
    } catch (error) {
      console.log('❌ ERROR DE CONEXIÓN:');
      console.log(`   ${error.message}`);
      console.log(`   Código: ${error.code}`);
    } finally {
      await pool.end();
    }
    
  } catch (error) {
    console.log('❌ ERROR AL ANALIZAR URL:');
    console.log(`   ${error.message}`);
  }
}

// URLs a probar
const urls = [
  {
    url: 'postgres://postgres:admin123@rkgwkkss048ck00skskc08gs:5432/postgres',
    description: 'URL original'
  },
  {
    url: 'postgresql://postgres:admin123@rkgwkkss048ck00skskc08gs:5432/postgres',
    description: 'URL con postgresql://'
  },
  {
    url: 'postgres://postgres:admin123@rkgwkkss048ck00skskc08gs:5432/postgres?sslmode=disable',
    description: 'URL con parámetro sslmode'
  },
  {
    url: 'postgres://postgres%3Aadmin123@rkgwkkss048ck00skskc08gs:5432/postgres',
    description: 'URL con username:password URL-encoded'
  },
  {
    url: 'postgres://postgres:admin%40123@rkgwkkss048ck00skskc08gs:5432/postgres',
    description: 'URL con @ codificado en password'
  }
];

// Si hay DATABASE_URL, también probarla
if (process.env.DATABASE_URL) {
  urls.push({
    url: process.env.DATABASE_URL,
    description: 'DATABASE_URL del entorno'
  });
}

// Función principal
async function main() {
  console.log('🚀 TEST-URL-FORMATS: Iniciando pruebas...');
  
  for (const { url, description } of urls) {
    await testUrl(url, description);
    console.log('\n' + '='.repeat(60));
  }
  
  console.log('\n🏁 TEST-URL-FORMATS: Pruebas completadas');
}

main().catch(console.error);