import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserByControl } from '../data/database.js';

const ContextoUsuario = createContext();

export const ProveedorUsuario = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const savedUser = sessionStorage.getItem('tutorias_user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);

            // Refresh data from source to avoid stale sessions (DX improvement)
            const freshData = getUserByControl(parsedUser.n_control || parsedUser.id_tutor);
            if (freshData) {
                const updatedUser = {
                    ...parsedUser,
                    ...freshData
                };
                setUser(updatedUser);
                // Optional: persist the fresh data back to sessionStorage
                sessionStorage.setItem('tutorias_user', JSON.stringify(updatedUser));
            } else {
                setUser(parsedUser);
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem('tutorias_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('tutorias_user');
    };

    return (
        <ContextoUsuario.Provider value={{ user, login, logout, loading }}>
            {children}
        </ContextoUsuario.Provider>
    );
};

export const useUser = () => {
    const context = useContext(ContextoUsuario);
    if (!context) {
        throw new Error('useUser must be used within a ProveedorUsuario');
    }
    return context;
};
