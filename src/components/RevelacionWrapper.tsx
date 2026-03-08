'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RevelacionWrapperProps {
    wisdom?: string;
    missionColor?: string;
}

export function RevelacionWrapper({ wisdom, missionColor = '#B8973E' }: RevelacionWrapperProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [displayed, setDisplayed] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const openModal = () => {
        setIsOpen(true);
        setDisplayed('');
        if (!wisdom) return;
        setIsTyping(true);
        let i = 0;
        const interval = setInterval(() => {
            setDisplayed(wisdom.slice(0, i + 1));
            i++;
            if (i >= wisdom.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 30);
    };

    if (!wisdom) return null;

    return (
        <>
            {/* Trigger button */}
            <motion.button
                onClick={openModal}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between gap-4 border rounded-2xl px-6 py-4 transition-all duration-300 group"
                style={{
                    borderColor: `${missionColor}40`,
                    backgroundColor: `${missionColor}06`,
                }}
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl" style={{ color: missionColor }}>✦</span>
                    <div className="text-left">
                        <p
                            className="text-[9px] font-semibold uppercase tracking-[0.3em]"
                            style={{ color: missionColor }}
                        >
                            Revelación Biológica
                        </p>
                        <p className="text-xs text-neutral-500 font-light mt-0.5">
                            Una verdad sobre tu Templo
                        </p>
                    </div>
                </div>
                <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="text-neutral-400 text-sm"
                >
                    →
                </motion.span>
            </motion.button>

            {/* Glassmorphism Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6"
                        onClick={() => setIsOpen(false)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass relative max-w-lg w-full rounded-3xl p-10 text-center"
                        >
                            {/* Close */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-5 right-5 text-neutral-300 hover:text-neutral-500 transition-colors text-lg leading-none"
                            >
                                ×
                            </button>

                            {/* Icon */}
                            <div className="mb-8">
                                <motion.span
                                    animate={{ rotate: [0, 72, 144, 216, 288, 360] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                    className="text-5xl inline-block"
                                    style={{ color: missionColor }}
                                >
                                    ✦
                                </motion.span>
                            </div>

                            <p
                                className="text-[9px] font-semibold uppercase tracking-[0.4em] mb-6"
                                style={{ color: missionColor }}
                            >
                                TEMPLO OS — Revelación Biológica
                            </p>

                            {/* Typing text */}
                            <p className="text-lg font-extralight text-neutral-700 leading-relaxed min-h-[80px]">
                                {displayed}
                                {isTyping && (
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                        className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                                        style={{ backgroundColor: missionColor }}
                                    />
                                )}
                            </p>

                            {!isTyping && displayed && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-xs text-neutral-400 font-light mt-8 tracking-wide"
                                >
                                    — TEMPLO OS // Biología Divina. Tecnología Humana.
                                </motion.p>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
