const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Erro ${res.status}`);
    }
    return res.json();
};

export const login = (email, senha) =>
    apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
    });

export const logout = () =>
    apiRequest('/api/auth/logout', { method: 'POST' });
