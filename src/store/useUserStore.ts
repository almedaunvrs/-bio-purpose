import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../lib/types';

interface UserStore {
    profile: UserProfile | null;
    analysisAcknowledged: boolean;
    setProfile: (profile: UserProfile) => void;
    acknowledgeAnalysis: () => void;
    resetProfile: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            profile: null,
            analysisAcknowledged: false,
            setProfile: (profile) => set({ profile, analysisAcknowledged: false }),
            acknowledgeAnalysis: () => set({ analysisAcknowledged: true }),
            resetProfile: () => set({ profile: null, analysisAcknowledged: false }),
        }),
        {
            name: 'templo-bio-storage',
        }
    )
);
