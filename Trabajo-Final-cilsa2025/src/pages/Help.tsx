import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';

const Help = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar legajo={''} rol={''} />

            <div className="flex items-center justify-center py-12 px-4">
                <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-semibold text-gray-800">Solicitud de Ayuda</h1>
                    <p className="mt-2 text-sm text-gray-600">Rellene este formulario y un administrador se pondrá en contacto con usted.</p>

                    <HelpForm />
                </div>
            </div>
        </div>
    );
};

const HelpForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const validateEmail = (value: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!validateEmail(email)) {
            setError('Por favor ingrese un correo válido.');
            return;
        }
        if (!description.trim()) {
            setError('Describa brevemente el problema.');
            return;
        }

        try {
            setLoading(true);
            await axios.post('http://localhost:3001/help', { email, description });
            setSuccess('Su solicitud fue enviada. Un administrador se contactará pronto.');
            setEmail('');
            setDescription('');
        } catch (err) {
            console.error('Help submit error:', err);
            setError('No se pudo enviar la solicitud. Intente más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo corporativo</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="tu.nombre@empresa.com"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción del problema</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describa lo que sucede, pasos para reproducir y cualquier información relevante"
                    required
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Un administrador revisará su solicitud en breve.</div>
                <div className="flex items-center space-x-3">
                    {error && <div className="text-sm text-red-600">{error}</div>}
                    {success && <div className="text-sm text-green-600">{success}</div>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {loading ? 'Enviando...' : 'Enviar solicitud'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Help;