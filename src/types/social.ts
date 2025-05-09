// Tipos para las redes sociales
export type Platform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok';

// Tipo para los datos de región en el mapa
export interface RegionMention {
  id: string;
  region: string;
  coordinates: [number, number]; // [longitud, latitud]
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  platform?: string;
  platformColor?: string;
}

// Tipo para tokens de acceso a redes sociales
export interface SocialToken {
  id: string;
  platform: Platform;
  token: string;
  expiresAt: string;
  userId: string;
}

// Tipo para los datos de cada plataforma
export interface PlatformData {
  followers: number;
  engagement: number;
  posts: number;
  reach: number;
  mentions: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentPosts: {
    id: string;
    content: string;
    date: string;
    likes: number;
    comments: number;
    shares: number;
  }[];
}
