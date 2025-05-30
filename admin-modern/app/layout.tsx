import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AdminLayout from './components/AdminLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reputación Online - Panel Administrativo',
  description: 'Sistema de gestión de créditos para la plataforma Reputación Online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AdminLayout>
          {children}
        </AdminLayout>
      </body>
    </html>
  );
}
