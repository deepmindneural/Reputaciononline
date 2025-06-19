import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET - Obtener usuario por email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (!email && !id) {
      return NextResponse.json({ error: 'Email o ID requerido' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: email ? { email } : { id: id! },
      include: {
        socialMedia: true,
        mediaSources: true,
        userStats: true,
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Remover password de la respuesta
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      name, 
      company, 
      phone, 
      bio, 
      avatarUrl, 
      role = 'user',
      plan = 'free',
      credits = 100,
      profileType,
      category,
      brandName,
      otherCategory,
      onboardingCompleted = false
    } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, contraseña y nombre son requeridos' }, { status: 400 });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        company,
        phone,
        bio,
        avatarUrl,
        role,
        plan,
        credits,
        profileType,
        category,
        brandName,
        otherCategory,
        onboardingCompleted,
        lastLogin: new Date()
      },
      include: {
        socialMedia: true,
        mediaSources: true,
        userStats: true
      }
    });

    // Crear UserStats inicial
    await prisma.userStats.create({
      data: {
        userId: user.id,
        totalMentions: 0,
        positiveMentions: 0,
        negativeMentions: 0,
        neutralMentions: 0,
        sentimentScore: 0,
        influenceScore: 0,
        engagementRate: 0
      }
    });

    // Remover password de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error('Error creando usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar usuario
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, email, ...updateData } = body;

    // Usar userId si se proporciona, sino id, sino email
    const whereClause = userId ? { id: userId } : (id ? { id } : { email });

    if (!userId && !id && !email) {
      return NextResponse.json({ error: 'ID, userId o email requerido' }, { status: 400 });
    }

    // Si se proporciona una nueva contraseña, encriptarla
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const user = await prisma.user.update({
      where: whereClause,
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        socialMedia: true,
        mediaSources: true,
        userStats: true
      }
    });

    // Remover password de la respuesta
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
