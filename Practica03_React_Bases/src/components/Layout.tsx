import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  // Estado del ejercicio de extensión, compartido entre Navbar y Sidebar.
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar isCollapsed={isCollapsed} />

      {/* Área de Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onToggleSidebar={() => setIsCollapsed((prev) => !prev)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
