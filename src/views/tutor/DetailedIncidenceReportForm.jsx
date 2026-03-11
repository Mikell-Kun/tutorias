import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, Plus, Trash2, ShieldAlert, FileText, Calendar, Users, BarChart } from 'lucide-react';
import Card from '../../components/Card';
import { useUser } from '../../context/UserContext';
import { Estudiantes } from '../../data/database';
import { generateDetailedIncidenceReport } from '../../utils/reportGenerator';
import { saveReportEntry } from '../../utils/reportHistory';

const DetailedIncidenceReportForm = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const editData = location.state?.editData;

    const [formData, setFormData] = useState({
        tutorName: user?.nombre_completo || '',
        academicDept: user?.departamento || '',
        institute: 'Instituto Tecnológico de Mexicali',
        period: '', // This can be "Enero 2026", "Semana 12", etc.
        startDate: '',
        endDate: '',
        incidenceType: '',
        supportProvided: '',
        students: [
            { name: '', attentionDate: '', career: '' }
        ],
        totalAffected: 0,
        topCareer: '',
        careerPercentage: 0,
        observations: ''
    });

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        }
    }, [editData]);

    const incidenceTypes = [
        'Retardos o ausencias injustificadas',
        'Bajo rendimiento académico',
        'Incumplimiento de tareas y proyectos',
        'Falta de participación en clase',
        'Necesidad de asesoría académica',
        'Dificultades en trámites administrativo-académicos',
        'Requerimiento de servicios psicológicos',
        'Atención por servicios de salud',
        'Atención por servicios de salud',
        'Situación de riesgo por adicciones',
        'Solicitud de apoyo alimenticio',
        'Necesidad de beca de manutención o transporte',
        'Detección de aptitudes sobresalientes',
        'Problemas personales o familiares',
        'Dificultades de adaptación social y emocional',
        'Comportamiento inapropiado'
    ];

    const supportAreas = [
        { label: 'Servicios Psicológicos (SP)', value: 'SP' },
        { label: 'Servicios de Salud (SS)', value: 'SS' },
        { label: 'Adicciones (AD)', value: 'AD' },
        { label: 'Beca de Manutención (BM)', value: 'BM' },
        { label: 'Beca de Transporte (BT)', value: 'BT' },
        { label: 'Beca de Alimentación (BA)', value: 'BA' },
        { label: 'Asesoría Académica (AA)', value: 'AA' },
        { label: 'Asesoría de Procesos (APAA)', value: 'APAA' },
        { label: 'Aptitudes Sobresalientes (AS)', value: 'AS' }
    ];

    const addStudentRow = () => {
        setFormData(prev => ({
            ...prev,
            students: [...prev.students, { name: '', attentionDate: '', career: '' }]
        }));
    };

    const removeStudentRow = (index) => {
        setFormData(prev => ({
            ...prev,
            students: prev.students.filter((_, i) => i !== index)
        }));
    };

    const handleStudentChange = (index, field, value) => {
        const newStudents = [...formData.students];
        newStudents[index][field] = value;

        if (field === 'name' && value.length > 3) {
            const found = Estudiantes.find(e => e.nombre_completo.toLowerCase().includes(value.toLowerCase()));
            if (found) {
                newStudents[index].name = found.nombre_completo;
                newStudents[index].career = found.carrera;
            }
        }

        setFormData(prev => ({ ...prev, students: newStudents }));
    };

    useEffect(() => {
        const validStudents = formData.students.filter(s => s.name.trim() !== '');
        const total = validStudents.length;

        let topCareer = 'N/A';
        let percentage = 0;

        if (total > 0) {
            const careerCounts = {};
            validStudents.forEach(s => {
                const career = s.career || 'No definida';
                careerCounts[career] = (careerCounts[career] || 0) + 1;
            });

            const sortedCareers = Object.entries(careerCounts).sort((a, b) => b[1] - a[1]);
            topCareer = sortedCareers[0][0];
            percentage = ((sortedCareers[0][1] / total) * 100).toFixed(2);
        }

        setFormData(prev => ({
            ...prev,
            totalAffected: total,
            topCareer: topCareer,
            careerPercentage: percentage
        }));
    }, [formData.students]);

    const handleSubmit = (e) => {
        e.preventDefault();
        generateDetailedIncidenceReport(formData);

        saveReportEntry({
            author: user?.nombre_completo || 'Tutor',
            authorId: user?.id_tutor || user?.n_control,
            type: 'Específico',
            reportType: 'incidence_detailed',
            title: `Reporte Detallado Incidencia - ${formData.incidenceType || 'S/I'}`,
            data: formData
        });
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-navy text-white rounded-2xl shadow-lg shadow-navy/20">
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-navy uppercase tracking-tight">Reporte Detallado por Incidencia</h1>
                        <p className="text-text-muted font-bold uppercase text-[10px] tracking-[0.2em]">Seguimiento Específico por Periodo</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Información General" subtitle="Detalles del tutor y periodo específico">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Nombre del Tutor</label>
                                <input type="text" value={formData.tutorName} readOnly className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-navy" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Periodo (Mes/Semana)</label>
                                <input type="text" placeholder="Ej. Marzo 2026" required value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Departamento Académico</label>
                                <input type="text" value={formData.academicDept} readOnly className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-navy" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Fecha Inicio</label>
                                    <input type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Fecha Final</label>
                                    <input type="date" required value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Detalles de la Incidencia" subtitle="Categoría y apoyo brindado">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Tipo de Incidencia</label>
                                <select required value={formData.incidenceType} onChange={(e) => setFormData({ ...formData, incidenceType: e.target.value })} className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all">
                                    <option value="">Seleccionar tipo...</option>
                                    {incidenceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Apoyo Brindado</label>
                                <select required value={formData.supportProvided} onChange={(e) => setFormData({ ...formData, supportProvided: e.target.value })} className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all">
                                    <option value="">Seleccionar apoyo...</option>
                                    {supportAreas.map(a => <option key={a.value} value={a.label}>{a.label}</option>)}
                                </select>
                            </div>
                        </div>
                    </Card>

                    <Card title="Lista de Estudiantes" subtitle="Alumnos atendidos en este periodo" actions={
                        <button type="button" onClick={addStudentRow} className="flex items-center gap-2 px-4 py-2 bg-navy text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold hover:text-navy transition-all">
                            <Plus size={14} /> Añadir Alumno
                        </button>
                    }>
                        <div className="mt-6 space-y-3">
                            {formData.students.map((std, index) => (
                                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-2xl items-center group">
                                    <span className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-xs font-black text-navy shadow-sm">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            placeholder="Nombre Completo"
                                            value={std.name}
                                            onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                                            className="px-4 py-2 bg-white border-none rounded-xl text-sm font-bold text-navy shadow-sm focus:ring-2 focus:ring-gold/30"
                                        />
                                        <div className="flex items-center gap-3">
                                            <Calendar size={14} className="text-navy/20" />
                                            <input
                                                type="date"
                                                value={std.attentionDate}
                                                onChange={(e) => handleStudentChange(index, 'attentionDate', e.target.value)}
                                                className="flex-1 px-4 py-2 bg-white border-none rounded-xl text-sm font-bold text-navy shadow-sm focus:ring-2 focus:ring-gold/30"
                                            />
                                        </div>
                                    </div>
                                    {formData.students.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeStudentRow(index)}
                                            className="p-2 text-red-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {formData.students.length === 0 && (
                                <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                                    <Users size={40} className="mx-auto text-navy/10 mb-2" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-navy/20">No has agregado estudiantes todavía</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card title="Resumen de Resultados" subtitle="Análisis de la muestra">
                        <div className="space-y-6 mt-6">
                            <div className="p-5 bg-navy/5 rounded-3xl border border-navy/5 space-y-6 text-center">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40">Total de Estudiantes</label>
                                    <div className="text-3xl font-black text-navy">{formData.totalAffected}</div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40">Carrera más en Común</label>
                                    <div className="text-sm font-black text-navy uppercase px-4 leading-tight">
                                        {formData.topCareer}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 block">Resultado (Porcentaje Total)</label>
                                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-gold bg-white text-xl font-black text-navy shadow-inner shadow-gold/10">
                                        {formData.careerPercentage}%
                                    </div>
                                    <p className="text-[9px] font-bold text-navy/40 px-4 mt-2 leading-relaxed italic">
                                        Representa el porcentaje de la carrera con mayor incidencia en este periodo específico.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Observaciones" subtitle="Anotaciones finales">
                        <textarea rows="4" value={formData.observations} onChange={(e) => setFormData({ ...formData, observations: e.target.value })} className="w-full mt-4 p-5 bg-gray-50 border-none rounded-3xl font-medium text-navy focus:ring-2 focus:ring-gold/50 transition-all text-sm" placeholder="Comentarios adicionales sobre el seguimiento de este periodo..." />
                    </Card>

                    <div className="flex gap-4">
                        <button type="button" onClick={() => navigate('/reportes')} className="flex-1 py-4 bg-gray-100 text-navy font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-200 transition-all">Cancelar</button>
                        <button type="submit" className="flex-[2] py-4 bg-navy text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gold hover:text-navy transition-all shadow-xl shadow-navy/20 flex items-center justify-center gap-2">
                            <Save size={16} /> Generar PDF Detallado
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DetailedIncidenceReportForm;
