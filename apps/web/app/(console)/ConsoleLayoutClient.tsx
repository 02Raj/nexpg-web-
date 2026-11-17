'use client';

import { ConsoleShell } from '@/components/ConsoleShell';
import { AuthGate } from '@/components/AuthGate';
import { OnboardingRedirect } from '@/components/OnboardingRedirect';
import { BuildingProvider } from '@/providers/BuildingProvider';

export function ConsoleLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <BuildingProvider>
        <OnboardingRedirect />
        <ConsoleShell>{children}</ConsoleShell>
      </BuildingProvider>
    </AuthGate>
  );
}
