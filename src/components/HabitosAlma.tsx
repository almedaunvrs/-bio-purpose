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
        { emoji: '🙏', title: 'Oración de gratitud al despertar (5 min antes de levantarte)', why: 'El atleta que agradece primero tiene más claridad y menos ego en la competencia' },
        { emoji: '🤝', title: 'Ayuda a alguien con una carga física hoy (mudanza, compras, trabajo)', why: 'La fuerza que construyes es para servir, no solo para ser visto' },
        { emoji: '📞', title: 'Llama a tu padre, mentor o figura que te formó', why: 'Los hombres que honran a sus padres reciben sabiduría de generaciones' },
        { emoji: '🌱', title: 'Planta una semilla hoy: una idea, un proyecto, un hábito nuevo', why: 'Los atletas de Dios construyen legado, no solo trofeos' },
        { emoji: '❌', title: 'Elimina una queja de tu vocabulario hoy — reemplázala con acción', why: 'El espíritu guerrero habla en hechos, no en excusas' },
    ],
    lider: [
        { emoji: '🙏', title: 'Diez minutos de silencio antes del primer mensaje o pantalla', why: 'Los líderes que escuchan a Dios primero no reaccionan — responden con sabiduría' },
        { emoji: '✍️', title: 'Escribe 3 personas a las que puedes agradecer hoy y hazlo real', why: 'La gratitud expresada multiplica las alianzas y el favor humano' },
        { emoji: '🤲', title: 'Haz un gesto económico o de tiempo a alguien que no puede devolvértelo', why: 'El líder que da sin esperar recibe sin límite — ley universal de la siembra' },
        { emoji: '🛑', title: 'Detén una decisión impulsiva hoy. Duerme sobre ella antes de actuar', why: 'Los hombres de Dios actúan con discernimiento, no con urgencia del ego' },
        { emoji: '👂', title: 'Escucha a alguien completo sin interrumpir — 10 minutos de atención pura', why: 'El que sabe escuchar construye equipos y familias invencibles' },
    ],
    explorador: [
        { emoji: '🙏', title: 'Da gracias por un detalle que normalmente pasas por alto (agua, aire, luz)', why: 'El explorador agradecido descubre maravillas donde otros ven lo ordinario' },
        { emoji: '🧭', title: 'Ayuda a alguien a encontrar dirección hoy — un consejo, una recomendación', why: 'Tu curiosidad y experiencia tiene valor para alguien que está perdido' },
        { emoji: '🌍', title: 'Aprende algo nuevo sobre una cultura, historia o persona diferente a ti', why: 'Dios diseñó la variedad para expandir nuestra comprensión de Él' },
        { emoji: '🗑️', title: 'Recoge o mejora algo del espacio que usas hoy — ambiente, casa, naturaleza', why: 'El explorador cuida la creación porque reconoce que no le pertenece' },
        { emoji: '💬', title: 'Comparte una historia de algo que aprendiste esta semana con alguien', why: 'El conocimiento guardado muere. Compartido, se multiplica y hace bien' },
    ],
};

// Habits for women by mission
const FEMALE_HABITS: Record<Mission, Habit[]> = {
    atleta: [
        { emoji: '🙏', title: 'Oración o meditación de 5 minutos antes de revisar el teléfono', why: 'La mujer atleta que comienza en paz maneja mejor la presión y la competencia' },
        { emoji: '💕', title: 'Anima a otra mujer de tu entorno hoy — sin comparación, sin competencia', why: 'Las mujeres fuertes elevan a las demás. El miedo compite, el amor construye.' },
        { emoji: '🏡', title: 'Haz algo por tu hogar o espacio que lo haga más acogedor para los tuyos', why: 'El nido que cuidas es el primer campo de entrenamiento de quienes amas' },
        { emoji: '🌸', title: 'Cuida tu feminidad hoy — un gesto de belleza, descanso o conexión contigo', why: 'Honrar tu diseño es darle gloria al Creador que te hizo diferente con propósito' },
        { emoji: '📖', title: 'Lee o escucha algo que nutra tu espíritu (no las redes sociales)', why: 'La atleta de Dios se nutre por dentro para poder dar por fuera' },
    ],
    lider: [
        { emoji: '🙏', title: 'Escribe una intención de amor para alguien de tu familia antes de comenzar el día', why: 'La mujer líder que guía su hogar en amor tiene autoridad real, no impostada' },
        { emoji: '🤗', title: 'Da un abrazo genuino o un gesto físico de afecto a alguien hoy', why: 'El toque humano libera oxitocina — el pegamento que une familias y equipos' },
        { emoji: '🛌', title: 'Duerme sin el teléfono al lado esta noche — un acto de confianza en Dios', why: 'La mujer que descansa confía. La que no puede parar, no ha soltado el control' },
        { emoji: '🎁', title: 'Regala algo pequeño hoy — tiempo, atención, una frase escrita a mano', why: 'Los regalos sin precio son los que más larga huella dejan en el corazón' },
        { emoji: '🙅', title: 'Di "no" a algo hoy sin culpa ni excusa — solo "no puedo en este momento"', why: 'Los límites de la mujer lider son santos: protegen su energía y su propósito' },
    ],
    explorador: [
        { emoji: '🙏', title: 'Agradece a Dios por algo de tu cuerpo que normalmente criticas', why: 'La paz con tu diseño físico es la base de toda exploración auténtica' },
        { emoji: '🌺', title: 'Lleva algo hermoso al día de alguien — flores, comida casera, una nota', why: 'La mujer exploradora transforma ambientes con su paso, no solo con sus words' },
        { emoji: '🤝', title: 'Conecta a dos personas que deberían conocerse hoy', why: 'Los puentes que construyen las mujeres pueden cambiar destinos completos' },
        { emoji: '📝', title: 'Escribe en un diario: qué aprendiste esta semana sobre ti misma', why: 'El autoconocimiento es el mapa de la exploradora más valiente' },
        { emoji: '🌟', title: 'Celebra un logro propio sin minimizarlo ni compararlo con nadie', why: 'Dios se da gloria cuando sus hijos/hijas valoran lo que Él construyó en ellos' },
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
