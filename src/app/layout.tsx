import '../styles/globals.css';
import FaviconLoader from '@/components/FaviconLoader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <title>Reputación Online - Monitoreo y Análisis de Redes Sociales</title>
        <meta name="description" content="Plataforma integral de escucha social y análisis de reputación online para candidatos políticos" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <FaviconLoader />
        {children}
        <script src="/js/proteccion.js" />
      </body>
    </html>
  );
}
