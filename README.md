# MultiCatálogo

Aplicación web de catálogo y red multinivel desarrollada como monorepo. Incluye una SPA en React, una API REST en Go con Fiber y persistencia relacional en PostgreSQL.

## Tecnologías

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS y React Router.
- **Backend:** Go, Fiber y pgx.
- **Base de datos:** PostgreSQL 16 ejecutado con Docker Compose.

## Arquitectura

```text
React (puerto 5173)
        │ HTTP/JSON
        ▼
Go + Fiber (puerto 3000)
        │
        ▼
Repository + pgx
        │
        ▼
PostgreSQL 16 (puerto 5432)
```

```text
Backend/
├── config/          # Conexión y pool de PostgreSQL
├── controllers/     # Manejo de peticiones y respuestas HTTP
├── database/        # Esquema y datos iniciales
├── models/          # Estructuras del dominio y errores de la API
├── repository/      # Consultas SQL
└── routes/          # Registro de endpoints

Frontend/src/
├── components/      # Vistas de la aplicación
├── context/         # Autenticación y carrito
├── data/            # Tipos y cálculos del dominio
├── hooks/           # Carga de la red desde la API
└── services/        # Comunicación con el backend
```

## Avance de la Fase 1

La primera fase preparó la API para manejar entradas y errores de forma consistente:

- Se creó `APIError` con los campos `status`, `message` y `details` opcional.
- El login valida que `email` y `password` no estén vacíos y devuelve HTTP 400 cuando faltan.
- La búsqueda de productos valida el parámetro `id` y devuelve HTTP 400 si no es numérico.
- Se añadió `GET /api/health` para comprobar el estado del servidor.
- Se mantuvieron los contratos JSON utilizados por el frontend.

## Avance de la Fase 2

La segunda fase reemplazó los datos en memoria por persistencia real:

- Se incorporó PostgreSQL 16 mediante Docker Compose, con volumen persistente y comprobación de salud.
- Se crearon las tablas `usuarios`, `productos` y `referidos`.
- El script inicial carga 2 usuarios, 8 productos y la red multinivel de ejemplo.
- Se añadió la conexión con `pgxpool`, cargada desde variables de entorno.
- Se creó la capa `repository` para consultar usuarios, productos y referidos.
- El login y los endpoints de productos ahora leen PostgreSQL.
- Se añadió `GET /api/red`, que reconstruye el árbol a partir de `parent_id`.
- Catálogo, tienda, detalle, Dashboard y Mi Red consumen la API real.
- La sesión de la interfaz se conserva durante una recarga mediante `sessionStorage`.
- Se comprobó la persistencia modificando un precio en PostgreSQL y verificándolo en React.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/login` | Valida las credenciales almacenadas en PostgreSQL. |
| `GET` | `/api/productos` | Devuelve todos los productos. |
| `GET` | `/api/productos/:id` | Devuelve un producto por ID. |
| `GET` | `/api/red` | Devuelve el árbol de referidos. |
| `GET` | `/api/health` | Comprueba que la API está operativa. |

## Requisitos

- Docker Desktop con Docker Compose.
- Go 1.26 o compatible.
- Node.js y npm.

## Ejecución local

### 1. Base de datos y backend

Desde `Backend/`, crea el archivo local de configuración a partir del ejemplo:

```powershell
Copy-Item .env.example .env
```

Inicia PostgreSQL:

```powershell
docker compose up -d --wait
```

Inicia la API:

```powershell
go run .
```

La API estará disponible en `http://localhost:3000`. El archivo `Backend/.env` contiene configuración local y está excluido de Git.

### 2. Frontend

En otra terminal, desde `Frontend/`:

```powershell
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@upse.edu.ec` | `123456` |
| Cliente | `cliente@upse.edu.ec` | `123456` |

Las contraseñas en texto plano y los tokens ficticios forman parte del alcance académico actual. No constituyen autenticación lista para producción.

## Verificación

```powershell
go -C Backend test ./...
npm --prefix Frontend run build
npm --prefix Frontend run lint
```

Para detener PostgreSQL sin borrar los datos persistidos:

```powershell
docker compose --project-directory Backend down
```

Consulta [Backend/README.md](Backend/README.md) para detalles de inicialización y mantenimiento de la base de datos.
