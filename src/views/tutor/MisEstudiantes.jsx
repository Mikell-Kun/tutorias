import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, User, BookOpen, Clock, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { useUser } from '../../context/ContextoUsuario.jsx';
import { fetchEstudiantes, getIncidencias, getMensajes, fetchTutores } from '../../data/database.js';

const MisEstudiantes = () => {
    const { user } = useUser();
    const [refresh, setRefresh] = useState(0);
    const [filter, setFilter] = useState('all');

    const [Estudiantes, setEstudiantes] = useState([]);
    const [Tutores, setTutores] = useState([]);
    const [allIncidencias, setAllIncidencias] = useState([]);
    const [tutorMessages, setTutorMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            const est = await fetchEstudiantes();
            const tut = await fetchTutores();
            const inc = await getIncidencias();
            
            const userId = user?.n_control || user?.id_tutor;
            let msgs = [];
            if(userId) msgs = await getMensajes(userId);

            setEstudiantes(est || []);
            setTutores(tut || []);
            setAllIncidencias(inc || []);
            setTutorMessages(msgs || []);
            setLoading(false);
        };
        loadAllData();

        const handleUpdate = () => setRefresh(prev => prev + 1);
        window.addEventListener('databaseUpdated', handleUpdate);
        return () => window.removeEventListener('databaseUpdated', handleUpdate);
    }, [refresh, user]);

    // Status Logic
    const getStudentStatus = (student) => {
        const studentIncidencias = allIncidencias.filter(i =>
            parseInt(i.estudiante_n_control || i.estudiante_relacionado, 10) === parseInt(student.n_control, 10) && !i.leida
        );

        // Find the FIRST message SENT BY A TUTOR to this student in our locally cached messages
        const tutorContact = [...tutorMessages]
            .filter(m =>
                (parseInt(m.destinatario_id, 10) === parseInt(student.n_control, 10) || parseInt(m.remitente_id, 10) === parseInt(student.n_control, 10)) &&
                Tutores.some(t => t.id_tutor === parseInt(m.remitente_id, 10))
            )
            .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))[0];

        if (studentIncidencias.length > 0 && tutorContact) {
            return {
                label: 'Atendiendo',
                type: 'atendiendo',
                color: 'text-blue-600 bg-blue-50',
                icon: MessageSquare,
                firstContact: tutorContact
            };
        }

        return {
            label: 'Regular',
            type: 'regular',
            color: 'text-green-600 bg-green-50',
            icon: CheckCircle,
            incidentType: 'Ninguna',
            firstContact: tutorContact
        };
    };

    if (loading) return <div className="p-8 text-center">Cargando estudiantes...</div>;



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



                                        {/* Status */}
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                                                <StatusIcon size={12} />
                                                {status.label}
                                            </div>
                                        </td>

                                        {/* First Contact */}
                                        <td className="px-8 py-6 text-sm">
                                            {status.type === 'atendiendo' && contactInfo ? (
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
                                                <span className="text-navy/20 font-medium">-</span>
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
