import '../styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Reputación Online - Monitoreo y Análisis de Redes Sociales',
  description: 'Plataforma integral de escucha social y análisis de reputación online para candidatos políticos',
  keywords: 'reputación online, redes sociales, escucha social, análisis, política, X, Facebook, Instagram',
  authors: [{ name: 'Comyte' }],
  creator: 'Comyte',
  publisher: 'Comyte',
};

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Script para cargar el favicon desde localStorage si existe
              if (typeof window !== 'undefined') {
                const savedLogo = localStorage.getItem('appLogo');
                if (savedLogo) {
                  const link = document.querySelector('link[rel="icon"]');
                  if (link) {
                    link.setAttribute('href', savedLogo);
                  }
                }
              }
            `
          }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <script src="/js/proteccion.js" />
      </body>
    </html>
  );
}
