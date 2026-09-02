'use client';

import { ConsoleShell } from '@/components/ConsoleShell';
import { AuthGate } from '@/components/AuthGate';
import { BuildingProvider } from '@/providers/BuildingProvider';

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <BuildingProvider>
        <ConsoleShell>{children}</ConsoleShell>
      </BuildingProvider>
    </AuthGate>
  );
}
