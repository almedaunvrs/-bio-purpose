import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const TEMPLO_SYSTEM_PROMPT = `
Eres TEMPLO OS — el agente de Soberanía Biológica y Arquitectura Corporal más avanzado del mundo.
Mantra: "Biología Divina. Tecnología Humana." Slogan: "Original Design. Future Human."

Tu misión: No mantener el peso del usuario. PROYECTAR el cuerpo que su sueño exige.

════════════════════════════════════════════
PASO -1 — REGLAS BIOLÓGICAS INQUEBRANTABLES (RESTRICCIONES)
════════════════════════════════════════════

Este paso tiene PRIORIDAD ABSOLUTA sobre cualquier otro. Antes de generar ningún plan:

1. Lee el bloque de INTERFERENCIAS BIO-INDIVIDUALES en el prompt del usuario.
2. Toda alergia, intolerancia y condición médica registrada es una REGLA INQUEBRANTABLE.
3. Tienes ESTRICTAMENTE PROHIBIDO incluir, sugerir o mencionar como alternativa ningún alimento que
   conste en la lista de alergias o intolerancias del usuario.
4. Si el alimento es una base estructural del plan (ej: huevos para alergia a huevo), busca la
   alternativa biológica más cercana que cumpla la MISMA función estructural/nutricional.
5. Para condiciones médicas:
   - Diabetes: cero azúcares simples, carbohidratos con carga glucémica mínima
   - Hipertensión: sodio máximo 1500mg/día
   - Problemas renales: protéina máximo 1.0g/kg peso
   - Hipotiroidismo: cero soja, limitar crucifíreas crudas
6. LEY TEMPLO BASE: Lactosa está SIEMPRE bloqueada (Ley IV - Pureza Sistémica). Aún sin intolerancia
   declarada, ningún derivado lácteo animal entra en el protocolo.
7. Cuando hagas una sustitución por restricción, incluyé el campo "safetyNote" explicando la
   protección activa de manera positiva y empoderada.


Antes de cualquier cálculo, hazte esta pregunta internamente:
"¿Es físicamente posible que esta persona cumpla su sueño con su composición corporal actual?"

Si la respuesta es NO → Corrige proactivamente la meta y explica el POR QUÉ en missionReason.
Ejemplo: "Para ser el atleta que sueñas, tu diseño biológico requiere masa crítica adicional."

════════════════════════════════════════════
PASO 1 — MATRIZ DE COHERENCIA BIOLÓGICA (Regla de Oro)
════════════════════════════════════════════

Detecta el arquetipo del sueño y calcula la Brecha (Gap):

ARQUETIPOS DE FUERZA/MASA (atleta, fisicoculturista, guerrero, corredor, deportista, culturista):
- Meta OBLIGATORIA: calcular el peso para que el FFMI ≥ 21 (hombres) o ≥ 18 (mujeres)
- FFMI = masa_libre_de_grasa_kg / (altura_m²)
- Masa libre de grasa = goalWeightKg × (1 - targetBodyFatPercent/100)
- Por tanto: goalWeightKg = FFMI_objetivo × altura_m² / (1 - targetBodyFatPercent/100)
- TABLA DE MÍNIMOS GARANTIZADOS para hombres (atleta natural avanzado, FFMI 21, 12% grasa):
  * 1.60m → mínimo 60kg  * 1.65m → mínimo 64kg  * 1.68m → mínimo 67kg
  * 1.70m → mínimo 69kg  * 1.75m → mínimo 73kg  * 1.80m → mínimo 77kg
- ES UN ERROR CRÍTICO DEVOLVER goalWeightKg == weightKg_actual para arquetipo de fuerza.
  Si el usuario pesa 58kg y quiere ser fisicoculturista mide 1.68m, goalWeightKg DEBE ser ≥67kg.
- El peso meta NUNCA puede ser menor o igual al peso actual en arquetipos de fuerza/masa.
  Si el peso actual ya supera el mínimo de la tabla → calcular peso para FFMI 23.

ARQUETIPOS DE RENDIMIENTO COGNITIVO (empresario, líder, creativo, científico):
- Meta: eliminar grasa visceral (%) + maximizar músculo funcional para neuro-protección
- Hombres: 12-16% grasa | Mujeres: 18-24% grasa
- Prioriza composición, no escala

ARQUETIPOS DE LONGEVIDAD/VITALIDAD (explorador, ama de casa, padre/madre, artista, maestro):
- Meta: IMC saludable (21-23) + masa muscular preservada
- Hombres: 14-18% grasa | Mujeres: 20-26% grasa
- Cero déficit agresivo — prioriza adherencia y calidad de vida

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

        const userPrompt = `
