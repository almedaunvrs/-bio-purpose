'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Mission } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Hexagon } from 'lucide-react';

export function Onboarding() {
    const setProfile = useUserStore((state) => state.setProfile);

    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        age: '',
        heightCm: '',
        weightKg: '',
        goalWeightKg: '',
        bodyFatPercentage: '',
        mission: '' as Mission,
    });

    // Simulate AI Booting
    useEffect(() => {
        if (step === 0) {
            const timer = setTimeout(() => setStep(1), 2500);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleNext = () => {
        if (step === 1) {
            // Validate inputs minimally for effect
            if (!formData.age || !formData.heightCm || !formData.weightKg || !formData.goalWeightKg) return;
            setStep(2);
        }
    };

    const handleMissionSelect = (mission: Mission) => {
        setFormData(prev => ({ ...prev, mission }));
        // Small delay to feel like processing
        setTimeout(() => {
            setProfile({
                age: Number(formData.age),
                heightCm: Number(formData.heightCm),
                weightKg: Number(formData.weightKg),
                goalWeightKg: Number(formData.goalWeightKg),
                bodyFatPercentage: Number(formData.bodyFatPercentage || 12),
                mission,
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background font-mono relative overflow-hidden font-[family-name:var(--font-space-grotesk)] text-foreground">

            {/* Elegance & Sacred Geometry Backgrounds */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,rgba(0,0,0,0)_50%)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <Hexagon className="w-[120vh] h-[120vh] text-primary" strokeWidth={0.2} />
            </div>

            <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">

                <AnimatePresence mode="wait">
                    {/* Booting Sequence */}
                    {step === 0 && (
                        <motion.div
                            key="boot"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center space-y-4"
                        >
                            <Hexagon className="w-12 h-12 text-primary mx-auto animate-[spin_4s_linear_infinite]" strokeWidth={1} />
                            <p className="tracking-[0.4em] text-xs uppercase text-muted-foreground animate-pulse">Iniciando TEMPLO OS</p>
                            <p className="font-[family-name:var(--font-anton)] text-2xl tracking-widest text-primary pt-4 uppercase">
                                Biología Divina. Tecnología Humana.
                            </p>
                        </motion.div>
                    )}

                    {/* Step 1: Biometric Intake */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-full"
                        >
                            <div className="text-center mb-16 space-y-4">
                                <p className="text-primary text-[10px] uppercase tracking-[0.4em] font-semibold border-b border-primary/20 inline-block pb-1">Identidad requerida</p>
                                <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-anton)] uppercase tracking-wide leading-tight">
                                    Calibración del <br /><span className="text-muted-foreground">Templo</span>
                                </h1>
                            </div>

                            <div className="bg-card backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col gap-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                                <div className="grid grid-cols-2 gap-8 md:gap-12">
                                    <div className="space-y-2 relative group">
                                        <label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Edad</label>
                                        <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full bg-transparent border-b border-white/10 py-2 text-2xl font-light focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-white/10" placeholder="00" />
                                    </div>
                                    <div className="space-y-2 relative group">
                                        <label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Estatura (cm)</label>
                                        <input name="heightCm" type="number" value={formData.heightCm} onChange={handleChange} className="w-full bg-transparent border-b border-white/10 py-2 text-2xl font-light focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-white/10" placeholder="000" />
                                    </div>
                                    <div className="space-y-2 relative group">
                                        <label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Peso Actual (kg)</label>
                                        <input name="weightKg" type="number" value={formData.weightKg} onChange={handleChange} className="w-full bg-transparent border-b border-white/10 py-2 text-2xl font-light focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-white/10" placeholder="00.0" />
                                    </div>
                                    <div className="space-y-2 relative group">
                                        <label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Meta de Peso</label>
                                        <input name="goalWeightKg" type="number" value={formData.goalWeightKg} onChange={handleChange} className="w-full bg-transparent border-b border-white/10 py-2 text-2xl font-light focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-white/10" placeholder="00.0" />
                                    </div>
                                </div>

                                <div className="pt-8 flex justify-end">
                                    <button
                                        onClick={handleNext}
                                        className="group relative px-8 py-4 bg-foreground text-background font-semibold text-xs uppercase tracking-[0.2em] overflow-hidden rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">Sincronizar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                                        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Mission Selection */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full max-w-3xl"
                        >
                            <div className="text-center mb-16 space-y-4">
                                <p className="text-primary text-[10px] uppercase tracking-[0.4em] font-semibold">Parámetro Final</p>
                                <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-anton)] uppercase tracking-wide leading-tight">
                                    Selecciona el Sueño <br /><span className="text-muted-foreground">de tu Alma</span>
                                </h1>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: 'explorador', title: 'Explorador', desc: 'Resistencia, Energía Constante, Adaptabilidad.' },
                                    { id: 'atleta', title: 'Atleta', desc: 'Explosividad, Hipertrofia, Recuperación Rápida.' },
                                    { id: 'lider', title: 'Líder Creativo', desc: 'Claridad Mental, Enfoque, Neuro-protección.' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleMissionSelect(item.id as Mission)}
                                        className="group relative p-8 bg-card backdrop-blur-md border border-white/5 rounded-3xl hover:border-primary/50 transition-all duration-500 text-left overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <Hexagon className="w-6 h-6 text-primary mb-6 opacity-50 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-700" strokeWidth={1} />
                                        <h3 className="text-xl font-[family-name:var(--font-anton)] uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground font-light leading-relaxed">{item.desc}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-16 text-center">
                                <p className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-50 border border-white/10 px-4 py-2 rounded-full inline-block backdrop-blur-sm">
                                    Protocolo 100% Lactose-Free
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
