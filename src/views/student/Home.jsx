import React from 'react';
import {
    BarChart3,
    BookOpen,
    MessageCircle,
    Calendar,
    ChevronRight,
    Trophy,
    Target,
    Clock,
    Sparkles
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="glass-card" style={{
        flex: 1,
        minWidth: '240px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `4px solid ${color}`
    }}>
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
            <Icon size={100} color={color} />
        </div>

        <div style={{
            backgroundColor: `${color}15`,
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
        }}>
            <Icon size={24} />
        </div>

        <div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>{label}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>{value}</h3>
                {trend && (
                    <span style={{
                        fontSize: '0.85rem',
                        color: 'var(--success)',
                        fontWeight: '600',
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '6px'
                    }}>
                        {trend}
                    </span>
                )}
            </div>
        </div>
    </div>
);

const Home = ({ user }) => {
    const events = [
        { title: 'Inscripción de materias (AGO-DIC)', date: 'Próximo Lunes', type: 'Académico', color: 'var(--secondary)' },
        { title: 'Conferencia: Inteligencia Artificial en Ingeniería', date: 'Mañana, 10:00 AM', type: 'Evento', color: 'var(--primary)' },
        { title: 'Cierre de captura de calificaciones', date: 'Viernes 13', type: 'Importante', color: 'var(--error)' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* WELCOME SECTION */}
            <div className="glass-card" style={{ padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(27, 57, 106, 0.2) 0%, rgba(179, 142, 93, 0.1) 100%)' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <Sparkles size={20} color="var(--secondary)" />
                        <span style={{ color: 'var(--secondary)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Portal del Estudiante</span>
                    </div>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                        ¡Hola, {user.name.split(' ')[0]}!
                    </h1>
                    <p style={{ color: 'var(--text-dim)', marginTop: '8px', fontSize: '1.1rem' }}>
                        Bienvenido a tu panel de tutorías. Aquí tienes un resumen de tu progreso.
                    </p>
                </div>
                <div style={{ textAlign: 'right', display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>N° DE CONTROL</p>
                    <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white' }}>{user.controlNumber}</p>
                </div>
            </div>

            {/* KEY STATS */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <StatCard
                    icon={Trophy}
                    label="Promedio Acumulado"
                    value="8.8"
                    color="var(--secondary)"
                    trend="+0.3"
                />
                <StatCard
                    icon={Target}
                    label="Progreso de Carrera"
                    value={`${user.progress}%`}
                    color="var(--primary)"
                />
                <StatCard
                    icon={MessageCircle}
                    label="Mensajes del Tutor"
                    value="3"
                    color="#06b6d4"
                />
                <StatCard
                    icon={Clock}
                    label="Horas de Tutoría"
                    value="12h"
                    color="var(--success)"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {/* UPCOMING EVENTS */}
                <div className="glass-card" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>Agenda Académica</h3>
                        <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>Ver todo</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {events.map((event, i) => (
                            <div key={i} style={{
                                padding: '20px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'transform 0.2s',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                        background: `${event.color}20`,
                                        color: event.color,
                                        marginBottom: '10px',
                                        display: 'inline-block',
                                        fontWeight: '700',
                                        border: `1px solid ${event.color}40`
                                    }}>{event.type}</span>
                                    <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'white' }}>{event.title}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={14} /> {event.date}
                                    </p>
                                </div>
                                <ChevronRight size={20} color="var(--text-dim)" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* SCHOOL INFO */}
                <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>Información Escolar</h3>

                    <div style={{
                        padding: '24px',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '20px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Carrera</p>
                            <p style={{ fontWeight: '600', color: 'white', marginTop: '4px' }}>{user.career}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Semestre</p>
                            <p style={{ fontWeight: '600', color: 'white', marginTop: '4px' }}>{user.semester}° Semestre</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Estatus</p>
                            <p style={{ fontWeight: '600', color: 'var(--success)', marginTop: '4px' }}>Alumno Regular</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Plan</p>
                            <p style={{ fontWeight: '600', color: 'white', marginTop: '4px' }}>ISIC-2010-210</p>
                        </div>
                    </div>

                    <div style={{
                        padding: '20px',
                        background: 'rgba(179, 142, 93, 0.1)',
                        border: '1px dashed var(--secondary)',
                        borderRadius: '16px',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start'
                    }}>
                        <Sparkles size={20} color="var(--secondary)" />
                        <p style={{ fontSize: '0.9rem', color: 'white', lineHeight: '1.5' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>Aviso:</span> Tu tutor ha programado una sesión de seguimiento para el próximo miércoles a las 11:00 AM.
                        </p>
                    </div>

                    <button className="btn-primary" style={{ marginTop: 'auto', width: '100%' }}>
                        Solicitar Tutoría
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
