import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import InicioPage from './pages/InicioPage';
import PokemonPage from './pages/PokemonPage';

// Estilo del enlace activo vs inactivo en la barra de navegación.
const claseEnlace = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-lg font-medium transition-all ${
    isActive
      ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
      : 'bg-white text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
  }`;

export default function App() {
  // Estado del modo oscuro. Al iniciar, lee la preferencia guardada o la del sistema.
  const [oscuro, setOscuro] = useState<boolean>(() => {
    const guardado = localStorage.getItem('modo-oscuro');
    if (guardado !== null) return guardado === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Cada vez que cambia "oscuro", agrega/quita la clase "dark" en <html> y lo guarda.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', oscuro);
    localStorage.setItem('modo-oscuro', String(oscuro));
  }, [oscuro]);

  return (
    <BrowserRouter>
      <div className="p-8 bg-slate-100 min-h-screen dark:bg-slate-900 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Fundamentos de React
          </h1>

          {/* Interruptor de modo oscuro */}
          <button
            onClick={() => setOscuro((v) => !v)}
            className="px-4 py-2 rounded-lg font-medium bg-white text-slate-700 shadow hover:bg-slate-200 transition-all cursor-pointer dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {oscuro ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
        </div>

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
