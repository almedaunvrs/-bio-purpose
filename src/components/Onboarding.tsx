'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Mission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Target } from 'lucide-react';

export function Onboarding() {
    const setProfile = useUserStore((state) => state.setProfile);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        age: '24',
        heightCm: '168',
        weightKg: '58',
        goalWeightKg: '65',
        bodyFatPercentage: '12',
        mission: 'atleta' as Mission,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleNext = () => setStep(prev => prev + 1);

    const handleComplete = () => {
        setProfile({
            age: Number(formData.age),
            heightCm: Number(formData.heightCm),
            weightKg: Number(formData.weightKg),
            goalWeightKg: Number(formData.goalWeightKg),
            bodyFatPercentage: Number(formData.bodyFatPercentage),
            mission: formData.mission,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Aesthetic Background Elements */}
            <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 p-32 bg-secondary/10 rounded-full blur-3xl" />

            <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl border-primary/20 shadow-2xl relative z-10">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-light text-foreground tracking-tight flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        Templo en Movimiento
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-md">
                        El primer paso hacia el diseño funcional de tu biología.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="age">Edad (Años)</Label>
                                            <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} className="bg-background/50 border-primary/30 focus-visible:ring-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="heightCm">Estatura (cm)</Label>
                                            <Input id="heightCm" name="heightCm" type="number" value={formData.heightCm} onChange={handleChange} className="bg-background/50 border-primary/30 focus-visible:ring-primary" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="weightKg">Peso Actual (kg)</Label>
                                            <Input id="weightKg" name="weightKg" type="number" value={formData.weightKg} onChange={handleChange} className="bg-background/50 border-primary/30 focus-visible:ring-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="goalWeightKg">Meta (kg)</Label>
                                            <Input id="goalWeightKg" name="goalWeightKg" type="number" value={formData.goalWeightKg} onChange={handleChange} className="bg-background/50 border-primary/30 focus-visible:ring-primary" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bodyFatPercentage">% Grasa Corporal / Muscular</Label>
                                        <Input id="bodyFatPercentage" name="bodyFatPercentage" type="number" value={formData.bodyFatPercentage} onChange={handleChange} className="bg-background/50 border-primary/30 focus-visible:ring-primary" />
                                        <p className="text-xs text-muted-foreground">Si no lo sabes exacto, pon un estimado (Ej. 12-15%)</p>
                                    </div>

                                    <Button onClick={handleNext} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6 shadow-lg shadow-primary/20">
                                        Siguiente <Target className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-lg">Selecciona tu Misión / Sueño</Label>
                                        <Select defaultValue={formData.mission} onValueChange={(val) => { if (val) setFormData(p => ({ ...p, mission: val as Mission })) }}>
                                            <SelectTrigger className="w-full h-14 bg-background/50 border-primary/30">
                                                <SelectValue placeholder="Elige tu sueño..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="explorador">Explorador / Viajero (Resistencia y Energía)</SelectItem>
                                                <SelectItem value="atleta">Atleta Alto Rendimiento (Explosividad e Hipertrofia)</SelectItem>
                                                <SelectItem value="lider">Líder Creativo (Enfoque Mental y Neuro-protección)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="p-4 bg-secondary/20 rounded-xl border border-secondary/30 mt-4 flex gap-3 text-sm">
                                        <Activity className="w-8 h-8 text-primary flex-shrink-0" />
                                        <div>
                                            <span className="font-semibold text-foreground">El plan será 100% Lactose-Free.</span>
                                            <p className="text-muted-foreground mt-1">Generaremos protocolos de nutrición y entrenamiento para optimizar tu biología hacia tu propósito.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button variant="outline" onClick={() => setStep(1)} className="w-1/3 border-primary/30">Atrás</Button>
                                        <Button onClick={handleComplete} className="w-2/3 bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                            Entrar al Templo
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
}
