'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/useUserStore';
import { calculateNutrition } from '@/lib/algorithms';
import { getWorkoutRoutine } from '@/lib/workouts';
import { MISSION_THEMES, UserProfile } from '@/lib/types';
import { ChronoTimeline } from './ChronoTimeline';
import { TrinidadVerdad, TEMPLO_LEYES } from './TrinidadVerdad';
import { ElectrolytosWidget } from './ElectrolytosWidget';
import { RevelacionWrapper } from './RevelacionWrapper';
import { PlanDiario } from './PlanDiario';
import { DailyProgress } from './DailyProgress';
import { HabitosAlma } from './HabitosAlma';

// ─── Age-aware language ───────────────────────────────────────────────────────
function getTone(age: number) {
    if (age < 30) return {
        hero: 'Domina tu Cuerpo',
        sub: 'Eres la generación que cambia las reglas. Tu biología, tu protocolo.',
        cta: '¡Tu mejor versión te espera!',
    };
    if (age < 50) return {
        hero: 'Optimiza tu Energía',
        sub: 'En tu pico de experiencia y biología. Este es tu momento de brillar.',
        cta: 'Cada día cuenta. Cada elección importa.',
    };
    return {
        hero: 'Protege tu Vitalidad',
        sub: 'La longevidad no es suerte — es protocolo. Tu Templo puede durar 100 años.',
        cta: 'Vive con fuerza y claridad mental, siempre.',
    };
}

// ─── Section wrapper with alternating backgrounds ────────────────────────────
function Section({
    children, bg = 'white', id,
}: { children: React.ReactNode; bg?: 'white' | 'gray'; id?: string }) {
    return (
        <section
            id={id}
            className={`py-16 px-6 ${bg === 'gray' ? 'bg-[#F8FAFC]' : 'bg-white'}`}
        >
            <div className="max-w-7xl mx-auto">{children}</div>
        </section>
    );
}

// ─── Section header with icon ─────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
    return (
        <div className="flex items-start gap-4 mb-10">
            <span className="text-4xl leading-none">{icon}</span>
            <div>
                <h2 className="text-2xl md:text-3xl font-extralight text-neutral-900 leading-tight">{title}</h2>
                {subtitle && <p className="text-sm text-neutral-500 font-light mt-1">{subtitle}</p>}
            </div>
        </div>
    );
}

// ─── Macro card with food color ───────────────────────────────────────────────
function MacroCard({
    value, unit, abbr, label, simpleName, emoji, bg, accent,
}: {
    value: number; unit: string; abbr: string; label: string;
    simpleName: string; emoji: string; bg: string; accent: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6 space-y-3 border"
            style={{ backgroundColor: bg, borderColor: `${accent}30` }}
        >
            <div className="flex items-start justify-between">
                <span className="text-3xl">{emoji}</span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] px-2 py-1 rounded-full bg-white/70"
                    style={{ color: accent }}>
                    {abbr}
                </span>
            </div>
            <div>
                <p className="text-3xl font-extralight" style={{ color: accent }}>
                    {value}<span className="text-base ml-1">{unit}</span>
                </p>
                <p className="text-sm font-medium text-neutral-700 mt-0.5">{label}</p>
                <p className="text-xs text-neutral-500 font-light">{simpleName}</p>
            </div>
        </motion.div>
    );
}

