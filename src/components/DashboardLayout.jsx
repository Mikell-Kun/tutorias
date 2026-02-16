import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { Search, Bell, User } from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';

const DashboardLayout = () => {
    const { user } = useUser();

    return (
        <div className="flex gap-6 p-4 min-h-screen gradient-mesh">
            <Sidebar />

            <main className="flex-1 flex flex-col gap-6">
                {/* Top Navbar */}
                <header className="glass px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl flex-1 max-w-md border border-gray-100 focus-within:ring-2 focus-within:ring-navy transition-all">
                        <Search className="text-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar recursos, alumnos..."
                            className="bg-transparent border-none focus:outline-none w-full text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative cursor-pointer text-text-muted hover:text-navy transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </div>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="text-right">
                                <p className="text-sm font-bold text-navy">{user?.name}</p>
                                <p className="text-xs text-text-muted capitalize">{user?.role}</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-navy font-bold">
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
