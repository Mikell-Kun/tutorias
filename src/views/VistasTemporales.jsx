import React from 'react';
import Tarjeta from '../components/Tarjeta.jsx';
import { BookOpen, User as UserIcon, MessageSquare } from 'lucide-react';

export const ReticulaPlaceholder = () => (
    <div className="p-8">
        <Tarjeta title="Mi Retícula" icon={BookOpen}>
            <div className="py-20 text-center text-text-muted">
                <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                <p>Módulo de Retícula en desarrollo.</p>
            </div>
        </Tarjeta>
    </div>
);


