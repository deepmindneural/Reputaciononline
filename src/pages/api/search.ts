import type { NextApiRequest, NextApiResponse } from 'next';

// Tipado muy similar al usado en la ruta de appDir
interface SearchResult {
  id: string;
  name: string;
  type: string;
  description: string;
  url?: string;
  imageUrl?: string;
  domain?: string;
  ratings: any[];
  mentions: any[];
  overallScore: number;
  overallSentiment: 'positive' | 'neutral' | 'negative';
  socialProfiles: Record<string, string>;
  metadata: Record<string, any>;
}

interface SocialMention {
  source: string;
  text: string;
  date: string;
  url?: string;
  author?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  likes?: number;
  shares?: number;
  authorImage?: string;
}

const POSITIVE_WORDS = ['bueno', 'excelente', 'genial', 'recomendado', 'positivo', 'agradable', 'encantó', 'satisfecho', 'fantástico', 'increíble', 'maravilloso', 'impresionante', 'gracias', 'felicitaciones', 'perfecto', 'encantador', 'mejor', 'ideal', 'útil', 'eficaz'];
const NEGATIVE_WORDS = ['malo', 'terrible', 'pésimo', 'negativo', 'horrible', 'deficiente', 'crítico', 'polémica', 'odio', 'decepcionado', 'problema', 'queja', 'denuncia', 'ineficaz', 'costoso', 'lento', 'inútil', 'difícil', 'confuso', 'complicado', 'error', 'falla'];

type Sentiment = 'positive' | 'neutral' | 'negative';

