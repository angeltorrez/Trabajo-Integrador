import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ToggleDark from "./components/toggleDark";

const Home = () => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        axios.defaults.withCredentials = true;
        const check = async () => {
            try {
                const resp = await axios.get('http://localhost:3001/dashboard');
                if (resp?.data?.valid) setIsAuth(true);
                else setIsAuth(false);
            } catch (err) {
                setIsAuth(false);
            }
        };
        check();

        // Listen for auth changes from other tabs
        if ('BroadcastChannel' in window) {
            try {
                const authChannel = new BroadcastChannel('auth-change');
                authChannel.onmessage = (event) => {
                    if (event.data.login === true) {
                        setIsAuth(true);
                    } else if (event.data.logout === true) {
                        setIsAuth(false);
                    }
                };
                return () => authChannel.close();
            } catch (e) {
                // BroadcastChannel not supported
            }
        }
    }, []);

    return (
        <div className={`min-h-screen flex items-center bg-app` }>
            <div className="max-w-6xl mx-auto w-full px-6 py-16">
                <div className="card rounded-lg overflow-hidden md:flex relative">
                    <div className="fixed top-4 right-4 z-50">
                        <ToggleDark />
                    </div>

                    <div className="p-8 md:w-2/3">
                        <h1 className="text-3xl font-semibold text-app">Bienvenido a la Plataforma Corporativa</h1>
                        <p className="mt-3 muted">Gestiona tus tareas diarias, colabora con tu equipo y mantén el seguimiento de actividades en un entorno seguro y profesional.</p>

                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                            {!isAuth && (
                                <Link to="/login" className="inline-flex items-center justify-center px-4 py-2 rounded-md btn-primary text-sm font-medium">Iniciar sesión</Link>
                            )}
                            <Link to="/Dashboard" className="inline-flex items-center justify-center px-4 py-2 rounded-md btn-secondary text-sm">Ir al Panel</Link>
                        </div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 card-plain rounded-md">
                                <h3 className="text-sm font-medium">Tareas recientes</h3>
                                <p className="mt-2 text-xs muted">Revisa y completa las asignaciones pendientes.</p>
                            </div>
                            <div className="p-4 card-plain rounded-md">
                                <h3 className="text-sm font-medium">Colaboración</h3>
                                <p className="mt-2 text-xs muted">Comparte actualizaciones y coordina con tu equipo.</p>
                            </div>
                            <div className="p-4 card-plain rounded-md">
                                <h3 className="text-sm font-medium">Historial</h3>
                                <p className="mt-2 text-xs muted">Accede al registro de actividades y reportes.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:w-1/3 panel rounded-md">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full" style={{backgroundColor: 'var(--color-primary)', color: 'white', fontWeight:600}}>C</div>
                            <h2 className="mt-4 text-lg font-semibold">Compañía Cilsa</h2>
                            <p className="mt-2 text-sm muted">Entorno Corporativo</p>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center justify-between px-3 py-2 card-plain rounded-md">
                                <div>
                                    <div className="text-sm muted">Tareas abiertas</div>
                                    <div className="text-xl font-semibold">12</div>
                                </div>
                                <div className="text-xs muted">Hoy</div>
                            </div>

                            <div className="flex items-center justify-between px-3 py-2 card-plain rounded-md">
                                <div>
                                    <div className="text-sm muted">Tareas completadas</div>
                                    <div className="text-xl font-semibold">34</div>
                                </div>
                                <div className="text-xs muted">Semana</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;