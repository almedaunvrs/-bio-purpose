'use client';

import { useUserStore } from '@/store/useUserStore';
import { Onboarding } from '@/components/Onboarding';
import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  const profile = useUserStore((state) => state.profile);

  // If no profile is found, the user hasn't onboarded yet
  if (!profile) {
    return <Onboarding />;
  }

  // Otherwise, show the main dashboard
  return <Dashboard />;
}
