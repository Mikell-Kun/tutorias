import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, X, Plus, Trash2, UserPlus, FileText, Calendar, Users, BarChart } from 'lucide-react';
import Tarjeta from '../../components/Tarjeta';
import { useUser } from '../../context/ContextoUsuario';
import { fetchEstudiantes } from '../../data/database.js';
import { generateDetailedGroupReport } from '../../utils/reportGenerator';
import { saveReportEntry } from '../../utils/reportHistory';

const FormularioReporteGrupalDetallado = () => {
    const [Estudiantes, setEstudiantes] = useState([]);
    useEffect(() => { fetchEstudiantes().then(setEstudiantes); }, []);
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const editData = location.state?.editData;

    const [formData, setFormData] = useState({
        tutorName: user?.nombre_completo || '',
        academicDept: user?.departamento || '',
        institute: 'Instituto Tecnológico de Mexicali',
        period: '',
        program: '',
        groupNum: '',
        startDate: '',
        endDate: '',
        students: [], // { name: '', control: '', autoFilled: false }
        groupTutoring: {
            totalStudents: 0,
            referrals: { SP: 0, SS: 0, AD: 0, BM: 0, BT: 0, BA: 0, AA: 0, APAA: 0, AS: 0 }
        },
        individualTutoring: {
            totalStudents: 0,
            referrals: { SP: 0, SS: 0, AD: 0, BM: 0, BT: 0, BA: 0, AA: 0, APAA: 0, AS: 0 }
        },
        observations: ''
    });

    // Handle Edit Mode
    useEffect(() => {
        if (editData) {
            setFormData(editData);
        }
    }, [editData]);

    const programs = [
        'Ing. Bioquímica',
        'Ing. Sistemas Computacionales',
        'Contador Público',
        'Ing. Semiconductores',
        'Ing. Desarrollo de Aplicaciones Móviles',
        'Ing. Eléctrica',
        'Ing. Logística',
        'Ing. Mecatrónica',
        'Ing. Química',
        'Ing. Mecánica',
        'Ing. Electrónica',
        'Ing. Industrial',
        'Ing. Gestión Empresarial',
        'Ing. Administración'
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

    const addStudent = () => {
        setFormData(prev => ({
            ...prev,
            students: [...prev.students, { name: '', control: '', autoFilled: false }]
        }));
    };

    const removeStudent = (index) => {
        setFormData(prev => ({
            ...prev,
            students: prev.students.filter((_, i) => i !== index)
        }));
    };

    const handleStudentChange = (index, field, value) => {
        const newStudents = [...formData.students];
        newStudents[index][field] = value;

        // Auto-fill logic
        if (field === 'name' && value.length > 3) {
            const found = Estudiantes.find(e => e.nombre_completo.toLowerCase().includes(value.toLowerCase()));
            if (found) {
                newStudents[index].name = found.nombre_completo;
                newStudents[index].control = found.n_control;
                newStudents[index].autoFilled = true;
            }
        }

        setFormData(prev => ({ ...prev, students: newStudents }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        generateDetailedGroupReport(formData);

        saveReportEntry({
            author: user?.nombre_completo || 'Tutor',
            authorId: user?.id_tutor || user?.n_control,
            type: 'General',
            reportType: 'detailed',
            title: `Detallado por Grupo - ${formData.groupNum || 'S/G'}`,
            data: formData
        });
    };

    useEffect(() => {
        const totalG = formData.students.length;
        setFormData(prev => ({
            ...prev,
            groupTutoring: {
                ...prev.groupTutoring,
                totalStudents: totalG
            }
        }));
    }, [formData.students.length]);


    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-gold text-navy rounded-2xl shadow-lg shadow-gold/20">
                        <FileText size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-navy uppercase tracking-tight">Reporte Detallado</h1>
                        <p className="text-text-muted font-bold uppercase text-[10px] tracking-[0.2em]">Formato por Grupo</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Info */}
                <div className="lg:col-span-2 space-y-8">
                    <Tarjeta title="Información General" subtitle="Datos del periodo y seguimiento">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Nombre del Tutor</label>
                                <input
                                    type="text"
                                    value={formData.tutorName}
                                    readOnly
                                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-navy focus:ring-2 focus:ring-gold/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Instituto</label>
                                <input
                                    type="text"
                                    value={formData.institute}
                                    readOnly
                                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-navy"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Departamento Académico</label>
                                <input
                                    type="text"
                                    value={formData.academicDept}
                                    readOnly
                                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-navy"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Periodo mensual/semanal</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Especificar mes o semana"
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Programa Educativo</label>
                                <select
                                    required
                                    value={formData.program}
                                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all"
                                >
                                    <option value="">Seleccionar Carrera</option>
                                    {programs.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Grupo</label>
                                <input
                                    type="text"
                                    maxLength="2"
                                    placeholder="Ej. 1A"
                                    required
                                    value={formData.groupNum}
                                    onChange={(e) => {
                                        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                        if (val.length <= 2) {
                                            setFormData({ ...formData, groupNum: val });
                                        }
                                    }}
                                    className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all uppercase"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Fecha Inicio</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Fecha Final</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </Tarjeta>

                    {/* Student List */}
                    <Tarjeta
                        title="Lista de Estudiantes"
                        subtitle="Atenciones específicas para este periodo"
                        actions={
                            <button
                                type="button"
                                onClick={addStudent}
                                className="flex items-center gap-2 px-4 py-2 bg-navy text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold hover:text-navy transition-all"
                            >
                                <UserPlus size={14} /> Agregar Alumno
                            </button>
                        }
                    >
                        <div className="mt-6 space-y-3">
                            {formData.students.map((student, index) => (
                                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-2xl items-center group">
                                    <span className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-xs font-black text-navy shadow-sm">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="Nombre Completo"
                                            value={student.name}
                                            onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                                            className="px-4 py-2 bg-white border-none rounded-xl text-sm font-bold text-navy shadow-sm"
                                        />
                                        <input
                                            placeholder="Num. Control"
                                            value={student.control}
                                            onChange={(e) => handleStudentChange(index, 'control', e.target.value)}
                                            className="px-4 py-2 bg-white border-none rounded-xl text-sm font-bold text-navy shadow-sm"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeStudent(index)}
                                        className="p-2 text-red-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {formData.students.length === 0 && (
                                <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                                    <Users size={40} className="mx-auto text-navy/10 mb-2" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-navy/20">No has agregado estudiantes todavía</p>
                                </div>
                            )}
                        </div>
                    </Tarjeta>
                </div>

                {/* Stats & Actions */}
                <div className="space-y-8">
                    <Tarjeta title="Estadísticas del Periodo" subtitle="Resultados de atención">
                        <div className="space-y-6 mt-6">
                            <div className="p-5 bg-navy/5 rounded-3xl border border-navy/5">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-navy mb-4 flex items-center gap-2">
                                    <Users size={14} /> Tutoría Grupal
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs font-bold text-navy/60 uppercase tracking-tighter mb-4">
                                        <span>Total Estudiantes</span>
                                        <span className="text-navy">{formData.groupTutoring.totalStudents}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-12 gap-2 text-[10px] font-black uppercase tracking-widest text-navy/40 mb-2">
                                        <div className="col-span-8">Área de Canalización</div>
                                        <div className="col-span-2 text-center">Cant.</div>
                                        <div className="col-span-2 text-center">%</div>
                                    </div>

                                    {supportAreas.map(area => {
                                        const count = formData.groupTutoring.referrals[area.value] || 0;
                                        const percentage = formData.students.length > 0 ? ((count / formData.students.length) * 100).toFixed(2) : '0.00';
                                        return (
                                            <div key={`group-${area.value}`} className="grid grid-cols-12 gap-2 items-center">
                                                <div className="col-span-8 text-[10px] font-bold text-navy/70 line-clamp-1" title={area.label}>
                                                    {area.label}
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={count}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 0;
                                                            setFormData({
                                                                ...formData,
                                                                groupTutoring: {
                                                                    ...formData.groupTutoring,
                                                                    referrals: { ...formData.groupTutoring.referrals, [area.value]: val }
                                                                }
                                                            });
                                                        }}
                                                        className="w-full px-1 py-1.5 bg-white border-2 border-transparent rounded-lg font-bold text-navy focus:border-gold shadow-sm transition-all text-xs text-center"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={`${percentage}%`}
                                                        className="w-full px-0 py-1.5 bg-transparent border-none font-bold text-navy/60 cursor-not-allowed text-[10px] text-center"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Individual Tutoring Section */}
                            <div className="p-5 bg-gold/5 rounded-3xl border border-gold/10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-4 flex items-center gap-2">
                                    <BarChart size={14} /> Tutoría Individual
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gold/80">
                                            Alumnos Evaluados Individualmente
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.individualTutoring.totalStudents}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                individualTutoring: { ...formData.individualTutoring, totalStudents: parseInt(e.target.value) || 0 }
                                            })}
                                            className="w-16 px-2 py-1.5 bg-white border-2 border-transparent rounded-lg font-bold text-navy focus:border-gold shadow-sm transition-all text-sm text-center"
                                        />
                                    </div>

                                    <div className="grid grid-cols-12 gap-2 text-[10px] font-black uppercase tracking-widest text-gold/60 mb-2 mt-4">
                                        <div className="col-span-8">Área de Canalización</div>
                                        <div className="col-span-2 text-center">Cant.</div>
                                        <div className="col-span-2 text-center">%</div>
                                    </div>

                                    {supportAreas.map(area => {
                                        const count = formData.individualTutoring.referrals[area.value] || 0;
                                        const baseTotal = formData.individualTutoring.totalStudents || 0;
                                        const percentage = baseTotal > 0 ? ((count / baseTotal) * 100).toFixed(2) : '0.00';
                                        return (
                                            <div key={`indiv-${area.value}`} className="grid grid-cols-12 gap-2 items-center">
                                                <div className="col-span-8 text-[10px] font-bold text-gold/80 line-clamp-1" title={area.label}>
                                                    {area.label}
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={count}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 0;
                                                            setFormData({
                                                                ...formData,
                                                                individualTutoring: {
                                                                    ...formData.individualTutoring,
                                                                    referrals: { ...formData.individualTutoring.referrals, [area.value]: val }
                                                                }
                                                            });
                                                        }}
                                                        className="w-full px-1 py-1.5 bg-white border-2 border-transparent rounded-lg font-bold text-navy focus:border-gold shadow-sm transition-all text-xs text-center"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={`${percentage}%`}
                                                        className="w-full px-0 py-1.5 bg-transparent border-none font-bold text-gold/80 cursor-not-allowed text-[10px] text-center"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Tarjeta>


                    <Tarjeta title="Observaciones" subtitle="Notas del seguimiento detallado">
                        <textarea
                            rows="4"
                            placeholder="Anote incidencias, avances o comentarios específicos de este periodo..."
                            value={formData.observations}
                            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                            className="w-full mt-4 p-5 bg-gray-50 border-none rounded-3xl font-medium text-navy focus:ring-2 focus:ring-gold/50 transition-all text-sm"
                        ></textarea>
                    </Tarjeta>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/reportes')}
                            className="flex-1 py-4 bg-gray-100 text-navy font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-200 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-4 bg-navy text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gold hover:text-navy transition-all shadow-xl shadow-navy/20 flex items-center justify-center gap-2"
                        >
                            <Save size={16} /> Generar Reporte PDF
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FormularioReporteGrupalDetallado;
