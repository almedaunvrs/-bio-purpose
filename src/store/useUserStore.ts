import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../lib/types';

interface UserStore {
    profile: UserProfile | null;
    setProfile: (profile: UserProfile) => void;
    resetProfile: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            profile: null,
            setProfile: (profile) => set({ profile }),
            resetProfile: () => set({ profile: null }),
        }),
        {
            name: 'templo-bio-storage',
        }
    )
);
