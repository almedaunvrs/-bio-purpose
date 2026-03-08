'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Mission, BodyType, ActivityLevel, BiologicalSex, SleepQuality, UserProfile } from '@/lib/types';
import { guessTimezone } from '@/lib/algorithms';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, ArrowRight, ArrowLeft } from 'lucide-react';

// ─── Question & Answer types ─────────────────────────────────────────────────

interface Step {
    id: keyof UserProfile | 'ready';
    question: string;
    subtitle?: string;
    type: 'number' | 'text' | 'choice' | 'scale';
    choices?: { value: string; label: string; desc?: string }[];
    placeholder?: string;
    unit?: string;
    min?: number;
    max?: number;
}

const STEPS: Step[] = [
    {
        id: 'biologicalSex',
        question: 'Primero, ¿cuál es tu sexo biológico?',
        subtitle: 'Determina tu metabolismo basal y requerimientos hormonales.',
        type: 'choice',
        choices: [
            { value: 'masculino', label: 'Masculino' },
            { value: 'femenino', label: 'Femenino' },
        ],
    },
    {
        id: 'age',
        question: 'Tu edad',
        subtitle: 'Cada década de vida ajusta el protocolo de recuperación y hormonas.',
        type: 'number',
        placeholder: 'Ej: 24',
        unit: 'años',
        min: 14,
        max: 90,
    },
    {
        id: 'heightCm',
        question: 'Tu estatura',
        subtitle: 'Base para calcular tu masa muscular óptima y composición corporal.',
        type: 'number',
        placeholder: 'Ej: 168',
        unit: 'cm',
        min: 130,
        max: 220,
    },
    {
        id: 'weightKg',
        question: 'Tu peso actual',
        subtitle: 'Punto de partida para calibrar tu requerimiento calórico.',
        type: 'number',
        placeholder: 'Ej: 58',
        unit: 'kg',
        min: 30,
        max: 250,
    },
    {
        id: 'bodyType',
        question: 'Tu tipo de cuerpo natural',
        subtitle: 'Determina la velocidad de tu metabolismo y respuesta al entrenamiento.',
        type: 'choice',
        choices: [
            {
                value: 'ectomorfo',
                label: 'Ectomorfo',
                desc: 'Naturalmente delgado. Cuesta subir masa. Metabolismo rápido.',
            },
            {
                value: 'mesomorfo',
                label: 'Mesomorfo',
                desc: 'Atlético natural. Subes músculo y bajas grasa con relativa facilidad.',
            },
            {
                value: 'endomorfo',
                label: 'Endomorfo',
                desc: 'Tendencia a subir peso. Metabolismo más lento pero gran base de fuerza.',
            },
        ],
    },
    {
        id: 'activityLevel',
        question: 'Nivel de actividad física actual',
        subtitle: 'Determina tu TDEE real y ajusta el superávit o déficit calórico preciso.',
        type: 'choice',
        choices: [
            { value: 'sedentario', label: 'Sedentario', desc: 'Trabajo de escritorio, poco o nada de ejercicio.' },
            { value: 'moderado', label: 'Moderado', desc: 'Ejercicio 1-3 veces/semana o trabajo activo suave.' },
            { value: 'activo', label: 'Activo', desc: 'Ejercicio 3-5 días/semana o trabajo físicamente exigente.' },
            { value: 'muy_activo', label: 'Muy Activo', desc: 'Entrenamiento diario intenso, deportista o trabajo de campo.' },
        ],
    },
    {
        id: 'sleepQuality',
        question: 'Calidad de tu sueño actual',
        subtitle: 'El sueño controla cortisol, testosterona, GH y la regeneración muscular.',
        type: 'choice',
        choices: [
            { value: 'mala', label: 'Mala', desc: 'Menos de 6h, interrupciones frecuentes o agotamiento diurno.' },
            { value: 'regular', label: 'Regular', desc: '6-7h, a veces cansado pero funcional.' },
            { value: 'buena', label: 'Buena', desc: 'Duermo 7-9h y me levanto con energía consistente.' },
        ],
    },
    {
        id: 'stressLevel',
        question: 'Nivel de estrés crónico',
        subtitle: 'El cortisol elevado inhibe la síntesis muscular y aumenta el almacenamiento de grasa.',
        type: 'scale',
        min: 1,
        max: 10,
    },
    {
        id: 'location',
        question: 'Ciudad donde vives',
        subtitle: 'Permite calibrar los ciclos de luz solar para el protocolo de Cronobiología.',
        type: 'text',
        placeholder: 'Ej: Monterrey, Madrid, Bogotá...',
    },
    {
        id: 'goalWeightKg',
        question: 'Tu meta de peso corporal',
        subtitle: 'Define si iremos en superávit (ganar masa) o déficit (perder grasa).',
        type: 'number',
        placeholder: 'Ej: 65',
        unit: 'kg',
        min: 30,
        max: 250,
    },
    {
        id: 'mission',
        question: '¿Cuál es el sueño de tu alma?',
        subtitle: 'El ADN de tu protocolo. Ajusta todos los macros, el entrenamiento y los ritmos.',
        type: 'choice',
        choices: [
            {
                value: 'explorador',
                label: 'Explorador',
                desc: 'Quiero resistencia, energía constante y adaptabilidad para vivir con libertad.',
            },
            {
                value: 'atleta',
                label: 'Atleta de Alto Rendimiento',
                desc: 'Quiero fuerza, hipertrofia y recuperación elite para dominar el deporte.',
            },
            {
                value: 'lider',
                label: 'Líder Creativo',
                desc: 'Quiero claridad mental, enfoque sostenido y neuro-protección para crear y dirigir.',
            },
        ],
    },
];

