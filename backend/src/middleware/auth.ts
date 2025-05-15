import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
  user?: { id: number; rol: string };
}

// Middleware para autenticar a cualquier usuario
export const isAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Sin token' });

  const [scheme, token] = auth.split(' ');
  if (scheme !== 'Bearer' || !token)
    return res.status(401).json({ message: 'Token inválido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; rol: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware para comprobar que sea un administrador
export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Primero autenticamos
  isAuth(req, res, () => {
    // Verificamos el rol
    if (req.user?.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado: se requieren permisos de administrador' });
    }
    next();
  });
};

// Mantenemos el requireAuth para compatibilidad
export const requireAuth = isAuth;
