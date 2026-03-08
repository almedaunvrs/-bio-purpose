'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Mission, BodyType, ActivityLevel, BiologicalSex, SleepQuality, UserProfile } from '@/lib/types';
import { guessTimezone } from '@/lib/algorithms';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, ArrowRight, ArrowLeft } from 'lucide-react';

// ─── DNA Scanner Animation ─────────────────────────────────────────────────────
const DNA_Animation = () => (
    <div className="flex flex-col items-center justify-center space-y-8">
        <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-16 h-48 flex flex-col justify-between relative"
        >
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex justify-between w-full h-1 my-1 opacity-80" style={{ perspective: '200px' }}>
                    <motion.div
                        className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_15px_#60a5fa]"
                        animate={{ x: [0, 40, 0], scale: [1, 0.5, 1], zIndex: [10, 0, 10] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                    />
                    <motion.div
                        className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_white]"
                        animate={{ x: [0, -40, 0], scale: [0.5, 1, 0.5], zIndex: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                    />
                    <motion.div
                        className="absolute left-3 right-3 h-px bg-blue-200/30 top-1.5"
                        animate={{ opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: i * 0.15 }}
                    />
                </div>
            ))}
        </motion.div>
        <div className="text-center space-y-2">
            <p className="text-blue-400 animate-pulse text-[10px] font-bold uppercase tracking-[0.3em]">
                Decodificando diseño original...
            </p>
            <p className="text-neutral-400 text-[9px] uppercase tracking-widest">
                Alineando masa crítica con el sueño del alma
            </p>
        </div>
    </div>
);

// ─── Question & Answer types ─────────────────────────────────────────────────

interface Step {
    id: keyof UserProfile | 'ready';
    question: string;
    subtitle?: string;
    type: 'number' | 'text' | 'textarea' | 'choice' | 'scale';
    choices?: { value: string; label: string; desc?: string }[];
    placeholder?: string;
    unit?: string;
    min?: number;
    max?: number;
}

const STEPS: Step[] = [
    // ── 1. EL LLAMADO ─────────────────────────────────────────────────────────
    {
        id: 'mainGoal',
        question: '¿Qué misión te ha encomendado el Creador?',
        subtitle: 'El diseño de tu Templo dependerá de lo que necesitas construir o conquistar en esta tierra.',
        type: 'textarea',
        placeholder: 'Ej: DJ Internacional y Empresario...',
    },
    // ── 2. EL DESGASTE ─────────────────────────────────────────────────────────
    {
        id: 'demands',
        question: '¿Qué demandas reales tiene esta misión?',
        subtitle: 'Para construir tu armadura, necesitamos conocer el impacto diario sobre tu biología.',
        type: 'textarea',
        placeholder: 'Ej: Viajes constantes, estrés, presentaciones, falta de sueño...',
    },
    // ── 3. EL PLAZO ──────────────────────────────────────────────────────────
    {
        id: 'timeframe',
        question: '¿En cuánto tiempo quieres que tu Templo esté blindado?',
        subtitle: 'La velocidad de la ingeniería biológica.',
        type: 'choice',
        choices: [
            { value: '3 meses', label: '3 Meses', desc: 'Transformación acelerada y shock metabólico.' },
            { value: '6 meses', label: '6 Meses', desc: 'Construcción sólida y sostenible (Recomendado).' },
            { value: '12 meses', label: '12 Meses', desc: 'Reingeniería total y definitiva.' },
        ],
    },
];


const BOOTING_MESSAGES = [
    'Iniciando TEMPLO OS...',
    'Cargando módulo de Cronobiología...',
    'Conectando biometría...',
];

// ─── RestrictionGroup — chip multi-select ────────────────────────────────────
interface RestrictionGroupProps {
    title: string;
    icon: string;
    subtitle: string;
    options: string[];
    selected: string[];
    onToggle: (item: string) => void;
    noRestrictionLabel: string;
}

