import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const TEMPLO_SYSTEM_PROMPT = `
Eres TEMPLO OS — El Arquitecto de Soberanía Biológica.
Tu misión: Diseñar el vehículo físico (Cuerpo) necesario para la misión del Alma.

════════════════════════════════════════════
REGLAS DE RAZONAMIENTO ARQUITECTÓNICO
════════════════════════════════════════════

1. EL SUEÑO DICTA EL DISEÑO:
Tu función NO es mantener al usuario en su peso actual. Tu función es proyectar la masa necesaria para su misión.
- Si el Sueño es GRANDE (DJ Internacional, Empresario, Atleta, Fisicoculturista): 
  La Meta de Poder DEBE ser >= (Altura en cm - 100). 
  Para 168cm, la meta es 68kg. Queda PROHIBIDO sugerir 58kg. Un motor de 58kg colapsará ante el estrés y los viajes.

2. LEY DE MASA CRÍTICA:
Si el usuario pesa menos que su Meta de Poder, el plan DEBE ser de "CONSTRUCCIÓN ACTIVA" (+600 a +800 kcal).
Calcula todos los macros y porciones basados en el PESO META, no en el actual.

3. PUREZA SISTÉMICA (BIO-SEGURIDAD):
- CERO LACTOSA: El usuario es intolerante. Prohibido lácteos.
- UN SOLO INGREDIENTE: Solo alimentos que el Creador hizo.

4. MISIONES DEL ALMA (HÁBITOS DE DIOS):
Diseña 3 hábitos diarios basados en el género y el propósito:
- HOMBRE (Líder/Protector): Hábitos de provisión, guía y fuerza.
- ACCIONES DE SERVICIO: Ayudar a alguien, palabras de aliento, generosidad desinteresada.

════════════════════════════════════════════
ESQUEMA JSON — RESPONDE SOLO CON ESTO, SIN TEXTO EXTRA
════════════════════════════════════════════

{
  "mission": "atleta" | "explorador" | "lider",
  "missionLabel": "nombre completo del arquetipo (puede ser híbrido, ej: 'Atleta-Líder Empresarial')",
  "missionReason": "2-3 líneas: por qué este cuerpo meta es requerido por el sueño. Lenguaje espiritual-científico. Si hubo corrección, explica por qué.",
  "biologicalContext": "Descripción del plan híbrido si aplica. 'Estamos alimentando tu cerebro para X y tus músculos para Y'. 3-4 oraciones con estudios.",
  "targetBodyFatPercent": número,
  "goalWeightKg": número (PESO QUE EL SUEÑO REQUIERE — puede ser mayor al actual),
  "calories": número,
  "proteinGrams": número,
  "carbsGrams": número,
  "fatsGrams": número,
  "gapPhase": "CONSTRUCCIÓN ACTIVA" | "DEFINICIÓN BIOLÓGICA" | "OPTIMIZACIÓN",
  "gapMessage": "Peso actual: Xkg → Meta de Poder: Ykg. [Mensaje dopaminérgico con timeline].",
  "portionPlan": {
    "proteinSource": "nombre + gramos + traducción visual",
    "carbSource": "nombre + gramos + traducción visual",
    "fatSource": "nombre + gramos + traducción visual",
    "preWorkout": "qué y cuánto antes del entrenamiento",
    "postWorkout": "qué y cuánto después del entrenamiento"
  },
  "chronoGuidance": {
    "phase": "Movimiento" | "Festín" | "Reparación",
    "start": "HH:MM",
    "end": "HH:MM",
    "action": "qué hacer AHORA MISMO"
  },
  "nutrientDensity": {
    "magnesiumMg": número,
    "potassiumMg": número,
    "sodiumMg": número
  },
  "keyInsights": [
    "Insight 1 específico para su sueño exacto",
    "Insight 2 con referencia a estudio real",
    "Insight 3 accionable"
  ],
  "firstAction": "Primera acción concreta y específica mañana al despertar. Poética y motivadora.",
  "wisdom": "Una verdad profunda sobre la conexión entre el sueño y la biología. SIEMPRE incluir.",
  "safetyNote": "Si hubo restricciones activas, explica positivamente cómo el protocolo fue blindado para ESTE templo específico. Si no hubo restricciones, deja null."
}
`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            mainGoal, biologicalSex, age, heightCm, weightKg,
            bodyType, activityLevel, sleepQuality, stressLevel, location,
            foodAllergies = [], foodIntolerances = [], medicalConditions = [],
        } = body;

        if (!mainGoal || !weightKg || !heightCm) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const hour = new Date().getHours();
        let chronoContext = 'Festín (12:00-19:59)';
        if (hour >= 6 && hour < 12) chronoContext = 'Movimiento (06:00-11:59)';
        else if (hour >= 20 || hour < 6) chronoContext = 'Reparación (20:00-05:59)';

        // Pre-calculate basic metrics to give Gemini context
        const heightM = (Number(heightCm)) / 100;
        const bmi = Number(weightKg) / (heightM * heightM);
        const estimatedBodyFat = biologicalSex === 'femenino' ? 25 : 18; // rough estimate
        const leanMass = Number(weightKg) * (1 - estimatedBodyFat / 100);
        const ffmi = leanMass / (heightM * heightM);

        const allAllergies = [...(foodAllergies as string[]), ...(foodIntolerances as string[])];
        const hasRestrictions = allAllergies.length > 0 || (medicalConditions as string[]).length > 0;

        const restrictionsBlock = hasRestrictions ? `
⚠️ INTERFERENCIAS BIO-INDIVIDUALES REGISTRADAS — REGLAS INQUEBRANTABLES:
${(foodAllergies as string[]).length > 0
                ? `ALERGIAS (PROHIBICIÓN ABSOLUTA): ${(foodAllergies as string[]).join(', ')}`
                : ''
            }
${(foodIntolerances as string[]).length > 0
                ? `INTOLERANCIAS (PROHIBICIÓN ABSOLUTA): ${(foodIntolerances as string[]).join(', ')}`
                : ''
            }
${(medicalConditions as string[]).length > 0
                ? `CONDICIONES MÉDICAS (ADAPTACIONES OBLIGATORIAS): ${(medicalConditions as string[]).join(', ')}`
                : ''
            }
NINGÚN alimento de las listas anteriores puede aparecer en el plan. Sustituye con la alternativa biológica más cercana.
` : 'Sin interferencias declaradas (aplica Ley IV base: cero lactosa)';

        const demands = body.demands || 'Ninguna especificada';
        const timeframe = body.timeframe || '6 meses';

        const userPrompt = `
SUEÑO DEL ALMA: "${mainGoal}"
DEMANDAS: "${demands}"
PLAZO REQUERIDO: ${timeframe}

DATA BIOLÓGICOS ACTUALES:
- Sexo: ${biologicalSex} | Edad: ${age} años
- Estatura: ${heightCm}cm (${heightM.toFixed(2)}m) | Peso actual: ${weightKg}kg
- IMC actual: ${bmi.toFixed(1)} | FFMI estimado actual: ${ffmi.toFixed(1)}
- Tipo de cuerpo: ${bodyType}
- Actividad: ${activityLevel} | Sueño: ${sleepQuality}
- Estrés: ${stressLevel}/10
- Ubicación: ${location || 'México'}
- Fase cronobiológica actual: ${chronoContext}

${restrictionsBlock}

META EXPLÍCITA: El usuario quiere cumplir la Meta de Poder (ej. 68kg para 1.68m) para su misión.

INSTRUCCIÓN:
1. Realiza el ANÁLISIS DE PODER. Explica por qué para su estatura y este sueño, el peso meta DEBE ser mayor (Masa Crítica).
2. Calcula la dieta (gramos exactos y macros) EXCLUSIVAMENTE para la Meta de Poder que vas a establecer. Necesito ver "4 huevos", "250g de carne", etc. NUNCA calcules el plan para reparar el peso actual.
3. El usuario es INTOLERANTE A LA LACTOSA (o aplica pureza sistémica si no declara). Prohibido lácteos.
4. Explica en los insights biológicos o wisdom que estas metas son Requisitos del Diseño de Dios, no vanidad.

Responde ÚNICAMENTE con el JSON.
`;

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: TEMPLO_SYSTEM_PROMPT,
            generationConfig: {
                temperature: 0.75,
                topP: 0.9,
                maxOutputTokens: 3000,
            },
        });

        const result = await model.generateContent(userPrompt);
        const text = result.response.text();

        const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\{[\s\S]*\})/);
        const jsonStr = jsonMatch ? jsonMatch[1] : text;
        const parsed = JSON.parse(jsonStr.trim());

        // ── MANUAL OVERRIDES REMOVED ──────────────────────────────────────────
        // Lógica de cálculo numérico totalmente delegada al "Master Prompt".

        return NextResponse.json(parsed);
    } catch (error) {
        console.error('Gemini error:', error);
        return NextResponse.json({ error: 'Error procesando tu protocolo.' }, { status: 500 });
    }
}
