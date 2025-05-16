import '../styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CreditosProvider } from '@/context/CreditosContext';
import DynamicFavicon from '@/components/DynamicFavicon';

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
      </head>
      <body>
        <AuthProvider>
          <CreditosProvider>
            {children}
            <DynamicFavicon />
          </CreditosProvider>
        </AuthProvider>
        <script src="/js/proteccion.js" />
      </body>
    </html>
  );
}
