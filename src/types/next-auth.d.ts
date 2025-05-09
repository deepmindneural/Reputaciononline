import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
    expiresAt?: number;
    connectedAccounts?: string[];  // Lista de plataformas conectadas 
    user: {
      id: string;
      role?: string;
      connectedNetworks?: string[];
      credits?: number;       // Créditos disponibles
      agencyProfile?: boolean; // Si es una agencia
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    connectedNetworks?: string[];
    provider?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    connectedNetworks?: string[];
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
    expiresAt?: number;
  }
}
