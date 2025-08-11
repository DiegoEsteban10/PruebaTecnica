import { useState } from "react";
import api from "../api/api";

export default function useAuth() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // login con localStorage
    const login = async (correo, password) => {
        try {
            const response = await api.post('/login/', { correo, password });
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return { user, login, logout };
}

export const useAuth = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    return { token, user };
};
