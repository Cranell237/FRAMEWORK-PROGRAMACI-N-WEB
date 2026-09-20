// src/components/Catalogo.tsx
// Importamos useState (para guardar los productos) y useEffect (para pedirlos al cargar el componente).
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import type { Producto } from '../context/CartContext';
// Importamos la función que pide el catálogo al backend de Go.
import { getProductos } from '../services/api';

const Catalogo = () => {
  const { addToCart } = useCart(); // <-- Usamos la función del contexto

  // ===== CÓDIGO ANTERIOR (productos escritos a mano en el frontend) - conservado como referencia =====
  // const productos = [
  //   { id: 1, nombre: "Serum Revitalizante", precio: 45.00, img: "https://picsum.photos/seed/serum/150" },
  //   { id: 2, nombre: "Crema Hidratante Pro", precio: 32.50, img: "https://picsum.photos/seed/crema/150" },
  //   { id: 3, nombre: "Tónico Purificante", precio: 28.00, img: "https://picsum.photos/seed/tonico/150" },
  //   { id: 4, nombre: "Mascarilla Nocturna", precio: 50.00, img: "https://picsum.photos/seed/mascarilla/150" },
  // ];
  // ===================================================================================================

  // NUEVA VERSIÓN: los productos ahora empiezan vacíos y se llenan con lo que responda el backend.
  const [productos, setProductos] = useState<Producto[]>([]);
  // Estado opcional para mostrar un mensaje mientras se cargan los datos.
  const [cargando, setCargando] = useState<boolean>(true);

  // useEffect con arreglo de dependencias vacío [] se ejecuta UNA sola vez, cuando el componente aparece en pantalla.
  useEffect(() => {
    getProductos()
      // Cuando el backend responde, guardamos los productos en el estado (esto vuelve a dibujar la lista).
      .then((data) => setProductos(data))
      // Si algo falla (backend apagado, error de red), lo mostramos en la consola del navegador.
      .catch((err) => console.error('Error al cargar productos:', err))
      // Pase lo que pase, dejamos de mostrar el mensaje de "cargando".
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Catálogo de Productos</h1>
      {/* Mientras esperamos la respuesta del backend mostramos un aviso al usuario. */}
      {cargando && <p className="text-slate-500 mb-4">Cargando productos desde el servidor...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productos.map((prod) => (
          <div key={prod.id} className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm flex flex-col">
            <img src={prod.img} alt={prod.nombre} className="w-full h-40 object-cover" />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-slate-700">{prod.nombre}</h3>
              <p className="text-indigo-600 font-bold mt-2 mb-4">${prod.precio.toFixed(2)}</p>              
             
              <button 
                onClick={() => addToCart(prod)}
                className="mt-auto w-full bg-slate-900 text-white py-2 rounded text-sm hover:bg-indigo-600 transition"
              >
                Añadir al Carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;