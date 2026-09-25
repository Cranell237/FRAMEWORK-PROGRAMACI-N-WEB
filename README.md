# FRAMEWORK-PROGRAMACIÓN-WEB

Repositorio de la asignatura **Framework Programación Web** (Periodo 2026-02). Reúne las
prácticas, trabajos en clase y la lección de la Unidad 1 en un solo repositorio (monorepo).

Las ramas `main` y `develop` contienen **todo integrado**; además, cada trabajo tiene su
**propia rama** con el contenido en la raíz para que se pueda revisar por separado.

---

## Estructura de carpetas (en `main` / `develop`)

| Carpeta | Descripción |
|---|---|
| [`Conectar Backend a Frontend/`](Conectar%20Backend%20a%20Frontend) | Proyecto **MultiCatálogo**: `Backend/` (API REST en Go + Fiber) y `Frontend/` (React 19 + TypeScript + Vite + Tailwind). Conexión backend↔frontend y la **lección de la Unidad 1 (Tema 5)**: roles admin/cliente, storefront a pantalla completa, catálogo con filtros, detalle con lightbox, carrito persistente, checkout y red multinivel. |
| [`Extension_trabajo_en_clases/`](Extension_trabajo_en_clases) | Trabajo en clase: **Sidebar** colapsable y responsive con iconos. Incluye su frontend (`Practica03_a_05_de_la_Unidad/`) y su backend (`multicatalogo-backend/`). |
| [`Practica02_React_Bases-PokenApi/`](Practica02_React_Bases-PokenApi) | Práctica 02 — bases de React consumiendo la **PokéAPI**. |
| [`Practica03_React_Bases/`](Practica03_React_Bases) | Práctica 03 — bases de React. |

---

## Ramas del repositorio

El repo usa las ramas de dos maneras:

**1. Tronco integrado (aquí se sigue trabajando):**

| Rama | Contenido |
|---|---|
| `main` | Tronco estable. Todo el proyecto integrado y al día. |
| `develop` | Rama de trabajo. Mismo contenido que `main`; aquí se desarrolla y luego se fusiona a `main`. |

**2. Una rama por trabajo (para revisión aislada):** cada una tiene el contenido de su
carpeta **en la raíz**, así basta con posicionarse en la rama para ver ese proyecto directo.

| Rama | Equivale a la carpeta |
|---|---|
| `Conectar_Backend_a_Frontend` | `Conectar Backend a Frontend/` |
| `Extension_trabajo_en_clases` | `Extension_trabajo_en_clases/` |
| `Practica02_React_Bases-PokenApi` | `Practica02_React_Bases-PokenApi/` |
| `Practica03_React_Bases` | `Practica03_React_Bases/` |
| `leccion_unidad_1` | Trabajo de la lección Unidad 1 (equivale a `develop`) |

> Nota: la rama `Conectar_Backend_a_Frontend` usa guiones bajos porque Git no admite
> espacios en los nombres de rama; su contenido es idéntico al de la carpeta.

Para revisar un trabajo en su rama:

```bash
git switch Practica03_React_Bases   # o el nombre de la rama que se quiera revisar
```

---

## Cómo levantar el proyecto principal (`Conectar Backend a Frontend`)

Son **dos procesos** que corren a la vez, cada uno en su terminal.

**Backend (Go + Fiber) — puerto 3000:**

```bash
cd "Conectar Backend a Frontend/Backend"
go run main.go
```

**Frontend (React + Vite) — puerto 5173:**

```bash
cd "Conectar Backend a Frontend/Frontend"
npm install   # solo la primera vez
npm run dev
```

Luego abrir **http://localhost:5173**.

### Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Admin | `admin@upse.edu.ec` | `123456` |
| Cliente | `cliente@upse.edu.ec` | `123456` |

> Cada práctica de React (`Practica02...`, `Practica03...`) se levanta igual con
> `npm install` y `npm run dev` dentro de su carpeta.

---

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router.
- **Backend:** Go con el framework [Fiber](https://gofiber.io/) y middleware CORS.
