# Servidor

Descripción
-----------
Esta carpeta contiene el servidor Express de la aplicación. Las rutas están separadas por responsabilidad:

- `routes/auth.js` — rutas de autenticación: `/login`, `/logout`, `/dashboard` y el middleware `verifyToken`.
- `routes/todos.js` — rutas de tareas: `/get`, `/add`, `/update/:id`, `/delete/:id`.

Utilidades
----------
- `utils.js` exporta `asyncHandler(fn)`, un helper para envolver controladores async y propagar errores al middleware de Express.

Variables de entorno
--------------------
Crear un archivo `.env` en esta carpeta (NO lo incluyas en el repositorio). Variables de ejemplo:

- `MONGO_URI` — cadena de conexión a MongoDB (obligatoria).
- `ACCESS_TOKEN_SECRET` — secreto JWT para access tokens (obligatorio).
- `REFRESH_TOKEN_SECRET` — secreto JWT para refresh tokens (obligatorio).
- `FRONTEND_URL` — origen permitido por CORS (opcional, por defecto `http://localhost:5173`).
- `PORT` — puerto del servidor (opcional, por defecto `3001`).

Rutas (resumen)
---------------
- POST `/login` — body `{ legajo, password }` -> crea cookies `accessToken` y `refreshToken`.
- POST `/logout` — elimina las cookies de autenticación.
- GET `/dashboard` — requiere token; devuelve `{ valid, legajo, rol }`.

- GET `/get` — lista las tareas.
- POST `/add` — requiere token; body `{ task }`. El servidor toma `role` del token verificado y lo persiste.
- PUT `/update/:id` — marca una tarea como completada.
- DELETE `/delete/:id` — elimina una tarea.

Notas
-----
- El servidor guarda los tokens en cookies `httpOnly`; asegúrate de que el frontend envíe las peticiones con credenciales (`axios` con `withCredentials: true` o `fetch` con `credentials: 'include'`).
- En producción, fija `NODE_ENV=production` y usa HTTPS para que la opción `secure` en las cookies funcione correctamente.

Pruebas
-------
Se incluyen pruebas básicas usando el runner nativo de Node (`node --test`). Para ejecutarlas desde la carpeta `Server`:

```powershell
npm run test
```

Las pruebas verifican la presencia y forma básica de los routers y utilidades; no arrancan el servidor completo.