// ─── Term translation chip ────────────────────────────────────────────────────
function TermChip({ technical, simple, icon }: { technical: string; simple: string; icon: string }) {
    return (
        <div className="flex items-center gap-2.5 border border-neutral-100 rounded-full px-4 py-2 bg-white text-xs">
            <span>{icon}</span>
            <span className="text-neutral-400 line-through text-[10px]">{technical}</span>
            <span className="text-neutral-300">→</span>
            <span className="font-medium text-neutral-700">{simple}</span>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function Dashboard() {
    const { profile, resetProfile } = useUserStore();
    const [progressCompleted, setProgressCompleted] = useState(0);
    const [progressTotal, setProgressTotal] = useState(8);

    if (!profile) return null;

    const p = profile as UserProfile;
    const theme = MISSION_THEMES[p.mission];
    const proto = p.geminiProtocol;
    const nutrition = calculateNutrition(p);
    const routine = getWorkoutRoutine(p.mission);
    const tone = getTone(p.age);

    const calories = proto?.calories ?? nutrition.calories;
    const protein = proto?.proteinGrams ?? nutrition.proteinGrams;
    const carbs = proto?.carbsGrams ?? nutrition.carbsGrams;
    const fats = proto?.fatsGrams ?? nutrition.fatsGrams;

    // Stable session key — changes only when profile is reset
    const sessionKey = `${p.age}-${p.weightKg}-${p.heightCm}`;

    const handleProgressChange = useCallback((completed: number, total: number) => {
        setProgressCompleted(completed);
        setProgressTotal(total);
    }, []);

    return (
        <div className="min-h-screen bg-white text-neutral-900 font-[family-name:var(--font-inter)]">

            {/* ── Sticky Nav ─────────────────────────────────────────────────────── */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neutral-800">TEMPLO OS</span>
                        <span className="w-px h-4 bg-neutral-200" />
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                            style={{ color: theme.color, backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                            {theme.label}
                        </span>
                    </div>
                    <button onClick={resetProfile}
                        className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 hover:text-neutral-700 transition-colors font-medium">
                        Reiniciar →
                    </button>
                </div>
            </nav>

            {/* ── Daily Progress Bar ──────────────────────────────────────────────── */}
            <DailyProgress
                total={progressTotal}
                completed={progressCompleted}
                missionColor={theme.color}
            />

            {/* ── Norte (Mission) — always visible ───────────────────────────────── */}
            <div className="border-b border-neutral-100 bg-white px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-neutral-400">Tu Norte</span>
                    <span className="w-px h-4 bg-neutral-200" />
                    <p className="text-sm font-light text-neutral-700 italic flex-1">"{p.mainGoal || 'Mi sueño del alma'}"</p>
                    <span className="text-[10px] px-3 py-1 rounded-full font-medium"
                        style={{ color: theme.color, backgroundColor: theme.bg }}>
                        {theme.label}
                    </span>
                </div>
            </div>

            {/* ── SECTION 1 — Hero + Perfil Biológico ────────────────────────────── */}
            <Section bg="white" id="perfil">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Hero text */}
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 mb-4">TEMPLO OS // Protocolo Activo</p>
                        <h1 className="text-4xl md:text-6xl font-extralight text-neutral-900 leading-[0.95] tracking-tight mb-4">
                            {tone.hero}
                        </h1>
                        <p className="text-sm font-light text-neutral-500 leading-relaxed max-w-md mb-2">{tone.sub}</p>
                        <p className="text-xs font-medium" style={{ color: theme.color }}>{tone.cta}</p>
                    </motion.div>

                    {/* Perfil bio snapshot */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: '⚖️', label: 'Peso Actual', value: `${p.weightKg} kg` },
                            { icon: '🎯', label: 'Meta Biológica', value: `${proto?.goalWeightKg ?? p.goalWeightKg} kg` },
                            { icon: '💧', label: 'Grasa Corporal Meta', value: `${proto?.targetBodyFatPercent ?? p.bodyFatPercentage}%` },
                            { icon: '🔋', label: 'Nivel de Estrés', value: `${p.stressLevel}/10` },
                            { icon: '😴', label: 'Calidad de Sueño', value: p.sleepQuality === 'buena' ? 'Óptimo' : p.sleepQuality === 'regular' ? 'Regular' : 'Por mejorar' },
                            { icon: '📍', label: 'Ubicación', value: (p.location || 'México').split(',')[0] },
                        ].map((stat, i) => (
                            <motion.div key={stat.label}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className="border border-neutral-100 rounded-2xl p-4 bg-white hover:shadow-sm transition-shadow">
                                <p className="text-lg leading-none mb-2">{stat.icon}</p>
                                <p className="text-[9px] text-neutral-400 uppercase tracking-[0.2em] font-medium">{stat.label}</p>
                                <p className="text-sm font-light text-neutral-800 mt-1">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* AI Mission Diagnosis */}
                {proto?.missionReason && (
                    <div className="mt-10 rounded-3xl p-8 border"
                        style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
                        <p className="text-[9px] uppercase tracking-[0.35em] font-semibold mb-3" style={{ color: theme.color }}>
                            Diagnóstico TEMPLO OS — Por qué este protocolo es tuyo
                        </p>
                        <p className="text-sm font-light leading-relaxed text-neutral-700">{proto.missionReason}</p>
                        {proto.biologicalContext && (
                            <p className="text-xs font-light leading-relaxed text-neutral-500 mt-4 pt-4 border-t border-black/5">
                                {proto.biologicalContext}
                            </p>
                        )}
                    </div>
                )}

                {/* ── GAP NEUROMARKETING ── */}
                {proto?.gapMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6"
                    >
                        {/* Phase banner */}
                        <div className={`flex items-center gap-3 mb-4`}>
                            <span className={`text-[9px] font-bold uppercase tracking-[0.3em] px-3 py-1.5 rounded-full ${proto.gapPhase === 'CONSTRUCCIÓN ACTIVA'
                                ? 'bg-amber-100 text-amber-700'
                                : proto.gapPhase === 'DEFINICIÓN BIOLÓGICA'
                                    ? 'bg-sky-100 text-sky-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                {proto.gapPhase === 'CONSTRUCCIÓN ACTIVA' ? '🏗️' : proto.gapPhase === 'DEFINICIÓN BIOLÓGICA' ? '🔬' : '⚡'} FASE: {proto.gapPhase}
                            </span>
                        </div>

                        {/* Gap visualization */}
                        <div className="border border-neutral-100 rounded-3xl p-6 bg-neutral-50/80">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                                {/* Current weight */}
                                <div className="text-center">
                                    <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-medium">Peso Actual</p>
                                    <p className="text-3xl font-extralight text-neutral-600">{p.weightKg}<span className="text-sm ml-1">kg</span></p>
                                </div>

                                {/* Arrow + gap */}
                                <div className="flex-1 flex flex-col items-center gap-1 min-w-[100px]">
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                        className="w-full h-px origin-left"
                                        style={{ backgroundColor: theme.color }}
                                    />
                                    <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: theme.color }}>
                                        {Math.abs((proto.goalWeightKg ?? p.goalWeightKg) - p.weightKg).toFixed(1)} kg
                                    </span>
                                    <span className="text-lg">→</span>
                                </div>

                                {/* Goal weight */}
                                <div className="text-center">
                                    <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-medium">Meta de Poder</p>
                                    <p className="text-3xl font-extralight" style={{ color: theme.color }}>
                                        {proto.goalWeightKg ?? p.goalWeightKg}<span className="text-sm ml-1">kg</span>
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm font-light text-neutral-700 leading-relaxed">{proto.gapMessage}</p>
                        </div>
                    </motion.div>
                )}

                {/* ── PORTION PLAN ── */}
                {proto?.portionPlan && (proto.portionPlan.proteinSource || proto.portionPlan.carbSource) && (
                    <div className="mt-6">
                        <p className="text-[9px] uppercase tracking-[0.35em] text-neutral-400 font-medium mb-4">
                            🍽️ Porciones Exactas — Sin Ambigüedad
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[
                                { icon: '🥩', label: 'Proteína', value: proto.portionPlan.proteinSource },
                                { icon: '🌾', label: 'Carbohidrato', value: proto.portionPlan.carbSource },
                                { icon: '🥑', label: 'Grasa', value: proto.portionPlan.fatSource },
                                { icon: '⚡', label: 'Pre-Entreno', value: proto.portionPlan.preWorkout },
                                { icon: '🔄', label: 'Post-Entreno', value: proto.portionPlan.postWorkout },
                            ].filter(x => x.value).map((item, i) => (
                                <div key={i} className="border border-neutral-100 rounded-2xl p-4 bg-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-400">{item.label}</span>
                                    </div>
                                    <p className="text-xs font-light text-neutral-700 leading-relaxed">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Section>


            {/* ── SECTION 2 — Cronobiología ───────────────────────────────────────── */}
            <Section bg="gray" id="cronobiologia">
                <SectionHeader
                    icon="⏱️"
                    title="Cronobiología en Vivo"
                    subtitle="Tu cuerpo tiene un reloj interno. Este protocolo sincroniza cada acción con él."
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ChronoTimeline currentAction={proto?.chronoGuidance?.action} />

                    {/* Term translations */}
                    <div className="space-y-6">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-medium">Diccionario TEMPLO</p>
                        <p className="text-xs text-neutral-500 font-light">La ciencia en lenguaje real:</p>
                        <div className="flex flex-wrap gap-2">
                            <TermChip technical="Electrolitos" simple="Cables Eléctricos" icon="⚡" />
                            <TermChip technical="Síntesis Proteica" simple="Construcción de Músculo" icon="🧱" />
                            <TermChip technical="Autofagia" simple="Limpieza Automática" icon="🧹" />
                            <TermChip technical="Cronobiología" simple="Reloj Interno" icon="🕐" />
                            <TermChip technical="TDEE" simple="Combustible Diario" icon="⛽" />
                            <TermChip technical="Microbiota" simple="Ejército Intestinal" icon="🛡️" />
                        </div>
                        {proto?.firstAction && (
                            <div className="border rounded-2xl p-5 mt-4"
                                style={{ borderColor: theme.border, backgroundColor: theme.bg }}>
                                <p className="text-[9px] uppercase tracking-[0.3em] font-semibold mb-2" style={{ color: theme.color }}>
                                    Mañana al Despertar
                                </p>
                                <p className="text-sm font-light text-neutral-700 leading-relaxed">{proto.firstAction}</p>
                            </div>
                        )}
                    </div>
                </div>
            </Section>

            {/* ── SECTION 3 — Plan Diario (Lun-Dom) ──────────────────────────────── */}
            <Section bg="white" id="plan">
                <SectionHeader
                    icon="📅"
                    title="Tu Plan Día a Día"
                    subtitle="Haz clic en cada comida y ejercicio al completarlo. Tu progreso se guarda automáticamente."
                />
                <PlanDiario
                    profile={p}
                    routine={routine}
                    nutrition={nutrition}
                    sessionKey={sessionKey}
                    onProgressChange={handleProgressChange}
                />
            </Section>

            {/* ── SECTION 4 — Nutrición (Macro Cards) ────────────────────────────── */}
            <Section bg="gray" id="nutricion">
                <SectionHeader
                    icon="🔥"
                    title="Protocolo de Combustible"
                    subtitle={`${calories} kcal diarias — calculadas para tu sueño específico`}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <MacroCard
                        value={protein} unit="g" abbr="PRO"
                        label="Proteína" simpleName="Construcción de Músculo"
                        emoji="🥩" bg="#FEF2F2" accent="#DC2626"
                    />
                    <MacroCard
                        value={carbs} unit="g" abbr="CHO"
                        label="Carbohidratos" simpleName="Energía Principal"
                        emoji="🌾" bg="#FFFBEB" accent="#D97706"
                    />
                    <MacroCard
                        value={fats} unit="g" abbr="FAT"
                        label="Grasas Saludables" simpleName="Combustible Cerebral"
                        emoji="🥑" bg="#ECFDF5" accent="#059669"
                    />
                </div>

                {/* Electrolitos */}
                <div className="border-t border-neutral-100 pt-10">
                    <h3 className="text-sm font-medium text-neutral-700 mb-1 flex items-center gap-2">
                        <span>⚡</span> Cables Eléctricos <span className="text-[10px] font-normal text-neutral-400">(Electrolitos)</span>
                    </h3>
                    <p className="text-xs text-neutral-500 font-light mb-6">Sin esto, tu cuerpo no tiene chispa. Literalmente.</p>
                    <ElectrolytosWidget nutrientDensity={proto?.nutrientDensity} mission={p.mission} />
                </div>
            </Section>

            {/* ── SECTION 5 — La Trinidad de la Verdad ───────────────────────────── */}
            <Section bg="white" id="sabiduria">
                <SectionHeader
                    icon="✦"
                    title="La Trinidad de la Verdad"
                    subtitle="Cada decisión biológica, vista desde tres perspectivas universales"
                />

                {/* Key insights */}
                {proto?.keyInsights && proto.keyInsights.length > 0 && (
                    <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {proto.keyInsights.map((insight, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="border border-neutral-100 rounded-2xl p-5 bg-white">
                                <span className="text-xs font-semibold" style={{ color: theme.color }}>0{i + 1}</span>
                                <p className="text-xs font-light text-neutral-600 mt-2 leading-relaxed">{insight}</p>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="space-y-6">
                    {TEMPLO_LEYES.map((ley) => (
                        <TrinidadVerdad key={ley.ley} {...ley} />
                    ))}
                </div>

                {/* Revelación */}
                {proto?.wisdom && (
                    <div className="mt-10 max-w-md">
                        <RevelacionWrapper wisdom={proto.wisdom} missionColor={theme.color} />
                    </div>
                )}
            </Section>

            {/* ── SECTION 6 — Hábitos del Alma ────────────────────────────────── */}
            <Section bg="gray" id="habitos">
                <HabitosAlma
                    mission={p.mission}
                    biologicalSex={p.biologicalSex}
                    sessionKey={sessionKey}
                />
            </Section>

            {/* ── Footer ─────────────────────────────────────────────────────────── */}
            <footer className="bg-neutral-900 text-white px-6 py-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <p className="text-sm font-light tracking-[0.2em] uppercase">TEMPLO OS</p>
                        <p className="text-[10px] text-neutral-500 mt-1">Biología Divina · Tecnología Humana</p>
                    </div>
                    <p className="text-xs text-neutral-500 font-light italic max-w-xs text-center">
                        "{p.mainGoal || 'Mi sueño del alma'}"
                    </p>
                    <button onClick={resetProfile}
                        className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 hover:text-white transition-colors">
                        Reiniciar Protocolo →
                    </button>
                </div>
            </footer>
        </div>
    );
}
