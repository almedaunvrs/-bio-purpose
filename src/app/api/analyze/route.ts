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
        const { mainGoal, biologicalSex, age, heightCm, weightKg } = body;

        // 1. Calculamos la Meta de Poder ANTES de enviarla a la IA para que no tenga opción de dudar.
        const powerWeightGoal = Number(heightCm) - 100; // Regla de Oro: 168cm -> 68kg

        const userPrompt = `
DATOS BIOLÓGICOS ACTUALES:
- Sexo: ${biologicalSex}
- Edad: ${age}
- Altura: ${heightCm} cm
- Peso Actual: ${weightKg} kg (ESTADO DE FRAGILIDAD)

SUEÑO DEL ALMA (EL OBJETIVO): "${mainGoal}"

MANDATOS CRÍTICOS DE ARQUITECTURA:
1. PESO META OBLIGATORIO: Tu análisis DEBE basarse en alcanzar los ${powerWeightGoal} kg. Ignora cualquier cálculo de salud estándar que sugiera que ${weightKg} kg es suficiente. Para un ${mainGoal}, el cuerpo actual es un motor pequeño.
2. CÁLCULO DE MACROS: Calcula la proteína basándote en el peso meta de ${powerWeightGoal} kg (2.5g por kg).
3. FASE: Debe ser "CONSTRUCCIÓN ACTIVA". No sugieras mantenimiento.
4. DIETA: El usuario es INTOLERANTE A LA LACTOSA. Prohibido lácteos. Usa porciones reales (ej: 5 huevos, 300g de carne, 2 tazas de arroz).
5. RESPONDE ÚNICAMENTE EN EL FORMATO JSON SOLICITADO.
`;

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash', // Gemini 1.5 Flash es excelente siguiendo formatos JSON
            systemInstruction: TEMPLO_SYSTEM_PROMPT,
            generationConfig: {
                temperature: 0.9, // Aumentamos un poco para que sea más creativo/audaz con el "análisis de poder"
                topP: 0.95,
                maxOutputTokens: 2000,
                responseMimeType: "application/json", // Forzamos modo JSON nativo
            },
        });

        const result = await model.generateContent(userPrompt);
        const text = result.response.text();

        // Limpiamos el texto por si la IA añade markdown \`\`\`json
        const cleanJson = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanJson);

        // HARD OVERRIDE DE SEGURIDAD (Si la IA falla, el código manda)
        if (parsed.goalWeightKg < powerWeightGoal) {
            parsed.goalWeightKg = powerWeightGoal;
            parsed.gapPhase = "CONSTRUCCIÓN ACTIVA";
        }

        return NextResponse.json(parsed);
    } catch (error) {
        console.error('Templo OS Error:', error);
        return NextResponse.json({ error: 'Error en la Arquitectura Biológica' }, { status: 500 });
    }
}
