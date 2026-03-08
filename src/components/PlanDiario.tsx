'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckItem } from './CheckItem';
import { UserProfile, MISSION_THEMES, MacroSplit } from '@/lib/types';
import { DayRoutine } from '@/lib/workouts';

const DAYS = [
    { key: 0, short: 'Lun', long: 'Lunes' },
    { key: 1, short: 'Mar', long: 'Martes' },
    { key: 2, short: 'Mié', long: 'Miércoles' },
    { key: 3, short: 'Jue', long: 'Jueves' },
    { key: 4, short: 'Vie', long: 'Viernes' },
    { key: 5, short: 'Sáb', long: 'Sábado' },
    { key: 6, short: 'Dom', long: 'Domingo' },
];

// Meal plans per day (7 days, cycles through variety)
const MEAL_TEMPLATES = [
    // Lunes
    [
        { emoji: '🥚', name: 'Huevos revueltos con aguacate', why: 'Proteína completa para construir músculo desde el inicio' },
        { emoji: '🥩', name: 'Carne de res (200g)', why: 'Hierro biodisponible para mantener energía todo el día' },
        { emoji: '🍠', name: 'Batata al horno', why: 'Carbohidrato lento para energía sostenida sin picos' },
        { emoji: '🥗', name: 'Ensalada verde con aceite de oliva', why: 'Grasas buenas protegen tu cerebro y corazón' },
    ],
    // Martes
    [
        { emoji: '🍳', name: 'Omelette de espinacas y champiñones', why: 'Magnesio y B12 para activar tus "cables eléctricos"' },
        { emoji: '🐟', name: 'Salmón a la plancha (200g)', why: 'Omega-3 — construye tu cerebro y reduce inflamación' },
        { emoji: '🍚', name: 'Arroz blanco (150g cocido)', why: 'Recarga muscular rápida post-entrenamiento' },
        { emoji: '🥑', name: 'Aguacate entero', why: 'Potasio para que tu corazón lata perfecto' },
    ],
    // Miércoles (descanso — nutrición de reparación)
    [
        { emoji: '🫐', name: 'Berries con nueces', why: 'Antioxidantes activan la limpieza automática celular' },
        { emoji: '🍗', name: 'Pollo al horno (200g)', why: 'Proteína ligera — día de reparación muscular' },
        { emoji: '🥦', name: 'Brócoli al vapor', why: 'Sulforafano: el vegetal que protege tu ADN' },
        { emoji: '🫒', name: 'Aceite de oliva extra virgen', why: 'Activa genes anti-inflamatorios — medicina líquida' },
    ],
    // Jueves
    [
        { emoji: '🥚', name: '4 Claras + 2 Huevos enteros', why: 'Ratio ideal proteína/grasa para construir sin acumular' },
        { emoji: '🥩', name: 'Bistec de res (180g)', why: 'Zinc y creatina natural para fuerza real' },
        { emoji: '🫘', name: 'Lentejas (100g)', why: 'Fibra que alimenta a tu microbiota — los guardianes' },
        { emoji: '🧅', name: 'Cebolla morada cruda', why: 'Quercetina: anti-inflamatoria más poderosa de la cocina' },
    ],
    // Viernes
    [
        { emoji: '🐟', name: 'Atún en agua natural (150g)', why: 'Proteína limpia, rápida — sin interferencia hormonal' },
        { emoji: '🍗', name: 'Muslos de pollo con piel', why: 'Grasa animal natural para absorber vitaminas liposolubles' },
        { emoji: '🍠', name: 'Camote morado', why: 'Antocianinas: carbohidrato que también protege el cerebro' },
        { emoji: '🥬', name: 'Espinacas frescas', why: 'Hierro + folato para oxigenar cada célula del cuerpo' },
    ],
    // Sábado (festín social — estratégico)
    [
        { emoji: '🥚', name: 'Huevos benedictinos (sin salsa procesada)', why: 'Colina del huevo: combustible cognitivo premium' },
        { emoji: '🥩', name: 'Corte de res a las brasas', why: 'Disfruta. El ritual social es parte del protocolo TEMPLO' },
        { emoji: '🍌', name: 'Plátano maduro', why: 'Potasio máximo + triptófano para serotonina natural' },
        { emoji: '🫐', name: 'Mix de berries frescos', why: 'Refuerzo antioxidante post-semana de entrenamiento' },
    ],
    // Domingo (ayuno + reparación)
    [
        { emoji: '💧', name: 'Agua con sal rosa + limón (en ayunas)', why: 'Electrolitos al despertar — enciende los cables eléctricos' },
        { emoji: '🍳', name: 'Desayuno tardío: huevos + aguacate (12pm)', why: 'Ventana de ayuno activa la limpieza automática celular' },
        { emoji: '🍗', name: 'Caldo de huesos (2 tazas)', why: 'Colágeno biodisponible repara articulaciones y gut' },
        { emoji: '🥜', name: 'Puño de nueces de macadamia', why: 'Grasa más similar a la leche materna — pura biología' },
    ],
];

// 4 training days + 3 rest/recovery, mapped to 7-day week
const DAY_TO_WORKOUT: Record<number, number | null> = {
    0: 0, // Lun → Día 1
    1: 1, // Mar → Día 2
    2: null, // Mié → Descanso
    3: 2, // Jue → Día 3
    4: 3, // Vie → Día 4
    5: null, // Sáb → Descanso activo
    6: null, // Dom → Recuperación
};

