import React from 'react';
import {
    Mail,
    Phone,
    Hash,
    Briefcase,
    Calendar,
    MapPin,
    GraduationCap,
    Camera,
    Shield,
    Edit2,
    Settings
} from 'lucide-react';

const ProfileField = ({ icon: Icon, label, value }) => (
    <div style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
        borderBottom: '1px solid var(--glass-border)',
        alignItems: 'center'
    }}>
        <div style={{ color: 'var(--secondary)', background: 'rgba(179, 142, 93, 0.1)', padding: '10px', borderRadius: '10px' }}>
            <Icon size={20} />
        </div>
        <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
            <p style={{ fontSize: '1rem', fontWeight: '500', marginTop: '4px', color: 'white' }}>{value}</p>
        </div>
    </div>
);

const Profile = ({ user }) => {
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Mi Perfil</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings size={18} /> Configuración
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Edit2 size={18} /> Editar Perfil
                    </button>
                </div>
            </div>

            {/* HEADER CARD */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <div style={{
                    height: '180px',
                    background: 'linear-gradient(135deg, var(--primary) 0%, #234E8C 100%)',
                    position: 'relative',
                    opacity: 0.9
                }}>
                    <div style={{
                        position: 'absolute',
                        bottom: '-50px',
                        left: '40px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '24px'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '140px',
                                height: '140px',
                                borderRadius: '24px',
                                background: 'linear-gradient(135deg, var(--secondary) 0%, #85643a 100%)',
                                border: '6px solid var(--bg-dark)',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                fontSize: '4rem',
                                color: 'white',
                                fontWeight: 'bold'
                            }}>
                                <span style={{ margin: 'auto' }}>{user.name.charAt(0)}</span>
                            </div>
                            <div style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                width: '36px',
                                height: '36px',
                                backgroundColor: 'var(--primary)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '3px solid var(--bg-dark)',
                                cursor: 'pointer',
                                color: 'white'
                            }}>
                                <Camera size={16} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{user.name}</h2>
                            <p style={{ color: 'var(--secondary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                                <GraduationCap size={18} /> {user.career}
                            </p>
                        </div>
                    </div>
                </div>
                <div style={{ padding: '70px 40px 30px' }}>
                    <div style={{ display: 'flex', gap: '40px', color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                        <div><strong style={{ color: 'white' }}>5to</strong> Semestre</div>
                        <div><strong style={{ color: 'white' }}>8.8</strong> Promedio</div>
                        <div><strong style={{ color: 'white' }}>Regular</strong> Estatus</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {/* ACADEMIC INFO */}
                <div className="glass-card" style={{ padding: '0' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Datos Académicos</h3>
                    </div>
                    <ProfileField icon={Hash} label="Número de Control" value={user.controlNumber} />
                    <ProfileField icon={Briefcase} label="Plan de Estudios" value="ISIC-2010-210" />
                    <ProfileField icon={Shield} label="Seguro Facultativo" value="Vigente" />
                    <ProfileField icon={Calendar} label="Fecha de Ingreso" value="Agosto 2021" />
                </div>

                {/* CONTACT INFO */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '0' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Información de Contacto</h3>
                        </div>
                        <ProfileField icon={Mail} label="Correo Institucional" value={user.email} />
                        <ProfileField icon={Phone} label="Teléfono" value={user.phone} />
                        <ProfileField icon={MapPin} label="Campus" value="Col. Tecnológico - Edificio Administrativo" />
                    </div>

                    <div className="glass-card" style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px dashed var(--glass-border)',
                        textAlign: 'center',
                        padding: '24px',
                        borderRadius: '20px'
                    }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                            <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Nota:</span> Para cambios en datos oficiales (CURP, Nombre o RFC), favor de solicitar trámite en Ventanilla Virtual o Servicios Escolares.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
