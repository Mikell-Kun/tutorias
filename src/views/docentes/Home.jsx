import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, MessageSquare, Calendar, Building2, ExternalLink, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Tarjeta from '../../components/Tarjeta.jsx';
import { useUser } from '../../context/ContextoUsuario.jsx';

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
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="p-4 bg-navy/5 rounded-lg text-navy">
                    <LayoutDashboard size={36} />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-navy">
                        Bienvenido, {user?.nombre_completo}
                    </h1>
                    <p className="text-text-muted font-medium mt-1">Seguimiento de tutorías</p>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Tarjeta className="border-none shadow-xl shadow-navy/5 overflow-hidden group" icon={Building2}>
                    <div>
                        <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Departamento</p>
                        <h3 className="text-xl font-bold text-navy leading-tight">{user?.departamento || 'No asignado'}</h3>
                    </div>
                </Tarjeta>

                <Tarjeta className="border-none shadow-xl shadow-navy/5 overflow-hidden group" icon={MessageSquare}>
                    <div>
                        <p className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">Mensajes Nuevos</p>
                        <h3 className="text-3xl font-black text-navy">0</h3>
                    </div>
                </Tarjeta>

                <Tarjeta
                    className="border-none shadow-xl shadow-navy/5 overflow-hidden group cursor-pointer"
                    icon={AlertTriangle}
                    onClick={() => navigate('/reportar-incidencia')}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">Reportar</p>
                            <h3 className="text-xl font-bold text-navy">Incidencia</h3>
                        </div>
                        <ExternalLink size={20} className="text-navy/20 group-hover:text-navy transition-colors ml-4" />
                    </div>
                </Tarjeta>
            </div>

            {/* Recent Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Tarjeta title="Tutorados Bajo Seguimiento" subtitle="Estudiantes que requieren atención">
                    <div className="mt-4 flex flex-col items-center justify-center py-12 text-center text-text-muted space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                            <Users size={32} className="opacity-20" />
                        </div>
                        <div>
                            <p className="font-bold text-navy/40">No hay tutorados asignados</p>
                            <p className="text-[10px] font-black text-navy/20 uppercase tracking-[0.2em] mt-1">Sección en desarrollo</p>
                        </div>
                    </div>
                </Tarjeta>

                <Tarjeta title="Próximos Eventos" subtitle="Calendario de actividades">
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
                </Tarjeta>
            </div>
        </div>
    );
};

export default TeacherHome;

