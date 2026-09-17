# Práctica 02 - React: Consumo de API con navegación SPA

Interfaz desarrollada en **React + TypeScript + Vite + Tailwind CSS** que consume datos
desde APIs públicas y utiliza **navegación SPA** (Single Page Application) con
`react-router-dom`, es decir, se cambia de vista sin recargar la página.

## Funcionalidades

- **Navegación SPA** con una barra superior (`Inicio` / `Pokémon`) usando `react-router-dom`.
  La vista cambia sin recargar el navegador y la URL se actualiza (`/` y `/pokemon`).
- **Vista Inicio:** botón *Obtener Usuario* que consume la API
  `https://jsonplaceholder.typicode.com/users/1` y muestra el resultado en una tarjeta.
- **Vista Pokémon:** botón *Cargar Pokémon* que consume la API
  `https://pokeapi.co/api/v2/pokemon?limit=151` y muestra los 151 Pokémon de la primera
  generación en tarjetas (número, imagen y nombre), con un **buscador** por nombre.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior (probado con Node 24).
- npm (se instala junto con Node.js).

## Cómo levantar el proyecto en local

1. Clonar el repositorio y entrar a la carpeta del proyecto:

   ```bash
   git clone https://github.com/Cranell237/FRAMEWORK-PROGRAMACI-N-WEB.git
   cd "FRAMEWORK-PROGRAMACI-N-WEB/Practica02_React_Bases - copia"
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir en el navegador la URL que muestra la consola (por defecto
   `http://localhost:5173`).

## Scripts disponibles

- `npm run dev` — servidor de desarrollo con recarga en caliente (HMR).
- `npm run build` — compila TypeScript y genera la versión de producción en `dist/`.
- `npm run preview` — sirve localmente la versión ya compilada.
- `npm run lint` — ejecuta ESLint.

## Estructura principal

```
src/
├── App.tsx                       # Router y barra de navegación SPA
├── main.tsx                      # Punto de entrada
├── pages/
│   ├── InicioPage.tsx            # Vista con consumo de API de usuario
│   └── PokemonPage.tsx           # Vista con consumo de la PokeAPI (151)
└── components/
    ├── TarjetaUsuario.tsx        # Tarjeta del usuario
    └── TarjetaPokemon.tsx        # Tarjeta de cada Pokémon
```
