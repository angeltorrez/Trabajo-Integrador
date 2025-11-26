# Aplicación de Gestión de Tareas — Trabajo Integrador

Documentación del proyecto, instalación, ejecución y descripción de las funcionalidades.

## Descripción
Aplicación web para la gestión de tareas pensada para un entorno corporativo. Consta de:
- Un servidor Node.js + Express que expone una API y maneja autenticación con JWT (almacenado en cookies httpOnly).
- Un frontend en React + Vite/TypeScript con componentes estilizados con TailwindCSS.

El objetivo es que empleados puedan iniciar sesión, crear/gestionar tareas y ver información relacionada con su rol.

## Requisitos
- Node.js v18+ (se recomienda la versión más reciente LTS).
- npm o bun (si prefieres usar bun para dev server en el frontend).
- MongoDB accesible (Atlas o local).

## Estructura del repositorio (resumen)
```
Server/                      # Servidor Express
  routes/                    # Rutas separadas (auth, todos)
  models/                    # Modelos Mongoose
  utils.js                   # Helpers (asyncHandler)
  index.js                   # Entrypoint (monta routers)
  README.md                  # Documentación del servidor

Trabajo-Final-cilsa2025/     # Frontend React + Vite + TypeScript
  src/
    pages/                   # Páginas (Login, Dashboard, Home...)
    components/              # Componentes (Navbar, etc.)
    Create.tsx               # Componente para crear tareas
  package.json
  tsconfig.json
  ...

README.md                    # (este archivo) documentación global del proyecto
```

## Variables de entorno (Server)
Crear `Server/.env` (no incluir en git). Variables mínimas:

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/YourDB
ACCESS_TOKEN_SECRET=un-secreto-para-access
REFRESH_TOKEN_SECRET=un-secreto-para-refresh
FRONTEND_URL=http://localhost:5173
PORT=3001
```

Explicación:
- `MONGO_URI`: cadena de conexión a MongoDB.
- `ACCESS_TOKEN_SECRET` y `REFRESH_TOKEN_SECRET`: claves para firmar JWT.
- `FRONTEND_URL`: origen permitido por CORS.

## Instalación y ejecución

1. Instalar dependencias del servidor

```powershell
cd "c:\Users\webada\Trabajo Integrador\Server"
npm install
```

2. Ejecutar servidor (desarrollo)

```powershell
npm run start
# o: node index.js
```

3. Instalar y ejecutar frontend

```powershell
cd "c:\Users\webada\Trabajo Integrador\Trabajo-Final-cilsa2025"
npm install
npm run dev
# o si usas bun: bun install && bun run dev
```

La app de frontend por defecto corre en `http://localhost:5173` y el servidor en `http://localhost:3001`.

### Nota sobre cookies y CORS
El frontend debe enviar credenciales en peticiones fetch/axios: `withCredentials: true` o `credentials: 'include'`.

## API — Rutas principales (Servidor)

- POST `/login`
  - Body: `{ legajo, password }`
  - Respuesta: `{ Login: true, message }` y cookies `accessToken` y `refreshToken` (httpOnly).

- POST `/logout`
  - Limpia las cookies de auth. Respuesta: `{ logout: true }`.

- GET `/dashboard`
  - Requiere token (verificado). Respuesta: `{ valid: true, message, legajo, rol }`.

- GET `/get`
  - Lista todas las tareas.

- POST `/add`
  - Requiere token. Body: `{ task }`.
  - El servidor toma `role` desde el token verificado y persiste la tarea con `{ task, role }`.

- PUT `/update/:id`
  - Marca una tarea como completada (actualmente setea `completed: true`).

- DELETE `/delete/:id`
  - Elimina la tarea por id.

Todas las rutas devuelven JSON. En desarrollo las rutas esperan que el cliente mande cookies de autenticación.

## Frontend — páginas y componentes

- `src/pages/Login.tsx` — formulario de inicio de sesión, manejo de errores, `axios.post('/login')`.
- `src/pages/Dashboard.tsx` — lista de tareas, manejo de carga/errores, uso del componente `Create`.
- `src/Create.tsx` — input mejorado para crear tareas, validación, submit con Enter y botón.
- `src/components/navbar.tsx` — barra superior, muestra `legajo` y `rol`, botón de logout que llama `POST /logout`.
- `src/Home.tsx` — landing ligera con estilo corporativo (hero + panel lateral).

## Tests (servidor)
Incluimos pruebas básicas con el runner nativo de Node. En `Server/tests/` hay una prueba que verifica la presencia de routers y utilidades.

Ejecutar tests (desde `Server`):

```powershell
cd "c:\Users\webada\Trabajo Integrador\Server"
npm run test
```

Nota: las pruebas actuales son unitarias simples (verifican exports). Si quieres tests de integración (endpoints), se recomienda refactorizar `index.js` para exportar `app` sin llamar a `listen()`, y entonces añadir `supertest`.

## Seguridad y buenas prácticas
- El servidor extrae el `role` del token verificado para persistirlo (no confiar en valores enviados por el cliente).
- Nunca commitees `.env` con secretos.
- En producción usa HTTPS y `NODE_ENV=production` para habilitar `secure` en cookies.
- Considera hashear las contraseñas (`bcrypt`) en lugar de almacenarlas en texto plano.

## Despliegue (breve)
- Asegura variables de entorno en el servidor de producción.
- Usa un reverse proxy (NGINX) o plataforma (Heroku, Vercel, Railway) y habilita HTTPS.

## Contribuir
- Fork / branch / pull request. Sigue convenciones de estilo (TypeScript para frontend, ESLint si está habilitado).

---
Si quieres, puedo:
- Añadir tests de integración con `supertest` (necesita exportar `app` desde `index.js`).
- Generar un `Dockerfile` y `docker-compose` para facilitar puesta en marcha local.

Contacta para que adapte el README a público objetivo o genere archivos auxiliares (Docker, CI).
