import React from 'react';
import { FileText, FileBarChart, PieChart, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../../components/Card.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { Estudiantes } from '../../data/database.js';
import { generateSemesterReport } from '../../utils/reportGenerator.js';

const TutorReportes = () => {
    const { user } = useUser();

    // Filter students assigned to this tutor that are at risk
    const atRiskStudents = (Estudiantes || []).filter(s =>
        s && s.tutor_id === user?.id_tutor && s.estatus === 'Riesgo'
    );

    const handleSemesterReport = () => {
        if (!user) return;
        generateSemesterReport(user, atRiskStudents);
    };

    const reportTypes = [
        {
            title: 'Reporte Semestral',
            description: 'Genera el informe detallado de seguimiento académico del ciclo escolar actual.',
            icon: FileBarChart,
            color: 'bg-navy/5 text-navy',
            badge: 'Prioritario',
            subOptions: [
                { label: 'Semestral por Grupo', action: handleSemesterReport },
                { label: 'Detallado por Grupo', action: () => { } },
                { label: 'De Canalizaciones', action: () => { } },
            ]
        },
        {
            title: 'Reportes Específicos',
            description: 'Informes personalizados por alumno, grupo o tipo de incidencia detectada.',
            icon: FileText,
            color: 'bg-gold/10 text-gold',
            badge: 'Nuevo',
            subOptions: [
                { label: 'Semestral por Alumno', action: () => { } },
                { label: 'Detallado por Alumno', action: () => { } },
                { label: 'Semestral por Incidencia', action: () => { } },
                { label: 'Detallado por Incidencia', action: () => { } },
            ]
        },
    ];

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-full">
            {/* Header Section */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                <div className="p-4 bg-navy/5 rounded-2xl text-navy">
                    <FileBarChart size={36} />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-navy">Centro de Reportes</h1>
                    <p className="text-text-muted font-medium italic">Gestión y generación de informes de tutoría</p>
                </div>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportTypes.map((type, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="group"
                    >
                        <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl ${type.color}`}>
                                        <type.icon size={28} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${type.color} border border-current opacity-70`}>
                                        {type.badge}
                                    </span>
                                </div>

                                <h3 className="text-xl font-black text-navy uppercase tracking-tight mb-2 group-hover:text-gold transition-colors">
                                    {type.title}
                                </h3>
                                <p className="text-sm text-text-muted font-medium mb-8 flex-1">
                                    {type.description}
                                </p>

                                {type.subOptions ? (
                                    <div className="grid grid-cols-1 gap-2 mt-4">
                                        {type.subOptions.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={opt.action}
                                                className="flex items-center justify-between px-4 py-2.5 bg-navy border border-navy/10 rounded-xl text-[9px] font-black uppercase tracking-wider text-white hover:bg-gold hover:text-navy hover:border-gold transition-all group/opt shadow-sm"
                                            >
                                                {opt.label}
                                                <ArrowRight size={12} className="opacity-0 group-hover/opt:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <button
                                        onClick={type.action}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 group-hover:text-gold transition-colors mt-auto"
                                    >
                                        Comenzar <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>

                            {/* Decorative background element */}
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <type.icon size={120} />
                            </div>
                        </Card>
                    </motion.div>
                ))}

                {/* Help Section - Moved here! */}
                <div className="p-8 bg-gold rounded-[2rem] text-navy h-full flex flex-col justify-center shadow-sm">
                    <h4 className="font-black uppercase tracking-tighter text-2xl mb-2">¿Necesitas ayuda?</h4>
                    <p className="text-navy/70 text-sm font-bold mb-6">Consulta la guía de generación de reportes institucionales.</p>
                    <button className="w-full py-3 bg-navy text-white font-black rounded-xl uppercase tracking-widest text-[10px] hover:bg-navy/90 transition-colors shadow-lg shadow-navy/20">
                        Ver Documentación
                    </button>
                </div>
            </div>

            {/* Quick Actions / Recent Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                <div className="lg:col-span-2">
                    <Card title="Reportes Generados Recientemente" subtitle="Acceso rápido a los últimos informes descargados">
                        <div className="mt-8 py-16 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                            <FileText size={48} className="mx-auto text-navy/10 mb-4" />
                            <p className="text-navy/30 font-bold uppercase tracking-widest text-xs">No hay reportes recientes para mostrar</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TutorReportes;
