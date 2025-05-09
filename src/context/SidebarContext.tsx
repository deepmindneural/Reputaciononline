import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (state: boolean) => void;
  toggleCollapsed: () => void;
}

// Contexto por defecto
const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
  toggleCollapsed: () => {},
});

// Proveedor que controla el estado colapsado globalmente
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Manejar colapso automático en pantallas pequeñas
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setCollapsed(window.innerWidth < 768);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Hook de conveniencia
export const useSidebar = () => useContext(SidebarContext);
