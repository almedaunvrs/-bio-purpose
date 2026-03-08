'use client';

import { useUserStore } from '@/store/useUserStore';
import { calculateNutrition, getChrononutritionState } from '@/lib/algorithms';
import { getWorkoutRoutine } from '@/lib/workouts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SunMoon, Dumbbell, Utensils, Zap, LogOut } from 'lucide-react';

export function Dashboard() {
    const { profile, resetProfile } = useUserStore();

    if (!profile) return null;

    const nutrition = calculateNutrition(profile);
    const chrono = getChrononutritionState();
    const routine = getWorkoutRoutine(profile.mission);

    return (
        <div className="min-h-screen p-4 md:p-8 bg-background relative overflow-hidden">
            {/* Aesthetic Background */}
            <div className="absolute top-0 right-0 p-40 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-0 p-40 bg-secondary/10 rounded-full blur-3xl opacity-50" />

            <div className="max-w-5xl mx-auto space-y-8 relative z-10">

                {/* Header Row */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-light text-foreground tracking-tight flex items-center gap-3">
                            <SunMoon className="w-10 h-10 text-primary" />
                            Estado del Templo
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Operando en fase de <span className="text-primary font-semibold">{chrono.state}</span>.
                        </p>
                    </div>
                    <Button variant="ghost" onClick={resetProfile} className="text-muted-foreground hover:text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Reiniciar
                    </Button>
                </div>

                {/* Chrono Alert */}
                <Card className="bg-secondary/10 border-secondary/20 shadow-xl backdrop-blur-md">
                    <CardContent className="p-6 md:p-8 flex items-start gap-4">
                        <Zap className="w-8 h-8 text-secondary shrink-0 mt-1" />
                        <div>
                            <h3 className="text-2xl font-medium text-foreground mb-2">Fase de {chrono.state}</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">{chrono.message}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Nutrition Column */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-light flex items-center gap-2">
                            <Utensils className="w-6 h-6 text-primary" />
                            Nutrición Ancestral
                        </h2>
                        <Card className="bg-card/40 backdrop-blur-md border-primary/20">
                            <CardHeader>
                                <CardTitle>Macros Diarios ({nutrition.calories} kcal)</CardTitle>
                                <CardDescription>Para misión: {profile.mission.toUpperCase()} (100% Sin Lactosa)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
                                        <p className="text-2xl font-semibold text-primary">{nutrition.proteinGrams}g</p>
                                        <p className="text-xs text-muted-foreground mt-1">Proteína</p>
                                    </div>
                                    <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
                                        <p className="text-2xl font-semibold text-primary">{nutrition.carbsGrams}g</p>
                                        <p className="text-xs text-muted-foreground mt-1">Carbos</p>
                                    </div>
                                    <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
                                        <p className="text-2xl font-semibold text-primary">{nutrition.fatsGrams}g</p>
                                        <p className="text-xs text-muted-foreground mt-1">Grasas</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20 text-sm">
                                    <p className="font-semibold text-foreground mb-1">Estructura Sugerida:</p>
                                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                        <li>3 Comidas densas durante la fase de Festín.</li>
                                        <li>Proteína magra y huevos (cuidado si hay intolerancia cruzada).</li>
                                        <li>Carbohidratos de tierra (Papa, Camote, Arroz blanco).</li>
                                        <li>Grasas funcionales (Aguacate, Aceite de Oliva, Nueces).</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Routine Column */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-light flex items-center gap-2">
                            <Dumbbell className="w-6 h-6 text-primary" />
                            Templo en Movimiento
                        </h2>
                        <div className="space-y-4">
                            {routine.map((dayPlan, idx) => (
                                <Card key={idx} className="bg-card/40 backdrop-blur-md border-primary/10 hover:border-primary/30 transition-all">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg text-primary">{dayPlan.day}</CardTitle>
                                        <CardDescription>{dayPlan.focus}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {dayPlan.exercises.map((ex, i) => (
                                                <div key={i} className="flex justify-between items-center text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
                                                    <div>
                                                        <p className="font-medium text-foreground">{ex.name}</p>
                                                        <p className="text-xs text-muted-foreground">{ex.notes}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="bg-background px-2 py-1 rounded border border-border">
                                                            {ex.sets} x {ex.reps}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
