import { createBuilding } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { Field } from '@/components/Field';
import { LocationFields } from '@/components/LocationFields';
import { OnboardingShell } from '@/components/OnboardingShell';
import { rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function OnboardingPropertyScreen() {
  const router = useRouter();
  const { buildings, selectBuilding } = useBuilding();
  const [name, setName] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [city, setCity] = useState('Noida');
  const [address, setAddress] = useState('');
  const [billing, setBilling] = useState('5');

  const mutate = useMutation({
    mutationFn: () =>
      createBuilding({
        name,
        city,
        state,
        address,
        billing_date: Number(billing),
      }),
    onSuccess: async (building) => {
      selectBuilding(building.id);
      await queryClient.invalidateQueries({ queryKey: keys.buildings });
      router.push({ pathname: '/(app)/onboarding/rooms', params: { buildingId: building.id } });
    },
  });

  const day = Number(billing);
  const valid =
    name.trim().length >= 2 &&
    city.trim().length >= 2 &&
    state.trim().length >= 2 &&
    day >= 1 &&
    day <= 28;

  const skip = () => {
    if (buildings[0]) {
      selectBuilding(buildings[0].id);
      router.push({ pathname: '/(app)/onboarding/rooms', params: { buildingId: buildings[0].id } });
      return;
    }
    router.push('/(app)/onboarding/rooms');
  };

  return (
    <OnboardingShell
      step={2}
      title="Your PG property"
      subtitle="Works across India — pick a popular city or type your own. Same data syncs on web and mobile."
      onSkip={buildings.length > 0 ? skip : undefined}
      skipLabel="Skip"
    >
      <Field label="PG name" value={name} onChangeText={setName} placeholder="Sunrise PG" />
      <LocationFields
        state={state}
        city={city}
        address={address}
        onStateChange={setState}
        onCityChange={setCity}
        onAddressChange={setAddress}
      />
      <Field
        label="Billing date (1–28)"
        keyboardType="number-pad"
        value={billing}
        onChangeText={setBilling}
        hint="Rent invoices for all active tenants are generated on this day each month."
      />
      <View style={{ height: 20 }} />
      <ErrorText message={mutate.error ? rpcMessage(mutate.error) : null} />
      <Button
        label={mutate.isPending ? 'Saving…' : 'Continue'}
        onPress={() => mutate.mutate()}
        disabled={!valid || mutate.isPending}
      />
    </OnboardingShell>
  );
}
