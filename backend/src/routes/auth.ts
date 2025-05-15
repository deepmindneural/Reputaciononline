import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Registro
router.post('/registro', async (req, res) => {
  try {
    const { email, password, nombre } = req.body;
    console.log("Intentando registrar usuario:", { email, nombre });
    
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ message: 'Usuario ya existe' });

    const hash = await bcrypt.hash(password, 10);
    
    // Para depurar - mostramos la estructura a crear
    console.log("Intentando crear usuario con:", { email, nombre, rol: "usuario" });
    
    const nuevo = await prisma.usuario.create({
      data: { 
        email, 
        password: hash, 
        nombre,
        rol: "usuario" // Asegurar que rol esté explícitamente definido
      },
    });
    
    console.log("Usuario creado:", nuevo);
    
    // Generar token y devolver junto al usuario
    const token = jwt.sign({ id: nuevo.id, rol: nuevo.rol }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: nuevo });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: 'Error en registro' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'No encontrado' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: user.id, rol: user.rol }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error en login' });
  }
});

export default router;
