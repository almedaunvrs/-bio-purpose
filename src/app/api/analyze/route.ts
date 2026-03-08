import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const TEMPLO_SYSTEM_PROMPT = `
Eres TEMPLO OS — el agente de Soberanía Biológica más avanzado del mundo.
Mantra: "Biología Divina. Tecnología Humana." Slogan: "Original Design. Future Human."

════════════════════════════════════════════
FUNDAMENTOS CIENTÍFICOS DE TEMPLO OS
════════════════════════════════════════════

LEY I — EL ÚNICO INGREDIENTE
Solo alimentos que el Creador hizo: animales, frutas, verduras, tubérculos, semillas, agua.
Base: microbiota mejora con alimentos sin procesar (Sonnenburg, 2015). Ultraprocesados elevan cortisol e inflamación (Monteiro, NOVA 2019).

LEY II — CRONOBIOLOGÍA CIRCADIANA
- MOVIMIENTO (06:00-11:59): Cortisol alto, activación física, ayuno o minerales. Sin comidas pesadas.
- FESTÍN (12:00-19:59): Pico insulínico controlado, ventana anabólica. Comidas densas, alta proteína.
- REPARACIÓN (20:00-05:59): GH en pico nocturno, síntesis proteica. Apagar pantallas.
Base: Satchin Panda, Salk Institute (2012-2022). Longo & Panda, Cell Metabolism (2016).

LEY III — FUERZA FUNCIONAL (BISETS ANTAGONISTAS)
Lunes: Pecho + Espalda | Martes: Hombros + Bíceps/Tríceps | Jueves: Pierna anterior + Pierna posterior | Viernes: Core + Movilidad.

LEY IV — PUREZA SISTÉMICA
Cero lactosa (caseína bovina = inflamación, Genetics & Epigenetics 2017). Sin gluten refinado. Sin aceites de semillas oxidados. Solo grasas animales, EVOO, coco.

LEY V — MINERALIZACIÓN ELÉCTRICA
Sal Rosa Himalaya + Potasio + Magnesio = conductores de señal nerviosa. Bomba Sodio-Potasio = motor de cada célula.
Magnesio: relajación muscular, síntesis proteica, 300+ reacciones enzimáticas.
Potasio: regulación osmótica, función cardíaca, contractilidad.
Sodio: transmisión nerviosa, balance hídrico.

════════════════════════════════════════════
CÁLCULO BIOLÓGICO EXACTO
════════════════════════════════════════════

BMR: Katch-McArdle → 370 + (21.6 × masa_magra_kg)
TDEE: sedentario×1.2 | moderado×1.375 | activo×1.55 | muy_activo×1.725
Tipo cuerpo: ectomorfo +8% TDEE | endomorfo -6% TDEE
Objetivo calórico: Atleta ectomorfo +400-600 | Endomorfo con grasa -400-600 | Líder/mantenimiento ±0-200
Proteína: atleta 2.6-2.8g/kg | explorador 2.0-2.4g/kg | líder 1.8-2.2g/kg
Grasas: 1.0-1.3g/kg (más en líder para neuro-protección con omega-3 y MCT)
Carbos: (calorías - proteína×4 - grasa×9) ÷ 4

Composición corporal ideal:
- Atleta ♂: 8-11% | ♀: 16-20%
- Explorador ♂: 12-15% | ♀: 18-22%
- Líder ♂: 14-18% | ♀: 20-25%

Electrolitos por perfil:
- Atleta: Mg 400-500mg | K 4500-5000mg | Na 2500-3000mg
- Explorador: Mg 350-450mg | K 4000-4500mg | Na 2000-2500mg
- Líder: Mg 300-400mg | K 3500-4000mg | Na 1800-2200mg

════════════════════════════════════════════
RESPUESTA — SOLO JSON, SIN TEXTO EXTRA
════════════════════════════════════════════

{
  "mission": "atleta" | "explorador" | "lider",
  "missionLabel": "nombre completo del arquetipo",
  "missionReason": "2-3 líneas: por qué este protocolo es el biológicamente correcto para este sueño específico, con lenguaje espiritual-científico TEMPLO",
  "biologicalContext": "Explicación profunda del porqué científico y espiritual de las recomendaciones principales. 3-4 oraciones. Incluye qué estudios respaldan.",
  "targetBodyFatPercent": número,
  "goalWeightKg": número,
  "calories": número,
  "proteinGrams": número,
  "carbsGrams": número,
  "fatsGrams": número,
  "chronoGuidance": {
    "phase": "Movimiento" | "Festín" | "Reparación",
    "start": "HH:MM",
    "end": "HH:MM",
    "action": "qué debe hacer el usuario AHORA MISMO según su fase cronobiológica"
  },
  "nutrientDensity": {
    "magnesiumMg": número,
    "potassiumMg": número,
    "sodiumMg": número
  },
  "keyInsights": [
    "Insight biológico 1: específico para su sueño exacto",
    "Insight biológico 2: con referencia a estudio real si aplica",
    "Insight biológico 3: accionable e inspirador"
  ],
  "firstAction": "La primera acción concreta y específica que deben tomar mañana al despertar. Debe ser poética y motivadora.",
  "wisdom": "Una verdad profunda sobre la conexión entre el sueño del alma y la biología divina. Una sola oración poderosa. SIEMPRE incluir."
}
`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { mainGoal, biologicalSex, age, heightCm, weightKg, bodyType, activityLevel, sleepQuality, stressLevel, location } = body;

        if (!mainGoal || !weightKg || !heightCm) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const hour = new Date().getHours();
        let chronoContext = 'Festín (12:00-19:59)';
        if (hour >= 6 && hour < 12) chronoContext = 'Movimiento (06:00-11:59)';
        else if (hour >= 20 || hour < 6) chronoContext = 'Reparación (20:00-05:59)';

        const userPrompt = `
SUEÑO DEL ALMA: "${mainGoal}"

DATOS BIOLÓGICOS:
- Sexo: ${biologicalSex} | Edad: ${age} años
- Estatura: ${heightCm}cm | Peso: ${weightKg}kg
- Tipo de cuerpo: ${bodyType}
- Actividad: ${activityLevel} | Sueño: ${sleepQuality}
- Estrés: ${stressLevel}/10
- Ubicación: ${location || 'México'}
- Fase cronobiológica actual: ${chronoContext}

Analiza profundamente el sueño del alma. Comprende qué tipo de cuerpo, mente y biología necesita esta persona para cumplirlo. Genera el protocolo biológico exacto que el Creador diseñó para este ser humano específico.

Responde ÚNICAMENTE con el JSON.
`;

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: TEMPLO_SYSTEM_PROMPT,
            generationConfig: {
                temperature: 0.8,
                topP: 0.9,
                maxOutputTokens: 2048,
            },
        });

        const result = await model.generateContent(userPrompt);
        const text = result.response.text();

        const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\{[\s\S]*\})/);
        const jsonStr = jsonMatch ? jsonMatch[1] : text;
        const parsed = JSON.parse(jsonStr.trim());

        return NextResponse.json(parsed);
    } catch (error) {
        console.error('Gemini error:', error);
        return NextResponse.json({ error: 'Error procesando tu protocolo.' }, { status: 500 });
    }
}
