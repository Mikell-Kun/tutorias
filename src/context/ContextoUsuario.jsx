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

            // Fetch asincrono
            const fetchFreshData = async () => {
                const freshData = await getUserByControl(parsedUser.n_control || parsedUser.id_tutor);
                if (freshData) {
                    const updatedUser = { ...parsedUser, ...freshData };
                    setUser(updatedUser);
                    sessionStorage.setItem('tutorias_user', JSON.stringify(updatedUser));
                } else {
                    setUser(parsedUser);
                }
                setLoading(false);
            };
            fetchFreshData();
        } else {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem('tutorias_user', JSON.stringify(userData));
    };

    const updateSession = (newUserData) => {
        setUser(newUserData);
        sessionStorage.setItem('tutorias_user', JSON.stringify(newUserData));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('tutorias_user');
    };

    return (
        <ContextoUsuario.Provider value={{ user, login, logout, loading, updateSession }}>
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
