import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ShieldCheck, GraduationCap, Award, UserCircle, Calendar, Edit2, Save, X, Key } from 'lucide-react';
import { useUser } from '../../context/ContextoUsuario.jsx';
import { updateUser } from '../../data/database.js';

const Perfil = () => {
    const { user, updateSession } = useUser();
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const isStudent = user?.rol === 'estudiante';
    const isTeacher = user?.rol === 'docente';
    const isTutor = user?.rol === 'tutor';

    useEffect(() => {
        if (user && !editMode) {
             setFormData({
                 nombre_completo: user.nombre_completo || '',
                 correo: user.correo || '',
                 telefono: user.telefono || '',
                 fecha_nacimiento: user.fecha_nacimiento ? user.fecha_nacimiento.substring(0, 10) : '',
                 semestre: user.semestre || '',
                 departamento: user.departamento || '',
                 contrasena: ''
             });
        }
    }, [user, editMode]);

    const handleSave = async () => {
        const confirmed = window.confirm('¿Estás seguro de que deseas guardar estos cambios en tu perfil?');
        if (!confirmed) return;

        setIsSaving(true);
        const dataToSave = { ...formData, rol: user.rol };
        if (isStudent) {
            delete dataToSave.departamento;
        } else {
             delete dataToSave.fecha_nacimiento;
             delete dataToSave.semestre;
        }
        if (!dataToSave.contrasena) {
             delete dataToSave.contrasena;
        }

        const success = await updateUser(user.n_control || user.id_tutor, dataToSave);
        if (success) {
            updateSession({ ...user, ...dataToSave });
            setEditMode(false);
        } else {
            alert('Ocurrió un error al guardar tu perfil. Inténtalo más tarde.');
        }
        setIsSaving(false);
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const profileFields = [
        { label: 'Nombre Completo', value: user?.nombre_completo, name: 'nombre_completo', icon: User, editable: true, type: 'text' },
        { label: 'Correo Electrónico', value: user?.correo, name: 'correo', icon: Mail, editable: true, type: 'email' },
        { label: 'Teléfono de Contacto', value: user?.telefono, name: 'telefono', icon: Phone, editable: true, type: 'text' },
        { label: 'Contraseña (Actualizar)', value: '********', name: 'contrasena', icon: Key, editable: true, type: 'password'}
    ];

    if (isStudent) {
        profileFields.push(
            { label: 'Fecha de Nacimiento', value: user?.fecha_nacimiento?.substring(0, 10), name: 'fecha_nacimiento', icon: Calendar, editable: true, type: 'date' },
            { label: 'Semestre', value: user?.semestre, name: 'semestre', icon: GraduationCap, editable: true, type: 'text' }
        );
    } else if (isTeacher || isTutor) {
        profileFields.push(
             { label: 'Departamento', value: user?.departamento, name: 'departamento', icon: GraduationCap, editable: true, type: 'text' }
        );
    }

    // Uneditable system fields
    profileFields.push({
        label: 'Rol Institucional',
        value: isStudent ? 'Estudiante' : isTeacher ? 'Docente' : isTutor ? 'Tutor' : 'Personal',
        icon: Award, editable: false
    });

    if (isStudent) {
        profileFields.push(
            { label: 'Estatus', value: user?.estatus, icon: Award, editable: false },
            { label: 'Matrícula', value: user?.n_control, icon: ShieldCheck, editable: false },
            { label: 'Carrera', value: user?.carrera, icon: GraduationCap, editable: false }
        );
    } else if (isTeacher) {
        profileFields.push(
            { label: 'Número de Control', value: user?.n_control, icon: ShieldCheck, editable: false }
        );
    } else if (isTutor) {
        profileFields.push(
            { label: 'ID de Tutor', value: user?.id_tutor, icon: ShieldCheck, editable: false }
        );
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col items-center justify-center mb-10 text-center">
                <div className="p-4 bg-navy/5 rounded-lg text-navy mb-4">
                    <UserCircle size={48} />
                </div>
                <h1 className="text-4xl font-black text-navy uppercase tracking-tight">Mi Perfil</h1>
                <p className="text-sm font-bold text-navy/40 uppercase tracking-[0.3em] mt-2">
                    Información de Cuenta
                </p>
            </div>

            {/* Perfil Content Tarjeta */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl p-10 shadow-sm border border-slate-100">
                    <div className="flex flex-wrap gap-4 justify-between items-center mb-8 border-b border-slate-100 pb-4">
                        <h2 className="text-xl font-black text-navy uppercase tracking-tight border-l-4 border-gold pl-4 m-0">
                            Información Personal
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {!editMode ? (
                                <button onClick={() => setEditMode(true)} className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg font-bold text-[10px] sm:text-xs hover:bg-navy/90 transition-colors uppercase tracking-widest shadow-lg shadow-navy/20">
                                    <Edit2 size={16} /> Editar Perfil
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => setEditMode(false)} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-[10px] sm:text-xs hover:bg-red-100 transition-colors uppercase tracking-widest">
                                        <X size={16} /> Cancelar
                                    </button>
                                    <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg font-bold text-[10px] sm:text-xs hover:brightness-110 transition-colors uppercase tracking-widest shadow-lg shadow-gold/20">
                                        <Save size={16} /> {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profileFields.map((field, idx) => (
                            <div key={idx} className={`space-y-2 ${field.editable && editMode ? 'p-1 bg-gold/5 rounded-xl border border-gold/20' : ''} transition-all`}>
                                <label className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em] ml-1">
                                    {field.label}
                                </label>
                                <div className={`w-full p-4 rounded-lg text-navy font-bold flex items-center gap-4 group transition-all ${editMode && field.editable ? 'bg-white border-2 border-gold outline-none shadow-sm' : 'bg-slate-50 border border-slate-100 hover:border-navy/20'}`}>
                                    <field.icon size={20} className="text-navy/20 group-hover:text-navy transition-colors shrink-0" />
                                    
                                    {editMode && field.editable ? (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleChange}
                                            className="bg-transparent border-0 outline-none w-full text-navy font-bold placeholder-navy/20 appearance-none"
                                            placeholder={`Ingresa ${field.label.toLowerCase()}`}
                                        />
                                    ) : (
                                        <span className="truncate">{field.value ? field.value : 'No proporcionado'}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
