import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, MessageCircle, MoreVertical, Filter, GraduationCap } from 'lucide-react';
import Card from '../../components/Card.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { Estudiantes } from '../../data/database.js';

const TutorHome = () => {
    const { user } = useUser();

    // Filter students assigned to this tutor
    const assignedStudents = Estudiantes.filter(s => s.tutor_id === user?.id_tutor);
    const atRiskStudents = assignedStudents.filter(s => s.estatus === 'Riesgo');

    const stats = [
        { label: 'Alumnos Asignados', value: assignedStudents.length, icon: Users, color: 'text-navy', bg: 'bg-blue-50' },
        { label: 'Alumnos en Riesgo', value: atRiskStudents.length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Mensajes Nuevos', value: '5', icon: MessageCircle, color: 'text-gold', bg: 'bg-yellow-50' },
    ];

    return (
        <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-navy uppercase tracking-tight">Panel de Tutoría</h1>
                    <p className="text-text-muted mt-1">Seguimiento de alumnos asignados y alertas académicas</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Filter size={16} /> Filtrar
                    </button>
                    <button className="btn-institutional-modern !w-auto px-6 !py-2.5 h-auto">
                        Generar Reporte
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-text-muted text-xs font-black uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-navy">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Assigned Students List */}
            <Card title="Alumnos bajo Tutoría" subtitle="Gestión de progreso y estatus académico">
                <div className="mt-4 overflow-hidden border border-gray-100 rounded-2xl">
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
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {assignedStudents.map((student) => (
                                <tr key={student.n_control} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-navy text-white rounded-lg flex items-center justify-center font-black text-xs shadow-sm">
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
                                            px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                                            ${student.estatus === 'Riesgo' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}
                                        `}>
                                            {student.estatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 hover:shadow-sm">
                                            <MoreVertical size={16} className="text-text-muted" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Risk Alert Section (Optional but helpful for UI) */}
            {atRiskStudents.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-red-600 rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-red-200"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                            <AlertTriangle size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight">Atención Prioritaria</h3>
                            <p className="text-white/80 font-medium">Hay {atRiskStudents.length} alumnos en situación de riesgo que requieren intervención inmediata.</p>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-white text-red-600 font-black rounded-xl uppercase tracking-widest text-xs hover:bg-red-50 transition-colors">
                        Revisar Casos
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default TutorHome;
