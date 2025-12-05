const VITE_API_URL = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;

// En producción usar VITE_API_URL si está definida (por ejemplo: https://tu-backend.vercel.app)
// En desarrollo usar localhost:3001
export const API_BASE_URL = VITE_API_URL ?? (isDev ? 'http://localhost:3001' : window.location.origin);

export default API_BASE_URL;
