'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckItemProps {
    id: string;
    label: string;
    why: string;
    emoji?: string;
    sessionKey?: string; // resets when this key changes (e.g. profile reset date)
    onCheck?: (checked: boolean) => void;
}

function ConfettiBurst() {
    const colors = ['#F59E0B', '#10B981', '#6366F1', '#EF4444', '#B8973E'];
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: colors[i % colors.length], left: '50%', top: '50%' }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                        x: (Math.cos((i / 12) * Math.PI * 2) * 40) + 'px',
                        y: (Math.sin((i / 12) * Math.PI * 2) * 40) + 'px',
                        opacity: 0, scale: 0,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            ))}
        </div>
    );
}

export function CheckItem({ id, label, why, emoji, sessionKey, onCheck }: CheckItemProps) {
    const [checked, setChecked] = useState(false);
    const [showBurst, setShowBurst] = useState(false);

    // Build the localStorage key — includes today's date so it auto-resets each day
    // Also includes sessionKey so it resets when the user resets the profile
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `templo-check-${today}-${sessionKey ?? ''}-${id}`;

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        setChecked(stored === 'true');
    }, [storageKey]);

    const handleToggle = () => {
        const next = !checked;
        if (next) {
            localStorage.setItem(storageKey, 'true');
            setShowBurst(true);
            setTimeout(() => setShowBurst(false), 700);
        } else {
            localStorage.removeItem(storageKey);
        }
        setChecked(next);
        onCheck?.(next);
    };

    return (
        <motion.div
            layout
            className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer group ${checked
                ? 'border-emerald-200 bg-emerald-50/60'
                : 'border-neutral-100 bg-white hover:border-neutral-200 hover:shadow-sm'
                }`}
            onClick={handleToggle}
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
                                exit={{ opacity: 0, scale: 0 }}
                                className="w-3 h-3 text-white"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
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

            <AnimatePresence>
                {checked && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="flex flex-col items-end gap-1 mt-0.5 flex-shrink-0"
                    >
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full self-end">
                            ✓ Listo
                        </span>
                        <span className="text-[8px] italic text-emerald-600/70 mr-1 max-w-[80px] text-right leading-tight">
                            Has cumplido con tu diseño hoy.
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
