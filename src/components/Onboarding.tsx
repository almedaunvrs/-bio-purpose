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
import { Activity, Target } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-background font-mono relative overflow-hidden font-[family-name:var(--font-space-grotesk)]">
            {/* Background Streetwear Accents */}
            <div className="absolute top-10 left-10 opacity-10 font-[family-name:var(--font-anton)] text-9xl tracking-tighter mix-blend-multiply pointer-events-none">
                BIO<br />PURPOSE
            </div>
            <div className="absolute bottom-10 right-10 opacity-10 font-[family-name:var(--font-anton)] text-9xl tracking-tighter mix-blend-multiply text-right pointer-events-none">
                TEMPLO<br />ACTIVO
            </div>

            <Card className="w-full max-w-md bg-card border-4 border-foreground shadow-[8px_8px_0px_rgba(0,0,0,1)] relative z-10 rounded-none overflow-hidden">
                {/* Receipt Header Style */}
                <div className="bg-foreground text-background p-3 flex justify-between items-center text-xs font-bold uppercase tracking-widest border-b-4 border-foreground">
                    <span>Order #001</span>
                    <span>EST. {new Date().getFullYear()}</span>
                </div>

                <CardHeader className="text-center space-y-4 pt-8">
                    <CardTitle className="text-5xl uppercase tracking-tighter font-[family-name:var(--font-anton)] text-primary">
                        BIO-PURPOSE
                    </CardTitle>
                    <div className="inline-block bg-accent px-4 py-1 border-2 border-foreground transform -rotate-2 font-bold text-sm uppercase shadow-[2px_2px_0px_#000]">
                        Configura tu Templo
                    </div>
                </CardHeader>

                <CardContent className="pt-4 pb-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="age" className="font-bold uppercase text-xs tracking-wider">Edad</Label>
                                            <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} className="bg-background border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] focus-visible:ring-0 focus-visible:translate-y-1 focus-visible:translate-x-1 focus-visible:shadow-none transition-all font-bold text-lg h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="heightCm" className="font-bold uppercase text-xs tracking-wider">Estatura (cm)</Label>
                                            <Input id="heightCm" name="heightCm" type="number" value={formData.heightCm} onChange={handleChange} className="bg-background border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] focus-visible:ring-0 focus-visible:translate-y-1 focus-visible:translate-x-1 focus-visible:shadow-none transition-all font-bold text-lg h-12" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="weightKg" className="font-bold uppercase text-xs tracking-wider">Peso Actual (kg)</Label>
                                            <Input id="weightKg" name="weightKg" type="number" value={formData.weightKg} onChange={handleChange} className="bg-background border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] focus-visible:ring-0 focus-visible:translate-y-1 focus-visible:translate-x-1 focus-visible:shadow-none transition-all font-bold text-lg h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="goalWeightKg" className="font-bold uppercase text-xs tracking-wider">Meta (kg)</Label>
                                            <Input id="goalWeightKg" name="goalWeightKg" type="number" value={formData.goalWeightKg} onChange={handleChange} className="bg-background border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] focus-visible:ring-0 focus-visible:translate-y-1 focus-visible:translate-x-1 focus-visible:shadow-none transition-all font-bold text-lg h-12" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bodyFatPercentage" className="font-bold uppercase text-xs tracking-wider">% Grasa Muscular</Label>
                                        <Input id="bodyFatPercentage" name="bodyFatPercentage" type="number" value={formData.bodyFatPercentage} onChange={handleChange} className="bg-background border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] focus-visible:ring-0 focus-visible:translate-y-1 focus-visible:translate-x-1 focus-visible:shadow-none transition-all font-bold text-lg h-12" />
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">* ESTIMADO 10-15%</p>
                                    </div>

                                    <Button onClick={handleNext} className="w-full bg-primary text-primary-foreground hover:bg-primary border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all h-14 font-[family-name:var(--font-anton)] text-2xl uppercase tracking-wide mt-8">
                                        Siguiente  <Target className="ml-2 w-6 h-6" />
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
                                className="space-y-8"
                            >
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="font-[family-name:var(--font-anton)] text-2xl uppercase tracking-wide">Selecciona tu Sueño</Label>
                                        <Select defaultValue={formData.mission} onValueChange={(val) => { if (val) setFormData(p => ({ ...p, mission: val as Mission })) }}>
                                            <SelectTrigger className="w-full h-16 bg-background border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] focus:ring-0 font-bold text-lg text-foreground uppercase">
                                                <SelectValue placeholder="Elige tu sueño..." />
                                            </SelectTrigger>
                                            <SelectContent className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] font-bold uppercase transition-all">
                                                <SelectItem value="explorador">E 01 - El Explorador</SelectItem>
                                                <SelectItem value="atleta">A 02 - Atleta Alto Rendimiento</SelectItem>
                                                <SelectItem value="lider">L 03 - Líder Creativo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="p-4 bg-secondary border-2 border-foreground shadow-[4px_4px_0px_#000] mt-6 flex gap-4">
                                        <div className="bg-foreground text-background p-2 self-start flex-shrink-0">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="font-extrabold text-foreground uppercase tracking-widest text-sm border-b-2 border-foreground pb-1 inline-block mb-2">Notice: 100% Lactose-Free</span>
                                            <p className="text-foreground text-sm font-medium leading-tight mt-1">
                                                EL PROTOCOLO BIO HACKEARÁ TU SISTEMA. DISEÑADO PARA IMPACTO FUNCIONAL Y ALTO CONTRASTE.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button variant="outline" onClick={() => setStep(1)} className="w-1/3 bg-background border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all h-14 font-bold uppercase">
                                            Atrás
                                        </Button>
                                        <Button onClick={handleComplete} className="w-2/3 bg-primary text-primary-foreground hover:bg-primary border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all h-14 font-[family-name:var(--font-anton)] text-2xl uppercase tracking-wide">
                                            Entrar AL TEMPLO
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
