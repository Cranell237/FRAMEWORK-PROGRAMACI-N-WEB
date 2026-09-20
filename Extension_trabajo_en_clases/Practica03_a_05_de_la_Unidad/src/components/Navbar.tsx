import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";

const Navbar = () => {
  const { totalItems } = useCart();
  const { logout, userEmail } = useAuth();
  // Traemos la función global para colapsar/abrir el sidebar.
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-3">
        {/* Botón de Toggle: controla el estado global del sidebar (colapsar en escritorio / abrir en celular). */}
        <button
          onClick={toggleSidebar}
          aria-label="Alternar menú lateral"
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-slate-600 font-medium text-base sm:text-lg">
          Panel de Administración
        </h2>
      </div>
      <div className="flex items-end gap-6">
        <Link
          to="/carrito"
          className="relative p-2 hover:bg-slate-100 rounded-full transition"
        >
          <span className="text-xl">🛒</span>
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
              {totalItems}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{userEmail}</span>

          {/* Contenedor relativo con 'group'. Se abre con el mouse (hover) y también con el teclado (focus-within). */}
          <div className="relative group pb-2">
            {/* Avatar como <button>: así es enfocable con Tab y accesible por teclado (antes era un <div> no enfocable). */}
            <button
              type="button"
              aria-label="Menú de usuario"
              aria-haspopup="true"
              className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {/*
        NOTA PARA LA API:
        Aquí reemplazarás el 'src' quemado por la variable de tu estado,
        por ejemplo: src={userAvatar || defaultImage}
      */}
              <img
                src="https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg"
                alt="Avatar del usuario"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Menú desplegable: visible con hover (group-hover) Y con foco de teclado (group-focus-within). */}
            <div
              role="menu"
              className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50"
            >
              <button
                onClick={handleLogout}
                role="menuitem"
                className="w-full text-left px-4 py-2 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-md transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
