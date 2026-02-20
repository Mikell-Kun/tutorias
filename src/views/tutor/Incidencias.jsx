import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, User, MessageSquare, Clock, BookOpen, Send } from 'lucide-react';
import { useUser } from '../../context/UserContext.jsx';
import { getIncidencias, markIncidenciaAsRead, addMensaje } from '../../data/database.js';

const TutorIncidencias = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [incidencias, setIncidencias] = useState(getIncidencias() || []);

    // Filter all incidents for the system (all tutors see everything)
    const myIncidencias = (incidencias || []).filter(i => i);

    const handleMarkAsRead = (id) => {
        const updated = markIncidenciaAsRead(id);
        setIncidencias(updated);
    };

    const handleContactStudent = (incidencia) => {
        const tutorId = user.id_tutor;
        const studentId = incidencia.estudiante_n_control;
        const nombreEstudiante = incidencia.estudiante_nombre.split(' ')[0];
        const content = `Reporte de Incidencia: Hola ${nombreEstudiante}, te contacto respecto al reporte en la materia ${incidencia.materia_nombre} (${incidencia.tipo}). ¿Podemos platicar al respecto?`;

        // Send message
        addMensaje(tutorId, studentId, content);

        // Navigate to messages with the contact selected
        navigate('/mensajes', { state: { contactId: studentId } });
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-full">
            {/* Header Section */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                <div className="p-4 bg-navy/5 rounded-2xl text-navy">
                    <AlertTriangle size={36} />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-navy">Incidencias Reportadas</h1>
            </div>

            {/* Alert Banner */}
            {myIncidencias.length > 0 && (
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-3 text-orange-600">
                    <AlertTriangle size={18} />
                    <p className="text-sm font-bold">
                        Atención: Tienes {myIncidencias.length} incidencia(s) reportada(s) por profesores sobre tus estudiantes.
                    </p>
                </div>
            )}

            {/* Incidencias List */}
            <div className="space-y-6">
                {myIncidencias.map((incidencia) => (
                    <motion.div
                        key={incidencia.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group"
                    >
                        <div className="relative z-10">
                            {/* Header: Name and Badge */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-black tracking-tight text-navy uppercase">{incidencia.estudiante_nombre}</h2>
                                        {!incidencia.leida && (
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        )}
                                    </div>
                                    <p className="text-sm text-text-muted mt-1 font-medium italic">
                                        Matrícula: {incidencia.estudiante_n_control} • {incidencia.estudiante_carrera}
                                    </p>
                                </div>
                                <span className="px-4 py-1.5 bg-gold text-navy text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-gold/20">
                                    {incidencia.tipo}
                                </span>
                            </div>

                            {/* Description Section */}
                            <div className="space-y-4 py-6 border-y border-gray-50">
                                <div>
                                    <label className="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em] block mb-2">Descripción:</label>
                                    <div className="bg-gray-50 rounded-2xl p-6 text-center italic text-navy/80 font-medium border border-gray-100">
                                        "{incidencia.descripcion}"
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em] block mb-2">Materia:</label>
                                    <p className="text-lg font-bold text-navy">{incidencia.materia_codigo} - {incidencia.materia_nombre}</p>
                                </div>
                            </div>

                            {/* Footer Section */}
                            <div className="mt-8 flex justify-between items-end">
                                <div className="space-y-2">
                                    <p className="text-xs text-text-muted font-medium tracking-tight">
                                        Reportado por: <span className="text-navy font-bold">{incidencia.docente_nombre}</span>
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-navy/40 font-bold uppercase tracking-wider">
                                        <Clock size={12} />
                                        {incidencia.fecha_hora}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {!incidencia.leida && (
                                        <button
                                            onClick={() => handleMarkAsRead(incidencia.id)}
                                            className="px-6 py-3 bg-gray-50 text-navy text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-gray-100 transition-colors"
                                        >
                                            Marcar como leído
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleContactStudent(incidencia)}
                                        className="btn-institutional-modern !w-auto h-auto px-6 py-3 flex items-center gap-3"
                                    >
                                        <MessageSquare size={16} />
                                        Contactar Estudiante
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {myIncidencias.length === 0 && (
                    <div className="py-32 text-center text-navy/20">
                        <AlertTriangle size={64} className="mx-auto mb-4 opacity-10" />
                        <p className="text-xl font-black uppercase tracking-widest">Sin incidencias reportadas</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorIncidencias;
