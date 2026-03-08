import { Mission } from './types';

export interface Exercise {
    name: string;
    sets: number;
    reps: string;
    notes: string;
}

export interface DayRoutine {
    day: string;
    focus: string;
    exercises: Exercise[];
}

export function getWorkoutRoutine(mission: Mission): DayRoutine[] {
    // Base hypertrophy routine based on antagonist supersets
    const routine: DayRoutine[] = [
        {
            day: 'Día 1',
            focus: 'Torso: Pecho y Espalda (Biseries Antagonistas)',
            exercises: [
                { name: 'A1. Press de Banca Inclinado', sets: 4, reps: '8-10', notes: 'Control excéntrico' },
                { name: 'A2. Dominadas (o Jalón al Pecho)', sets: 4, reps: '8-10', notes: 'Sin descanso después de A1' },
                { name: 'B1. Press con Mancuernas Plano', sets: 3, reps: '10-12', notes: 'Máximo estiramiento' },
                { name: 'B2. Remo con Barra', sets: 3, reps: '10-12', notes: 'Aprieta la escápula 1 seg' },
            ]
        },
        {
            day: 'Día 2',
            focus: 'Pierna: Cuádriceps y Femorales',
            exercises: [
                { name: 'A1. Sentadilla Hack o Libre', sets: 4, reps: '8-10', notes: 'Rango completo' },
                { name: 'A2. Peso Muerto Rumano', sets: 4, reps: '8-10', notes: 'Sintiendo el isquio' },
                { name: 'B1. Extensión de Pierna', sets: 3, reps: '12-15', notes: 'Aguantar 1 seg arriba' },
                { name: 'B2. Curl Femoral', sets: 3, reps: '12-15', notes: 'Control lento' },
            ]
        },
        {
            day: 'Día 3',
            focus: 'Brazos y Hombros (Bíceps, Tríceps, Deltoides)',
            exercises: [
                { name: 'A1. Press Militar (Hombro)', sets: 4, reps: '8-10', notes: 'Empuje vertical fuerte' },
                { name: 'A2. Elevaciones Laterales', sets: 4, reps: '12-15', notes: 'Control lateral' },
                { name: 'B1. Curl con Barra (Bíceps)', sets: 3, reps: '10-12', notes: 'Codos pegados' },
                { name: 'B2. Extensión de Tríceps en Polea', sets: 3, reps: '10-12', notes: 'Apertura de la cuerda al final' },
            ]
        },
        {
            day: 'Día 4',
            focus: 'Full Body Funcional y Core',
            exercises: [
                { name: 'A1. Zancadas Búlgaras', sets: 3, reps: '10 por pierna', notes: 'Estabilidad' },
                { name: 'A2. Flexiones al fallo', sets: 3, reps: 'Fallo', notes: 'Pecho al piso' },
                { name: 'B1. Plancha Abdominal', sets: 3, reps: '45-60 seg', notes: 'Cuerpo recto' },
                { name: 'B2. Farmer\'s Walk (Paseo del Granjero)', sets: 3, reps: '40 metros', notes: 'Postura perfecta' },
            ]
        }
    ];

    // Adjust routine based on mission
    if (mission === 'explorador') {
        // Add some endurance / stamina focus
        routine[3].exercises.push({
            name: 'Salto a la caja / Plyo',
            sets: 3,
            reps: '10',
            notes: 'Explosividad para resistencia en viajes'
        });
    } else if (mission === 'atleta') {
        // Add more intense hypertrophy/strength
        routine[0].exercises[0].sets = 5;
        routine[0].exercises[1].sets = 5;
        routine[1].exercises[0].sets = 5;
        routine[1].exercises[1].sets = 5;
    } else if (mission === 'lider') {
        // Focus on movement quality & stress relief
        routine[3].exercises.push({
            name: 'Estiramientos Dinámicos y Yoga',
            sets: 1,
            reps: '15 min',
            notes: 'Manejo de estrés y neuro-protección'
        });
    }

    return routine;
}
