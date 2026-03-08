'use client';

import { useUserStore } from '@/store/useUserStore';
import { calculateNutrition, getChrononutritionState } from '@/lib/algorithms';
import { getWorkoutRoutine } from '@/lib/workouts';
import { LogOut, Diamond, Activity, Zap, Moon, Flame } from 'lucide-react';

const BODY_TYPE_LABEL: Record<string, string> = {
    ectomorfo: 'Ectomorfo',
    mesomorfo: 'Mesomorfo',
    endomorfo: 'Endomorfo',
};

const ACTIVITY_LABEL: Record<string, string> = {
    sedentario: 'Sedentario',
    moderado: 'Moderado',
    activo: 'Activo',
    muy_activo: 'Muy Activo',
};

const SLEEP_LABEL: Record<string, string> = {
    mala: 'Deficiente',
    regular: 'Regular',
    buena: 'Óptimo',
};

export function Dashboard() {
    const { profile, resetProfile } = useUserStore();

    if (!profile) return null;

    const nutrition = calculateNutrition(profile);
    const chrono = getChrononutritionState(profile.timezone);
    const routine = getWorkoutRoutine(profile.mission);

    // Use Gemini macros if available (more accurate), else fall back to local algorithm
    const calories = profile.geminiCalories ?? nutrition.calories;
    const protein = profile.geminiProtein ?? nutrition.proteinGrams;
    const carbs = profile.geminiCarbs ?? nutrition.carbsGrams;
    const fats = profile.geminiFats ?? nutrition.fatsGrams;

    return (
        <div className="min-h-screen p-4 md:p-12 bg-background relative font-[family-name:var(--font-space-grotesk)] text-foreground flex flex-col items-center">
            <div className="fixed top-0 inset-x-0 h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.04)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-7xl relative z-10">

                {/* Nav */}
                <header className="flex justify-between items-center border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                        <Diamond className="w-4 h-4 text-primary" strokeWidth={1.5} />
                        <span className="font-[family-name:var(--font-anton)] text-xl tracking-[0.2em] uppercase">TEMPLO</span>
                    </div>
                    <button onClick={resetProfile} className="text-[9px] uppercase tracking-[0.3em] font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                        Reiniciar <LogOut className="w-3 h-3" />
                    </button>
                </header>

                {/* Hero Section */}
                <section className="mt-20 mb-16 text-center">
                    <div className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-primary">Sincronización Viva // {chrono.state}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-[7rem] leading-[0.85] font-[family-name:var(--font-anton)] uppercase tracking-wide text-white/90">
                        Soberanía <br /><span className="text-white/30">Biológica</span>
                    </h1>
                    <p className="max-w-xl mx-auto text-sm opacity-70 mt-8 font-light leading-relaxed">
                        {chrono.message}
                    </p>
                </section>

                {/* Bio Snapshot Bar */}
                <div className="flex flex-wrap gap-3 justify-center mb-20">
                    {[
                        { icon: <Flame className="w-3 h-3" />, label: `${BODY_TYPE_LABEL[profile.bodyType]}` },
                        { icon: <Activity className="w-3 h-3" />, label: ACTIVITY_LABEL[profile.activityLevel] },
                        { icon: <Moon className="w-3 h-3" />, label: `Sueño ${SLEEP_LABEL[profile.sleepQuality]}` },
                        { icon: <Zap className="w-3 h-3" />, label: `Estrés ${profile.stressLevel}/10` },
                        { icon: <Diamond className="w-3 h-3" />, label: (profile.location || 'México').split(',')[0] },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 border border-white/10 bg-card/20 px-4 py-2 rounded-full text-xs text-muted-foreground font-medium">
                            <span className="text-primary">{item.icon}</span>
                            {item.label}
                        </div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Protocolo de Combustible */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="flex justify-between items-end border-b border-white/10 pb-4">
                            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] flex items-center gap-3">
                                <Activity className="w-4 h-4 text-primary" /> Protocolo de Combustible
                            </h2>
                            <span className="text-[10px] font-mono text-muted-foreground">{calories} KCAL</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'PRT (g)', val: protein },
                                { label: 'CRB (g)', val: carbs },
                                { label: 'FAT (g)', val: fats },
                            ].map(m => (
                                <div key={m.label} className="bg-card/30 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex flex-col items-center gap-2">
                                    <p className="text-3xl font-[family-name:var(--font-anton)] text-white">{m.val}</p>
                                    <p className="text-[9px] font-semibold uppercase tracking-widest text-primary">{m.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Bio context cards */}
                        <div className="bg-card/20 border border-white/5 rounded-2xl p-8 space-y-5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-semibold">Fundamentos</span>
                                <span className="text-[9px] uppercase tracking-[0.2em] border border-primary/30 text-primary px-3 py-1 rounded-full">Lactose-Free</span>
                            </div>
                            <ul className="space-y-5 text-sm font-light opacity-90">
                                <li className="flex gap-4">
                                    <span className="text-primary font-[family-name:var(--font-anton)] text-lg shrink-0">I</span>
                                    <span className="leading-relaxed">Alimentos en su estado original. Si el hombre lo procesó, es interferencia.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-primary font-[family-name:var(--font-anton)] text-lg shrink-0">II</span>
                                    <span className="leading-relaxed">
                                        {profile.bodyType === 'ectomorfo' && 'Ectomorfo: mayor densidad calórica y carbohidratos complejos para activar la síntesis muscular.'}
                                        {profile.bodyType === 'mesomorfo' && 'Mesomorfo: equilibrio entre proteína de calidad y carbohidratos de bajo índice glucémico.'}
                                        {profile.bodyType === 'endomorfo' && 'Endomorfo: menor carga de carbohidratos, mayor protocolo de grasas saludables y ayuno estratégico.'}
                                    </span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-primary font-[family-name:var(--font-anton)] text-lg shrink-0">III</span>
                                    <span className="leading-relaxed">
                                        {profile.sleepQuality === 'buena' && 'Sueño óptimo detectado. Ventanas anabólicas al máximo.'}
                                        {profile.sleepQuality === 'regular' && 'Sueño regular. Se prioriza proteína post-entrenamiento para compensar la recuperación.'}
                                        {profile.sleepQuality === 'mala' && 'Sueño deficiente. Protocolo reforzado de proteína y reducción del estrés oxidativo.'}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Optimización Mecánica */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex justify-between items-end border-b border-white/10 pb-4">
                            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] flex items-center gap-3">
                                <Zap className="w-4 h-4 text-primary" /> Optimización Mecánica
                            </h2>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">
                                MISIÓN: {profile.mission}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {routine.map((dayPlan, idx) => (
                                <div key={idx} className="group relative bg-card/10 border border-white/5 rounded-3xl p-7 hover:bg-card/30 hover:border-white/20 transition-all duration-500 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/15 transition-colors duration-700" />
                                    <div className="flex items-baseline justify-between mb-6 relative z-10">
                                        <span className="font-[family-name:var(--font-anton)] text-4xl text-white/20 group-hover:text-primary/60 transition-colors duration-500">
                                            {dayPlan.day.replace('Día ', '0')}
                                        </span>
                                        <span className="text-[9px] uppercase tracking-[0.2em] font-semibold">{dayPlan.focus}</span>
                                    </div>
                                    <div className="space-y-3.5 relative z-10">
                                        {dayPlan.exercises.map((ex, i) => (
                                            <div key={i} className="flex justify-between items-start border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                                <div className="pr-4">
                                                    <p className="text-sm font-medium uppercase tracking-wide text-white/90">{ex.name}</p>
                                                    <p className="text-[10px] text-muted-foreground mt-1">{ex.notes}</p>
                                                </div>
                                                <span className="shrink-0 text-[9px] font-mono tracking-[0.2em] text-primary bg-primary/10 px-2 py-1 rounded-sm mt-0.5">
                                                    {ex.sets}X{ex.reps}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Gemini AI Insights — only shown if available */}
                {(profile.geminiMissionReason || profile.geminiInsights?.length || profile.geminiFirstAction) && (
                    <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {profile.geminiMissionReason && (
                            <div className="lg:col-span-7 bg-card/10 border border-primary/10 rounded-3xl p-8">
                                <div className="flex items-center gap-3 mb-5">
                                    <Diamond className="w-4 h-4 text-primary" strokeWidth={1.5} />
                                    <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-primary">Diagnóstico TEMPLO OS</span>
                                </div>
                                <p className="text-sm font-light leading-relaxed text-white/80">{profile.geminiMissionReason}</p>
                            </div>
                        )}

                        {profile.geminiInsights && profile.geminiInsights.length > 0 && (
                            <div className="lg:col-span-5 space-y-4">
                                <div className="flex items-center gap-3 mb-5">
                                    <Zap className="w-4 h-4 text-primary" strokeWidth={1.5} />
                                    <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-primary">Insights Biológicos</span>
                                </div>
                                {profile.geminiInsights.map((insight, i) => (
                                    <div key={i} className="flex gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                        <span className="font-[family-name:var(--font-anton)] text-primary text-lg shrink-0">{i + 1}</span>
                                        <p className="text-xs font-light leading-relaxed text-white/70">{insight}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {profile.geminiFirstAction && (
                            <div className="lg:col-span-12 bg-primary/5 border border-primary/20 rounded-3xl p-8 flex items-start gap-6">
                                <Flame className="w-6 h-6 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-primary mb-2">Tu Primera Acción — Mañana al Despertar</p>
                                    <p className="text-sm font-light leading-relaxed text-white/90">{profile.geminiFirstAction}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <footer className="mt-32 pt-12 pb-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground gap-4">
                    <span>TEMPLO // ORIGINAL DESIGN</span>
                    <span>FUTURE HUMAN</span>
                </footer>
            </div>
        </div>
    );
}
