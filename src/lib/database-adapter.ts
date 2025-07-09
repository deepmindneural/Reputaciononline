// Adaptador de base de datos con detección automática y configuración inteligente
// Prioriza PostgreSQL pero permite fallback a SQLite en desarrollo local

// Importar configuración automática
import './env-loader';

interface DatabaseConfig {
  internal: string;
  external: string;
  username: string;
  password: string;
}

// Función para extraer credenciales de DATABASE_URL
function extractCredentialsFromEnv(): DatabaseConfig | null {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;
  
  const match = databaseUrl.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) return null;
  
  const [, username, password, host, port, database] = match;
  
  return {
    internal: databaseUrl,
    external: `postgres://${username}:${password}@localhost:5435/${database}`,
    username,
    password
  };
}

// Configuración de PostgreSQL para Coolify (con fallback automático)
const extractedConfig = extractCredentialsFromEnv();
if (extractedConfig) {
  console.log('🔧 DATABASE-ADAPTER: Usando credenciales extraídas de DATABASE_URL');
  console.log(`   Usuario: ${extractedConfig.username}`);
  console.log(`   Host: ${extractedConfig.internal.match(/@([^:]+):/)?.[1] || 'N/A'}`);
  console.log(`   Contraseña: ${extractedConfig.password.length} caracteres`);
} else {
  console.log('⚠️ DATABASE-ADAPTER: No se pudo extraer DATABASE_URL, usando credenciales por defecto');
}

const postgresConfig: DatabaseConfig = extractedConfig || {
  internal: 'postgres://postgres:admin123@rkgwkkss048ck00skskc08gs:5432/postgres',
  external: 'postgres://postgres:admin123@localhost:5435/postgres',
  username: 'postgres',
  password: 'admin123'
};

// Función para verificar si una URL es accesible
async function isUrlAccessible(url: string): Promise<boolean> {
  try {
    const { Pool } = require('pg');
    const testPool = new Pool({
      connectionString: url,
      ssl: false,
      connectionTimeoutMillis: 3000,
      max: 1
    });
    
    await testPool.query('SELECT 1');
    await testPool.end();
    return true;
  } catch (error) {
    return false;
  }
}

// Detectar entorno automáticamente
function detectEnvironment() {
  const nodeEnv = process.env.NODE_ENV;
  const coolifyFqdn = process.env.COOLIFY_FQDN;
  const vercelUrl = process.env.VERCEL_URL;
  const railwayUrl = process.env.RAILWAY_STATIC_URL;
  const isDockerContainer = process.env.IS_DOCKER || process.cwd() === '/app';
  
  return {
    isDevelopment: nodeEnv !== 'production',
    isProduction: nodeEnv === 'production',
    isCoolify: !!(coolifyFqdn || process.env.COOLIFY_URL),
    isVercel: !!vercelUrl,
    isRailway: !!railwayUrl,
    isLocal: !coolifyFqdn && !vercelUrl && !railwayUrl && !isDockerContainer,
    platform: coolifyFqdn ? 'coolify' : 
              vercelUrl ? 'vercel' : 
              railwayUrl ? 'railway' : 
              isDockerContainer ? 'docker' : 'local'
  };
}

