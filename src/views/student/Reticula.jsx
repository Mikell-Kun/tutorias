import React from 'react';
import {
    BookMarked,
    GraduationCap,
    BarChart2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Info,
    ChevronDown
} from 'lucide-react';

const ReticulaItem = ({ icon: Icon, label, value, color }) => (
    <div className="glass-card" style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '24px',
        borderLeft: `4px solid ${color}`
    }}>
        <div style={{ backgroundColor: `${color}15`, padding: '12px', borderRadius: '12px', color: color }}>
            <Icon size={24} />
        </div>
        <div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: '500' }}>{label}</p>
            <h4 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white' }}>{value}</h4>
        </div>
    </div>
);

const SubjectCard = ({ code, credits, title, status }) => {
    const statusConfig = {
        'Aprobado': { color: 'var(--success)', icon: CheckCircle2 },
        'En Curso': { color: '#3B82F6', icon: Clock },
        'Reprobado': { color: 'var(--error)', icon: AlertCircle },
        'Pendiente': { color: 'var(--text-dim)', icon: Info }
    };

    const config = statusConfig[status] || statusConfig['Pendiente'];
    const StatusIcon = config.icon;

    return (
        <div className="glass-card" style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--glass-border)',
            transition: 'transform 0.2s, border-color 0.2s',
            cursor: 'default'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = config.color;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '700', letterSpacing: '0.5px' }}>
                    {code} • {credits} CR
                </span>
                <span style={{
                    fontSize: '0.7rem',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: `${config.color}15`,
                    color: config.color,
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: `1px solid ${config.color}30`
                }}>
                    <StatusIcon size={12} />
                    {status.toUpperCase()}
                </span>
            </div>
            <h5 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', lineHeight: '1.4' }}>{title}</h5>
        </div>
    );
};

const Reticula = ({ user }) => {
    const semesters = [
        {
            num: 1,
            cycle: 'AGO-DIC 2024',
            subjects: [
                { code: 'ACF-0901', credits: 5, title: 'Cálculo Diferencial', status: 'Aprobado' },
                { code: 'AED-1285', credits: 5, title: 'Fundamentos de Programación', status: 'Aprobado' },
                { code: 'ACA-0907', credits: 4, title: 'Taller de Ética', status: 'Aprobado' },
                { code: 'ACC-0906', credits: 4, title: 'Fundamentos de Investigación', status: 'Aprobado' },
            ]
        },
        {
            num: 2,
            cycle: 'FEB-JUN 2025',
            subjects: [
                { code: 'ACF-0902', credits: 5, title: 'Cálculo Integral', status: 'Aprobado' },
                { code: 'AED-1286', credits: 5, title: 'Programación Orientada a Objetos', status: 'En Curso' },
                { code: 'AEC-1008', credits: 4, title: 'Contabilidad Financiera', status: 'Aprobado' },
                { code: 'AEC-1058', credits: 4, title: 'Química', status: 'Pendiente' },
            ]
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Avance Reticular</h1>
                    <p style={{ color: 'var(--text-dim)', marginTop: '4px', fontSize: '1.1rem' }}>Seguimiento detallado de carga académica y créditos</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-secondary">Exportar PDF</button>
                    <button className="btn-primary">Kardex Completo</button>
                </div>
            </div>

            {/* OVERALL PROGRESS */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <ReticulaItem icon={BookMarked} label="Materias Aprobadas" value="12" color="var(--primary)" />
                <ReticulaItem icon={GraduationCap} label="Créditos Obtenidos" value={`63 / 260`} color="var(--secondary)" />
                <ReticulaItem icon={BarChart2} label="Progreso Total" value={`${user.progress}%`} color="var(--success)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', marginTop: '10px' }}>
                {semesters.map(sem => (
                    <div key={sem.num}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '24px',
                            paddingBottom: '16px',
                            borderBottom: '1px solid var(--glass-border)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: 'var(--secondary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    {sem.num}
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white' }}>Semestre {sem.num}</h3>
                                <span style={{
                                    fontSize: '0.85rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    color: 'var(--text-dim)',
                                    fontWeight: '600',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    {sem.cycle}
                                </span>
                            </div>
                            <ChevronDown size={20} color="var(--text-dim)" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                            {sem.subjects.map((s, i) => <SubjectCard key={i} {...s} />)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-card" style={{
                padding: '24px',
                background: 'rgba(179, 142, 93, 0.05)',
                border: '1px dashed var(--secondary)',
                marginTop: '20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
            }}>
                <div style={{ color: 'var(--secondary)' }}>
                    <AlertCircle size={28} />
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>Nota:</span> Recuerda que para la reinscripción al siguiente semestre debes tener liberados tus créditos complementarios y no adeudar más de 2 materias.
                </p>
            </div>
        </div>
    );
};

export default Reticula;
