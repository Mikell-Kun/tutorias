import React from 'react';
import { FileText, FileBarChart, PieChart, Users, ArrowRight, Eye, Download, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { Estudiantes } from '../../data/database.js';
import {
    generateGroupSemesterReport,
    generateDetailedGroupReport,
    generateReferralReport
} from '../../utils/reportGenerator.js';
import { getReportHistory, deleteReportEntry } from '../../utils/reportHistory.js';

const TutorReportes = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [history, setHistory] = React.useState(getReportHistory());

    const handleDelete = (id) => {
        const updated = deleteReportEntry(id);
        setHistory(updated);
    };

    const handleDownload = (entry) => {
        if (!entry.data) return;
        if (entry.reportType === 'semester') generateGroupSemesterReport(entry.data);
        if (entry.reportType === 'detailed') generateDetailedGroupReport(entry.data);
        if (entry.reportType === 'referral') generateReferralReport(entry.data);
    };

    const handleEdit = (entry) => {
        if (!entry.data) return;
        let route = '/reporte-grupal';
        if (entry.reportType === 'detailed') route = '/reporte-detallado';
        if (entry.reportType === 'referral') route = '/reporte-canalizaciones';
        navigate(route, { state: { editData: entry.data } });
    };

    // Filter students assigned to this tutor that are at risk
    const atRiskStudents = (Estudiantes || []).filter(s =>
        s && s.tutor_id === user?.id_tutor && s.estatus === 'Riesgo'
    );

    const reportTypes = [
        {
            title: 'Reportes Generales',
            description: 'Genera el informe detallado de seguimiento académico del ciclo escolar actual.',
            icon: FileBarChart,
            color: 'bg-navy/5 text-navy',
            badge: 'Prioritario',
            subOptions: [
                { label: 'Semestral por Grupo', action: () => navigate('/reporte-grupal') },
                { label: 'Detallado por Grupo', action: () => navigate('/reporte-detallado') },
                { label: 'De Canalizaciones', action: () => navigate('/reporte-canalizaciones') },
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
                    <h1 className="text-3xl font-black uppercase tracking-tight text-navy">Reportes Generales</h1>
                    <p className="text-text-muted font-medium">Gestión y generación de informes de tutoría</p>
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
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${type.color} border border-current opacity-70`}>
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
                                                className="flex items-center justify-between px-4 py-2.5 bg-navy border border-navy/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-gold hover:text-navy hover:border-gold transition-all group/opt shadow-sm"
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

                {/* Help Section */}
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
                        {history.length > 0 ? (
                            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-navy/40 border-b border-gray-100">
                                            <th className="px-6 py-4">Fecha</th>
                                            <th className="px-6 py-4">Reporte</th>
                                            <th className="px-6 py-4">Tipo</th>
                                            <th className="px-6 py-4">Autor</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        <AnimatePresence mode="popLayout">
                                            {history.map((entry) => (
                                                <motion.tr
                                                    key={entry.id}
                                                    layout
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="hover:bg-gray-50/50 transition-colors group"
                                                >
                                                    <td className="px-6 py-4 text-[11px] font-bold text-navy/60">{entry.dateFormatted}</td>
                                                    <td className="px-6 py-4 text-xs font-black text-navy uppercase tracking-tight">{entry.title}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${entry.type === 'General' ? 'bg-navy/5 text-navy' : 'bg-gold/10 text-gold'}`}>
                                                            {entry.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-[11px] font-bold text-navy/40">{entry.author}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {entry.data ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleDownload(entry)}
                                                                        className="p-2 text-navy/40 hover:text-navy hover:bg-navy/5 rounded-lg transition-all"
                                                                        title="Ver/Descargar"
                                                                    >
                                                                        <Download size={14} />
                                                                    </button>
                                                                    {String(entry.authorId) === String(user?.id_tutor || user?.n_control) && (
                                                                        <button
                                                                            onClick={() => handleEdit(entry)}
                                                                            className="p-2 text-navy/40 hover:text-gold hover:bg-gold/10 rounded-lg transition-all"
                                                                            title="Editar Datos"
                                                                        >
                                                                            <Edit2 size={14} />
                                                                        </button>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-[9px] font-bold text-navy/20 italic px-2">Datos no disponibles (Historial antiguo)</span>
                                                            )}
                                                            {(String(entry.authorId) === String(user?.id_tutor || user?.n_control) || !entry.authorId) && (
                                                                <button
                                                                    onClick={() => handleDelete(entry.id)}
                                                                    className="p-2 text-navy/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                    title="Eliminar del Historial"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="mt-8 py-16 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                                <FileText size={48} className="mx-auto text-navy/10 mb-4" />
                                <p className="text-navy/30 font-bold uppercase tracking-widest text-xs">No hay reportes recientes para mostrar</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TutorReportes;
