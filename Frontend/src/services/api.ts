// src/services/api.ts
// Esta es la "capa de servicios": centraliza TODAS las llamadas al backend (la API de Go).
// La ventaja es que si mañana cambia la URL del servidor, solo la editas aquí en un lugar,
// y no tienes que buscarla por todos los componentes.

// Importamos el tipo Producto que ya estaba definido en el CartContext para reutilizarlo.
import type { Producto } from '../context/CartContext';

// ===== VERSIÓN ANTERIOR (fija a localhost) - conservada como referencia =====
// Funciona en la PC, pero NO desde un celular: para el celular "localhost" es el propio celular.
// const API_URL = 'http://localhost:3000';
// =============================================================================

// NUEVA VERSIÓN: la URL del backend se arma con el MISMO host desde el que se abrió el frontend.
// - Si abres http://localhost:5173      -> hostname = "localhost"    -> backend en localhost:3000
// - Si el celular abre http://192.168.1.9:5173 -> hostname = "192.168.1.9" -> backend en 192.168.1.9:3000
// Así funciona igual en la PC y en cualquier dispositivo de la misma red, sin tocar el código.
const API_URL = `http://${window.location.hostname}:3000`;

// Definimos la forma de la respuesta que devuelve el backend cuando el login es exitoso.
export interface LoginResponse {
  token: string;
  email: string;
}

// login() envía el correo y la contraseña al endpoint POST /api/login del backend.
export async function login(email: string, password: string): Promise<LoginResponse> {
  // fetch hace la petición HTTP. Le indicamos método POST y que el cuerpo va en formato JSON.
  const respuesta = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Convertimos el objeto JS a texto JSON. Las claves email/password coinciden con el struct de Go.
    body: JSON.stringify({ email, password }),
  });

  // Si el backend responde con un estado de error (ej. 401 credenciales incorrectas), lanzamos un error.
  if (!respuesta.ok) {
    throw new Error('Credenciales incorrectas');
  }

  // Si todo salió bien, convertimos la respuesta JSON a un objeto JS y lo retornamos.
  return respuesta.json();
}

// getProductos() pide el catálogo al endpoint GET /api/productos del backend.
export async function getProductos(): Promise<Producto[]> {
  // fetch por defecto usa el método GET, así que no hace falta configurarlo.
  const respuesta = await fetch(`${API_URL}/api/productos`);

  // Verificamos que la petición fue exitosa antes de intentar leer los datos.
  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar los productos');
  }

  // Devolvemos el array de productos ya convertido a objetos JS.
  return respuesta.json();
}
