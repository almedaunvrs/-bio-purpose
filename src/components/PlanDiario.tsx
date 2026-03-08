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

// EXACT QUANTITIES — specific portions for each meal every day
const MEAL_TEMPLATES = [
    // Lunes — Construcción de músculo
    [
        { emoji: '🥚', name: '4 huevos enteros revueltos con ½ aguacate', why: 'Proteína completa + grasa para construir músculo desde el inicio del día' },
        { emoji: '🥩', name: '200g carne de res (1 filete tamaño de tu palma) + 150g batata al horno', why: 'Hierro + carbohidrato lento = energía sostenida sin picos de insulina' },
        { emoji: '🍗', name: '180g pechuga de pollo a la plancha + 1 taza brócoli al vapor', why: 'Leucina del pollo activa la síntesis proteica — el ladrillo del músculo' },
        { emoji: '🥜', name: '30g nueces de macadamia + 2 huevos duros', why: 'Grasas omega-9 + proteína nocturna para reparar mientras duermes' },
    ],
    // Martes — Fuerza y pierna
    [
        { emoji: '🍳', name: '3 huevos enteros + 2 claras en omelette con espinacas (2 puños)', why: 'Colina del huevo: combustible cognitivo + hierro de la espinaca' },
        { emoji: '🐟', name: '200g salmón a la plancha + 150g arroz blanco cocido (1 taza)', why: 'Omega-3 en salmón reduce inflamación post-entrenamiento de piernas' },
        { emoji: '🥩', name: '180g bistec de res + ensalada verde con 1 cdta aceite de oliva', why: 'Zinc + creatina natural del bistec para recuperar la fuerza de piernas' },
        { emoji: '🫐', name: '1 taza berries frescos + 30g almendras (1 puñado pequeño)', why: 'Antioxidantes reducen daño muscular — recuperación activa nocturna' },
    ],
    // Miércoles — Descanso y reparación
    [
        { emoji: '💧', name: 'Agua con ¼ cdta sal rosa + jugo de 1 limón (en ayunas, 400ml)', why: 'Electrolitos al despertar — enciende los cables eléctricos del cuerpo' },
        { emoji: '🥚', name: '2 huevos enteros + 1 aguacate entero (desayuno tardío 12pm)', why: 'Ventana de ayuno hasta las 12h activa la limpieza automática celular' },
        { emoji: '🍗', name: '150g pollo desmenuzado en caldo de huesos (2 tazas)', why: 'Colágeno + glutamina del caldo repara intestino y articulaciones' },
        { emoji: '🥜', name: '30g nueces mixtas + 1 naranja pequeña', why: 'Vitamina C mejora absorción del hierro de las proteínas del día' },
    ],
    // Jueves — Hombros, bíceps y tríceps
    [
        { emoji: '🥚', name: '5 claras + 2 huevos enteros revueltos + ½ aguacate', why: 'Ratio ideal proteína/grasa: máxima síntesis sin exceso calórico matutino' },
        { emoji: '🥩', name: '200g carne molida de res (90% magra) + 120g arroz integral (⅔ taza cocida)', why: 'Creatina natural + carbohidrato complejo = fuerza sostenida en hombros' },
        { emoji: '🐟', name: '180g atún en agua natural + 1 cdta aceite de oliva + ajo', why: 'Proteína limpia con omega-3 — sin interferencia hormonal del proceso' },
        { emoji: '🫘', name: '100g lentejas cocidas (½ taza) + vegetales asados', why: 'Fibra prebiótica alimenta tu ejército intestinal para absorber mejor' },
    ],
    // Viernes — Full Body y Core
    [
        { emoji: '🍳', name: '4 huevos enteros a cualquier estilo + 1 taza espinacas salteadas', why: 'Folato de espinacas + colina de huevo = máxima oxigenación cerebral' },
        { emoji: '🍗', name: '200g muslos de pollo al horno (con piel) + 150g batata morada', why: 'Grasa animal natural absorbe vitaminas A, D, K — esenciales para hormonas' },
        { emoji: '🥩', name: '160g salmón o atún + 1 aguacate pequeño en ensalada', why: 'Omega-3 + vitamina E del aguacate: recuperación anti-inflamatoria' },
        { emoji: '🥬', name: '2 tazas espinacas frescas con limón + 2 huevos duros', why: 'Magnesio de espinacas + proteína = relajación muscular nocturna' },
    ],
    // Sábado — Festín estratégico
    [
        { emoji: '🥚', name: '3 huevos enteros + vegetales a elección (desayuno tardío, sin presión)', why: 'Colina del huevo: combustible cognitivo premium sin necesidad de procesar' },
        { emoji: '🥩', name: '250g corte de res a las brasas (cualquier corte que disfrutes)', why: 'El ritual social es parte del protocolo. Disfruta. El cuerpo registra la alegría.' },
        { emoji: '🍌', name: '1 plátano maduro + 30g nueces de macadamia', why: 'Potasio + triptófano = serotonina natural. Tu cerebro necesita recargar.' },
        { emoji: '🫐', name: '1 taza berries mezclados (fresas, arándanos, moras)', why: 'Refuerzo antioxidante post-semana. Limpieza sistémica de la fatiga acumulada.' },
    ],
    // Domingo — Ayuno y preparación
    [
        { emoji: '💧', name: 'Agua con ½ cdta sal rosa + limón + pizca de pimienta cayena (ayunas)', why: 'Mineralización eléctrica máxima: Na-K-Mg al despertar sin gastar energía digestiva' },
        { emoji: '🥚', name: '3 huevos enteros + ½ aguacate + sal de mar (primer alimento del día, 11-12am)', why: 'Ayuno de 16h activa autofagia profunda — limpieza automática celular real' },
        { emoji: '🍗', name: '2 tazas caldo de huesos + 120g pollo desmenuzado', why: 'Colágeno tipo II repara cartílago y articulaciones para la semana siguiente' },
        { emoji: '🥜', name: '40g nueces mixtas (1 puñado generoso) antes dormir', why: 'Melatonina natural de nueces + magnesio = sueño profundo reparador' },
    ],
];

