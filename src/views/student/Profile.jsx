import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ShieldCheck, GraduationCap, Award, UserCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext.jsx';

const Profile = () => {
    const { user, logout } = useUser();

    const isStudent = user?.rol === 'estudiante';

    const profileFields = [
        { label: 'Nombre', value: user?.nombre_completo, icon: User },
        { label: 'Correo Electrónico', value: user?.correo, icon: Mail },
        { label: 'Teléfono', value: user?.telefono, icon: Phone },
        {
            label: 'Rol',
            value: user?.rol === 'estudiante' ? 'Estudiante' :
                user?.rol === 'docente' ? 'Docente' :
                    user?.rol === 'tutor' ? 'Tutor' : 'Institucional',
            icon: Award
        },
    ];

    if (isStudent) {
        profileFields.push(
            { label: 'Matrícula', value: user?.n_control, icon: ShieldCheck },
            { label: 'Carrera', value: user?.carrera, icon: GraduationCap }
        );
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-navy/5 rounded-2xl text-navy">
                        <UserCircle size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-navy uppercase tracking-tight">Mi Perfil</h1>
                </div>
                <div className="flex items-center gap-3 px-6 py-2 bg-gray-50 rounded-full border border-gray-100">
                    <span className="text-sm font-bold text-navy opacity-80">{user?.nombre_completo}</span>
                    <span className="px-3 py-0.5 bg-navy text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                        {user?.rol === 'estudiante' ? 'Estudiante' :
                            user?.rol === 'docente' ? 'Docente' :
                                user?.rol === 'tutor' ? 'Tutor' : 'Personal'}
                    </span>
                    <button
                        onClick={logout}
                        className="ml-4 text-xs font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Profile Content Card */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-navy uppercase tracking-tight mb-8 border-l-4 border-gold pl-4">
                        Información Personal
                    </h2>

                    <div className="space-y-6">
                        {profileFields.map((field, idx) => (
                            <div key={idx} className="space-y-2">
                                <label className="text-[11px] font-black text-navy/40 uppercase tracking-[0.2em] ml-1">
                                    {field.label}
                                </label>
                                <div className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 text-navy font-bold flex items-center gap-4 group hover:border-navy/20 transition-all">
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

export default Profile;
