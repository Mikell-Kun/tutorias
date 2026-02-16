import React, { useState } from 'react';
import {
    Send,
    User,
    Search,
    MoreVertical,
    Paperclip,
    Smile,
    Circle
} from 'lucide-react';

const Messages = () => {
    const [msg, setMsg] = useState('');
    const [chat, setChat] = useState([
        { sender: 'tutor', text: 'Hola Juan, vi tu reporte. Buen trabajo.', time: '09:30 AM' },
        { sender: 'user', text: 'Gracias Prof. ¿Cómo puedo mejorar en Cálculo?', time: '09:45 AM' },
        { sender: 'tutor', text: 'Te recomiendo asistir a las asesorías extra los jueves.', time: '10:00 AM' }
    ]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!msg.trim()) return;
        setChat([...chat, { sender: 'user', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setMsg('');
    };

    return (
        <div className="glass-card" style={{
            height: 'calc(100vh - 160px)',
            display: 'grid',
            gridTemplateColumns: '350px 1fr',
            gap: '0',
            overflow: 'hidden',
            padding: '0',
            border: '1px solid var(--glass-border)'
        }}>

            {/* SEARCH & RECIPIENTS */}
            <div style={{ borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '30px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '20px', color: 'white' }}>Mensajería</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} color="var(--text-dim)" />
                        <input
                            type="text"
                            placeholder="Buscar tutor o docente..."
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 48px',
                                background: 'rgba(0, 0, 0, 0.2)'
                            }}
                        />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <div style={{
                        padding: '12px 30px',
                        background: 'rgba(179, 142, 93, 0.05)',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        color: 'var(--secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        borderY: '1px solid var(--glass-border)'
                    }}>
                        Contactos Asignados
                    </div>
                    {[
                        { name: 'Dr. Roberto Sánchez', role: 'Tutor Principal', active: true, online: true },
                        { name: 'Mtra. Elena Gómez', role: 'Coordinadora Académica', active: false, online: false }
                    ].map((contact, i) => (
                        <div key={i} style={{
                            padding: '20px 30px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            cursor: 'pointer',
                            backgroundColor: contact.active ? 'rgba(179, 142, 93, 0.1)' : 'transparent',
                            transition: 'all 0.3s ease',
                            borderLeft: contact.active ? '4px solid var(--secondary)' : '4px solid transparent'
                        }}
                            onMouseEnter={(e) => { if (!contact.active) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)' }}
                            onMouseLeave={(e) => { if (!contact.active) e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, #234E8C 100%)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    {contact.name.charAt(0)}
                                </div>
                                {contact.online && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '-2px',
                                        right: '-2px',
                                        width: '14px',
                                        height: '14px',
                                        backgroundColor: 'var(--success)',
                                        borderRadius: '50%',
                                        border: '3px solid var(--bg-dark)'
                                    }}></div>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'white' }}>{contact.name}</h4>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>10:00 AM</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: contact.active ? 'var(--secondary)' : 'var(--text-dim)', marginTop: '4px' }}>{contact.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CHAT AREA */}
            <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0, 0, 0, 0.1)' }}>
                {/* CHAT HEADER */}
                <div style={{
                    padding: '20px 30px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, var(--secondary) 0%, #85643a 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                            }}>R</div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>Dr. Roberto Sánchez</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Circle size={8} fill="var(--success)" color="var(--success)" />
                                <p style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '700' }}>En línea ahora</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><Search size={20} /></button>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* MESSAGES */}
                <div style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {chat.map((m, i) => (
                        <div key={i} style={{
                            alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
                        }}>
                            <div style={{
                                padding: '16px 20px',
                                borderRadius: m.sender === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                                backgroundColor: m.sender === 'user' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                                color: 'white',
                                border: m.sender === 'user' ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                                fontSize: '0.95rem',
                                lineHeight: '1.6',
                                boxShadow: m.sender === 'user' ? '0 4px 15px rgba(27, 57, 106, 0.3)' : 'none'
                            }}>
                                {m.text}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600', padding: '0 5px' }}>{m.time}</span>
                        </div>
                    ))}
                </div>

                {/* INPUT */}
                <form onSubmit={handleSend} style={{
                    padding: '24px 30px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderTop: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><Paperclip size={22} /></button>
                        <button type="button" style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><Smile size={22} /></button>
                    </div>
                    <input
                        type="text"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        placeholder="Escribe tu mensaje aquí..."
                        style={{
                            flex: 1,
                            padding: '14px 20px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            fontSize: '0.95rem'
                        }}
                    />
                    <button type="submit" className="btn-primary" style={{
                        width: '50px',
                        height: '50px',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '14px'
                    }}>
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Messages;