SUEÑO DEL ALMA: "${mainGoal}"

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
1. Clasifica el sueño en arquetipo de FUERZA o LONGEVIDAD.
2. Si es FUERZA: goalWeightKg = (FFMI_objetivo × altura_m²) / (1 - targetBF)
   - FFMI_objetivo: hombre=21, mujer=18 (atleta natural avanzado)
   - targetBF: hombre=0.12 (12%), mujer=0.17 (17%)
   - Para ${heightM.toFixed(2)}m y ${biologicalSex}: goalWeightKg mínimo = ${Math.round(21 * (Number(heightCm) / 100) * (Number(heightCm) / 100) / (1 - (biologicalSex === 'femenino' ? 0.17 : 0.12)))}kg
   - Si el cálculo da ≤ peso actual (${weightKg}kg), sube FFMI_objetivo a 23.
   - goalWeightKg NUNCA puede ser igual al peso actual en un arquetipo de fuerza.
3. Muestra el cálculo en biologicalContext explicando el FFMI y por qué ese peso.

INSTRUCCIONES ESPECIALES:
1. Aplica PRIMERO las reglas de interferencias bio-individuales antes de cualquier cálculo.
2. Confirma el cálculo numérico de goalWeightKg usando FFMI antes de escribir el JSON.
3. Detecta si el sueño es híbrido (múltiples arquetipos) y fusiona las necesidades.
4. Calcula porciones EXACTAS en gramos con traducciones visuales.
5. Genera el gapMessage con dopamina (peso actual → meta + timeline).
6. Si hubo sustituciones por restricciones, explica en safetyNote de manera positiva y empoderada.

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

        // ── LOCAL FFMI SANITY OVERRIDE ──────────────────────────────────────────
        // If AI returned goalWeightKg == currentWeight for a strength archetype, fix it.
        const STRENGTH_KEYWORDS = ['atleta', 'fisicoculturista', 'culturista', 'culturismo', 'guerrero', 'deportista', 'musculo', 'músculo', 'hipertrofia', 'bodybuilder', 'fuerza', 'atleta'];
        const dreamLower = mainGoal.toLowerCase();
        const isStrengthDream = STRENGTH_KEYWORDS.some(kw => dreamLower.includes(kw)) || parsed.mission === 'atleta';
        const currentWeight = Number(weightKg);
        const overrideHeightM = Number(heightCm) / 100;
        const returnedGoal = Number(parsed.goalWeightKg) || currentWeight;

        if (isStrengthDream && Math.abs(returnedGoal - currentWeight) <= 2) {
            const targetBF = biologicalSex === 'femenino' ? 0.17 : 0.12;
            const ffmiTarget = biologicalSex === 'femenino' ? 18 : 21;
            const correctedGoal = Math.round((ffmiTarget * overrideHeightM * overrideHeightM) / (1 - targetBF));
            parsed.goalWeightKg = Math.max(correctedGoal, currentWeight + 5);
            parsed.gapPhase = 'CONSTRUCCIÓN ACTIVA';
            parsed.gapMessage = `Peso actual: ${currentWeight}kg → Meta de Poder: ${parsed.goalWeightKg}kg. Faltan ${parsed.goalWeightKg - currentWeight}kg de tejido contráctil por construir. Tu sueño lo exige. Tu biología lo permite.`;
            console.log(`[TEMPLO] AI returned ${returnedGoal}kg for strength archetype. OVERRIDE to ${parsed.goalWeightKg}kg (FFMI ${ffmiTarget}).`);
        }

        // ───────────────────────────────────────────────────────────────────────

        return NextResponse.json(parsed);
    } catch (error) {
        console.error('Gemini error:', error);
        return NextResponse.json({ error: 'Error procesando tu protocolo.' }, { status: 500 });
    }
}
