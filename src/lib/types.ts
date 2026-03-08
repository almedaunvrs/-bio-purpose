// ─── Mission Types ────────────────────────────────────────────────────────────
export type Mission = 'atleta' | 'explorador' | 'lider';
export type BodyType = 'ectomorfo' | 'mesomorfo' | 'endomorfo';
export type ActivityLevel = 'sedentario' | 'moderado' | 'activo' | 'muy_activo';
export type BiologicalSex = 'masculino' | 'femenino';
export type SleepQuality = 'mala' | 'regular' | 'buena';
export type ChronoPhase = 'Movimiento' | 'Festín' | 'Reparación';

// ─── Mission Theme ────────────────────────────────────────────────────────────
export interface MissionTheme {
  color: string;       // hex
  bg: string;
  border: string;
  gradient: string;
  label: string;
}

export const MISSION_THEMES: Record<Mission, MissionTheme> = {
  atleta: {
    color: '#F59E0B',
    bg: '#FFFBEB',
    border: '#FDE68A',
    gradient: 'from-amber-100 to-amber-50',
    label: 'Atleta de Alto Rendimiento',
  },
  explorador: {
    color: '#10B981',
    bg: '#ECFDF5',
    border: '#6EE7B7',
    gradient: 'from-emerald-100 to-emerald-50',
    label: 'Explorador Biológico',
  },
  lider: {
    color: '#6366F1',
    bg: '#EEF2FF',
    border: '#C7D2FE',
    gradient: 'from-indigo-100 to-indigo-50',
    label: 'Líder Creativo',
  },
};

// ─── Core Chrono Guidance ─────────────────────────────────────────────────────
export interface ChronoGuidance {
  phase: ChronoPhase;
  start: string;   // "06:00"
  end: string;     // "11:59"
  action: string;  // what to do right now
  gradient: string;
}

// ─── Nutrient Density ─────────────────────────────────────────────────────────
export interface NutrientDensity {
  magnesiumMg: number;
  potassiumMg: number;
  sodiumMg: number;
}

// ─── Gemini AI Protocol ───────────────────────────────────────────────────────
export interface GeminiProtocol {
  mission: Mission;
  missionLabel: string;
  missionReason: string;
  biologicalContext: string;
  targetBodyFatPercent: number;
  goalWeightKg: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  chronoGuidance: ChronoGuidance;
  nutrientDensity: NutrientDensity;
  keyInsights: string[];
  firstAction: string;
  wisdom?: string;
}

// ─── User Profile ─────────────────────────────────────────────────────────────
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
  location: string;
  timezone: string;
  injuries: string;

  // Goal
  mission: Mission;
  mainGoal: string;

  // Full Gemini AI protocol (set after AI analysis)
  geminiProtocol?: GeminiProtocol;
}

// ─── Nutrition Output ─────────────────────────────────────────────────────────
export interface MacroSplit {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

// ─── Chrono State ─────────────────────────────────────────────────────────────
export interface ChronoState {
  phase: ChronoPhase;
  state: string;
  message: string;
  gradient: string;
  colorClass: string;
}
