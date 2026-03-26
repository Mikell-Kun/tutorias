import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, Plus, Trash2, FileText, Users, MapPin, CheckCircle2 } from 'lucide-react';
import Tarjeta from '../../components/Tarjeta';
import { useUser } from '../../context/ContextoUsuario';
import { generateReferralReport } from '../../utils/reportGenerator';
import { saveReportEntry } from '../../utils/reportHistory';

const FormularioReporteCanalizacion = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const editData = location.state?.editData;

    const [formData, setFormData] = useState({
        tutorName: user?.nombre_completo || '',
        academicDept: user?.departamento || '',
        period: '',
        program: '',
        groupNum: '',
        totalStudentsNum: '',
        startDate: '',
        endDate: '',
        sessions: [
            { number: '1', attended: '', sp: '', ss: '', ad: '', bm: '', bt: '', ba: '', aa: '', apaa: '', as: '' }
        ],
        supportStatus: {
            SP: { externa: false, interna: false, otras: false, ninguno: false },
            SS: { externa: false, interna: false, otras: false, ninguno: false },
            AD: { externa: false, interna: false, otras: false, ninguno: false },
            BM: { externa: false, interna: false, otras: false, ninguno: false },
            BT: { externa: false, interna: false, otras: false, ninguno: false },
            BA: { externa: false, interna: false, otras: false, ninguno: false },
            AA: { externa: false, interna: false, otras: false, ninguno: false },
            APAA: { externa: false, interna: false, otras: false, ninguno: false },
            AS: { externa: false, interna: false, otras: false, ninguno: false }
        }
    });

    // Handle Edit Mode
    useEffect(() => {
        if (editData) {
            setFormData(editData);
        }
    }, [editData]);

    const programs = [
        'Ing. Bioquímica', 'Ing. Sistemas Computacionales', 'Contador Público', 'Ing. Semiconductores',
        'Ing. Desarrollo de Aplicaciones Móviles', 'Ing. Eléctrica', 'Ing. Logística', 'Ing. Mecatrónica',
        'Ing. Química', 'Ing. Mecánica', 'Ing. Electrónica', 'Ing. Industrial', 'Ing. Gestión Empresarial', 'Ing. Administración'
    ];

    const supportAreas = [
        { id: 'SP', label: 'Servicios Psicológicos' },
        { id: 'SS', label: 'Servicios de Salud' },
        { id: 'AD', label: 'Adicciones' },
        { id: 'BM', label: 'Beca de Manutención' },
        { id: 'BT', label: 'Beca de Transporte' },
        { id: 'BA', label: 'Beca de Alimentación' },
        { id: 'AA', label: 'Asesoría Académica' },
        { id: 'APAA', label: 'Asesoría de Procesos' },
        { id: 'AS', label: 'Aptitudes Sobresalientes' }
    ];

    const addSession = () => {
        setFormData(prev => ({
            ...prev,
            sessions: [...prev.sessions, {
                number: (prev.sessions.length + 1).toString(),
                attended: '', sp: '', ss: '', ad: '', bm: '', bt: '', ba: '', aa: '', apaa: '', as: ''
            }]
        }));
    };

    const removeSession = (index) => {
        setFormData(prev => ({
            ...prev,
            sessions: prev.sessions.filter((_, i) => i !== index)
        }));
    };

    const handleSessionChange = (index, field, value) => {
        const newSessions = [...formData.sessions];
        newSessions[index][field] = value;
        setFormData(prev => ({ ...prev, sessions: newSessions }));
    };

    const toggleStatus = (areaId, type) => {
        setFormData(prev => ({
            ...prev,
            supportStatus: {
                ...prev.supportStatus,
                [areaId]: {
                    ...prev.supportStatus[areaId],
                    [type]: !prev.supportStatus[areaId][type]
                }
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        generateReferralReport(formData);

        saveReportEntry({
            author: user?.nombre_completo || 'Tutor',
            authorId: user?.id_tutor || user?.n_control,
            type: 'General',
            reportType: 'referral',
            title: `Canalizaciones por Grupo - ${formData.groupNum || 'S/G'}`,
            data: formData
        });
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-navy text-gold rounded-2xl shadow-lg shadow-navy/20">
                        <MapPin size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-navy uppercase tracking-tight">Reporte de Canalizaciones</h1>
                        <p className="text-text-muted font-bold uppercase text-[10px] tracking-[0.2em]">Formato por Sesiones</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Data */}
                <Tarjeta title="Datos Generales" subtitle="Información técnica del grupo y periodo">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                        <div className="space-y-2 lg:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Tutor</label>
                            <input type="text" readOnly value={formData.tutorName} className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl font-bold text-navy border-none" />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Departamento</label>
                            <input type="text" value={formData.academicDept} onChange={(e) => setFormData({ ...formData, academicDept: e.target.value })} className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Fecha Inicio</label>
                            <input type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Fecha Término</label>
                            <input type="date" required value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all" />
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
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Nº Alumnos</label>
                            <input type="number" required value={formData.totalStudentsNum} onChange={(e) => setFormData({ ...formData, totalStudentsNum: e.target.value })} className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all" />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Programa Educativo</label>
                            <select required value={formData.program} onChange={(e) => setFormData({ ...formData, program: e.target.value })} className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all" >
                                <option value="">Seleccionar Carrera</option>
                                {programs.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-1">Periodo escolar</label>
                            <input type="text" required placeholder="Ej. 2026-1" value={formData.period} onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || /^\d{1,4}$/.test(val) || /^\d{4}-$/.test(val) || /^\d{4}-[12]$/.test(val)) {
                                    setFormData({ ...formData, period: val });
                                }
                            }} className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-navy focus:border-gold transition-all" />
                        </div>
                    </div>
                </Tarjeta>

                {/* Session Table */}
                <Tarjeta
                    title="Resumen de Sesiones"
                    subtitle="Distribución de canalizaciones por área"
                    actions={
                        <button type="button" onClick={addSession} className="px-4 py-2 bg-navy text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold hover:text-navy transition-all flex items-center gap-2">
                            <Plus size={14} /> Nueva Sesión
                        </button>
                    }
                >
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-widest text-navy/40 border-b border-gray-100">
                                    <th className="pb-4 pr-4">Sesión</th>
                                    <th className="pb-4 px-4">Atendidos</th>
                                    {['SP', 'SS', 'AD', 'BM', 'BT', 'BA', 'AA', 'APAA', 'AS'].map(area => (
                                        <th key={area} className="pb-4 px-2 text-center">{area}</th>
                                    ))}
                                    <th className="pb-4 pl-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {formData.sessions.map((s, idx) => (
                                    <tr key={idx} className="group">
                                        <td className="py-4 pr-4">
                                            <input type="text" value={s.number} onChange={(e) => handleSessionChange(idx, 'number', e.target.value)} className="w-12 px-2 py-2 bg-gray-50 rounded-lg font-bold text-navy text-sm border-none shadow-inner" />
                                        </td>
                                        <td className="py-4 px-4">
                                            <input type="number" placeholder="0" value={s.attended} onChange={(e) => handleSessionChange(idx, 'attended', e.target.value)} className="w-20 px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm font-bold shadow-sm focus:border-gold" />
                                        </td>
                                        {['sp', 'ss', 'ad', 'bm', 'bt', 'ba', 'aa', 'apaa', 'as'].map(field => (
                                            <td key={field} className="py-4 px-1">
                                                <input type="number" placeholder="-" value={s[field]} onChange={(e) => handleSessionChange(idx, field, e.target.value)} className="w-10 px-1 py-2 text-center bg-gray-50/50 rounded-lg text-xs font-medium focus:bg-white focus:ring-1 focus:ring-gold transition-all" />
                                            </td>
                                        ))}
                                        <td className="py-4 pl-4">
                                            <button type="button" onClick={() => removeSession(idx)} className="p-2 text-red-200 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Tarjeta>

                {/* Support Matrix */}
                <Tarjeta title="Estatus de Apoyos" subtitle="Tipo de vinculación por programa educativo">
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {supportAreas.map(area => (
                            <div key={area.id} className="p-4 bg-gray-50 rounded-2xl space-y-3">
                                <h4 className="text-[10px] font-black uppercase text-navy flex items-center justify-between">
                                    {area.label} <span className="text-gold opacity-50">{area.id}</span>
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {['externa', 'interna', 'otras', 'ninguno'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => toggleStatus(area.id, type)}
                                            className={`py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-2 ${formData.supportStatus[area.id][type]
                                                ? 'bg-navy text-white shadow-lg shadow-navy/20'
                                                : 'bg-white text-navy/30 hover:bg-white hover:text-navy border border-gray-100'
                                                }`}
                                        >
                                            {formData.supportStatus[area.id][type] && <CheckCircle2 size={10} />}
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Tarjeta>

                {/* Actions */}
                <div className="flex gap-4">
                    <button type="button" onClick={() => navigate('/reportes')} className="flex-1 py-4 bg-gray-100 text-navy font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-200 transition-all">
                        Cancelar
                    </button>
                    <button type="submit" className="flex-[2] py-4 bg-navy text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gold hover:text-navy transition-all shadow-xl shadow-navy/20 flex items-center justify-center gap-2">
                        <Save size={16} /> Generar Reporte Canalizaciones
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioReporteCanalizacion;
