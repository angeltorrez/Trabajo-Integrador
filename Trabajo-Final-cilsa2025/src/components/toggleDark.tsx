
import { useEffect, useState } from 'react';

const ToggleDark = () => {
    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        // Initialize theme from localStorage or system preference
        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const dark = stored === 'dark' || (!stored && prefersDark);
        setIsDark(dark);
        if (dark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');

        const onStorage = (e: StorageEvent) => {
            if (e.key === 'theme') {
                const val = e.newValue;
                const d = val === 'dark';
                setIsDark(d);
                if (d) document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
            }
        };

        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      // Broadcast theme change to other tabs
      try {
        if ('BroadcastChannel' in window) {
          new BroadcastChannel('theme-change').postMessage({ theme: 'dark' });
        }
      } catch (e) {
        // BroadcastChannel not supported
      }
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      // Broadcast theme change to other tabs
      try {
        if ('BroadcastChannel' in window) {
          new BroadcastChannel('theme-change').postMessage({ theme: 'light' });
        }
      } catch (e) {
        // BroadcastChannel not supported
      }
    }
  };    return (
        <button
            aria-pressed={isDark}
            aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            onClick={toggle}
            className="relative cursor-pointer inline-flex items-center w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none"
            title="Cambiar tema"
        >
            <span
                className={`absolute inset-0 rounded-full transition-colors duration-300 ${isDark ? 'bg-indigo-700' : 'bg-yellow-300'}`}
            />

            <span
                className={`relative z-10 inline-block w-6 h-6 rounded-full bg-white shadow transform transition-all duration-400 ${isDark ? 'translate-x-6 rotate-45 scale-95' : 'translate-x-0 rotate-0 scale-100'}`}
                style={{ boxShadow: isDark ? '0 6px 18px rgba(37,99,235,0.24)' : '0 4px 10px rgba(245,158,11,0.16)' }}
            >
                {/* Sun rays / moon details as SVG */}
                <svg
                    className={`w-6 h-6 ${isDark ? 'opacity-0 scale-75 transition-all duration-300' : 'opacity-100 scale-100 transition-all duration-300'}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="12" cy="12" r="4" fill="#F59E0B" />
                    <g stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M12 1v2" />
                        <path d="M12 21v2" />
                        <path d="M4.2 4.2l1.4 1.4" />
                        <path d="M18.4 18.4l1.4 1.4" />
                        <path d="M1 12h2" />
                        <path d="M21 12h2" />
                        <path d="M4.2 19.8l1.4-1.4" />
                        <path d="M18.4 5.6l1.4-1.4" />
                    </g>
                </svg>

                <svg
                    className={`w-6 h-6 absolute inset-0 m-auto ${isDark ? 'opacity-100 scale-100 transition-all duration-300' : 'opacity-0 scale-75 transition-all duration-300'}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#1F2937" />
                </svg>
            </span>
        </button>
    );
};

export default ToggleDark;