// Configurar DATABASE_URL automáticamente si no existe
async function ensureDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    const env = detectEnvironment();
    
    console.log('🔍 DATABASE ADAPTER: Detectando configuración de PostgreSQL...');
    
    if (env.isCoolify || env.isProduction) {
      console.log('🔍 DATABASE ADAPTER: Entorno de producción detectado, probando conexión interna...');
      
      if (await isUrlAccessible(postgresConfig.internal)) {
        console.log('✅ DATABASE ADAPTER: Conexión interna exitosa');
        process.env.DATABASE_URL = postgresConfig.internal;
      } else {
        console.log('❌ DATABASE ADAPTER: Conexión interna falló, probando externa...');
        if (await isUrlAccessible(postgresConfig.external)) {
          console.log('✅ DATABASE ADAPTER: Conexión externa exitosa');
          process.env.DATABASE_URL = postgresConfig.external;
        } else {
          console.log('❌ DATABASE ADAPTER: Ambas conexiones fallaron');
          throw new Error('No se pudo conectar a PostgreSQL en ninguna configuración');
        }
      }
    } else if (env.isLocal) {
      console.log('🔍 DATABASE ADAPTER: Entorno local detectado, probando conexión externa...');
      
      if (await isUrlAccessible(postgresConfig.external)) {
        console.log('✅ DATABASE ADAPTER: Conexión externa exitosa');
        process.env.DATABASE_URL = postgresConfig.external;
      } else {
        console.log('❌ DATABASE ADAPTER: Conexión externa falló, probando interna...');
        if (await isUrlAccessible(postgresConfig.internal)) {
          console.log('✅ DATABASE ADAPTER: Conexión interna exitosa');
          process.env.DATABASE_URL = postgresConfig.internal;
        } else {
          console.log('❌ DATABASE ADAPTER: Ambas conexiones fallaron');
          throw new Error('No se pudo conectar a PostgreSQL en ninguna configuración');
        }
      }
    } else {
      console.log('🔍 DATABASE ADAPTER: Entorno desconocido, probando todas las configuraciones...');
      
      if (await isUrlAccessible(postgresConfig.internal)) {
        console.log('✅ DATABASE ADAPTER: Conexión interna exitosa');
        process.env.DATABASE_URL = postgresConfig.internal;
      } else if (await isUrlAccessible(postgresConfig.external)) {
        console.log('✅ DATABASE ADAPTER: Conexión externa exitosa');
        process.env.DATABASE_URL = postgresConfig.external;
      } else {
        console.log('❌ DATABASE ADAPTER: Ambas conexiones fallaron');
        throw new Error('No se pudo conectar a PostgreSQL en ninguna configuración');
      }
    }
  }
}

// Inicialización asíncrona del adaptador de base de datos
async function initializeAdapter() {
  // Verificar y configurar DATABASE_URL
  await ensureDatabaseUrl();

  const env = detectEnvironment();
  console.log('🔍 DATABASE ADAPTER: Entorno detectado:', env.platform);
  console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'NO CONFIGURADA');

  // Intentar conectar a PostgreSQL primero
  let usePostgres = true;
  let dbAdapter;

  try {
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      console.log('🐘 DATABASE ADAPTER: Intentando conectar a PostgreSQL...');
      dbAdapter = require('./database');
      console.log('✅ DATABASE ADAPTER: PostgreSQL conectado exitosamente');
    } else {
      throw new Error('DATABASE_URL no es PostgreSQL');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ DATABASE ADAPTER: Error conectando a PostgreSQL:', errorMessage);
    
    // Solo usar SQLite como fallback en desarrollo local
    if (env.isLocal && !env.isProduction) {
      console.log('🔄 DATABASE ADAPTER: Usando SQLite como fallback para desarrollo local');
      usePostgres = false;
      dbAdapter = require('./database-sqlite');
    } else {
      console.error('❌ DATABASE ADAPTER: PostgreSQL es requerido en producción');
      throw new Error('PostgreSQL es requerido - no se permite SQLite en producción');
    }
  }

  return {
    usePostgres,
    dbAdapter,
    env
  };
}

// Inicializar el adaptador
const adapterPromise = initializeAdapter();
let adapterResult: any = null;

// Función para obtener el adaptador inicializado
async function getAdapter() {
  if (!adapterResult) {
    adapterResult = await adapterPromise;
  }
  return adapterResult;
}

// Exportar servicios dinámicamente usando proxy
export const userService = new Proxy({} as any, {
  get: (target, prop) => {
    return async (...args: any[]) => {
      const adapter = await getAdapter();
      return adapter.dbAdapter.userService[prop](...args);
    };
  }
});

export const socialMediaService = new Proxy({} as any, {
  get: (target, prop) => {
    return async (...args: any[]) => {
      const adapter = await getAdapter();
      return adapter.dbAdapter.socialMediaService[prop](...args);
    };
  }
});

export const statsService = new Proxy({} as any, {
  get: (target, prop) => {
    return async (...args: any[]) => {
      const adapter = await getAdapter();
      return adapter.dbAdapter.statsService[prop](...args);
    };
  }
});

export const systemSettingsService = new Proxy({} as any, {
  get: (target, prop) => {
    return async (...args: any[]) => {
      const adapter = await getAdapter();
      return adapter.dbAdapter.systemSettingsService[prop](...args);
    };
  }
});

// Exportar información del adaptador usado
export const getDatabaseInfo = async () => {
  const adapter = await getAdapter();
  return {
    type: adapter.usePostgres ? 'postgresql' : 'sqlite',
    environment: adapter.env.platform,
    url: process.env.DATABASE_URL?.replace(/:([^@]+)@/, ':***@') || 'No configurada'
  };
};

// Exportar función para obtener el adaptador
export const getDatabase = async () => {
  const adapter = await getAdapter();
  return adapter.dbAdapter.default;
};