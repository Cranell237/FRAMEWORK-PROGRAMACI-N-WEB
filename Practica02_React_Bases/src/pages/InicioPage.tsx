import { useState } from 'react';
import TarjetaUsuario from '../components/TarjetaUsuario';

interface Usuario {
  name: string;
  email: string;
}

export default function InicioPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  const obtenerDatos = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch('https://jsonplaceholder.typicode.com/users/1');
      const datos = await respuesta.json();
      setUsuario(datos);
    } catch (error) {
      console.error('Error al consumir la API', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Consumo de API: Usuario</h2>
      <button
        onClick={obtenerDatos}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-all cursor-pointer"
      >
        {cargando ? 'Consultando API...' : 'Obtener Usuario'}
      </button>
      {usuario && <TarjetaUsuario nombre={usuario.name} correo={usuario.email} />}
    </div>
  );
}
