import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, ClipboardList, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import Tarjeta from '../../components/Tarjeta';

const DocumentacionReportes = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Reportes Generales",
            description: "Informes de seguimiento grupal y administrativo. La principal diferencia entre Semestral y Detallado radica en las Fechas de Periodo que se evalúan.",
            reports: [
                {
                    name: "Reportes por Grupo (Semestral y Detallado)",
                    purpose: "Evalúa las aptitudes, canales de atención y desarrollo general de los estudiantes de un mismo grupo.",
                    content: [
                        "Programa Educativo: La carrera profesional a la que pertenece el grupo evaluado.",
                        "Grupo: Identificador alfanumérico exacto de 2 caracteres (ej. 1A, 3C).",
                        "Periodo (Fechas): En el reporte Semestral abarcará todo el ciclo escolar, mientras que en el Detallado se ajusta a lapsos más cortos (ej. un mes, unidad).",
                        "Lista de Estudiantes: Registro uno a uno de los alumnos con su Nombre y Número de Control.",
                        "Estadísticas Grupales e Individuales: Desglose exacto de áreas de apoyo (Psicología, Beca, Académica, etc.), cuántos alumnos se canalizaron a cada una y su porcentaje real frente al total de la clase o evaluados."
                    ],
                    icon: <FileText className="text-blue-500" />
                },
                {
                    name: "Reporte de Canalizaciones",
                    purpose: "Listado oficial de todos los alumnos que fueron derivados a un área de apoyo especializada.",
                    content: [
                        "Datos del Documento: Incluye Carrera, Grupo, Fechas y el Número Total de Alumnos canalizados.",
                        "Motivo de Canalización: Justificación breve escrita por el tutor del porqué se está enviando al alumno.",
                        "Área Derivada: Especifica a qué departamento se envió (Salud, Adicciones, Asesoría Académica, etc.).",
                        "Observaciones: Notas extra sobre la situación particular del estudiante durante la tutoría."
                    ],
                    icon: <CheckCircle2 className="text-green-500" />
                }
            ]
        },
        {
            title: "Reportes Específicos",
            description: "Informes enfocados en un solo alumno o en una incidencia particular detectada.",
            reports: [
                {
                    name: "Reporte por Alumno (Semestral y Detallado)",
                    purpose: "Expediente de entrevista individual y rendimiento personal de un estudiante.",
                    content: [
                        "Datos del Estudiante: Semestre actual, Edad, Sexo, Estado Civil, Situación Laboral y si cuenta con beca.",
                        "Áreas Evaluadas: Calificaciones subjetivas del tutor sobre el aspecto Cognitivo, Afectivo, Somático y un Diagnóstico general.",
                        "Compromisos: Acuerdos escritos establecidos entre el estudiante y el tutor a cumplir en el periodo.",
                        "Periodo: Al igual que el grupal, el Semestral abarca el ciclo completo y el Detallado un periodo particular de evaluación."
                    ],
                    icon: <Info className="text-orange-500" />
                },
                {
                    name: "Reporte de Incidencias (Semestral y Detallado)",
                    purpose: "Registro formal de faltas, reportes de disciplina o alertas académicas graves emitidas por docentes.",
                    content: [
                        "Docente Reportador: Nombre del maestro que levanta la alerta o queja.",
                        "Estudiante Implicado: A quién va dirigida la incidencia.",
                        "Tipo de Incidencia: Clasificación del problema (Falta de respeto, Inasistencias, Bajo rendimiento, Plagio, etc.).",
                        "Evidencias y Resoluciones: Pasos que se tomaron para corregir la actitud o estado del estudiante."
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
                                    <Tarjeta className="h-full border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-500 overflow-hidden bg-white/70 backdrop-blur-sm group">
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
                                    </Tarjeta>
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
