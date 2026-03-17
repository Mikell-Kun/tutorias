import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, Plus, Trash2, UserPlus, FileText, Calendar, Users, BarChart } from 'lucide-react';
import Tarjeta from '../../components/Tarjeta';
import { useUser } from '../../context/ContextoUsuario';
import { Estudiantes } from '../../data/database';
import { generateDetailedStudentReport } from '../../utils/reportGenerator';
import { saveReportEntry } from '../../utils/reportHistory';

const FormularioReporteEstudianteDetallado = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const editData = location.state?.editData;

    const [formData, setFormData] = useState({
        tutorName: user?.nombre_completo || '',
        academicDept: user?.departamento || '',
        institute: 'Instituto Tecnológico de Mexicali',
        period: '',
        startDate: '',
        endDate: '',
        studentName: '',
        controlNumber: '',
        career: '',
        semester: '',
        sessions: [
            { number: 'Sesión 1', area: '', supportType: '', date: '' }
        ],
        totalSessions: 0,
        topArea: '',
        resultPercentage: 0,
        observations: ''
    });

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        }
    }, [editData]);

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

    const handleStudentSearch = (value) => {
        setFormData(prev => ({ ...prev, studentName: value }));
        if (value.length > 3) {
            const found = Estudiantes.find(e => e.nombre_completo.toLowerCase().includes(value.toLowerCase()));
            if (found) {
                setFormData(prev => ({
                    ...prev,
                    studentName: found.nombre_completo,
                    controlNumber: found.n_control,
                    career: found.carrera,
                    semester: found.semestre
                }));
            }
        }
    };

    const addSession = () => {
        setFormData(prev => ({
            ...prev,
            sessions: [...prev.sessions, { number: `Sesión ${prev.sessions.length + 1}`, area: '', supportType: '', date: '' }]
        }));
    };

    const removeSession = (index) => {
        setFormData(prev => ({
            ...prev,
            sessions: prev.sessions.filter((_, i) => i !== index)
        }));
    };

    const handleSessionChange = (index, field, value) => {
        setFormData(prev => {
            const newSessions = [...prev.sessions];
            newSessions[index] = { ...newSessions[index], [field]: value };
            return { ...prev, sessions: newSessions };
        });
    };

    useEffect(() => {
        const total = formData.sessions.length;
        const counts = {};
        formData.sessions.forEach(s => {
            if (s.supportType) {
                counts[s.supportType] = (counts[s.supportType] || 0) + 1;
            }
        });

        let top = '-';
        let max = 0;
        Object.entries(counts).forEach(([area, count]) => {
            if (count > max) {
                max = count;
                top = area;
            }
        });

        const percentage = total > 0 ? ((max / total) * 100).toFixed(2) : 0;

        setFormData(prev => ({
            ...prev,
            totalSessions: total,
            topArea: top,
            resultPercentage: percentage
        }));
    }, [formData.sessions]);

    const handleSubmit = (e) => {
        e.preventDefault();
        generateDetailedStudentReport(formData);

        saveReportEntry({
            author: user?.nombre_completo || 'Tutor',
            authorId: user?.id_tutor || user?.n_control,
            type: 'Específico',
            reportType: 'student_detailed',
            title: `Detallado por Alumno - ${formData.studentName || 'S/N'}`,
            data: formData
        });
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-navy text-white rounded-2xl shadow-lg shadow-navy/20">
                        <FileText size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-navy uppercase tracking-tight">Reporte Detallado</h1>
                        <p className="text-text-muted font-bold uppercase text-[10px] tracking-[0.2em]">Formato por Alumno (Rango Específico)</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Tarjeta title="Información General" subtitle="Datos del tutor y periodo específico">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Nombre del Tutor</label>
                                <input type="text" value={formData.tutorName} readOnly className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-navy" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Periodo mensual/semanal</label>
                                <input type="text" placeholder="Periodo específico" required value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all" />
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
                    </Tarjeta>

                    <Tarjeta title="Datos del Alumno" subtitle="Información del estudiante atendido">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Nombre del Alumno/a</label>
                                <input type="text" placeholder="Buscar alumno..." required value={formData.studentName} onChange={(e) => handleStudentSearch(e.target.value)} className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Matrícula</label>
                                <input type="text" readOnly value={formData.controlNumber} className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-navy" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Carrera</label>
                                <input type="text" readOnly value={formData.career} className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-navy" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Semestre</label>
                                <input type="text" readOnly value={formData.semester} className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-navy" />
                            </div>
                        </div>
                    </Tarjeta>

                    <Tarjeta title="Sesiones Detalladas" subtitle="Registro de actividades en el periodo" actions={
                        <button type="button" onClick={addSession} className="flex items-center gap-2 px-4 py-2 bg-navy text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold hover:text-navy transition-all">
                            <Plus size={14} /> Agregar Sesión
                        </button>
                    }>
                        <div className="mt-6 space-y-4">
                            {formData.sessions.map((session, index) => (
                                <div key={index} className="p-6 bg-gray-50 rounded-[2rem] space-y-4 relative group border border-transparent hover:border-gray-200 transition-all">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-navy text-white flex items-center justify-center text-xs font-black italic">
                                                {index + 1}
                                            </div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-navy/60">{session.number}</h4>
                                        </div>
                                        {formData.sessions.length > 1 && (
                                            <button type="button" onClick={() => removeSession(index)} className="p-2 text-red-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-navy/40">Área Canalizada</label>
                                            <input type="text" placeholder="Descripción del área" value={session.area} onChange={(e) => handleSessionChange(index, 'area', e.target.value)} className="w-full px-4 py-2 bg-white rounded-xl text-xs font-bold text-navy shadow-sm" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-navy/40">Tipo de Apoyo</label>
                                            <select value={session.supportType} onChange={(e) => handleSessionChange(index, 'supportType', e.target.value)} className="w-full px-4 py-2 bg-white rounded-xl text-xs font-bold text-navy shadow-sm">
                                                <option value="">Seleccionar...</option>
                                                {supportAreas.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-navy/40">Fecha de Atención</label>
                                            <input type="date" value={session.date} onChange={(e) => handleSessionChange(index, 'date', e.target.value)} className="w-full px-4 py-2 bg-white rounded-xl text-xs font-bold text-navy shadow-sm" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Tarjeta>
                </div>

                <div className="space-y-8">
                    <Tarjeta title="Resumen Estadístico" subtitle="Cálculos automáticos">
                        <div className="space-y-6 mt-6">
                            <div className="p-5 bg-navy/5 rounded-3xl border border-navy/5 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40">Sesiones en Total</label>
                                    <div className="text-2xl font-black text-navy">{formData.totalSessions}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40">Área Mayor Canalización</label>
                                    <div className="text-sm font-black text-navy uppercase">{formData.topArea}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40">Resultado (% Total)</label>
                                    <div className="text-2xl font-black text-gold">{formData.resultPercentage}%</div>
                                </div>
                            </div>
                        </div>
                    </Tarjeta>

                    <Tarjeta title="Observaciones" subtitle="Comentarios adicionales">
                        <textarea rows="4" value={formData.observations} onChange={(e) => setFormData({ ...formData, observations: e.target.value })} className="w-full mt-4 p-5 bg-gray-50 border-none rounded-3xl font-medium text-navy focus:ring-2 focus:ring-gold/50 transition-all text-sm" placeholder="Añadir observaciones relevantes..." />
                    </Tarjeta>

                    <div className="flex gap-4">
                        <button type="button" onClick={() => navigate('/reportes')} className="flex-1 py-4 bg-gray-100 text-navy font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-200 transition-all">Cancelar</button>
                        <button type="submit" className="flex-[2] py-4 bg-navy text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gold hover:text-navy transition-all shadow-xl shadow-navy/20 flex items-center justify-center gap-2">
                            <Save size={16} /> Generar PDF
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FormularioReporteEstudianteDetallado;
