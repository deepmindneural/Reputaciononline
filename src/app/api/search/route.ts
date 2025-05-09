import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type Sentiment = 'positive' | 'neutral' | 'negative';

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
  overallSentiment: Sentiment;
  socialProfiles: Record<string, string>;
  metadata: Record<string, any>;
}

// Listas básicas de palabras para estimar sentimiento en español
const POSITIVE_WORDS = [
  'bueno', 'excelente', 'genial', 'recomendado', 'positiv', 'agradable', 'encantó', 'satisfecho', 'fantástico',
];
const NEGATIVE_WORDS = [
  'malo', 'terrible', 'pésimo', 'negativ', 'horrible', 'deficiente', 'crítico', 'polémica', 'odio',
];

function analyseSentiment(text: string): Sentiment {
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
  // Buscar patrones tipo "4,5" ó "8.7/10"
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

// Helper to determine entity type
const inferEntityType = (title: string, snippet: string, link?: string): string => {
  const text = `${title} ${snippet}`.toLowerCase();
  if (/\b(presidente|senador|gobernador|alcalde|ministro|doctor|ingeniero)\b/.test(text)) return 'person';
  if (/\b(s\.a\.|s\.a\.s|ltda|empresa|corporación|compañía|group|grupo)\b/.test(text)) return 'company';
  if (/hotel|hostal|resort/.test(text)) return 'hotel';
  if (/agencia/.test(text)) return 'agency';
  if (/producto|servicio/.test(text)) return 'product';
  if (link && /facebook|twitter|linkedin/.test(link)) return 'person';
  return 'company';
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') ?? '';
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10', 10), 20);

    if (!query.trim()) {
      return NextResponse.json({ results: [], totalResults: 0 });
    }

    const apiKey = process.env.SERP_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'SERP_API_KEY not configured' }, { status: 500 });
    }

    const buildUrl = (q: string) =>
      `https://serpapi.com/search.json?q=${encodeURIComponent(q)}&api_key=${apiKey}&num=${limit}&hl=es&gl=co&location=Colombia&google_domain=google.com`;

    const queries = [query, `${query} Colombia`];
    // Búsquedas específicas por dominio para hoteles/alojamientos
    const hotelKeywords = /(hotel|hostal|alojamiento|airbnb|booking|tripadvisor)/i;
    if (hotelKeywords.test(query)) {
      queries.push(`site:booking.com ${query}`);
      queries.push(`site:tripadvisor.com ${query}`);
      queries.push(`site:airbnb.com ${query}`);
    }

    // Si es persona añadimos búsqueda con sitio wikipedia
    if (/presidente|senador|gobernador|alcalde|ministro/.test(query.toLowerCase())) {
      queries.push(`site:wikipedia.org ${query}`);
    }

    const start = Date.now();
    const responses = await Promise.all(
      queries.map((q) => fetch(buildUrl(q), { next: { revalidate: 300 } })),
    );
    const elapsed = Date.now() - start;

    const allOrganic: any[] = [];
    for (const resp of responses) {
      if (!resp.ok) continue;
      const data = await resp.json();
      allOrganic.push(...(data.organic_results ?? []));
    }

    // Eliminar duplicados por link
    const uniqueByLink: Record<string, any> = {};
    allOrganic.forEach((o) => {
      if (o.link && !uniqueByLink[o.link]) uniqueByLink[o.link] = o;
    });

    const uniqOrganic = Object.values(uniqueByLink);

    const results: SearchResult[] = uniqOrganic.slice(0, limit).map((item: any, idx) => {
      const entityType = inferEntityType(item.title, item.snippet ?? '', item.link);

      const sentiment = analyseSentiment(item.snippet ?? item.title);
      const ratingFromSnippet = extractRating(item.snippet ?? '');
      const overallScore = ratingFromSnippet ?? (sentiment === 'positive' ? 4 : sentiment === 'negative' ? 2 : 3);

      const domain = item.link ? new URL(item.link).hostname.replace('www.', '') : undefined;
      let imageUrl: string | undefined = item.thumbnail || item.favicon;
      if (!imageUrl && domain) {
        imageUrl = `https://logo.clearbit.com/${domain}`;
      }
      if (!imageUrl && domain) {
        imageUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
      }

      return {
        id: (item.position ?? idx + 1).toString(),
        name: item.title,
        type: entityType,
        description: item.snippet ?? '',
        url: item.link,
        imageUrl,
        domain,
        ratings: ratingFromSnippet
          ? [
              {
                source: 'snippet',
                score: ratingFromSnippet,
                count: 1,
                sentiment,
              },
            ]
          : [],
        mentions: [],
        overallScore,
        overallSentiment: sentiment,
        socialProfiles: {},
        metadata: { position: item.position },
      } as SearchResult;
    });

    // Wikipedia fallback when no results
    if (results.length === 0) {
      const wikiResp = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
      if (wikiResp.ok) {
        const wikiJson = await wikiResp.json();
        if (wikiJson?.title) {
          results.push({
            id: 'wiki',
            name: wikiJson.title,
            type: inferEntityType(wikiJson.title, wikiJson.extract),
            description: wikiJson.extract,
            url: wikiJson.content_urls?.desktop?.page,
            imageUrl: wikiJson.thumbnail?.source,
            domain: 'wikipedia.org',
            ratings: [],
            mentions: [],
            overallScore: 3,
            overallSentiment: analyseSentiment(wikiJson.extract),
            socialProfiles: {},
            metadata: { source: 'wikipedia' },
          } as any);
        }
      }
    }

    return NextResponse.json({
      results,
      totalResults: results.length,
      searchStats: { sourcesSearched: queries.length, timeElapsed: elapsed },
    });
  } catch (error) {
    console.error('Search route error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
