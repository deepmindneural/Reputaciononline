// src/services/authServiceReal.ts
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@/context/UserContext';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  company?: string;
  phone?: string;
}

// Registrar nuevo usuario
export const register = async (userData: RegisterData): Promise<LoginResponse> => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await db.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      return { success: false, message: 'El usuario ya existe' };
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Crear el usuario en la base de datos
    const newUser = await db.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        company: userData.company,
        phone: userData.phone,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=01257D&color=fff`,
        credits: 1000, // Créditos iniciales
        onboardingCompleted: false
      },
      include: {
        socialMedia: true,
        mediaSources: {
          include: {
            mediaSource: true
          }
        },
        userStats: true
      }
    });

    // Generar token JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Convertir a formato User del contexto
    const user: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      company: newUser.company,
      phone: newUser.phone,
      bio: newUser.bio,
      avatarUrl: newUser.avatarUrl,
      role: newUser.role,
      plan: newUser.plan,
      credits: newUser.credits,
      profileType: newUser.profileType,
      category: newUser.category,
      brandName: newUser.brandName,
      otherCategory: newUser.otherCategory,
      onboardingCompleted: newUser.onboardingCompleted,
      createdAt: newUser.createdAt.toISOString(),
      lastLogin: newUser.lastLogin?.toISOString(),
      nextBillingDate: newUser.nextBillingDate?.toISOString(),
      socialMedia: newUser.socialMedia.map(sm => ({
        platform: sm.platform,
        username: sm.username,
        followers: sm.followers,
        connected: sm.connected,
        profileUrl: sm.profileUrl
      }))
    };

    return { success: true, user, token };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
};

// Iniciar sesión
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('🔍 AUTH: Iniciando login para email:', email);
    
    // Buscar usuario en la base de datos (consulta simplificada)
    console.log('🔍 AUTH: Buscando usuario en base de datos...');
    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('❌ AUTH: Usuario no encontrado en BD:', email);
      return { success: false, message: 'Credenciales incorrectas' };
    }

    console.log('✅ AUTH: Usuario encontrado:', { id: user.id, name: user.name, email: user.email });

    // Verificar contraseña
    console.log('🔍 AUTH: Verificando contraseña...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔍 AUTH: Resultado verificación contraseña:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ AUTH: Contraseña incorrecta');
      return { success: false, message: 'Credenciales incorrectas' };
    }

    console.log('✅ AUTH: Contraseña válida, actualizando último login...');
    // Actualizar último login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    console.log('🔍 AUTH: Generando token JWT...');
    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('✅ AUTH: Token JWT generado exitosamente');

    // Convertir a formato User del contexto (sin relaciones complejas)
    const userResponse: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      company: user.company,
      phone: user.phone,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: user.role,
      plan: user.plan,
      credits: user.credits,
      profileType: user.profileType,
      category: user.category,
      brandName: user.brandName,
      otherCategory: user.otherCategory,
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString(),
      nextBillingDate: user.nextBillingDate?.toISOString(),
      socialMedia: [] // Se cargará por separado si es necesario
    };

    console.log('✅ AUTH: Login exitoso para usuario:', userResponse.name);
    return { success: true, user: userResponse, token };
  } catch (error) {
    console.error('💥 AUTH ERROR:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
};

// Obtener usuario por token
export const getUserByToken = async (token: string): Promise<User | null> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      include: {
        socialMedia: true,
        mediaSources: {
          include: {
            mediaSource: true
          }
        },
        userStats: true
      }
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      company: user.company,
      phone: user.phone,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: user.role,
      plan: user.plan,
      credits: user.credits,
      profileType: user.profileType,
      category: user.category,
      brandName: user.brandName,
      otherCategory: user.otherCategory,
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString(),
      nextBillingDate: user.nextBillingDate?.toISOString(),
      socialMedia: user.socialMedia.map(sm => ({
        platform: sm.platform,
        username: sm.username,
        followers: sm.followers,
        connected: sm.connected,
        profileUrl: sm.profileUrl
      }))
    };
  } catch (error) {
    console.error('Error getting user by token:', error);
    return null;
  }
};

// Actualizar perfil de usuario
export const updateUserProfile = async (userId: string, updateData: Partial<User>): Promise<LoginResponse> => {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: updateData.name,
        company: updateData.company,
        phone: updateData.phone,
        bio: updateData.bio,
        avatarUrl: updateData.avatarUrl,
        profileType: updateData.profileType,
        category: updateData.category,
        brandName: updateData.brandName,
        otherCategory: updateData.otherCategory,
        onboardingCompleted: updateData.onboardingCompleted
      },
      include: {
        socialMedia: true,
        mediaSources: {
          include: {
            mediaSource: true
          }
        },
        userStats: true
      }
    });

    const user: User = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      company: updatedUser.company,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      avatarUrl: updatedUser.avatarUrl,
      role: updatedUser.role,
      plan: updatedUser.plan,
      credits: updatedUser.credits,
      profileType: updatedUser.profileType,
      category: updatedUser.category,
      brandName: updatedUser.brandName,
      otherCategory: updatedUser.otherCategory,
      onboardingCompleted: updatedUser.onboardingCompleted,
      createdAt: updatedUser.createdAt.toISOString(),
      lastLogin: updatedUser.lastLogin?.toISOString(),
      nextBillingDate: updatedUser.nextBillingDate?.toISOString(),
      socialMedia: updatedUser.socialMedia.map(sm => ({
        platform: sm.platform,
        username: sm.username,
        followers: sm.followers,
        connected: sm.connected,
        profileUrl: sm.profileUrl
      }))
    };

    return { success: true, user };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, message: 'Error actualizando el perfil' };
  }
};

// Guardar token en localStorage (cliente)
export const saveAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Obtener token desde localStorage (cliente)
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Limpiar datos de autenticación
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  }
};

// Verificar si está autenticado
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};
