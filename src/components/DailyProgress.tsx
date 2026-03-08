'use client';

import { motion } from 'framer-motion';

interface DailyProgressProps {
    total: number;
    completed: number;
    missionColor?: string;
    userName?: string;
}

export function DailyProgress({ total, completed, missionColor = '#B8973E', userName }: DailyProgressProps) {
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const dayOfWeek = new Date().toLocaleDateString('es-MX', { weekday: 'long' });
    const dateStr = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });

    const getMessage = () => {
        if (pct === 0) return 'Empieza tu día — cada check te acerca a tu sueño.';
        if (pct < 30) return '¡Buen comienzo! Tú puedes completar el resto.';
        if (pct < 60) return 'Vas a la mitad. El cuerpo ya está respondiendo.';
        if (pct < 100) return '¡Casi! Un último esfuerzo y el día es tuyo.';
        return '🏆 ¡Día completo! Tu Templo está creciendo.';
    };

    return (
        <div className="bg-white border-b border-neutral-100 px-6 py-3">
            <div className="max-w-7xl mx-auto space-y-2">
                {/* Top row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400 capitalize">
                            {dayOfWeek} · {dateStr}
                        </span>
                        {pct === 100 && <span className="text-sm">🔥</span>}
                    </div>
                    <span className="font-mono text-xs font-medium" style={{ color: missionColor }}>
                        {completed}/{total} completados
                    </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: missionColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                </div>

                {/* Message */}
                <p className="text-[10px] text-neutral-400 font-light">{getMessage()}</p>
            </div>
        </div>
    );
}
