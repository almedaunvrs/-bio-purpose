import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { Mission, UserProfile, MacroSplit } from './types';

// Katch-McArdle BMR Calculator
export function calculateNutrition(profile: UserProfile): MacroSplit {
    const { weightKg, goalWeightKg, bodyFatPercentage, mission } = profile;

    // Lean Body Mass
    const lbm = weightKg * (1 - bodyFatPercentage / 100);

    // Basal Metabolic Rate
    let bmr = 370 + (21.6 * lbm);

    // Total Daily Energy Expenditure (Assuming moderate/high activity for these missions)
    let tdee = bmr * 1.55;

    // Surplus or Deficit
    const isBulking = goalWeightKg > weightKg;
    const isCutting = goalWeightKg < weightKg;

    let targetCalories = tdee;
    if (isBulking) targetCalories += 400; // Hypertrophy surplus
    if (isCutting) targetCalories -= 400; // Fat loss deficit

    // Base Macros
    let proteinMultiplier = 2.2; // grams per kg
    let fatMultiplier = 1.0; // grams per kg

    // Mission Tweaks
    if (mission === 'explorador') {
        // Sustained energy: higher fat, lower carb
        fatMultiplier = 1.3;
    } else if (mission === 'atleta') {
        // Explosiveness: high carb, very high protein
        proteinMultiplier = 2.5;
        // In the user prompt, they mentioned wanting ~250g protein for atleta
        if (proteinMultiplier * weightKg < 200) {
            proteinMultiplier = 200 / weightKg; // bump it up to hit high protein if Atleta
        }
    } else if (mission === 'lider') {
        // Focus, neuro-protection: moderate/high fats for brain
        fatMultiplier = 1.2;
    }

    const proteinGrams = Math.round(weightKg * proteinMultiplier);
    const fatsGrams = Math.round(weightKg * fatMultiplier);

    const proteinCalories = proteinGrams * 4;
    const fatsCalories = fatsGrams * 9;

    const remainingCalories = targetCalories - proteinCalories - fatsCalories;
    const carbsGrams = Math.max(0, Math.round(remainingCalories / 4)); // Ensure carbs don't go negative

    return {
        calories: Math.round(targetCalories),
        proteinGrams,
        carbsGrams,
        fatsGrams
    };
}

export type ChronoState = 'Movimiento' | 'Festín' | 'Reparación';

export function getChrononutritionState(): { state: ChronoState, message: string } {
    const timeZone = 'America/Monterrey'; // Monclova uses Monterrey timezone
    const now = new Date();

    const zonedNow = toZonedTime(now, timeZone);
    const hour = zonedNow.getHours();

    // 6:00 to 11:59 => Movimiento
    if (hour >= 6 && hour < 12) {
        return {
            state: 'Movimiento',
            message: 'Es momento de activar el cuerpo. Entrenamiento en ayunas o con hidratación mineral.'
        };
    }
    // 12:00 to 19:59 => Festín
    if (hour >= 12 && hour < 20) {
        return {
            state: 'Festín',
            message: 'Ventana de alimentación abierta. Introduce las 3 comidas densas, 100% libres de lactosa.'
        };
    }
    // 20:00 to 5:59 => Reparación
    return {
        state: 'Reparación',
        message: 'Momento de neuro-protección y descanso. Apaga pantallas y prepara el sueño del alma.'
    };
}
