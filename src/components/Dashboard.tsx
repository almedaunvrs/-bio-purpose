'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '@/store/useUserStore';
import { calculateNutrition } from '@/lib/algorithms';
import { getWorkoutRoutine } from '@/lib/workouts';
import { MISSION_THEMES, UserProfile } from '@/lib/types';
import { ChronoTimeline } from './ChronoTimeline';
import { TrinidadVerdad, TEMPLO_LEYES } from './TrinidadVerdad';
import { ElectrolytosWidget } from './ElectrolytosWidget';
import { BisetCard } from './BisetCard';
import { RevelacionWrapper } from './RevelacionWrapper';

const STAGGER = {
    container: { transition: { staggerChildren: 0.1 } },
    item: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
};

const ACTIVITY_LABEL: Record<string, string> = {
    sedentario: 'Sedentario', moderado: 'Moderado', activo: 'Activo', muy_activo: 'Muy Activo',
};

export function Dashboard() {
    const { profile, resetProfile } = useUserStore();
    if (!profile) return null;

    const p = profile as UserProfile;
    const theme = MISSION_THEMES[p.mission];
    const proto = p.geminiProtocol;
    const nutrition = calculateNutrition(p);
    const routine = getWorkoutRoutine(p.mission);

    // Use Gemini macros if available
    const calories = proto?.calories ?? nutrition.calories;
    const protein = proto?.proteinGrams ?? nutrition.proteinGrams;
    const carbs = proto?.carbsGrams ?? nutrition.carbsGrams;
    const fats = proto?.fatsGrams ?? nutrition.fatsGrams;

    const macros = [
        { label: 'Proteína', value: protein, unit: 'g', abbr: 'PRO' },
        { label: 'Carbohidratos', value: carbs, unit: 'g', abbr: 'CHO' },
        { label: 'Grasas', value: fats, unit: 'g', abbr: 'FAT' },
    ];

    return (
        <div className="min-h-screen bg-white text-neutral-900 font-[family-name:var(--font-inter)]">

            {/* Top Nav */}
            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neutral-800">TEMPLO OS</span>
                        <span className="w-px h-4 bg-neutral-200" />
                        <span
                            className="text-[10px] font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                            style={{ color: theme.color, backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}
                        >
                            {theme.label}
                        </span>
                    </div>
                    <button
                        onClick={resetProfile}
                        className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 hover:text-neutral-700 transition-colors font-medium"
                    >
                        Reiniciar Protocolo →
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-16 space-y-24">

                {/* Hero */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center space-y-6 pt-8"
                >
                    <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 font-medium">
                        TEMPLO OS // Soberanía Biológica
                    </p>
                    <h1 className="text-5xl md:text-7xl font-extralight text-neutral-900 leading-[0.9] tracking-tight">
                        Reclama tu<br />
                        <span style={{ color: theme.color }}>Soberanía</span><br />
                        Biológica
                    </h1>
                    <p className="max-w-lg mx-auto text-sm font-light text-neutral-500 leading-relaxed">
                        El manual de instrucciones del Creador, decodificado por IA.
                    </p>

                    {/* Dream display */}
                    {p.mainGoal && (
                        <div className="max-w-xl mx-auto border border-neutral-100 rounded-2xl px-6 py-4 bg-neutral-50/50 mt-4">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 mb-2">Tu sueño del alma</p>
                            <p className="text-sm font-light text-neutral-700 italic leading-relaxed">"{p.mainGoal}"</p>
                        </div>
                    )}
                </motion.section>

                {/* Mission Diagnosis */}
                {proto?.missionReason && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div
                            className="rounded-3xl p-10 border"
                            style={{ backgroundColor: theme.bg, borderColor: theme.border }}
                        >
                            <p
                                className="text-[9px] uppercase tracking-[0.35em] font-semibold mb-4"
                                style={{ color: theme.color }}
                            >
                                Diagnóstico TEMPLO OS
                            </p>
                            <p className="text-base font-light leading-relaxed text-neutral-700 max-w-3xl">
                                {proto.missionReason}
                            </p>
                            {proto.biologicalContext && (
                                <p className="text-xs font-light leading-relaxed text-neutral-500 max-w-3xl mt-4 pt-4 border-t border-neutral-200">
                                    {proto.biologicalContext}
                                </p>
                            )}
                        </div>
                    </motion.section>
                )}

                {/* Revelation Button */}
                {proto?.wisdom && (
                    <div className="max-w-md">
                        <RevelacionWrapper wisdom={proto.wisdom} missionColor={theme.color} />
                    </div>
                )}

                {/* Main Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT — Combustible */}
                    <div className="lg:col-span-5 space-y-10">

                        {/* Section label */}
                        <div className="border-b border-neutral-100 pb-4 flex justify-between items-end">
                            <h2 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-semibold">
                                Protocolo de Combustible
                            </h2>
                            <span className="font-mono text-xs text-neutral-500">{calories} kcal/día</span>
                        </div>

                        {/* Macros */}
                        <motion.div
                            variants={STAGGER.container}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-3 gap-3"
                        >
                            {macros.map((m) => (
                                <motion.div
                                    key={m.abbr}
                                    variants={STAGGER.item}
                                    className="border border-neutral-100 rounded-2xl p-5 text-center hover:border-neutral-200 hover:shadow-sm transition-all"
                                >
                                    <p className="text-2xl font-light text-neutral-900">{m.value}</p>
                                    <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-400 mt-1">{m.unit}</p>
                                    <p
                                        className="text-[8px] font-semibold mt-2 uppercase tracking-[0.15em]"
                                        style={{ color: theme.color }}
                                    >
                                        {m.abbr}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Bio stats */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            {[
                                { label: 'Peso actual', value: `${p.weightKg} kg` },
                                { label: 'Meta biológica', value: `${proto?.goalWeightKg ?? p.goalWeightKg} kg` },
                                { label: 'Grasa corporal meta', value: `${proto?.targetBodyFatPercent ?? p.bodyFatPercentage}%` },
                                { label: 'Actividad', value: ACTIVITY_LABEL[p.activityLevel] },
                            ].map((stat) => (
                                <div key={stat.label} className="border border-neutral-100 rounded-xl p-4">
                                    <p className="text-[9px] text-neutral-400 uppercase tracking-[0.2em] font-medium">{stat.label}</p>
                                    <p className="text-sm font-light text-neutral-800 mt-1">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Electrolytes */}
                        <div className="border-t border-neutral-100 pt-8">
                            <ElectrolytosWidget
                                nutrientDensity={proto?.nutrientDensity}
                                mission={p.mission}
                            />
                        </div>
                    </div>

                    {/* RIGHT — Movement & Chrono */}
                    <div className="lg:col-span-7 space-y-10">

                        {/* Chrono Timeline */}
                        <div>
                            <div className="border-b border-neutral-100 pb-4 mb-6">
                                <h2 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-semibold">
                                    Cronobiología en Vivo
                                </h2>
                            </div>
                            <ChronoTimeline currentAction={proto?.chronoGuidance?.action} />
                        </div>

                        {/* Key Insights */}
                        {proto?.keyInsights && proto.keyInsights.length > 0 && (
                            <div>
                                <div className="border-b border-neutral-100 pb-4 mb-6">
                                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-semibold">
                                        Insights Biológicos
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {proto.keyInsights.map((insight, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 + 0.3 }}
                                            className="flex gap-5 border-b border-neutral-100 pb-4 last:border-0 last:pb-0"
                                        >
                                            <span
                                                className="text-sm font-light shrink-0 w-5 text-right"
                                                style={{ color: theme.color }}
                                            >
                                                {i + 1}
                                            </span>
                                            <p className="text-xs font-light leading-relaxed text-neutral-600">{insight}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* First Action */}
                        {proto?.firstAction && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="border rounded-2xl p-6"
                                style={{ borderColor: theme.border, backgroundColor: theme.bg }}
                            >
                                <p
                                    className="text-[9px] uppercase tracking-[0.3em] font-semibold mb-3"
                                    style={{ color: theme.color }}
                                >
                                    Tu Primera Acción — Mañana al Despertar
                                </p>
                                <p className="text-sm font-light text-neutral-700 leading-relaxed">{proto.firstAction}</p>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Optimización Mecánica — Biset Cards */}
                <section>
                    <div className="border-b border-neutral-100 pb-4 mb-10 flex justify-between items-end">
                        <h2 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-semibold">
                            Optimización Mecánica
                        </h2>
                        <span
                            className="text-[9px] uppercase tracking-[0.2em] font-medium"
                            style={{ color: theme.color }}
                        >
                            {theme.label}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {routine.map((dayPlan, idx) => (
                            <BisetCard
                                key={idx}
                                day={dayPlan.day}
                                focus={dayPlan.focus}
                                exercises={dayPlan.exercises}
                                missionColor={theme.color}
                                index={idx}
                            />
                        ))}
                    </div>
                </section>

                {/* La Trinidad de la Verdad */}
                <section>
                    <div className="border-b border-neutral-100 pb-4 mb-10">
                        <h2 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-semibold">
                            La Trinidad de la Verdad
                        </h2>
                        <p className="text-xs font-light text-neutral-500 mt-1">
                            Cada ley, vista desde el diseño divino, la evidencia científica y el principio universal.
                        </p>
                    </div>
                    <div className="space-y-6">
                        {TEMPLO_LEYES.map((ley) => (
                            <TrinidadVerdad key={ley.ley} {...ley} />
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-neutral-100 pt-12 pb-8 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.4em] text-neutral-400 gap-4">
                    <span>TEMPLO OS // Original Design</span>
                    <span>Biología Divina · Tecnología Humana</span>
                    <span>Future Human</span>
                </footer>

            </main>
        </div>
    );
}
