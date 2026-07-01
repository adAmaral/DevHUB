const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
        // Token expirado — limpa o estado local e redireciona para login
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        window.location.href = '/login';
        return;
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Erro ${res.status}`);
    }
    return res.json();
};

export const getProfile = () => apiRequest('/api/users/profile');

export const updateProfile = (data) =>
    apiRequest('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    });

export const updatePassword = (senhaAtual, novaSenha) =>
    apiRequest('/api/users/password', {
        method: 'PUT',
        body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha }),
    });
