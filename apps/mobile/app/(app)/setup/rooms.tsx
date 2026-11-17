import { addRoomWithBeds } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { Field } from '@/components/Field';
import { Screen } from '@/components/Screen';
import { rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { colors } from '@/theme/tokens';
import { type } from '@/theme/type';
import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function SetupRoomsScreen() {
  const router = useRouter();
  const { buildingId } = useLocalSearchParams<{ buildingId: string }>();
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

  return (
    <Screen scroll>
      <View style={{ paddingTop: 24, marginBottom: 18 }}>
        <Text style={type.kicker}>Layout</Text>
        <Text style={type.display}>Rooms & beds</Text>
        <Text style={[type.bodyMuted, { marginTop: 8 }]}>
          Room numbers and bed counts only — no sharing labels. {added ? `${added} room${added === 1 ? '' : 's'} added.` : ''}
        </Text>
      </View>
      <Field label="Room name" value={name} onChangeText={setName} />
      <View style={{ height: 12 }} />
      <Field label="Beds" keyboardType="number-pad" value={beds} onChangeText={setBeds} hint="1–8" />
      <View style={{ height: 16 }} />
      <ErrorText message={mutate.error ? rpcMessage(mutate.error) : null} />
      <Button
        label={mutate.isPending ? 'Adding…' : 'Add this room'}
        variant="secondary"
        onPress={() => mutate.mutate()}
        disabled={!buildingId || !name || mutate.isPending}
      />
      <View style={{ height: 12 }} />
      <Button
        label={added === 0 ? 'Skip for now' : 'Open dashboard'}
        onPress={() => router.replace('/(app)/(tabs)')}
      />
      <Text style={[type.small, { marginTop: 16, color: colors.inkFaint }]}>
        You can add more rooms later from the More tab.
      </Text>
    </Screen>
  );
}
