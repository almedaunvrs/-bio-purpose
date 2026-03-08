'use client';

import { useUserStore } from '@/store/useUserStore';
import { calculateNutrition, getChrononutritionState } from '@/lib/algorithms';
import { getWorkoutRoutine } from '@/lib/workouts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function Dashboard() {
    const { profile, resetProfile } = useUserStore();

    if (!profile) return null;

    const nutrition = calculateNutrition(profile);
    const chrono = getChrononutritionState();
    const routine = getWorkoutRoutine(profile.mission);

    return (
        <div className="min-h-screen p-4 md:p-12 bg-background relative font-[family-name:var(--font-space-grotesk)] text-foreground">
            {/* Background Graphic - Dark Minimalist */}
            <div className="fixed top-0 left-0 w-1/3 h-full bg-primary/5 blur-[150px] -z-10 pointer-events-none" />

            <div className="max-w-6xl mx-auto space-y-16 relative z-10">

                {/* Minimalist Top Nav */}
                <header className="flex justify-between items-center border-b border-border/30 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-primary" />
                        <span className="font-[family-name:var(--font-anton)] text-2xl uppercase tracking-wider">Bio-Purpose</span>
                    </div>
                    <Button variant="ghost" onClick={resetProfile} className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-[0.2em]">
                        <LogOut className="w-4 h-4 mr-2" />
                        Exit
                    </Button>
                </header>

                {/* Main Title Area */}
                <section className="space-y-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium pl-1">
                        Status // {chrono.state}
                    </p>
                    <h1 className="text-6xl md:text-[6rem] leading-[0.85] font-[family-name:var(--font-anton)] uppercase tracking-tighter">
                        ESTADO <br />
                        <span className="text-muted-foreground">DEL TEMPLO</span>
                    </h1>
                    <p className="max-w-xl text-lg opacity-80 pt-4 border-l border-primary pl-6">
                        {chrono.message}
                    </p>
                </section>

                {/* Info Grid - Elegant Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 border-t border-border/30 pt-16">

                    {/* Nutrition Area */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="flex justify-between items-end border-b border-border/50 pb-4">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">Nutrición</h2>
                            <span className="text-xs font-mono text-muted-foreground">{nutrition.calories} KCAL</span>
                        </div>

                        <div className="grid grid-cols-3 gap-1">
                            <div className="bg-card/30 border border-border/30 p-6 flex flex-col items-center justify-center space-y-2">
                                <p className="text-3xl font-[family-name:var(--font-anton)] text-primary">{nutrition.proteinGrams}</p>
                                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">PRT (g)</p>
                            </div>
                            <div className="bg-card/30 border border-border/30 p-6 flex flex-col items-center justify-center space-y-2">
                                <p className="text-3xl font-[family-name:var(--font-anton)] text-primary">{nutrition.carbsGrams}</p>
                                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">CRB (g)</p>
                            </div>
                            <div className="bg-card/30 border border-border/30 p-6 flex flex-col items-center justify-center space-y-2">
                                <p className="text-3xl font-[family-name:var(--font-anton)] text-primary">{nutrition.fatsGrams}</p>
                                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">FAT (g)</p>
                            </div>
                        </div>

                        <Card className="bg-transparent border border-border/30 rounded-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Formulación</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] bg-primary/10 text-primary px-2 py-1">Lactose-Free</span>
                                </div>
                                <ul className="space-y-4 text-sm font-medium opacity-80">
                                    <li className="flex items-start gap-4">
                                        <span className="text-primary font-[family-name:var(--font-anton)]">01</span>
                                        <span>3 Comidas densas durante la fase de Festín.</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="text-primary font-[family-name:var(--font-anton)]">02</span>
                                        <span>Proteína magra y huevos enteros.</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="text-primary font-[family-name:var(--font-anton)]">03</span>
                                        <span>Carbohidratos limpios (Papa, Camote, Arroz).</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Routine Area */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex justify-between items-end border-b border-border/50 pb-4">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">Protocolo Físico</h2>
                            <span className="text-xs font-mono text-muted-foreground">MISIÓN: {profile.mission.toUpperCase()}</span>
                        </div>

                        <div className="space-y-4">
                            {routine.map((dayPlan, idx) => (
                                <div key={idx} className="group flex flex-col md:flex-row border border-border/30 bg-card/20 hover:bg-card/40 hover:border-border/60 transition-colors rounded-sm overflow-hidden">
                                    <div className="p-6 border-b md:border-b-0 md:border-r border-border/30 md:w-1/4 flex flex-col justify-between bg-black/20">
                                        <span className="font-[family-name:var(--font-anton)] text-4xl text-muted-foreground group-hover:text-primary transition-colors">{dayPlan.day.replace('Día ', 'D0')}</span>
                                        <span className="text-[10px] uppercase tracking-widest font-semibold mt-4">{dayPlan.focus}</span>
                                    </div>
                                    <div className="p-6 flex-1 space-y-4">
                                        {dayPlan.exercises.map((ex, i) => (
                                            <div key={i} className="flex justify-between items-start border-b border-border/10 pb-3 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="text-sm font-semibold uppercase tracking-wide">{ex.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{ex.notes}</p>
                                                </div>
                                                <div className="text-right pl-4">
                                                    <span className="text-[10px] font-mono tracking-widest text-primary font-bold">
                                                        {ex.sets} X {ex.reps}
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

                <footer className="pt-24 pb-8 border-t border-border/30 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    <span>BIO-PURPOSE // OS</span>
                    <span>DO NOT THINK TOO MUCH</span>
                </footer>
            </div>
        </div>
    );
}
