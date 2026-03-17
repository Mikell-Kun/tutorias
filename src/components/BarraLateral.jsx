import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Home,
    BookOpen,
    User,
    MessageSquare,
    Users,
    AlertTriangle,
    Calendar,
    FileBarChart,
    ChevronLeft,
    Menu
} from 'lucide-react';
import { useUser } from '../context/ContextoUsuario.jsx';

const BarraLateral = ({ isCollapsed, onToggle }) => {
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
        <div className={`
            ${isCollapsed ? 'w-20' : 'w-64'} 
            bg-navy h-screen fixed top-0 left-0 flex flex-col transition-all duration-300 z-[60] shadow-2xl
        `}>
            {/* Collapse Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-20 bg-gold text-navy p-1 rounded-full shadow-lg hover:scale-110 transition-transform hidden lg:block"
            >
                {isCollapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
            </button>

            <div className={`mb-8 px-6 pt-8 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center text-navy font-black shadow-lg shrink-0">
                    TN
                </div>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <span className="font-black text-white text-lg leading-tight tracking-tight uppercase">Tutorías</span>
                        <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">TecNM</span>
                    </motion.div>
                )}
            </div>

            <nav className="flex-1 space-y-2 px-4">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-3 rounded-sm transition-all duration-300
                            ${isCollapsed ? 'justify-center' : ''}
                            ${isActive
                                ? 'bg-gold text-navy shadow-lg shadow-gold/20 font-bold'
                                : 'text-blue-100/60 hover:bg-white/10 hover:text-white'}
                        `}
                        title={isCollapsed ? link.name : ''}
                    >
                        <link.icon size={20} className="shrink-0" />
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-medium tracking-tight text-[14px] truncate"
                            >
                                {link.name}
                            </motion.span>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default BarraLateral;
