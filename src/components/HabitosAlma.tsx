'use client';

import { motion } from 'framer-motion';
import { CheckItem } from './CheckItem';
import { Mission, BiologicalSex } from '@/lib/types';

// ─── Habit definitions ────────────────────────────────────────────────────────

interface Habit {
    emoji: string;
    title: string;
    why: string;
}

// Habits for men by mission
const MALE_HABITS: Record<Mission, Habit[]> = {
    atleta: [
        { emoji: '🦅', title: 'Lidera con el ejemplo', why: 'El verdadero atleta de Dios no solo levanta peso, eleva el estándar de los demás' },
        { emoji: '🛡️', title: 'Protege el tiempo de descanso de tu equipo o familia', why: 'La fuerza que construyes es para servir y proteger, no solo para ser visto' },
        { emoji: '🙏', title: 'Oración de gratitud al despertar (5 min antes de levantarte)', why: 'El atleta que agradece primero tiene más claridad y menos ego en la competencia' },
        { emoji: '📞', title: 'Llama a tu padre, mentor o figura que te formó', why: 'Los hombres que honran a sus padres reciben sabiduría de generaciones' },
        { emoji: '❌', title: 'Elimina una queja de tu vocabulario hoy — reemplázala con acción', why: 'El espíritu guerrero habla en hechos, no en excusas' },
    ],
    lider: [
        { emoji: '🏋️', title: 'Lleva una carga pesada por alguien hoy', why: 'El líder absorbe la presión para que otros puedan operar en paz' },
        { emoji: '💡', title: 'Usa tu plataforma para dar un mensaje de luz', why: 'La influencia que Dios te dio no es para ti, es para alumbrar el camino a otros' },
        { emoji: '🦅', title: 'Lidera con el ejemplo', why: 'El liderazgo divino requiere firmeza de mente y ser el primero en la línea de fuego' },
        { emoji: '🙏', title: 'Agradece por tu templo antes de consumir el primer alimento', why: 'El alimento es provisión divina; dar gracias ancla tu ego a la Fuente' },
        { emoji: '🛡️', title: 'Protege el tiempo de descanso de tu equipo o familia', why: 'El honor de un líder se mide por la paz que provee a los suyos' },
    ],
    explorador: [
        { emoji: '🏋️', title: 'Busca una carga pesada que llevar por alguien más hoy', why: 'El explorador fuerte allana el camino para los que vienen detrás' },
        { emoji: '🧭', title: 'Ayuda a alguien a encontrar dirección hoy — un consejo, una recomendación', why: 'Tu curiosidad y experiencia tiene valor para alguien que está perdido' },
        { emoji: '🗣️', title: 'Da una instrucción clara y con amor a alguien que guíes', why: 'Proteger con la verdad es el acto más puro de amor masculino' },
        { emoji: '🗑️', title: 'Recoge o mejora algo del espacio que usas hoy', why: 'El explorador cuida la creación porque reconoce que no le pertenece' },
        { emoji: '🙏', title: 'Da gracias por un detalle que normalmente pasas por alto (agua, luz)', why: 'El explorador agradecido descubre maravillas donde otros ven lo ordinario' },
    ],
};

