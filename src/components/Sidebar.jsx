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
        { name: 'Retícula Académica', path: '/reticula', icon: BookOpen },
        { name: 'Mensajería', path: '/messages', icon: MessageSquare },
        { name: 'Mi Perfil', path: '/profile', icon: User },
    ];

    const teacherLinks = [
        { name: 'Panel Estudiantes', path: '/', icon: Users },
        { name: 'Mensajería', path: '/messages', icon: MessageSquare },
        { name: 'Configuración', path: '/settings', icon: Settings },
    ];

    const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

    return (
        <div className="w-64 bg-navy h-[calc(100vh-2rem)] sticky top-4 left-0 flex flex-col p-4 rounded-3xl shadow-2xl">
            <div className="mb-8 px-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-navy font-black shadow-lg">
                    TN
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-white text-lg leading-tight tracking-tight uppercase">Tutorías</span>
                    <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">TecNM</span>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
              ${isActive
                                ? 'bg-gold text-navy shadow-lg shadow-gold/20 font-bold'
                                : 'text-blue-100/60 hover:bg-white/10 hover:text-white'}
            `}
                    >
                        <link.icon size={20} />
                        <span className="font-medium tracking-tight text-[14px]">{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            <motion.button
                whileHover={{ x: 4 }}
                onClick={logout}
                className="mt-auto flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
            >
                <LogOut size={20} />
                <span className="font-bold uppercase tracking-widest text-[11px]">Cerrar Sesión</span>
            </motion.button>
        </div>
    );
};

export default Sidebar;