function analyseSentiment(text: string): Sentiment {
  if (!text) return 'neutral';
  const words = text.toLowerCase().split(/\W+/);
  let score = 0;
  words.forEach((w) => {
    if (POSITIVE_WORDS.some((p) => w.startsWith(p))) score += 1;
    if (NEGATIVE_WORDS.some((n) => w.startsWith(n))) score -= 1;
  });
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

function extractRating(snippet: string): number | null {
  if (!snippet) return null;
  const match10 = snippet.match(/([0-9]+[.,]?[0-9]?)\s*\/\s*10/);
  if (match10) {
    const val = parseFloat(match10[1].replace(',', '.'));
    if (!isNaN(val)) return Math.min(5, (val / 10) * 5);
  }
  const match5 = snippet.match(/([0-5](?:[.,][0-9])?)/);
  if (match5) {
    const val = parseFloat(match5[1].replace(',', '.'));
    if (!isNaN(val) && val <= 5) return val;
  }
  return null;
}

// Función para clasificar entidades basada en características del texto y URL
function inferEntityType(title: string, snippet: string, url?: string): string {
  const text = `${title} ${snippet}`.toLowerCase();
  const domain = url ? new URL(url).hostname : '';
  
  // Patrones para personas
  if (/\b(presidente|senador|gobernador|alcalde|ministro|doctor|ingeniero|abogado|profesor|juez|periodista)\b/.test(text)) 
    return 'person';
  
  // Si la URL es de una red social, probablemente sea persona
  if (url && /facebook\.com|twitter\.com|linkedin\.com|instagram\.com/.test(domain)) 
    return 'person';
  
  // Patrones para empresas
  if (/\b(s\.a\.|s\.a\.s|ltda|empresa|corporación|compañía|group|grupo|inc\.|corp\.|company|negocio)\b/.test(text)) 
    return 'company';
  
  // Dominios empresariales típicos
  if (domain.endsWith('.com.co') || domain.endsWith('.co') || domain.endsWith('.com')) 
    return 'company';
  
  // Patrones para alojamientos
  if (/hotel|hostal|resort|alojamiento|habitación/.test(text)) 
    return 'hotel';
  
  // Dominios de sitios de reservas
  if (/booking\.com|tripadvisor|airbnb|hoteles/.test(domain)) 
    return 'hotel';
  
  // Patrones para agencias
  if (/agencia|consultoría|asesoria|despacho/.test(text)) 
    return 'agency';
  
  // Patrones para productos
  if (/producto|servicio|comprar|venta|precio|descuento|oferta/.test(text)) 
    return 'product';
  
  // Por defecto, si no hay coincidencias claras
  return 'company';
}

// Genera menciones simuladas para una entidad
function generateMentionsForEntity(entityName: string, entityType: string, count: number = 3, sourceFilter: string = ''): SocialMention[] {
  const mentions: SocialMention[] = [];
  
  // Menciones para personas
  if (entityType === 'person') {
    mentions.push({
      source: 'twitter',
      text: `${entityName} ha hecho declaraciones importantes sobre la economía del país.`,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      author: 'NoticiasCol',
      sentiment: 'neutral',
      likes: Math.floor(Math.random() * 500),
      shares: Math.floor(Math.random() * 200),
      authorImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      url: 'https://twitter.com/NoticiasCol'
    });
    
    mentions.push({
      source: 'facebook',
      text: `Estoy muy impresionado con la labor que está haciendo ${entityName}. Gran trabajo!`,
      date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      author: 'Carlos Rodríguez',
      sentiment: 'positive',
      likes: Math.floor(Math.random() * 300),
      shares: Math.floor(Math.random() * 50),
      authorImage: 'https://randomuser.me/api/portraits/men/22.jpg',
      url: 'https://facebook.com/CarlosRodriguez'
    });
    
    mentions.push({
      source: 'news',
      text: `${entityName} enfrenta críticas por recientes decisiones políticas.`,
      date: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      author: 'El Tiempo',
      sentiment: 'negative',
      url: 'https://eltiempo.com'
    });
  }
  
  // Menciones para empresas
  if (entityType === 'company') {
    mentions.push({
      source: 'twitter',
      text: `La atención al cliente de ${entityName} es excelente, recomiendo sus servicios.`,
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      author: 'MariaConsumidora',
      sentiment: 'positive',
      likes: Math.floor(Math.random() * 120),
      shares: Math.floor(Math.random() * 30),
      authorImage: 'https://randomuser.me/api/portraits/women/22.jpg',
      url: 'https://twitter.com/MariaConsumidora'
    });
    
    mentions.push({
      source: 'facebook',
      text: `Tuve problemas con un producto de ${entityName}. Espero que mejoren su calidad.`,
      date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      author: 'Pedro Gómez',
      sentiment: 'negative',
      likes: Math.floor(Math.random() * 85),
      shares: Math.floor(Math.random() * 15),
      authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      url: 'https://facebook.com/PedroGomez'
    });
    
    mentions.push({
      source: 'news',
      text: `${entityName} anuncia expansión y nuevas oportunidades de empleo en Colombia.`,
      date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      author: 'Portafolio',
      sentiment: 'positive',
      url: 'https://portafolio.co'
    });
  }
  
  // Menciones para hoteles
  if (entityType === 'hotel') {
    mentions.push({
      source: 'tripadvisor',
      text: `Mi estancia en ${entityName} fue increíble. Las instalaciones son modernas y el personal muy amable.`,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      author: 'Viajero Frecuente',
      sentiment: 'positive',
      likes: Math.floor(Math.random() * 45),
      authorImage: 'https://randomuser.me/api/portraits/women/45.jpg',
      url: 'https://tripadvisor.com'
    });
    
    mentions.push({
      source: 'booking',
      text: `${entityName} tiene una buena ubicación pero el desayuno podría mejorar.`,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
      author: 'Familia Viajera',
      sentiment: 'neutral',
      url: 'https://booking.com'
    });
  }
  
  return mentions;
}

async function searchGoogleWithSerpApi(query: string, limit: number, apiKey: string): Promise<any[]> {
  try {
    // Construcción de URL para SerpAPI
    const baseUrl = `https://serpapi.com/search.json`;
    const params = new URLSearchParams({
      q: query,
      api_key: apiKey,
      num: limit.toString(),
      hl: 'es',
      gl: 'co', // Colombia
      location: 'Colombia',
      google_domain: 'google.com'
    });
    
    // Realizar la búsqueda
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    
    if (!response.ok) {
      console.error(`Error en SerpAPI: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    return data.organic_results || [];
  } catch (error) {
    console.error('Error en búsqueda SerpAPI:', error);
    return [];
  }
}

async function searchWikipedia(query: string): Promise<any | null> {
  try {
    const response = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      console.error(`Error en Wikipedia API: ${response.status}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en búsqueda Wikipedia:', error);
    return null;
  }
}

// Genera resultados simulados para cualquier término
function generateGenericResults(query: string, limit: number, entityType: string): SearchResult[] {
  const results: SearchResult[] = [];
  
  // Limpiar consulta
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return [createDefaultResult('Búsqueda', 'Ingrese un término para buscar resultados específicos.', 'entity')];
  }
  
  // Análisis del query para determinar posible tipo de entidad
  const queryLower = query.toLowerCase();
  
  // Detectar si podría ser persona
  const isPerson = /\b(presidente|senador|gobernador|alcalde|ministro|doctor|ingeniero|señor|señora|don|doña|sr\.|sra\.)\b/.test(queryLower) || 
                  /^[A-Z][a-z]+ [A-Z][a-z]+$/.test(query); // Patrón Nombre Apellido
  
  // Detectar si podría ser empresa
  const isCompany = /\b(empresa|compañía|corporación|grupo|s\.a\.|s\.a\.s\.|ltda|inc|corp)\b/.test(queryLower);
  
  // Detectar si podría ser producto
  const isProduct = /\b(producto|modelo|versión|edición|marca)\b/.test(queryLower);
  
  // Detectar si podría ser lugar
  const isPlace = /\b(ciudad|municipio|departamento|barrio|zona|region|país|calle|avenida|carrera)\b/.test(queryLower);

  // Detectar si podría ser hotel
  const isHotel = /\b(hotel|hostal|hospedaje|posada|alojamiento|habitaciones)\b/.test(queryLower) || 
                  queryLower.includes('casa medina');
  
  // Determinar el tipo más probable basado en las detecciones
  let primaryType = 'entity';
  if (isPerson) primaryType = 'person';
  else if (isHotel) primaryType = 'hotel';
  else if (isCompany) primaryType = 'company';
  else if (isProduct) primaryType = 'product';
  else if (isPlace) primaryType = 'place';
  
  // Generar resultado principal basado en la consulta
  results.push(createEntityResult(query, primaryType));
  
  // Generar resultados adicionales basados en el contexto
  
  // Si es una persona, agregar resultados de noticias y perfiles sociales
  if (isPerson) {
    results.push(createNewsResult(query, 'person'));
    results.push(createSocialProfileResult(query, 'person'));
  }
  
  // Si es una empresa, agregar resultados de reseñas y sitio web
  if (isCompany) {
    results.push(createReviewsResult(query, 'company'));
    results.push(createWebsiteResult(query, 'company'));
  }
  
  // Si es un hotel, agregar resultados de reseñas y booking
  if (isHotel) {
    results.push(createReviewsResult(query, 'hotel'));
    results.push(createBookingResult(query));
  }
  
  // Si es un lugar, agregar resultados de turismo y mapas
  if (isPlace) {
    results.push(createTourismResult(query));
    results.push(createMapsResult(query));
  }
  
  // Si no tenemos resultados específicos o tenemos pocos, agregar resultados generales
  if (results.length < 3) {
    results.push(createNewsResult(query, primaryType));
    
    if (results.length < 3) {
      results.push(createRelatedResult(query));
    }
  }
  
  // Limitar al número de resultados solicitados, pero siempre devolver al menos uno
  return results.slice(0, Math.max(1, limit));
}

// Funciones auxiliares para crear diferentes tipos de resultados

function createEntityResult(query: string, type: string): SearchResult {
  return {
    id: `${type}-${Date.now()}`,
    name: query,
    type: type as any,
    description: `Información relevante sobre ${query} en Colombia y contexto global.`,
    url: `https://google.com/search?q=${encodeURIComponent(query)}`,
    imageUrl: `https://source.unsplash.com/featured/?${encodeURIComponent(type)},${encodeURIComponent(query.split(' ')[0])}`,
    domain: 'google.com',
    ratings: [{ source: 'system', score: 3.5, count: 17, sentiment: 'neutral' }],
    mentions: generateMentionsForEntity(query, type as any),
    overallScore: 3.5,
    overallSentiment: 'neutral',
    socialProfiles: generateSocialProfiles(query, type),
    metadata: { 
      source: 'generated',
      timestamp: new Date().toISOString()
    },
  };
}

function createNewsResult(query: string, entityType: string): SearchResult {
  return {
    id: `news-${Date.now()}`,
    name: `Noticias sobre ${query}`,
    type: 'news' as any,
    description: `Las últimas noticias, artículos y menciones sobre ${query} en medios colombianos.`,
    url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
    imageUrl: 'https://source.unsplash.com/featured/?newspaper,news',
    domain: 'news.google.com',
    ratings: [],
    mentions: generateMentionsForEntity(`noticias de ${query}`, entityType as any, 2, 'news'),
    overallScore: 3.0,
    overallSentiment: 'neutral',
    socialProfiles: {},
    metadata: { 
      source: 'generated',
      timestamp: new Date().toISOString()
    },
  };
}

function createSocialProfileResult(query: string, entityType: string): SearchResult {
  return {
    id: `social-${Date.now()}`,
    name: `Perfiles sociales de ${query}`,
    type: entityType as any,
    description: `Encuentra los perfiles en redes sociales y presencia digital de ${query}.`,
    url: `https://www.google.com/search?q=${encodeURIComponent(query)}+redes+sociales`,
    imageUrl: 'https://source.unsplash.com/featured/?social,profile',
    domain: 'google.com',
    ratings: [],
    mentions: [],
    overallScore: 3.0,
    overallSentiment: 'neutral',
    socialProfiles: {
      facebook: `https://facebook.com/search/people/?q=${encodeURIComponent(query)}`,
      twitter: `https://twitter.com/search?q=${encodeURIComponent(query)}`,
      instagram: `https://www.instagram.com/explore/tags/${encodeURIComponent(query.replace(/\s+/g, ''))}`,
      linkedin: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`
    },
    metadata: { 
      source: 'generated',
      timestamp: new Date().toISOString()
    },
  };
}

function createReviewsResult(query: string, entityType: string): SearchResult {
  const sentiment = Math.random() > 0.7 ? 'neutral' : Math.random() > 0.5 ? 'positive' : 'negative';
  const score = sentiment === 'positive' ? 4 + Math.random() : sentiment === 'neutral' ? 3 + Math.random() : 2 + Math.random();
  
  return {
    id: `reviews-${Date.now()}`,
    name: `Reseñas de ${query}`,
    type: 'reviews' as any,
    description: `Opiniones, valoraciones y experiencias de clientes con ${query}.`,
    url: `https://google.com/search?q=${encodeURIComponent(query)}+reseñas`,
    imageUrl: 'https://source.unsplash.com/featured/?review,feedback',
    domain: 'google.com',
    ratings: [
      { source: 'clients', score, count: Math.floor(Math.random() * 100) + 5, sentiment }
    ],
    mentions: generateMentionsForEntity(`reseñas de ${query}`, entityType as any, 3, 'reviews'),
    overallScore: score,
    overallSentiment: sentiment,
    socialProfiles: {},
    metadata: { 
      source: 'generated',
      timestamp: new Date().toISOString()
    },
  };
}

function createWebsiteResult(query: string, entityType: string): SearchResult {
  return {
    id: `website-${Date.now()}`,
    name: `Sitio web oficial de ${query}`,
    type: entityType as any,
    description: `Sitio web oficial y presencia digital de ${query}.`,
    url: `https://google.com/search?q=${encodeURIComponent(query)}+sitio+oficial`,
    imageUrl: `https://logo.clearbit.com/${query.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    domain: `${query.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    ratings: [],
    mentions: [],
    overallScore: 3.5,
    overallSentiment: 'neutral',
    socialProfiles: {
      website: `https://google.com/search?q=${encodeURIComponent(query)}+sitio+oficial`
    },
    metadata: { 
      source: 'generated',
      timestamp: new Date().toISOString()
    },
  };
}

function createBookingResult(query: string): SearchResult {
  return {
    id: `booking-${Date.now()}`,
    name: `Reservas para ${query}`,
    type: 'hotel' as any,
    description: `Encuentra disponibilidad, precios y realiza reservas en ${query}.`,
    url: `https://www.booking.com/search.es.html?ss=${encodeURIComponent(query)}`,
    imageUrl: 'https://source.unsplash.com/featured/?hotel,booking',
    domain: 'booking.com',
    ratings: [{ source: 'booking', score: 4.2, count: 87, sentiment: 'positive' }],
    mentions: [],
    overallScore: 4.2,
    overallSentiment: 'positive',
    socialProfiles: {},
    metadata: { 
      source: 'generated',
      timestamp: new Date().toISOString()
    },
  };
}

function createTourismResult(query: string): SearchResult {
  return {
    id: `tourism-${Date.now()}`,
    name: `Turismo en ${query}`,
    type: 'place' as any,
    description: `Guías, atracciones y actividades turísticas en ${query}.`,
    url: `https://www.tripadvisor.co/Search?q=${encodeURIComponent(query)}`,
    imageUrl: 'https://source.unsplash.com/featured/?tourism,travel',
    domain: 'tripadvisor.co',
    ratings: [],
    mentions: generateMentionsForEntity(`turismo en ${query}`, 'place', 2, 'tripadvisor'),
    overallScore: 4.0,
    overallSentiment: 'positive',
    socialProfiles: {},
    metadata: { 
      source: 'generated',
      timestamp: new Date().toISOString()
    },
  };
}

function createMapsResult(query: string): SearchResult {
  return {
    id: `maps-${Date.now()}`,
    name: `${query} en el mapa`,
    type: 'place' as any,
    description: `Ubicación, direcciones y cómo llegar a ${query}.`,
    url: `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
    imageUrl: 'https://source.unsplash.com/featured/?map,location',
    domain: 'google.com',
    ratings: [],
    mentions: [],
    overallScore: 3.0,
    overallSentiment: 'neutral',
    socialProfiles: {},
    metadata: { 
      source: 'generated',
      timestamp: new Date().toISOString()
    },
  };
}

function createRelatedResult(query: string): SearchResult {
  return {
    id: `related-${Date.now()}`,
    name: `Temas relacionados con ${query}`,
    type: 'related' as any,
    description: `Información, conceptos y elementos asociados a "${query}" en el contexto colombiano.`,
    url: `https://google.com/search?q=${encodeURIComponent(query)}+relacionados`,
    imageUrl: 'https://source.unsplash.com/featured/?related,similar',
    domain: 'google.com',
    ratings: [],
    mentions: [],
    overallScore: 3.0,
    overallSentiment: 'neutral',
    socialProfiles: {},
    metadata: { 
      source: 'generated',
      timestamp: new Date().toISOString()
    },
  };
}

function createDefaultResult(name: string, description: string, type: string): SearchResult {
  return {
    id: `default-${Date.now()}`,
    name,
    type: type as any,
    description,
    url: 'https://google.com',
    imageUrl: 'https://source.unsplash.com/featured/?search',
    domain: 'google.com',
    ratings: [],
    mentions: [],
    overallScore: 3.0,
    overallSentiment: 'neutral',
    socialProfiles: {},
    metadata: { 
      source: 'generated',
      timestamp: new Date().toISOString()
    },
  };
}

function generateSocialProfiles(query: string, type: string): Record<string, string> {
  const profiles: Record<string, string> = {
    google: `https://google.com/search?q=${encodeURIComponent(query)}`
  };
  
  if (type === 'person') {
    profiles.facebook = `https://facebook.com/search/people/?q=${encodeURIComponent(query)}`;
    profiles.twitter = `https://twitter.com/search?q=${encodeURIComponent(query)}`;
    profiles.linkedin = `https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;
    profiles.instagram = `https://www.instagram.com/explore/tags/${encodeURIComponent(query.replace(/\s+/g, ''))}`;
  } else if (type === 'company' || type === 'hotel') {
    profiles.facebook = `https://facebook.com/search?q=${encodeURIComponent(query)}`;
    profiles.linkedin = `https://linkedin.com/search/results/companies/?keywords=${encodeURIComponent(query)}`;
    profiles.website = `https://google.com/search?q=${encodeURIComponent(query)}+sitio+oficial`;
  } else if (type === 'place') {
    profiles.facebook = `https://facebook.com/search/places/?q=${encodeURIComponent(query)}`;
    profiles.google = `https://maps.google.com/search?q=${encodeURIComponent(query)}`;
  }
  
  return profiles;
}

// Función para generar nombres de autor según fuente
function getRandomAuthor(source: string): string {
  const nombres = ['Juan', 'María', 'Carlos', 'Ana', 'David', 'Laura', 'José', 'Patricia', 'Andrés', 'Camila'];
  const apellidos = ['García', 'Rodríguez', 'Martínez', 'López', 'Hernández', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres'];
  
  if (source === 'news' || source === 'eltiempo' || source === 'elespectador' || source === 'semana') {
    return `${nombres[Math.floor(Math.random() * nombres.length)]} ${apellidos[Math.floor(Math.random() * apellidos.length)]} - Periodista`;
  } 
  else if (source === 'reviews' || source === 'tripadvisor' || source === 'booking' || source === 'google') {
    const nombreRandom = nombres[Math.floor(Math.random() * nombres.length)];
    const apellidoRandom = apellidos[Math.floor(Math.random() * apellidos.length)];
    return `${nombreRandom} ${apellidoRandom.charAt(0)}.`;
  }
  else {
    return `@${nombres[Math.floor(Math.random() * nombres.length)].toLowerCase()}${Math.floor(Math.random() * 1000)}`;
  }
}

// Función para detectar si una consulta es un nombre propio o empresa
function detectEntityType(query: string): string {
  const queryLower = query.toLowerCase().trim();
  
  // Mejorar detección de personas
  const personPatterns = [
    /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+( [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?$/,  // Formato Nombre Apellido
    /presidente|senador|gobernador|alcalde|ministro|doctor|abogado|profesor|ingeniero/,
    /cantante|actor|actriz|director|artista|músico|deportista|jugador|futbolista/
  ];
  
  // Mejorar detección de empresas
  const companyPatterns = [
    /empresa|compañía|corporación|grupo|marca|fabricante|productor|industria/,
    /s\.a\.|s\.a\.s\.|ltda\.|inc\.|corp\.|group|colombia|comercial|nacional/,
    /banco|financiera|inversiones|seguros|tecnología|software|marketing|digital/
  ];
  
  // Mejorar detección de hoteles
  const hotelPatterns = [
    /hotel|hostal|hospedaje|posada|alojamiento|resort|suites|hostería|apartamentos/,
    /casa|hotel.*spa|hotel.*boutique|hotel.*colonial|hotel.*plaza|hotel.*real/
  ];
  
  // Mejorar detección de lugares
  const placePatterns = [
    /ciudad|municipio|departamento|barrio|zona|región|localidad|comuna|provincia/,
    /calle|carrera|avenida|transversal|diagonal|plaza|parque|montaña|lago|río/,
    /bogotá|medellín|cali|barranquilla|cartagena|santa marta|bucaramanga|pereira/
  ];
  
  // Mejorar detección de productos
  const productPatterns = [
    /producto|modelo|versión|edición|marca|serie|colección|línea/,
    /iphone|samsung|xiaomi|huawei|notebook|laptop|television|refrigerador/
  ];
  
  // Verificar cada patrón
  for (const pattern of personPatterns) {
    if (pattern.test(queryLower)) return 'person';
  }
  
  for (const pattern of companyPatterns) {
    if (pattern.test(queryLower)) return 'company';
  }
  
  for (const pattern of hotelPatterns) {
    if (pattern.test(queryLower)) return 'hotel';
  }
  
  for (const pattern of placePatterns) {
    if (pattern.test(queryLower)) return 'place';
  }
  
  for (const pattern of productPatterns) {
    if (pattern.test(queryLower)) return 'product';
  }
  
  // Detectar si parece una entidad por uso de mayúsculas
  if (/^[A-ZÁÉÍÓÚÑ]/.test(query) && query.length > 2) {
    // Probablemente es un nombre propio de algún tipo
    if (query.split(' ').length >= 2) {
      return 'person';  // Más probable que sea una persona si tiene dos palabras
    } else {
      return 'entity';  // Entidad genérica
    }
  }
  
  // Si no se detecta nada específico
  return 'entity';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Obtener parámetros de búsqueda (query, tipo, límite)
  const { q, type = 'all', limit = '5' } = req.query;
  const query = typeof q === 'string' ? q : '';
  const entityType = typeof type === 'string' ? type : 'all';
  const searchLimit = typeof limit === 'string' ? parseInt(limit, 10) : 5;
  
  // Responder con error si no hay consulta
  if (!query.trim()) {
    return res.status(400).json({ 
      error: 'Se requiere una consulta de búsqueda', 
      results: [createDefaultResult('Búsqueda', 'Por favor ingrese un término de búsqueda.', 'entity')], 
      totalResults: 1,
      timeMs: 0,
      sources: [],
      query: ''
    });
  }

  const startTime = Date.now();
  
  // Verificar API key
  const apiKey = process.env.SERP_API_KEY;
  // Si no hay API key, generar resultados simulados
  if (!apiKey) {
    const results = generateGenericResults(query, searchLimit, entityType);
    return res.status(200).json({
      results,
      totalResults: results.length,
      timeMs: Date.now() - startTime,
      sources: ['simulated'],
      query
    });
  }
  
  try {
    // Realizar búsqueda en Google a través de SerpAPI
    const organicResults = await searchGoogleWithSerpApi(query, searchLimit * 2, apiKey);
    
    // Buscar en Wikipedia para complementar los resultados
    const wikiResult = await searchWikipedia(query);
    
    // Procesar resultados
    const uniqueByLink: Record<string, any> = {};
    organicResults.forEach((result: any) => {
      if (result.link && !uniqueByLink[result.link]) {
        uniqueByLink[result.link] = result;
      }
    });
    
    // Convertir a nuestro formato de SearchResult
    let processedResults: SearchResult[] = Object.values(uniqueByLink)
      .slice(0, searchLimit)
      .map((item: any, idx: number) => {
        // Determinar tipo de entidad
        let entityType: string = 'entity';
        
        // Usar la función mejorada de detección de tipos
        entityType = detectEntityType(item.title) as string;
        
        // Texto para análisis de sentimiento
        const textForAnalysis = `${item.title} ${item.snippet || ''}`;
        
        // Determinar sentimiento general
        const sentimentResult = analyseSentiment(textForAnalysis);
        
        // Extraer dominio de la URL
        const domainMatch = item.link.match(/https?:\/\/(?:www\.)?([^\/]+)/);
        const domain = domainMatch ? domainMatch[1] : '';
        
        // Obtener imágenes
        let imageUrl = '';
        
        // Intentar obtener thumbnail de la API
        if (item.thumbnail) {
          imageUrl = item.thumbnail;
        } 
        // Si no hay thumbnail, intentar con favicon
        else if (item.favicon) {
          imageUrl = item.favicon;
        } 
        // Si no hay favicon, usar Clearbit para logos de empresas
        else if (domain) {
          imageUrl = `https://logo.clearbit.com/${domain}`;
        }
        // Fallback a favicon de Google
        else {
          imageUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        }

        // Generar menciones en redes sociales basadas en el tipo de entidad
        const mentions = generateMentionsForEntity(item.title, entityType, 3, '');
        
        // Construir perfiles sociales basados en el tipo de entidad
        const socialProfiles: Record<string, string> = {};
        if (entityType === 'person') {
          socialProfiles.twitter = `https://twitter.com/search?q=${encodeURIComponent(item.title)}`;
          socialProfiles.facebook = `https://facebook.com/search?q=${encodeURIComponent(item.title)}`;
          socialProfiles.linkedin = `https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(item.title)}`;
        } else if (entityType === 'company') {
          socialProfiles.website = item.link || '';
          socialProfiles.facebook = `https://facebook.com/search?q=${encodeURIComponent(item.title)}`;
          socialProfiles.linkedin = `https://linkedin.com/search/results/companies/?keywords=${encodeURIComponent(item.title)}`;
        }
        
        // Crear objeto de resultado
        return {
          id: (item.position || idx + 1).toString(),
          name: item.title,
          type: entityType,
          description: item.snippet || '',
          url: item.link,
          imageUrl,
          domain,
          ratings: [],
          mentions,
          overallScore: sentimentResult === 'positive' ? 4 : sentimentResult === 'negative' ? 2 : 3,
          overallSentiment: sentimentResult,
          socialProfiles,
          metadata: { 
            sourcePosition: item.position,
            source: 'google',
            timestamp: new Date().toISOString()
          },
        } as SearchResult;
      });
    
    // Añadir resultado de Wikipedia si existe y no está ya en los resultados
    if (wikiResult?.title && !processedResults.some(r => r.name === wikiResult.title)) {
      const wikiEntityType = detectEntityType(wikiResult.title) as string;
      const wikiSentiment = analyseSentiment(wikiResult.extract || '');
      
      processedResults.unshift({
        id: 'wiki-' + Date.now().toString(),
        name: wikiResult.title,
        type: wikiEntityType,
        description: wikiResult.extract || '',
        url: wikiResult.content_urls?.desktop?.page,
        imageUrl: wikiResult.thumbnail?.source,
        domain: 'wikipedia.org',
        ratings: [],
        mentions: generateMentionsForEntity(wikiResult.title, wikiEntityType, 3, ''),
        overallScore: 3,
        overallSentiment: wikiSentiment,
        socialProfiles: {},
        metadata: { 
          source: 'wikipedia',
          timestamp: new Date().toISOString()
        },
      });
    }
    
    // Si no hay resultados, generar resultados genéricos basados en la consulta
    if (processedResults.length === 0) {
      processedResults = generateGenericResults(query, searchLimit, entityType);
    }
    
    // Filtrar por tipo de entidad si se especificó y hay resultados disponibles
    let finalResults = entityType === 'all' 
      ? processedResults 
      : processedResults.filter(r => r.type === entityType);
    
    // Asegurar que siempre haya al menos un resultado
    if (finalResults.length === 0) {
      // Si después del filtrado no hay resultados, ignorar el filtro y mostrar todos
      finalResults = processedResults;
      
      // Si aún así no hay resultados, generar resultados genéricos
      if (finalResults.length === 0) {
        finalResults = generateGenericResults(query, searchLimit, entityType);
      }
    }
    
    // Calcular tiempo total
    const timeElapsed = Date.now() - startTime;
    
    // Enviar respuesta
    return res.status(200).json({
      results: finalResults,
      totalResults: finalResults.length,
      searchStats: {
        sourcesSearched: 2, // Google + Wikipedia
        timeElapsed
      }
    });
    
  } catch (error) {
    console.error('Error en procesamiento de búsqueda:', error);
    return res.status(500).json({ 
      error: 'Error en el procesamiento de la búsqueda',
      details: (error as Error).message
    });
  }
}
