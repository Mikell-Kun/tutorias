import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, GraduationCap, Briefcase, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import { validateCredentials } from '../data/database.js';

const Login = () => {
    const [selectedRole, setSelectedRole] = useState('estudiante');
    const [nControl, setNControl] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useUser();
    const navigate = useNavigate();

    const roles = [
        { id: 'estudiante', label: 'Estudiantes' },
        { id: 'docente', label: 'Docentes' },
        { id: 'tutor', label: 'Tutores' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Simulation delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const validatedUser = validateCredentials(nControl, password);

        if (validatedUser && validatedUser.rol === selectedRole) {
            login({
                n_control: validatedUser.n_control.toString(),
                role: validatedUser.rol === 'estudiante' ? 'student' : validatedUser.rol === 'docente' ? 'teacher' : 'tutor',
                nombre_completo: validatedUser.nombre_completo,
                carrera: validatedUser.carrera || validatedUser.departamento || validatedUser.area
            });
            navigate('/');
        } else {
            setError(validatedUser ? `Este usuario no tiene el rol de ${selectedRole}` : 'Número de control o contraseña incorrectos');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-modern-institutional min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="login-card"
            >
                {/* Institutional Header - Side-by-Side Logo & Text */}
                <div className="institutional-header">
                    <div className="flex justify-center items-center gap-5 mb-10">
                        <div className="w-12 h-12 bg-white text-navy border-2 border-navy/10 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            <ShieldCheck size={28} />
                        </div>
                        <div className="text-left border-l-2 border-navy/10 pl-5">
                            <div className="text-[10px] font-extrabold text-[#111] uppercase leading-tight tracking-[0.2em]">Tecnológico</div>
                            <div className="text-[10px] font-extrabold text-[#111] uppercase leading-tight tracking-[0.2em]">Nacional de México®</div>
                        </div>
                    </div>

                    <h2 className="text-[22px] font-black text-navy uppercase tracking-tight text-center">
                        Servicio de tutorías "Mexicali"
                    </h2>
                    <h3 className="text-[11px] font-bold text-navy/40 tracking-[0.4em] text-center mt-2 uppercase">
                        {selectedRole === 'estudiante' ? 'Acceso Estudiantes' : selectedRole === 'tutor' ? 'Acceso Tutores' : 'Acceso Docentes'}
                    </h3>
                </div>

                <div className="login-card-content">
                    <div className="form-container">
                        {/* Modern Tabs - Spaced */}
                        <div className="modern-tabs">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                    className={`modern-tab ${selectedRole === role.id ? 'active' : ''}`}
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="p-3.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-4">
                                <label className="label-formal">Número de Control</label>
                                <input
                                    type="text"
                                    value={nControl}
                                    onChange={(e) => setNControl(e.target.value)}
                                    className="input-formal-modern"
                                    placeholder="Ingresa tu número"
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="label-formal">Contraseña</label>
                                <div className="password-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-formal-modern"
                                        style={{ paddingRight: '54px' }}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="password-toggle"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-institutional-modern flex items-center justify-center h-[56px]"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <span className="uppercase tracking-widest text-[13px]">Iniciar sesión</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
