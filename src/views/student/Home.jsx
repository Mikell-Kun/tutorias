import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bell, ChevronRight, Award, Clock, FileText, Download } from 'lucide-react';
import Card from '../../components/Card.jsx';
import { useUser } from '../../context/UserContext.jsx';

const StudentHome = () => {
    const { user } = useUser();

    return (
        <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Title Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-navy uppercase tracking-tight">Panel de Control del Estudiante</h1>
                    <p className="text-text-muted font-medium mt-1 text-lg">Gestión académica y seguimiento de tutorías</p>
                </div>
                <button className="flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-navy-glow transition-all shadow-xl shadow-navy/20 group">
                    <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                    Descargar Reporte
                </button>
            </div>

            {/* Stats Row - Top horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Promedio General" subtitle="Basado en el último semestre" icon={Award}>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-4xl font-black text-navy">88.8</span>
                        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">+1.2%</span>
                    </div>
                </Card>
                <Card title="Créditos Acumulados" subtitle="Progreso total" icon={FileText}>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-4xl font-black text-navy">63</span>
                        <span className="text-xs font-bold text-navy/40 uppercase tracking-widest">28.6% del total</span>
                    </div>
                </Card>
                <Card title="Mensajes de Tutor" subtitle="Bandeja de entrada" icon={Bell}>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-4xl font-black text-navy text-gold/80">3</span>
                        <span className="text-[10px] font-black text-white bg-gold/90 px-3 py-1 rounded-full uppercase tracking-tighter">Pendientes</span>
                    </div>
                </Card>
            </div>

            {/* Main Content Grid - Two Columns side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Próximos Eventos */}
                <div className="lg:col-span-8">
                    <Card
                        title="Próximos Eventos"
                        subtitle="Calendario institucional"
                        icon={Calendar}
                        className="h-full"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Lunes, 16 de Febrero 2026</span>
                            <button className="text-[10px] font-black text-navy uppercase tracking-widest hover:text-gold transition-colors">Ver Calendario</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Académico', title: 'Inscripción de materias (AGO-DIC)', date: 'Próximo Lunes', type: 'academic' },
                                { label: 'Evento', title: 'Conferencia: Tendencias en Web 2026', date: 'Mañana, 10:00 AM', type: 'event' }
                            ].map((event, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-navy/10 hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
                                    <div className="space-y-1">
                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${event.type === 'academic' ? 'text-navy' : 'text-gold'}`}>
                                            {event.label}
                                        </span>
                                        <p className="font-bold text-navy text-lg">{event.title}</p>
                                        <p className="text-xs text-text-muted font-medium flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-navy/20" />
                                            {event.date}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right: Información Escolar */}
                <div className="lg:col-span-4">
                    <Card title="Información Escolar" subtitle="Detalles académicos" icon={FileText}>
                        <div className="space-y-8 pt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">Matrícula</label>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-navy font-bold text-xl tracking-tight">
                                    {user?.n_control}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">Carrera</label>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-navy font-bold text-sm leading-tight">
                                    {user?.carrera || 'Ingeniería en Sistemas Computacionales'}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">Semestre</label>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-navy font-bold text-center">
                                        {user?.semestre || '5to Semestre'}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">Estatus</label>
                                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-green-600 font-bold text-center">
                                        {user?.estatus || 'Regular'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentHome;
