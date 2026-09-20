import { Link } from "react-router-dom";
import type { ReactNode } from "react";

// El Sidebar recibe por PROPS el estado que necesita para dibujarse.
// Es un componente "presentacional": no guarda estado, solo muestra lo que le pasan.
interface SidebarProps {
  // isCollapsed (requisito del enunciado): si es true, el sidebar se reduce a 80px y muestra solo iconos.
  isCollapsed: boolean;
  // isMobileOpen: en celular, indica si el cajón está abierto (deslizado a la vista).
  isMobileOpen: boolean;
  // onNavigate: se llama al tocar un enlace, para cerrar el cajón en celular.
  onNavigate: () => void;
}

// Definimos cada opción del menú con su ruta, su texto y su icono (SVG en línea).
interface MenuItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const menuItems: MenuItem[] = [
  {
    to: "/",
    label: "Dashboard",
    icon: (
      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" />
      </svg>
    ),
  },
  {
    to: "/catalogo",
    label: "Catálogo",
    icon: (
      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 4h12m-6 3a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    ),
  },
  {
    to: "/mi-red",
    label: "Mi Red",
    icon: (
      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4 0m8-2a3 3 0 10-2-5.24M7 7.76A3 3 0 105 2.52" />
      </svg>
    ),
  },
];

const Sidebar = ({ isCollapsed, isMobileOpen, onNavigate }: SidebarProps) => {
  return (
    <aside
      className={`
        bg-slate-900 text-white flex flex-col
        transition-all duration-300 ease-in-out
        fixed inset-y-0 left-0 z-40 md:static
        w-64 ${isCollapsed ? "md:w-20" : "md:w-64"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
    >
      {/* Encabezado / logo. Si está colapsado (en escritorio) mostramos solo la inicial. */}
      <div className="h-16 flex items-center px-6 text-2xl font-bold border-b border-slate-700 overflow-hidden whitespace-nowrap">
        <span className={isCollapsed ? "md:hidden" : ""}>MultiCatálogo</span>
        <span className={isCollapsed ? "hidden md:inline" : "hidden"}>M</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            // 'title' muestra el nombre al pasar el mouse cuando está colapsado (solo iconos).
            title={item.label}
            className={`
              flex items-center gap-4 p-3 rounded hover:bg-slate-800 transition
              ${isCollapsed ? "md:justify-center" : ""}
            `}
          >
            {item.icon}
            {/* El texto se oculta solo cuando está colapsado EN ESCRITORIO (md:hidden).
                En el cajón del celular siempre se ve el texto. */}
            <span className={`whitespace-nowrap ${isCollapsed ? "md:hidden" : ""}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
