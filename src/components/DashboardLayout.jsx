import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { Bell } from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';
import { getIncidencias } from '../data/database.js';

const DashboardLayout = () => {
    const { user } = useUser();
    const [refresh, setRefresh] = React.useState(0);

    React.useEffect(() => {
        const handleUpdate = () => setRefresh(prev => prev + 1);
        window.addEventListener('databaseUpdated', handleUpdate);
        return () => window.removeEventListener('databaseUpdated', handleUpdate);
    }, []);

    // Get unread incidents if the user is a tutor
    // Defensive check for getIncidencias return value
    const incidencias = getIncidencias() || [];
    const unreadCount = user?.role === 'tutor'
        ? incidencias.filter(i => i && !i.leida).length
        : 0;

    return (
        <div className="flex gap-6 p-4 min-h-screen gradient-mesh">
            <Sidebar />

            <main className="flex-1 flex flex-col gap-6">
                {/* Top Navbar */}
                <header className="glass px-8 py-4 flex items-center justify-end">

                    <div className="flex items-center gap-6">
                        <Link
                            to={user?.role === 'tutor' ? '/incidencias' : '#'}
                            className="relative cursor-pointer text-text-muted hover:text-navy transition-colors bg-white p-2 rounded-lg border border-gray-100"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="text-right">
                                <p className="text-sm font-black text-navy uppercase tracking-tight">{user?.nombre_completo || user?.name || 'Usuario'}</p>
                                <p className="text-[10px] font-black text-gold uppercase tracking-[0.1em]">
                                    {user?.role === 'student' ? 'Estudiante' : user?.role === 'teacher' ? 'Docente' : user?.role === 'tutor' ? 'Tutor' : 'Usuario'}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-navy text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-navy/20">
                                {(user?.nombre_completo || user?.name || 'U').charAt(0)}
                            </div>
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
