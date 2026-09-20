# MultiCatálogo — Frontend (React + TypeScript + Vite)

Frontend de la práctica **"Conectar Backend a Frontend"**. Es una aplicación de catálogo
de productos con inicio de sesión, construida con React, TypeScript y Vite.

Originalmente los datos (login y productos) estaban escritos a mano dentro del propio
frontend. En esta versión, la aplicación **se conecta a una API REST** hecha en **Go (Fiber)**
y obtiene los datos reales desde el servidor.

## ¿Qué se hizo en esta práctica?

Se reemplazaron los datos *hardcodeados* del frontend por llamadas HTTP a la API del backend:

- **Nueva capa de servicios** [`src/services/api.ts`](src/services/api.ts): centraliza todas las
  llamadas al backend (`login()` y `getProductos()`) usando `fetch`.
- **[`src/components/Login.tsx`](src/components/Login.tsx)**: la autenticación ahora la valida el
  backend mediante `POST /api/login` (antes se comparaban las credenciales en el navegador).
- **[`src/components/Catalogo.tsx`](src/components/Catalogo.tsx)**: los productos se cargan del
  backend mediante `GET /api/productos` usando `useEffect` (antes eran una lista fija en el código).

> El código anterior se conservó **comentado** en cada archivo, como referencia de la evolución.

## Requisitos

- **Node.js** 18+ y npm (para el frontend).
- **Go** 1.21+ (para el backend, ubicado en la carpeta hermana `multicatalogo-backend`).

## Cómo levantar el proyecto

El proyecto son **dos programas** que deben correr **al mismo tiempo**, cada uno en su terminal.

### 1. Backend (API en Go) — puerto 3000

```bash
cd ../multicatalogo-backend
go run main.go
```

Expone dos endpoints:

| Método | Endpoint          | Descripción                                  |
|--------|-------------------|----------------------------------------------|
| `POST` | `/api/login`      | Valida credenciales y devuelve `{token, email}` |
| `GET`  | `/api/productos`  | Devuelve el catálogo de productos en JSON    |

### 2. Frontend (React) — puerto 5173

```bash
cd Practica03_a_05_de_la_Unidad
npm install
npm run dev
```

Luego abre en el navegador: **http://localhost:5173**

### Credenciales de prueba

```
Correo:      admin@upse.edu.ec
Contraseña:  123456
```

## Nota sobre CORS

El backend usa el middleware CORS para autorizar las peticiones del frontend. Está configurado
para aceptar el origen `http://localhost:5173` (donde Vite abre la app por defecto). Si cambias el
puerto del frontend, debes actualizar `AllowOrigins` en el `main.go` del backend; de lo contrario
el navegador bloqueará las peticiones.

## Scripts disponibles

| Comando           | Descripción                                      |
|-------------------|--------------------------------------------------|
| `npm run dev`     | Levanta el servidor de desarrollo (Vite + HMR)   |
| `npm run build`   | Compila TypeScript y genera el build de producción |
| `npm run preview` | Sirve localmente el build de producción          |
| `npm run lint`    | Ejecuta el linter                                |

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router.
- **Backend:** Go, framework [Fiber](https://gofiber.io/), middleware CORS.
