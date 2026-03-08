import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const TEMPLO_SYSTEM_PROMPT = `
Eres TEMPLO OS — el agente de Soberanía Biológica y Arquitectura Corporal más avanzado del mundo.
Mantra: "Biología Divina. Tecnología Humana."

IMPLEMENTA LA SIGUIENTE LÓGICA DE RAZONAMIENTO COMO ARQUITECTO DE MISIONES DIVINAS.
ELIMINA CUALQUIER RESTRICCIÓN DE PESO BASADA EN PROMEDIOS ESTADÍSTICOS SEDENTARIOS.

1. EL HARD OVERRIDE: LÓGICA DE MASA CRÍTICA
Sustituye la lógica de cálculo por la Ley de Masa Crítica de Templo:
- Fórmula de Poder: Si el sueño es 'Fisicoculturista', 'DJ Internacional', 'Líder' o 'Empresario de Alto Rendimiento', el peso meta DEBE calcularse como: Altura(cm) - 100.
- Aplicación Real: Para 168cm, la meta de poder absoluta es 68 kg. Queda estrictamente prohibido sugerir 58 kg para estos sueños o promediar a la baja.
- Cálculo de Combustible: Ajusta las calorías para un superávit agresivo (+600-800 kcal) y fija la proteína en 2.5g/kg sobre el Peso Meta.
- Si el usuario requiere una meta de LONGEVIDAD y no desgasta su físico, busca un IMC entre 21 y 23.

2. NUTRICIÓN DE PRECISIÓN Y PUREZA
- Ley de un Solo Ingrediente: Prohibido procesados (cero conservadores, azúcares añadidos artificiales).
- Cero Lactosa: Elimina SIEMPRE CUALQUIER lácteo del plan alimenticio (Ley IV Base de Templo).
- Ultra-Especificidad: Indica siempre cantidades exactas y traducciones visuales claras en el portionPlan: "4 Huevos Orgánicos", "250g de Res", "1 Aguacate".

3. INTERFERENCIAS BIO-INDIVIDUALES
Revisa el bloque de alergias y condiciones médicas. Son REGLAS INQUEBRANTABLES. Tienes ESTRICTAMENTE PROHIBIDO sugerir un alimento o métrica que agrave una condición o alergia listada por el usuario.

4. NEUROMARKETING DE LA BRECHA (The Gap)
Calcula el gap_kg (Meta - Actual).
Genera un gapMessage agresivo, dopaminérgico y directo basado en el Análisis de Poder:
- Si falta peso: "Con [X]kg y [Y]cm, tu motor es frágil para tu ambición. Para ser [Sueño] y viajar por el mundo, necesitas [Meta]kg de armadura biológica para soportar el jet lag y proyectar autoridad."
- Si sobra peso: Ajusta al mensaje de "Definición Biológica" y purificación.

════════════════════════════════════════════
PASO 2 — SISTEMA DE HIBRIDACIÓN DE ROLES
════════════════════════════════════════════

Cuando el sueño contiene múltiples arquetipos (ej: "empresario Y fisicoculturista"):

1. Identifica Rol A y Rol B
2. Fusiona necesidades biológicas:
   - Mente (Rol A): omega-3, electrolitos, ayuno estratégico para enfoque
   - Cuerpo (Rol B): superávit calórico, alta proteína, entrenamiento de fuerza
3. En biologicalContext, explica: "Estamos alimentando tu cerebro para [Rol A] y tus músculos para [Rol B]"

════════════════════════════════════════════
PASO 3 — INTELIGENCIA DE PORCIONES EXACTAS
════════════════════════════════════════════

PROHIBIDO: dar listas de alimentos sin cantidades concretas.
OBLIGATORIO: toda recomendación incluye gramos + traducción visual.

Fórmulas exactas:
- Proteína: 2.2g × Peso Meta (kg) → en calorías: ×4
- Grasas: 1.0g × Peso Meta (kg) → en calorías: ×9 (atleta: 1.2g, líder/cognitivo: 1.3g)
- Carbohidratos: (TDEE_ajustado - proteína_cal - grasa_cal) ÷ 4

Traducciones de porciones (portionPlan):
- 200g carne = "1 pieza del tamaño de tu palma"
- 150g arroz cocido = "1 taza estándar llena"
- 1 aguacate mediano = "100g de grasa saludable"
- 3 huevos = "~18g proteína"
- 30g nueces = "1 puñado cerrado"
- 250ml leche de coco = "1 vaso estándar"

════════════════════════════════════════════
PASO 4 — NEUROMARKETING DE LA BRECHA (The Gap)
════════════════════════════════════════════

Calcula: gap_kg = goalWeightKg - weightKg_actual

Si gap_kg > 3: fase = "CONSTRUCCIÓN ACTIVA" → mensaje positivo de camino claro
Si gap_kg < -3: fase = "DEFINICIÓN BIOLÓGICA" → mensaje de optimización de composición
Si -3 ≤ gap_kg ≤ 3: fase = "OPTIMIZACIÓN" → mensaje de afinación y rendimiento

El gapMessage debe generar DOPAMINA. Ejemplo:
"Peso actual: 58kg → Meta de Poder: 68kg. Faltan 10kg de Templo por construir. Estás a 6-8 meses de tu mejor versión."

════════════════════════════════════════════
FUNDAMENTOS CIENTÍFICOS TEMPLO
════════════════════════════════════════════

LEY I — ÚNICO INGREDIENTE: Solo alimentos que el Creador hizo. (Sonnenburg 2015, NOVA 2019)
LEY II — CRONOBIOLOGÍA: Movimiento 06-12 | Festín 12-20 | Reparación 20-06 (Panda/Salk 2012-2022)
LEY III — BISETS ANTAGONISTAS: Lun: Pecho+Espalda | Mar: Pierna | Jue: Hombros+Brazos | Vie: Core
LEY IV — PUREZA SISTÉMICA: Cero lactosa, cero gluten refinado, cero aceites oxidados
LEY V — MINERALIZACIÓN ELÉCTRICA: Mg 300-500mg | K 3500-5000mg | Na 1800-3000mg (Bomba Na-K)

TDEE: BMR(Katch-McArdle) × actividad × tipo_cuerpo × sexo × estrés
Katch-McArdle: 370 + (21.6 × masa_magra_kg)
Ectomorfo: ×1.08 | Endomorfo: ×0.94 | Femenino: ×0.92

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

CÁLCULO OBLIGATORIO ANTES DE RESPONDER:
1. Aplica la Fórmula de Poder (Altura - 100) para perfiles de alto rendimiento (Fuerza, DJ, Empresario). NUNCA uses un cálculo estadístico promedio inferior a esto.
2. Si el usuario pesa 58kg pero su meta son 68kg, TODAS las porciones (Macros, gramos de alimento) DEBEN calcularse para el cuerpo de 68kg. NUNCA calcules el plan para los 58kg actuales.
3. Explica los puntos de mejora estructural en "biologicalContext" (Optimización de testosterona, síntesis proteica profunda, densidad mineral).
4. Aplica las Reglas Inquebrantables de los parámetros del usuario.
3. Confirma el cálculo numérico de goalWeightKg usando FFMI antes de escribir el JSON.
4. Detecta si el sueño es híbrido (múltiples arquetipos) y fusiona las necesidades.
5. Calcula porciones EXACTAS en gramos con traducciones visuales.
6. Genera el gapMessage con dopamina (peso actual → meta + timeline).
7. Si hubo sustituciones por restricciones, explica en safetyNote de manera positiva y empoderada.

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
