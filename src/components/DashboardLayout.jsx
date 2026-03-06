import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { Bell, ChevronDown, User as UserIcon, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';
import { getIncidencias, getMensajes } from '../data/database.js';

const DashboardLayout = () => {
    const { user, logout } = useUser();
    const [refresh, setRefresh] = React.useState(0);
    const [showProfileMenu, setShowProfileMenu] = React.useState(false);
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        const handleUpdate = () => setRefresh(prev => prev + 1);
        window.addEventListener('databaseUpdated', handleUpdate);

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('databaseUpdated', handleUpdate);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const userId = user?.n_control || user?.id_tutor;
    const incidencias = getIncidencias() || [];
    const mensajes = getMensajes(userId) || [];

    // Tutors see unread incidents, Students see unread messages from tutors
    let unreadCount = 0;
    let notificationLink = '#';

    if (user?.role === 'tutor') {
        unreadCount = incidencias.filter(i => i && !i.leida).length;
        notificationLink = '/incidencias';
    } else if (user?.role === 'student') {
        unreadCount = mensajes.filter(m => m && !m.leido && parseInt(m.destinatario_id, 10) === userId).length;
        notificationLink = '/mensajes';
    }

    return (
        <div className="flex gap-6 p-4 min-h-screen bg-slate-50">
            <Sidebar />

            <main className="flex-1 flex flex-col gap-6">
                {/* Top Navbar */}
                <header className="glass px-8 py-3 flex items-center justify-end sticky top-4 z-50">

                    <div className="flex items-center gap-6">
                        <Link
                            to={notificationLink}
                            className={`relative cursor-pointer text-text-muted hover:text-navy transition-colors bg-white p-2 rounded-md border border-slate-200 ${notificationLink === '#' ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>

                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-3 pl-6 border-l border-slate-200 hover:opacity-80 transition-opacity"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-black text-navy uppercase tracking-tight">{user?.nombre_completo || user?.name || 'Usuario'}</p>
                                    <p className="text-[10px] font-black text-gold uppercase tracking-[0.1em]">
                                        {user?.role === 'student' ? 'Estudiante' : user?.role === 'teacher' ? 'Docente' : user?.role === 'tutor' ? 'Tutor' : 'Usuario'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-navy text-white rounded-md flex items-center justify-center font-black shadow-lg shadow-navy/10">
                                        {(user?.nombre_completo || user?.name || 'U').charAt(0)}
                                    </div>
                                    <ChevronDown size={16} className={`text-text-muted transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <Link
                                        to="/perfil"
                                        onClick={() => setShowProfileMenu(false)}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-main hover:bg-slate-50 transition-colors"
                                    >
                                        <UserIcon size={16} className="text-text-muted" />
                                        <span>Mi Perfil</span>
                                    </Link>
                                    <hr className="my-1 border-slate-100" />
                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            logout();
                                        }}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                    >
                                        <LogOut size={16} />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 glass overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
