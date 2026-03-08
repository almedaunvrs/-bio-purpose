'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckItemProps {
    id: string;
    label: string;
    why: string;
    emoji?: string;
    onCheck?: (checked: boolean) => void;
}

// Simple confetti burst (pure CSS, no external lib)
function ConfettiBurst() {
    const colors = ['#F59E0B', '#10B981', '#6366F1', '#EF4444', '#B8973E'];
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                        backgroundColor: colors[i % colors.length],
                        left: '50%',
                        top: '50%',
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                        x: (Math.cos((i / 12) * Math.PI * 2) * 40) + 'px',
                        y: (Math.sin((i / 12) * Math.PI * 2) * 40) + 'px',
                        opacity: 0,
                        scale: 0,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            ))}
        </div>
    );
}

export function CheckItem({ id, label, why, emoji, onCheck }: CheckItemProps) {
    const [checked, setChecked] = useState(false);
    const [showBurst, setShowBurst] = useState(false);

    // Persist to localStorage keyed by date + id
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const stored = localStorage.getItem(`templo-check-${today}-${id}`);
        if (stored === 'true') setChecked(true);
    }, [id]);

    const handleCheck = () => {
        if (checked) return; // can't uncheck — only forward progress
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`templo-check-${today}-${id}`, 'true');
        setChecked(true);
        setShowBurst(true);
        onCheck?.(true);
        setTimeout(() => setShowBurst(false), 700);
    };

    return (
        <motion.div
            layout
            className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer group ${checked
                    ? 'border-emerald-200 bg-emerald-50/60'
                    : 'border-neutral-100 bg-white hover:border-neutral-200 hover:shadow-sm'
                }`}
            onClick={handleCheck}
            whileTap={{ scale: 0.98 }}
        >
            {/* Checkbox */}
            <div className="relative flex-shrink-0 mt-0.5">
                <motion.div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${checked ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-300 group-hover:border-emerald-400'
                        }`}
                    animate={checked ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    <AnimatePresence>
                        {checked && (
                            <motion.svg
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </motion.svg>
                        )}
                    </AnimatePresence>
                </motion.div>
                {showBurst && <ConfettiBurst />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {emoji && <span className="text-lg leading-none">{emoji}</span>}
                    <p className={`text-sm font-medium leading-snug ${checked ? 'text-emerald-700 line-through' : 'text-neutral-800'}`}>
                        {label}
                    </p>
                </div>
                <p className="text-[11px] text-neutral-400 font-light mt-1 leading-relaxed">{why}</p>
            </div>

            {/* Completed badge */}
            <AnimatePresence>
                {checked && (
                    <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full self-start mt-0.5 flex-shrink-0"
                    >
                        ✓ Listo
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
