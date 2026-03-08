'use client';

import { motion } from 'framer-motion';

interface TruthColumn {
    icon: string;
    title: string;
    subtitle: string;
    text: string;
    colorClass: string;
}

interface TrinidadVerdadProps {
    ley: number;
    titulo: string;
    columns: TruthColumn[];
}

export function TrinidadVerdad({ ley, titulo, columns }: TrinidadVerdadProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-neutral-100 rounded-3xl overflow-hidden bg-white"
        >
            {/* Header */}
            <div className="px-8 py-5 border-b border-neutral-100 flex items-center gap-4">
                <span className="text-[9px] font-semibold tracking-[0.3em] text-neutral-400 uppercase">Ley {ley}</span>
                <span className="w-px h-4 bg-neutral-200" />
                <h3 className="text-sm font-light text-neutral-800 tracking-wide">{titulo}</h3>
            </div>

            {/* Three columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
                {columns.map((col, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="px-7 py-6 space-y-3"
                    >
                        <div className="flex items-center gap-3">
                            <span className={`text-2xl ${col.colorClass}`}>{col.icon}</span>
                            <div>
                                <p className={`text-[9px] font-semibold uppercase tracking-[0.25em] ${col.colorClass}`}>
                                    {col.title}
                                </p>
                                <p className="text-[10px] text-neutral-400 font-light">{col.subtitle}</p>
                            </div>
                        </div>
                        <p className="text-xs font-light leading-relaxed text-neutral-600">{col.text}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

// Pre-built TEMPLO truths
export const TEMPLO_LEYES = [
    {
        ley: 1,
        titulo: 'El Único Ingrediente',
        columns: [
            {
                icon: '✦',
                title: 'Diseño Divino',
                subtitle: 'Intención del Creador',
                text: 'El Creador diseñó los alimentos con una integridad perfecta. Cada fruto, animal y semilla contiene exactamente los co-factores necesarios para su propio metabolismo. Cuando los separamos o combinamos artificialmente, rompemos esa armonía.',
                colorClass: 'text-amber-500',
            },
            {
                icon: '⬡',
                title: 'Evidencia Biológica',
                subtitle: 'Estudios validados',
                text: 'La microbiota intestinal mejora dramáticamente con alimentos enteros sin procesar (Sonnenburg Lab, Stanford 2015). Los ultraprocesados elevan cortisol, inflamación sistémica y resistencia a insulina (Monteiro, NOVA Classification 2019).',
                colorClass: 'text-indigo-500',
            },
            {
                icon: '∞',
                title: 'Ley Universal',
                subtitle: 'Principio de equilibrio',
                text: 'La naturaleza opera en ciclos completos. Un alimento con un solo ingrediente es un ciclo completo. Cada fractura de esa unidad introduce ruido en la señal biológica. La complejidad real ya existe en lo simple.',
                colorClass: 'text-emerald-500',
            },
        ],
    },
    {
        ley: 5,
        titulo: 'Mineralización Eléctrica',
        columns: [
            {
                icon: '✦',
                title: 'Diseño Divino',
                subtitle: 'Conductores del alma',
                text: 'El sistema nervioso es literalmente un sistema eléctrico. El Creador diseñó la Sal Rosa del Himalaya, el Potasio y el Magnesio como los conductores primarios de la consciencia. Sin electrolitos, el alma no puede transmitir su señal al cuerpo.',
                colorClass: 'text-amber-500',
            },
            {
                icon: '⬡',
                title: 'Evidencia Biológica',
                subtitle: 'Bomba Na-K',
                text: 'La Bomba Sodio-Potasio es el motor de cada célula — consume el 25-40% de la energía celular total. El Magnesio activa 300+ enzimas, incluyendo las de síntesis de ATP. Deficiencia = fatiga, calambres, niebla mental.',
                colorClass: 'text-indigo-500',
            },
            {
                icon: '∞',
                title: 'Ley Universal',
                subtitle: 'Equilibrio iónico',
                text: 'El universo se comunica a través de gradientes eléctricos. Tu cuerpo no es diferente. Mantener el balance iónico no es nutrición — es sintonizar tu frecuencia biológica con la del mundo creado.',
                colorClass: 'text-emerald-500',
            },
        ],
    },
];
