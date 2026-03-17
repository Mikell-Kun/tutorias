import React from 'react';
import { FileText, FileBarChart, PieChart, Users, ArrowRight, Eye, Download, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Tarjeta from '../../components/Tarjeta.jsx';
import { useUser } from '../../context/ContextoUsuario.jsx';
import { Estudiantes } from '../../data/database.js';
import {
    generateGroupSemesterReport,
    generateDetailedGroupReport,
    generateReferralReport,
    generateStudentSemesterReport,
    generateDetailedStudentReport,
    generateIncidenceSemesterReport,
    generateDetailedIncidenceReport
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
        if (entry.reportType === 'student_semester') generateStudentSemesterReport(entry.data);
        if (entry.reportType === 'student_detailed') generateDetailedStudentReport(entry.data);
        if (entry.reportType === 'incidence_semester') generateIncidenceSemesterReport(entry.data);
        if (entry.reportType === 'incidence_detailed') generateDetailedIncidenceReport(entry.data);
    };

    const handleEdit = (entry) => {
        if (!entry.data) return;
        let route = '/reporte-grupal';
        if (entry.reportType === 'detailed') route = '/reporte-detallado';
        if (entry.reportType === 'referral') route = '/reporte-canalizaciones';
        if (entry.reportType === 'student_semester') route = '/reporte-alumno';
        if (entry.reportType === 'student_detailed') route = '/reporte-detallado-alumno';
        if (entry.reportType === 'incidence_semester') route = '/reporte-incidencia';
        if (entry.reportType === 'incidence_detailed') route = '/reporte-detallado-incidencia';
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
                { label: 'Semestral por Alumno', action: () => navigate('/reporte-alumno') },
                { label: 'Detallado por Alumno', action: () => navigate('/reporte-detallado-alumno') },
                { label: 'Semestral por Incidencia', action: () => navigate('/reporte-incidencia') },
                { label: 'Detallado por Incidencia', action: () => navigate('/reporte-detallado-incidencia') },
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {reportTypes.map((type, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="group"
                    >
                        <Tarjeta className="h-full border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden bg-white/50 backdrop-blur-sm">
                            <div className="relative z-10 flex flex-col h-full p-2">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl ${type.color} shadow-inner`}>
                                        <type.icon size={28} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${type.color} border border-current opacity-70`}>
                                        {type.badge}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-navy uppercase tracking-tight mb-2 group-hover:text-gold transition-colors" style={{ fontFamily: '"Microsoft YaHei UI", sans-serif' }}>
                                    {type.title}
                                </h3>
                                <p className="text-sm text-text-muted font-medium mb-8 flex-1">
                                    {type.description}
                                </p>

                                {type.subOptions && (
                                    <div className="flex flex-col gap-4 mt-6">
                                        {type.subOptions.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={opt.action}
                                                className="group/opt flex items-center justify-between text-left transition-all duration-300 w-full"
                                                style={{ 
                                                    fontFamily: '"Microsoft YaHei UI", sans-serif',
                                                }}
                                            >
                                                <span className="text-sm font-bold uppercase tracking-widest text-[#B0C4DE] border-b border-[#B0C4DE]/30 group-hover/opt:text-blue-600 group-hover/opt:border-blue-600 transition-all duration-300 pb-1">
                                                    {opt.label}
                                                </span>
                                                <ArrowRight size={14} className="text-[#B0C4DE] group-hover/opt:text-blue-600 transition-all transform translate-x-[-10px] group-hover/opt:translate-x-0 opacity-0 group-hover/opt:opacity-100" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Decorative background element */}
                            <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all transform group-hover:scale-110 group-hover:-rotate-12 duration-700">
                                <type.icon size={180} />
                            </div>
                        </Tarjeta>
                    </motion.div>
                ))}
            </div>

            {/* usage Guide Section - Lighter design */}
            <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2rem] text-navy">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="p-6 bg-white rounded-2xl shadow-sm">
                        <PieChart size={48} className="text-gold" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <h4 className="font-black uppercase tracking-tight text-xl" style={{ fontFamily: '"Microsoft YaHei UI", sans-serif' }}>Guía de Uso de Formatos</h4>
                        <p className="text-text-muted text-sm font-medium max-w-2xl">
                            Utiliza los <span className="text-navy font-bold">Reportes Generales</span> para obtener una visión global del grupo o canalizaciones activas. 
                            Los <span className="text-navy font-bold">Reportes Específicos</span> permiten profundizar en el seguimiento individual de cada alumno o por tipo de incidencia académica detectada.
                        </p>
                        <button 
                            onClick={() => navigate('/reportes/documentacion')}
                            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-[10px] tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all uppercase"
                        >
                            Documentación Completa
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Recent Reports - Full Width */}
            <div className="mt-4">
                <Tarjeta title="Reportes Generados Recientemente" subtitle="Acceso rápido a los últimos informes descargados">
                    {history.length > 0 ? (
                        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-navy/40 border-b border-gray-100">
                                        <th className="px-8 py-5">Fecha</th>
                                        <th className="px-8 py-5">Reporte</th>
                                        <th className="px-8 py-5">Tipo</th>
                                        <th className="px-8 py-5">Autor</th>
                                        <th className="px-8 py-5 text-right">Acciones</th>
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
                                                className="hover:bg-blue-50/30 transition-colors group"
                                            >
                                                <td className="px-8 py-5 text-[11px] font-bold text-navy/60">{entry.dateFormatted}</td>
                                                <td className="px-8 py-5 text-xs font-black text-navy uppercase tracking-tight">
                                                    <div className="flex items-center gap-3">
                                                        <FileText size={14} className="text-gold opacity-50" />
                                                        {entry.title}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${entry.type === 'General' ? 'bg-navy/5 text-navy' : 'bg-gold/10 text-gold'}`}>
                                                        {entry.type}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-[11px] font-bold text-navy/40">{entry.author}</td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                        {entry.data ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleDownload(entry)}
                                                                    className="p-2.5 text-navy/40 hover:text-navy hover:bg-navy/5 rounded-xl transition-all"
                                                                    title="Ver/Descargar"
                                                                >
                                                                    <Download size={16} />
                                                                </button>
                                                                {String(entry.authorId) === String(user?.id_tutor || user?.n_control) && (
                                                                    <button
                                                                        onClick={() => handleEdit(entry)}
                                                                        className="p-2.5 text-navy/40 hover:text-gold hover:bg-gold/10 rounded-xl transition-all"
                                                                        title="Editar Datos"
                                                                    >
                                                                        <Edit2 size={16} />
                                                                    </button>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-[9px] font-bold text-navy/20 italic px-2">Datos no disponibles</span>
                                                        )}
                                                        {(String(entry.authorId) === String(user?.id_tutor || user?.n_control) || !entry.authorId) && (
                                                            <button
                                                                onClick={() => handleDelete(entry.id)}
                                                                className="p-2.5 text-navy/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                                title="Eliminar del Historial"
                                                            >
                                                                <Trash2 size={16} />
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
                        <div className="mt-8 py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/30">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <FileText size={40} className="text-navy/10" />
                            </div>
                            <p className="text-navy/30 font-black uppercase tracking-[0.2em] text-xs">Sin actividad reciente de reportes</p>
                        </div>
                    )}
                </Tarjeta>
            </div>
        </div>
    );
};

export default TutorReportes;
