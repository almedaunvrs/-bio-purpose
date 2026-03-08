'use client';

import { useUserStore } from '@/store/useUserStore';
import { calculateNutrition, getChrononutritionState } from '@/lib/algorithms';
import { getWorkoutRoutine } from '@/lib/workouts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SunMoon, Dumbbell, Utensils, Zap, LogOut } from 'lucide-react';

export function Dashboard() {
    const { profile, resetProfile } = useUserStore();

    if (!profile) return null;

    const nutrition = calculateNutrition(profile);
    const chrono = getChrononutritionState();
    const routine = getWorkoutRoutine(profile.mission);

    return (
        <div className="min-h-screen p-4 md:p-8 bg-background relative overflow-hidden font-[family-name:var(--font-space-grotesk)]">
            {/* Aesthetic Streetwear Background Elements */}
            <div className="fixed top-1/2 left-10 opacity-5 font-[family-name:var(--font-anton)] text-[12rem] tracking-tighter mix-blend-multiply pointer-events-none -translate-y-1/2 whitespace-nowrap rotate-90 origin-left">
                BIO-PURPOSE
            </div>

            <div className="max-w-6xl mx-auto space-y-10 relative z-10 pt-4">

                {/* Header Row Brutalist */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-foreground pb-6">
                    <div className="space-y-2">
                        <div className="inline-block bg-accent px-3 py-1 border-2 border-foreground font-bold text-xs uppercase tracking-widest shadow-[2px_2px_0px_#000]">
                            SYSTEM V1.0
                        </div>
                        <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-anton)] text-foreground tracking-tighter uppercase flex items-center gap-4">
                            <SunMoon className="w-12 h-12 md:w-16 md:h-16 text-primary" strokeWidth={3} />
                            ESTADO DEL TEMPLO
                        </h1>
                        <p className="text-foreground tracking-widest font-bold uppercase mt-2 text-sm">
                            Operando en fase biológica: <span className="bg-primary text-primary-foreground px-2 py-1 mx-1 border-2 border-foreground">{chrono.state}</span>
                        </p>
                    </div>
                    <Button onClick={resetProfile} className="bg-background text-foreground hover:bg-destructive hover:text-destructive-foreground border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all uppercase font-bold tracking-widest h-12">
                        <LogOut className="w-4 h-4 mr-2" strokeWidth={3} />
                        Reiniciar Sistema
                    </Button>
                </div>

                {/* Chrono Alert - Sticker Style */}
                <div className="bg-secondary border-4 border-foreground shadow-[8px_8px_0px_#000] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
                    {/* Tape visual effect */}
                    <div className="absolute top-0 right-10 w-16 h-8 bg-background/50 border-x-2 border-b-2 border-foreground -translate-y-2 rotate-6 opacity-30" />
                    <div className="absolute top-0 left-20 w-16 h-8 bg-background/50 border-x-2 border-b-2 border-foreground -translate-y-2 -rotate-3 opacity-30" />

                    <div className="bg-foreground text-background p-4 flex-shrink-0 animate-pulse">
                        <Zap className="w-10 h-10" strokeWidth={3} />
                    </div>
                    <div>
                        <h3 className="text-4xl font-[family-name:var(--font-anton)] text-foreground tracking-wide uppercase">Fase de {chrono.state}</h3>
                        <p className="text-foreground mt-2 font-bold max-w-2xl text-lg uppercase leading-snug">{chrono.message}</p>
                    </div>
                </div>

                {/* Info Grid - Brutalist Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Nutrition Column (Receipt Style) */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-[family-name:var(--font-anton)] uppercase tracking-wide flex items-center gap-3">
                            <Utensils className="w-8 h-8 text-primary" strokeWidth={3} />
                            Nutrición
                        </h2>
                        <Card className="bg-card border-4 border-foreground rounded-none shadow-[8px_8px_0px_#000] p-0 font-mono">
                            <div className="bg-foreground text-background p-4 border-b-4 border-foreground flex justify-between uppercase font-bold text-xs tracking-widest">
                                <span>MACROS DIARIOS ({nutrition.calories} KCAL)</span>
                                <span>SYS. REQ</span>
                            </div>
                            <CardContent className="p-6 md:p-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-20">
                                <div className="inline-block bg-accent px-3 py-1 border-2 border-foreground font-bold text-xs uppercase shadow-[2px_2px_0px_#000] mb-4">
                                    Misión: {profile.mission} | 100% Lactose-Free
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-background border-2 border-foreground shadow-[4px_4px_0px_#000]">
                                        <p className="text-4xl font-[family-name:var(--font-anton)] text-primary">{nutrition.proteinGrams}g</p>
                                        <p className="text-xs font-bold text-foreground mt-2 uppercase tracking-widest border-t-2 border-foreground pt-2">Proteína</p>
                                    </div>
                                    <div className="p-4 bg-background border-2 border-foreground shadow-[4px_4px_0px_#000]">
                                        <p className="text-4xl font-[family-name:var(--font-anton)] text-primary">{nutrition.carbsGrams}g</p>
                                        <p className="text-xs font-bold text-foreground mt-2 uppercase tracking-widest border-t-2 border-foreground pt-2">Carbos</p>
                                    </div>
                                    <div className="p-4 bg-background border-2 border-foreground shadow-[4px_4px_0px_#000]">
                                        <p className="text-4xl font-[family-name:var(--font-anton)] text-primary">{nutrition.fatsGrams}g</p>
                                        <p className="text-xs font-bold text-foreground mt-2 uppercase tracking-widest border-t-2 border-foreground pt-2">Grasas</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-secondary border-2 border-foreground shadow-[4px_4px_0px_#000] mt-8 text-sm">
                                    <p className="font-[family-name:var(--font-anton)] text-2xl text-foreground mb-4 uppercase">Estructura Sugerida:</p>
                                    <ul className="list-square pl-6 space-y-3 font-bold uppercase text-xs tracking-wide">
                                        <li className="marker:text-primary">3 Comidas densas durante la fase de Festín.</li>
                                        <li className="marker:text-primary">Proteína magra y huevos (Cuidado intolerancia).</li>
                                        <li className="marker:text-primary">Carbohidratos de tierra (Papa, Camote, Arroz).</li>
                                        <li className="marker:text-primary">Grasas funcionales (Aguacate, Aceite, Nueces).</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Routine Column */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-[family-name:var(--font-anton)] uppercase tracking-wide flex items-center gap-3">
                            <Dumbbell className="w-8 h-8 text-primary" strokeWidth={3} />
                            Protocolo Físico
                        </h2>
                        <div className="space-y-6">
                            {routine.map((dayPlan, idx) => (
                                <Card key={idx} className="bg-card border-4 border-foreground rounded-none shadow-[8px_8px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_#000] transition-all">
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="bg-primary text-primary-foreground p-4 border-b-4 sm:border-b-0 sm:border-r-4 border-foreground flex items-center justify-center min-w-[100px]">
                                            <h3 className="text-4xl font-[family-name:var(--font-anton)] -rotate-90 sm:rotate-0 tracking-widest">{dayPlan.day.replace('Día ', 'D0')}</h3>
                                        </div>
                                        <div className="p-6 flex-1">
                                            <div className="mb-4">
                                                <span className="bg-background border-2 border-foreground px-2 py-1 text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_#000]">Focus</span>
                                                <p className="font-bold text-lg uppercase mt-2">{dayPlan.focus}</p>
                                            </div>
                                            <div className="space-y-3 font-mono text-sm border-t-2 border-foreground pt-4">
                                                {dayPlan.exercises.map((ex, i) => (
                                                    <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b-2 border-foreground/20 pb-2 last:border-0 last:pb-0">
                                                        <div>
                                                            <p className="font-bold uppercase">{ex.name}</p>
                                                            <p className="text-xs font-bold text-muted-foreground">{ex.notes}</p>
                                                        </div>
                                                        <div className="sm:text-right shrink-0">
                                                            <span className="inline-block bg-foreground text-background px-2 py-1 font-bold">
                                                                {ex.sets} X {ex.reps}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
