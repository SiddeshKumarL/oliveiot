const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function api(path, options = {}) {
    const token = localStorage.getItem('token');
    const res = await fetch(API + path, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        }
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Request failed');
    }

    return res.json();
}