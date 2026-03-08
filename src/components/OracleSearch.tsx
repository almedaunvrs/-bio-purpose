'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, MISSION_THEMES } from '@/lib/types';

interface OracleSearchProps {
    profile: UserProfile;
}

export function OracleSearch({ profile }: OracleSearchProps) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        espiritual: string;
        biologico: string;
        universal: string;
    } | null>(null);

    const theme = MISSION_THEMES[profile.mission];

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || loading) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/oracle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: query,
                    profileContext: profile,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setResult(data);
            }
        } catch (error) {
            console.error('Oracle fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden transition-all">
            {/* Search Top */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl drop-shadow-sm">👁️</span>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-800 tracking-wide">Oráculo de Razonamiento</h3>
                        <p className="text-[10px] text-neutral-500 font-medium tracking-wide">Pregunta el "¿Por qué?" de cualquier aspecto de tu protocolo</p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ejemplo: ¿Por qué comer huevos? ¿Por qué la proteína?..."
                        className="w-full bg-white/40 backdrop-blur-md border border-white/30 text-neutral-800 text-sm rounded-2xl py-4 pl-5 pr-12 outline-none focus:bg-white/60 focus:border-white/50 transition-all font-light placeholder:text-neutral-500 focus:ring-1 shadow-inner"
                        style={{ '--tw-ring-color': theme.color } as React.CSSProperties}
                        maxLength={100}
                    />
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-xl transition-all"
                        style={{ backgroundColor: query.trim() && !loading ? theme.color : '#f5f5f5', color: query.trim() && !loading ? '#fff' : '#a3a3a3' }}
                    >
                        {loading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        )}
                    </button>
                </form>
            </div>

            {/* Result Bottom */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/30 backdrop-blur-md px-6 py-6 border-t border-white/20"
                    >
                        <p className="text-[9px] uppercase tracking-[0.3em] font-semibold mb-4 text-center" style={{ color: theme.color }}>
                            La Trinidad de la Verdad
                        </p>
                        <div className="space-y-4">
                            {/* Espiritual */}
                            <div className="flex gap-3 items-start">
                                <span className="text-base leading-none mt-1">✨</span>
                                <div>
                                    <p className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">Diseño Original</p>
                                    <p className="text-xs text-neutral-700 leading-relaxed font-light mt-0.5">{result.espiritual}</p>
                                </div>
                            </div>

                            <div className="w-full h-px bg-neutral-200/50" />

                            {/* Biologico */}
                            <div className="flex gap-3 items-start">
                                <span className="text-base leading-none mt-1">🔬</span>
                                <div>
                                    <p className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">Cuerpo Humano</p>
                                    <p className="text-xs text-neutral-700 leading-relaxed font-light mt-0.5">{result.biologico}</p>
                                </div>
                            </div>

                            <div className="w-full h-px bg-neutral-200/50" />

                            {/* Universal */}
                            <div className="flex gap-3 items-start">
                                <span className="text-base leading-none mt-1">🌍</span>
                                <div>
                                    <p className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">Ley Natural</p>
                                    <p className="text-xs text-neutral-700 leading-relaxed font-light mt-0.5">{result.universal}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
