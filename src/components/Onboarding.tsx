'use client';

import { useState, useEffect, useRef } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Mission } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, CornerDownLeft, Loader2 } from 'lucide-react';

export function Onboarding() {
    const setProfile = useUserStore((state) => state.setProfile);

    const [step, setStep] = useState(0);
    const [prompt, setPrompt] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisLines, setAnalysisLines] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [prompt]);

    // Simulate AI Booting
    useEffect(() => {
        if (step === 0) {
            const timer = setTimeout(() => setStep(1), 2000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleAnalyze = () => {
        if (!prompt.trim()) return;
        setStep(2);
        setIsAnalyzing(true);

        const lines = [
            "Decodificando lenguaje natural...",
            "Extrayendo marcadores biométricos...",
            "Analizando entorno geográfico...",
            "Cruzando datos con Cronobiología local...",
            "Asignando Protocolo de Combustible...",
            "Calibrando Optimización Mecánica...",
            "Sincronización completa."
        ];

        // Simulate AI thinking and outputting logs line by line
        lines.forEach((line, index) => {
            setTimeout(() => {
                setAnalysisLines(prev => [...prev, line]);
                if (index === lines.length - 1) {
                    finishAnalysis();
                }
            }, (index + 1) * 800);
        });
    };

    const finishAnalysis = () => {
        // Pseudo AI parsing to make it feel real
        const lowerPrompt = prompt.toLowerCase();

        // Default fallback values
        let age = 30;
        let weight = 70;
        let height = 175;
        let mission: Mission = 'lider';

        // Simple regex to extract numbers if the user provided them (e.g. "tengo 24 años, peso 58kg y mido 168")
        const numbers = prompt.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            // Very naive extraction: assume first number < 100 is age, 
            // number around 150-200 is height, number 40-120 is weight.
            numbers.forEach(numStr => {
                const num = parseInt(numStr);
                if (num >= 15 && num <= 80 && num !== age) age = num; // Age
                else if (num >= 140 && num <= 220) height = num; // Height
                else if (num >= 40 && num <= 140 && num !== height) weight = num; // Weight
            });
        }

        // Determine mission based on keywords
        if (lowerPrompt.includes('musculo') || lowerPrompt.includes('atleta') || lowerPrompt.includes('fuerza') || lowerPrompt.includes('hipertrofia')) {
            mission = 'atleta';
        } else if (lowerPrompt.includes('energia') || lowerPrompt.includes('resistencia') || lowerPrompt.includes('explorar') || lowerPrompt.includes('viajar')) {
            mission = 'explorador';
        } else {
            mission = 'lider'; // default for business, focus, mental clarity
        }

        setTimeout(() => {
            setProfile({
                age,
                heightCm: height,
                weightKg: weight,
                goalWeightKg: weight + (mission === 'atleta' ? 5 : -2), // arbitrary goal logic
                bodyFatPercentage: 15,
                mission,
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-12 bg-background font-mono relative overflow-hidden font-[family-name:var(--font-space-grotesk)] text-foreground">

            {/* Elegance & Sacred Geometry Backgrounds */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.03)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
                <Hexagon className="w-[150vh] h-[150vh] text-primary" strokeWidth={0.1} />
            </div>

            <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">

                <AnimatePresence mode="wait">
                    {/* Booting Sequence */}
                    {step === 0 && (
                        <motion.div
                            key="boot"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center space-y-6"
                        >
                            <Hexagon className="w-12 h-12 text-primary mx-auto animate-[spin_4s_linear_infinite]" strokeWidth={1} />
                            <p className="tracking-[0.4em] text-[10px] uppercase text-muted-foreground animate-pulse">
                                Conectando con TEMPLO OS...
                            </p>
                        </motion.div>
                    )}

                    {/* Prompt Interface */}
                    {step === 1 && (
                        <motion.div
                            key="prompt"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full"
                        >
                            <div className="mb-12 space-y-4">
                                <div className="flex items-center gap-3 text-primary mb-6">
                                    <Hexagon className="w-4 h-4" strokeWidth={1.5} />
                                    <span className="text-[10px] uppercase tracking-[0.4em] font-semibold">Calibración de Identidad</span>
                                </div>

                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-[family-name:var(--font-anton)] uppercase tracking-wide leading-[1.1] text-white/90">
                                    ¿Quién eres y qué <br />
                                    <span className="text-white/40">buscas lograr?</span>
                                </h1>

                                <p className="text-sm text-muted-foreground max-w-xl font-light mt-6 leading-relaxed">
                                    Para diseñar tu Protocolo de Combustible y Optimización Mecánica, responde a la IA de manera natural.
                                    <br /><br />
                                    <span className="text-white/70">Ejemplo: "Tengo 24 años, peso 58kg y mido 1.68m. Vivo en Monterrey y quiero subir de masa muscular para ser atleta."</span>
                                </p>
                            </div>

                            <div className="relative group">
                                <textarea
                                    ref={textareaRef}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Inicia tu decodificación aquí..."
                                    className="w-full bg-card/20 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 text-lg md:text-2xl font-light text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-card/40 transition-all duration-500 min-h-[150px] resize-none overflow-hidden"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAnalyze();
                                        }
                                    }}
                                />

                                <div className="absolute bottom-6 right-6 flex items-center gap-4">
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground hidden md:inline-block">
                                        [ Enter ] para enviar
                                    </span>
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={!prompt.trim()}
                                        className="p-4 bg-primary text-black rounded-full hover:scale-105 hover:bg-white transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-primary shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                                    >
                                        <CornerDownLeft className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* AI Analysis Simulation */}
                    {step === 2 && (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full max-w-2xl text-left"
                        >
                            <div className="flex items-center gap-4 mb-12">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                <h2 className="text-xl font-[family-name:var(--font-anton)] uppercase tracking-wider">
                                    Sintetizando Protocolo
                                </h2>
                            </div>

                            <div className="space-y-4 font-mono text-xs md:text-sm text-muted-foreground">
                                {analysisLines.map((line, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="text-primary">{'>'}</span>
                                        <span className={idx === analysisLines.length - 1 ? "text-white font-semibold" : ""}>{line}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-16 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
