import { LoadingState } from '@/components/LoadingState';
import { isOnboardingComplete } from '@/lib/onboarding';
import { useAuth } from '@/providers/AuthProvider';
import { BuildingProvider, useBuilding } from '@/providers/BuildingProvider';
import { colors } from '@/theme/tokens';
import { Redirect, Stack, useSegments } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';

function AppGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { buildings, loading: buildingsLoading } = useBuilding();
  const segments = useSegments();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  const segs = segments as string[];
  const inOnboarding = segs.includes('onboarding');
  const inSetup = segs.includes('setup');

  useEffect(() => {
    if (!user?.id) {
      setOnboardingDone(null);
      return;
    }
    isOnboardingComplete(user.id).then(setOnboardingDone);
  }, [user?.id]);

  if (buildingsLoading || (user?.id && onboardingDone === null)) {
    return <LoadingState label="Loading your PGs" />;
  }

  if (user?.id && onboardingDone === false && !inOnboarding) {
    return <Redirect href="/(app)/onboarding" />;
  }

  if (buildings.length === 0 && !inOnboarding && !inSetup) {
    return <Redirect href="/(app)/onboarding/property" />;
  }

  return <>{children}</>;
}

export default function AppLayout() {
  return (
    <BuildingProvider>
      <AppGate>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.paper },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
          <Stack.Screen name="tenant/new" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="tenant/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="setup/building" />
          <Stack.Screen name="setup/rooms" />
          <Stack.Screen name="feedback" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="tickets" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="guests" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </AppGate>
    </BuildingProvider>
  );
}
