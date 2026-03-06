import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, User, BookOpen, Clock, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { useUser } from '../../context/UserContext.jsx';
import { Estudiantes, getIncidencias, getMensajes, Tutores } from '../../data/database.js';

const MisEstudiantes = () => {
    const { user } = useUser();
    const [refresh, setRefresh] = useState(0);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const handleUpdate = () => setRefresh(prev => prev + 1);
        window.addEventListener('databaseUpdated', handleUpdate);
        return () => window.removeEventListener('databaseUpdated', handleUpdate);
    }, []);

    // Get all initial data
    const allIncidencias = getIncidencias() || [];

    // Status Logic
    const getStudentStatus = (student) => {
        // Search for unread incidents for this student
        const studentIncidencias = allIncidencias.filter(i =>
            parseInt(i.estudiante_n_control, 10) === parseInt(student.n_control, 10) && !i.leida
        );

        // Get all messages for this student to check for tutor contact
        const studentMessages = getMensajes(student.n_control) || [];

        // Find the FIRST message SENT BY A TUTOR to this student
        // Tutores.some check ensures the sender is a tutor
        const tutorContact = [...studentMessages]
            .filter(m =>
                parseInt(m.destinatario_id, 10) === parseInt(student.n_control, 10) &&
                Tutores.some(t => t.id_tutor === parseInt(m.remitente_id, 10))
            )
            .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))[0];

        // 1. Recibido / Atendiendo: Unread incident + Contacted by Tutor
        if (studentIncidencias.length > 0 && tutorContact) {
            return {
                label: 'Atendiendo',
                type: 'atendiendo',
                color: 'text-blue-600 bg-blue-50',
                icon: MessageSquare,
                firstContact: tutorContact
            };
        }

        // 2. Pendiente: Unread incident + Not contacted yet
        if (studentIncidencias.length > 0) {
            return {
                label: 'Pendiente',
                type: 'pendiente',
                color: 'text-orange-600 bg-orange-50',
                icon: AlertCircle
            };
        }

        // 3. Regular: No unread incidents
        return {
            label: 'Regular',
            type: 'regular',
            color: 'text-green-600 bg-green-50',
            icon: CheckCircle,
            incidentType: 'Ninguna', // Default for regular
            // Even if regular, they might have been contacted in the past
            firstContact: tutorContact
        };
    };

    const getIncidentType = (student) => {
        const studentIncidencias = allIncidencias.filter(i =>
            parseInt(i.estudiante_n_control, 10) === parseInt(student.n_control, 10) && !i.leida
        );
        return studentIncidencias.length > 0 ? studentIncidencias[0].tipo : 'Ninguna';
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-full">
            {/* Header Section */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="p-4 bg-navy/5 rounded-lg text-navy">
                    <Users size={36} />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-navy">Historial de Estudiantes</h1>
                    <p className="text-text-muted font-medium">Todos los alumnos registrados en el sistema</p>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'all', label: 'Todos', color: 'bg-navy/5 text-navy border-navy/10' },
                    { id: 'regular', label: 'Regular', color: 'bg-green-50 text-green-600 border-green-100' },
                    { id: 'pendiente', label: 'Pendiente', color: 'bg-orange-50 text-orange-600 border-orange-100' },
                    { id: 'atendiendo', label: 'Atendiendo', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`
                            px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-[0.2em] border transition-all
                            ${filter === f.id ? f.color + ' shadow-sm scale-105' : 'bg-white text-navy/40 border-slate-100 hover:bg-slate-50'}
                        `}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Table Container */}
            <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">
                                <th className="px-8 py-6">Estudiante / Carrera</th>
                                <th className="px-8 py-6">Incidencia</th>
                                <th className="px-8 py-6">Estatus</th>
                                <th className="px-8 py-6">Primer Contacto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {Estudiantes.filter(student => {
                                if (filter === 'all') return true;
                                const status = getStudentStatus(student);
                                return status.type === filter;
                            }).map((student) => {
                                const status = getStudentStatus(student);
                                const StatusIcon = status.icon;

                                let contactInfo = null;
                                if (status.firstContact) {
                                    const tutor = Tutores.find(t => t.id_tutor === parseInt(status.firstContact.remitente_id, 10));
                                    contactInfo = {
                                        tutorName: tutor ? tutor.nombre_completo : 'Tutor',
                                        time: status.firstContact.fecha_hora
                                    };
                                }

                                return (
                                    <motion.tr
                                        key={student.n_control}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50/30 transition-colors group"
                                    >
                                        {/* Name and Carrera */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-navy/5 rounded-md flex items-center justify-center text-navy font-black text-sm">
                                                    {student.nombre_completo.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-navy uppercase tracking-tight group-hover:text-gold transition-colors">
                                                        {student.nombre_completo}
                                                    </p>
                                                    <p className="text-[10px] text-text-muted font-medium">
                                                        {student.carrera} • {student.n_control}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Incident Type */}
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getIncidentType(student) !== 'Ninguna' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                                                {getIncidentType(student)}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                                                <StatusIcon size={12} />
                                                {status.label}
                                            </div>
                                        </td>

                                        {/* First Contact */}
                                        <td className="px-8 py-6 text-sm">
                                            {contactInfo ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-navy font-bold">
                                                        <User size={14} className="text-gold" />
                                                        {contactInfo.tutorName}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-wider">
                                                        <Clock size={12} />
                                                        {contactInfo.time}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-navy/20 font-medium">Sin contacto previo</span>
                                            )}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {Estudiantes.length === 0 && (
                    <div className="py-32 text-center text-navy/20">
                        <Users size={64} className="mx-auto mb-4 opacity-10" />
                        <p className="text-xl font-black uppercase tracking-widest">No hay estudiantes registrados</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisEstudiantes;
