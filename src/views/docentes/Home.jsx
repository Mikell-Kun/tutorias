import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, MessageSquare, Calendar, Building2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card.jsx';
import { useUser } from '../../context/UserContext.jsx';

const TeacherHome = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const quickActions = [
        { label: 'Reportar Incidencia', icon: AlertTriangle, path: '/reportar-incidencia', color: 'bg-blue-500 text-white', shadow: 'shadow-blue-200' },
        { label: 'Mensajes', icon: MessageSquare, path: '/mensajes', color: 'bg-white text-navy', shadow: 'shadow-sm' },
        { label: 'Estudiantes', icon: Users, path: '/students', color: 'bg-white text-navy', shadow: 'shadow-sm' },
        { label: 'Eventos', icon: Calendar, path: '/events', color: 'bg-white text-navy', shadow: 'shadow-sm' },
    ];

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/20 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-navy tracking-tight flex items-center gap-3">
                        Bienvenido, {user?.nombre_completo} 👋
                    </h1>
                    <p className="text-text-muted mt-1 font-medium italic">Acceso Docente • {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-xl shadow-navy/5 overflow-hidden group">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center text-white shadow-lg shadow-navy/20 group-hover:scale-110 transition-transform duration-500">
                            <Building2 size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Departamento</p>
                            <h3 className="text-xl font-bold text-navy leading-tight">{user?.departamento || 'No asignado'}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="border-none shadow-xl shadow-navy/5 overflow-hidden group">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform duration-500">
                            <MessageSquare size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Mensajes Nuevos</p>
                            <h3 className="text-3xl font-black text-navy">0</h3>
                        </div>
                    </div>
                </Card>

                <Card
                    className="border-none shadow-xl shadow-navy/5 overflow-hidden group cursor-pointer"
                    onClick={() => navigate('/reportar-incidencia')}
                >
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-100 group-hover:scale-110 transition-transform duration-500">
                            <AlertTriangle size={32} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Reportar</p>
                            <h3 className="text-xl font-bold text-navy">Incidencia</h3>
                        </div>
                        <ExternalLink size={20} className="text-navy/20 group-hover:text-navy transition-colors" />
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card title="Acciones Rápidas">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {quickActions.map((action, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(action.path)}
                            className={`flex items-center justify-center gap-3 p-6 rounded-2xl font-bold text-sm transition-all border border-gray-100/50 ${action.color} ${action.shadow}`}
                        >
                            <action.icon size={20} />
                            {action.label}
                        </motion.button>
                    ))}
                </div>
            </Card>

            {/* Recent Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Tutorados Bajo Seguimiento" subtitle="Estudiantes que requieren atención">
                    <div className="mt-4 flex flex-col items-center justify-center py-12 text-center text-text-muted space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                            <Users size={32} className="opacity-20" />
                        </div>
                        <div>
                            <p className="font-bold text-navy/40">No hay tutorados asignados</p>
                            <p className="text-xs uppercase tracking-widest font-black opacity-20 mt-1">Sección en desarrollo</p>
                        </div>
                    </div>
                </Card>

                <Card title="Próximos Eventos" subtitle="Calendario de actividades">
                    <div className="mt-4 space-y-4">
                        <div className="border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:border-navy/20 transition-colors cursor-pointer">
                            <div className="w-12 h-12 bg-gold/10 text-gold rounded-xl flex flex-col items-center justify-center font-black">
                                <span className="text-[10px] leading-none uppercase">Feb</span>
                                <span className="text-lg leading-none">24</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-navy">Reunión de Tutores</h4>
                                <p className="text-xs text-text-muted">10:00 AM • Sala de juntas</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TeacherHome;

