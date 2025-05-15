import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';

// Inicializa el cliente solo si hay clave; en desarrollo retornamos respuestas mock
const openaiKey = process.env.OPENAI_API_KEY;
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

export async function analizarSentimientos(texto: string) {
  if (!openai) {
    // Mock sencillo cuando no hay clave API
    return 'neutro';
  }
  const resp = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'Eres un analizador de sentimientos. Devuelve solo "positivo", "negativo" o "neutro".',
      },
      { role: 'user', content: texto },
    ],
  });
  return resp.choices[0].message.content?.trim();
}

export async function generarReporte(datos: string) {
  if (!openai) {
    return 'OpenAI API key missing. Reporte no generado.';
  }
  const resp = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'Eres un analista de reputación online. Genera un resumen ejecutivo en español basado en los datos recibidos.',
      },
      { role: 'user', content: datos },
    ],
  });
  return resp.choices[0].message.content?.trim();
}