const REST_MESSAGES: Record<number, string> = {
    2: '🧘 Día de recuperación activa. Camina 30 min, estira, hidratación máxima con electrolitos.',
    5: '☀️ Sábado activo. Actividad que disfrutes: nado, ciclismo, naturaleza. El descanso es entrenamiento.',
    6: '🌿 Domingo de reparación. Ayuno intermitente, caldo de huesos, movilidad suave. Tu cuerpo crece hoy.',
};

interface PlanDiarioProps {
    profile: UserProfile;
    routine: DayRoutine[];
    nutrition: MacroSplit;
    onProgressChange?: (completed: number, total: number) => void;
}

export function PlanDiario({ profile, routine, nutrition, onProgressChange }: PlanDiarioProps) {
    const todayIdx = new Date().getDay();
    // Convert Sunday=0 to Mon=0 index
    const todayKey = todayIdx === 0 ? 6 : todayIdx - 1;
    const [activeDay, setActiveDay] = useState(todayKey);
    const [checkedCount, setCheckedCount] = useState(0);

    const theme = MISSION_THEMES[profile.mission];
    const meals = MEAL_TEMPLATES[activeDay];
    const workoutIdx = DAY_TO_WORKOUT[activeDay];
    const workoutDay = workoutIdx !== null ? routine[workoutIdx] : null;
    const restMessage = REST_MESSAGES[activeDay];

    // Total items for this day
    const totalItems = meals.length + (workoutDay ? workoutDay.exercises.length : 0);

    const handleCheck = useCallback(() => {
        setCheckedCount(prev => {
            const next = prev + 1;
            onProgressChange?.(next, totalItems);
            return next;
        });
    }, [totalItems, onProgressChange]);

    return (
        <div className="space-y-6">
            {/* Day Tabs */}
            <div className="overflow-x-auto -mx-1 px-1">
                <div className="flex gap-2 min-w-max">
                    {DAYS.map((day) => {
                        const isToday = day.key === todayKey;
                        const isActive = day.key === activeDay;
                        const hasTraining = DAY_TO_WORKOUT[day.key] !== null;

                        return (
                            <button
                                key={day.key}
                                onClick={() => { setActiveDay(day.key); setCheckedCount(0); }}
                                className={`relative flex flex-col items-center gap-1 px-4 py-3 rounded-2xl text-center transition-all duration-200 min-w-[60px] ${isActive
                                        ? 'text-white shadow-sm'
                                        : 'bg-white border border-neutral-100 text-neutral-600 hover:border-neutral-200 hover:bg-neutral-50'
                                    }`}
                                style={isActive ? { backgroundColor: theme.color } : {}}
                            >
                                <span className="text-[10px] font-semibold uppercase tracking-wider">{day.short}</span>
                                {/* Training/rest indicator */}
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive
                                        ? 'bg-white/60'
                                        : hasTraining ? 'bg-neutral-300' : 'bg-neutral-100'
                                    }`} />
                                {isToday && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-white" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Day Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeDay}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {/* QUÉ COMER */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                            <span className="text-xl">🍽️</span>
                            <div>
                                <h3 className="text-sm font-semibold text-neutral-800">Qué Comer</h3>
                                <p className="text-[10px] text-neutral-400">
                                    {Math.round(nutrition.calories / 3)} kcal por comida · Un solo ingrediente
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {meals.map((meal, i) => (
                                <CheckItem
                                    key={`${activeDay}-meal-${i}`}
                                    id={`day${activeDay}-meal${i}`}
                                    label={meal.name}
                                    why={meal.why}
                                    emoji={meal.emoji}
                                    onCheck={handleCheck}
                                />
                            ))}
                        </div>
                    </div>

                    {/* QUÉ ENTRENAR */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                            <span className="text-xl">💪</span>
                            <div>
                                <h3 className="text-sm font-semibold text-neutral-800">
                                    {workoutDay ? workoutDay.focus : 'Recuperación Activa'}
                                </h3>
                                <p className="text-[10px] text-neutral-400">
                                    {workoutDay ? 'Bisets antagonistas · Construcción de músculo' : 'Descanso que construye'}
                                </p>
                            </div>
                        </div>

                        {workoutDay ? (
                            <div className="space-y-2">
                                {workoutDay.exercises.map((ex, i) => {
                                    const isBisetFirst = ex.name.startsWith('A1') || ex.name.startsWith('B1');
                                    const isBisetSecond = ex.name.startsWith('A2') || ex.name.startsWith('B2');
                                    return (
                                        <div key={i} className="relative">
                                            {isBisetSecond && (
                                                <div className="flex items-center gap-2 my-1 px-4">
                                                    <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${theme.color}20, ${theme.color}50)` }} />
                                                    <span className="text-[8px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: theme.color, backgroundColor: `${theme.color}12` }}>
                                                        Sinergia
                                                    </span>
                                                    <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, ${theme.color}20, ${theme.color}50)` }} />
                                                </div>
                                            )}
                                            <CheckItem
                                                id={`day${activeDay}-ex${i}`}
                                                label={`${ex.name} — ${ex.sets}×${ex.reps}`}
                                                why={ex.notes || 'Activa músculos antagonistas para máxima eficiencia'}
                                                emoji="🏋️"
                                                onCheck={handleCheck}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="border border-neutral-100 rounded-2xl p-6 bg-neutral-50/50 text-center space-y-2">
                                <p className="text-2xl">🌿</p>
                                <p className="text-sm font-light text-neutral-600 leading-relaxed">{restMessage}</p>
                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider">El descanso es donde crece el músculo</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