const DAY_TO_WORKOUT: Record<number, number | null> = {
    0: 0, 1: 1, 2: null, 3: 2, 4: 3, 5: null, 6: null,
};

const REST_MESSAGES: Record<number, string> = {
    2: '🧘 Día de recuperación activa. Camina 30 min, estira 15 min, hidratación máxima con electrolitos.',
    5: '☀️ Sábado activo. Actividad que disfrutes: nado, ciclismo, naturaleza. El descanso es entrenamiento.',
    6: '🌿 Domingo de reparación. Ayuno intermitente, caldo de huesos, movilidad suave. Tu cuerpo crece hoy.',
};

interface PlanDiarioProps {
    profile: UserProfile;
    routine: DayRoutine[];
    nutrition: MacroSplit;
    sessionKey?: string;
    onProgressChange?: (completed: number, total: number) => void;
}

export function PlanDiario({ profile, routine, nutrition, sessionKey, onProgressChange }: PlanDiarioProps) {
    const todayIdx = new Date().getDay();
    const todayKey = todayIdx === 0 ? 6 : todayIdx - 1;
    const [activeDay, setActiveDay] = useState(todayKey);
    const [completedCount, setCompletedCount] = useState<Record<string, boolean>>({});

    const theme = MISSION_THEMES[profile.mission];
    const meals = MEAL_TEMPLATES[activeDay];
    const workoutIdx = DAY_TO_WORKOUT[activeDay];
    const workoutDay = workoutIdx !== null ? routine[workoutIdx] : null;
    const restMessage = REST_MESSAGES[activeDay];

    const totalItems = meals.length + (workoutDay ? workoutDay.exercises.length : 0);
    const completed = Object.values(completedCount).filter(Boolean).length;

    const handleCheck = useCallback((itemKey: string, checked: boolean) => {
        setCompletedCount(prev => {
            const next = { ...prev, [itemKey]: checked };
            const count = Object.values(next).filter(Boolean).length;
            onProgressChange?.(count, totalItems);
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
                                onClick={() => { setActiveDay(day.key); setCompletedCount({}); }}
                                className={`relative flex flex-col items-center gap-1 px-4 py-3 rounded-2xl text-center transition-all duration-200 min-w-[60px] ${isActive ? 'text-white shadow-sm' : 'bg-white border border-neutral-100 text-neutral-600 hover:border-neutral-200 hover:bg-neutral-50'
                                    }`}
                                style={isActive ? { backgroundColor: theme.color } : {}}
                            >
                                <span className="text-[10px] font-semibold uppercase tracking-wider">{day.short}</span>
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white/60' : hasTraining ? 'bg-neutral-300' : 'bg-neutral-100'}`} />
                                {isToday && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-white" />}
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
                                    {Math.round(nutrition.calories / 3)} kcal por comida · Porciones exactas
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {meals.map((meal, i) => {
                                const itemKey = `day${activeDay}-meal${i}`;
                                return (
                                    <CheckItem
                                        key={itemKey}
                                        id={itemKey}
                                        label={meal.name}
                                        why={meal.why}
                                        emoji={meal.emoji}
                                        sessionKey={sessionKey}
                                        onCheck={(c) => handleCheck(itemKey, c)}
                                    />
                                );
                            })}
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
                                    const isBisetSecond = ex.name.startsWith('A2') || ex.name.startsWith('B2');
                                    const itemKey = `day${activeDay}-ex${i}`;
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
                                                id={itemKey}
                                                label={`${ex.name} — ${ex.sets} series × ${ex.reps} reps`}
                                                why={ex.notes || 'Activa músculos antagonistas para máxima eficiencia'}
                                                emoji="🏋️"
                                                sessionKey={sessionKey}
                                                onCheck={(c) => handleCheck(itemKey, c)}
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
