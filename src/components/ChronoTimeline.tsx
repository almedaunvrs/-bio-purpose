'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChronoPhase } from '@/lib/types';

interface Phase {
    name: ChronoPhase;
    label: string;
    hours: string;
    description: string;
    icon: string;
    start: number;
    end: number;
    gradient: string;
    textColor: string;
    borderColor: string;
}

const PHASES: Phase[] = [
    {
        name: 'Movimiento',
        label: 'MOVIMIENTO',
        hours: '06:00 — 11:59',
        description: 'Cortisol y adrenalina en pico. El cuerpo está diseñado para moverse, no para comer. Entrenamiento en ayunas, hidratación con electrolitos.',
        icon: '◎',
        start: 6,
        end: 12,
        gradient: 'from-amber-50 to-yellow-50',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-200',
    },
    {
        name: 'Festín',
        label: 'FESTÍN',
        hours: '12:00 — 19:59',
        description: 'Ventana anabólica y digestiva. Insulina controlada activa la síntesis muscular. Introduce tus comidas más densas y tu mayor carga de proteína.',
        icon: '◈',
        start: 12,
        end: 20,
        gradient: 'from-emerald-50 to-green-50',
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-200',
    },
    {
        name: 'Reparación',
        label: 'REPARACIÓN',
        hours: '20:00 — 05:59',
        description: 'Hormona de crecimiento en pico nocturno. Síntesis proteica máxima. Apaga pantallas. El ayuno nocturno activa la autofagia celular.',
        icon: '◐',
        start: 20,
        end: 6,
        gradient: 'from-indigo-50 to-violet-50',
        textColor: 'text-indigo-500',
        borderColor: 'border-indigo-200',
    },
];

function getCurrentPhase(hour: number): ChronoPhase {
    if (hour >= 6 && hour < 12) return 'Movimiento';
    if (hour >= 12 && hour < 20) return 'Festín';
    return 'Reparación';
}

export function ChronoTimeline({ currentAction }: { currentAction?: string }) {
    const [hour, setHour] = useState(new Date().getHours());
    const [minutes, setMinutes] = useState(new Date().getMinutes());

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setHour(now.getHours());
            setMinutes(now.getMinutes());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const activePhase = getCurrentPhase(hour);
    const timeStr = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    return (
        <div className="space-y-3">
            {/* Live clock */}
            <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
                    Cronobiología en Vivo
                </span>
                <span className="font-mono text-sm font-light text-neutral-500">{timeStr}</span>
            </div>

            {PHASES.map((phase, idx) => {
                const isActive = phase.name === activePhase;
                return (
                    <motion.div
                        key={phase.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`
              relative border rounded-2xl overflow-hidden transition-all duration-500
              ${isActive
                                ? `${phase.borderColor} bg-gradient-to-br ${phase.gradient} shadow-sm`
                                : 'border-neutral-100 bg-neutral-50/50'
                            }
            `}
                    >
                        {/* Active indicator bar */}
                        {isActive && (
                            <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${phase.textColor.replace('text-', 'bg-')}`} />
                        )}

                        <div className={`px-5 py-4 ${isActive ? 'pl-7' : ''}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`text-lg ${isActive ? phase.textColor : 'text-neutral-300'}`}>
                                            {phase.icon}
                                        </span>
                                        <div>
                                            <span className={`text-[9px] font-semibold tracking-[0.25em] ${isActive ? phase.textColor : 'text-neutral-400'}`}>
                                                {phase.label}
                                            </span>
                                            <span className="text-[9px] text-neutral-400 ml-3 font-mono">{phase.hours}</span>
                                        </div>
                                        {isActive && (
                                            <span className={`ml-auto text-[8px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${phase.textColor} bg-white/60`}>
                                                AHORA
                                            </span>
                                        )}
                                    </div>
                                    {isActive && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="text-xs text-neutral-600 font-light leading-relaxed mt-2"
                                        >
                                            {currentAction || phase.description}
                                        </motion.p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
