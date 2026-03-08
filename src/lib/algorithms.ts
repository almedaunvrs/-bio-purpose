import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { Mission, UserProfile, MacroSplit, BodyType, ActivityLevel, BiologicalSex } from './types';

// Activity multipliers
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    sedentario: 1.2,
    moderado: 1.375,
    activo: 1.55,
    muy_activo: 1.725,
};

// Katch-McArdle BMR Calculator - now fully personalized
export function calculateNutrition(profile: UserProfile): MacroSplit {
    const { weightKg, goalWeightKg, bodyFatPercentage, mission, activityLevel, bodyType, biologicalSex, stressLevel } = profile;

    // Lean Body Mass
    const lbm = weightKg * (1 - bodyFatPercentage / 100);

    // Basal Metabolic Rate (Katch-McArdle)
    const bmr = 370 + (21.6 * lbm);

    // TDEE based on activity level
    let tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];

    // Body type adjusts metabolism
    if (bodyType === 'ectomorfo') tdee *= 1.08;   // Fast metabolism, needs more food
    if (bodyType === 'endomorfo') tdee *= 0.94;   // Slower metabolism, needs less

    // Sex adjustment
    if (biologicalSex === 'femenino') tdee *= 0.92;

    // Stress raises cortisol, lowers effective recovery → slight calorie bump for muscle preservation
    const stressMultiplier = 1 + (stressLevel - 5) * 0.01;
    tdee *= stressMultiplier;

    // Goal caloric adjustment
    const isBulking = goalWeightKg > weightKg;
    const isCutting = goalWeightKg < weightKg;
    let targetCalories = tdee;
    if (isBulking) targetCalories += bodyType === 'ectomorfo' ? 600 : 400;
    if (isCutting) targetCalories -= bodyType === 'endomorfo' ? 600 : 400;

    // Base macro config
    let proteinMultiplier = 2.2; // g/kg
    let fatMultiplier = 1.0;     // g/kg

    // Mission-based macro priority
    if (mission === 'atleta') {
        proteinMultiplier = bodyType === 'ectomorfo' ? 2.8 : 2.5;
    } else if (mission === 'lider') {
        fatMultiplier = 1.3; // Brain fuel: omega-3, healthy fats
    } else if (mission === 'explorador') {
        fatMultiplier = 1.2;
    }

    // Body type fine-tuning
    if (bodyType === 'endomorfo') {
        fatMultiplier *= 0.85;  // Lower fat for endomorphs
        proteinMultiplier *= 1.1;  // More protein for satiety
    } else if (bodyType === 'ectomorfo') {
        fatMultiplier *= 1.1;  // Higher fat to hit calorie goals
    }

    // Sex fine-tuning
    if (biologicalSex === 'femenino') {
        fatMultiplier *= 1.15; // Females need more healthy fats (hormones)
    }

    // Sleep compensation: poor sleep → raise protein to preserve muscle
    if (profile.sleepQuality === 'mala') proteinMultiplier *= 1.1;

    const proteinGrams = Math.round(weightKg * proteinMultiplier);
    const fatsGrams = Math.round(weightKg * fatMultiplier);
    const proteinCalories = proteinGrams * 4;
    const fatsCalories = fatsGrams * 9;
    const remainingCalories = targetCalories - proteinCalories - fatsCalories;
    const carbsGrams = Math.max(30, Math.round(remainingCalories / 4));

    return {
        calories: Math.round(targetCalories),
        proteinGrams,
        carbsGrams,
        fatsGrams,
    };
}

export type ChronoState = 'Movimiento' | 'Festín' | 'Reparación';

export function getChrononutritionState(timezone?: string): { state: ChronoState, message: string } {
    const tz = timezone || 'America/Monterrey';
    const now = new Date();
    const zonedNow = toZonedTime(now, tz);
    const hour = zonedNow.getHours();

    if (hour >= 6 && hour < 12) {
        return {
            state: 'Movimiento',
            message: 'Es momento de activar el cuerpo. Entrenamiento en ayunas o con hidratación mineral.',
        };
    }
    if (hour >= 12 && hour < 20) {
        return {
            state: 'Festín',
            message: 'Ventana de alimentación abierta. Introduce las comidas densas, 100% libres de lactosa.',
        };
    }
    return {
        state: 'Reparación',
        message: 'Momento de neuro-protección y descanso. Apaga pantallas y prepara el sueño del alma.',
    };
}

// Guess timezone from city name (expanded map)
export function guessTimezone(location: string): string {
    const loc = location.toLowerCase();
    if (loc.includes('monterrey') || loc.includes('cdmx') || loc.includes('ciudad de mexico') || loc.includes('guadalajara') || loc.includes('monclova') || loc.includes('saltillo') || loc.includes('mexico') || loc.includes('mx')) return 'America/Monterrey';
    if (loc.includes('madrid') || loc.includes('barcelona') || loc.includes('españa') || loc.includes('spain')) return 'Europe/Madrid';
    if (loc.includes('bogota') || loc.includes('colombia')) return 'America/Bogota';
    if (loc.includes('buenos aires') || loc.includes('argentina')) return 'America/Argentina/Buenos_Aires';
    if (loc.includes('lima') || loc.includes('peru')) return 'America/Lima';
    if (loc.includes('santiago') || loc.includes('chile')) return 'America/Santiago';
    if (loc.includes('london') || loc.includes('uk') || loc.includes('reino unido')) return 'Europe/London';
    if (loc.includes('new york') || loc.includes('miami') || loc.includes('boston')) return 'America/New_York';
    if (loc.includes('los angeles') || loc.includes('la,') || loc.includes('california') || loc.includes('san francisco')) return 'America/Los_Angeles';
    if (loc.includes('chicago')) return 'America/Chicago';
    return 'America/Monterrey'; // fallback
}
