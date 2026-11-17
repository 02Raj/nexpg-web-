import { createBuilding } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { Field } from '@/components/Field';
import { LocationFields } from '@/components/LocationFields';
import { Screen } from '@/components/Screen';
import { rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { colors } from '@/theme/tokens';
import { type } from '@/theme/type';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function SetupBuildingScreen() {
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
      router.replace({ pathname: '/(app)/setup/rooms', params: { buildingId: building.id } });
    },
  });

  const day = Number(billing);
  const valid =
    name.trim().length >= 2 &&
    city.trim().length >= 2 &&
    state.trim().length >= 2 &&
    day >= 1 &&
    day <= 28;

  return (
    <Screen scroll>
      {buildings.length > 0 ? (
        <Pressable onPress={() => router.back()} style={{ paddingTop: 8 }}>
          <Text style={[type.small, { color: colors.ochreDeep }]}>Back</Text>
        </Pressable>
      ) : null}
      <View style={{ paddingTop: 20, marginBottom: 22 }}>
        <Text style={type.kicker}>Property</Text>
        <Text style={type.display}>Name, location,{'\n'}billing date.</Text>
      </View>
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
    </Screen>
  );
}
