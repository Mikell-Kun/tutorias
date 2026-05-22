import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/ContextoUsuario.jsx';
import { validateCredentials, registerUser } from '../data/database.js';

// Componente principal para el inicio de sesión y registro del sistema de tutorías.
// Gestiona el formulario, validación de campos, animaciones y redirección al panel correspondiente.
const IniciarSesion = () => {
    const [selectedRole, setSelectedRole] = useState('estudiante');
    const [isLoginMode, setIsLoginMode] = useState(true);

    // Estados para almacenar la información de los inputs
    const [nControl, setNControl] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Estados adicionales para el modo registro
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [correo, setCorreo] = useState('');
    const [roleKey, setRoleKey] = useState(''); // clave de seguridad (docentes/tutores)
    
    // Estados de control de estado/UI
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estado para el modal de éxito con ID autogenerado
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [generatedId, setGeneratedId] = useState('');
    
    const { login } = useUser();
    const navigate = useNavigate();

    const roles = [
        { id: 'estudiante', label: 'Estudiantes' },
        { id: 'docente', label: 'Docentes' },
        { id: 'tutor', label: 'Tutores' },
    ];

    // Cambia el rol actual limpiando los formularios
    const handleRoleChange = (roleId) => {
        setSelectedRole(roleId);
        setError('');
        setSuccessMessage('');
        setNControl('');
        setPassword('');
        setNombreCompleto('');
        setCorreo('');
        setRoleKey('');
    };

    // Cambia entre modo Login y Registro limpiando formularios
    const handleModeSwitch = () => {
        setIsLoginMode(!isLoginMode);
        setError('');
        setSuccessMessage('');
        setNControl('');
        setPassword('');
        setNombreCompleto('');
        setCorreo('');
        setRoleKey('');
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true);

        // Pequeña pausa visual simulando carga
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            if (isLoginMode) {
                // Modo Inicio de Sesión
                const validatedUser = await validateCredentials(
                    nControl, 
                    password, 
                    selectedRole, 
                    (selectedRole === 'docente' || selectedRole === 'tutor') ? roleKey : null
                );

                if (validatedUser && validatedUser.rol === selectedRole) {
                    login({
                        ...validatedUser,
                        name: validatedUser.nombre_completo,
                        role: validatedUser.rol === 'estudiante' ? 'student' : validatedUser.rol === 'docente' ? 'teacher' : 'tutor'
                    });
                    navigate('/');
                } else {
                    setError(validatedUser ? `Este usuario no tiene el rol de ${selectedRole}` : 'Credenciales o clave de seguridad incorrectas');
                    setIsSubmitting(false);
                }
            } else {
                // Modo Registro
                const registerPayload = {
                    rol: selectedRole,
                    nombreCompleto,
                    correo,
                    contrasena: password,
                    ...(selectedRole === 'estudiante' ? { nControl } : { roleKey })
                };

                const result = await registerUser(registerPayload);

                if (selectedRole === 'estudiante') {
                    setSuccessMessage(`¡Estudiante registrado exitosamente! Ya puedes iniciar sesión.`);
                    setIsLoginMode(true);
                    setNControl(nControl);
                    setPassword('');
                    setIsSubmitting(false);
                } else {
                    // Para docente o tutor, guardamos el ID autogenerado para mostrar en modal
                    setGeneratedId(result.n_control);
                    setShowSuccessModal(true);
                    setIsSubmitting(false);
                }
            }
        } catch (err) {
            setError(err.message || 'Ocurrió un error al procesar la solicitud');
            setIsSubmitting(false);
        }
    };

    // Renderiza dinámicamente los campos necesarios según el rol y modo
    const renderFields = () => {
        return (
            <div className="space-y-6">
                {!isLoginMode && (
                    <div className="space-y-2">
                        <label className="label-formal">Nombre Completo</label>
                        <input
                            type="text"
                            value={nombreCompleto}
                            onChange={(e) => setNombreCompleto(e.target.value)}
                            className="input-formal-modern"
                            placeholder="Ingresa tu nombre completo"
                            required
                        />
                    </div>
                )}

                {!isLoginMode && (
                    <div className="space-y-2">
                        <label className="label-formal">Correo Electrónico</label>
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            className="input-formal-modern"
                            placeholder="ejemplo@itm.mx"
                            required
                        />
                    </div>
                )}

                {(isLoginMode || selectedRole === 'estudiante') && (
                    <div className="space-y-2">
                        <label className="label-formal">
                            {selectedRole === 'estudiante' ? 'Número de Control' : 'ID / Número de Control'}
                        </label>
                        <input
                            type="text"
                            value={nControl}
                            onChange={(e) => setNControl(e.target.value.replace(/\D/g, ''))}
                            className="input-formal-modern"
                            placeholder={selectedRole === 'estudiante' ? "Ej. 20491199" : "Ingresa tu ID de acceso"}
                            required
                        />
                    </div>
                )}

                {selectedRole !== 'estudiante' && (
                    <div className="space-y-2">
                        <label className="label-formal">Clave de Seguridad de Rol</label>
                        <input
                            type="password"
                            value={roleKey}
                            onChange={(e) => setRoleKey(e.target.value)}
                            className="input-formal-modern"
                            placeholder="Clave de validación"
                            required
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="label-formal">Contraseña</label>
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
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
            </div>
        );
    };

    return (
        <div className="bg-modern-institutional min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="login-card"
            >
                {/* Institutional Header */}
                <div className="institutional-header">
                    <div className="flex justify-center items-center gap-5 mb-10">
                        <div className="w-12 h-12 bg-white text-navy border-2 border-navy/10 rounded-md flex items-center justify-center shadow-sm shrink-0">
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
                        {isLoginMode ? 'Acceso' : 'Registro'} {selectedRole === 'estudiante' ? 'Estudiantes' : selectedRole === 'tutor' ? 'Tutores' : 'Docentes'}
                    </h3>
                </div>

                <div className="login-card-content">
                    <div className="form-container">
                        {/* Modern Tabs */}
                        <div className="modern-tabs">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => handleRoleChange(role.id)}
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
                                        className="p-3.5 rounded-md bg-red-50 text-red-600 text-xs font-bold text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                                {successMessage && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="p-3.5 rounded-md bg-green-50 text-green-700 text-xs font-bold text-center"
                                    >
                                        {successMessage}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {renderFields()}

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-institutional-modern flex items-center justify-center h-[56px]"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <span className="uppercase tracking-widest text-[13px]">
                                            {isLoginMode ? 'Iniciar sesión' : 'Registrarse'}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-8">
                            <button
                                type="button"
                                onClick={handleModeSwitch}
                                className="text-xs font-bold text-navy hover:underline cursor-pointer"
                            >
                                {isLoginMode 
                                    ? '¿No tienes una cuenta? Regístrate aquí' 
                                    : '¿Ya tienes una cuenta? Inicia sesión'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Modal de Éxito con ID Autogenerado para Docentes/Tutores */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center"
                        >
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <ShieldCheck size={36} />
                            </div>
                            <h3 className="text-xl font-black text-navy uppercase tracking-tight mb-2">
                                ¡Registro Exitoso!
                            </h3>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                Tu cuenta de <strong className="capitalize">{selectedRole}</strong> ha sido creada. Se te ha asignado el siguiente ID de acceso:
                            </p>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 font-mono text-2xl font-black tracking-wider text-navy">
                                {generatedId}
                            </div>
                            <p className="text-xs text-red-500 font-bold mb-8">
                                * Guarda este número. Lo necesitarás para iniciar sesión junto con tu clave de seguridad y contraseña.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    setIsLoginMode(true);
                                    setNControl(generatedId.toString());
                                    setPassword('');
                                    setRoleKey('');
                                }}
                                className="btn-institutional-modern py-3.5"
                            >
                                Entendido, Ir al Login
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IniciarSesion;
