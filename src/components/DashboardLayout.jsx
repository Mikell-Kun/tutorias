import React from 'react';
import { useUser } from '../context/UserContext';
import {
    Home,
    Layout,
    MessageSquare,
    User,
    LogOut,
    ChevronRight,
    Bell,
    Menu,
    X
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            cursor: 'pointer',
            borderRadius: '12px',
            backgroundColor: active ? 'rgba(179, 142, 93, 0.15)' : 'transparent',
            color: active ? 'var(--secondary)' : 'var(--text-dim)',
            transition: 'all 0.3s ease',
            marginBottom: '8px',
            border: active ? '1px solid var(--secondary)' : '1px solid transparent',
        }}
        onMouseEnter={(e) => {
            if (!active) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = 'white';
            }
        }}
        onMouseLeave={(e) => {
            if (!active) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-dim)';
            }
        }}
    >
        <Icon size={20} />
        <span style={{
            fontWeight: active ? '600' : '400',
            fontSize: '0.95rem'
        }}>{label}</span>
        {active && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
    </div>
);

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
    const { user, logout } = useUser();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const getMenuItems = () => {
        switch (user?.role) {
            case 'student':
                return [
                    { id: 'home', label: 'Inicio', icon: Home },
                    { id: 'reticula', label: 'Retícula Académica', icon: Layout },
                    { id: 'messages', label: 'Mensajería', icon: MessageSquare },
                    { id: 'profile', label: 'Mi Perfil', icon: User },
                ];
            case 'teacher':
                return [
                    { id: 'home', label: 'Panel Docente', icon: Home },
                    { id: 'students', label: 'Mis Alumnos', icon: User },
                    { id: 'sessions', label: 'Sesiones', icon: MessageSquare },
                    { id: 'reports', label: 'Reportes', icon: Layout },
                ];
            case 'tutor':
                return [
                    { id: 'home', label: 'Panel Tutor', icon: Home },
                    { id: 'groups', label: 'Mis Grupos', icon: User },
                    { id: 'stats', label: 'Estadísticas', icon: Layout },
                    { id: 'messages', label: 'Mensajería', icon: MessageSquare },
                ];
            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
            {/* SIDEBAR */}
            <aside className="glass-card" style={{
                width: isSidebarOpen ? '280px' : '0px',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: 'calc(100vh - 40px)',
                margin: '20px',
                zIndex: 100,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                borderRadius: '24px',
                border: '1px solid var(--glass-border)',
                visibility: isSidebarOpen ? 'visible' : 'hidden',
                opacity: isSidebarOpen ? 1 : 0,
            }}>
                <div style={{ padding: '32px 24px', marginBottom: '20px' }}>
                    <h2 className="gradient-text" style={{ letterSpacing: '1px', fontSize: '1.8rem', fontWeight: 'bold' }}>
                        TutorApp
                    </h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '4px', opacity: 0.8 }}>TECNM DASHBOARD</p>
                </div>

                <nav style={{ flex: 1, padding: '0 16px' }}>
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            active={activeTab === item.id}
                            onClick={() => setActiveTab(item.id)}
                        />
                    ))}
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)' }}>
                    <div
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 20px',
                            cursor: 'pointer',
                            color: 'var(--error)',
                            borderRadius: '12px',
                            transition: 'all 0.3s',
                            opacity: 0.8
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.opacity = 1;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.opacity = 0.8;
                        }}
                    >
                        <LogOut size={20} />
                        <span style={{ fontWeight: '600' }}>Cerrar Sesión</span>
                    </div>
                </div>
            </aside>

            {/* MAIN AREA */}
            <main style={{
                marginLeft: isSidebarOpen ? '320px' : '20px',
                marginRight: '20px',
                marginTop: '20px',
                marginBottom: '20px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                transition: 'margin 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
                {/* HEADER */}
                <header className="glass-card" style={{
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 32px',
                    marginBottom: '24px',
                    borderRadius: '24px',
                }}>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <Bell size={22} color="var(--text-dim)" />
                            <span style={{
                                position: 'absolute',
                                top: '-2px',
                                right: '-2px',
                                background: 'var(--error)',
                                color: 'white',
                                fontSize: '0.65rem',
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                borderRadius: '50%',
                                border: '2px solid var(--bg-dark)'
                            }}>
                                <span style={{ margin: 'auto' }}>3</span>
                            </span>
                        </div>

                        <div style={{ height: '30px', width: '1px', backgroundColor: 'var(--glass-border)' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: '600', fontSize: '1rem', color: 'white' }}>{user?.name}</p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                                    {user?.role === 'student' ? 'Estudiante' : user?.role}
                                </span>
                            </div>
                            <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, var(--secondary) 0%, #85643a 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 12px rgba(179, 142, 93, 0.3)'
                            }}>
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingRight: '5px' // Space for scrollbar
                }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
