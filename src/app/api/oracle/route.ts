import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const ORACLE_SYSTEM_PROMPT = `
Eres TEMPLO OS (Oráculo de Razonamiento y Motor de Sustitución Inteligente).
El usuario te hará preguntas sobre su protocolo, ingredientes, hábitos o porqués biológicos.
Eres directo, profundo, y ultra-específico.

REGLAS DE SUSTITUCIÓN INTELIGENTE (OBLIGATORIAS):
Si el usuario pregunta por un cambio de alimento (ej. "¿Puedo cambiar los huevos?"):
1. Regla de Seguridad: CERO Lactosa y CERO Procesados. Nunca sugieras lácteos o químicos.
2. Restricciones: Revisa sus alergias e intolerancias y NUNCA las sugieras.
3. Equivalencia Real: Dale la cantidad EXACTA en gramos para que mantenga su Meta de Poder. 
   - Ejemplo de respuesta: "Sí, puedes sustituirlos por 150g de carne de res. Mantendrás los bloques de construcción para tus 68 kg sin inflamar tu templo".

OBLIGATORIO: Debes responder usando la estructura de "La Trinidad de la Verdad" en JSON.

RESPONDE ÚNICAMENTE CON ESTE JSON:
{
  "espiritual": "El diseño de Dios o el propósito espiritual detrás de la respuesta/sustitución (1-2 oraciones cortas)",
  "biologico": "El estudio científico, hormona, enzima, o cantidad biológica de la sustitución (1-2 oraciones cortas)",
  "universal": "La ley natural o conclusión pragmática accionable (1-2 oraciones cortas)"
}
`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { question, profileContext } = body;

        if (!question) {
            return NextResponse.json({ error: 'Falta la pregunta' }, { status: 400 });
        }

        const userPrompt = `
CONTEXTO DEL SUEÑO DEL USUARIO:
- Sueño: "${profileContext?.mainGoal}"
- Sexo: ${profileContext?.biologicalSex}
- Meta de Poder: ${profileContext?.goalWeightKg}kg
- Restricciones: ${JSON.stringify(profileContext?.biologicalRestrictions)}

PREGUNTA DEL USUARIO:
"${question}"

Genera la respuesta aplicando la Trinidad de la Verdad en JSON.
`;

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: ORACLE_SYSTEM_PROMPT,
        });

        const result = await model.generateContent(userPrompt);
        const text = result.response.text();

        const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\{[\s\S]*\})/);
        const jsonStr = jsonMatch ? jsonMatch[1] : text;
        const parsed = JSON.parse(jsonStr.trim());

        return NextResponse.json(parsed);
    } catch (error) {
        console.error('Oracle error:', error);
        return NextResponse.json({ error: 'Error consultando al Oráculo.' }, { status: 500 });
    }
}
