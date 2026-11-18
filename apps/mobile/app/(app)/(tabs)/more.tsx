import { addRoomWithBeds, fetchRefundDue, markSecurityRefunded, updateBillingDate } from '@/api/nexpg';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { Field } from '@/components/Field';
import { Screen } from '@/components/Screen';
import { inr, rpcMessage } from '@/lib/format';
import { keys, queryClient } from '@/lib/query';
import { useAuth } from '@/providers/AuthProvider';
import { useBuilding } from '@/providers/BuildingProvider';
import { colors, radius } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { type } from '@/theme/type';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function MoreScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { building } = useBuilding();
  const [billing, setBilling] = useState(String(building?.billing_date ?? 5));
  const [roomName, setRoomName] = useState('');
  const [beds, setBeds] = useState('2');
  const [msg, setMsg] = useState<string | null>(null);

  const refunds = useQuery({
    queryKey: ['refunds', building?.id],
    queryFn: () => fetchRefundDue(building!.id),
    enabled: Boolean(building?.id),
  });

  const saveBilling = useMutation({
    mutationFn: () => updateBillingDate(building!.id, Number(billing)),
    onSuccess: () => {
      setMsg('Billing date saved. Bills auto-create on this day (IST).');
      queryClient.invalidateQueries({ queryKey: keys.buildings });
    },
  });

  const addRoom = useMutation({
    mutationFn: () => addRoomWithBeds(building!.id, roomName, Number(beds)),
    onSuccess: () => {
      setRoomName('');
      setMsg('Room added.');
      queryClient.invalidateQueries({ queryKey: keys.occupancy(building!.id) });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(building!.id) });
    },
  });

  const refund = useMutation({
    mutationFn: (id: string) => markSecurityRefunded(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds', building?.id] });
      queryClient.invalidateQueries({ queryKey: keys.dashboard(building!.id) });
    },
  });

  if (!building) return null;

  return (
    <Screen scroll>
      <View style={{ paddingTop: 16, marginBottom: 20 }}>
        <Text style={type.kicker}>Settings</Text>
        <Text style={type.display}>House rules.</Text>
        <Text style={[type.small, { marginTop: 6 }]}>{user?.email}</Text>
      </View>

      <Text style={type.section}>Billing date</Text>
      <Text style={[type.bodyMuted, { marginVertical: 8 }]}>
        On this day each month, rent invoices are generated for all active tenants. Security deposits are tracked separately.
      </Text>
      <Field
        label="Day of month (1–28)"
        keyboardType="number-pad"
        value={billing}
        onChangeText={setBilling}
      />
      <Button
        label="Save billing date"
        variant="ghost"
        onPress={() => saveBilling.mutate()}
        disabled={saveBilling.isPending}
        style={{ marginTop: 10 }}
      />

      <View style={styles.hr} />

      <Text style={type.section}>Add a room</Text>
      <View style={{ height: 10 }} />
      <Field label="Room name" value={roomName} onChangeText={setRoomName} placeholder="101" />
      <View style={{ height: 10 }} />
      <Field label="Beds in this room" keyboardType="number-pad" value={beds} onChangeText={setBeds} hint="1 to 8" />
      <Button
        label={addRoom.isPending ? 'Adding…' : 'Add room'}
        onPress={() => addRoom.mutate()}
        disabled={!roomName || addRoom.isPending}
        style={{ marginTop: 12 }}
      />

      <View style={styles.hr} />

      <Text style={type.section}>Security refund due</Text>
      <Text style={[type.bodyMuted, { marginVertical: 8 }]}>Shown after a tenant vacates. Never mixed with rent invoices.</Text>
      {(refunds.data ?? []).length === 0 ? (
        <Text style={type.small}>No refunds pending.</Text>
      ) : (
        (refunds.data ?? []).map((d) => (
          <View key={d.id} style={styles.refund}>
            <View>
              <Text style={styles.rName}>{d.tenant_name}</Text>
              <Text style={styles.rAmt}>{inr(d.amount)}</Text>
            </View>
            <Pressable onPress={() => refund.mutate(d.id)} style={styles.refundBtn}>
              <Text style={styles.refundBtnText}>Mark refunded</Text>
            </Pressable>
          </View>
        ))
      )}

      <View style={styles.hr} />

      <Text style={type.section}>Operations</Text>
      <Text style={[type.bodyMuted, { marginVertical: 8 }]}>Tickets and guest stays stay synced with your owner console.</Text>
      <View style={{ gap: 10 }}>
        <Button label="Support tickets" variant="secondary" onPress={() => router.push('/(app)/tickets')} />
        <Button label="Guest & short stays" variant="secondary" onPress={() => router.push('/(app)/guests')} />
      </View>

      <View style={styles.hr} />

      <Text style={type.section}>Feedback</Text>
      <Text style={[type.bodyMuted, { marginVertical: 8 }]}>
        Bug, feature idea, or something feels hectic — we read every note.
      </Text>
      <Button label="Send feedback" variant="secondary" onPress={() => router.push('/(app)/feedback')} />

      <View style={styles.hr} />
      <Button label="Add another PG" variant="secondary" onPress={() => router.push('/(app)/setup/building')} />
      <View style={{ height: 12 }} />
      <Button label="Sign out" variant="ghost" onPress={() => signOut()} />
      <View style={{ height: 12 }} />
      <ErrorText
        message={
          saveBilling.error || addRoom.error || refund.error
            ? rpcMessage(saveBilling.error || addRoom.error || refund.error)
            : msg
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hr: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 24,
  },
  refund: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rName: {
    fontFamily: fonts.bodySemi,
    color: colors.ink,
  },
  rAmt: {
    fontFamily: fonts.mono,
    color: colors.red,
    marginTop: 2,
  },
  refundBtn: {
    backgroundColor: colors.ochreSoft,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  refundBtnText: {
    fontFamily: fonts.bodyMedium,
    color: colors.ochreDeep,
    fontSize: 12,
  },
});
