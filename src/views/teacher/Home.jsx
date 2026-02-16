import React from 'react';
import {
    Users,
    MessageSquare,
    Calendar,
    FileText,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Clock,
    UserCheck,
    BarChart3
} from 'lucide-react';

const TeacherStat = ({ icon: Icon, label, value, color }) => (
    <div className="glass-card" style={{
        flex: 1,
        minWidth: '220px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        borderLeft: `4px solid ${color}`
    }}>
        <div style={{ background: `${color}15`, padding: '12px', borderRadius: '12px', color: color }}>
            <Icon size={24} />
        </div>
        <div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: '500' }}>{label}</p>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{value}</h4>
        </div>
    </div>
);

const TeacherHome = ({ user }) => {
    const pendingTutories = [
        { student: 'Ana Martínez', control: '20491122', reason: 'Bajo rendimiento', time: 'Hoy 4:00 PM', status: 'Urgent' },
        { student: 'Carlos Ruiz', control: '20491185', reason: 'Seguimiento', time: 'Mañana 11:30 AM', status: 'Normal' },
        { student: 'Sofía López', control: '20491190', reason: 'Duda académica', time: '18 Feb, 1:00 PM', status: 'Normal' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* WELCOME SECTION */}
            <div className="glass-card" style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(27, 57, 106, 0.3) 0%, rgba(179, 142, 93, 0.1) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <UserCheck size={20} color="var(--secondary)" />
                    <span style={{ color: 'var(--secondary)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Panel de Docente</span>
                </div>
                <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                    ¡Bienvenido, {user.name.split(' ')[1]}!
                </h1>
                <p style={{ color: 'var(--text-dim)', marginTop: '8px', fontSize: '1.1rem' }}>
                    Tienes {pendingTutories.length} tutorías programadas para esta semana.
                </p>
            </div>

            {/* KEY METRICS */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <TeacherStat icon={Users} label="Total Alumnos" value="42" color="var(--primary)" />
                <TeacherStat icon={CheckCircle2} label="Tutorías Realizadas" value="15" color="var(--success)" />
                <TeacherStat icon={Clock} label="Pendientes" value="3" color="var(--secondary)" />
                <TeacherStat icon={BarChart3} label="Promedio Grupal" value="8.5" color="#8b5cf6" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                {/* PENDING SESSIONS */}
                <div className="glass-card" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>Sesiones de Tutoría</h3>
                        <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>Gestionar</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {pendingTutories.map((session, i) => (
                            <div key={i} style={{
                                padding: '20px',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '12px',
                                        background: session.status === 'Urgent' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(27, 57, 106, 0.1)',
                                        color: session.status === 'Urgent' ? 'var(--error)' : 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Users size={22} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'white' }}>{session.student}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{session.reason} • {session.control}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.9rem', color: 'white', fontWeight: '600' }}>{session.time}</p>
                                    <span style={{ fontSize: '0.75rem', color: session.status === 'Urgent' ? 'var(--error)' : 'var(--success)', fontWeight: '700' }}>
                                        {session.status === 'Urgent' ? 'Prioridad Alta' : 'Programada'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>Acciones Rápidas</h3>

                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                        <FileText size={20} /> Generar Reporte Mensual
                    </button>

                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                        <Calendar size={20} /> Agendar Nueva Sesión
                    </button>

                    <div style={{ marginTop: 'auto', padding: '24px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                        <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={18} color="var(--secondary)" /> Recordatorio
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                            Tienes hasta el viernes para subir las actas de resultados de las tutorías del primer parcial.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherHome;
