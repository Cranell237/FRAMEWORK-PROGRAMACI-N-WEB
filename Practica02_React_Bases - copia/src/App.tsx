import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import InicioPage from './pages/InicioPage';
import PokemonPage from './pages/PokemonPage';

// Estilo del enlace activo vs inactivo en la barra de navegación.
const claseEnlace = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-lg font-medium transition-all ${
    isActive
      ? 'bg-slate-800 text-white'
      : 'bg-white text-slate-700 hover:bg-slate-200'
  }`;

export default function App() {
  return (
    <BrowserRouter>
      <div className="p-8 bg-slate-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Fundamentos de React</h1>

        {/* Navegación SPA: cambia de vista sin recargar la página */}
        <nav className="flex gap-3 mb-8">
          <NavLink to="/" end className={claseEnlace}>
            Inicio
          </NavLink>
          <NavLink to="/pokemon" className={claseEnlace}>
            Pokémon
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route path="/pokemon" element={<PokemonPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
