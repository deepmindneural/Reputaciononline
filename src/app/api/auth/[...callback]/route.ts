import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Esta es una ruta comodín para manejar callbacks de redes sociales
  // En lugar de mostrar un 404, redirigiremos a una página de espera
  return NextResponse.redirect(new URL('/conectando-red-social', req.url));
}
