import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from 'next-auth/providers/facebook';
import TwitterProvider from 'next-auth/providers/twitter';
import LinkedInProvider from 'next-auth/providers/linkedin';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
        userType: { label: "Tipo de usuario", type: "text" },
      },
      async authorize(credentials) {
        // Demo usuarios (en una aplicación real, estos estarían en la base de datos)
        const users = [
          {
            id: "1",
            name: "Usuario Demo",
            email: "usuario@ejemplo.com",
            password: "password123",
            role: "user",
            connectedNetworks: []
          },
          {
            id: "2",
            name: "Administrador",
            email: "admin@ejemplo.com",
            password: "admin123",
            role: "admin",
            connectedNetworks: []
          }
        ];
        
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = users.find(user => user.email === credentials.email);
        
        if (!user || user.password !== credentials.password) {
          return null;
        }
        
        // Verificar el tipo de usuario solicitado
        if (credentials.userType) {
          const requestedRole = credentials.userType === 'admin' ? 'admin' : 'user';
          if (requestedRole === 'admin' && user.role !== 'admin') {
            return null;
          }
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          connectedNetworks: user.connectedNetworks
        };
      },
    }),
    // Añadir proveedores sociales solo si hay credenciales configuradas
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [FacebookProvider({
          clientId: process.env.FACEBOOK_CLIENT_ID as string,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        })]
      : []),
    ...(process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET
      ? [TwitterProvider({
          clientId: process.env.TWITTER_CLIENT_ID as string,
          clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
          version: "2.0",
        })]
      : []),
    ...(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
      ? [LinkedInProvider({
          clientId: process.env.LINKEDIN_CLIENT_ID as string,
          clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
        })]
      : []),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirigir correctamente a la página de menciones
      if (url === "/dashboard") return `${baseUrl}/dashboard/menciones`;
      // Mantener la URL tal como está para la página de menciones
      if (url === "/dashboard/menciones") return `${baseUrl}/dashboard/menciones`;
      // Para usuarios admin, mantenemos la redirección a su panel
      if (url === "/admin/creditos") return `${baseUrl}/admin/creditos`;
      // Aseguramos que las rutas relativas permanezcan dentro del mismo dominio
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return url;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'user';
        token.connectedNetworks = (user as any).connectedNetworks || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.connectedNetworks = token.connectedNetworks as string[];
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
    newUser: '/dashboard/menciones',  // Redirección para usuarios nuevos
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getSession() {
  return await getServerSession(authOptions);
}
