import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone, Trash2, Send, AlertCircle } from 'lucide-react';
import Card from '../../components/Card.jsx';
import { Estudiantes, Materias, Tutores, addIncidencia } from '../../data/database.js';
import { useUser } from '../../context/UserContext.jsx';

const ReportarIncidencia = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        estudiante_n_control: '',
        tipo: '',
        materia: '',
        descripcion: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const incidentTypes = [
        'Retardos o ausencias injustificadas',
        'Bajo rendimiento académico',
        'Incumplimiento de tareas y proyectos',
        'Falta de participación en clase',
        'Necesidad de asesoría académica',
        'Dificultades en trámites administrativo-académicos',
        'Requerimiento de servicios psicológicos',
        'Atención por servicios de salud',
        'Situación de riesgo por adicciones',
        'Solicitud de apoyo alimenticio',
        'Necesidad de beca de manutención o transporte',
        'Detección de aptitudes sobresalientes',
        'Problemas personales o familiares',
        'Dificultades de adaptación social y emocional',
        'Comportamiento inapropiado'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'descripcion' && value.length > 200) return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStudentChange = (e) => {
        setFormData(prev => ({
            ...prev,
            estudiante_n_control: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.estudiante_n_control || !formData.tipo || !formData.descripcion) {
            setStatus({ type: 'error', message: 'Por favor completa todos los campos obligatorios.' });
            return;
        }

        const student = Estudiantes.find(s => s.n_control === parseInt(formData.estudiante_n_control, 10));
        const materiaObj = Materias[user.departamento]?.find(m => m.codigo === formData.materia);

        const newIncident = {
            estudiante_n_control: student.n_control,
            estudiante_nombre: student.nombre_completo,
            estudiante_carrera: student.carrera,
            tipo: formData.tipo,
            descripcion: formData.descripcion,
            materia_codigo: materiaObj?.codigo || 'N/A',
            materia_nombre: materiaObj?.nombre || formData.materia || 'No especificada',
            docente_nombre: user.nombre_completo,
            fecha_hora: new Date().toLocaleString('es-MX')
        };

        addIncidencia(newIncident);
        setStatus({ type: 'success', message: 'Incidencia reportada exitosamente.' });

        setTimeout(() => {
            navigate('/');
        }, 1500);
    };

    const handleClear = () => {
        setFormData({
            estudiante_n_control: '',
            tipo: '',
            materia: '',
            descripcion: ''
        });
        setStatus({ type: '', message: '' });
    };

    const subjects = Materias[user?.departamento] || [];

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="p-4 bg-navy/5 text-navy rounded-lg">
                    <Megaphone size={36} />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-navy">Reportar Incidencia</h1>
                    <p className="text-text-muted font-medium mt-1">Informa sobre situaciones que requieran atención del tutor</p>
                </div>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Estudiante */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy uppercase tracking-wider">Estudiante *</label>
                            <select
                                name="estudiante_n_control"
                                value={formData.estudiante_n_control}
                                onChange={handleStudentChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-md focus:ring-2 focus:ring-navy/5 focus:border-navy transition-all outline-none"
                                required
                            >
                                <option value="">Selecciona un estudiante...</option>
                                {Estudiantes.map(s => (
                                    <option key={s.n_control} value={s.n_control}>{s.nombre_completo} ({s.n_control})</option>
                                ))}
                            </select>
                        </div>

                        {/* Tipo de Incidencia */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy uppercase tracking-wider">Tipo de Incidencia *</label>
                            <select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-md focus:ring-2 focus:ring-navy/5 focus:border-navy transition-all outline-none"
                                required
                            >
                                <option value="">Selecciona un tipo...</option>
                                {incidentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Materia */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy uppercase tracking-wider">Materia (Opcional)</label>
                            <select
                                name="materia"
                                value={formData.materia}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-md focus:ring-2 focus:ring-navy/5 focus:border-navy transition-all outline-none"
                            >
                                <option value="">No especificar materia</option>
                                {subjects.map(m => (
                                    <option key={m.codigo} value={m.codigo}>{m.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-bold text-navy uppercase tracking-wider">Descripción *</label>
                            <span className={`text-[10px] font-bold ${formData.descripcion.length >= 200 ? 'text-red-500' : 'text-text-muted'}`}>
                                {formData.descripcion.length}/200 caracteres
                            </span>
                        </div>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            placeholder="Describe la situación con el mayor detalle posible..."
                            rows="4"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-md focus:ring-2 focus:ring-navy/5 focus:border-navy transition-all outline-none resize-none"
                            required
                        ></textarea>
                    </div>

                    {status.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-md flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}
                        >
                            <AlertCircle size={18} />
                            <span className="text-sm font-medium">{status.message}</span>
                        </motion.div>
                    )}

                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-navy text-white rounded-md font-bold shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all"
                        >
                            <Send size={18} /> Enviar Reporte
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleClear}
                            className="px-8 flex items-center justify-center gap-2 py-4 bg-slate-100 text-navy rounded-md font-bold hover:bg-slate-200 transition-all"
                        >
                            <Trash2 size={18} /> Limpiar
                        </motion.button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ReportarIncidencia;
