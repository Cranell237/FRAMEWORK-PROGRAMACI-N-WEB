import { useState } from 'react';
import TarjetaPokemon from '../components/TarjetaPokemon';

interface ResultadoApi {
  name: string;
  url: string;
}

interface Pokemon {
  id: number;
  nombre: string;
  imagen: string;
}

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151';
// const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

// A partir de la url ".../pokemon/25/" obtenemos el id (25).
const obtenerId = (url: string): number => {
  const partes = url.split('/').filter(Boolean);
  return Number(partes[partes.length - 1]);
};

export default function PokemonPage() {
  const [pokemones, setPokemones] = useState<Pokemon[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');

  const cargarPokemones = async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) throw new Error('No se pudo conectar con la PokeAPI');
      const datos = await respuesta.json();

      const lista: Pokemon[] = datos.results.map((item: ResultadoApi) => {
        const id = obtenerId(item.url);
        return {
          id,
          nombre: item.name,
          imagen: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        };
      });

      setPokemones(lista);
    } catch (err) {
      console.error('Error al consumir la API', err);
      setError('Ocurrió un error al cargar los Pokémon. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const pokemonesFiltrados = pokemones.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
        Consumo de API: Pokémon (Primera generación - 151)
      </h2>

      <button
        onClick={cargarPokemones}
        className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition-all cursor-pointer disabled:opacity-60"
        disabled={cargando}
      >
        {cargando ? 'Cargando Pokémon...' : 'Cargar Pokémon'}
      </button>

      {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}

      {pokemones.length > 0 && (
        <>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar Pokémon por nombre..."
            className="mt-6 w-full max-w-sm block px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
          />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Mostrando {pokemonesFiltrados.length} de {pokemones.length} Pokémon
          </p>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {pokemonesFiltrados.map((p) => (
              <TarjetaPokemon key={p.id} id={p.id} nombre={p.nombre} imagen={p.imagen} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
