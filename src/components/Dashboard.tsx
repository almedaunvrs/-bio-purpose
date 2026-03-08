'use client';

import { useUserStore } from '@/store/useUserStore';
import { calculateNutrition, getChrononutritionState } from '@/lib/algorithms';
import { getWorkoutRoutine } from '@/lib/workouts';
import { LogOut, Diamond, Activity, Zap } from 'lucide-react';

export function Dashboard() {
    const { profile, resetProfile } = useUserStore();

    if (!profile) return null;

    const nutrition = calculateNutrition(profile);
    const chrono = getChrononutritionState();
    const routine = getWorkoutRoutine(profile.mission);

    return (
        <div className="min-h-screen p-4 md:p-12 bg-background relative font-[family-name:var(--font-space-grotesk)] text-foreground flex flex-col items-center">
            {/* Absolute Background Elements for Luxury Glassmorphism */}
            <div className="fixed top-0 inset-x-0 h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-1/3 h-1/3 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-7xl relative z-10">

                {/* Sleek Top Navigation */}
                <header className="flex justify-between items-center border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                        <Diamond className="w-4 h-4 text-primary" strokeWidth={1.5} />
                        <span className="font-[family-name:var(--font-anton)] text-xl tracking-[0.2em] uppercase">TEMPLO</span>
                    </div>

                    <button
                        onClick={resetProfile}
                        className="text-[9px] uppercase tracking-[0.3em] font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                    >
                        Cerrar Sesión <LogOut className="w-3 h-3" />
                    </button>
                </header>

                {/* Main Status Area */}
                <section className="mt-20 mb-24 text-center">
                    <div className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-primary">Sincronización Viva // {chrono.state}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-[7rem] leading-[0.85] font-[family-name:var(--font-anton)] uppercase tracking-wide text-white/90">
                        Soberanía <br />
                        <span className="text-white/40">Biológica</span>
                    </h1>

                    <p className="max-w-xl mx-auto text-sm md:text-base opacity-70 mt-8 font-light leading-relaxed">
                        {chrono.message}
                    </p>
                </section>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Protocolo de Combustible (Nutrition) */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="flex justify-between items-end border-b border-white/10 pb-4">
                            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] flex items-center gap-3">
                                <Activity className="w-4 h-4 text-primary" />
                                Protocolo de Combustible
                            </h2>
                            <span className="text-[10px] font-mono text-muted-foreground">REQ. DIARIO: {nutrition.calories} KCAL</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-card/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                                <p className="text-4xl font-[family-name:var(--font-anton)] text-white">{nutrition.proteinGrams}</p>
                                <p className="text-[9px] font-semibold uppercase tracking-widest text-primary">PRT (g)</p>
                            </div>
                            <div className="bg-card/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                                <p className="text-4xl font-[family-name:var(--font-anton)] text-white">{nutrition.carbsGrams}</p>
                                <p className="text-[9px] font-semibold uppercase tracking-widest text-primary">CRB (g)</p>
                            </div>
                            <div className="bg-card/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                                <p className="text-4xl font-[family-name:var(--font-anton)] text-white">{nutrition.fatsGrams}</p>
                                <p className="text-[9px] font-semibold uppercase tracking-widest text-primary">FAT (g)</p>
                            </div>
                        </div>

                        <div className="bg-card/20 backdrop-blur-sm border border-white/5 rounded-2xl p-8">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-semibold">Fundamentos</span>
                                <span className="text-[9px] uppercase tracking-[0.2em] border border-primary/30 text-primary px-3 py-1 rounded-full">Lactose-Free</span>
                            </div>
                            <ul className="space-y-6 text-sm font-light opacity-90">
                                <li className="flex items-start gap-4">
                                    <span className="text-primary font-[family-name:var(--font-anton)] text-lg">I</span>
                                    <span className="leading-relaxed">Honra la creación consumiendo alimentos en su estado original. Si el hombre lo procesó, es interferencia.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-primary font-[family-name:var(--font-anton)] text-lg">II</span>
                                    <span className="leading-relaxed">Sincroniza el consumo con la luz solar. 3 Protocolos de Combustible diarios durante la fase de Festín.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-primary font-[family-name:var(--font-anton)] text-lg">III</span>
                                    <span className="leading-relaxed">Canales limpios. Cero impacto inflamatorio lácteo.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Optimización Mecánica (Workouts) */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex justify-between items-end border-b border-white/10 pb-4">
                            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] flex items-center gap-3">
                                <Zap className="w-4 h-4 text-primary" />
                                Optimización Mecánica
                            </h2>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">
                                CALIBRACIÓN: {profile.mission}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {routine.map((dayPlan, idx) => (
                                <div key={idx} className="group relative bg-card/10 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-card/30 hover:border-white/20 transition-all duration-500 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/20 transition-colors duration-700" />

                                    <div className="flex items-center justify-between mb-6 relative z-10">
                                        <span className="font-[family-name:var(--font-anton)] text-4xl text-white/20 group-hover:text-primary transition-colors duration-500">
                                            {dayPlan.day.replace('Día ', '0')}
                                        </span>
                                        <span className="text-[9px] uppercase tracking-[0.2em] font-semibold border-b border-white/20 pb-1">
                                            {dayPlan.focus}
                                        </span>
                                    </div>

                                    <div className="space-y-4 relative z-10">
                                        {dayPlan.exercises.map((ex, i) => (
                                            <div key={i} className="flex justify-between items-start border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                                <div className="pr-4">
                                                    <p className="text-sm font-medium uppercase tracking-wide text-white/90">{ex.name}</p>
                                                    <p className="text-[10px] text-muted-foreground mt-1 opacity-70">{ex.notes}</p>
                                                </div>
                                                <div className="shrink-0 pt-1">
                                                    <span className="text-[9px] font-mono tracking-[0.2em] text-primary bg-primary/10 px-2 py-1 rounded-sm">
                                                        {ex.sets}X{ex.reps}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <footer className="mt-32 pt-12 pb-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground gap-4">
                    <span>TEMPLO // ORIGINAL DESIGN</span>
                    <span>FUTURE HUMAN</span>
                </footer>
            </div>
        </div>
    );
}
