import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Apply persisted theme (or system preference) before React mounts to avoid flash
(() => {
	try {
		const stored = localStorage.getItem('theme');
		if (stored === 'dark') document.documentElement.classList.add('dark');
		else if (stored === 'light') document.documentElement.classList.remove('dark');
		else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');
	} catch (e) {
		// ignore
	}
})();

// Listen for theme changes from other tabs via BroadcastChannel
if ('BroadcastChannel' in window) {
	try {
		const themeChannel = new BroadcastChannel('theme-change');
		themeChannel.onmessage = (event) => {
			if (event.data.theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else if (event.data.theme === 'light') {
				document.documentElement.classList.remove('dark');
			}
		};
	} catch (e) {
		// BroadcastChannel not supported
	}
}

// Listen for auth state changes from other tabs
if ('BroadcastChannel' in window) {
	try {
		const authChannel = new BroadcastChannel('auth-change');
		authChannel.onmessage = (event) => {
			if (event.data.logout === true) {
				// Redirect to home on logout from another tab
				window.location.href = '/';
			}
		};
	} catch (e) {
		// BroadcastChannel not supported
	}
}

createRoot(document.getElementById('root')!).render(
	<App/>
)
