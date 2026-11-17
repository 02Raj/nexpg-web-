import { addTenant, fetchOccupancy } from '@/api/nexpg';
import { BedGrid } from '@/components/BedGrid';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { Field } from '@/components/Field';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { rpcMessage, todayIST } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useBuilding } from '@/providers/BuildingProvider';
import { colors } from '@/theme/tokens';
import { type } from '@/theme/type';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function AddTenantScreen() {
  const router = useRouter();
  const { bedId: bedParam } = useLocalSearchParams<{ bedId?: string }>();
  const { building } = useBuilding();
  const buildingId = building?.id ?? '';

  const occ = useQuery({
    queryKey: keys.occupancy(buildingId),
    queryFn: () => fetchOccupancy(buildingId),
    enabled: Boolean(buildingId),
  });

  const [bedId, setBedId] = useState<string | null>(bedParam ?? null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rent, setRent] = useState('');
  const [security, setSecurity] = useState('');
  const [join, setJoin] = useState(todayIST());
  const [showDate, setShowDate] = useState(false);

  const emptyBeds = useMemo(
    () => (occ.data ?? []).filter((b) => b.status === 'empty'),
    [occ.data],
  );

  useEffect(() => {
    if (emptyBeds.length === 1 && !bedId) {
      setBedId(emptyBeds[0].id);
    }
  }, [emptyBeds, bedId]);

  const mutate = useMutation({
    mutationFn: () =>
      addTenant({
        bedId: bedId!,
        fullName: name,
        phone,
        monthlyRent: Number(rent),
        securityAmount: Number(security),
        joinDate: join,
      }),
    onSuccess: async (id) => {
      await queryClient.invalidateQueries({ queryKey: keys.occupancy(buildingId) });
      await queryClient.invalidateQueries({ queryKey: keys.dashboard(buildingId) });
      await queryClient.invalidateQueries({ queryKey: keys.buildings });
      router.replace(`/(app)/tenant/${id}`);
    },
  });

  const canSubmit =
    Boolean(bedId) &&
    name.trim().length >= 2 &&
    phone.length === 10 &&
    Number(rent) > 0 &&
    Number(security) >= 0 &&
    !mutate.isPending;

  const disabledReason = !bedId
    ? emptyBeds.length === 0
      ? 'Add at least one room with beds before adding a tenant.'
      : 'Select an empty bed above.'
    : name.trim().length < 2
      ? 'Enter the tenant’s full name.'
      : phone.length !== 10
        ? 'Enter a valid 10-digit mobile number.'
        : !rent || Number(rent) <= 0
          ? 'Enter monthly rent greater than zero.'
          : security === '' || Number(security) < 0
            ? 'Enter the security deposit amount.'
            : null;

  if (!building || occ.isLoading) return <LoadingState />;

  return (
    <Screen scroll>
      <Pressable onPress={() => router.back()} style={{ paddingTop: 8, paddingBottom: 12 }}>
        <Text style={[type.small, { color: colors.ochreDeep }]}>Back</Text>
      </Pressable>
      <Text style={type.kicker}>Rent track</Text>
      <Text style={[type.display, { marginBottom: 8 }]}>Add tenant</Text>
      <Text style={[type.bodyMuted, { marginBottom: 18 }]}>
        The bed will be marked occupied. Security stays Held — rent is billed separately.
      </Text>

      <Text style={[type.section, { marginBottom: 12 }]}>Empty bed</Text>
      {emptyBeds.length === 0 ? (
        <View style={{ gap: 12, marginBottom: 8 }}>
          <Text style={type.bodyMuted}>
            No beds yet. A tenant must be assigned to a bed — add a room first.
          </Text>
          <Button
            label="Add room"
            variant="secondary"
            onPress={() => router.push('/(app)/(tabs)/more')}
          />
        </View>
      ) : (
        <BedGrid
          beds={emptyBeds}
          selectableEmpty
          selectedBedId={bedId}
          onSelect={(b) => setBedId(b.id)}
        />
      )}

      <View style={{ height: 22 }} />
      <Field label="Full name" value={name} onChangeText={setName} placeholder="Aman Verma" />
      <View style={{ height: 12 }} />
      <Field
        label="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholder="98XXXXXXXX"
        maxLength={10}
      />
      <View style={{ height: 12 }} />
      <Field
        label="Monthly rent (₹)"
        keyboardType="number-pad"
        value={rent}
        onChangeText={setRent}
        placeholder="8000"
      />
      <View style={{ height: 12 }} />
      <Field
        label="Security amount (₹)"
        keyboardType="number-pad"
        value={security}
        onChangeText={setSecurity}
        hint="Amount agreed with the tenant. Never included on rent invoices."
        placeholder="8000"
      />
      <View style={{ height: 12 }} />
      <Text style={styles.dateLabel}>Join date</Text>
      <Pressable onPress={() => setShowDate(true)} style={styles.dateBtn}>
        <Text style={type.body}>{join}</Text>
      </Pressable>
      {showDate ? (
        <DateTimePicker
          value={new Date(`${join}T00:00:00`)}
          mode="date"
          maximumDate={new Date()}
          onChange={(_, date) => {
            if (Platform.OS !== 'ios') setShowDate(false);
            if (date) setJoin(toISODate(date));
          }}
        />
      ) : null}

      <View style={{ height: 20 }} />
      <ErrorText message={mutate.error ? rpcMessage(mutate.error) : null} />
      {!canSubmit && disabledReason ? (
        <Text style={[type.small, { marginBottom: 10, color: colors.ochreDeep }]}>{disabledReason}</Text>
      ) : null}
      <Button
        label={mutate.isPending ? 'Saving…' : 'Occupy bed'}
        onPress={() => mutate.mutate()}
        disabled={!canSubmit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dateLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: colors.inkMuted,
    marginBottom: 6,
  },
  dateBtn: {
    minHeight: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
});
