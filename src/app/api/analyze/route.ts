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
Calcula todos los macros y porciones basados en el PESO META (68kg), no en el actual (58kg).

3. PUREZA SISTÉMICA (BIO-SEGURIDAD):
- CERO LACTOSA: El usuario es intolerante. Prohibido lácteos.
- UN SOLO INGREDIENTE: Solo alimentos que el Creador hizo.

4. MISIONES DEL ALMA (HÁBITOS DE DIOS):
Diseña 3 hábitos diarios basados en el género y el propósito:
- HOMBRE (Líder/Protector): Hábitos de provisión, guía y fuerza.
- ACCIONES DE SERVICIO: Ayudar a alguien, palabras de aliento, generosidad desinteresada.
- UNIVERSAL: Agradece por tu templo antes de la primera comida.

════════════════════════════════════════════
ESQUEMA JSON — RESPONDE SOLO CON ESTO
════════════════════════════════════════════
{
  "mission": "atleta" | "explorador" | "lider",
  "missionLabel": "nombre del arquetipo (ej: Soberano de Alto Rendimiento)",
  "powerAnalysis": {
    "diagnosis": "Análisis de por qué su cuerpo actual (ej 58kg) es frágil para su sueño.",
    "theGap": "Explicación de los X kg de construcción necesarios.",
    "divineReason": "Por qué Dios requiere este peso para su misión de DJ/Empresario."
  },
  "goalWeightKg": 68,
  "calories": número,
  "proteinGrams": número, // 2.5g por kg de peso meta
  "carbsGrams": número,
  "fatsGrams": número,
  "gapPhase": "CONSTRUCCIÓN ACTIVA" | "DEFINICIÓN BIOLÓGICA",
  "gapMessage": "Mensaje dopaminérgico con línea de tiempo.",
  "portionPlan": {
    "proteinSource": "Cantidad exacta (ej: 4 Huevos Orgánicos) + razón biológica",
    "carbSource": "Cantidad exacta (ej: 250g de Arroz) + razón biológica",
    "fatSource": "Cantidad exact... etc",
    "preWorkout": "qué y cuánto",
    "postWorkout": "qué y cuánto"
  },
  "chronoGuidance": {
    "phase": "Movimiento",
    "start": "06:00",
    "end": "12:00",
    "action": "acción bio-alineada"
  },
  "nutrientDensity": {
    "magnesiumMg": 400,
    "potassiumMg": 4700,
    "sodiumMg": 2300
  },
  "keyInsights": [
    "Insight 1 - Impacto hormonal",
    "Insight 2 - Densidad de tejido",
    "Insight 3"
  ],
  "firstAction": "qué hacer mañana al despertar",
  "wisdom": "Una verdad profunda sobre la conexión Sueño-Biología.",
  "safetyNote": "Nota sobre el blindaje y sustitución de restricciones (cero lactosa)."
}
`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { mainGoal, biologicalSex, age, heightCm, weightKg, location } = body;

        // FORZAMOS LA LÓGICA DE PODER EN EL PROMPT DEL USUARIO
        const userPrompt = `
SUEÑO DEL ALMA: "${mainGoal}"
DATOS: ${biologicalSex}, ${age} años, ${heightCm}cm, ${weightKg}kg.
META EXPLÍCITA: El usuario DEBE llegar a la Meta de Poder (Altura - 100), ej. 68kg para 168cm, para su misión de ${mainGoal}.

INSTRUCCIÓN:
1. Realiza el ANÁLISIS DE PODER. Explica por qué para ${heightCm}cm y este sueño, el peso meta DEBE ser mayor (Masa Crítica, NUNCA sugerir el peso actual para mantener).
2. Calcula la dieta (gramos exactos) para tu Meta de Poder sugerida. Necesito ver "4 huevos", "250g de carne", etc. NUNCA calcules calorías/macros para su peso frágil actual.
3. El usuario es INTOLERANTE A LA LACTOSA. Prohibido lácteos.
4. Añade las MISIONES DEL ALMA de Dios.
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

        // Robust JSON extraction
        const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\{[\s\S]*\})/);
        const jsonStr = jsonMatch ? jsonMatch[1] : text;
        const parsed = JSON.parse(jsonStr.trim());

        // ── LOCAL HARD OVERRIDE FALLBACK (BACKUP DE HIERRO) ──────────────────
        // Si por alguna razón absurda la IA decide no obedecer el prompt 
        // y devuelve el mismo peso, lo forzamos por código antes de devolver el JSON.
        const dreamLower = mainGoal?.toLowerCase() || '';
        const isGrande = dreamLower.includes('dj') || dreamLower.includes('empresario') || dreamLower.includes('atleta') || dreamLower.includes('fisicoculturista');

        if (isGrande && Number(weightKg) < 62 && Number(heightCm) >= 165 && Number(heightCm) <= 170) {
            if (parsed.goalWeightKg < 68) {
                console.log(`[TEMPLO OVERRIDE] AI propuso ${parsed.goalWeightKg}kg. Forzando 68kg por LEY DE MASA CRITICA.`);
                parsed.goalWeightKg = 68;
                parsed.gapPhase = "CONSTRUCCIÓN ACTIVA";
                if (parsed.powerAnalysis) {
                    parsed.powerAnalysis.theGap = `Faltan ${68 - Number(weightKg)} kg de armadura funcional para resistir el llamado.`;
                }
            }
        }
        // ───────────────────────────────────────────────────────────────────────

        return NextResponse.json(parsed);
    } catch (error) {
        console.error('Gemini error:', error);
        return NextResponse.json({ error: 'Error interno en la Arquitectura Biológica' }, { status: 500 });
    }
}
