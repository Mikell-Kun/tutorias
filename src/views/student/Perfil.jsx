import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ShieldCheck, GraduationCap, Award, UserCircle } from 'lucide-react';
import { useUser } from '../../context/ContextoUsuario.jsx';

const Perfil = () => {
    const { user, logout } = useUser();

    const isStudent = user?.rol === 'estudiante';
    const isTeacher = user?.rol === 'docente';
    const isTutor = user?.rol === 'tutor';

    const profileFields = [
        { label: 'Nombre Completo', value: user?.nombre_completo, icon: User },
        { label: 'Correo Electrónico', value: user?.correo, icon: Mail },
        { label: 'Teléfono de Contacto', value: user?.telefono, icon: Phone },
        {
            label: 'Rol Institucional',
            value: user?.rol === 'estudiante' ? 'Estudiante' :
                user?.rol === 'docente' ? 'Docente' :
                    user?.rol === 'tutor' ? 'Tutor' : 'Personal',
            icon: Award
        },
    ];

    if (isStudent) {
        profileFields.push(
            { label: 'Matrícula', value: user?.n_control, icon: ShieldCheck },
            { label: 'Carrera', value: user?.carrera, icon: GraduationCap }
        );
    } else if (isTeacher) {
        profileFields.push(
            { label: 'Número de Control', value: user?.n_control, icon: ShieldCheck },
            { label: 'Departamento', value: user?.departamento, icon: GraduationCap }
        );
    } else if (isTutor) {
        profileFields.push(
            { label: 'ID de Tutor', value: user?.id_tutor, icon: ShieldCheck }
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
                    <h2 className="text-xl font-black text-navy uppercase tracking-tight mb-8 border-l-4 border-gold pl-4">
                        Información Personal
                    </h2>

                    <div className="space-y-6">
                        {profileFields.map((field, idx) => (
                            <div key={idx} className="space-y-2">
                                <label className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em] ml-1">
                                    {field.label}
                                </label>
                                <div className="w-full p-4 bg-slate-50 rounded-lg border border-slate-100 text-navy font-bold flex items-center gap-4 group hover:border-navy/20 transition-all">
                                    <field.icon size={20} className="text-navy/20 group-hover:text-navy transition-colors" />
                                    <span>{field.value || 'No proporcionado'}</span>
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
