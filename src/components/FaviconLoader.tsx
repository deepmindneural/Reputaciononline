"use client";

import { useEffect } from 'react';

export default function FaviconLoader() {
  useEffect(() => {
    // Solo ejecuta este código en el navegador
    const savedLogo = localStorage.getItem('appLogo');
    if (savedLogo) {
      const link = document.querySelector('link[rel="icon"]');
      if (link) {
        link.setAttribute('href', savedLogo);
      }
    }
  }, []);

  // Este componente no renderiza nada
  return null;
}
