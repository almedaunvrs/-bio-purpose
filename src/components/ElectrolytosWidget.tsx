'use client';

import { motion } from 'framer-motion';
import { NutrientDensity } from '@/lib/types';

interface ElectrolytosWidgetProps {
    nutrientDensity?: NutrientDensity;
    mission?: string;
}

const ELECTROLITOS = [
    {
        key: 'magnesiumMg' as keyof NutrientDensity,
        name: 'Magnesio',
        symbol: 'Mg',
        function: 'Síntesis ATP + Relajación muscular + 300+ enzimas',
        unit: 'mg',
        defaultMin: 300,
        defaultMax: 500,
        color: '#BAE6FD',
        glow: 'shadow-[0_0_20px_rgba(186,230,253,0.5)]',
        sources: 'Espinaca, almendras, cacao puro, semillas de calabaza',
    },
    {
        key: 'potassiumMg' as keyof NutrientDensity,
        name: 'Potasio',
        symbol: 'K',
        function: 'Bomba Na-K + Contractilidad cardíaca + Control osmótico',
        unit: 'mg',
        defaultMin: 3500,
        defaultMax: 5000,
        color: '#86EFAC',
        glow: 'shadow-[0_0_20px_rgba(134,239,172,0.4)]',
        sources: 'Aguacate, plátano, batata, carne de res, espinaca',
    },
    {
        key: 'sodiumMg' as keyof NutrientDensity,
        name: 'Sodio',
        symbol: 'Na',
        function: 'Transmisión nerviosa + Balance hídrico + Absorción de nutrientes',
        unit: 'mg',
        defaultMin: 1800,
        defaultMax: 3000,
        color: '#FDE68A',
        glow: 'shadow-[0_0_20px_rgba(253,230,138,0.4)]',
        sources: 'Sal Rosa del Himalaya — 84 minerales traza. No sal refinada.',
    },
];

function LightningIcon({ color }: { color: string }) {
    return (
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 1L1 11H8L7 19L15 9H8L9 1Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={`${color}20`} />
        </svg>
    );
}

export function ElectrolytosWidget({ nutrientDensity, mission }: ElectrolytosWidgetProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
                        Suplementación Eléctrica
                    </p>
                    <p className="text-xs text-neutral-500 font-light mt-0.5">
                        Los cables del sistema nervioso
                    </p>
                </div>
                <div className="text-[10px] text-sky-400 font-mono border border-sky-100 px-2 py-1 rounded-full">
                    Na · K · Mg
                </div>
            </div>

            {ELECTROLITOS.map((electro, i) => {
                const value = nutrientDensity?.[electro.key];
                const displayValue = value ? Math.round(value) : null;
                const progress = value
                    ? Math.min(100, ((value - electro.defaultMin) / (electro.defaultMax - electro.defaultMin)) * 100)
                    : 60;

                return (
                    <motion.div
                        key={electro.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 }}
                        className="border border-neutral-100 rounded-2xl p-5 bg-white hover:border-neutral-200 transition-colors"
                    >
                        <div className="flex items-start gap-4">
                            {/* Symbol + Icon */}
                            <div className="flex flex-col items-center gap-1 pt-0.5">
                                <LightningIcon color={electro.color} />
                                <span className="text-[8px] font-mono font-semibold" style={{ color: electro.color }}>
                                    {electro.symbol}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-baseline justify-between">
                                    <p className="text-sm font-light text-neutral-800">{electro.name}</p>
                                    {displayValue && (
                                        <span className="text-sm font-mono text-neutral-600">
                                            {displayValue.toLocaleString()} {electro.unit}
                                        </span>
                                    )}
                                </div>

                                {/* Progress bar */}
                                <div className="h-0.5 bg-neutral-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1, delay: i * 0.15 + 0.3, ease: 'easeOut' }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: electro.color }}
                                    />
                                </div>

                                <p className="text-[10px] text-neutral-400 font-light">{electro.function}</p>
                                <p className="text-[10px] text-neutral-500 font-light italic">{electro.sources}</p>
                            </div>
                        </div>
                    </motion.div>
                );
            })}

            {/* Scientific note */}
            <div className="border border-sky-100 rounded-2xl px-5 py-4 bg-sky-50/50">
                <p className="text-[10px] text-sky-600 font-light leading-relaxed">
                    <span className="font-medium">La Bomba Sodio-Potasio</span> consume el 25-40% de la energía celular total.
                    No son "polvos" — son los conductores de la señal eléctrica de la consciencia a través de tu sistema nervioso.
                </p>
            </div>
        </div>
    );
}
