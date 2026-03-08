'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { MISSION_THEMES } from '@/lib/types';

// DNA scan animation dots
function DnaScan() {
    return (
        <div className="flex items-center justify-center gap-1.5 my-8">
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="w-1.5 rounded-full bg-amber-400"
                    animate={{
                        height: ['8px', '32px', '8px'],
                        opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}

// Single analysis point card
function AnalysisPoint({
    index, icon, title, content, delay,
}: { index: number; icon: string; title: string; content: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="flex gap-4 p-5 rounded-2xl border border-neutral-100 bg-white"
        >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-sm font-semibold text-amber-600">
                {index}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span>{icon}</span>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-700">{title}</p>
                </div>
                <p className="text-sm font-light text-neutral-600 leading-relaxed">{content}</p>
            </div>
        </motion.div>
    );
}

export function AnalisisOriginal() {
    const { profile, acknowledgeAnalysis, resetProfile } = useUserStore();
    const [scanning, setScanning] = useState(true);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Scanning animation: 2.5s then reveal
        const t = setTimeout(() => {
            setScanning(false);
            setTimeout(() => setReady(true), 400);
        }, 2500);
        return () => clearTimeout(t);
    }, []);

    if (!profile) return null;

    const p = profile;
    const proto = p.geminiProtocol;
    const theme = MISSION_THEMES[p.mission];

    const currentWeight = p.weightKg;
    const goalWeight = proto?.goalWeightKg ?? p.goalWeightKg;
    const gapKg = goalWeight - currentWeight;
    const gapPhase = proto?.gapPhase ?? 'OPTIMIZACIÓN';
    const heightM = p.heightCm / 100;

    // Build analysis points
    const analyses = [
        {
            icon: '🔬',
            title: 'Estado Actual — Tu Vehículo de Hoy',
            content: proto?.missionReason
                ? proto.missionReason
                : `Con ${currentWeight}kg y ${p.heightCm}cm, tu FFMI actual es ${((currentWeight * 0.82) / (heightM * heightM)).toFixed(1)}. ${gapKg > 0 ? `Para tu sueño necesitas construir ${gapKg}kg adicionales de tejido contráctil.` : 'Tu composición actual está cerca de la meta — el trabajo es de optimización.'}`,
        },
        {
            icon: '⚡',
            title: 'La Brecha de Poder — Lo Que Falta',
            content: proto?.gapMessage
                ? proto.gapMessage
                : `Peso actual: ${currentWeight}kg → Meta de Poder: ${goalWeight}kg. ${gapKg > 0 ? `Faltan ${gapKg}kg de músculo funcional para que tu cuerpo soporte la carga de trabajo de tu sueño.` : 'El enfoque es composición corporal y rendimiento, no escala de peso.'}`,
        },
        {
            icon: '🧱',
            title: 'Puntos de Construcción — Dónde Mejorar',
            content: proto?.biologicalContext
                ? proto.biologicalContext
                : `1. Síntesis proteica (Construcción de Músculo): ${proto?.proteinGrams ?? 150}g/día. 2. Grasas saturadas naturales para optimizar testosterona natural. 3. Densidad mineral ósea mediante mineralización eléctrica (Mg-K-Na). 4. Cronobiología: entrenar en ventana 06-12h para máximo anabolismo.`,
        },
        {
            icon: '🗺️',
            title: 'Estrategia de Crecimiento — El Camino',
            content: proto?.firstAction
                ? `Protocolo de ${gapPhase}. ${gapKg > 0 ? `En 6-12 meses de consistencia, este peso te dará la estructura muscular, autoridad visual y energía cognitiva que tu sueño exige.` : `Tu protocolo de optimización te llevará a tu mejor composición corporal en 3-6 meses.`} Primera acción mañana: ${proto.firstAction}`
                : `Protocolo calculado específicamente para tu sueño. Sigue el plan Lunes-Domingo con los checkboxes del Dashboard. Cada comida marcada es un ladrillo de tu Templo.`,
        },
    ];

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 font-[family-name:var(--font-inter)]">
            <div className="w-full max-w-2xl">

                <AnimatePresence mode="wait">

                    {/* SCANNING PHASE */}
                    {scanning && (
                        <motion.div
                            key="scan"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center space-y-6"
                        >
                            <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-400">TEMPLO OS // ANÁLISIS ACTIVO</p>
                            <h1 className="text-3xl font-extralight text-neutral-900">
                                Escaneando tu<br />
                                <span style={{ color: theme.color }}>Diseño Original</span>
                            </h1>
                            <DnaScan />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 2.2, ease: 'linear' }}
                                className="h-px mx-auto max-w-xs"
                                style={{ backgroundColor: theme.color }}
                            />
                            <p className="text-xs font-light text-neutral-400">Cruzando sueño del alma con datos biológicos...</p>
                        </motion.div>
                    )}

                    {/* ANALYSIS REVEAL */}
                    {!scanning && ready && (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Header */}
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-400">TEMPLO OS // EL PORQUÉ DE TU TEMPLO</p>
                                <h1 className="text-3xl md:text-4xl font-extralight text-neutral-900 leading-tight">
                                    Tu sueño es grande.<br />
                                    <span style={{ color: theme.color }}>Vamos a construir el motor.</span>
                                </h1>

                                {/* Phase badge */}
                                <span className={`inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] px-3 py-1.5 rounded-full mt-2 ${gapPhase === 'CONSTRUCCIÓN ACTIVA' ? 'bg-amber-100 text-amber-700'
                                        : gapPhase === 'DEFINICIÓN BIOLÓGICA' ? 'bg-sky-100 text-sky-700'
                                            : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    {gapPhase === 'CONSTRUCCIÓN ACTIVA' ? '🏗️' : gapPhase === 'DEFINICIÓN BIOLÓGICA' ? '🔬' : '⚡'} FASE: {gapPhase}
                                </span>
                            </div>

                            {/* Weight gap visual */}
                            <div className="rounded-3xl p-6 border border-neutral-100 bg-neutral-50/80">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-center">
                                        <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">Hoy</p>
                                        <p className="text-4xl font-extralight text-neutral-500">{currentWeight}<span className="text-base">kg</span></p>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <motion.div
                                            className="w-full h-0.5 rounded-full"
                                            style={{ backgroundColor: theme.color }}
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.4, duration: 0.8 }}
                                        />
                                        <p className="text-xs font-semibold mt-1" style={{ color: theme.color }}>
                                            {gapKg > 0 ? `+${gapKg}kg` : `${gapKg}kg`} de construcción
                                        </p>
                                        <p className="text-[9px] text-neutral-400">6-12 meses</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">Meta de Poder</p>
                                        <p className="text-4xl font-extralight" style={{ color: theme.color }}>{goalWeight}<span className="text-base">kg</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Analysis points */}
                            <div className="space-y-3">
                                {analyses.map((a, i) => (
                                    <AnalysisPoint
                                        key={i}
                                        index={i + 1}
                                        icon={a.icon}
                                        title={a.title}
                                        content={a.content}
                                        delay={i * 0.15}
                                    />
                                ))}
                            </div>

                            {/* Mission label */}
                            {proto?.missionLabel && (
                                <div className="text-center">
                                    <span className="text-[10px] text-neutral-400">Arquetipo detectado: </span>
                                    <span className="text-[10px] font-semibold" style={{ color: theme.color }}>{proto.missionLabel}</span>
                                </div>
                            )}

                            {/* Accept button */}
                            <motion.button
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                onClick={acknowledgeAnalysis}
                                className="w-full py-5 rounded-2xl font-semibold text-sm uppercase tracking-[0.25em] text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                                style={{ backgroundColor: theme.color }}
                            >
                                Acepto mi Proceso de Construcción →
                            </motion.button>

                            <div className="text-center">
                                <button
                                    onClick={resetProfile}
                                    className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                    Reiniciar datos →
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
