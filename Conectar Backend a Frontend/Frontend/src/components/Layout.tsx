import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  // Estado del sidebar: colapsado en escritorio y abierto/cerrado en celular.
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // El botón hamburguesa colapsa el sidebar en escritorio (md) o abre el cajón en celular.
  const toggleSidebar = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setIsCollapsed((prev) => !prev);
    } else {
      setIsMobileOpen((prev) => !prev);
    }
  };

  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Fondo oscuro: solo en celular con el cajón abierto; al tocarlo se cierra. */}
      {isMobileOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        closeMobileMenu={closeMobileMenu}
      />

      {/* Área de Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
