# Backend MultiCatálogo

## Desarrollo local

Desde `Backend/`:

1. Copia `.env.example` a `.env` si todavía no existe. Ajusta sus valores para tu equipo. `.env` no se versiona.
2. Inicia PostgreSQL con `docker compose up -d --wait`.
3. Inicia la API con `go run .`. La API escucha en `http://localhost:3000`.

El archivo `database/init.sql` crea las tablas y carga los datos de ejemplo cuando Docker inicializa un volumen vacío. Para aplicar el script a una base que ya existía antes de agregarlo, ejecuta:

```powershell
docker compose exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/01-init.sql'
```

El script puede ejecutarse más de una vez: los registros existentes se conservan. Para detener PostgreSQL sin borrar sus datos, usa `docker compose down`.

Desde `Frontend/`, inicia React con `npm run dev`. El catálogo y la red consultan la API de Go, que a su vez lee PostgreSQL.

Para comprobar la persistencia, modifica `precio` en `productos` y vuelve a cargar `/catalogo` o `/tienda`. Las contraseñas y tokens actuales son únicamente de demostración; no son un sistema de autenticación de producción.
