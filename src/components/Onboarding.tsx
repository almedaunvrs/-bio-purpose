'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Mission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-background font-mono relative overflow-hidden font-[family-name:var(--font-space-grotesk)] text-foreground">
            {/* Elegant background typography - very subtle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] font-[family-name:var(--font-anton)] text-[20vw] tracking-tighter pointer-events-none whitespace-nowrap">
                PURPOSE
            </div>

            <Card className="w-full max-w-lg bg-card/40 backdrop-blur-md border border-border/50 shadow-2xl relative z-10 rounded-sm overflow-hidden">
                {/* Minimalist Top Bar */}
                <div className="px-8 py-5 border-b border-border/30 flex justify-between items-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
                    <span>Templo en Movimiento</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live</span>
                </div>

                <CardHeader className="text-center space-y-2 pt-10 pb-4">
                    <CardTitle className="text-4xl md:text-5xl uppercase tracking-tighter font-[family-name:var(--font-anton)] text-foreground">
                        BIO-PURPOSE
                    </CardTitle>
                    <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
                        Protocolo de Inicio
                    </p>
                </CardHeader>

                <CardContent className="px-8 pt-4 pb-12">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label htmlFor="age" className="font-semibold uppercase text-[10px] tracking-widest text-muted-foreground">Edad</Label>
                                            <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium text-2xl h-auto" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="heightCm" className="font-semibold uppercase text-[10px] tracking-widest text-muted-foreground">Estatura (cm)</Label>
                                            <Input id="heightCm" name="heightCm" type="number" value={formData.heightCm} onChange={handleChange} className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium text-2xl h-auto" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label htmlFor="weightKg" className="font-semibold uppercase text-[10px] tracking-widest text-muted-foreground">Peso Actual (kg)</Label>
                                            <Input id="weightKg" name="weightKg" type="number" value={formData.weightKg} onChange={handleChange} className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium text-2xl h-auto" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="goalWeightKg" className="font-semibold uppercase text-[10px] tracking-widest text-muted-foreground">Meta (kg)</Label>
                                            <Input id="goalWeightKg" name="goalWeightKg" type="number" value={formData.goalWeightKg} onChange={handleChange} className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium text-2xl h-auto" />
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <Label htmlFor="bodyFatPercentage" className="font-semibold uppercase text-[10px] tracking-widest text-muted-foreground">% Grasa Corporal (Est. 10-15%)</Label>
                                        <Input id="bodyFatPercentage" name="bodyFatPercentage" type="number" value={formData.bodyFatPercentage} onChange={handleChange} className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary transition-colors font-medium text-2xl h-auto" />
                                    </div>

                                    <div className="pt-8">
                                        <Button onClick={handleNext} className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-sm transition-all h-14 font-[family-name:var(--font-space-grotesk)] text-sm uppercase tracking-[0.2em] font-medium group">
                                            Continuar <ArrowRight className="ml-4 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="space-y-8">
                                    <div className="space-y-4 pt-2">
                                        <Label className="font-[family-name:var(--font-anton)] text-2xl uppercase tracking-wide text-foreground">Definición de Propósito</Label>
                                        <Select defaultValue={formData.mission} onValueChange={(val) => { if (val) setFormData(p => ({ ...p, mission: val as Mission })) }}>
                                            <SelectTrigger className="w-full h-14 bg-transparent border-0 border-b border-border/50 rounded-none px-0 focus:ring-0 font-medium text-lg uppercase tracking-wide">
                                                <SelectValue placeholder="Elige tu sueño..." />
                                            </SelectTrigger>
                                            <SelectContent className="border-border/50 bg-card rounded-sm shadow-xl font-medium uppercase text-xs tracking-wider">
                                                <SelectItem value="explorador" className="py-3 focus:bg-primary focus:text-primary-foreground cursor-pointer">01 — Explorador</SelectItem>
                                                <SelectItem value="atleta" className="py-3 focus:bg-primary focus:text-primary-foreground cursor-pointer">02 — Atleta Alto Rendimiento</SelectItem>
                                                <SelectItem value="lider" className="py-3 focus:bg-primary focus:text-primary-foreground cursor-pointer">03 — Líder Creativo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="p-6 border border-border/30 bg-background/30 rounded-sm mt-8 flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-5 h-5 text-primary" />
                                            <span className="font-semibold uppercase tracking-[0.2em] text-[10px] text-muted-foreground">Aviso del Sistema</span>
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed opacity-80">
                                            Toda formulación será 100% Lactose-Free. Diseñado para impacto profundo y estética funcional.
                                        </p>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <Button variant="outline" onClick={() => setStep(1)} className="w-1/3 border-border/50 bg-transparent text-foreground hover:bg-foreground hover:text-background rounded-sm transition-all h-14 text-xs font-bold uppercase tracking-widest">
                                            Atrás
                                        </Button>
                                        <Button onClick={handleComplete} className="w-2/3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm transition-all h-14 font-[family-name:var(--font-space-grotesk)] text-sm uppercase tracking-[0.2em] font-medium">
                                            Iniciar Protocolo
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
