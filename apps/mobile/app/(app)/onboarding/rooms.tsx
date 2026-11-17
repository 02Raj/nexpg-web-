import { addRoomWithBeds } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { Field } from '@/components/Field';
import { OnboardingShell } from '@/components/OnboardingShell';
import { rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { type } from '@/theme/type';
import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function OnboardingRoomsScreen() {
  const router = useRouter();
  const { building } = useBuilding();
  const { buildingId: paramId } = useLocalSearchParams<{ buildingId?: string }>();
  const buildingId = paramId ?? building?.id ?? '';

  useEffect(() => {
    if (!buildingId) {
      router.replace('/(app)/onboarding/property');
    }
  }, [buildingId, router]);

  const [name, setName] = useState('101');
  const [beds, setBeds] = useState('2');
  const [added, setAdded] = useState(0);

  const mutate = useMutation({
    mutationFn: () => addRoomWithBeds(buildingId, name, Number(beds)),
    onSuccess: async () => {
      setAdded((n) => n + 1);
      setName((prev) => {
        const num = Number(prev);
        return Number.isFinite(num) ? String(num + 1) : prev;
      });
      await queryClient.invalidateQueries({ queryKey: keys.occupancy(buildingId) });
      await queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
      await queryClient.invalidateQueries({ queryKey: keys.buildings });
    },
  });

  const goNext = () => {
    router.replace('/(app)/onboarding/done');
  };

  return (
    <OnboardingShell
      step={3}
      title="Rooms & beds"
      subtitle="Add at least one room so you can assign tenants to beds. You can add more later from Settings."
      onSkip={goNext}
      skipLabel="Skip for now"
    >
      {added > 0 ? (
        <Text style={[type.small, { marginBottom: 12 }]}>
          {added} room{added === 1 ? '' : 's'} added.
        </Text>
      ) : null}
      <Field label="Room name" value={name} onChangeText={setName} placeholder="101" />
      <View style={{ height: 12 }} />
      <Field label="Beds in this room" keyboardType="number-pad" value={beds} onChangeText={setBeds} hint="1–8" />
      <View style={{ height: 16 }} />
      <ErrorText message={mutate.error ? rpcMessage(mutate.error) : null} />
      <Button
        label={mutate.isPending ? 'Adding…' : 'Add this room'}
        variant="secondary"
        onPress={() => mutate.mutate()}
        disabled={!buildingId || !name || mutate.isPending}
      />
      <View style={{ height: 12 }} />
      <Button label={added === 0 ? 'Continue without rooms' : 'Continue'} onPress={goNext} />
    </OnboardingShell>
  );
}