const BOOTING_MESSAGES = [
    'Iniciando TEMPLO OS...',
    'Cargando módulo de Cronobiología...',
    'Conectando biometría...',
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function Onboarding() {
    const setProfile = useUserStore((state) => state.setProfile);

    const [phase, setPhase] = useState<'boot' | 'intake' | 'finalizing'>('boot');
    const [bootLine, setBootLine] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [scaleValue, setScaleValue] = useState(5);
    const [textValue, setTextValue] = useState('');
    const [finalLines, setFinalLines] = useState<string[]>([]);

    const [answers, setAnswers] = useState<Partial<UserProfile>>({
        bodyFatPercentage: 15, // sane default
        injuries: 'ninguna',
        mainGoal: '',
    });

    // Boot sequence
    useEffect(() => {
        if (phase !== 'boot') return;
        const interval = setInterval(() => {
            setBootLine(prev => {
                if (prev >= BOOTING_MESSAGES.length - 1) {
                    clearInterval(interval);
                    setTimeout(() => setPhase('intake'), 500);
                    return prev;
                }
                return prev + 1;
            });
        }, 700);
        return () => clearInterval(interval);
    }, [phase]);

    const step = STEPS[currentStep];

    const handleChoiceSelect = (value: string) => {
        saveAnswer(value);
        setTimeout(() => advanceStep(), 300);
    };

    const handleScaleConfirm = () => {
        saveAnswer(scaleValue);
        advanceStep();
    };

    const handleTextConfirm = () => {
        if (!textValue.trim()) return;
        saveAnswer(textValue.trim());
        setTextValue('');
        advanceStep();
    };

    const saveAnswer = (value: string | number) => {
        setAnswers(prev => ({ ...prev, [step.id]: value }));
    };

    const advanceStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            buildFinalProfile();
        }
    };

    const goBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const buildFinalProfile = () => {
        setPhase('finalizing');

        const finalizingLines = [
            'Procesando identidad biológica...',
            `Tipo de cuerpo detectado: ${(answers.bodyType || 'mesomorfo').toUpperCase()}`,
            `Metabolismo calibrado para ${answers.biologicalSex === 'femenino' ? 'perfil femenino' : 'perfil masculino'}`,
            `Nivel de estrés ${answers.stressLevel}/10 registrado → ajustando proteína...`,
            `Sueño ${answers.sleepQuality} → compensando recuperación muscular...`,
            `Ubicación: ${answers.location || 'México'} → Cronobiología sincronizada`,
            'Calculando Protocolo de Combustible...',
            'Generando Óptimización Mecánica...',
            'Protocolo personalizado listo.',
        ];

        finalizingLines.forEach((line, i) => {
            setTimeout(() => {
                setFinalLines(prev => [...prev, line]);
                if (i === finalizingLines.length - 1) {
                    setTimeout(() => {
                        const loc = answers.location || '';
                        const tz = guessTimezone(loc);
                        setProfile({
                            age: Number(answers.age) || 25,
                            heightCm: Number(answers.heightCm) || 170,
                            weightKg: Number(answers.weightKg) || 70,
                            goalWeightKg: Number(answers.goalWeightKg) || 70,
                            bodyFatPercentage: Number(answers.bodyFatPercentage) || 15,
                            biologicalSex: (answers.biologicalSex as BiologicalSex) || 'masculino',
                            bodyType: (answers.bodyType as BodyType) || 'mesomorfo',
                            activityLevel: (answers.activityLevel as ActivityLevel) || 'moderado',
                            sleepQuality: (answers.sleepQuality as SleepQuality) || 'regular',
                            stressLevel: Number(answers.stressLevel) || 5,
                            location: loc,
                            timezone: tz,
                            injuries: answers.injuries || 'ninguna',
                            mission: (answers.mission as Mission) || 'lider',
                            mainGoal: answers.mainGoal || '',
                        });
                    }, 1000);
                }
            }, i * 750);
        });
    };

    const progress = ((currentStep) / STEPS.length) * 100;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-12 bg-background relative overflow-hidden font-[family-name:var(--font-space-grotesk)] text-foreground">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.04)_0%,rgba(0,0,0,0)_65%)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.025] pointer-events-none">
                <Hexagon className="w-[150vh] h-[150vh] text-primary" strokeWidth={0.1} />
            </div>

            <div className="w-full max-w-2xl relative z-10">

                {/* BOOT PHASE */}
                <AnimatePresence mode="wait">
                    {phase === 'boot' && (
                        <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6">
                            <Hexagon className="w-10 h-10 text-primary mx-auto animate-[spin_4s_linear_infinite]" strokeWidth={1} />
                            <div className="space-y-2 font-mono">
                                {BOOTING_MESSAGES.slice(0, bootLine + 1).map((msg, i) => (
                                    <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`text-xs tracking-widest ${i === bootLine ? 'text-white' : 'text-muted-foreground'}`}>
                                        <span className="text-primary mr-2">{'>'}</span>{msg}
                                    </motion.p>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* FINALIZING PHASE */}
                    {phase === 'finalizing' && (
                        <motion.div key="finalizing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 font-mono">
                            <div className="flex items-center gap-4 mb-8">
                                <Hexagon className="w-6 h-6 text-primary animate-[spin_2s_linear_infinite]" strokeWidth={1} />
                                <span className="text-sm font-[family-name:var(--font-anton)] uppercase tracking-widest">Sintetizando tu Protocolo</span>
                            </div>
                            {finalLines.map((line, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-3 text-xs md:text-sm">
                                    <span className="text-primary mt-0.5">{'>'}</span>
                                    <span className={i === finalLines.length - 1 ? 'text-white font-semibold' : 'text-muted-foreground'}>{line}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* INTAKE PHASE */}
                    {phase === 'intake' && (
                        <motion.div key={`step-${currentStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="space-y-10">

                            {/* Header */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                                    <span>TEMPLO OS // Calibración</span>
                                    <span>{currentStep + 1} / {STEPS.length}</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full h-px bg-white/10 relative">
                                    <motion.div className="absolute top-0 left-0 h-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                                </div>
                            </div>

                            {/* Question */}
                            <div className="space-y-3 pt-4">
                                <h2 className="text-2xl md:text-4xl font-[family-name:var(--font-anton)] uppercase tracking-wide leading-tight">{step.question}</h2>
                                {step.subtitle && <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-lg">{step.subtitle}</p>}
                            </div>

                            {/* Answer Area */}
                            <div className="space-y-4">
                                {/* CHOICE */}
                                {step.type === 'choice' && (
                                    <div className="grid gap-3">
                                        {step.choices!.map(c => (
                                            <button
                                                key={c.value}
                                                onClick={() => handleChoiceSelect(c.value)}
                                                className={`group text-left p-5 border rounded-2xl transition-all duration-300 hover:border-primary/60 hover:bg-white/5 ${answers[step.id as keyof UserProfile] === c.value ? 'border-primary bg-primary/10' : 'border-white/10 bg-card/20'}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold uppercase tracking-wide text-sm">{c.label}</span>
                                                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                {c.desc && <p className="text-xs text-muted-foreground mt-1 font-light">{c.desc}</p>}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* NUMBER */}
                                {step.type === 'number' && (
                                    <div className="space-y-6">
                                        <div className="flex items-end gap-4 border-b border-white/20 pb-2 focus-within:border-primary transition-colors">
                                            <input
                                                type="number"
                                                value={textValue}
                                                onChange={e => setTextValue(e.target.value)}
                                                placeholder={step.placeholder}
                                                min={step.min}
                                                max={step.max}
                                                className="flex-1 bg-transparent text-4xl md:text-5xl font-light text-white focus:outline-none placeholder:text-white/15"
                                                onKeyDown={e => { if (e.key === 'Enter') handleTextConfirm(); }}
                                                autoFocus
                                            />
                                            {step.unit && <span className="text-lg text-muted-foreground mb-1">{step.unit}</span>}
                                        </div>
                                        <button onClick={handleTextConfirm} disabled={!textValue.trim()} className="group flex items-center gap-3 text-sm font-semibold uppercase tracking-widest disabled:opacity-40 hover:text-primary transition-colors">
                                            Confirmar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {/* TEXT */}
                                {step.type === 'text' && (
                                    <div className="space-y-6">
                                        <div className="flex items-end gap-4 border-b border-white/20 pb-2 focus-within:border-primary transition-colors">
                                            <input
                                                type="text"
                                                value={textValue}
                                                onChange={e => setTextValue(e.target.value)}
                                                placeholder={step.placeholder}
                                                className="flex-1 bg-transparent text-2xl md:text-3xl font-light text-white focus:outline-none placeholder:text-white/15"
                                                onKeyDown={e => { if (e.key === 'Enter') handleTextConfirm(); }}
                                                autoFocus
                                            />
                                        </div>
                                        <button onClick={handleTextConfirm} disabled={!textValue.trim()} className="group flex items-center gap-3 text-sm font-semibold uppercase tracking-widest disabled:opacity-40 hover:text-primary transition-colors">
                                            Confirmar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {/* SCALE */}
                                {step.type === 'scale' && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] tracking-widest text-muted-foreground w-8">BAJO</span>
                                            <div className="flex-1 flex gap-2">
                                                {Array.from({ length: (step.max ?? 10) - (step.min ?? 1) + 1 }, (_, i) => i + (step.min ?? 1)).map(n => (
                                                    <button
                                                        key={n}
                                                        onClick={() => setScaleValue(n)}
                                                        className={`flex-1 h-12 rounded-xl font-[family-name:var(--font-anton)] text-lg transition-all duration-200 border ${scaleValue === n ? 'bg-primary text-black border-primary' : 'border-white/10 text-muted-foreground hover:border-primary/40 hover:text-white'}`}
                                                    >
                                                        {n}
                                                    </button>
                                                ))}
                                            </div>
                                            <span className="text-[10px] tracking-widest text-muted-foreground w-8 text-right">ALTO</span>
                                        </div>
                                        <p className="text-center text-muted-foreground text-xs">
                                            {scaleValue <= 3 && 'Excelente control. Cortisol bajo. Recuperación óptima.'}
                                            {scaleValue >= 4 && scaleValue <= 6 && 'Estrés moderado. Ajustaremos proteína y descanso activo.'}
                                            {scaleValue > 6 && 'Estrés elevado. Protocolo adaptado para protección muscular y neuro-calma.'}
                                        </p>
                                        <button onClick={handleScaleConfirm} className="group flex items-center gap-3 text-sm font-semibold uppercase tracking-widest hover:text-primary transition-colors">
                                            Confirmar nivel {scaleValue} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Back button */}
                            {currentStep > 0 && (
                                <button onClick={goBack} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors uppercase tracking-widest">
                                    <ArrowLeft className="w-3 h-3" /> Anterior
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
