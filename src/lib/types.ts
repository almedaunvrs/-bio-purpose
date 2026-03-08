export type Mission = "explorador" | "atleta" | "lider";

export interface UserProfile {
  age: number;
  heightCm: number;
  weightKg: number;
  goalWeightKg: number;
  bodyFatPercentage: number;
  mission: Mission;
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
