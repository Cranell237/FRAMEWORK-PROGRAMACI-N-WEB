// src/context/SidebarContext.tsx
// Estado GLOBAL del sidebar. Sigue el mismo patrón que AuthContext y CartContext:
// creamos un Context + un hook personalizado (useSidebar) + un Provider.
// Así el Navbar puede cambiar el estado y el Sidebar puede leerlo, aunque sean componentes hermanos.
import { createContext, useContext, useState, type ReactNode } from 'react';

interface SidebarContextType {
  // isCollapsed: en pantallas grandes (escritorio) indica si el sidebar está reducido (solo iconos).
  isCollapsed: boolean;
  // isMobileOpen: en pantallas pequeñas (celular) indica si el cajón (drawer) está abierto.
  isMobileOpen: boolean;
  // toggleSidebar: botón inteligente. En celular abre/cierra el cajón; en escritorio colapsa/expande.
  toggleSidebar: () => void;
  // closeMobile: cierra el cajón en celular (se usa al tocar un enlace o el fondo oscuro).
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Hook personalizado con validación: evita usar el contexto fuera del Provider.
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar debe ser usado dentro de un SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  // En escritorio arranca expandido (false). En celular el cajón arranca cerrado (false).
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Un solo botón de Toggle que se comporta distinto según el tamaño de pantalla:
  // - En celular (< 768px, breakpoint 'md' de Tailwind): abre/cierra el cajón.
  // - En escritorio: reduce/expande el ancho del sidebar.
  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, isMobileOpen, toggleSidebar, closeMobile }}>
      {children}
    </SidebarContext.Provider>
  );
};
