import { useState } from "react";
import api from "../api/api";

export default function useAuth() {
    const [user, setUser] = useState(() => {
        try {
        const savedUser = localStorage.getItem('user');
        if (!savedUser || savedUser === 'undefined'){
            localStorage.removeItem('user');
            return null;
        }
        return JSON.parse(savedUser);
        } catch (error) {
            localStorage.removeItem('user');
        return null;
        }
    });
    
    const [token, setToken] = useState(() => {
        const savedToken = localStorage.getItem('token');
        if (!savedToken || savedToken === 'undefined'){
            localStorage.removeItem('token');
            return null;
        }
        return savedToken;
    });

    // login con localStorage
    const login = async (correo, password) => {
        try {
            const response = await api.post('/usuarios/login/', { correo, password });
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setToken(token);

            return user;

        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        localStorage.removeItem('user');
        setUser(null);
    };

    return { user, token, login, logout };
}
