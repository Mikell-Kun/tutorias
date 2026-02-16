import React from 'react';
import {
    Layout,
    Users,
    BarChart2,
    FileSpreadsheet,
    TrendingUp,
    ShieldCheck,
    AlertTriangle,
    Search,
    ChevronRight,
    Briefcase
} from 'lucide-react';

const TutorStat = ({ icon: Icon, label, value, color, description }) => (
    <div className="glass-card" style={{
        flex: 1,
        minWidth: '280px',
        padding: '30px',
        position: 'relative',
        overflow: 'hidden'
    }}>
        <div style={{ position: 'absolute', top: '-15px', right: '-15px', opacity: 0.1, color: color }}>
            <Icon size={100} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: `${color}20`, padding: '10px', borderRadius: '10px', color: color }}>
                    <Icon size={20} />
                </div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
            </div>
            <div>
                <h4 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'white' }}>{value}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>{description}</p>
            </div>
        </div>
    </div>
);

const TutorHome = ({ user }) => {
    const groups = [
        { name: '4° A - Sistemas', students: 35, performance: '82%', status: 'Stable' },
        { name: '5° B - Sistemas', students: 32, performance: '75%', status: 'Warning' },
        { name: '6° C - Informática', students: 28, performance: '88%', status: 'Excellent' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* HERO SECTION */}
            <div className="glass-card" style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(179, 142, 93, 0.2) 0%, rgba(27, 57, 106, 0.1) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <ShieldCheck size={20} color="var(--secondary)" />
                    <span style={{ color: 'var(--secondary)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Panel de Tutoría de Área</span>
                </div>
                <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                    Coordinación de Tutorías
                </h1>
                <p style={{ color: 'var(--text-dim)', marginTop: '8px', fontSize: '1.1rem' }}>
                    Mantenimiento y supervisión de los planes de acción tutorial vigentes.
                </p>
            </div>

            {/* ANALYTICS OVERVIEW */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <TutorStat icon={Users} label="Total de Alumnos" value="95" color="var(--primary)" description="De 3 grupos asignados" />
                <TutorStat icon={TrendingUp} label="Eficacia Tutorial" value="91%" color="var(--success)" description="+5% respecto al semestre anterior" />
                <TutorStat icon={AlertTriangle} label="Alumnos en Riesgo" value="12" color="var(--error)" description="Requieren intervención inmediata" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {/* GROUPS OVERSIGHT */}
                <div className="glass-card" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>Estado de Grupos</h3>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} color="var(--text-dim)" />
                            <input type="text" placeholder="Filtrar grupos..." style={{ padding: '8px 8px 8px 36px', fontSize: '0.85rem', width: '200px', background: 'rgba(0,0,0,0.2)' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {groups.map((group, i) => (
                            <div key={i} style={{
                                padding: '20px',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white' }}>
                                        <Briefcase size={20} style={{ margin: 'auto' }} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: '700', color: 'white' }}>{group.name}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{group.students} Alumnos</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 'bold', color: group.status === 'Warning' ? 'var(--error)' : 'var(--success)' }}>{group.performance}</p>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Desempeño</span>
                                </div>
                                <ChevronRight size={20} color="var(--text-dim)" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* COORDINATION TOOLS */}
                <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>Herramientas de Coordinación</h3>

                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', justifyContent: 'center' }}>
                        <FileSpreadsheet size={20} /> Exportar Excel General
                    </button>

                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', justifyContent: 'center' }}>
                        <Layout size={20} /> Editar Plan de Acción
                    </button>

                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', justifyContent: 'center', color: 'var(--secondary)' }}>
                        <BarChart2 size={20} /> Comparativa Semestral
                    </button>

                    <div style={{ marginTop: 'auto', padding: '24px', background: 'rgba(179, 142, 93, 0.05)', borderRadius: '20px', border: '1px solid var(--secondary)' }}>
                        <p style={{ fontSize: '0.9rem', color: 'white', lineHeight: '1.6', textAlign: 'center' }}>
                            Próxima reunión de evaluación con la Jefatura de Departamento: <br />
                            <strong style={{ color: 'var(--secondary)' }}>Viernes 20 de Febrero - 10:00 AM</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorHome;
