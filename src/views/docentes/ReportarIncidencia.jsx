import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone, Trash2, Send, AlertCircle } from 'lucide-react';
import Tarjeta from '../../components/Tarjeta.jsx';
import { fetchEstudiantes, fetchMaterias, addIncidencia } from '../../data/database.js';
import { useUser } from '../../context/ContextoUsuario.jsx';

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
    
    const [Estudiantes, setEstudiantes] = useState([]);
    const [Materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);

    const [materiaSearch, setMateriaSearch] = useState('');
    const [showMateriaDropdown, setShowMateriaDropdown] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            const est = await fetchEstudiantes();
            const mat = await fetchMaterias();
            setEstudiantes(est || []);
            setMaterias(mat || []);
            setLoading(false);
        };
        loadInitialData();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.estudiante_n_control || !formData.tipo || !formData.descripcion) {
            setStatus({ type: 'error', message: 'Por favor completa todos los campos obligatorios.' });
            return;
        }

        const student = Estudiantes.find(s => s.n_control === parseInt(formData.estudiante_n_control, 10));
        const materiaObj = myMaterias.find(m => m.codigo === formData.materia);

        // Nuevo formato para el backend
        const newIncident = {
            remitente_id: user.n_control || user.id_tutor,
            estudiante_relacionado: student.n_control,
            tipo: formData.tipo,
            titulo: 'Reporte de Incidencia',
            descripcion: formData.descripcion,
            datos: {
                materia_codigo: materiaObj?.codigo || 'N/A',
                materia_nombre: materiaObj?.nombre || formData.materia || 'No especificada',
                docente_nombre: user.nombre_completo,
                estudiante_nombre: student.nombre_completo,
                estudiante_carrera: student.carrera
            }
        };

        const result = await addIncidencia(newIncident);
        if(result) {
            setStatus({ type: 'success', message: 'Incidencia reportada exitosamente.' });
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } else {
            setStatus({ type: 'error', message: 'Hubo un error reportando la incidencia.' });
        }
    };

    const handleClear = () => {
        setFormData({
            estudiante_n_control: '',
            tipo: '',
            materia: '',
            descripcion: ''
        });
        setMateriaSearch('');
        setStatus({ type: '', message: '' });
    };

    // Filtrado condicional: Solo obtener las materias que pertenecen al departamento del docente activo.
    const myMaterias = Materias.filter(m => m.departamento === user?.departamento);

    // Filtrado interactivo: Este arreglo se actualiza en tiempo real basado en lo que el usuario escribe.
    // Filtra el nombre o el código de la materia.
    const filteredMaterias = myMaterias.filter(m => 
        m.nombre.toLowerCase().includes(materiaSearch.toLowerCase()) || 
        m.codigo.toLowerCase().includes(materiaSearch.toLowerCase())
    );

    // Función que se dispara al hacer clic en alguna materia de la lista de sugerencias.
    const handleSelectMateria = (materia) => {
         setFormData(prev => ({ ...prev, materia: materia.codigo }));
         setMateriaSearch(materia.nombre);
         setShowMateriaDropdown(false);
    };

    // Función que captura el texto tipeado por el usuario y abre el panel visual de sugerencias.
    const handleMateriaSearchChange = (e) => {
         setMateriaSearch(e.target.value);
         if (!e.target.value) {
             // Si el campo está vacío, limpiamos la selección previa.
             setFormData(prev => ({ ...prev, materia: '' }));
         }
         if (!showMateriaDropdown) setShowMateriaDropdown(true);
    };

    if (loading) return <div className="p-8 text-center text-navy font-bold text-lg animate-pulse">Cargando base de datos...</div>;

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

            <Tarjeta>
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
                        <div className="space-y-2 relative">
                            <label className="text-sm font-bold text-navy uppercase tracking-wider">Materia (Opcional)</label>
                            <input
                                type="text"
                                placeholder="Buscar materia por nombre o código..."
                                value={materiaSearch}
                                onChange={handleMateriaSearchChange}
                                onFocus={() => setShowMateriaDropdown(true)}
                                onBlur={() => setTimeout(() => setShowMateriaDropdown(false), 200)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-md focus:ring-2 focus:ring-navy/5 focus:border-navy transition-all outline-none"
                            />
                            {showMateriaDropdown && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-100 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    <div 
                                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-500 font-bold"
                                        onClick={() => { setFormData(prev => ({ ...prev, materia: '' })); setMateriaSearch(''); }}
                                    >
                                        No especificar materia
                                    </div>
                                    {filteredMaterias.length > 0 ? filteredMaterias.map(m => (
                                        <div 
                                            key={m.codigo} 
                                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer font-bold text-navy text-sm border-t border-slate-50"
                                            onClick={() => handleSelectMateria(m)}
                                        >
                                            <span className="text-navy/40 text-[10px] mr-2 uppercase tracking-wider">{m.codigo}</span>
                                            {m.nombre}
                                        </div>
                                    )) : (
                                        <div className="px-4 py-3 text-sm text-slate-400 font-medium">No se encontraron materias</div>
                                    )}
                                </div>
                            )}
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
            </Tarjeta>
        </div>
    );
};

export default ReportarIncidencia;
