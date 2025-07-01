#!/usr/bin/env node

// Script de inicio para configurar variables de entorno en runtime
// Este script se ejecuta cada vez que el contenedor inicia en producción

console.log('🚀 Iniciando aplicación Reputación Online...');

// Configurar variables de entorno requeridas si no están presentes
// No necesitamos DATABASE_URL para SQLite directo
// if (!process.env.DATABASE_URL) {
//   process.env.DATABASE_URL = 'file:/app/data/app.db';
//   console.log('🔧 DATABASE_URL configurada: file:/app/data/app.db');
// }

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = 'reputacion-online-secret-' + Date.now();
  console.log('🔧 NEXTAUTH_SECRET configurada con valor generado');
}

if (!process.env.NEXTAUTH_URL) {
  // Detectar URL automáticamente basado en el entorno
  const url = process.env.COOLIFY_FQDN 
    ? `https://${process.env.COOLIFY_FQDN}`
    : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : process.env.RAILWAY_STATIC_URL
    ? `https://${process.env.RAILWAY_STATIC_URL}`
    : 'http://localhost:3000';
  
  process.env.NEXTAUTH_URL = url;
  console.log(`🔧 NEXTAUTH_URL configurada: ${url}`);
}

// Configurar puerto para Next.js
if (!process.env.PORT) {
  process.env.PORT = '3000';
  console.log('🔧 PORT configurado: 3000');
}

if (!process.env.HOSTNAME) {
  process.env.HOSTNAME = '0.0.0.0';
  console.log('🔧 HOSTNAME configurado: 0.0.0.0');
}

console.log('✅ Variables de entorno configuradas para runtime');

// Crear directorio para SQLite si no existe
const fs = require('fs');
const path = require('path');

const dataDir = '/app/data';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Directorio /app/data creado para SQLite');
}

console.log('🗄️  Inicializando base de datos SQLite...');
initializeDatabase();

async function initializeDatabase() {
  try {
    // Importar dinámicamente para evitar problemas en build
    const { forceInitializeDatabase } = await import('./src/lib/database.ts');
    const success = await forceInitializeDatabase();
    if (success) {
      console.log('🎯 Base de datos lista, iniciando Next.js...');
      startNextJs();
    } else {
      console.error('❌ Error inicializando base de datos, iniciando Next.js de todas formas...');
      startNextJs();
    }
  } catch (error) {
    console.error('❌ Error importando database:', error);
    console.log('🎯 Iniciando Next.js sin inicialización de base de datos...');
    startNextJs();
  }
}

function startNextJs() {
  console.log('🎯 Iniciando Next.js...');
  
  // Para Next.js con output: standalone, usar server.js directamente
  const { spawn } = require('child_process');
  const serverPath = '.next/standalone/server.js';
  
  // Verificar si existe el archivo server.js (build standalone)
  const fs = require('fs');
  let nextProcess;
  
  if (fs.existsSync(serverPath)) {
    console.log('📦 Usando modo standalone de Next.js');
    nextProcess = spawn('node', [serverPath], {
      stdio: 'inherit',
      env: {
        ...process.env,
        HOSTNAME: '0.0.0.0',
        PORT: process.env.PORT || '3000'
      }
    });
  } else {
    console.log('🔧 Usando modo de desarrollo de Next.js');
    nextProcess = spawn('npx', ['next', 'start'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        HOSTNAME: '0.0.0.0',
        PORT: process.env.PORT || '3000'
      }
    });
  }
  
  nextProcess.on('close', (code) => {
    console.log(`Next.js terminó con código: ${code}`);
    process.exit(code);
  });
  
  // Manejar señales para shutdown graceful
  process.on('SIGTERM', () => {
    console.log('🛑 Recibida señal SIGTERM, cerrando aplicación...');
    nextProcess.kill('SIGTERM');
  });
  
  process.on('SIGINT', () => {
    console.log('🛑 Recibida señal SIGINT, cerrando aplicación...');
    nextProcess.kill('SIGINT');
  });
}
