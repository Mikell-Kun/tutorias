import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (role, credentials = {}) => {
        // Mock validation and user data based on role
        if (role === 'student') {
            const { controlNumber, password } = credentials;
            if (!controlNumber || !password || password.length < 8) {
                throw new Error('Número de control o contraseña (mín. 8 caracteres) inválidos');
            }

            setUser({
                name: 'Juan Pérez García',
                role: 'student',
                controlNumber: controlNumber,
                career: 'Ingeniería en Sistemas Computacionales',
                semester: 5,
                email: `${controlNumber}@inst.edu.mx`,
                phone: '123-456-7890',
                progress: 28.6
            });
        } else if (role === 'teacher') {
            setUser({ name: 'Dr. Roberto Sánchez', role: 'teacher', email: 'roberto.s@inst.edu.mx' });
        } else if (role === 'tutor') {
            setUser({ name: 'Mtra. Elena Gómez', role: 'tutor', email: 'elena.g@inst.edu.mx' });
        }
    };

    const logout = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
