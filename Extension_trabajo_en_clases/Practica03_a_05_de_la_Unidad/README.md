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

- **Node.js** 20.19+ o 22.12+ y npm (lo exige Vite 8; con Node 18 la instalación/compilación falla).
- **Go** 1.26+ (el módulo declara `go 1.26.0` en `multicatalogo-backend/go.mod`).

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

## Acceder desde el celular (misma red Wi-Fi)

Se puede abrir la app desde un celular u otro dispositivo, siempre que esté **conectado a la
misma red** que la PC que corre los servidores.

1. **Averigua la IP de tu PC en la red.** En Windows ejecuta `ipconfig` y busca la
   "Dirección IPv4" de tu adaptador activo (por ejemplo `192.168.1.9`).
2. **Levanta el frontend visible en la red** (bandera `--host`):
   ```bash
   npm run dev -- --host
   ```
3. **Levanta el backend autorizando tu IP** mediante la variable de entorno `CORS_ORIGINS`
   (así no hay que editar el código):
   ```bash
   CORS_ORIGINS="http://<IP_DE_TU_PC>:5173" go run main.go
   ```
   El backend ya escucha en todas las interfaces por defecto.
4. **En el celular**, abre en el navegador: `http://<IP_DE_TU_PC>:5173` (ej. `http://192.168.1.9:5173`).

El frontend arma la URL del backend automáticamente con el host desde el que se abrió
(ver [`src/services/api.ts`](src/services/api.ts)), así que **no hay que configurar nada en el celular**.

> ⚠️ **Importante para la presentación:** el backend solo autoriza (CORS) los orígenes de la variable
> `CORS_ORIGINS` (o `localhost` por defecto si no se define). Si pruebas en otra red, solo cambia el valor
> de esa variable al arrancar el backend; **no** hay que editar el código. El `api.ts` tampoco se toca.

> Si el celular no carga la página, revisa el **Firewall de Windows** (permite Node.js y Go en redes
> privadas, o abre los puertos 5173 y 3000) y que el router no tenga activado el *aislamiento de clientes*.

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
