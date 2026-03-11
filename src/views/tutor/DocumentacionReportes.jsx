import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, ClipboardList, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import Card from '../../components/Card';

const DocumentacionReportes = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Reportes Generales",
            description: "Informes diseñados para dar seguimiento al progreso grupal y gestiones administrativas.",
            reports: [
                {
                    name: "Semestral por Grupo",
                    purpose: "Resumen estadístico del desempeño del grupo durante el ciclo escolar.",
                    content: [
                        "Métricas de aprobación y reprobación global.",
                        "Identificación de materias con mayor índice de reprobación.",
                        "Promedio general del grupo."
                    ],
                    icon: <FileText className="text-blue-500" />
                },
                {
                    name: "Detallado por Grupo",
                    purpose: "Listado pormenorizado del estatus académico de cada estudiante del grupo.",
                    content: [
                        "Estatus individual (Regular/Irregular).",
                        "Número de incidencias reportadas por alumno.",
                        "Alertas de riesgo académico por inasistencias."
                    ],
                    icon: <ClipboardList className="text-indigo-500" />
                },
                {
                    name: "De Canalizaciones",
                    purpose: "Seguimiento de alumnos derivados a servicios de apoyo institucional.",
                    content: [
                        "Listado de canalizaciones a Psicología, Servicios Médicos o Asesorías Académicas.",
                        "Estatus de la canalización (Atendida/Pendiente).",
                        "Observaciones del tutor sobre el seguimiento."
                    ],
                    icon: <CheckCircle2 className="text-green-500" />
                }
            ]
        },
        {
            title: "Reportes Específicos",
            description: "Informes detallados por entidad (alumno o tipo de incidencia) para un análisis profundo.",
            reports: [
                {
                    name: "Por Alumno (Semestral/Detallado)",
                    purpose: "Expediente completo de la trayectoria de un estudiante específico.",
                    content: [
                        "Historial de incidencias y acciones de tutoría.",
                        "Seguimiento de compromisos adquiridos por el alumno.",
                        "Detalle de reuniones y acuerdos mutuos."
                    ],
                    icon: <Info className="text-orange-500" />
                },
                {
                    name: "Por Incidencia (Semestral/Detallado)",
                    purpose: "Análisis recurrente de causas raíz de problemas académicos.",
                    content: [
                        "Agrupación de reportes por tipo de incidencia (Conducta, Académica, etc.).",
                        "Frecuencia de reportes por docente.",
                        "Resolución de conflictos y efectividad de las tutorías."
                    ],
                    icon: <AlertCircle className="text-red-500" />
                }
            ]
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8"
            >
                <button
                    onClick={() => navigate('/reportes')}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span style={{ fontFamily: '"Microsoft YaHei UI", sans-serif' }} className="font-bold uppercase tracking-wider text-sm">
                        Volver a Reportes
                    </span>
                </button>
            </motion.div>

            <header className="mb-12">
                <h1 style={{ fontFamily: '"Microsoft YaHei UI", sans-serif' }} className="text-4xl font-black text-slate-800 tracking-tight leading-tight mb-4">
                    GUÍA DE FORMATOS <span className="text-blue-600">DE TUTORÍA</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
                    Esta guía detalla el propósito y contenido de cada uno de los informes generados por el sistema de tutorías institucional.
                </p>
            </header>

            <div className="space-y-16">
                {sections.map((section, sIndex) => (
                    <section key={sIndex}>
                        <div className="mb-8">
                            <h2 style={{ fontFamily: '"Microsoft YaHei UI", sans-serif' }} className="text-xl font-bold text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-3">
                                <span className="h-0.5 w-8 bg-blue-600"></span>
                                {section.title}
                            </h2>
                            <p className="text-slate-400 text-sm ml-11">{section.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.reports.map((report, rIndex) => (
                                <motion.div
                                    key={rIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: rIndex * 0.1 + sIndex * 0.2 }}
                                >
                                    <Card className="h-full border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-500 overflow-hidden bg-white/70 backdrop-blur-sm group">
                                        <div className="p-6 relative">
                                            <div className="mb-6 flex items-start justify-between">
                                                <div className="p-3 rounded-2xl bg-white shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                    {report.icon}
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-300 tracking-[0.2em] uppercase">
                                                    Format Type {sIndex + 1}.{rIndex + 1}
                                                </div>
                                            </div>

                                            <h3 style={{ fontFamily: '"Microsoft YaHei UI", sans-serif' }} className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                {report.name}
                                            </h3>

                                            <p className="text-slate-500 text-sm mb-6 leading-relaxed italic border-l-2 border-slate-100 pl-4 py-1">
                                                "{report.purpose}"
                                            </p>

                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contenido Destacado:</p>
                                                <ul className="space-y-2">
                                                    {report.content.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-normal">
                                                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors duration-500" />
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <footer className="mt-16 pt-8 border-t border-slate-100 text-center">
                <p className="text-slate-400 text-xs tracking-widest uppercase">Tecnológico Nacional de México • Sistema de Tutorías</p>
            </footer>
        </div>
    );
};

export default DocumentacionReportes;
