import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSidebar } from "../context/SidebarContext";

const Layout = () => {
  // Leemos el estado global del sidebar aquí y se lo pasamos por props al Sidebar.
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebar();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Fondo oscuro (backdrop): solo aparece en celular cuando el cajón está abierto.
          Al tocarlo se cierra el cajón. En escritorio (md) nunca se muestra. */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* El Sidebar recibe el estado por props (isCollapsed es el requisito del enunciado). */}
      <Sidebar isCollapsed={isCollapsed} isMobileOpen={isMobileOpen} onNavigate={closeMobile} />

      {/* Área de Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
