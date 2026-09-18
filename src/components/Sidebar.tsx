import { Link } from "react-router-dom";

// Ejercicio de Extensión: el Sidebar recibe la prop isCollapsed.
interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  // Opciones de menú con icono (Nota del ejercicio: agregar iconos a las opciones)
  const opciones = [
    { to: "/", icono: "📊", texto: "Dashboard" },
    { to: "/catalogo", icono: "🛍️", texto: "Catálogo" },
    { to: "/mi-red", icono: "🌐", texto: "Mi Red" },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-slate-900 text-white flex flex-col transition-all duration-300`}
    >
      <div className="p-6 text-2xl font-bold border-b border-slate-700 flex items-center justify-center h-16">
        {isCollapsed ? "🗂️" : "MultiCatálogo"}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {opciones.map((op) => (
          <Link
            key={op.to}
            to={op.to}
            title={op.texto}
            className={`flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <span className="text-xl">{op.icono}</span>
            {!isCollapsed && <span>{op.texto}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
