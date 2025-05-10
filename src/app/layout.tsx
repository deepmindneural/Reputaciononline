import '../styles/globals.css';
import FaviconLoader from '@/components/FaviconLoader';
import { Providers } from './providers';
import NavigationGuard from '@/components/auth/NavigationGuard';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>Reputación Online - Monitoreo y Análisis de Redes Sociales</title>
        <meta name="description" content="Plataforma integral de escucha social y análisis de reputación online para candidatos políticos" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <FaviconLoader />
      </head>
      <body>
        <Providers>
          <NavigationGuard>
            {children}
          </NavigationGuard>
        </Providers>
        <script src="/js/proteccion.js" />
      </body>
    </html>
  );
}
