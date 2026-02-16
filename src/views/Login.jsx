import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { User, GraduationCap, Users, ArrowLeft, Lock, Hash } from 'lucide-react';

const Login = () => {
    const { login } = useUser();
    const [selectedRole, setSelectedRole] = useState(null);
    const [credentials, setCredentials] = useState({ controlNumber: '', password: '' });
    const [error, setError] = useState('');

    const roles = [
        { id: 'student', label: 'Estudiante', icon: GraduationCap, color: '#B38E5D' },
        { id: 'teacher', label: 'Docente', icon: User, color: '#1B396A' },
        { id: 'tutor', label: 'Tutor', icon: Users, color: '#06b6d4' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        try {
            login(selectedRole, credentials);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleBack = () => {
        setSelectedRole(null);
        setError('');
        setCredentials({ controlNumber: '', password: '' });
    };

    if (!selectedRole) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '40px',
                padding: '20px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '10px' }}>TutorApp</h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>SISTEMA DE TUTORÍAS RECONSTRUIDO</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '24px',
                    width: '100%',
                    maxWidth: '850px'
                }}>
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className="glass-card"
                            onClick={() => setSelectedRole(role.id)}
                            style={{
                                padding: '40px 30px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '20px'
                            }}
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                border: `1px solid ${role.color}33`,
                                color: role.color
                            }}>
                                <role.icon size={40} style={{ margin: 'auto' }} />
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: 'white' }}>{role.label}</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Ingresar como {role.label}</p>
                        </div>
                    ))}
                </div>

                <p style={{ color: 'var(--text-dim)', fontSize: '1rem', marginTop: '20px' }}>Tecnológico Nacional de México</p>
            </div>
        );
    }

    const currentRole = roles.find(r => r.id === selectedRole);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="glass-card" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '40px',
                position: 'relative'
            }}>
                <button
                    onClick={handleBack}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-dim)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    <ArrowLeft size={18} /> Volver
                </button>

                <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '10px' }}>
                    <div style={{ color: currentRole.color, marginBottom: '15px' }}>
                        <currentRole.icon size={48} style={{ margin: 'auto' }} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px' }}>
                        Acceso {currentRole.label}
                    </h2>
                    <p style={{ color: 'var(--text-dim)' }}>Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {selectedRole === 'student' ? (
                        <div>
                            <label><Hash size={14} style={{ marginRight: '5px' }} /> Número de Control</label>
                            <input
                                type="text"
                                placeholder="Ej: 20491199"
                                value={credentials.controlNumber}
                                onChange={(e) => setCredentials({ ...credentials, controlNumber: e.target.value })}
                                required
                            />
                        </div>
                    ) : (
                        <div>
                            <label><User size={14} style={{ marginRight: '5px' }} /> Usuario / Correo</label>
                            <input
                                type="text"
                                placeholder="Ingresa tu identificación"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label><Lock size={14} style={{ marginRight: '5px' }} /> Contraseña</label>
                        <input
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>

                    {error && (
                        <p style={{ color: 'var(--error)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>
                    )}

                    <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                        Iniciar Sesión
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                        &copy; 2026 TutorApp - TecNM
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
