import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Send,
    MoreVertical,
    Plus,
    User,
    MessageSquare,
    AlertCircle,
    Check,
    CheckCheck,
    Clock
} from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';
import { useLocation } from 'react-router-dom';
import {
    getMensajes,
    addMensaje,
    getContactosDisponibles,
    getUserByControl
} from '../data/database.js';
import Card from '../components/Card.jsx';

const Messages = () => {
    const { user } = useUser();
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [activeContact, setActiveContact] = useState(null);

    // Auto-select contact from navigation state
    useEffect(() => {
        if (location.state?.contactId) {
            const contact = getUserByControl(location.state.contactId);
            if (contact) {
                setActiveContact({ id: location.state.contactId, ...contact });
            }
        }
    }, [location.state]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const messagesEndRef = useRef(null);

    // Refresh messages and contacts
    const refreshData = () => {
        if (user) {
            const userId = user.n_control || user.id_tutor;
            setMessages(getMensajes(userId));
        }
    };

    useEffect(() => {
        refreshData();
        window.addEventListener('databaseUpdated', refreshData);

        // Sync across tabs
        const handleStorageChange = (e) => {
            if (e.key === 'tutorias_mensajes_db') {
                refreshData();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('databaseUpdated', refreshData);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeContact]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Derived: Group and filter messages into conversations
    const conversations = React.useMemo(() => {
        const currentUserId = user?.n_control || user?.id_tutor;
        const map = new Map();

        messages.forEach(m => {
            const otherId = parseInt(m.remitente_id, 10) === currentUserId ? m.destinatario_id : m.remitente_id;
            if (!map.has(otherId)) {
                const otherUser = getUserByControl(otherId);
                map.set(otherId, {
                    id: otherId,
                    user: otherUser,
                    lastMessage: m,
                    messages: []
                });
            }
            map.get(otherId).messages.push(m);
        });

        // Filter by search query
        const filtered = Array.from(map.values()).filter(conv =>
            conv.user.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Sort by last message date
        return filtered.sort((a, b) => {
            return new Date(b.lastMessage.fecha_hora) - new Date(a.lastMessage.fecha_hora);
        });
    }, [messages, user, searchQuery]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeContact) return;

        const senderId = user.n_control || user.id_tutor;
        addMensaje(senderId, activeContact.id, newMessage.trim());
        setNewMessage('');
    };

    const contacts = getContactosDisponibles(user);
    const filteredContacts = contacts.filter(c =>
        c.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const startNewChat = (contact) => {
        setActiveContact(contact);
        setIsNewChatModalOpen(false);
        setSearchQuery('');
    };

    const currentChatMessages = activeContact
        ? messages.filter(m =>
            (parseInt(m.remitente_id, 10) === activeContact.id && parseInt(m.destinatario_id, 10) === (user.n_control || user.id_tutor)) ||
            (parseInt(m.remitente_id, 10) === (user.n_control || user.id_tutor) && parseInt(m.destinatario_id, 10) === activeContact.id)
        ).sort((a, b) => a.id - b.id)
        : [];

    return (
        <div className="h-[calc(100vh-160px)] flex gap-6 p-8 relative">
            {/* Sidebar list */}
            <div className="w-96 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-navy">Mensajes</h1>
                        <p className="text-text-muted text-sm">Gestiona tus comunicaciones</p>
                    </div>
                </div>

                <Card className="flex-1 flex flex-col p-0 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/30">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar contacto..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-navy/5 outline-none transition-all text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {conversations.length === 0 ? (
                            <div className="p-8 text-center space-y-3">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                    <MessageSquare size={24} />
                                </div>
                                <p className="text-xs text-text-muted font-medium italic">No tienes conversaciones activas</p>
                            </div>
                        ) : (
                            conversations.map(conv => (
                                <button
                                    key={conv.id}
                                    onClick={() => setActiveContact({ id: conv.id, ...conv.user })}
                                    className={`w-full p-4 flex gap-4 border-b border-gray-50 hover:bg-gray-50 transition-all text-left ${activeContact?.id === conv.id ? 'bg-navy/5 border-l-4 border-l-navy' : ''}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm
                                        ${conv.user.rol === 'tutor' ? 'bg-blue-600' :
                                            conv.user.rol === 'docente' ? 'bg-indigo-600' :
                                                'bg-emerald-600'}`}
                                    >
                                        {conv.user.nombre_completo.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-navy text-sm truncate">{conv.user.nombre_completo}</h3>
                                            <span className="text-[10px] text-text-muted font-medium shrink-0">Hace 5 min</span>
                                        </div>
                                        <p className="text-xs text-text-muted truncate mb-2">
                                            {conv.lastMessage.remitente_id === (user.n_control || user.id_tutor) ? 'Tú: ' : ''}
                                            {conv.lastMessage.contenido}
                                        </p>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest
                                            ${conv.user.rol === 'tutor' ? 'bg-blue-100 text-blue-700' :
                                                conv.user.rol === 'docente' ? 'bg-indigo-100 text-indigo-700' :
                                                    'bg-emerald-100 text-emerald-700'}`}
                                        >
                                            {conv.user.rol}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    <button
                        onClick={() => setIsNewChatModalOpen(true)}
                        className="m-4 p-3 bg-navy text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-navy/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Plus size={16} /> Nueva Conversación
                    </button>
                </Card>
            </div>

            {/* Chat area */}
            <div className="flex-1">
                {activeContact ? (
                    <Card className="h-full flex flex-col p-0 overflow-hidden bg-white shadow-xl border-navy/5">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-inner
                                    ${activeContact.rol === 'tutor' ? 'bg-blue-600' :
                                        activeContact.rol === 'docente' ? 'bg-indigo-600' :
                                            'bg-emerald-600'}`}
                                >
                                    {activeContact.nombre_completo.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="font-bold text-navy">{activeContact.nombre_completo}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{activeContact.rol}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="text-[10px] text-text-muted font-medium">{activeContact.correo || 'En línea'}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-gray-50 rounded-xl transition-all text-text-muted">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
                            {currentChatMessages.map(m => {
                                const isMe = parseInt(m.remitente_id, 10) === (user.n_control || user.id_tutor);
                                return (
                                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] space-y-1`}>
                                            <div className={`p-4 rounded-2xl text-sm shadow-sm relative group
                                                ${isMe
                                                    ? 'bg-navy text-white rounded-tr-none'
                                                    : 'bg-white border border-gray-100 text-navy rounded-tl-none'}`}
                                            >
                                                {/* Context Alert Shortcut (as seen in mockup) */}
                                                {m.contenido.includes("Reporte de Incidencia:") && (
                                                    <div className="mb-3 p-3 bg-white/10 rounded-xl border border-white/20 flex gap-3">
                                                        <AlertCircle size={16} className="shrink-0" />
                                                        <div>
                                                            <div className="font-black text-[10px] uppercase tracking-tighter mb-1 opacity-80">Contexto del Reporte</div>
                                                            <div className="text-xs font-bold leading-tight">{m.contenido.split('Reporte de Incidencia:')[1]}</div>
                                                        </div>
                                                    </div>
                                                )}

                                                {!m.contenido.includes("Reporte de Incidencia:") && m.contenido}

                                                <div className={`text-[9px] mt-2 font-medium flex items-center gap-1.5 opacity-60 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    {m.fecha_hora.split(',')[1]}
                                                    {isMe && <CheckCheck size={10} />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-50 flex gap-4 bg-white">
                            <input
                                type="text"
                                placeholder="Escribe un mensaje..."
                                className="flex-1 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-navy/10 outline-none transition-all text-sm font-medium"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="w-14 h-14 bg-navy text-white rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20 hover:bg-navy-light transition-all"
                            >
                                <Send size={20} />
                            </motion.button>
                        </form>
                    </Card>
                ) : (
                    <Card className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6 border-dashed border-gray-200">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                            <MessageSquare size={48} />
                        </div>
                        <div className="max-w-xs">
                            <h2 className="text-xl font-bold text-navy mb-2">Selecciona una conversación</h2>
                            <p className="text-sm text-text-muted">Elige un contacto de la izquierda para comenzar a chatear o inicia una nueva conversación.</p>
                        </div>
                    </Card>
                )}
            </div>

            {/* New Chat Modal */}
            <AnimatePresence>
                {isNewChatModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsNewChatModalOpen(false)}
                            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl overflow-hidden"
                        >
                            <h2 className="text-2xl font-black text-navy mb-1 uppercase tracking-tight">Nueva Conversación</h2>
                            <p className="text-sm text-text-muted mb-8">Selecciona un contacto permitido por el sistema</p>

                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre..."
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-navy/10 outline-none transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="max-h-80 overflow-y-auto space-y-3 custom-scrollbar">
                                {filteredContacts.map(contact => (
                                    <button
                                        key={contact.id}
                                        onClick={() => startNewChat(contact)}
                                        className="w-full p-4 flex items-center gap-4 bg-white border border-gray-100 rounded-2xl hover:border-navy hover:shadow-md transition-all groups"
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs
                                            ${contact.tipo === 'Tutor' ? 'bg-blue-600' : contact.tipo === 'Docente' ? 'bg-indigo-600' : 'bg-emerald-600'}`}
                                        >
                                            {contact.nombre_completo.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-navy text-sm">{contact.nombre_completo}</div>
                                            <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">{contact.tipo}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Messages;
