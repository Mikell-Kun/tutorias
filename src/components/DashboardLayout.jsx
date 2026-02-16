import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { Bell, User } from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';

const DashboardLayout = () => {
    const { user } = useUser();

    return (
        <div className="flex gap-6 p-4 min-h-screen gradient-mesh">
            <Sidebar />

            <main className="flex-1 flex flex-col gap-6">
                {/* Top Navbar */}
                <header className="glass px-8 py-4 flex items-center justify-end">

                    <div className="flex items-center gap-6">
                        <div className="relative cursor-pointer text-text-muted hover:text-navy transition-colors bg-white p-2 rounded-lg border border-gray-100">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </div>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="text-right">
                                <p className="text-sm font-black text-navy uppercase tracking-tight">{user?.name}</p>
                                <p className="text-[10px] font-black text-gold uppercase tracking-[0.1em]">
                                    {user?.role === 'student' ? 'Estudiante' : user?.role === 'teacher' ? 'Docente' : 'Tutor'}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-navy text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-navy/20">
                                {user?.name?.charAt(0)}
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
