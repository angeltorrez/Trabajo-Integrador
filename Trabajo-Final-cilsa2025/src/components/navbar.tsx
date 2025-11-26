import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

type Props = {
    legajo?: string;
    rol?: string;
};

const Navbar = ({ legajo, rol }: Props) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const isAuth = Boolean(legajo && legajo.toString().trim().length > 0);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
        } catch (err) {
            console.warn('Logout request failed', err);
        } finally {
            // redirect to login/home regardless
            navigate('/');
        }
    };

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3">
                            <div className="bg-indigo-600 text-white font-bold rounded-md w-10 h-10 flex items-center justify-center">C</div>
                            <div className="hidden sm:block">
                                <span className="text-lg font-semibold text-gray-800">Compañía Cilsa</span>
                                <div className="text-sm text-gray-500">Entorno Corporativo</div>
                            </div>
                        </Link>
                    </div>

                    <nav className="hidden md:flex md:items-center md:space-x-6">
                        {isAuth ? (
                            <>
                                {rol === "admin" ? (
                                    <Link to="/admin" className="text-gray-700 hover:text-indigo-600">Admin Panel</Link>
                                ) : (
                                    <p className="text-gray-700">{rol}</p>
                                )}
                                <p className="text-gray-700">Legajo : {legajo}</p>
                                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 cursor-pointer">Cerrar Sesión</button>
                            </>
                        ) : (
                            <Link to="/login" className="text-gray-700 hover:text-indigo-600">Iniciar sesión</Link>
                        )}
                    </nav>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setOpen(!open)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                            aria-label="Main menu"
                        >
                            <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {open ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {open && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/Dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Inicio</Link>
                        {isAuth ? (
                            <>
                                {rol === "admin" ? (
                                    <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Admin Panel</Link>
                                ) : (
                                    <Link to="/user" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">{rol}</Link>
                                )}
                                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Perfil ({legajo})</Link>
                                <button onClick={() => { setOpen(false); handleLogout(); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-red-50">Cerrar Sesión</button>
                            </>
                        ) : (
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Iniciar sesión</Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;