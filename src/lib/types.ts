export type Mission = "explorador" | "atleta" | "lider";
export type BodyType = "ectomorfo" | "mesomorfo" | "endomorfo";
export type ActivityLevel = "sedentario" | "moderado" | "activo" | "muy_activo";
export type BiologicalSex = "masculino" | "femenino";
export type SleepQuality = "mala" | "regular" | "buena";

export interface UserProfile {
  // Biometrics
  age: number;
  heightCm: number;
  weightKg: number;
  goalWeightKg: number;
  bodyFatPercentage: number;
  biologicalSex: BiologicalSex;

  // Body composition
  bodyType: BodyType;

  // Lifestyle
  activityLevel: ActivityLevel;
  sleepQuality: SleepQuality;
  stressLevel: number; // 1-10

  // Context
  location: string;    // city / country for timezone awareness
  timezone: string;    // IANA timezone string
  injuries: string;    // "ninguna" or free text

  // Goal
  mission: Mission;
  mainGoal: string;    // free text summary of what they want to achieve
}

export interface MacroSplit {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export interface BioState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  resetProfile: () => void;
}
