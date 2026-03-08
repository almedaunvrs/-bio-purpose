'use client';

import { motion } from 'framer-motion';

interface Exercise {
    name: string;
    sets: number;
    reps: string;
    notes?: string;
}

interface BisetCardProps {
    day: string;
    focus: string;
    exercises: Exercise[];
    missionColor?: string;
    index?: number;
}

export function BisetCard({ day, focus, exercises, missionColor = '#B8973E', index = 0 }: BisetCardProps) {
    // Group exercises into biset pairs
    const pairs: [Exercise, Exercise | undefined][] = [];
    for (let i = 0; i < exercises.length; i += 2) {
        pairs.push([exercises[i], exercises[i + 1]]);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="border border-neutral-100 rounded-3xl overflow-hidden bg-white hover:border-neutral-200 hover:shadow-sm transition-all duration-300"
        >
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span
                        className="text-3xl font-extralight leading-none"
                        style={{ color: `${missionColor}40` }}
                    >
                        {day.replace('Día ', '').padStart(2, '0')}
                    </span>
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-medium">Día {day.replace('Día ', '')}</p>
                        <p className="text-sm font-light text-neutral-800">{focus}</p>
                    </div>
                </div>
                <div
                    className="text-[8px] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                    style={{ color: missionColor, backgroundColor: `${missionColor}12`, border: `1px solid ${missionColor}30` }}
                >
                    {pairs.length} Bisets
                </div>
            </div>

            {/* Biset Pairs */}
            <div className="px-6 py-4 space-y-1">
                {pairs.map(([ex1, ex2], pairIdx) => (
                    <div key={pairIdx} className="relative">
                        {/* Exercise 1 */}
                        <ExerciseRow ex={ex1} missionColor={missionColor} />

                        {/* Synergy Connector */}
                        {ex2 && (
                            <div className="relative my-1 flex items-center gap-3 px-1">
                                <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${missionColor}30, ${missionColor}60, ${missionColor}30)` }} />
                                <span
                                    className="text-[7px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap px-2 py-0.5 rounded-full"
                                    style={{ color: missionColor, backgroundColor: `${missionColor}10`, border: `1px solid ${missionColor}25` }}
                                >
                                    Sinergia Antagonista
                                </span>
                                <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, ${missionColor}30, ${missionColor}60, ${missionColor}30)` }} />
                            </div>
                        )}

                        {/* Exercise 2 */}
                        {ex2 && <ExerciseRow ex={ex2} missionColor={missionColor} />}

                        {/* Pair separator */}
                        {pairIdx < pairs.length - 1 && (
                            <div className="my-3 border-b border-neutral-100" />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function ExerciseRow({ ex, missionColor }: { ex: Exercise; missionColor: string }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2 group">
            <div className="flex-1">
                <p className="text-xs font-medium text-neutral-800 uppercase tracking-wide group-hover:text-neutral-600 transition-colors">
                    {ex.name}
                </p>
                {ex.notes && (
                    <p className="text-[10px] text-neutral-400 font-light mt-0.5">{ex.notes}</p>
                )}
            </div>
            <span
                className="shrink-0 text-[9px] font-mono font-semibold px-2.5 py-1 rounded-lg"
                style={{ color: missionColor, backgroundColor: `${missionColor}12` }}
            >
                {ex.sets}×{ex.reps}
            </span>
        </div>
    );
}
