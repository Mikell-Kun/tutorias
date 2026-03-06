import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, MessageCircle, MoreVertical, GraduationCap, LayoutDashboard } from 'lucide-react';
import Card from '../../components/Card.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { Estudiantes, getIncidencias, getMensajes, Tutores } from '../../data/database.js';
import { useNavigate } from 'react-router-dom';

const TutorHome = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [refresh, setRefresh] = React.useState(0);

    React.useEffect(() => {
        const handleUpdate = () => setRefresh(prev => prev + 1);
        window.addEventListener('databaseUpdated', handleUpdate);
        return () => window.removeEventListener('databaseUpdated', handleUpdate);
    }, []);

    // Filter students assigned to this tutor
    const assignedStudents = (Estudiantes || []).filter(s => s && s.tutor_id === user?.id_tutor);
    const atRiskStudents = assignedStudents.filter(s => s && s.estatus === 'Riesgo');


    // Filter system incidents for THIS tutor
    const incidencias = getIncidencias() || [];
    const tutorIncidencias = incidencias.filter(i => i.tutor_id === user?.id_tutor);
    const unreadIncidencias = tutorIncidencias.filter(i => !i.leida);

    // Status Logic
    const getStudentDashboardStatus = (student) => {
        const studentIncidencias = incidencias.filter(i =>
            parseInt(i.estudiante_n_control, 10) === parseInt(student.n_control, 10) && !i.leida
        );

        const studentMessages = getMensajes(student.n_control) || [];
        const tutorContact = [...studentMessages]
            .filter(m =>
                parseInt(m.destinatario_id, 10) === parseInt(student.n_control, 10) &&
                Tutores.some(t => t.id_tutor === parseInt(m.remitente_id, 10))
            )
            .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))[0];

        if (studentIncidencias.length > 0 && tutorContact) {
            return { label: 'Atendiendo', color: 'bg-blue-50 text-blue-600 border-blue-100' };
        }
        if (studentIncidencias.length > 0) {
            return { label: 'Pendiente', color: 'bg-orange-50 text-orange-600 border-orange-100' };
        }
        return { label: 'Regular', color: 'bg-green-50 text-green-600 border-green-100' };
    };

    const messages = getMensajes(user?.id_tutor) || [];
    const unreadCount = messages.filter(m =>
        parseInt(m.destinatario_id, 10) === user?.id_tutor && !m.leido
    ).length;

    const stats = [
        { label: 'Alumnos Asignados', value: assignedStudents.length, icon: Users },
        { label: 'Incidencias Nuevas', value: unreadIncidencias.length, icon: AlertTriangle },
        { label: 'Mensajes Nuevos', value: unreadCount, icon: MessageCircle },
    ];

    const attendingStudents = assignedStudents.filter(student => {
        const status = getStudentDashboardStatus(student);
        return status.label === 'Atendiendo';
    });

    return (
        <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="p-4 bg-navy/5 rounded-lg text-navy">
                    <LayoutDashboard size={36} />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-navy">Panel de Tutoría</h1>
                    <p className="text-text-muted font-medium mt-1">Seguimiento de alumnos con atención activa</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-navy/5 text-navy rounded-lg">
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">{stat.label}</p>
                                <p className="text-2xl font-black text-navy">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Assigned Students List */}
            <Card title="Alumnos en Atención" subtitle="Estudiantes que requieren seguimiento activo">
                <div className="mt-4 overflow-hidden border border-slate-100 rounded-lg">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">
                                <th className="px-6 py-4">Alumno</th>
                                <th className="px-6 py-4">Matrícula</th>
                                <th className="px-6 py-4">Carrera</th>
                                <th className="px-6 py-4">Estatus</th>
                                <th className="px-6 py-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {attendingStudents.map((student) => {
                                const status = getStudentDashboardStatus(student);
                                return (
                                    <tr key={student.n_control} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-navy text-white rounded-md flex items-center justify-center font-black text-xs shadow-sm">
                                                    {student.nombre_completo.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-navy group-hover:text-blue-600 transition-colors">{student.nombre_completo}</span>
                                                    <span className="text-[10px] text-text-muted font-medium">{student.correo}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-navy/60">{student.n_control}</td>
                                        <td className="px-6 py-4 text-sm text-text-muted">{student.carrera}</td>
                                        <td className="px-6 py-4">
                                            <span className={`
                                                    px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border
                                                    ${status.color}
                                                `}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 hover:shadow-sm">
                                                <MoreVertical size={16} className="text-text-muted" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {attendingStudents.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-navy/20 font-medium">
                                        No hay alumnos en atención activa en este momento.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Risk Alert Section (Optional but helpful for UI) */}
            {atRiskStudents.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-red-600 rounded-xl text-white flex items-center justify-between shadow-xl shadow-red-200"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                            <AlertTriangle size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight">Atención Prioritaria</h3>
                            <p className="text-white/80 font-medium">Hay {atRiskStudents.length} alumnos en situación de riesgo que requieren intervención inmediata.</p>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-white text-red-600 font-black rounded-md uppercase tracking-widest text-xs hover:bg-slate-50 transition-colors">
                        Revisar Casos
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default TutorHome;
