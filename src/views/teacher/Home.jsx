import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, MessageCircle, MoreVertical, Search, Filter } from 'lucide-react';
import Card from '../../components/Card.jsx';

const TeacherHome = () => {
    const students = [
        { id: 1, name: 'Miguel Angel', control: '20210456', status: 'Riesgo', last: '2 días' },
        { id: 2, name: 'Ana Garcia', control: '20210789', status: 'Regular', last: 'Hoy' },
        { id: 3, name: 'Carlos Ruiz', control: '20210123', status: 'Excelente', last: '1 semana' },
    ];

    const stats = [
        { label: 'Total Alumnos', value: '42', icon: Users, color: 'text-navy', bg: 'bg-blue-50' },
        { label: 'Tutorías Pendientes', value: '8', icon: FileText, color: 'text-gold', bg: 'bg-yellow-50' },
        { label: 'Mensajes Nuevos', value: '12', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Panel del Docente</h1>
                    <p className="text-text-muted mt-1">Gestiona el progreso de tus tutorados</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Filter size={16} /> Filtrar
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        Nueva Sesión
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-text-muted text-sm font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-navy">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Student List Table view */}
            <Card title="Seguimiento de Alumnos" subtitle="Lista detallada por estatus académico">
                <div className="mt-4 overflow-hidden border border-gray-100 rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-text-muted text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Alumno</th>
                                <th className="px-6 py-4 font-semibold">N. Control</th>
                                <th className="px-6 py-4 font-semibold">Estatus</th>
                                <th className="px-6 py-4 font-semibold">Último Contacto</th>
                                <th className="px-6 py-4 font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-navy font-bold text-xs">
                                                {student.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-navy">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-muted">{student.control}</td>
                                    <td className="px-6 py-4">
                                        <span className={`
                      px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight
                      ${student.status === 'Riesgo' ? 'bg-red-50 text-red-600' : ''}
                      ${student.status === 'Regular' ? 'bg-orange-50 text-orange-600' : ''}
                      ${student.status === 'Excelente' ? 'bg-green-50 text-green-600' : ''}
                    `}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-muted">{student.last}</td>
                                    <td className="px-6 py-4">
                                        <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100 shadow-sm">
                                            <MoreVertical size={16} className="text-text-muted" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default TeacherHome;
