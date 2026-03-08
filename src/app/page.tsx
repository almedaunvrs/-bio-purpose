'use client';

import { useUserStore } from '@/store/useUserStore';
import { Onboarding } from '@/components/Onboarding';
import { Dashboard } from '@/components/Dashboard';
import { AnalisisOriginal } from '@/components/AnalisisOriginal';

export default function Home() {
  const profile = useUserStore((state) => state.profile);
  const analysisAcknowledged = useUserStore((state) => state.analysisAcknowledged);

  // Step 1: No profile → Onboarding
  if (!profile) return <Onboarding />;

  // Step 2: Profile exists but user hasn't seen the analysis yet → Intermediate Screen
  if (!analysisAcknowledged) return <AnalisisOriginal />;

  // Step 3: Profile + acknowledged → Dashboard
  return <Dashboard />;
}