function RestrictionGroup({ title, icon, subtitle, options, selected, onToggle, noRestrictionLabel }: RestrictionGroupProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <span>{icon}</span>
                <div>
                    <p className="text-sm font-medium text-neutral-800">{title}</p>
                    <p className="text-[10px] text-neutral-400 font-light">{subtitle}</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {options.map(option => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onToggle(option)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${selected.includes(option)
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                            }`}
                    >
                        {selected.includes(option) ? '✕ ' : ''}{option}
                    </button>
                ))}
            </div>
            {selected.length === 0 && (
                <p className="text-[10px] text-emerald-600 font-medium">✓ {noRestrictionLabel}</p>
            )}
        </div>
    );
}

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
        bodyFatPercentage: 15,
        injuries: 'ninguna',
        mainGoal: '',
        demands: '',
        timeframe: '6 meses',
        biologicalSex: 'masculino', // Default fixes since they aren't asked anymore
        age: 26,
        heightCm: 168,
        weightKg: 58,
        bodyType: 'mesomorfo',
        activityLevel: 'activo',
        sleepQuality: 'regular',
        stressLevel: 7,
        location: 'México',
    });

    // Biological Restrictions (Interferencias)
    const [foodAllergies, setFoodAllergies] = useState<string[]>([]);
    const [foodIntolerances, setFoodIntolerances] = useState<string[]>(['lactosa']); // pre-selected
    const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
    const [restrictionsPhase, setRestrictionsPhase] = useState<'pending' | 'confirmed'>('pending');


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
            // Show Interferencias step before finalizing
            setPhase('interferencias' as any);
        }
    };

    const confirmRestrictions = () => {
        setRestrictionsPhase('confirmed');
        setTimeout(() => buildFinalProfile(), 800);
    };

    const goBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const buildFinalProfile = async () => {
        setPhase('finalizing');

        // Show animated log lines while Gemini thinks
        const thinkingLines = [
            'Conectando con TEMPLO OS...',
            'Analizando sueño del alma...',
            'Cruzando datos biológicos con principios divinos...',
            'Consultando protocolos de Cronobiología...',
            'Calculando composición corporal óptima...',
            'Generando tu protocolo personalizado...',
        ];

        // Stream thinking lines, then fire the real API call in parallel
        thinkingLines.forEach((line, i) => {
            setTimeout(() => setFinalLines(prev => [...prev, line]), i * 800);
        });

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mainGoal: answers.mainGoal || '',
                    demands: answers.demands || '',
                    timeframe: answers.timeframe || '',
                    biologicalSex: answers.biologicalSex,
                    age: answers.age,
                    heightCm: answers.heightCm,
                    weightKg: answers.weightKg,
                    bodyType: answers.bodyType,
                    activityLevel: answers.activityLevel,
                    sleepQuality: answers.sleepQuality,
                    stressLevel: answers.stressLevel,
                    location: answers.location,
                    foodAllergies,
                    foodIntolerances,
                    medicalConditions,
                }),
            });

            if (!response.ok) throw new Error('API error');
            const geminiResult = await response.json();

            // Show the AI-generated results as final log lines
            setTimeout(() => {
                setFinalLines(prev => [
                    ...prev,
                    `Protocolo "${(geminiResult.missionLabel || geminiResult.mission || 'TEMPLO').toUpperCase()}" confirmado`,
                    `Composición corporal objetivo: ${geminiResult.targetBodyFatPercent}% grasa corporal`,
                    `Meta de masa corporal: ${geminiResult.goalWeightKg}kg`,
                    'Protocolo de Combustible y Optimización Mecánica listos.',
                ]);

                // After a short pause, load the dashboard
                setTimeout(() => {
                    const loc = (answers.location as string) || '';
                    const tz = guessTimezone(loc);
                    setProfile({
                        age: Number(answers.age) || 25,
                        heightCm: Number(answers.heightCm) || 170,
                        weightKg: Number(answers.weightKg) || 70,
                        goalWeightKg: geminiResult.goalWeightKg || Number(answers.weightKg) || 70,
                        bodyFatPercentage: geminiResult.targetBodyFatPercent || 15,
                        biologicalSex: (answers.biologicalSex as BiologicalSex) || 'masculino',
                        bodyType: (answers.bodyType as BodyType) || 'mesomorfo',
                        activityLevel: (answers.activityLevel as ActivityLevel) || 'moderado',
                        sleepQuality: (answers.sleepQuality as SleepQuality) || 'regular',
                        stressLevel: Number(answers.stressLevel) || 5,
                        location: loc,
                        timezone: tz,
                        injuries: answers.injuries || 'ninguna',
                        biologicalRestrictions: {
                            foodAllergies,
                            foodIntolerances,
                            medicalConditions,
                        },
                        mission: (geminiResult.mission as Mission) || 'lider',
                        mainGoal: answers.mainGoal || '',
                        geminiProtocol: {
                            mission: geminiResult.mission || 'lider',
                            missionLabel: geminiResult.missionLabel || '',
                            missionReason: geminiResult.missionReason || '',
                            biologicalContext: geminiResult.biologicalContext || '',
                            targetBodyFatPercent: geminiResult.targetBodyFatPercent || 15,
                            goalWeightKg: geminiResult.goalWeightKg || Number(answers.weightKg) || 70,
                            calories: geminiResult.calories || 2000,
                            proteinGrams: geminiResult.proteinGrams || 150,
                            carbsGrams: geminiResult.carbsGrams || 200,
                            fatsGrams: geminiResult.fatsGrams || 70,
                            gapPhase: geminiResult.gapPhase || 'OPTIMIZACIÓN',
                            gapMessage: geminiResult.gapMessage || '',
                            portionPlan: geminiResult.portionPlan || {
                                proteinSource: '',
                                carbSource: '',
                                fatSource: '',
                                preWorkout: '',
                                postWorkout: '',
                            },
                            chronoGuidance: geminiResult.chronoGuidance || { phase: 'Festín', start: '12:00', end: '19:59', action: '', gradient: '' },
                            nutrientDensity: geminiResult.nutrientDensity || { magnesiumMg: 350, potassiumMg: 4000, sodiumMg: 2000 },
                            keyInsights: geminiResult.keyInsights || [],
                            firstAction: geminiResult.firstAction || '',
                            wisdom: geminiResult.wisdom,
                        },


                    } as any);
                }, 1500);
            }, thinkingLines.length * 800 + 200);

        } catch {
            setFinalLines(prev => [...prev, 'Error de conexión. Usando protocolo base...']);
            // Fallback to local calculation
            setTimeout(() => {
                const loc = (answers.location as string) || '';
                const tz = guessTimezone(loc);
                setProfile({
                    age: Number(answers.age) || 25,
                    heightCm: Number(answers.heightCm) || 170,
                    weightKg: Number(answers.weightKg) || 70,
                    goalWeightKg: Number(answers.weightKg) || 70,
                    bodyFatPercentage: 15,
                    biologicalSex: (answers.biologicalSex as BiologicalSex) || 'masculino',
                    bodyType: (answers.bodyType as BodyType) || 'mesomorfo',
                    activityLevel: (answers.activityLevel as ActivityLevel) || 'moderado',
                    sleepQuality: (answers.sleepQuality as SleepQuality) || 'regular',
                    stressLevel: Number(answers.stressLevel) || 5,
                    location: loc,
                    timezone: tz,
                    injuries: answers.injuries || 'ninguna',
                    mission: 'lider',
                    mainGoal: answers.mainGoal || '',
                    biologicalRestrictions: {
                        foodAllergies,
                        foodIntolerances,
                        medicalConditions,
                    },
                } as any);
            }, 2000);
        }
    };


    const progress = ((currentStep) / STEPS.length) * 100;

    return (
        <div className="min-h-screen flex items-center justify-center p-6 md:p-16 bg-white relative overflow-hidden font-[family-name:var(--font-inter)] text-neutral-900">
            {/* Subtle background texture */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,151,62,0.04)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-100" />

            <div className="w-full max-w-xl relative z-10">

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

                    {/* INTERFERENCIAS PHASE */}
                    {(phase as string) === 'interferencias' && (
                        <motion.div key="interferencias" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                            {restrictionsPhase === 'pending' ? (
                                <>
                                    {/* Header */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400">TEMPLO OS // PASO FINAL</p>
                                        <h2 className="text-3xl md:text-4xl font-extralight text-neutral-900 leading-tight">
                                            Identificación de<br /><span className="text-amber-500">Interferencias</span>
                                        </h2>
                                        <p className="text-sm font-light text-neutral-500 leading-relaxed max-w-md">
                                            Este escaneo asegura que la información divina no choque con la realidad actual de tu cuerpo. Tu protocolo será 100% seguro para tu diseño único.
                                        </p>
                                    </div>

                                    {/* Alergias */}
                                    <RestrictionGroup
                                        title="Alergias Alimentarias"
                                        icon="🚫"
                                        subtitle="El agente tiene prohibido incluir estos alimentos"
                                        options={['Frutos secos', 'Mariscos', 'Huevo', 'Soya', 'Trigo', 'Pescado', 'Ajonjolí', 'Mostaza']}
                                        selected={foodAllergies}
                                        onToggle={(item) => setFoodAllergies(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item])}
                                        noRestrictionLabel="Sin alergias"
                                    />

                                    {/* Intolerancias */}
                                    <RestrictionGroup
                                        title="Intolerancias"
                                        icon="⚠️"
                                        subtitle="Lactosa ya está bloqueada por Ley IV. Agrega otras si aplica."
                                        options={['Gluten', 'Fructosa', 'Sorbitol', 'Histamina', 'FODMAP', 'Cafeína']}
                                        selected={foodIntolerances}
                                        onToggle={(item) => setFoodIntolerances(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item])}
                                        noRestrictionLabel="Solo lactosa (Ley IV base)"
                                    />

                                    {/* Condiciones médicas */}
                                    <RestrictionGroup
                                        title="Condiciones Médicas"
                                        icon="🏥"
                                        subtitle="El agente adapta macros y alimentos a tu condición"
                                        options={['Diabetes tipo 2', 'Hipertensión', 'Problemas renales', 'Hipotiroidismo', 'Síndrome de intestino irritable', 'Gota', 'Celiaquía']}
                                        selected={medicalConditions}
                                        onToggle={(item) => setMedicalConditions(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item])}
                                        noRestrictionLabel="Sin condiciones médicas"
                                    />

                                    {/* Confirm button */}
                                    <button
                                        onClick={confirmRestrictions}
                                        className="w-full py-4 rounded-2xl font-medium text-sm uppercase tracking-widest transition-all duration-200 bg-neutral-900 text-white hover:bg-neutral-700"
                                    >
                                        Activar Escudo Biológico →
                                    </button>
                                </>
                            ) : (
                                /* Safety confirmation */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-6 py-12"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                                        className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto"
                                    >
                                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                    <div className="space-y-2">
                                        <p className="text-2xl font-extralight text-neutral-900">Filtros de Seguridad Activados</p>
                                        <p className="text-sm font-light text-emerald-600">Tu protocolo es ahora 100% seguro para tu diseño único.</p>
                                        <p className="text-xs text-neutral-400 mt-4">Generando tu protocolo personalizado...</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* FINALIZING PHASE - DNA Scanner */}
                    {phase === 'finalizing' && (
                        <motion.div key="finalizing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-6 bg-white min-h-[50vh]">
                            <DNA_Animation />

                            <div className="w-full max-w-sm mt-16 space-y-3">
                                {finalLines.map((line, i) => (
                                    <motion.p
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-[10px] md:text-xs font-mono text-neutral-400 bg-neutral-50 px-3 py-2 rounded border border-neutral-100/50"
                                    >
                                        <span className="text-blue-400 mr-2 opacity-70">❯</span> {line}
                                    </motion.p>
                                ))}
                            </div>
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
                                <h2 className="text-2xl md:text-4xl font-extralight text-neutral-900 leading-tight tracking-tight">{step.question}</h2>
                                {step.subtitle && <p className="text-sm text-neutral-500 font-light leading-relaxed max-w-lg">{step.subtitle}</p>}
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
                                                className={`group text-left p-5 border rounded-2xl transition-all duration-200 ${answers[step.id as keyof UserProfile] === c.value
                                                    ? 'border-primary bg-primary/8 shadow-sm'
                                                    : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-neutral-800 text-sm">{c.label}</span>
                                                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                {c.desc && <p className="text-xs text-neutral-500 mt-1 font-light">{c.desc}</p>}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* NUMBER */}
                                {step.type === 'number' && (
                                    <div className="space-y-6">
                                        <div className="flex items-end gap-4 border-b border-neutral-200 pb-2 focus-within:border-primary transition-colors">
                                            <input
                                                type="number"
                                                value={textValue}
                                                onChange={e => setTextValue(e.target.value)}
                                                placeholder={step.placeholder}
                                                min={step.min}
                                                max={step.max}
                                                className="flex-1 bg-transparent text-4xl md:text-5xl font-extralight text-neutral-900 focus:outline-none placeholder:text-neutral-300"
                                                onKeyDown={e => { if (e.key === 'Enter') handleTextConfirm(); }}
                                                autoFocus
                                            />
                                            {step.unit && <span className="text-lg text-neutral-400 mb-1">{step.unit}</span>}
                                        </div>
                                        <button onClick={handleTextConfirm} disabled={!textValue.trim()} className="group flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-neutral-600 disabled:opacity-30 hover:text-primary transition-colors">
                                            Confirmar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {/* TEXT */}
                                {step.type === 'text' && (
                                    <div className="space-y-6">
                                        <div className="flex items-end gap-4 border-b border-neutral-200 pb-2 focus-within:border-primary transition-colors">
                                            <input
                                                type="text"
                                                value={textValue}
                                                onChange={e => setTextValue(e.target.value)}
                                                placeholder={step.placeholder}
                                                className="flex-1 bg-transparent text-2xl md:text-3xl font-extralight text-neutral-900 focus:outline-none placeholder:text-neutral-300"
                                                onKeyDown={e => { if (e.key === 'Enter') handleTextConfirm(); }}
                                                autoFocus
                                            />
                                        </div>
                                        <button onClick={handleTextConfirm} disabled={!textValue.trim()} className="group flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-neutral-600 disabled:opacity-30 hover:text-primary transition-colors">
                                            Confirmar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {/* TEXTAREA — free text dream field */}
                                {step.type === 'textarea' && (
                                    <div className="space-y-6">
                                        <textarea
                                            value={textValue}
                                            onChange={e => setTextValue(e.target.value)}
                                            placeholder={step.placeholder}
                                            rows={5}
                                            className="w-full bg-white border border-neutral-200 rounded-2xl px-6 py-5 text-lg font-light text-neutral-900 focus:outline-none focus:border-primary placeholder:text-neutral-300 transition-colors resize-none leading-relaxed"
                                            autoFocus
                                        />
                                        <button onClick={handleTextConfirm} disabled={!textValue.trim()} className="group flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-neutral-600 disabled:opacity-30 hover:text-primary transition-colors">
                                            Activar Protocolo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
                                            La IA analizará tus palabras para calibrar el protocolo ideal.
                                        </p>
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
