import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center">
            <div className="max-w-6xl mx-auto w-full px-6 py-16">
                <div className="bg-white rounded-lg shadow-md overflow-hidden md:flex">
                    <div className="p-8 md:w-2/3">
                        <h1 className="text-3xl font-semibold text-gray-800">Bienvenido a la Plataforma Corporativa</h1>
                        <p className="mt-3 text-gray-600">Gestiona tus tareas diarias, colabora con tu equipo y mantén el seguimiento de actividades en un entorno seguro y profesional.</p>

                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                            <Link to="/login" className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">Iniciar sesión</Link>
                            <Link to="/Dashboard" className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Ir al Panel</Link>
                        </div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-md">
                                <h3 className="text-sm font-medium text-gray-700">Tareas recientes</h3>
                                <p className="mt-2 text-xs text-gray-500">Revisa y completa las asignaciones pendientes.</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-md">
                                <h3 className="text-sm font-medium text-gray-700">Colaboración</h3>
                                <p className="mt-2 text-xs text-gray-500">Comparte actualizaciones y coordina con tu equipo.</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-md">
                                <h3 className="text-sm font-medium text-gray-700">Historial</h3>
                                <p className="mt-2 text-xs text-gray-500">Accede al registro de actividades y reportes.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:w-1/3 bg-indigo-50">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-600 text-white font-bold text-xl">C</div>
                            <h2 className="mt-4 text-lg font-semibold text-gray-800">Compañía Cilsa</h2>
                            <p className="mt-2 text-sm text-gray-600">Entorno Corporativo</p>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-md shadow-sm">
                                <div>
                                    <div className="text-sm text-gray-600">Tareas abiertas</div>
                                    <div className="text-xl font-semibold text-gray-800">12</div>
                                </div>
                                <div className="text-xs text-gray-500">Hoy</div>
                            </div>

                            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-md shadow-sm">
                                <div>
                                    <div className="text-sm text-gray-600">Tareas completadas</div>
                                    <div className="text-xl font-semibold text-gray-800">34</div>
                                </div>
                                <div className="text-xs text-gray-500">Semana</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;