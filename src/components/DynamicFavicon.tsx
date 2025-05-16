"use client";

import { useEffect } from 'react';

/**
 * Componente para manejar cambios dinámicos de favicon
 * Utiliza un enfoque basado en useEffect para evitar problemas de hidratación
 */
export default function DynamicFavicon() {
  useEffect(() => {
    // Solo ejecutar en el cliente después de que el componente se monte
    const savedLogo = localStorage.getItem('appLogo');
    if (savedLogo) {
      const link = document.querySelector('link[rel="icon"]');
      if (link) {
        link.setAttribute('href', savedLogo);
      }
    }
  }, []);
  
  // Este componente no renderiza nada visible
  return null;
}
