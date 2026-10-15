# MultiCatálogo

Aplicación web de catálogo y red multinivel desarrollada como monorepo. Incluye una SPA en React, una API REST en Go con Fiber, persistencia relacional en PostgreSQL y caché de lecturas con Redis.

## Tecnologías

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS y React Router.
- **Backend:** Go, Fiber, pgx y go-redis.
- **Datos:** PostgreSQL 16 y Redis Alpine ejecutados con Docker Compose.

## Arquitectura

```text
React (puerto 5173)
        │ HTTP/JSON
        ▼
Go + Fiber (puerto 3000)
        │ Cache-Aside
        ├──────────────► Redis (puerto 6379)
        │ MISS/BYPASS
        ▼
Repository + pgx ─────► PostgreSQL 16 (puerto 5432)
```

```text
Backend/
├── config/          # Conexiones con PostgreSQL y Redis
├── controllers/     # HTTP y estrategia Cache-Aside
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

## Avance de la Fase 3

La tercera fase incorporó Redis para reducir consultas repetidas a PostgreSQL:

- Se añadió Redis Alpine a Docker Compose con puerto local `6379` y healthcheck.
- Se incorporó el cliente oficial `github.com/redis/go-redis/v9`, configurado mediante `REDIS_URL`.
- La API comprueba las conexiones con PostgreSQL y Redis al arrancar y cierra ambos clientes al detenerse.
- `GET /api/productos` implementa Cache-Aside con la clave `productos:all` y TTL de 5 minutos.
- `GET /api/red` utiliza la clave `red:tree:{email_usuario}` y TTL de 10 minutos.
- El frontend envía el correo de la sesión en `X-User-Email` para separar la caché de la red por usuario.
- Las respuestas cacheadas incluyen `X-Cache: MISS`, `HIT` o `BYPASS`, visible en Network o Postman.
- Si Redis deja de estar disponible después del arranque, la API continúa consultando PostgreSQL y responde con `BYPASS`.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/login` | Valida las credenciales almacenadas en PostgreSQL. |
| `GET` | `/api/productos` | Devuelve todos los productos. |
| `GET` | `/api/productos/:id` | Devuelve un producto por ID. |
| `GET` | `/api/red` | Devuelve el árbol de referidos. |
| `GET` | `/api/health` | Comprueba que la API está operativa. |

## Requisitos

- Docker Desktop con Docker Compose para PostgreSQL y Redis.
- Go 1.26 o compatible.
- Node.js y npm.

## Ejecución local

### 1. Base de datos y backend

Desde `Backend/`, crea el archivo local de configuración a partir del ejemplo:

```powershell
Copy-Item .env.example .env
```

Inicia PostgreSQL y Redis:

```powershell
docker compose up -d --wait
```

Inicia la API:

```powershell
go run .
```

La API estará disponible en `http://localhost:3000`. El archivo `Backend/.env` contiene la configuración local de PostgreSQL y Redis, y está excluido de Git.

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

Comprueba la infraestructura:

```powershell
docker compose --project-directory Backend ps
docker compose --project-directory Backend exec redis redis-cli ping
```

Para observar Cache-Aside desde PowerShell:

```powershell
$primera = Invoke-WebRequest http://localhost:3000/api/productos
$segunda = Invoke-WebRequest http://localhost:3000/api/productos
$primera.Headers["X-Cache"]  # MISS si la clave no existía
$segunda.Headers["X-Cache"]  # HIT
```

La caché puede limpiarse manualmente durante una demostración:

```powershell
docker compose --project-directory Backend exec redis redis-cli DEL productos:all
docker compose --project-directory Backend exec redis redis-cli DEL red:tree:admin@upse.edu.ec
```

Para detener PostgreSQL y Redis sin borrar el volumen de PostgreSQL:

```powershell
docker compose --project-directory Backend down
```

Consulta [Backend/README.md](Backend/README.md) para detalles de inicialización y mantenimiento de la base de datos.
