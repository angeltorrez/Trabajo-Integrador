import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ToggleDark from "../components/toggleDark";
import API_BASE_URL from "../config/api";

axios.defaults.withCredentials = true;

const Login = () => {
    const navigate = useNavigate();
    const [legajo, setLegajo] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const legajoTrim = legajo.trim();
        const passwordTrim = password;

        if (!legajoTrim || !passwordTrim) {
            setError("Ingrese legajo y contraseña");
            return;
        }

        setLoading(true);
        try {
        await axios.post(`${API_BASE_URL}/login`, { legajo: legajoTrim, password: passwordTrim });
            // Broadcast login to other tabs
            if ('BroadcastChannel' in window) {
                try {
                    new BroadcastChannel('auth-change').postMessage({ login: true });
                } catch (e) {
                    // BroadcastChannel not supported
                }
            }
            // Si llega aquí, el servidor respondió 2xx. Redirigir al Dashboard.
            navigate("/Dashboard");
        } catch (err: any) {
            if (err?.response?.status === 401) {
                setError("Legajo o contraseña incorrectos");
            } else {
                console.error("Login error:", err);
                setError("Error de conexión. Intente más tarde.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-app py-12 px-4">
            <div className="fixed top-4 right-4 z-50">
                <ToggleDark />
            </div>
            <div className="max-w-md w-full card rounded-lg p-8">
                <h1 className="text-2xl font-semibold text-app mb-4">Acceso al sistema</h1>
                <p className="text-sm muted mb-6">Ingrese sus credenciales de la compañía para continuar.</p>
                <div className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label htmlFor="legajo" className="block text-sm font-medium text-gray-700">Legajo</label>
                        <input
                            id="legajo"
                            name="legajo"
                            type="text"
                            value={legajo}
                            onChange={(e) => setLegajo(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 btn-primary rounded-md disabled:opacity-60"
                        >
                            {loading ? "Ingresando..." : "Ingresar"}
                        </button>
                        <a href="/help" className="text-sm text-primary hover:underline">Ayuda</a>
                    </div>

                    {error && (
                        <div className="mt-2 text-sm text-red-600" role="alert" aria-live="assertive">{error}</div>
                    )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
