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
    Settings,
    AlertTriangle,
    Calendar,
    FileBarChart
} from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';

const Sidebar = () => {
    const { user, logout } = useUser();

    const studentLinks = [
        { name: 'Inicio', path: '/', icon: Home },
        { name: 'Retícula Académica', path: '/reticula', icon: BookOpen },
        { name: 'Mensajería', path: '/mensajes', icon: MessageSquare },
        { name: 'Mi Perfil', path: '/perfil', icon: User },
    ];

    const teacherLinks = [
        { name: 'Inicio', path: '/', icon: Home },
        { name: 'Estudiantes', path: '/students', icon: Users },
        { name: 'Reportar Incidencia', path: '/reportar-incidencia', icon: AlertTriangle },
        { name: 'Mensajes', path: '/mensajes', icon: MessageSquare },
        { name: 'Eventos', path: '/events', icon: Calendar },
        { name: 'Mi Perfil', path: '/perfil', icon: User },
    ];

    const tutorLinks = [
        { name: 'Inicio', path: '/', icon: Home },
        { name: 'Mis Estudiantes', path: '/students', icon: Users },
        { name: 'Reportes', path: '/reportes', icon: FileBarChart },
        { name: 'Mensajería', path: '/mensajes', icon: MessageSquare },
        { name: 'Incidencias', path: '/incidencias', icon: AlertTriangle },
        { name: 'Eventos', path: '/events', icon: Calendar },
        { name: 'Mi Perfil', path: '/perfil', icon: User },
    ];

    const links = user?.role === 'teacher' ? teacherLinks :
        user?.role === 'tutor' ? tutorLinks : studentLinks;

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
