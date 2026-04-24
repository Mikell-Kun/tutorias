import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bell, ChevronRight, Award, Clock, FileText, LayoutDashboard } from 'lucide-react';
import Tarjeta from '../../components/Tarjeta.jsx';
import { useUser } from '../../context/ContextoUsuario.jsx';

const StudentHome = () => {
    const { user } = useUser();

    return (
        <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Title Section */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="p-4 bg-navy/5 rounded-lg text-navy">
                    <LayoutDashboard size={36} />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-navy">Panel del Estudiante</h1>
                    <p className="text-text-muted font-medium mt-1">Gestión académica y seguimiento de tutorías</p>
                </div>
            </div>

            {/* Stats Row - Top horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Tarjeta title="Promedio General" subtitle="Basado en el último semestre" icon={Award}>
                    <div className="flex items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 opacity-70 mt-2">
                        <span className="text-xs font-black text-navy/40 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Clock size={14} /> Módulo en desarrollo
                        </span>
                    </div>
                </Tarjeta>
                <Tarjeta title="Créditos Acumulados" subtitle="Progreso total" icon={FileText}>
                    <div className="flex items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 opacity-70 mt-2">
                        <span className="text-xs font-black text-navy/40 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Clock size={14} /> Módulo en desarrollo
                        </span>
                    </div>
                </Tarjeta>
                <Tarjeta title="Mensajes de Tutor" subtitle="Bandeja de entrada" icon={Bell}>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-sm font-medium text-text-muted">Consulta tus conversaciones activas</span>
                    </div>
                </Tarjeta>
            </div>

            {/* Main Content Grid - Two Columns side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Próximos Eventos */}
                <div className="lg:col-span-8">
                    <Tarjeta
                        title="Próximos Eventos"
                        subtitle="Calendario institucional"
                        icon={Calendar}
                        className="h-full"
                    >
                        <div className="flex items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 opacity-70 mt-4">
                            <span className="text-xs font-black text-navy/40 uppercase tracking-[0.2em] flex items-center gap-3">
                                <Clock size={18} /> Módulo en desarrollo
                            </span>
                        </div>
                    </Tarjeta>
                </div>

                {/* Right: Información Escolar */}
                <div className="lg:col-span-4">
                    <Tarjeta title="Información Escolar" subtitle="Detalles académicos" icon={FileText}>
                        <div className="space-y-8 pt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">Matrícula</label>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-navy font-bold text-xl tracking-tight">
                                    {user?.n_control}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">Carrera</label>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-navy font-bold text-sm leading-tight">
                                    {user?.carrera || 'Ingeniería en Sistemas Computacionales'}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">Semestre</label>
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-navy font-bold text-center">
                                        {user?.semestre || '5to Semestre'}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">Estatus</label>
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-green-600 font-bold text-center">
                                        {user?.estatus || 'Regular'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tarjeta>
                </div>
            </div>
        </div>
    );
};

export default StudentHome;
