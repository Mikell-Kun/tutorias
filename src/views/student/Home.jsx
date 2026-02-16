import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bell, ChevronRight, Award, Clock } from 'lucide-react';
import Card from '../../components/Card.jsx';

const StudentHome = () => {
    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            {/* Welcome Banner */}
            <section className="relative overflow-hidden rounded-3xl bg-navy p-10 text-white shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="max-w-md">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Hola de nuevo, <span className="text-gold">Migue</span></h1>
                        <p className="text-blue-100 text-lg opacity-90">
                            Tienes una sesión de tutoría mañana a las 10:00 AM con el Dr. Garcia. No olvides preparar tus dudas sobre la retícula.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 btn-accent"
                        >
                            Ver Detalle
                        </motion.button>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <Calendar size={80} className="text-gold" />
                        </div>
                    </div>
                </div>
                {/* Abstract patterns */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </section>

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    title="Próxima Tutoría"
                    subtitle="Martes 18 de Feb"
                    icon={Clock}
                    className="hover:scale-[1.02] transition-transform cursor-pointer"
                >
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm font-bold text-navy">Tutoría Grupal</p>
                            <p className="text-xs text-text-muted">Aula 4B • 10:00 AM</p>
                        </div>
                    </div>
                </Card>

                <Card
                    title="Avisos"
                    subtitle="2 nuevos avisos"
                    icon={Bell}
                    className="hover:scale-[1.02] transition-transform cursor-pointer"
                >
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                            <div className="w-2 h-2 bg-gold rounded-full shrink-0"></div>
                            <p className="text-sm flex-1 truncate">Nueva fecha para liberación de créditos...</p>
                            <ChevronRight size={16} className="text-text-muted group-hover:text-navy" />
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                            <div className="w-2 h-2 bg-navy rounded-full shrink-0"></div>
                            <p className="text-sm flex-1 truncate">Encuesta de satisfacción de servicios...</p>
                            <ChevronRight size={16} className="text-text-muted group-hover:text-navy" />
                        </div>
                    </div>
                </Card>

                <Card
                    title="Mi Pogreso"
                    subtitle="Ciclo Escolar 2026-1"
                    icon={Award}
                    className="hover:scale-[1.02] transition-transform cursor-pointer"
                >
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-2xl font-bold text-navy">85%</span>
                            <span className="text-xs text-text-muted">Créditos cubiertos</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '85%' }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gold"
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default StudentHome;
