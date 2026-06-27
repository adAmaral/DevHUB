import { createContext, useContext, useState, useCallback } from 'react';
import { login as loginApi, logout as logoutApi } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('authUser');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const login = useCallback(async (email, senha) => {
        const data = await loginApi(email, senha);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        setUser(data.user);
        return data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutApi();
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setUser(null);
        }
    }, []);

    const updateUser = useCallback((updatedData) => {
        const updated = { ...user, ...updatedData };
        localStorage.setItem('authUser', JSON.stringify(updated));
        setUser(updated);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