// Habits for women by mission
const FEMALE_HABITS: Record<Mission, Habit[]> = {
    atleta: [
        { emoji: '🕊️', title: 'Nutre la paz en tu entorno', why: 'La mujer sabia transforma el caos en paz con solo su presencia' },
        { emoji: '💬', title: 'Edifica con tus palabras a alguien que duda', why: 'La fuerza femenina que inspira cambia generaciones enteras' },
        { emoji: '👂', title: 'Escucha con el alma a alguien que sufre', why: 'Tu capacidad de nutrir emocionalmente es tu fuerza más poderosa' },
        { emoji: '💕', title: 'Anima a otra mujer de tu entorno hoy — sin comparación', why: 'Las mujeres fuertes elevan a las demás. El miedo compite, el amor construye.' },
        { emoji: '📖', title: 'Lee o escucha algo que nutra tu espíritu (no las redes)', why: 'La atleta de Dios se nutre por dentro para poder dar por fuera' },
    ],
    lider: [
        { emoji: '🕊️', title: 'Nutre la paz en tu entorno', why: 'El diseño divino de la mujer trae belleza a los lugares más fríos' },
        { emoji: '💬', title: 'Edifica con tus palabras a alguien que duda', why: 'La líder que edifica corazones tiene lealtad eterna de su gente' },
        { emoji: '📈', title: 'Ayuda a un empleado o colaborador a crecer hoy', why: 'La maternidad espiritual en los negocios crea empresas invencibles' },
        { emoji: '🙏', title: 'Escribe una intención de amor para alguien de tu familia', why: 'La mujer líder que guía su hogar en amor tiene autoridad real, no impostada' },
        { emoji: '🙅', title: 'Di "no" a algo hoy sin culpa ni excusa', why: 'Los límites de la mujer líder son santos: protegen su energía y su propósito' },
    ],
    explorador: [
        { emoji: '👂', title: 'Escucha con el alma a alguien que sufre', why: 'Ser refugio seguro es la mayor conquista de la mujer sabia' },
        { emoji: '🌸', title: 'Embellece tu entorno con un acto de orden y armonía', why: 'Donde la mujer exploradora pisa, el Edén florece de nuevo' },
        { emoji: '🤝', title: 'Conecta a dos personas que deberían conocerse hoy', why: 'Los puentes que construyen las mujeres pueden cambiar destinos completos' },
        { emoji: '📝', title: 'Escribe en un diario: qué aprendiste esta semana sobre ti misma', why: 'El autoconocimiento es el mapa de la exploradora más valiente' },
        { emoji: '🌟', title: 'Celebra un logro propio sin minimizarlo ni compararlo', why: 'Dios se da gloria cuando sus hijas valoran lo que Él construyó en ellas' },
    ],
};

function getHabits(sex: BiologicalSex | undefined, mission: Mission): Habit[] {
    if (sex === 'femenino') return FEMALE_HABITS[mission] ?? FEMALE_HABITS.lider;
    return MALE_HABITS[mission] ?? MALE_HABITS.lider;
}

interface HabitosAlmaProps {
    mission: Mission;
    biologicalSex?: BiologicalSex;
    sessionKey?: string;
}

export function HabitosAlma({ mission, biologicalSex, sessionKey }: HabitosAlmaProps) {
    const habits = getHabits(biologicalSex, mission);
    const sexLabel = biologicalSex === 'femenino' ? 'Mujer' : 'Hombre';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
                <span className="text-3xl leading-none">✦</span>
                <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-medium mb-1">
                        Hábitos del Alma · {sexLabel} {mission.charAt(0).toUpperCase() + mission.slice(1)}
                    </p>
                    <p className="text-xs font-light text-neutral-500 leading-relaxed max-w-lg">
                        Pequeñas acciones que Dios diseñó para que hagas hoy. No cambian el mundo entero — cambian el tuyo, y el de las personas que tocas.
                    </p>
                </div>
            </div>

            {/* Habits list */}
            <div className="space-y-3">
                {habits.map((habit, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <CheckItem
                            id={`habito-${mission}-${biologicalSex}-${i}`}
                            label={habit.title}
                            why={habit.why}
                            emoji={habit.emoji}
                            sessionKey={sessionKey}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Bottom wisdom */}
            <div className="border-t border-neutral-100 pt-4">
                <p className="text-[10px] font-light text-neutral-400 italic text-center leading-relaxed">
                    "Porque somos hechura suya, creados en Cristo Jesús para buenas obras, las cuales Dios preparó de antemano para que anduviésemos en ellas." — Ef. 2:10
                </p>
            </div>
        </div>
    );
}
