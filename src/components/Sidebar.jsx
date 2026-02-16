import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Home,
    BookOpen,
    User,
    MessageSquare,
    LogOut,
    Users,
    Settings
} from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';

const Sidebar = () => {
    const { user, logout } = useUser();

    const studentLinks = [
        { name: 'Inicio', path: '/', icon: Home },
        { name: 'Retícula', path: '/reticula', icon: BookOpen },
        { name: 'Perfil', path: '/profile', icon: User },
        { name: 'Mensajes', path: '/messages', icon: MessageSquare },
    ];

    const teacherLinks = [
        { name: 'Panel Estudiantes', path: '/', icon: Users },
        { name: 'Mensajes', path: '/messages', icon: MessageSquare },
        { name: 'Configuración', path: '/settings', icon: Settings },
    ];

    const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

    return (
        <div className="w-64 glass h-[calc(100vh-2rem)] sticky top-4 left-0 flex flex-col p-4">
            <div className="mb-8 px-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-white font-bold">
                    TN
                </div>
                <span className="font-bold text-navy text-lg">Tutorías</span>
            </div>

            <nav className="flex-1 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive
                                ? 'bg-navy text-white shadow-lg shadow-navy/20'
                                : 'text-text-muted hover:bg-gray-100 hover:text-navy'}
            `}
                    >
                        <link.icon size={20} />
                        <span className="font-medium">{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            <motion.button
                whileHover={{ x: 4 }}
                onClick={logout}
                className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
                <LogOut size={20} />
                <span className="font-medium">Cerrar Sesión</span>
            </motion.button>
        </div>
    );
};

export default Sidebar;
