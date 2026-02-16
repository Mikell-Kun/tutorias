import React from 'react';
import Card from '../components/Card.jsx';
import { BookOpen, User as UserIcon, MessageSquare } from 'lucide-react';

export const ReticulaPlaceholder = () => (
    <div className="p-8">
        <Card title="Mi Retícula" icon={BookOpen}>
            <div className="py-20 text-center text-text-muted">
                <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                <p>Módulo de Retícula en desarrollo.</p>
            </div>
        </Card>
    </div>
);

export const ProfilePlaceholder = () => (
    <div className="p-8">
        <Card title="Mi Perfil" icon={UserIcon}>
            <div className="py-20 text-center text-text-muted">
                <UserIcon size={48} className="mx-auto mb-4 opacity-20" />
                <p>Módulo de Perfil en desarrollo.</p>
            </div>
        </Card>
    </div>
);

export const MessagesPlaceholder = () => (
    <div className="p-8">
        <Card title="Mensajes" icon={MessageSquare}>
            <div className="py-20 text-center text-text-muted">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                <p>Módulo de Mensajería en desarrollo.</p>
            </div>
        </Card>
    </div>
);
